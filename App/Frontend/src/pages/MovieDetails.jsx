import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"
import MovieCarousel from "../components/MovieCarousel"

function MovieDetails(props) {

    const params = useParams()      // fetches the path parameters from the URL (here it is only for the movie ID)


    let movie_id = props.id || params.id
    const user_id = localStorage.getItem("user_id")

    const [movieDetails, setMovieDetails] = useState({})
    const [posterURL, setPosterURL] = useState("")
    const [trailerURL, setTrailerURL] = useState("")
    const [recommendations_CB, setRecommendations_CB] = useState([])
    const [recommendations_IB, setRecommendations_IB] = useState([])
    const [recommendations_UB, setRecommendations_UB] = useState([])
    const [rating, setRating] = useState(0)

    // ASK RAKIB WTF IS HAPPENING WITH THE TOO MANY RENDERS REACT ERROR
    // fetch data on change in movie ID
    useEffect(() => {

        // fetch movie details from backend
        axios.get("http://localhost:8000/movie_details/" + movie_id)
            .then(res => {
                const movieDetailsJSON = res.data
                setMovieDetails(movieDetailsJSON)
            })
            .catch(err => console.error(err));


        // fetch poster from TMDB API
        const options_poster = {
            method: 'GET',
            url: "https://api.themoviedb.org/3/movie/" + movie_id + "/images",
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMjViZDgzZDkxOWUzZjZmNzYyNDgxOGRjMDEyN2U1ZiIsIm5iZiI6MTcyOTYwNDA0MC40NzYsInN1YiI6IjY3MTdhOWM4NjU0MThmMmI4NmJlY2M4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G6YgJg5tsFwRzkaffrNjd40zhEq_vB7mnrFCfu9VB4Y'
            }
        };

        axios
            .request(options_poster)
            .then(res => {
                const URL = res.data["posters"][1]["file_path"];
                const FullURL = "https://image.tmdb.org/t/p/original/" + URL;
                setPosterURL(FullURL);
            })
            .catch(err => console.error(err));

        // fetch trailer from TMDB API
        const options_trailer = {
            method: 'GET',
            url: "https://api.themoviedb.org/3/movie/" + movie_id + "/videos",
            params: { language: 'en-US' },
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMjViZDgzZDkxOWUzZjZmNzYyNDgxOGRjMDEyN2U1ZiIsIm5iZiI6MTcyOTYwNDA0MC40NzYsInN1YiI6IjY3MTdhOWM4NjU0MThmMmI4NmJlY2M4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G6YgJg5tsFwRzkaffrNjd40zhEq_vB7mnrFCfu9VB4Y'
            }
        };

        axios
            .request(options_trailer)
            .then(res => {
                const results = res.data.results
                for (let i = 0; i < results.length; i++) {
                    if (results[i].type === "Trailer") {
                        const URL = results[i].key
                        const FullURL = "https://www.youtube.com/embed/" + URL
                        setTrailerURL(FullURL)
                    }
                }
            })
            .catch(err => console.error(err));

        // fetch movies to recommend (content based)
        // first fetch ids of movies to recommend
        axios.get("http://localhost:8000/recommendations_CB/" + movie_id, {
            params: { n_movies: 20 }
        })
            .then(res => {
                // then fetch movie details using those ids
                const movie_ids = res.data
                axios.post("http://localhost:8000/movie_details_by_id", movie_ids)
                    .then(res => {
                        setRecommendations_CB(res.data)
                    })
            })

        // Item Based
        axios.get("http://localhost:8000/recommendations_IB/" + movie_id, {
            params: { n_movies: 20 }
        })
            .then(res => {
                // then fetch movie details using those ids
                const movie_ids = res.data
                axios.post("http://localhost:8000/movie_details_by_id", movie_ids)
                    .then(res => {
                        setRecommendations_IB(res.data)
                    })
            })


        // User Based
        axios.get("http://localhost:8000/recommendations_UB/" + user_id, {
            params: { n_movies: 50, n_users: 5 }
        })
            .then(res => {
                // then fetch movie details using those ids
                const movie_ids = res.data
                axios.post("http://localhost:8000/movie_details_by_id", movie_ids)
                    .then(res => {
                        setRecommendations_UB(res.data)
                    })
            })

    }
        , [movie_id]);


    function handleRatingChange(e) {
        setRating(e.target.value)
    }

    function submitRating(e) {
        e.preventDefault()
        axios.post("http://localhost:8000/rate_movie/", {
            "user_id": user_id,
            "movie_id": movie_id,
            "rating": rating
        })
            .then(res => {
                console.log("Rating added\n", "User Id: ", 499231, "\nrating: ", rating, "\nmovie_id: ", movie_id)
                alert("Rating added")
            })
            .catch(err => console.error(err));
    }



    return (

        <div className="container py-4">
            <div className="row mb-5">
                <div className="col-8 bg-body-tertiary rounded-3">
                    <div className="container-fluid py-5">
                        <h1 className="display-5 fw-bold py-3" style={{ color: "rgb(43, 51, 59)" }}>{movieDetails["title"]}</h1>
                        <p className="col-md-8 fs-5 pb-3">{movieDetails["overview"]}</p>
                        <form>
                            <div className="d-flex gap-3">
                                {[1, 2, 3, 4, 5].map((num, index) => {
                                    return (
                                        <div key={index}>
                                            <input value={num} onChange={handleRatingChange} className="mx-1" name="rating" type="radio" id={`rating-${rating}`} />
                                            <label htmlFor={`rating-${num}`}>{num}</label>
                                        </div>
                                    )
                                })}
                            </div>
                            <button onClick={submitRating} className="btn btn-warning btn-lg border-dark my-4" type="button">Rate Movie</button>
                        </form>
                    </div>
                </div>
                <img
                    className="col-md-4 mt-5 p-0 rounded-3"
                    src={posterURL}
                    style={{ height: "500px", width: "auto", boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px" }}
                />
            </div>
            <div className="row align-items-md-stretch mb-5" style={{ maxHeight: "400px", height: "400px" }}>
                <div className="col-md-6">
                    <div className="h-100">
                        <iframe
                            className="rounded-3"
                            width="100%"
                            height="100%"
                            src={trailerURL}
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            style={{ boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px" }}
                        >
                        </iframe>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="h-100 py-3 px-5 bg-body-tertiary border rounded-3">
                        <h2>Details</h2>

                        <p><b>Genres</b></p>
                        <p>{movieDetails["genres"] ? movieDetails["genres"].slice(0, 3).join(" | ") : null}</p>
                        <hr />
                        <p><b>Actors</b></p>
                        <p>{movieDetails["actors"] ? movieDetails["actors"].slice(0, 3).join(" | ") : null}</p>
                        <hr />
                        <p><b>Director</b></p>
                        <p>{movieDetails["director"]}</p>
                    </div>
                </div>
            </div>
            {props.recommend ? (
                <>
                    <div className="row">
                        <p className="display-6 fw-bold px-5 mx-5" style={{ position: "relative", left: "-120px", top: "40px", color: "rgb(51, 60, 69)" }}>Similar Picks (CB)</p>
                        <MovieCarousel data={recommendations_CB} />
                    </div>
                    <div className="row">
                        <p className="display-6 fw-bold px-5 mx-5" style={{ position: "relative", left: "-120px", top: "40px", color: "rgb(51, 60, 69)" }}>People also liked (IB)</p>
                        <MovieCarousel data={recommendations_IB} />
                    </div>
                    <div className="row">
                        <p className="display-6 fw-bold px-5 mx-5" style={{ position: "relative", left: "-120px", top: "40px", color: "rgb(51, 60, 69)" }}>People also liked (UB) - UID: {user_id}</p>
                        <MovieCarousel data={recommendations_UB} />
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default MovieDetails