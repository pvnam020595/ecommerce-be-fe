import '@css/trello/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faBell, faUser, faHouse } from '@fortawesome/free-solid-svg-icons';
import { Outlet } from 'react-router-dom';

export const Home = () => {
	return (
		<div className="surface">
			<div className="header-menu">
				<div className="header-left-menu">
					<div className="logo">
						<img
							width="24"
							height="24"
							src="https://img.icons8.com/color/48/trello.png"
							alt="trello"
						/>
						<span>Trello</span>
					</div>
				</div>
				<div className="header-center-menu">
					<div className="search-box">
						<form action="" className="form-search">
							<div className="form-group">
								<input
									id="input-search"
									type="text"
									className="form-control input-search t-custom-input"
									placeholder="Search..."
								/>
							</div>
						</form>
					</div>
					<div className="create-board">
						<button className="create-board-button btn btn-primary">
							<span>Create</span>
						</button>
					</div>
				</div>
				<div className="header-right-menu">
					<div className="notification">
						<button
							type="button"
							className="btn btn-transition dropdown-toggle"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							<span>
								<FontAwesomeIcon icon={faBell} />
							</span>
						</button>
						<ul className="dropdown-menu list-notification">
							<li className="item">
								<div className="title-area dropdown-item">
									<h2>Notification</h2>
								</div>
								<hr />
							</li>
							<li className="item">
								<a className="dropdown-item" href="#">
									Action
								</a>
							</li>
							<li className="item">
								<a className="dropdown-item" href="#">
									Another action
								</a>
							</li>
							<li className="item">
								<a className="dropdown-item" href="#">
									Something else here
								</a>
							</li>
							<li className="item"></li>
							<li className="item">
								<a className="dropdown-item" href="#">
									Separated link
								</a>
							</li>
						</ul>
					</div>
					<div className="account">
						<button
							type="button"
							className="btn btn-transition dropdown-toggle"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							<span>
								<FontAwesomeIcon icon={faUser} />
							</span>
						</button>
						<ul className="dropdown-menu list-account">
							<li className="item">
								<div className="avatar dropdown-item">
									<img
										src="https://sb-admin-pro.startbootstrap.com/assets/img/illustrations/profiles/profile-1.png"
										alt=""
									/>
								</div>
								<div className="info-account">
									<span className="name">NamPham</span>
									<span className="email">
										pvnam020559@gmail.com
									</span>
								</div>
							</li>
							<hr />
							<li className="item">
								<a className="dropdown-item" href="#">
									Setting
								</a>
							</li>
							<li className="item">
								<a className="dropdown-item" href="#">
									Create board
								</a>
							</li>
							<li className="item">
								<a className="dropdown-item" href="#">
									Logout
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="left-menu">
				<div className="home-left-sidebar">
					<ul className="nav flex-column">
						<li className="nav-item">
							<a className="nav-link" href="#">
								<span>
									<img
										width="20"
										height="20"
										src="https://img.icons8.com/color/48/trello.png"
										alt="trello"
									/>
								</span>
								<span>Boards</span>
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="#">
								<span>
									<FontAwesomeIcon icon={faHouse} />
								</span>
								<span>Home</span>
							</a>
						</li>
					</ul>
				</div>
				<div className="workspace">
					<Outlet></Outlet>
				</div>
			</div>
		</div>
	);
};
