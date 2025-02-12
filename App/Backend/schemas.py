# Defines request and response schemas (pydantic models)

from pydantic import BaseModel

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


class User(BaseModel):
    username: str
    password: str


class Rating(BaseModel):
    user_id: int
    movie_id: int
    rating: float