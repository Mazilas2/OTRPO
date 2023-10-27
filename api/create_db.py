import datetime
import os

from sqlalchemy import DateTime, create_engine
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


def create_database_and_tables():
    inspector = inspect(engine)
    if not inspector.has_table("results"):
        Base.metadata.create_all(engine)
        print("База данных и таблица созданы")


if __name__ == "__main__":
    create_database_and_tables()
