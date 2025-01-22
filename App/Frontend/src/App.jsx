import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Header from "./components/Header"
import TopPicks from "./pages/TopPicks"
import MovieDetails from "./pages/MovieDetails"
import axios from "axios"

function App() {

	const [data, setData] = useState([])

	async function getData() {
		try {
			const response = await axios.get("http://localhost:8000/top_picks?n_movies=50")
			setData(response.data)
			// console.log(data)
		}
		catch (error) {
			console.log(error)
		}
	}

	// useEffect(() => {
	// 	try {
	// 		const response = axios.get("http://localhost:8000/top_picks?n_movies=50")
	// 		setData(response.data)
	// 		// console.log(data)
	// 	}
	// 	catch (error) {
	// 		console.log(error)
	// 	}
	// })

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<Header />
			<TopPicks data={data} />
			<MovieDetails movieData={data[0]}/>
			<Button onClick={getData}>FETCH TOP MOVIES</Button>
		</div>
	)
}

export default App
