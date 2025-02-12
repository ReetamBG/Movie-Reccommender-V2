// import { useState, useEffect } from "react"
// import Select from "react-select"
// import { Link } from "react-router-dom"
// import axios from "axios"

// function Navbar() {

// 	const [searchResults, setSearchResults] = useState([])
// 	const [searchQuery, setSearchQuery] = useState("")

// 	function handleSearchChange(event) {
// 		setSearchQuery(event.target.value)
// 	}

// 	// fetch movies using the search query 
// 	function handleSearchSubmit(event) {
// 		event.preventDefault()
// 		const searchQuery = event.target[0].value    // access the value of the first input field
// 		axios.get("http://localhost:8000/search_movie?query=" + searchQuery)
// 		.then(res => {
// 			setSearchResults(res.data)
// 		})
// 		.catch(error => {
// 			console.log("Error fetching movies: ", error)
// 		})
// 	}




// 	return (
// 		<div className="container-fluid bg-dark py-3 px-5" data-bs-theme="dark">
// 			<div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
// 				<a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
// 					<svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlink:href="#bootstrap"></use></svg>
// 				</a>

// 				<ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
// 					<li><Link to="/" className="nav-link px-3 text-white">Ree Recommender</Link></li>
// 					<li><Link to="/" className="nav-link px-3 text-secondary">Top Picks</Link></li>
// 					<li><Link to="/movie_details/278" className="nav-link px-3 text-secondary">For You</Link></li>
// 					<li><Link to="/" className="nav-link px-3 text-secondary">About</Link></li>
// 				</ul>

// 				<form onSubmit={handleSearchSubmit} className="d-flex col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
// 					<input onChange={handleSearchChange} value={searchQuery} type="search" className="form-control" placeholder="Search..." aria-label="Search" />
// 				</form>

// 				<div className="text-end">
// 					<button type="button" className="btn btn-outline-light me-2 ">Login</button>
// 					<button type="button" className="btn btn-warning">Sign-up</button>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default Navbar


import { useState, useEffect } from "react";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash/debounce"; // Import debounce from lodash

function Navbar() {

    const user_id = localStorage.getItem("user_id");  // Get user_id from localStorage
    const [options, setOptions] = useState([]);  // Stores search results for dropdown
    const [searchQuery, setSearchQuery] = useState("");  // User input query
    const navigate = useNavigate();  // React Router hook to navigate on selection

    // Fetch movies dynamically as the user types, but with debouncing
    const handleSearchChange = debounce((inputValue) => {
        setSearchQuery(inputValue);
        if (!inputValue.trim()) {
            setOptions([]); // Clear options if input is empty
            return;
        }

        axios.get(`http://localhost:8000/search_movie?query=${inputValue}`)
            .then(res => {
                const formattedOptions = res.data.map(movie => ({
                    value: movie.tmdb_id,
                    label: movie.title
                }));
                setOptions(formattedOptions);
            })
            .catch(error => {
                console.error("Error fetching movies:", error);
                setOptions([]);
            });
    }, 500);  // Debounced for 500ms

    // Handle movie selection from the dropdown
    const handleSelectChange = (selectedOption) => {
        if (selectedOption) {
            navigate(`/movie_details/${selectedOption.value}`); // Navigate to movie details page
        }
    };

    return (
        <div className="container-fluid bg-dark py-3 px-5" data-bs-theme="dark">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                    <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
                        <use xlinkHref="#bootstrap"></use>
                    </svg>
                </a>

                <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                    <li><Link to="/" className="nav-link px-3 text-white">Ree Recommender</Link></li>
                    <li><Link to="/" className="nav-link px-3 text-secondary">Top Picks</Link></li>
                    <li><Link to={"/for_you/"} className="nav-link px-3 text-secondary">For You</Link></li>
                    <li><Link to="/" className="nav-link px-3 text-secondary">About</Link></li>
                </ul>

                {/* React-Select Dropdown for Movie Search */}
                <div className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" style={{ minWidth: "250px" }}>
                    <Select
                        placeholder="Search for a movie..."
                        value={options.find(option => option.label === searchQuery) || null} // Preserve selected value
                        onInputChange={handleSearchChange}  // Fetch data as user types (debounced)
                        onChange={handleSelectChange}  // Navigate when movie is selected
                        options={options}  // Populate dropdown with movie titles
                        isClearable
                        noOptionsMessage={() => "No movies found"}
                    />
                </div>

                <div className="text-end">
                    <Link to="/login">
                        <button type="button" className="btn btn-outline-light me-2">Login</button>
                    </Link>
                    <Link to="/login">
                    <button type="button" className="btn btn-warning">Sign-up</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;

