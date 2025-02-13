# Handles database stuff

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from sqlalchemy.orm import Session
from Backend.models import User, Rating
from fastapi import HTTPException
import numpy as np
import datetime


DATABASE_URL = "sqlite:///./Backend/database.db"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



def create_user(db: Session, username, password):
    user_in_db = db.query(User).filter(User.username==username, User.password==password).first()
    if not user_in_db:
        random_id = np.random.randint(999999, 9999999)
        new_user = User(user_id=random_id, username=username, password=password)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    user_in_db = db.query(User).filter(User.username==username, User.password==password).first()
    return user_in_db


def add_rating(db: Session, user_id, movie_id, rating):
    rating_in_db = db.query(Rating).filter(Rating.user_id==user_id, Rating.movie_id==movie_id).first()
    if not rating_in_db:
        new_rating = Rating(user_id=user_id, movie_id=movie_id, rating=rating, timestamp=datetime.datetime.now())
        db.add(new_rating)
        db.commit()
    else:
        rating_in_db.rating = rating
        rating_in_db.timestamp = datetime.datetime.now()
        db.commit()
    return db.query(Rating).filter(Rating.user_id==user_id, Rating.movie_id==movie_id).first()


def fetch_ratings(db: Session, user_id):
    ratings = db.query(Rating).filter(Rating.user_id == user_id).all()
    return ratings
    
    
