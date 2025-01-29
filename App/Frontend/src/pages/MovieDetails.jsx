import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import MovieCarousel from "../components/MovieCarousel"

function MovieDetails(props) {

    const params = useParams()      // fetches the path parameters from the URL (here it is only for the movie ID)

    // 
    let id
    if (props.id) {
        id = props.id
    }
    else {
        id = params.id
    }


    const [movieDetails, setMovieDetails] = useState({})
    const [posterURL, setPosterURL] = useState("")
    const [trailerURL, setTrailerURL] = useState("")
    const [recommendations_CB, setRecommendations_CB] = useState([])
    const [recommendations_IB, setRecommendations_IB] = useState([])

    // ASK RAKIB WTF IS HAPPENING WITH THE TOO MANY RENDERS REACT ERROR
    // fetch data on change in movie ID
    useEffect(() => {

        // fetch movie details from backend
        axios.get("http://localhost:8000/movie_details/" + id)
            .then(res => {
                const movieDetailsJSON = res.data
                setMovieDetails(movieDetailsJSON)
            })
            .catch(err => console.error(err));


        // fetch poster from TMDB API
        const options_poster = {
            method: 'GET',
            url: "https://api.themoviedb.org/3/movie/" + id + "/images",
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
            url: "https://api.themoviedb.org/3/movie/" + id + "/videos",
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
        axios.get("http://localhost:8000/recommendations_CB/" + id)
            .then(res => {
                // then fetch movie details using those ids
                const movie_ids = res.data
                console.log("CB: ", res.data)
                axios.post("http://localhost:8000/movie_details_by_id", movie_ids)
                    .then(res => {
                        setRecommendations_CB(res.data)
                    })
            })
        
        // Item Based
        axios.get("http://localhost:8000/recommendations_IB/" + id)
        .then(res => {
            // then fetch movie details using those ids
            const movie_ids = res.data
            console.log("IB: ", res.data)
            axios.post("http://localhost:8000/movie_details_by_id", movie_ids)
                .then(res => {
                    setRecommendations_IB(res.data)
                })
        })

    }
        , [id]);



    return (

        <div className="container py-4">
            <div className="row mb-5">
                <div className="col-8 bg-body-tertiary rounded-3">
                    <div className="container-fluid py-5">
                        <h1 className="display-5 fw-bold py-3" style={{ color: "rgb(43, 51, 59)" }}>{movieDetails["title"]}</h1>
                        <p className="col-md-8 fs-5">{movieDetails["overview"]}</p>
                        <button className="btn btn-warning btn-lg border-dark my-4" type="button">Rate Movie</button>
                    </div>
                </div>
                <img
                    className="col-md-4 mt-5 p-0 rounded-3"
                    src={posterURL}
                    style={{ height: "500px", width: "auto", boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px" }}
                />
            </div>
            <div className="row align-items-md-stretch mb-5" style={{ height: "400px" }}>
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
                        {/* <p>Swap the background-color utility and add a `.text-*` color utility to mix up the jumbotron look. Then, mix and match with additional component themes and more.</p>
                        <button className="btn btn-outline-light" type="button">Example button</button> */}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="h-100 p-5 bg-body-tertiary border rounded-3">
                        <h2>Details</h2>
                        <p>Genres : {movieDetails["genres"]}</p>
                        <p>Actors : {movieDetails["actors"]}</p>
                        <p>Director: {movieDetails["director"]}</p>
                        <button className="btn btn-outline-secondary" type="button">Example button</button>
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
                        <p className="display-6 fw-bold px-5 mx-5" style={{ position: "relative", left: "-120px", top: "40px", color: "rgb(51, 60, 69)" }}>Similar Picks (IB)</p>
                        <MovieCarousel data={recommendations_IB} />
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default MovieDetails