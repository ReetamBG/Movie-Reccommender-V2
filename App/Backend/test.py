import requests

movie_id = 2887
url = f"https://api.themoviedb.org/3/movie/{movie_id}/videos?language=en-US"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMjViZDgzZDkxOWUzZjZmNzYyNDgxOGRjMDEyN2U1ZiIsIm5iZiI6MTcyOTYwNDA0MC40NzYsInN1YiI6IjY3MTdhOWM4NjU0MThmMmI4NmJlY2M4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G6YgJg5tsFwRzkaffrNjd40zhEq_vB7mnrFCfu9VB4Y"
}

response = requests.get(url, headers=headers)

print(response.text)