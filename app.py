"""Приложение Flask"""
import json
import requests
from flask import Flask, render_template

app = Flask(__name__)


def get_data(url):
    """Получить данные по url"""
    response = requests.get(url, timeout=5)
    return json.loads(response.text)


@app.route("/")
def main():
    """Главная страница"""
    url_count = 'https://pokeapi.co/api/v2/pokemon'
    count = get_data(url_count)["count"]
    url = f'https://pokeapi.co/api/v2/pokemon?limit={count}&offset=0'
    data = get_data(url)["results"]
    return render_template("index.html", data=data)


@app.route('/<name>')
def pokemon(name):
    """Получить данные по имени покемона"""
    pokemon_name = name.capitalize()
    return render_template("pokemon.html", title=pokemon_name)


