from fastapi import APIRouter, Depends, Body, Query
from typing import Annotated
from sqlalchemy.orm import Session
from Backend import database

router = APIRouter()

@router.post("/login")
def login(
    username: Annotated[str, Body()],
    password: Annotated[str, Body()], 
    db: Session=Depends(database.get_db)
):
    print("Data Recieved:", username, password)
    return database.create_user(db, username, password)


@router.post("/rate_movie")
def rate_movie(
    user_id: Annotated[int, Body()],
    movie_id: Annotated[int, Body()],
    rating: Annotated[float, Body()],
    db: Session=Depends(database.get_db)
):
    print("Data Recieved: ", user_id, movie_id, rating)
    return database.add_rating(db, user_id, movie_id, rating)


# @router.get("/get_ratings")
# def get_ratings(
#     user_id: Annotated[int, Query()],
#     db: Session=Depends(database.get_db)
# ):
#     return database.fetch_ratings(db, user_id)
