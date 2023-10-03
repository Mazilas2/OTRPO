"""Приложение Flask"""
import json
import datetime
import requests
from flask import Flask, render_template

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

# Create def for checking is update needed


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
    # For each pokemon add them index (number in list) and image url
    for index, pkmn in enumerate(data):
        pkmn["index"] = index + 1
        img_base = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
        pkmn_id = pkmn['url'].split('/')[-2]
        pkmn["img_url"] = f"{img_base}{pkmn_id}.png"
    config["data"] = data
    # Save data to config file
    save_config(config, config_path)


@app.route("/", defaults={"page": 1})
@app.route("/<int:page>")
def main(page=1):
    """Главная страница с пагинацией"""
    config = get_config()
    if check_update(config):
        update_data(config)
    # Get data from config file
    count = config["count"]
    # Get page number from url
    if page:
        page = page - 1
    data = config["data"][page * ITEMS_PER_PAGE: (page + 1) * ITEMS_PER_PAGE]
    # Get count of pages
    num_pages = count // ITEMS_PER_PAGE
    return render_template("index.html", data=data, num_pages=num_pages, page=page + 1)


@app.route('/<name>')
def pokemon(name):
    """Получить данные по имени покемона"""
    pokemon_name = name.capitalize()
    return render_template("pokemon.html", title=pokemon_name)
