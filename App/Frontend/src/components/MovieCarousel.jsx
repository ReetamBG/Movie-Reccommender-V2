import Carousel from "react-bootstrap/Carousel";
import MovieCard from "./MovieCard";

function MovieCarousel(props) {

	// Each carousel item should contain 3 movies
	// so creating groups of 3 movies from entire movie list
	let data = props.data
	let dataGroups = []
	const groupSize = 5
	for (let i = 0; i < data.length; i += groupSize) {
		const item = data.slice(i, i + groupSize)
		dataGroups.push(item)
	}

	return (
		<div className="w-100 d-flex justify-content-center">
			<Carousel data-bs-theme="light">
				{dataGroups.map((dataGroup, dataGroupIdx) => {
					return (
						<Carousel.Item key={dataGroupIdx}>
							<div className="d-flex flex-row px-5 mx-2">
								{dataGroup.map((item, itemIdx) => {
									return (
										<MovieCard imgSrc="images/image_1.jpg" data={item} key={itemIdx} idx={itemIdx} />
									)
								})}
							</div>
						</Carousel.Item>
					)
				})}
			</Carousel>
		</div>
		
	);
}

export default MovieCarousel;