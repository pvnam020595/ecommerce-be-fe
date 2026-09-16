import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@router/paths';
import type { RootState } from '@redux/store';
import { logout } from '@/redux/common/authActions';

export const Navbar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.auth.user);

	const userName = user?.name || 'Nam Pham Van';
	const userEmail = user?.email || 'p_vannam@thk-hd.vn';
	const userAvatar =
		user?.avatar || 'https://avatars.githubusercontent.com/u/1?v=4';

	const handleLogout = (e: React.MouseEvent) => {
		e.preventDefault();
		dispatch(logout());
		navigate(PATHS.TRELLO.ROOT, { replace: true });
	};

	return (
		<nav className="navbar navbar-expand-md trello-navbar px-3 border-bottom">
			<div className="d-flex align-items-center justify-content-between w-100">
				{/* Left navbar: Logo, Divider, Nav Links */}
				<div className="d-flex align-items-center gap-3">
					<a
						className="navbar-brand d-flex align-items-center m-0 p-0 text-decoration-none"
						href={PATHS.TRELLO.HOME}
					>
						<div className="plannr-logo-icon me-2 d-flex align-items-center justify-content-center">
							<svg width="28" height="28" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect width="56" height="56" rx="6" fill="#4F46E5" />
								<path d="M24.5 17.5H18.6667C18.0223 17.5 17.5 18.0223 17.5 18.6667V24.5C17.5 25.1443 18.0223 25.6667 18.6667 25.6667H24.5C25.1443 25.6667 25.6667 25.1443 25.6667 24.5V18.6667C25.6667 18.0223 25.1443 17.5 24.5 17.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" />
								<path d="M37.3333 17.5H31.5C30.8557 17.5 30.3333 18.0223 30.3333 18.6667V24.5C30.3333 25.1443 30.8557 25.6667 31.5 25.6667H37.3333C37.9777 25.6667 38.5 25.1443 38.5 24.5V18.6667C38.5 18.0223 37.9777 17.5 37.3333 17.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" />
								<path d="M37.3333 30.3333H31.5C30.8557 30.3333 30.3333 30.8557 30.3333 31.5V37.3333C30.3333 37.9777 30.8557 38.5 31.5 38.5H37.3333C37.9777 38.5 38.5 37.9777 38.5 37.3333V31.5C38.5 30.8557 37.9777 30.3333 37.3333 30.3333Z" stroke="white" strokeWidth="2" strokeLinecap="round" />
								<path d="M24.5 30.3333H18.6667C18.0223 30.3333 17.5 30.8557 17.5 31.5V37.3333C17.5 37.9777 18.0223 38.5 18.6667 38.5H24.5C25.1443 38.5 25.6667 37.9777 25.6667 37.3333V31.5C25.6667 30.8557 25.1443 30.3333 24.5 30.3333Z" stroke="white" strokeWidth="2" strokeLinecap="round" />
							</svg>
						</div>
						<span className="fw-bold plannr-logo-text">
							Plannr
						</span>
					</a>

					<div className="plannr-nav-divider d-none d-md-block"></div>

					<div className="collapse navbar-collapse d-none d-md-flex">
						<ul className="navbar-nav me-auto align-items-center gap-2">
							<li className="nav-item">
								<a
									className="nav-link nav-link-active rounded px-3 py-1"
									href={PATHS.TRELLO.HOME}
								>
									Workspaces
								</a>
							</li>
							<li className="nav-item">
								<a
									className="nav-link rounded px-2 py-1"
									href="#!"
								>
									Recent
								</a>
							</li>
							<li className="nav-item">
								<a
									className="nav-link rounded px-2 py-1"
									href="#!"
								>
									Starred
								</a>
							</li>
							<li className="nav-item">
								<a
									className="nav-link rounded px-2 py-1"
									href="#!"
								>
									Templates
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Right Actions (Search, Noti, Help, Avatar) */}
				<div className="d-flex align-items-center gap-3">
					<div className="search-box d-none d-sm-flex align-items-center">
						<span className="search-placeholder text-truncate">Search everything...</span>
						<kbd className="search-shortcut">/</kbd>
						<svg className="search-icon ms-1 flex-shrink-0" width="14" height="14" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M24.5002 24.5002L19.4369 19.4369M22.1667 12.8333C22.1667 17.988 17.988 22.1667 12.8333 22.1667C7.67868 22.1667 3.5 17.988 3.5 12.8333C3.5 7.67868 7.67868 3.5 12.8333 3.5C17.988 3.5 22.1667 7.67868 22.1667 12.8333Z" stroke="#44546F" strokeWidth="3" strokeLinecap="round" />
						</svg>
					</div>

					<div className="d-flex align-items-center gap-1">
						<button className="btn btn-sm btn-icon rounded-circle" type="button" aria-label="Notifications">
							<svg width="18" height="18" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M15.4 27.5C15.66 27.95 16.04 28.33 16.5 28.6C16.95 28.86 17.47 29 18 29C18.53 29 19.04 28.86 19.5 28.6C19.95 28.33 20.33 27.95 20.6 27.5M17.5 0.5C15.2 0.63 13.05 1.63 11.47 3.3C9.88 4.98 9 7.2 9 9.5C9 16.25 6.88 18.43 4.89 20.5C4.7 20.7 4.57 20.97 4.52 21.26C4.47 21.55 4.51 21.84 4.63 22.1C4.74 22.37 4.94 22.6 5.18 22.75C5.42 22.91 5.71 23 6 23H30C30.29 23 30.57 22.91 30.82 22.75C31.06 22.6 31.25 22.37 31.37 22.1C31.49 21.84 31.53 21.55 31.48 21.26C31.43 20.97 31.3 20.7 31.11 20.5C29.87 19.22 28.59 17.89 27.79 15.47M31.5 5C31.5 7.48 29.48 9.5 27 9.5C24.51 9.5 22.5 7.48 22.5 5C22.5 2.51 24.51 0.5 27 0.5C29.48 0.5 31.5 2.51 31.5 5Z" stroke="#44546F" strokeWidth="2.5" strokeLinecap="round" />
							</svg>
						</button>
						<button className="btn btn-sm btn-icon rounded-circle" type="button" aria-label="Help & Information">
							<svg width="18" height="18" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M13.5 5.2C13.59 4.34 13.99 3.53 14.64 2.94C15.28 2.35 16.13 2.03 17 2.03C17.87 2.03 18.72 2.35 19.36 2.94C20.01 3.53 20.41 4.34 20.5 5.2C20.54 5.77 20.73 6.31 21.03 6.78C21.34 7.26 21.75 7.65 22.24 7.94C22.73 8.22 23.27 8.38 23.84 8.4C24.4 8.43 24.96 8.32 25.47 8.08C26.27 7.72 27.17 7.67 28 7.93C28.83 8.2 29.53 8.76 29.96 9.52C30.4 10.27 30.54 11.16 30.35 12.01C30.17 12.87 29.68 13.62 28.97 14.13C28.51 14.45 28.13 14.88 27.87 15.38C27.61 15.88 27.47 16.44 27.47 17C27.47 17.56 27.61 18.12 27.87 18.62C28.13 19.12 28.51 19.55 28.97 19.87C29.68 20.38 30.17 21.13 30.35 21.99C30.54 22.84 30.4 23.73 29.96 24.48C29.53 25.24 28.83 25.8 28 26.07C27.17 26.34 26.27 26.28 25.47 25.92C24.96 25.68 24.4 25.57 23.84 25.6C23.27 25.62 22.73 25.78 22.24 26.06C21.75 26.35 21.34 26.74 21.03 27.22C20.73 27.69 20.54 28.23 20.5 28.8C20.41 29.66 20.01 30.47 19.36 31.06C18.72 31.65 17.87 31.97 17 31.97C16.13 31.97 15.28 31.65 14.64 31.06C13.99 30.47 13.59 29.66 13.5 28.8C13.46 28.23 13.27 27.69 12.97 27.22C12.67 26.74 12.25 26.35 11.76 26.06C11.27 25.78 10.72 25.62 10.16 25.6C9.6 25.57 9.04 25.68 8.53 25.92C7.73 26.28 6.83 26.34 6 26.07C5.17 25.8 4.47 25.24 4.04 24.48C3.6 23.73 3.46 22.84 3.64 21.99C3.83 21.13 4.32 20.38 5.03 19.87C5.49 19.55 5.87 19.12 6.13 18.62C6.39 18.12 6.52 17.56 6.52 17C6.52 16.44 6.39 15.88 6.13 15.38C5.87 14.88 5.49 14.45 5.03 14.13C4.32 13.62 3.83 12.87 3.65 12.02C3.46 11.16 3.6 10.27 4.04 9.52C4.47 8.77 5.17 8.2 6 7.93C6.83 7.67 7.73 7.72 8.52 8.08C9.04 8.32 9.6 8.43 10.16 8.4C10.72 8.38 11.27 8.22 11.76 7.94C12.25 7.65 12.66 7.26 12.97 6.78C13.27 6.31 13.45 5.77 13.5 5.2M21.5 17C21.5 19.49 19.48 21.5 17 21.5C14.51 21.5 12.5 19.49 12.5 17C12.5 14.52 14.51 12.5 17 12.5C19.48 12.5 21.5 14.52 21.5 17Z" stroke="#44546F" strokeWidth="2.5" strokeLinecap="round" />
							</svg>
						</button>
					</div>

					{/* Profile Dropdown */}
					<div className="dropdown">
						<div
							className="avatar-circle cursor-pointer"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							<img
								src={userAvatar}
								alt={userName}
								className="w-100 h-100 rounded-circle shadow-sm"
								style={{ objectFit: 'cover' }}
							/>
						</div>

						<ul className="dropdown-menu dropdown-menu-end trello-profile-dropdown shadow-sm mt-2">
							<li className="dropdown-header">Account</li>
							<li>
								<div className="d-flex align-items-center px-3 py-2 mb-1">
									<div className="avatar-circle-lg me-3">
										<img
											src={userAvatar}
											alt={userName}
											className="w-100 h-100 rounded-circle"
										/>
									</div>
									<div className="user-info">
										<div className="fw-bold fs-6">
											{userName}
										</div>
										<div className="text-muted fs-8">
											{userEmail}
										</div>
									</div>
								</div>
							</li>
							<li>
								<a className="dropdown-item" href="#!">
									Switch accounts
								</a>
							</li>
							<li>
								<a
									className="dropdown-item d-flex justify-content-between align-items-center"
									href="#!"
								>
									Manage account{' '}
									<i className="bi bi-box-arrow-up-right fs-8 text-muted"></i>
								</a>
							</li>

							<li>
								<hr className="dropdown-divider" />
							</li>

							<li className="dropdown-header">Trello</li>
							<li>
								<a className="dropdown-item" href="#!">
									Profile and visibility
								</a>
							</li>
							<li>
								<a className="dropdown-item" href="#!">
									Activity
								</a>
							</li>
							<li>
								<a className="dropdown-item" href="#!">
									Cards
								</a>
							</li>
							<li>
								<a className="dropdown-item" href="#!">
									Settings
								</a>
							</li>
							<li>
								<a
									className="dropdown-item d-flex justify-content-between align-items-center"
									href="#!"
								>
									Labs
									<span
										className="badge text-dark fs-8 px-2 py-1"
										style={{ backgroundColor: '#f5cd47' }}
									>
										<i className="bi bi-stars me-1"></i>Labs
									</span>
								</a>
							</li>
							<li>
								<a
									className="dropdown-item d-flex justify-content-between align-items-center"
									href="#!"
								>
									<span>
										<i className="bi bi-circle-half me-2"></i>{' '}
										Theme
									</span>
									<i className="bi bi-chevron-right fs-8 text-muted"></i>
								</a>
							</li>

							<li>
								<hr className="dropdown-divider" />
							</li>

							<li>
								<a className="dropdown-item" href="#!">
									<i className="bi bi-people me-2 fs-6"></i>{' '}
									Create Workspace
								</a>
							</li>

							<li>
								<hr className="dropdown-divider" />
							</li>

							<li>
								<a className="dropdown-item" href="#!">
									Help
								</a>
							</li>
							<li>
								<a className="dropdown-item" href="#!">
									Shortcuts
								</a>
							</li>

							<li>
								<hr className="dropdown-divider" />
							</li>

							<li>
								<button
									type="button"
									className="dropdown-item text-danger d-flex align-items-center gap-2 border-0 bg-transparent w-100 text-start"
									onClick={handleLogout}
								>
									<i className="bi bi-box-arrow-right"></i>{' '}
									Log out
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};
