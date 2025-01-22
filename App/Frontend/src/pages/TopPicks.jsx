import Header from "../components/Header"
import MovieCarousel from "../components/MovieCarousel"

function TopPicks(props) {
	return (
		<>
			{/* <h2 className="display-5 fw-bold px-5 mx-5 pt-5">Top Picks</h2> */}
			<MovieCarousel data={props.data} />
		</>
	)
}

export default TopPicks