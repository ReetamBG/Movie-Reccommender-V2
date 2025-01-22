import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button'

function Header() {
	return (
		
		<div className="container-fluid bg-dark py-3 px-5" data-bs-theme="dark">
		<div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
		  <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
			<svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlink:href="#bootstrap"></use></svg>
		  </a>
  
		  <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
			<li><a href="#" className="nav-link px-3 text-white">Ree Recommender</a></li>
			<li><a href="#" className="nav-link px-3 text-secondary">Top Picks</a></li>
			<li><a href="#" className="nav-link px-3 text-secondary">For You</a></li>
			<li><a href="#" className="nav-link px-3 text-secondary">About</a></li>
		  </ul>
  
		  <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
			<input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
		  </form>
  
		  <div className="text-end">
			<button type="button" className="btn btn-outline-light me-2 ">Login</button>
			<button type="button" className="btn btn-warning">Sign-up</button>
		  </div>
		</div>
	  </div>
	
	)
}

export default Header