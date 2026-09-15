import { useState, useCallback } from 'react';
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
import { TrelloRootState } from '../../redux/store';
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
import '@css/trello/board.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const Boards = () => {
	const dispatch = useDispatch();
	const board = useSelector((state: TrelloRootState) => state.board);
	const [activeCard, setActiveCard] = useState<Card | null>(null);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null);
	const [isAddingColumn, setIsAddingColumn] = useState(false);
	const [newColumnTitle, setNewColumnTitle] = useState('');

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
		let destColumn: Column | undefined;

		// Check if over a column droppable
		if (overId.startsWith('column-')) {
			const colId = overId.replace('column-', '');
			destColumn = board.columns.find(c => c.id === colId);
		} else {
			destColumn = findColumnByCardId(overId);
		}

		if (!sourceColumn || !destColumn || sourceColumn.id === destColumn.id)
			return;

		const draggedCard = sourceColumn.cards.find(c => c.id === activeId);
		if (!draggedCard) return;

		let newIndex = destColumn.cards.length;
		if (!overId.startsWith('column-')) {
			const overIndex = destColumn.cards.findIndex(c => c.id === overId);
			if (overIndex >= 0) {
				newIndex = overIndex;
			}
		}

		dispatch(
			moveCard(draggedCard, sourceColumn.id, destColumn.id, newIndex)
		);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveCard(null);
		setActiveColumn(null);

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		if (activeId === overId) return;

		// Column reordering
		if (active.data.current?.type === 'column') {
			let overColId = overId;
			// Resolve the target column id
			if (overColId.startsWith('column-')) {
				overColId = overColId.replace('column-', '');
			} else if (!board.columns.some(col => col.id === overColId)) {
				// Dropped over a card — find which column it belongs to
				const colWithCard = findColumnByCardId(overColId);
				if (colWithCard) {
					overColId = colWithCard.id;
				}
			}

			if (activeId !== overColId) {
				const sourceIndex = board.columns.findIndex(
					col => col.id === activeId
				);
				const destinationIndex = board.columns.findIndex(
					col => col.id === overColId
				);

				if (
					sourceIndex !== -1 &&
					destinationIndex !== -1 &&
					sourceIndex !== destinationIndex
				) {
					dispatch(moveColumn(sourceIndex, destinationIndex));
				}
			}
			return;
		}

		// Card reordering within same column
		const sourceColumn = findColumnByCardId(activeId);
		if (!sourceColumn) return;

		const overIndex = sourceColumn.cards.findIndex(c => c.id === overId);
		if (overIndex >= 0) {
			const draggedCard = sourceColumn.cards.find(c => c.id === activeId);
			if (draggedCard) {
				dispatch(
					moveCard(
						draggedCard,
						sourceColumn.id,
						sourceColumn.id,
						overIndex
					)
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
		<div className="board-container">
			{/* Board Header */}
			<div className="board-header d-flex align-items-center px-3 py-2">
				<h5 className="fw-bold text-white m-0 me-3">{board.title}</h5>
				<div className="d-flex align-items-center gap-2">
					<button className="btn btn-sm btn-board-action">
						<i className="bi bi-star"></i>
					</button>
					<button className="btn btn-sm btn-board-action">
						<i className="bi bi-people"></i> Members
					</button>
				</div>
			</div>

			{/* Board Content with DnD */}
			<div className="board-content d-flex gap-3 p-3 overflow-auto">
				<DndContext
					sensors={sensors}
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
							/>
						))}
					</SortableContext>

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
								<span className="fs-8">{activeCard.title}</span>
							</div>
						) : null}
					</DragOverlay>
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
									if (e.key === 'Enter') handleAddColumn();
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
	);
};
