import numpy as np
import pandas as pd
import sklearn
from sklearn.metrics.pairwise import cosine_similarity
import json

import pickle

tag_vectors = pd.read_parquet("./data/tag_vectors.parquet")
movies = pd.read_parquet("./data/movie_df.parquet")
pt_item_based = pd.read_parquet("./data/pt_item_based.parquet")

      
# fetching n most popular movies
def get_top_picks(n):
    top_picks_id = movies.sort_values(by="popularity", ascending=False)["tmdb_id"].values[: n]
    top_picks = movies[movies["tmdb_id"].isin(top_picks_id)]
    top_picks_json = json.loads(top_picks.to_json(orient="records"))  
    # to_json() returns string
    # eval on the json string causing problems with certain strings like poster paths with "\" characters 
    # so using json.loads() as it evaluates json properly

    return top_picks_json


def get_movie_details(tmdb_ids: list[int]):     
    movie = movies[movies["tmdb_id"].isin(tmdb_ids)]
    movie_json = json.loads(movie.to_json(orient="records"))

    return movie_json


def recommend_content_based(tmdb_id, n_movies=10):    
    movie_vector = tag_vectors.loc[tmdb_id].values.reshape(1, -1)             
    similarity_scores = cosine_similarity(movie_vector, tag_vectors)[0]
    similarity_scores = pd.Series(similarity_scores, index=tag_vectors.index)
    similarity_scores = similarity_scores.sort_values(ascending=False)
    recommended_tmdb_ids = similarity_scores.index[: n_movies]
    return recommended_tmdb_ids


def recommend_item_based(tmdb_id, n_movies=10):
    movie_vector = pt_item_based.loc[tmdb_id]                  
    similarity_scores = cosine_similarity(movie_vector.values.reshape(1, -1), pt_item_based)
    similarity_scores = pd.Series(similarity_scores.flatten(), index=pt_item_based.index)
    similarity_scores = similarity_scores.sort_values(ascending=False)
    recommended_tmdb_ids = similarity_scores.index[: n_movies]
    return recommended_tmdb_ids

    
# print(get_movie_details([278, 27]))
print(recommend_content_based(155))
# print(get_movie_details(recommend(278)))
# print(recommend_item_based(278))
