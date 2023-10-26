import datetime
import json
import random
from flask import Flask, request
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
ITEMS_PER_PAGE = 20


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


@app.route("/api/pokemon/list", methods=["GET"])
def get_pokemon_list():
    # Получить параметры запроса
    search_query = request.args.get("filters", default="", type=str)
    page = request.args.get("page", default=1, type=int)

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

    # Вернуть результат
    return {
        "count": count,
        "num_pages": num_pages,
        "data": data,
        "page": page,
        "search_query": search_query,
    }

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

    return {
        "pkmn_user": pkmn_user, 
        "pkmn_enemy": pkmn_enemy
    }


if __name__ == "__main__":
    app.run(debug=True, port=5328)
