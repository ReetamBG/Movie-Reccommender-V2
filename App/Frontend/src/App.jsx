import { useState, useEffect } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Button from "react-bootstrap/esm/Button"
import Navbar from "./components/Navbar"
import TopPicks from "./pages/TopPicks"
import MovieDetails from "./pages/MovieDetails"
import axios from "axios"

function App() {

	// Routes
	const router = createBrowserRouter(
		[
			{
				path: "/",
				element: (
					<>
						<Navbar />
						<TopPicks />
					</>
				)
			},
			{
				path: "/movie_details/:id",
				element: (
					<>
						<Navbar />
						<MovieDetails recommend={true}/>
					</>
				)
			}
		]
	)

	return (
		<RouterProvider router={router} />
	)
}

export default App
