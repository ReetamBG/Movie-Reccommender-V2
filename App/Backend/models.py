# Defines sqlalchemy models

from Backend.base import Base
from sqlalchemy import Column, Integer, String, Float, DateTime

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String)
    password = Column(String)


class Rating(Base):
    __tablename__ = "ratings"

    user_id = Column(Integer, primary_key=True)
    movie_id = Column(Integer, primary_key=True)
    rating = Column(Float)
    timestamp = Column(DateTime)