import '@css/trello/home.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@router/paths';
import { Navbar } from '@modules/trello/components/Navbar';

const Sidebar = () => (
	<aside className="trello-sidebar pt-4 px-3 d-none d-md-block">
		<ul className="nav flex-column gap-1 mb-3">
			<li className="nav-item">
				<a
					className="nav-link active d-flex align-items-center rounded px-3 py-2"
					href="#!"
				>
					<i className="bi bi-trello me-2"></i> Boards
				</a>
			</li>
			<li className="nav-item">
				<a
					className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
					href="#!"
				>
					<i className="bi bi-person me-2"></i> Members
				</a>
			</li>
			<li className="nav-item">
				<a
					className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
					href="#!"
				>
					<i className="bi bi-gear me-2"></i> Workspace settings{' '}
					<i className="bi bi-chevron-down ms-auto fs-8"></i>
				</a>
			</li>
		</ul>

		<div className="fw-semibold fs-7 text-muted mb-2 px-3">
			Workspace views
		</div>
		<ul className="nav flex-column gap-1">
			<li className="nav-item">
				<a
					className="nav-link d-flex align-items-center text-dark rounded px-3 py-2 fst-italic"
					href="#!"
				>
					<i className="bi bi-table me-2"></i> Table
				</a>
			</li>
			<li className="nav-item">
				<a
					className="nav-link d-flex align-items-center text-dark rounded px-3 py-2 fst-italic"
					href="#!"
				>
					<i className="bi bi-calendar4 me-2"></i> Calendar
				</a>
			</li>
		</ul>
	</aside>
);

const BoardCard = ({
	title,
	bgType,
	bgValue,
	linkTo = '#!'
}: {
	title: string;
	bgType: string;
	bgValue: string;
	linkTo?: string;
}) => {
	const [isStarred, setIsStarred] = useState(false);

	const style =
		bgType === 'image'
			? { backgroundImage: `url('${bgValue}')` }
			: { backgroundColor: bgValue };

	const toggleStar = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsStarred(!isStarred);
	};

	return (
		<div className="col board-col">
			<Link
				to={linkTo}
				className="board-tile rounded text-decoration-none d-block position-relative"
				style={style}
			>
				<div className="board-overlay w-100 h-100 position-absolute top-0 start-0 rounded"></div>
				<div className="p-2 d-flex flex-column h-100 position-relative z-1">
					<span className="text-white fw-bold fs-6 board-title">
						{title}
					</span>
					<i
						className={`bi ${isStarred ? 'bi-star-fill text-warning opacity-100' : 'bi-star text-white'} mt-auto align-self-end star-icon fs-6`}
						onClick={toggleStar}
					></i>
				</div>
			</Link>
		</div>
	);
};

export const Home = () => {
	return (
		<div className="trello-app vh-100 d-flex flex-column">
			<Navbar />

			<div className="d-flex flex-grow-1 overflow-hidden layout-body">
				<Sidebar />

				<main className="trello-main-content flex-grow-1 overflow-auto">
					<div className="boards-page-container">
						{/* Workspace Header exactly like Trello */}
						<div className="workspace-header d-flex align-items-center border-bottom pb-4 mb-4 mt-5">
							<div className="workspace-logo-xl text-white fw-bold me-3 d-flex justify-content-center align-items-center fs-2 rounded">
								N
							</div>
							<div className="workspace-header-info flex-grow-1">
								<h2 className="fw-bold mb-0 d-flex align-items-center gap-2">
									Nam Pham's workspace{' '}
									<i className="bi bi-pencil fs-6 text-muted cursor-pointer hover-icon"></i>
								</h2>
								<span className="fs-7 text-muted">Free</span>
							</div>
						</div>

						{/* Boards Section */}
						<div className="boards-section">
							<div className="d-flex align-items-center gap-2 mb-3">
								<div className="section-icon-box bg-dark text-white rounded d-flex justify-content-center align-items-center">
									<i className="bi bi-person fs-5"></i>
								</div>
								<h4 className="fw-bold m-0 fs-5">
									Your boards
								</h4>
							</div>

							{/* Trello uses a specific tile width, usually fitting 4 in a row max */}
							<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-3 board-grid">
								<BoardCard
									title="E-commerce Project"
									bgType="color"
									bgValue="#0079bf"
									linkTo={PATHS.TRELLO.BOARDS}
								/>
								<BoardCard
									title="Marketing Campaign"
									bgType="image"
									bgValue="https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=400&auto=format&fit=crop"
									linkTo={PATHS.TRELLO.BOARDS}
								/>
								<BoardCard
									title="Q3 Roadmap"
									bgType="color"
									bgValue="#d29034"
									linkTo={PATHS.TRELLO.BOARDS}
								/>

								<div className="col board-col">
									<a
										href="#!"
										className="board-tile create-board rounded text-decoration-none d-flex justify-content-center align-items-center h-100"
									>
										<span className="text-dark fs-7">
											Create new board
										</span>
									</a>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};
