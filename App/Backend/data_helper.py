import numpy as np
import pandas as pd
import sklearn
from sklearn.metrics.pairwise import cosine_similarity
import json


tag_vectors = pd.read_parquet("./data/tag_vectors.parquet")
movies = pd.read_parquet("./data/movie_df.parquet")
ratings = pd.read_parquet("./data/ratings_df.parquet")
pt_item_based = pd.read_parquet("./data/pt_item_based.parquet")
pt_user_based = pd.read_parquet("./data/pt_user_based.parquet")

      
# fetching n most popular movies
def get_top_picks(n_movies):
    top_picks_id = movies.sort_values(by="popularity", ascending=False)["tmdb_id"].values[: n_movies]
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


# CONTENT BASED
def recommend_content_based(tmdb_id, n_movies):    
    movie_vector = tag_vectors.loc[tmdb_id].values.reshape(1, -1)             
    similarity_scores = cosine_similarity(movie_vector, tag_vectors)[0]
    similarity_scores = pd.Series(similarity_scores, index=tag_vectors.index)
    similarity_scores = similarity_scores.sort_values(ascending=False)
    recommended_tmdb_ids = similarity_scores.index[: n_movies]
    return recommended_tmdb_ids


# ITEM BASED 
def recommend_item_based(tmdb_id, n_movies):
    movie_vector = pt_item_based.loc[tmdb_id]                  
    similarity_scores = cosine_similarity(movie_vector.values.reshape(1, -1), pt_item_based)
    similarity_scores = pd.Series(similarity_scores.flatten(), index=pt_item_based.index)
    similarity_scores = similarity_scores.sort_values(ascending=False)
    recommended_tmdb_ids = similarity_scores.index[: n_movies]
    return recommended_tmdb_ids


# USER BASED 
def get_user_vector(pt_user_based, selected_user_ratings):
    user_vector = np.zeros(len(pt_user_based.columns), dtype=np.float32)
    user_vector = pd.Series(user_vector, index=pt_user_based.columns)
    user_vector.loc[selected_user_ratings["movie_id"]] = selected_user_ratings["rating"].values
    return user_vector

def recommend_user_based(user_ratings_in_db, n_movies, n_users):
    user_vector = get_user_vector(pt_user_based, user_ratings_in_db).values.reshape(1, -1)

    similarity_scores = cosine_similarity(user_vector, pt_user_based)
    similarity_scores = pd.Series(similarity_scores[0], index=pt_user_based.index)

    top_similar_users_ids = similarity_scores.sort_values(ascending=False)[: n_users].index

    top_rated_movies = ratings[ratings["userId"].isin(top_similar_users_ids)]
    top_rated_movies = top_rated_movies.sort_values(by="rating", ascending=False).drop_duplicates(subset="tmdbId")[: n_movies]
    return top_rated_movies.tmdbId.values


# OTHER FUNCTIONS
def get_searched_movies(search_query):
    # search the movies titles that contains the search query word
    movie_list = movies[movies["title"].str.contains(search_query.lower().strip(), case=False)]
    movie_list = movie_list[["title", "tmdb_id"]].sort_values(by="title")
    movie_list = json.loads(movie_list.to_json(orient="records")) 
    return movie_list


if __name__ == "__main__":
	# print(get_movie_details([278, 27]))
	# print(recommend_content_based(155), 10)
	# print(get_movie_details(recommend(278)))
	# print(recommend_item_based(278), 10)
	# print(get_searched_movies("batman"))
    user_ratings_in_db = [
  {
    "rating": 5,
    "movie_id": 157336,
    "user_id": 7807245,
    "timestamp": "2025-02-12T00:53:46.052125"
  },
  {
    "rating": 5,
    "movie_id": 155,
    "user_id": 7807245,
    "timestamp": "2025-02-12T00:54:07.621301"
  },
  {
    "rating": 5,
    "movie_id": 272,
    "user_id": 7807245,
    "timestamp": "2025-02-12T00:54:20.553431"
  },
  {
    "rating": 4,
    "movie_id": 49026,
    "user_id": 7807245,
    "timestamp": "2025-02-12T00:54:29.143788"
  },
  {
    "rating": 4,
    "movie_id": 5,
    "user_id": 7807245,
    "timestamp": "2025-02-12T17:38:38.987338"
  }
]
    import pickle
    user_ratings_in_db = pickle.load(open("ratingsss.pickle", "rb"))
    
    user_ratings_in_db = pd.DataFrame(user_ratings_in_db)
    print(get_user_vector(pt_user_based, user_ratings_in_db))
    print(recommend_user_based(user_ratings_in_db, 5, 5))