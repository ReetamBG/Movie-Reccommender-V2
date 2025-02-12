import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import axios from "axios"
import MovieCarousel from "../components/MovieCarousel"

function MovieDetails(props) {

    const user_id = localStorage.getItem("user_id")

    const [recommendations_CB, setRecommendations_CB] = useState([])
    const [recommendations_hybrid, setRecommendations_hybrid] = useState([])
    const [recommendations_UB, setRecommendations_UB] = useState([])

    useEffect(() => {


        // fetch movies to recommend (content based)

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

        // Hybrid Recommendations
        axios.get("http://localhost:8000/recommendations_hybrid/" + user_id, {
            params: { n_movies: 50, n_users: 5 }
        })
            .then(res => {
                // then fetch movie details using those ids
                const movie_ids = res.data
                axios.post("http://localhost:8000/movie_details_by_id", movie_ids)
                    .then(res => {
                        console.log("SSSS", res.data)
                        setRecommendations_hybrid(res.data)
                    })
            })

    }
        , []);





    return (
        <>
            <div className="container py-4">
                <div className="row">
                    <p className="display-6 fw-bold px-5 mx-5" style={{ position: "relative", left: "-120px", top: "40px", color: "rgb(51, 60, 69)" }}>Hybrid - UID: {user_id}</p>
                    <MovieCarousel data={recommendations_hybrid} />
                </div>
            </div>
            <div className="container py-4">
                <div className="row">
                    <p className="display-6 fw-bold px-5 mx-5" style={{ position: "relative", left: "-120px", top: "40px", color: "rgb(51, 60, 69)" }}>People also liked (UB) - UID: {user_id}</p>
                    <MovieCarousel data={recommendations_UB} />
                </div>
            </div>
        </>
    )
}

export default MovieDetails