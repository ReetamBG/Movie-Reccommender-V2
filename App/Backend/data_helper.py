import numpy as np
import pandas as pd
import sklearn
from sklearn.metrics.pairwise import cosine_similarity
import json


tag_vectors = pd.read_parquet("./Backend/data/tag_vectors.parquet")
movies = pd.read_parquet("./Backend/data/movie_df.parquet")
ratings = pd.read_parquet("./Backend/data/ratings_df.parquet")
pt_item_based = pd.read_parquet("./Backend/data/pt_item_based.parquet")
pt_user_based = pd.read_parquet("./Backend/data/pt_user_based.parquet")

      
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
    # fetch n_movies movies based of n_users similar users
    user_vector = get_user_vector(pt_user_based, user_ratings_in_db).values.reshape(1, -1)

    similarity_scores = cosine_similarity(user_vector, pt_user_based)
    similarity_scores = pd.Series(similarity_scores[0], index=pt_user_based.index)

    top_similar_users_ids = similarity_scores.sort_values(ascending=False)[: n_users].index

    top_rated_movies = ratings[ratings["userId"].isin(top_similar_users_ids)]
    top_rated_movies = top_rated_movies.sort_values(by="rating", ascending=False).drop_duplicates(subset="tmdbId")[: n_movies]
    return top_rated_movies.tmdbId.values.tolist()
    # always return list. numpy array wont work with fasapi as it cannot convert it into json


def recommend_hybrid(
        user_ratings: pd.DataFrame, 
        n_movies, 
        n_users,
        percentile=0.5, 
        lambda_=0.02,
):
    """
    Here we will use a weighted system for the 3 recommenders
    
    For the dynamic part we will filter out top ratings based on percentile filtering
    Using percentile filtering cuz we cannot just say take ratings above 4 or 3 cuz some users might be critical raters
    and might barely have high ratings. So taking the 60th percentile rating
    Okay this becomes unnecessary with decayed rating as bad ratings will quickly drop off

    Then we will use exponential decay to caluclate decayed rating over time
    This will be the basis of the dynamic recommendation system and will learn user preferences over time 
    """

    # taking ratings above the threshold
    # threshold = user_ratings["rating"].quantile(percentile)
    # user_ratings = user_ratings[user_ratings["rating"] > threshold]

    # calculating decayed rating
    user_ratings["timestamp"] = pd.to_datetime(user_ratings["timestamp"])
    user_ratings["days_since_rated"] = (user_ratings["timestamp"].max() - user_ratings["timestamp"]).dt.days        # days passed after that rating
    user_ratings["decayed_rating"] = user_ratings["rating"] * np.exp(-lambda_ * user_ratings["days_since_rated"])   # decayed rating
    top_ratings = user_ratings.sort_values(by="decayed_rating", ascending=False).head(5)                            # taking top 5 recent movies based on decayed rating                              
    top_rated_movie_ids = top_ratings["movie_id"].values   

    # getting content and item based recommendations
    content_based_recommendations = set()
    item_based_recommendations = set()
    for movie_id in top_rated_movie_ids:
        content_based_recommendations.update(recommend_content_based(movie_id, 5))
        item_based_recommendations.update(recommend_item_based(movie_id, 5))

    # getting user based recommnedations
    user_based_recommendations = set(recommend_user_based(user_ratings, n_movies=10, n_users=3))

    # getting demographic filtering based recommendations (wont add a lot)
    demographic_based_recommendations = get_top_picks(n_movies=5)
      
    recommendations_all = content_based_recommendations | item_based_recommendations | user_based_recommendations
    return recommendations_all
    

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
    "timestamp": "2025-01-12T00:54:07.621301"
  },
  {
    "rating": 5,
    "movie_id": 272,
    "user_id": 7807245,
    "timestamp": "2025-01-05T00:54:20.553431"
  },
  {
    "rating": 4,
    "movie_id": 49026,
    "user_id": 7807245,
    "timestamp": "2024-12-12T00:54:29.143788"
  },
  {
    "rating": 4,
    "movie_id": 5,
    "user_id": 7807245,
    "timestamp": "2025-02-12T17:38:38.987338"
  }
]
    
    user_ratings_in_db = pd.DataFrame(user_ratings_in_db)
    # print(get_user_vector(pt_user_based, user_ratings_in_db))
    # print(recommend_user_based(user_ratings_in_db, 5, 5))
    print(recommend_hybrid(user_ratings=user_ratings_in_db, n_movies=5, n_users=5))
