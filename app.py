"""Приложение Flask"""
import json
import datetime
import random
import requests
import psycopg2
from flask import Flask, render_template, request

app = Flask(__name__)
ITEMS_PER_PAGE = 20
now = datetime.datetime.now()


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
    last_update = config["last_update"]
    last_update_datetime = datetime.datetime.strptime(
        last_update, "%Y-%m-%d %H:%M:%S")
    return (now - last_update_datetime).days > 0


def update_data(config, config_path="config.json"):
    """Обновить данные"""
    url_count = 'https://pokeapi.co/api/v2/pokemon'
    count = get_data(url_count)["count"]
    config["count"] = count
    config["last_update"] = now.strftime("%Y-%m-%d %H:%M:%S")
    url = f'https://pokeapi.co/api/v2/pokemon?limit={count}&offset=0'
    data = get_data(url)["results"]
    for index, pkmn in enumerate(data):
        pkmn["index"] = index + 1
        img_base = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
        pkmn_id = pkmn['url'].split('/')[-2]
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


@app.route("/", defaults={"page": 1, "search_query": ""})
@app.route("/<int:page>", defaults={"search_query": ""})
@app.route("/search/<search_query>/<int:page>")
@app.route("/search/1")
def main(page=1, search_query=""):
    """Главная страница с пагинацией"""
    config = get_config()
    if check_update(config):
        update_data(config)
    if page:
        page = page - 1
    if search_query:
        data = list(filter(lambda x: search_query.lower()
                    in x["name"].lower(), config["data"]))
        count = len(data)
        print(len(data))
        num_pages = (len(data) // ITEMS_PER_PAGE) + 1
        data = data[page * ITEMS_PER_PAGE: (page+1) * ITEMS_PER_PAGE]
        data = update_pokemon_data(data, config)
    else:
        data = config["data"][page *
                              ITEMS_PER_PAGE: (page + 1) * ITEMS_PER_PAGE]
        data = update_pokemon_data(data, config)
        count = config["count"]
    num_pages = count // ITEMS_PER_PAGE
    if count % ITEMS_PER_PAGE:
        num_pages += 1
    return render_template("index.html", data=data, num_pages=num_pages, page=page + 1, search_query=search_query)


@app.route('/<name>')
def pokemon(name):
    """Получить данные по имени покемона"""
    pokemon_name = name.capitalize()
    return render_template("pokemon.html", title=pokemon_name)


@app.route('/fight')
def fight():
    """Получить данные по имени покемона"""
    config = get_config()
    rnd_pkmn = random.choice(config["data"])
    pkmn_name = rnd_pkmn["name"]
    return render_template("fight.html", pkmn_name=pkmn_name)


@app.route('/get_pokemon', methods=['GET'])
def get_pokemon():
    """Получить данные по имени покемона"""
    pokemon_name = request.args.get('pokemon_name')
    config = get_config()
    if check_update(config):
        update_data(config)
    data = config["data"]
    pkmn = []
    for p in data:
        if p["name"] == pokemon_name:
            pkmn = p
            break
    return update_pokemon_data([pkmn], config)


@app.route('/save_winner', methods=['POST'])
def save_winner():
    """Сохранить победителя"""
    winner = request.json['winner']
    # Handle saving the winner to your data store or perform any other necessary actions
    # ...
    # Connect to database
    try:
        connection = psycopg2.connect(
            host="your_host",
            port="your_port",
            database="your_database",
            user="your_username",
            password="your_password"
        )
        cursor = connection.cursor()
        query = "INSERT INTO results (winner) VALUES (%s)"
        cursor.execute(query, (winner,))
        connection.commit()
        print("Winner saved successfully")
        return json.dumps({"response": "ok"})

    except (Exception, psycopg2.Error) as error:
        print("Error saving winner:", error)
