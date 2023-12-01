import datetime
from io import BytesIO
import json
import random
import collections
import os
import time

collections.Iterable = collections.abc.Iterable
from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

import logging

logging.getLogger("sqlalchemy").setLevel(logging.ERROR)

from sqlalchemy import Float, create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy import Column, Integer, String, inspect, DateTime

import smtplib
import ssl
from email.message import EmailMessage

from ftplib import FTP

from dotenv import load_dotenv

from upstash_redis import Redis

app = Flask(__name__)
CORS(
    app,
    origins="*",
    supports_credentials=True,
    allow_headers=["Content-Type"],
)
ITEMS_PER_PAGE = 20

DATABASE_PATH = "sqlite:///pokemons.db"
engine = create_engine(DATABASE_PATH, echo=True)
Session = sessionmaker(bind=engine)

load_dotenv()


class Base(DeclarativeBase):
    """Базовый класс для работы с таблицами"""

    pass


class Results(Base):
    """Класс для работы с таблицей результатов"""

    __tablename__ = "results"
    id = Column(Integer, primary_key=True)
    user_pkmn = Column(String)
    enemy_pkmn = Column(String)
    winner = Column(String)
    time = Column(DateTime, default=datetime.datetime.utcnow)


class PokemonRatings(Base):
    """Класс для работы с таблицей рейтингов покемонов"""

    __tablename__ = "pokemon_ratings"
    id = Column(Integer, primary_key=True)
    pokemon_name = Column(String)
    rating = Column(Float)
    time = Column(DateTime, default=datetime.datetime.utcnow)


def get_data(url):
    """Получить данные по url"""
    response = requests.get(url, timeout=5)
    return json.loads(response.text)


def get_config(path="config.json"):
    """Получить данные из конфигурационного файла"""
    try:
        with open(path, "r", encoding="utf-8") as file:
            config = json.load(file)
    except FileNotFoundError:
        config = {"last_update": "2021-01-01 00:00:00"}
        with open(path, "w", encoding="utf-8") as file:
            json.dump(config, file)
    return config


def save_config(config, path="config.json"):
    """Сохранить данные в конфигурационный файл"""
    with open(path, "w", encoding="utf-8") as file:
        json.dump(config, file)


def check_update(config):
    """Проверить, нужно ли обновлять данные"""
    now = datetime.datetime.now()
    last_update = config["last_update"]
    last_update_datetime = datetime.datetime.strptime(last_update, "%Y-%m-%d %H:%M:%S")
    return (now - last_update_datetime).days > 0


def update_data(config, config_path="config.json"):
    """Обновить данные"""
    now = datetime.datetime.now()
    url_count = "https://pokeapi.co/api/v2/pokemon"
    count = get_data(url_count)["count"]
    config["count"] = count
    config["last_update"] = now.strftime("%Y-%m-%d %H:%M:%S")
    url = f"https://pokeapi.co/api/v2/pokemon?limit={count}&offset=0"
    data = get_data(url)["results"]
    for index, pkmn in enumerate(data):
        pkmn["index"] = index + 1
        img_base = (
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
        )
        pkmn_id = pkmn["url"].split("/")[-2]
        pkmn["img_url"] = f"{img_base}{pkmn_id}.png"
    config["data"] = data
    save_config(config, config_path)


def update_pokemon_data(data, config):
    """Обновить данные по покемонам (stats, types)"""
    for pkmn in data:
        if "stats" not in pkmn:
            pkmn_data = get_data(pkmn["url"])
            pkmn["stats"] = {}
            for stat in pkmn_data["stats"]:
                stat_name = stat["stat"]["name"]
                base_stat = stat["base_stat"]
                pkmn["stats"][stat_name] = base_stat
            pkmn["types"] = []
            for pkmn_type in pkmn_data["types"]:
                pkmn["types"].append(pkmn_type["type"]["name"])
            save_config(config)
    return data


def saveToSql(user_pkmn, enemy_pkmn, winner):
    """Сохранить результаты боя в базу данных"""
    try:
        with Session(autoflush=False, bind=engine) as db:
            result = Results(user_pkmn=user_pkmn, enemy_pkmn=enemy_pkmn, winner=winner)
            db.add(result)
            db.commit()

            return "Data saved successfully."

    except Exception as e:
        return f"Error: {str(e)}"


@app.route("/api/pokemon/list", methods=["GET"])
def get_pokemon_list():
    """Получить список покемонов"""
    # Получить параметры запроса
    search_query = request.args.get("filters", default="", type=str)
    page = request.args.get("page", default=1, type=int)

    # Check in redis if the data is cached
    redis = Redis(url=os.environ.get("REDIS_URL"), token=os.environ.get("REDIS_TOKEN"))

    key = f"pokemon_list_{search_query}_{page}"
    key_validate = f"last_cache_validation_key_{search_query}_{page}"
    cached_data = redis.get(key)

    if cached_data:
        # Check when the data was cached
        last_validation_time = redis.get(key_validate)
        # Check if hour passes since the last cache
        if (
            datetime.datetime.now()
            - datetime.datetime.fromisoformat(last_validation_time)
        ) < datetime.timedelta(hours=1):
            print("DATA FOUND IN CACHE", key)
            print(
                "TIME SINCE LAST CACHE",
                datetime.datetime.now()
                - datetime.datetime.fromisoformat(last_validation_time),
            )
            return cached_data

    # Получить данные
    config = get_config()
    if check_update(config):
        update_data(config)
    data = config["data"]

    # Фильтрация данных по запросу
    if search_query:
        data = list(filter(lambda x: search_query.lower() in x["name"].lower(), data))

    # Пагинация
    count = len(data)
    num_pages = (len(data) // ITEMS_PER_PAGE) + 1

    # Получить данные для текущей страницы
    data = data[(page - 1) * ITEMS_PER_PAGE : page * ITEMS_PER_PAGE]

    # Обновить данные по покемонам (stats, types)
    data = update_pokemon_data(data, config)

    res = {
        "count": count,
        "num_pages": num_pages,
        "data": data,
        "page": page,
        "search_query": search_query,
    }

    # Cache the data in redis
    redis.set(key, res)
    redis.set(key_validate, datetime.datetime.now().isoformat())

    # Вернуть результат
    return jsonify(res)


@app.route("/api/pokemon/getId", methods=["GET"])
def get_pokemon_id():
    """Получить id покемона по имени"""
    # Получить параметры запроса
    name = request.args.get("name", type=str)

    # Обработать ошибки
    if not name:
        return {"error": "Не указано имя"}, 400

    # Получить данные
    config = get_config()
    if check_update(config):
        update_data(config)

    # Получить данные по покемону
    data = config["data"]
    for pkmn in data:
        if pkmn["name"] == name:
            return {"id": pkmn["index"]}

    # Обработать ошибку (покемон не найден)
    return {"error": "Покемон не найден"}, 400


@app.route("/api/pokemon/", methods=["GET"])
def get_pokemon():
    """Получить данные по покемону"""
    # Получить параметры запроса
    id = request.args.get("id", type=int)

    # Обработать ошибки
    if not id:
        return {"error": "Не указан id"}, 400
    if id < 1:
        return {"error": "id должен быть больше 0"}, 400

    # Получить данные
    config = get_config()
    if check_update(config):
        update_data(config)

    # Обработать ошибку (id больше количества покемонов)
    if id > config["count"]:
        return {"error": "Покемона с таким id не существует"}, 400

    # Получить данные по покемону
    data = config["data"][id - 1]

    # Обновить данные по покемону (stats, types)
    data = update_pokemon_data([data], config)

    # Вернуть результат
    return data


@app.route("/api/pokemon/random", methods=["GET"])
def get_pokemon_rnd():
    """Получить данные по случайному покемону"""
    # Получить данные
    config = get_config()
    if check_update(config):
        update_data(config)

    # Получить данные по случайному покемону
    data = config["data"][random.randint(0, config["count"] - 1)]

    # Обновить данные по покемону (stats, types)
    data = update_pokemon_data([data], config)

    # Вернуть результат
    return data


@app.route("/api/pokemon/image", methods=["GET"])
def get_pokemon_image():
    """Получить изображение покемона"""
    # Получить параметры запроса
    name = request.args.get("name", type=str)

    # Обработать ошибки
    if not name:
        return {"error": "Не указано имя"}, 400

    # Получить данные
    config = get_config()
    if check_update(config):
        update_data(config)

    # Получить данные по покемону
    data = config["data"]
    for pkmn in data:
        if pkmn["name"] == name:
            return {"img_url": pkmn["img_url"]}

    # Обработать ошибку (покемон не найден)
    return {"error": "Покемон не найден"}, 400


@app.route("/api/fight", methods=["GET"])
def get_pokemon_fight_stats():
    """Получить информацию о покемонах пользователя и противника"""
    # Получить параметры запроса
    id_pokemon_user = request.args.get("id_pokemon_user", type=int)
    id_pokemon_enemy = request.args.get("id_pokemon_enemy", type=int)

    # Обработать ошибки
    if not id_pokemon_user:
        return {"error": "Не указан id покемона пользователя"}
    if not id_pokemon_enemy:
        return {"error": "Не указан id покемона противника"}

    # Получить данные
    config = get_config()
    if check_update(config):
        update_data(config)

    # Получить информацию о покемоне
    pkmn_user = config["data"][id_pokemon_user]
    pkmn_enemy = config["data"][id_pokemon_enemy]

    # Обновить данные по покемону (stats, types)
    pkmn_user = update_pokemon_data([pkmn_user], config)
    pkmn_enemy = update_pokemon_data([pkmn_enemy], config)

    return {"pkmn_user": pkmn_user, "pkmn_enemy": pkmn_enemy}


@app.route("/api/fight/", methods=["POST"])
def attack():
    """Получить атакующего"""
    # Получить параметры запроса
    data = request.get_json()
    user_attack = data.get("user_attack")

    # Обработать ошибки
    if not user_attack:
        return {"error": "Не указана атака пользователя"}

    # Решить кто атакует
    computer_attack = random.randint(0, 10)
    if int(user_attack) % 2 == computer_attack % 2:
        # Атакует пользователь
        return {"isAttackUser": True}
    else:
        # Атакует компьютер
        return {"isAttackUser": False}


@app.route("/api/fight/fast", methods=["GET"])
def fast_fight():
    """Быстрый бой"""
    user_pokemon_hp = int(request.args.get("usr_hp"))
    enemy_pokemon_hp = int(request.args.get("enm_hp"))
    while user_pokemon_hp > 0 and enemy_pokemon_hp > 0:
        user_pokemon_damage = int(request.args.get("usr_dmg"))
        user_pokemon_damage = int(request.args.get("enm_dmg"))

        user_attack = random.randint(0, 10)
        computer_attack = random.randint(0, 10)

        if int(user_attack) % 2 == computer_attack % 2:
            # Атакует пользователь
            enemy_pokemon_hp -= user_pokemon_damage
        else:
            # Атакует компьютер
            user_pokemon_hp -= user_pokemon_damage

    if user_pokemon_hp <= 0:
        return jsonify({"Winner": "Enemy"})
    if enemy_pokemon_hp <= 0:
        return jsonify({"Winner": "User"})


@app.route("/api/fight/save_result", methods=["POST"])
def save_fight_result():
    """Сохранить результаты боя"""
    # Get the JSON data from the request
    data = request.get_json()

    # Extract the relevant information from the JSON data
    user_pkmn = data.get("user_pkmn")
    enemy_pkmn = data.get("enemy_pkmn")
    winner = data.get("winner")

    # Check if the required data is provided
    if user_pkmn is None or enemy_pkmn is None or winner is None:
        return jsonify({"error": "Missing data in the request"}), 400

    # Save the fight result to the database
    result = saveToSql(user_pkmn, enemy_pkmn, winner)

    return jsonify({"message": result})


@app.route("/api/send_fast_fight_result", methods=["POST"])
def send_fast_fight_result():
    """Отправить результаты боя на почту"""
    # Get the email address from the request body
    data = request.get_json()
    email_receiver = data.get("email")
    winner = data.get("winner")

    if not email_receiver:
        return jsonify({"error": "Email is required"}), 400

    sender_email = os.environ.get("SENDER_EMAIL")
    sender_password = os.environ.get("SENDER_PASSWORD")

    subject = "Fast Fight Results"
    body = f"Winner: {winner}"

    em = EmailMessage()
    em["From"] = sender_email
    em["To"] = email_receiver
    em["Subject"] = subject
    em.set_content(body)

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
        smtp.login(sender_email, sender_password)
        smtp.sendmail(sender_email, email_receiver, em.as_string())

    return jsonify({"message": body})


def login_FTP():
    ftp = FTP(os.environ.get("FTP_HOST"))
    ftp.login(
        user=os.environ.get("FTP_USER"),
        passwd=os.environ.get("FTP_PASSWORD"),
    )
    return ftp


def get_ftp_file_list():
    """Получить список файлов на FTP-сервере"""
    # Укажите данные для подключения к вашему FTP-серверу
    ftp = login_FTP()

    ftp.cwd("htdocs")

    # Получите список файлов
    files = ftp.nlst()

    # Закройте соединение с FTP
    ftp.quit()

    return files


def create_Markdown(data):
    """Создать Markdown-текст для покемона"""
    markdown_text = f"**Name:** {data['name']}\n"
    markdown_text += f"![Image]({data['img_url']})\n"
    markdown_text += f"**Types:** {', '.join(data['types'])}\n"
    markdown_text += "**Stats:**\n"
    for stat, value in data["stats"].items():
        markdown_text += f"- **{stat.capitalize()}:** {value}\n"
    return markdown_text


def send_ftp(file_list, data):
    """Отправить Markdown-файл на FTP-сервер"""
    current_datetime = datetime.datetime.now()
    folder_name = current_datetime.strftime("%Y%m%d")

    ftp = login_FTP()

    if folder_name in file_list:
        ftp.cwd("htdocs")
        ftp.cwd(folder_name)
    else:
        ftp.cwd("htdocs")
        ftp.mkd(folder_name)
        ftp.cwd(folder_name)
    markdown = create_Markdown(data)
    buffer = BytesIO(markdown.encode("utf-8"))
    ftp.storbinary(f"STOR {data['name']}.md", buffer)
    ftp.quit()
    return jsonify({"message": "OK"})


@app.route("/api/getFtpFiles", methods=["GET"])
def get_ftp_files():
    """Получить список файлов на FTP-сервере"""
    file_list = get_ftp_file_list()
    return jsonify({"files": file_list})


@app.route("/api/sendFtpFile", methods=["POST"])
def send_ftp_files():
    """Отправить Markdown-файл на FTP-сервер"""
    data = request.get_json()
    dataPokemon = data.get("Pokemon")
    file_list = get_ftp_file_list()
    return send_ftp(file_list, dataPokemon)


@app.route("/api/get_ratings", methods=["GET"])
def get_ratings():
    """Получить рейтинги покемонов"""
    from create_db import PokemonRatings

    # Get the name of the Pokémon from the query parameter
    pokemon_name = request.args.get("name")

    if not pokemon_name:
        return jsonify({"error": "Pokemon name is required"}), 400

    # Query the database to get ratings for the specified Pokémon
    with Session(autoflush=False, bind=engine) as db:
        ratings = db.query(PokemonRatings).filter_by(pokemon_name=pokemon_name).all()

        # Extract only the rating values into a list
        rating_list = [rating.rating for rating in ratings]

        return jsonify({"ratings": rating_list})


@app.route("/api/sendReview", methods=["POST"])
def send_review():
    """Отправить рейтинг покемона"""
    data = request.get_json()
    # Extract the review data from the request JSON
    rating = data.get("rating")
    pokemon_name = data.get("pokemon")

    with Session(autoflush=False, bind=engine) as db:
        pokemon_rating = PokemonRatings(
            pokemon_name=pokemon_name, rating=rating, time=datetime.datetime.now()
        )

        db.add(pokemon_rating)
        db.commit()

    return jsonify({"Message": "OK"})


if __name__ == "__main__":
    app.run(debug=True, port=5328)
