import { useState, useEffect } from "react"
import axios from "axios"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function MovieCard(props) {

	// const posterURL = "https://image.tmdb.org/t/p/original/" + props.data['poster_path']    // This is not working

	// Fetching Poster Path using TMDB ID
	const [posterURL, setPosterURL] = useState("")
	
	useEffect( () => {
	const options = {
		method: 'GET',
		url: "https://api.themoviedb.org/3/movie/" + props.data["tmdb_id"] + "/images",
		headers: {
			accept: 'application/json',
			Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMjViZDgzZDkxOWUzZjZmNzYyNDgxOGRjMDEyN2U1ZiIsIm5iZiI6MTcyOTYwNDA0MC40NzYsInN1YiI6IjY3MTdhOWM4NjU0MThmMmI4NmJlY2M4YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.G6YgJg5tsFwRzkaffrNjd40zhEq_vB7mnrFCfu9VB4Y'
		}
	};

	axios
		.request(options)
		.then(res => {
			const posterPath = res.data["posters"][1]["file_path"]
			const posterPathFull = "https://image.tmdb.org/t/p/original/" + posterPath
			setPosterURL(posterPathFull)
			// console.log(posterPathFull)
		})
		.catch(err => console.error(err));
	}, [])


	return (
		<Card
			className="mx-3 my-5"
			style={{
				width: '250px',
				boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
				border: "solid 3px white"
			}}
		>
			<Card.Img
				variant="top"
				src={posterURL}
				style={{ height: "350px", width: "100%", objectFit: "cover" }}
			/>
			<Card.Body className="d-flex flex-column">
				<Card.Title className="fw-bold" style={{ height: "5rem" }}>
					{props.data["title"]}
				</Card.Title>
				<Card.Text style={{ height: "7rem", overflow: "hidden", textOverflow: "ellipsis" }}>
					{props.data["overview"].slice(0, 90) + " ..."}
				</Card.Text>
				<Button variant="secondary">More Details</Button>
			</Card.Body>
		</Card>
	);
}

export default MovieCard;