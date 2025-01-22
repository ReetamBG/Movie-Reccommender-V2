import numpy as np
import pandas as pd
import sklearn
from sklearn.metrics.pairwise import cosine_similarity
import json

import pickle

tag_vectors = pickle.load(open("./data/tag_vectors.pkl", "rb"))
movies = pd.read_csv("./data/movies_df_final.csv", 
                     converters={
                         "genres": eval,
                         "actors": eval,
                         "director": eval        
                         })

# movies = movies.drop(columns="poster_path")     # poster path causing some problems in eval()


      
# fetching n most popular movies
def get_top_picks(n):
    top_picks_id = movies.sort_values(by="popularity", ascending=False)["tmdb_id"].values[: n]
    top_picks = movies[movies["tmdb_id"].isin(top_picks_id)]
    top_picks_json = json.loads(top_picks.to_json(orient="records"))  
    # to_json() returns string so using json.loads()
    # eval causing problems with certain strings like poster paths with "\" characters 

    return top_picks_json

# print(get_top_picks(1))