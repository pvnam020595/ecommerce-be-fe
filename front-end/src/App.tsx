import 'bootstrap/dist/css/bootstrap.min.css';
import '@css/index.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import React, { useState, useCallback, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { PATHS, PLATFORM_ROUTES, type PlatformKey } from '@router/paths';
import { PLATFORM_OPTIONS } from '@mock/ui';
import Button from '@/components/common/Button/Button';

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const [isOpen, setIsOpen] = useState<boolean>(true);
	const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey | ''>(
		''
	);

	const isRootPath = location.pathname === PATHS.ROOT;
	const showModal = isRootPath && isOpen;

	const handleNavigate = useCallback(
		(platform: PlatformKey): void => {
			const route = PLATFORM_ROUTES[platform];
			if (route) {
				navigate(route, { replace: true });
				setIsOpen(false);
			}
		},
		[navigate]
	);

	const handlePlatformChange = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>): void => {
			const value = event.target.value as PlatformKey;
			setSelectedPlatform(value);
			const route = PLATFORM_ROUTES[value];

			if (route) {
				navigate(route, { replace: true });
				setIsOpen(false);
			}
		},
		[navigate]
	);

	// Close modal on Escape key press
	useEffect(() => {
		if (!showModal) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [showModal]);

	return (
		<div className="container-fluid min-vh-100 p-0 position-relative">
			{/* Centered responsive modal */}
			{showModal && (
				<div
					className="modal fade show d-block"
					tabIndex={-1}
					role="dialog"
					aria-labelledby="platformModalTitle"
					aria-modal="true"
					style={{ backgroundColor: 'rgba(248, 241, 241, 0.5)' }}
				>
					<div className="modal-dialog modal-dialog-centered px-3">
						<div className="modal-content shadow-lg border-0 rounded-3">
							<div className="modal-header border-0 pb-0">
								<h5
									className="modal-title fw-bold"
									id="platformModalTitle"
								>
									Select Platform
								</h5>
								<button
									type="button"
									className="btn-close"
									aria-label="Close"
									onClick={() => setIsOpen(false)}
								/>
							</div>

							<div className="modal-body py-4">
								<p className="text-muted mb-3">
									Please choose the platform you would like to
									navigate to:
								</p>

								{/* Platform Quick Action Buttons */}
								<div className="d-grid gap-2 mb-3">
									{PLATFORM_OPTIONS.map(
										({ key, label, btnClass }) => (
											<button
												key={key}
												type="button"
												className={`btn ${btnClass} d-flex align-items-center justify-content-between py-2 px-3`}
												onClick={() =>
													handleNavigate(key)
												}
											>
												<span className="fw-semibold">
													{label}
												</span>
												<span>&rarr;</span>
											</button>
										)
									)}
								</div>

								<div className="d-flex align-items-center my-3">
									<hr className="flex-grow-1" />
									<span className="px-2 text-muted small">
										OR
									</span>
									<hr className="flex-grow-1" />
								</div>

								{/* Select dropdown option */}
								<select
									className="form-select"
									value={selectedPlatform}
									onChange={handlePlatformChange}
									aria-label="Choose platform select"
								>
									<option value="" disabled>
										Open this select menu
									</option>
									{PLATFORM_OPTIONS.map(({ key, label }) => (
										<option key={key} value={key}>
											{label}
										</option>
									))}
								</select>
							</div>

							<div className="modal-footer border-0 pt-0">
								<button
									type="button"
									className="btn btn-secondary w-100"
									onClick={() => setIsOpen(false)}
								>
									Close
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			{/* Center page prompt if user closed the modal on root path */}
			{isRootPath && !isOpen && (
				<div className="d-flex justify-content-center align-items-center min-vh-100">
					<div className="text-center p-4">
						<h2 className="mb-3">Welcome</h2>
						<p className="text-muted mb-4">
							Choose a platform to get started.
						</p>
						<Button
							className="btn btn-primary px-4 py-2"
							onClick={() => setIsOpen(true)}
						>
							Open Platform Selector
						</Button>
					</div>
				</div>
			)}

			{/* Child route content */}
			<Outlet />
		</div>
	);
}

export default App;
