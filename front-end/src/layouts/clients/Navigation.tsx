import { Link } from 'react-router';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function Navigation() {
	return (
		<>
			{/* Menu for desktop */}
			<div className="menu-desktop row align-items-center">
				<div className="col-2 col-md-2">
					<h1>Brand</h1>
				</div>
				<div className="col-7 col-md-9">
					<ul className="nav">
						<li className="nav-item">
							<Link to="/ecommerce" className="nav-link">
								Ecommerce
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/trello" className="nav-link">
								Trello
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/about" className="nav-link">
								About
							</Link>
						</li>
					</ul>
				</div>
				<div className="col-2 col-md-1">
					<ul className="nav">
						<li className="nav-item">
							<Link to="/info" className="nav-link">
								Info
							</Link>
						</li>
					</ul>
				</div>
			</div>

			{/* Menu for mobile */}
			<div className="menu-mobile">
				<div className="sec-img">
					<h1>Brand</h1>
				</div>
				<div className="sec-menu">
					<ul className="nav">
						<li className="nav-item">
							<Link to="/ecommerce" className="nav-link">
								Ecommerce
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/trello" className="nav-link">
								Trello
							</Link>
						</li>
						<li className="nav-item">
							<Link to="/about" className="nav-link">
								About
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</>
	);
}
export default Navigation;
