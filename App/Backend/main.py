import numpy as np
import pandas as pd

from fastapi import FastAPI,Path, Body, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import  Annotated
from Backend.routers import database_routes
from Backend.database import get_db, fetch_ratings
from Backend.models import Rating
from sqlalchemy.orm import Session

from Backend.schemas import Movie
from Backend import data_helper
from Backend.database import fetch_ratings


app = FastAPI()
app.include_router(database_routes.router)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"]
)


@app.get("/top_picks", response_model=list[Movie])
async def top_picks(n_movies: Annotated[int, Query()] = 10):
    top_picks = data_helper.get_top_picks(n_movies)
    movies = [Movie(**movie_details_dict) for movie_details_dict in top_picks]
    return movies


@app.get("/movie_details/{movie_id}", response_model=Movie)
async def movie_details(movie_id: int):
    movie_details_dict = data_helper.get_movie_details(tmdb_ids=[movie_id])
    movie_details = Movie(**movie_details_dict[0])
    return movie_details


@app.post("/movie_details_by_id", response_model=list[Movie])
async def movie_details_by_id(
    movie_ids: Annotated[list[int], Body()]
):
    movie_details_dicts = data_helper.get_movie_details(tmdb_ids=movie_ids)
    movie_details = [Movie(**movie_dict) for movie_dict in movie_details_dicts]
    return movie_details


@app.get("/recommendations_CB/{movie_id}", response_model=list[int])
async def recommendations_CB(
    movie_id: Annotated[int, Path()] , 
    n_movies: Annotated[int | None, Query()] = 10
):
    reccomended_movie_ids = data_helper.recommend_content_based(movie_id, n_movies)
    return reccomended_movie_ids


@app.get("/recommendations_IB/{movie_id}", response_model=list[int])
async def recommendations_IB(
    movie_id: Annotated[int, Path()],
    n_movies: Annotated[int | None, Query()] = 10
):
    reccomended_movie_ids = data_helper.recommend_item_based(movie_id, n_movies)
    return reccomended_movie_ids


@app.get("/recommendations_UB/{user_id}")
async def recommendations_UB(
    user_id: Annotated[int, Path()],
    n_movies: Annotated[int, Query()],
    n_users: Annotated[int, Query()],
    db: Session=Depends(get_db)
):
    ratings = fetch_ratings(db, user_id)
    
    # if no ratings then return empty list
    if not ratings:
        return []
    
    # Convert list of Rating objects to list of dictionaries
    ratings_dicts = [
        {
            "rating": rating.rating,
            "movie_id": rating.movie_id,
            "user_id": rating.user_id,
            "timestamp": rating.timestamp
        }
        for rating in ratings
    ]
    
    # Create DataFrame from list of dictionaries
    ratings_df = pd.DataFrame(ratings_dicts)
    return data_helper.recommend_user_based(ratings_df, n_movies, n_users).tolist()
    # return a list cuz fastapi cannot jsonify numpy arrays 
    # recommend_user_based function returns us a numpy array of movie ids
    # for some reason list(arr) is also not working so switched to np.ndarray.tolist()

    


@app.get("/search_movie")
async def fetch_all_movies(search_query: Annotated[str, Query(alias="query")]):
    movie_list = data_helper.get_searched_movies(search_query)
    return movie_list
    