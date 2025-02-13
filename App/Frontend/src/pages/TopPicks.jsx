import { useState, useEffect } from "react"
import axios from "axios"
import Header from "../components/Navbar"
import MovieCarousel from "../components/MovieCarousel"
import MovieDetails from "./MovieDetails"

function TopPicks() {
	const [data, setData] = useState([])

	async function getData() {
		try {
			const response = await axios.get("http://localhost:8000/top_picks?n_movies=50")
			setData(response.data)
			console.log(data)
		}
		catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getData()
	}, [])

	return (
		<div className="container">
			<p className="display-6 fw-bold px-5 mx-5" style={{ position: "relative", left: "-120px", top: "40px", color: "rgb(51, 60, 69)" }}>Our Top Picks</p>			<MovieCarousel data={data} />
			<hr />
			<p className="display-6 fw-bold px-5 mx-5" style={{ position: "relative", left: "-120px", top: "40px", color: "rgb(51, 60, 69)" }}>Latest Releases</p>
			<MovieDetails id={293660} recommend={false}/>
			<hr />
			<MovieDetails id={278} recommend={false}/>
		</div>
	)
}

export default TopPicks