from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import  Annotated

from data_helper import get_top_picks, get_movie_details, recommend_content_based, recommend_item_based

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"]
)

class Movie(BaseModel):
    tmdb_id: int
    title: str
    genres: list[str]
    overview: str
    release_date: str
    vote_average: float = 0
    actors: list[str] | None = None 
    director: list[str] | None = None
    # poster_path: str      # poster path for many movies in the dataset is invalid. Cannot use this 
    # Excluded popuarity. Don't need to return it


@app.get("/top_picks", response_model=list[Movie])
async def top_picks(n_movies: int=10):
    top_picks = get_top_picks(n_movies)
    movies = [Movie(**movie_details_dict) for movie_details_dict in top_picks]
    return movies


@app.get("/movie_details/{movie_id}", response_model=Movie)
async def movie_details(movie_id: int):
    movie_details_dict = get_movie_details(tmdb_ids=[movie_id])
    movie_details = Movie(**movie_details_dict[0])
    return movie_details


@app.post("/movie_details_by_id", response_model=list[Movie])
async def movie_details_by_id(
    movie_ids: Annotated[list[int], Body()]
):
    movie_details_dicts = get_movie_details(tmdb_ids=movie_ids)
    movie_details = [Movie(**movie_dict) for movie_dict in movie_details_dicts]
    return movie_details


@app.get("/recommendations_CB/{movie_id}", response_model=list[int])
async def recommendations_CB(movie_id: int):
    reccomended_movie_ids = recommend_content_based(movie_id)
    return reccomended_movie_ids

@app.get("/recommendations_IB/{movie_id}", response_model=list[int])
async def recommendations_CB(movie_id: int):
    reccomended_movie_ids = recommend_item_based(movie_id)
    return reccomended_movie_ids