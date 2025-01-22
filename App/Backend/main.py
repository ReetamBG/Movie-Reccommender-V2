from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from data_helper import get_top_picks

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
    avg_rating: float
    actors: list[str] | None = None 
    director: list[str] | None = None
    poster_path: str
    # Excluded popuarity. Don't need to return it


@app.get("/top_picks", response_model=list[Movie])
async def top_picks(n_movies: int=10):
    top_picks = get_top_picks(n_movies)
    movies = [Movie(**movie_details_dict) for movie_details_dict in top_picks]
    return movies