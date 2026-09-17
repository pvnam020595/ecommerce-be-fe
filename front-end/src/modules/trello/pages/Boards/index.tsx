import { useState, useCallback, useMemo } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useSelector, useDispatch } from 'react-redux';
import {
	DndContext,
	DragOverlay,
	closestCorners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragStartEvent,
	DragOverEvent,
	DragEndEvent
} from '@dnd-kit/core';
import {
	sortableKeyboardCoordinates,
	SortableContext,
	horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import type { RootState } from '@redux/store';
import { Card, Column } from '../../interfaces/BoardInterface';
import {
	moveCard,
	addCard,
	editCard,
	deleteCard,
	addColumn,
	editColumn,
	deleteColumn,
	moveColumn
} from '../../redux/actions/boardActions';
import { ColumnContainer } from './components/ColumnContainer';
import { Navbar } from '@modules/trello/components/Navbar';
import '@css/trello/board.css';
import '@css/trello/home.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const Boards = () => {
	const dispatch = useDispatch();
	const board = useSelector((state: RootState) => state.board);
	const [activeCard, setActiveCard] = useState<Card | null>(null);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null);
	const [isAddingColumn, setIsAddingColumn] = useState(false);
	const [newColumnTitle, setNewColumnTitle] = useState('');
	const isMobile = useIsMobile();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5
			}
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates
		})
	);

	// On mobile/tablet, use no sensors to completely disable drag-drop
	const activeSensors = useMemo(
		() => (isMobile ? [] : sensors),
		[isMobile, sensors]
	);

	const findColumnByCardId = useCallback(
		(cardId: string): Column | undefined => {
			return board.columns.find(col =>
				col.cards.some(card => card.id === cardId)
			);
		},
		[board.columns]
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const activeData = active.data.current;

		// Dragging a column
		if (activeData?.type === 'column') {
			const column =
				(activeData.column as Column) ||
				board.columns.find(col => col.id === active.id);
			if (column) {
				setActiveColumn(column);
			}
			return;
		}

		// Dragging a card
		const card =
			(activeData?.card as Card | undefined) ||
			board.columns
				.flatMap(col => col.cards)
				.find(c => c.id === active.id);
		if (card) {
			setActiveCard(card);
		}
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		// Ignore column drag events in drag over (columns reorder only on dragEnd)
		if (active.data.current?.type === 'column') return;

		const activeId = active.id as string;
		const overId = over.id as string;

		const sourceColumn = findColumnByCardId(activeId);
		const targetColumn =
			findColumnByCardId(overId) ||
			board.columns.find(col => col.id === overId);

		if (!sourceColumn || !targetColumn) return;

		// Move to another column
		if (sourceColumn.id !== targetColumn.id) {
			const activeCardItem = sourceColumn.cards.find(
				c => c.id === activeId
			);
			if (!activeCardItem) return;

			const overIndex = targetColumn.cards.findIndex(
				c => c.id === overId
			);
			const newIndex =
				overIndex >= 0 ? overIndex : targetColumn.cards.length;

			dispatch(
				moveCard(
					activeCardItem,
					sourceColumn.id,
					targetColumn.id,
					newIndex
				)
			);
		}
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveCard(null);
		setActiveColumn(null);

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		// Column reordering
		if (active.data.current?.type === 'column') {
			if (activeId !== overId) {
				const oldIndex = board.columns.findIndex(
					col => col.id === activeId
				);
				const newIndex = board.columns.findIndex(
					col => col.id === overId
				);
				if (oldIndex !== -1 && newIndex !== -1) {
					dispatch(moveColumn(oldIndex, newIndex));
				}
			}
			return;
		}

		// Card reordering inside the same column
		const sourceColumn = findColumnByCardId(activeId);
		const targetColumn = findColumnByCardId(overId);

		if (
			sourceColumn &&
			targetColumn &&
			sourceColumn.id === targetColumn.id
		) {
			const oldIndex = sourceColumn.cards.findIndex(
				c => c.id === activeId
			);
			const newIndex = sourceColumn.cards.findIndex(c => c.id === overId);

			if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
				const card = sourceColumn.cards[oldIndex];
				dispatch(
					moveCard(card, sourceColumn.id, sourceColumn.id, newIndex)
				);
			}
		}
	};

	const handleAddCard = useCallback(
		(columnId: string, title: string) => {
			dispatch(addCard(columnId, title));
		},
		[dispatch]
	);

	const handleEditCard = useCallback(
		(columnId: string, cardId: string, updates: Partial<Card>) => {
			dispatch(editCard(columnId, cardId, updates));
		},
		[dispatch]
	);

	const handleDeleteCard = useCallback(
		(columnId: string, cardId: string) => {
			dispatch(deleteCard(columnId, cardId));
		},
		[dispatch]
	);

	const handleMoveCardToColumn = useCallback(
		(card: Card, targetColumnId: string) => {
			const sourceColumn = findColumnByCardId(card.id);
			if (!sourceColumn || sourceColumn.id === targetColumnId) return;

			const targetColumn = board.columns.find(
				col => col.id === targetColumnId
			);
			if (!targetColumn) return;

			dispatch(
				moveCard(
					card,
					sourceColumn.id,
					targetColumnId,
					targetColumn.cards.length
				)
			);
		},
		[board.columns, dispatch, findColumnByCardId]
	);

	const handleAddColumn = () => {
		if (newColumnTitle.trim()) {
			dispatch(addColumn(newColumnTitle.trim()));
			setNewColumnTitle('');
			setIsAddingColumn(false);
		}
	};

	const handleEditColumn = useCallback(
		(columnId: string, newTitle: string) => {
			dispatch(editColumn(columnId, newTitle));
		},
		[dispatch]
	);

	const handleDeleteColumn = useCallback(
		(columnId: string) => {
			if (window.confirm('Are you sure you want to delete this list?')) {
				dispatch(deleteColumn(columnId));
			}
		},
		[dispatch]
	);

	return (
		<div className="trello-board-wrapper vh-100 d-flex flex-column overflow-hidden">
			<Navbar />
			<div className="board-container flex-grow-1 d-flex flex-column overflow-hidden">
				{/* Board Header */}
				<div className="board-header d-flex flex-wrap align-items-center justify-content-between px-3 px-md-4 py-2 gap-2">
					{/* Left Header: Title, Star, Divider, Visibility, Divider, Members */}
					<div className="d-flex align-items-center flex-wrap gap-2 gap-md-3">
						<h2 className="board-header-title m-0">
							{board.title || 'Acme Mobile App Redesign'}
						</h2>

						<button
							className="btn btn-board-star p-0 d-flex align-items-center justify-content-center"
							type="button"
							aria-label="Star board"
						>
							<i className="bi bi-star"></i>
						</button>

						<div className="board-header-divider d-none d-sm-block"></div>

						<button
							className="btn btn-board-visibility d-flex align-items-center gap-2"
							type="button"
						>
							<i className="bi bi-lock"></i>
							<span className="d-none d-sm-inline">
								Workspace Visible
							</span>
						</button>

						<div className="board-header-divider d-none d-md-block"></div>

						{/* Members Stack */}
						<div className="board-header-members d-flex align-items-center">
							<img
								src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
								alt="Member 1"
								className="member-avatar"
							/>
							<img
								src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
								alt="Member 2"
								className="member-avatar"
							/>
							<div className="member-avatar member-avatar-initials bg-emerald">
								DC
							</div>
							<div className="member-avatar member-avatar-initials bg-pink">
								ML
							</div>
							<button
								className="member-avatar member-add-btn d-flex align-items-center justify-content-center"
								type="button"
								aria-label="Add member"
							>
								<i className="bi bi-plus-lg"></i>
							</button>
						</div>
					</div>

					{/* Right Header: Filter, Sort, Automations */}
					<div className="d-flex align-items-center gap-1 gap-md-2 ms-auto ms-md-0">
						<button
							className="btn btn-board-action-btn d-flex align-items-center gap-1 gap-md-2"
							type="button"
							title="Filter Cards"
						>
							<i className="bi bi-funnel"></i>
							<span className="d-none d-md-inline">
								Filter Cards
							</span>
						</button>

						<button
							className="btn btn-board-action-btn d-flex align-items-center gap-1 gap-md-2"
							type="button"
							title="Sort By"
						>
							<i className="bi bi-sort-down"></i>
							<span className="d-none d-md-inline">Sort By</span>
						</button>

						<button
							className="btn btn-board-action-btn d-flex align-items-center gap-1 gap-md-2"
							type="button"
							title="Automations"
						>
							<i className="bi bi-lightning-charge"></i>
							<span className="d-none d-md-inline">
								Automations
							</span>
						</button>
					</div>
				</div>

				{/* Board Content with DnD */}
				<div className="board-content d-flex gap-3 p-3 overflow-auto">
					<DndContext
						sensors={activeSensors}
						collisionDetection={closestCorners}
						onDragStart={handleDragStart}
						onDragOver={handleDragOver}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={board.columns.map(col => col.id)}
							strategy={horizontalListSortingStrategy}
						>
							{board.columns.map(column => (
								<ColumnContainer
									key={column.id}
									column={column}
									allColumns={board.columns}
									onAddCard={handleAddCard}
									onEditCard={handleEditCard}
									onDeleteCard={handleDeleteCard}
									onEditColumn={handleEditColumn}
									onDeleteColumn={handleDeleteColumn}
									onMoveCard={handleMoveCardToColumn}
									disableDrag={isMobile}
								/>
							))}
						</SortableContext>

						{!isMobile && (
							<DragOverlay>
								{activeColumn ? (
									<div className="board-column d-flex flex-column rounded-3 column-overlay">
										<div className="column-header d-flex align-items-center justify-content-between px-2 pt-2 pb-1">
											<h6 className="fw-bold m-0 fs-7 text-truncate">
												{activeColumn.title}
											</h6>
											<button className="btn btn-sm p-0 border-0 text-muted">
												<i className="bi bi-three-dots-vertical"></i>
											</button>
										</div>
										<div className="column-cards flex-grow-1 overflow-auto px-2 py-1">
											{activeColumn.cards.map(card => (
												<div
													key={card.id}
													className="card-item bg-white rounded-2 shadow-sm p-2 mb-2"
												>
													<span className="fs-8">
														{card.title}
													</span>
												</div>
											))}
										</div>
									</div>
								) : null}
								{activeCard ? (
									<div className="card-item bg-white rounded-2 shadow p-2 rotate-drag">
										<span className="fs-8">
											{activeCard.title}
										</span>
									</div>
								) : null}
							</DragOverlay>
						)}
					</DndContext>

					{/* Add Column */}
					<div className="add-column-container">
						{isAddingColumn ? (
							<div className="board-column rounded-3 p-2">
								<input
									type="text"
									className="form-control form-control-sm mb-2"
									placeholder="Enter list title..."
									value={newColumnTitle}
									onChange={e =>
										setNewColumnTitle(e.target.value)
									}
									onKeyDown={e => {
										if (e.key === 'Enter')
											handleAddColumn();
										if (e.key === 'Escape') {
											setIsAddingColumn(false);
											setNewColumnTitle('');
										}
									}}
									autoFocus
								/>
								<div className="d-flex align-items-center gap-1">
									<button
										className="btn btn-primary btn-sm fw-semibold"
										onClick={handleAddColumn}
									>
										Add list
									</button>
									<button
										className="btn btn-sm text-muted p-1"
										onClick={() => {
											setIsAddingColumn(false);
											setNewColumnTitle('');
										}}
									>
										<i className="bi bi-x-lg"></i>
									</button>
								</div>
							</div>
						) : (
							<button
								className="btn add-column-btn d-flex align-items-center gap-2 rounded-3 px-3 py-2"
								onClick={() => setIsAddingColumn(true)}
							>
								<i className="bi bi-plus-lg"></i>
								<span>Add another list</span>
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
