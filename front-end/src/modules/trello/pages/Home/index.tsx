import '@css/trello/home.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@router/paths';
import { Navbar } from '@modules/trello/components/Navbar';
import { useIsMobile } from '../../hooks/useIsMobile';

// ─── Sidebar (Desktop) ──────────────────────────────────────────────────────

interface SidebarProps {
	workspaceName?: string;
}

const Sidebar = ({ workspaceName = 'Workspace settings' }: SidebarProps) => {
	const [wsOpen, setWsOpen] = useState(true);

	return (
		<aside className="trello-sidebar pt-4 px-3 d-none d-md-block">
			{/* Workspace Settings — collapsible toggle */}
			<ul className="nav flex-column gap-1 mb-1">
				<li className="nav-item">
					<button
						type="button"
						className="nav-link d-flex align-items-center text-dark rounded px-3 py-2 w-100 border-0 bg-transparent text-start"
						onClick={() => setWsOpen(prev => !prev)}
						aria-expanded={wsOpen}
						aria-controls="ws-collapse"
					>
						<i className="bi bi-gear me-2"></i>
						<span className="flex-grow-1">{workspaceName}</span>
						<i
							className={`bi bi-chevron-${wsOpen ? 'up' : 'down'} fs-8`}
						></i>
					</button>
				</li>
			</ul>

			{/* Collapse content: Boards, Members, Settings */}
			<div
				id="ws-collapse"
				className={`ps-2 mb-3 ${wsOpen ? 'd-block' : 'd-none'}`}
			>
				<ul className="nav flex-column gap-1">
					<li className="nav-item">
						<a
							className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
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
							<i className="bi bi-people me-2"></i> Members
						</a>
					</li>
					<li className="nav-item">
						<a
							className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
							href="#!"
						>
							<i className="bi bi-sliders me-2"></i> Settings
						</a>
					</li>
				</ul>
			</div>

			{/* Personal Settings group */}
			<hr className="my-2" />
			<div className="fw-semibold fs-7 text-muted mb-2 px-3">
				Personal settings
			</div>
			<ul className="nav flex-column gap-1 mb-3">
				<li className="nav-item">
					<a
						className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
						href="#!"
					>
						<i className="bi bi-person-circle me-2"></i> Profile
					</a>
				</li>
				<li className="nav-item">
					<a
						className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
						href="#!"
					>
						<i className="bi bi-card-checklist me-2"></i> Cards
					</a>
				</li>
				<li className="nav-item">
					<a
						className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
						href="#!"
					>
						<i className="bi bi-gear-wide-connected me-2"></i>{' '}
						Settings
					</a>
				</li>
			</ul>
		</aside>
	);
};

// ─── Mobile Sidebar (Slide-in Drawer) ────────────────────────────────────────

interface MobileSidebarProps {
	isOpen: boolean;
	onClose: () => void;
	workspaceName?: string;
}

const MobileSidebar = ({
	isOpen,
	onClose,
	workspaceName = 'Workspace settings'
}: MobileSidebarProps) => {
	const [wsOpen, setWsOpen] = useState(true);

	return (
		<>
			{/* Overlay */}
			<div
				className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
				onClick={onClose}
			/>

			{/* Drawer */}
			<div
				className={`trello-sidebar-mobile px-3 ${isOpen ? 'show' : ''}`}
			>
				<button
					type="button"
					className="sidebar-close-btn"
					onClick={onClose}
					aria-label="Close sidebar"
				>
					<i className="bi bi-x-lg"></i>
				</button>

				<ul className="nav flex-column gap-1 mb-1 mt-4">
					<li className="nav-item">
						<button
							type="button"
							className="nav-link d-flex align-items-center text-dark rounded px-3 py-2 w-100 border-0 bg-transparent text-start"
							onClick={() => setWsOpen(prev => !prev)}
						>
							<i className="bi bi-gear me-2"></i>
							<span className="flex-grow-1">
								{workspaceName}
							</span>
							<i
								className={`bi bi-chevron-${wsOpen ? 'up' : 'down'} fs-8`}
							></i>
						</button>
					</li>
				</ul>

				<div className={`ps-2 mb-3 ${wsOpen ? 'd-block' : 'd-none'}`}>
					<ul className="nav flex-column gap-1">
						<li className="nav-item">
							<a
								className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
								href="#!"
								onClick={onClose}
							>
								<i className="bi bi-trello me-2"></i> Boards
							</a>
						</li>
						<li className="nav-item">
							<a
								className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
								href="#!"
								onClick={onClose}
							>
								<i className="bi bi-people me-2"></i> Members
							</a>
						</li>
						<li className="nav-item">
							<a
								className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
								href="#!"
								onClick={onClose}
							>
								<i className="bi bi-sliders me-2"></i> Settings
							</a>
						</li>
					</ul>
				</div>

				<hr className="my-2" />
				<div className="fw-semibold fs-7 text-muted mb-2 px-3">
					Personal settings
				</div>
				<ul className="nav flex-column gap-1 mb-3">
					<li className="nav-item">
						<a
							className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
							href="#!"
							onClick={onClose}
						>
							<i className="bi bi-person-circle me-2"></i>{' '}
							Profile
						</a>
					</li>
					<li className="nav-item">
						<a
							className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
							href="#!"
							onClick={onClose}
						>
							<i className="bi bi-card-checklist me-2"></i> Cards
						</a>
					</li>
					<li className="nav-item">
						<a
							className="nav-link d-flex align-items-center text-dark rounded px-3 py-2"
							href="#!"
							onClick={onClose}
						>
							<i className="bi bi-gear-wide-connected me-2"></i>{' '}
							Settings
						</a>
					</li>
				</ul>
			</div>
		</>
	);
};

// ─── Create Board Modal ───────────────────────────────────────────────────────

type BgType = 'image' | 'color';

interface BgOption {
	type: BgType;
	value: string;
	label: string;
}

const BG_IMAGES: BgOption[] = [
	{
		type: 'image',
		value: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=400&auto=format&fit=crop',
		label: 'Mountain'
	},
	{
		type: 'image',
		value: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop',
		label: 'Lake'
	},
	{
		type: 'image',
		value: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=400&auto=format&fit=crop',
		label: 'Forest'
	},
	{
		type: 'image',
		value: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=400&auto=format&fit=crop',
		label: 'Sunset'
	}
];

const BG_COLORS: BgOption[] = [
	{ type: 'color', value: '#0079bf', label: 'Ocean' },
	{ type: 'color', value: '#d29034', label: 'Sand' },
	{ type: 'color', value: '#519839', label: 'Forest' },
	{ type: 'color', value: '#b04632', label: 'Ruby' },
	{ type: 'color', value: '#89609e', label: 'Grape' },
	{ type: 'color', value: '#cd5a91', label: 'Pink' }
];

interface CreateBoardModalProps {
	onClose: () => void;
}

const CreateBoardModal = ({ onClose }: CreateBoardModalProps) => {
	const [title, setTitle] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [selectedBg, setSelectedBg] = useState<BgOption>(BG_COLORS[0]);
	const titleRef = useRef<HTMLInputElement>(null);

	const previewStyle =
		selectedBg.type === 'image'
			? {
					backgroundImage: `url('${selectedBg.value}')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center'
				}
			: { backgroundColor: selectedBg.value };

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
		if (!title.trim()) {
			titleRef.current?.focus();
			return;
		}
		// TODO: dispatch create board action
		onClose();
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className="modal-backdrop fade show"
				style={{ zIndex: 1050 }}
				onClick={onClose}
			/>

			{/* Modal */}
			<div
				className="modal fade show d-block"
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-labelledby="createBoardTitle"
				style={{ zIndex: 1055 }}
				onClick={onClose}
			>
				<div
					className="modal-dialog modal-dialog-centered"
					onClick={e => e.stopPropagation()}
				>
					<div className="modal-content shadow-lg border-0 rounded-3">
						{/* Header */}
						<div className="modal-header border-0 pb-0">
							<h5
								className="modal-title fw-bold"
								id="createBoardTitle"
								style={{ fontSize: '1.6rem' }}
							>
								Create board
							</h5>
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={onClose}
							/>
						</div>

						<form onSubmit={handleSubmit} noValidate>
							<div className="modal-body pt-3">
								{/* ── Preview ── */}
								<div
									className="rounded-2 mb-4 p-2 d-flex gap-2 align-items-center justify-content-center overflow-hidden"
									style={{ height: 120, ...previewStyle }}
								>
									{['To Do', 'In Progress', 'Done'].map(
										col => (
											<div
												key={col}
												className="rounded-2 flex-shrink-0"
												style={{
													width: '30%',
													background:
														'rgba(255,255,255,0.75)',
													padding: '4px 6px'
												}}
											>
												<div
													style={{
														fontSize: 9,
														fontWeight: 700,
														color: '#172b4d',
														marginBottom: 4
													}}
												>
													{col}
												</div>
												{[1, 2].map(n => (
													<div
														key={n}
														className="rounded-1 mb-1"
														style={{
															height: 14,
															background:
																'rgba(255,255,255,0.9)'
														}}
													/>
												))}
											</div>
										)
									)}
								</div>

								{/* ── Background ── */}
								<div className="mb-3">
									<label className="form-label fw-semibold mb-2">
										<i className="bi bi-image me-1"></i>{' '}
										Background
									</label>

									{/* Image options */}
									<div className="d-flex gap-2 mb-2 flex-wrap">
										{BG_IMAGES.map(bg => (
											<button
												key={bg.value}
												type="button"
												onClick={() =>
													setSelectedBg(bg)
												}
												title={bg.label}
												className="p-0 border-0 rounded-2 overflow-hidden position-relative"
												style={{
													width: 56,
													height: 40,
													backgroundImage: `url('${bg.value}')`,
													backgroundSize: 'cover',
													backgroundPosition:
														'center',
													outline:
														selectedBg.value ===
														bg.value
															? '3px solid #0079bf'
															: '2px solid transparent',
													cursor: 'pointer',
													flexShrink: 0
												}}
											>
												{selectedBg.value ===
													bg.value && (
													<i
														className="bi bi-check2 text-white position-absolute top-50 start-50 translate-middle fw-bold"
														style={{ fontSize: 16 }}
													></i>
												)}
											</button>
										))}
									</div>

									{/* Color options */}
									<div className="d-flex gap-2 flex-wrap">
										{BG_COLORS.map(bg => (
											<button
												key={bg.value}
												type="button"
												onClick={() =>
													setSelectedBg(bg)
												}
												title={bg.label}
												className="p-0 border-0 rounded-2 position-relative"
												style={{
													width: 56,
													height: 40,
													backgroundColor: bg.value,
													outline:
														selectedBg.value ===
														bg.value
															? '3px solid #0079bf'
															: '2px solid transparent',
													cursor: 'pointer',
													flexShrink: 0
												}}
											>
												{selectedBg.value ===
													bg.value && (
													<i
														className="bi bi-check2 text-white position-absolute top-50 start-50 translate-middle fw-bold"
														style={{ fontSize: 16 }}
													></i>
												)}
											</button>
										))}
									</div>
								</div>

								{/* ── Title ── */}
								<div className="mb-1">
									<label
										htmlFor="boardTitle"
										className="form-label fw-semibold"
									>
										Board title{' '}
										<span className="text-danger">*</span>
									</label>
									<input
										ref={titleRef}
										id="boardTitle"
										type="text"
										className={`form-control ${submitted && !title.trim() ? 'is-invalid' : ''}`}
										placeholder="Enter board title"
										value={title}
										onChange={e => setTitle(e.target.value)}
										autoFocus
									/>
									{submitted && !title.trim() && (
										<div className="invalid-feedback">
											<i className="bi bi-exclamation-circle me-1"></i>
											Board title is required.
										</div>
									)}
								</div>
							</div>

							{/* Footer */}
							<div className="modal-footer border-0 pt-0">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={onClose}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn btn-primary"
								>
									<i className="bi bi-plus-lg me-1"></i>{' '}
									Create
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

// ─── Board Card ───────────────────────────────────────────────────────────────

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
		<Link
			to={linkTo}
			className="board-tile text-decoration-none position-relative"
			style={style}
		>
			<div className="board-overlay"></div>
			<div className="p-2 d-flex flex-column h-100 position-relative z-1">
				<span className="board-title">{title}</span>
				<i
					className={`bi ${isStarred ? 'bi-star-fill text-warning' : 'bi-star text-white'} mt-auto align-self-end star-icon`}
					onClick={toggleStar}
				></i>
			</div>
		</Link>
	);
};

// ─── Home ─────────────────────────────────────────────────────────────────────

export const Home = () => {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showMobileSidebar, setShowMobileSidebar] = useState(false);
	const isMobile = useIsMobile(768);

	return (
		<div className="trello-app vh-100 d-flex flex-column">
			<Navbar />

			<div className="d-flex flex-grow-1 overflow-hidden layout-body">
				{/* Desktop sidebar — hidden on mobile */}
				<Sidebar />

				{/* Mobile sidebar drawer */}
				{isMobile && (
					<MobileSidebar
						isOpen={showMobileSidebar}
						onClose={() => setShowMobileSidebar(false)}
					/>
				)}

				<main className="trello-main-content flex-grow-1 overflow-auto">
					<div className="boards-page-container">
						{/* Mobile hamburger trigger */}
						{isMobile && (
							<div className="d-flex align-items-center pt-3 pb-1">
								<button
									type="button"
									className="navbar-hamburger d-flex"
									onClick={() =>
										setShowMobileSidebar(true)
									}
									aria-label="Open sidebar"
								>
									<i className="bi bi-list"></i>
								</button>
							</div>
						)}

						{/* Workspace Header */}
						<div className="workspace-header">
							<div className="workspace-logo-xl">N</div>
							<div className="workspace-header-info flex-grow-1">
								<h2 className="d-flex align-items-center gap-2">
									Nam Pham's workspace{' '}
									<i className="bi bi-pencil fs-6 text-muted cursor-pointer hover-icon"></i>
								</h2>
								<span className="badge-free">Free</span>
							</div>
						</div>

						{/* Boards Section */}
						<div className="boards-section">
							<div className="boards-section-header">
								<div className="section-icon-box">
									<i className="bi bi-person fs-5"></i>
								</div>
								<h4>Your boards</h4>
							</div>

							<div className="board-grid">
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

								{/* Create new board tile */}
								<button
									type="button"
									className="board-tile create-board w-100"
									onClick={() => setShowCreateModal(true)}
								>
									<span>
										<i className="bi bi-plus me-1"></i>
										Create new board
									</span>
								</button>
							</div>
						</div>
					</div>
				</main>
			</div>

			{/* Create Board Modal */}
			{showCreateModal && (
				<CreateBoardModal
					onClose={() => setShowCreateModal(false)}
				/>
			)}
		</div>
	);
};
