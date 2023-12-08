import datetime
import os
import random
import requests

from sqlalchemy import DateTime, Float, create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy import Column, Integer, String, inspect

DATABASE_PATH = "sqlite:///pokemons.db"
engine = create_engine(DATABASE_PATH, echo=True)
Session = sessionmaker(bind=engine)


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
    rounds = Column(Integer)


class PokemonRatings(Base):
    """Класс для работы с таблицей рейтингов покемонов"""

    __tablename__ = "pokemon_ratings"
    id = Column(Integer, primary_key=True)
    pokemon_name = Column(String)
    rating = Column(Float)
    time = Column(DateTime, default=datetime.datetime.utcnow)

class Users(Base):
    """Класс для работы с таблицей пользователей"""

    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    user_name = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    github_email = Column(String, unique=True, nullable=True)
    tfa_secret = Column(String, unique=False, nullable=True)


def create_database_and_tables():
    inspector = inspect(engine)
    if not inspector.has_table("results"):
        Base.metadata.create_all(engine)
        print("База данных и таблица созданы")
        fill_database()

def fill_database():
    print("INSERTING VALUES TO DB")
    session = Session()
    print("INSERT USER test-test-test")
    user = Users(user_name="test", email="test", password="test")
    session.add(user)
    session.commit()

    response = requests.get("https://pokeapi.co/api/v2/pokemon?limit=10000")
    pokemon_names = [item['name'] for item in response.json()['results']]

    # Insert 5000 random results
    for _ in range(5000):
        user_pkmn = random.choice(pokemon_names)
        enemy_pkmn = random.choice(pokemon_names)
        winner = random.choice(["User", "Computer"])
        time = datetime.datetime(2023, random.randint(1, 12), random.randint(1, 28))  # Random date in 2023
        rounds = random.randint(2,20)
        result = Results(user_pkmn=user_pkmn, enemy_pkmn=enemy_pkmn, winner=winner, time=time, rounds=rounds)
        session.add(result)

    session.commit()
    session.close()



if __name__ == "__main__":
    create_database_and_tables()
