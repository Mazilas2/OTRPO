"""Приложение Flask"""
import json
import requests
import datetime
from flask import Flask, render_template

app = Flask(__name__)
ITEMS_PER_PAGE = 20


def get_data(url):
    """Получить данные по url"""
    response = requests.get(url, timeout=5)
    return json.loads(response.text)


@app.route("/")
@app.route("/<int:page>")
def main(page=1):
    """Главная страница с пагинацией"""
    # Check in config file last time of update
    # If last time of update is more than 24 hours
    # then update data from API
    # else use data from config file
    config_path = "config.json"
    # If file not exist then create it
    try:
        with open(config_path, "r", encoding="utf-8") as file:
            config = json.load(file)
    except FileNotFoundError:
        with open(config_path, "w", encoding="utf-8") as file:
            config = {"last_update": "2021-01-01 00:00:00"}
            json.dump(config, file)
    # Check last update time
    last_update = config["last_update"]
    now = datetime.datetime.now()
    last_update_datetime = datetime.datetime.strptime(last_update, "%Y-%m-%d %H:%M:%S")
    # If last update was more than 24 hours ago
    # then update count of pokemons from API
    # and save it to config file
    # Also update pokemons data from API
    if (now - last_update_datetime).days > 0:
        url_count = 'https://pokeapi.co/api/v2/pokemon'
        count = get_data(url_count)["count"]
        config["count"] = count
        config["last_update"] = now.strftime("%Y-%m-%d %H:%M:%S")
        url = f'https://pokeapi.co/api/v2/pokemon?limit={count}&offset=0'
        data = get_data(url)["results"]
        # For each pokemon add them index (number in list)
        for index, pkmn in enumerate(data):
            pkmn["index"] = index + 1
            pkmn["img_url"] = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pkmn['url'].split('/')[-2]}.png"
        config["data"] = data
        with open(config_path, "w", encoding="utf-8") as file:
            json.dump(config, file)
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


