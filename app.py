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
    url = 'https://pokeapi.co/api/v2/pokemon?limit=1500&offset=0'
    data = get_data(url)["results"]
    return render_template("index.html", data=data)
