import { useState, useEffect } from "react"
import axios from "axios"

function MovieDetails(props) {

    const [title, setTitle] = useState("")
    const [overview, setOverview] = useState("")
    const [posterURL, setPosterURL] = useState("")
    const [trailerURL, setTrailerURL] = useState("")

    // ASK RAKIB WTF IS HAPPENING WITH THE TOO MANY RENDERS REACT ERROR
    // fetch data on first render
    useEffect(() => {
        if (props.movieData) {
            setTitle(props.movieData["title"]);
            setOverview(props.movieData["overview"]);

            // fetch poster
            const options_poster = {
                method: 'GET',
                url: "https://api.themoviedb.org/3/movie/" + props.movieData["tmdb_id"] + "/images",
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMjViZDgzZDkxOWUzZjZmNzYyNDgxOGRjMDEyN2U1ZiIsIm5iZiI6MTcyOTYwNDA0MC40NzYsInN1YiI6IjY3MTdhOWM4NjU0MThmMmI4NmJlY2M4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G6YgJg5tsFwRzkaffrNjd40zhEq_vB7mnrFCfu9VB4Y'
                }
            };

            axios
                .request(options_poster)
                .then(res => {
                    if (res.data["posters"] && res.data["posters"].length > 1) {
                        const URL = res.data["posters"][1]["file_path"];
                        const FullURL = "https://image.tmdb.org/t/p/original/" + URL;
                        setPosterURL(FullURL);
                    }
                })
                .catch(err => console.error(err));

            // fetch trailer
            const options_trailer = {
                method: 'GET',
                url: "https://api.themoviedb.org/3/movie/" + props.movieData["tmdb_id"] + "/videos",
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
        }
    }, [props.movieData]);  // Dependency array ensures effect runs only when `movieData` changes



    return (

        <div className="container py-4">
            <div className="row mb-5">
                <div className="col-8 bg-body-tertiary rounded-3">
                    <div className="container-fluid py-5">
                        <h1 className="display-5 fw-bold">{title}</h1>
                        <p className="col-md-8 fs-5">{overview}</p>
                        <button className="btn btn-primary btn-lg" type="button">Example button</button>
                    </div>
                </div>
                <img
                    className="col-md-4 mt-5 p-0 rounded-3"
                    src={posterURL}
                    style={{ height: "500px", width: "auto", boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px" }}
                />
            </div>
            <div className="row align-items-md-stretch mb-5" style={{height: "400px"}}>
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
                        <h2>Other Details</h2>
                        <p>Genres and actors and all Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure beatae consectetur porro aspernatur, consequuntur impedit inventore itaque saepe blanditiis distinctio laborum, libero minima? Velit illo voluptate illum doloribus veniam et.
                        Modi odio id ducimus nostrum et quas culpa aspernatur ab, voluptate, consequatur veniam doloremque doloribus similique vero sunt enim delectus repellat. Ipsam suscipit obcaecati rerum sapiente, asperiores distinctio hic magnam.</p>
                        <button className="btn btn-outline-secondary" type="button">Example button</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default MovieDetails