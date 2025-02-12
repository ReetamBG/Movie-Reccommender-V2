import { useState, useEffect } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Navbar from "./components/Navbar"
import TopPicks from "./pages/TopPicks"
import Authentication from "./pages/Authentication"
import MovieDetails from "./pages/MovieDetails"
import ForYou from "./pages/ForYou"
import axios from "axios"

function App() {

	// Routes
	const router = createBrowserRouter(
		[
			{
				path: "/login",
				element: (
					<>
						<Navbar />
						<Authentication />
					</>
				)
			},
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
				path: "/for_you",
				element: (
					<>
						<Navbar />
						<ForYou />
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
