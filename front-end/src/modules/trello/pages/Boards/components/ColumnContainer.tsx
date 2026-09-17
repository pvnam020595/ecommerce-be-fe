import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
	useSortable,
	SortableContext,
	verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column, Card } from '@modules/trello/interfaces/BoardInterface';
import { CardItem } from './CardItem';

interface ColumnContainerProps {
	column: Column;
	allColumns?: Column[];
	onAddCard: (columnId: string, title: string) => void;
	onEditCard: (
		columnId: string,
		cardId: string,
		updates: Partial<Card>
	) => void;
	onDeleteCard: (columnId: string, cardId: string) => void;
	onEditColumn: (columnId: string, title: string) => void;
	onDeleteColumn: (columnId: string) => void;
	onMoveCard?: (card: Card, targetColumnId: string) => void;
	disableDrag?: boolean;
}

export const ColumnContainer = ({
	column,
	allColumns = [],
	onAddCard,
	onEditCard,
	onDeleteCard,
	onEditColumn,
	onDeleteColumn,
	onMoveCard,
	disableDrag = false
}: ColumnContainerProps) => {
	const [isAdding, setIsAdding] = useState(false);
	const [newCardTitle, setNewCardTitle] = useState('');
	const [showMenu, setShowMenu] = useState(false);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [editTitle, setEditTitle] = useState(column.title);

	const {
		attributes,
		listeners,
		setNodeRef: setSortableNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({
		id: column.id,
		data: {
			type: 'column',
			column
		},
		disabled: disableDrag || isEditingTitle
	});

	const { setNodeRef: setDroppableNodeRef } = useDroppable({
		id: `column-${column.id}`,
		data: {
			type: 'column',
			column
		}
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1
	};

	const handleAddCard = () => {
		if (newCardTitle.trim()) {
			onAddCard(column.id, newCardTitle.trim());
			setNewCardTitle('');
			setIsAdding(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleAddCard();
		}
		if (e.key === 'Escape') {
			setIsAdding(false);
			setNewCardTitle('');
		}
	};

	const handleTitleSave = () => {
		if (editTitle.trim() && editTitle !== column.title) {
			onEditColumn(column.id, editTitle.trim());
		} else {
			setEditTitle(column.title);
		}
		setIsEditingTitle(false);
	};

	return (
		<div
			ref={setSortableNodeRef}
			style={style}
			className="board-column d-flex flex-column rounded-3"
		>
			{/* Column Header */}
			<div className="column-header d-flex align-items-center justify-content-between px-2 pt-2 pb-1">
				{isEditingTitle ? (
					<input
						type="text"
						className="form-control form-control-sm flex-grow-1"
						value={editTitle}
						onChange={e => setEditTitle(e.target.value)}
						onBlur={handleTitleSave}
						onKeyDown={e => {
							if (e.key === 'Enter') handleTitleSave();
							if (e.key === 'Escape') {
								setEditTitle(column.title);
								setIsEditingTitle(false);
							}
						}}
						autoFocus
					/>
				) : (
					<h6
						className="fw-bold m-0 fs-7 text-truncate flex-grow-1 column-drag-handle"
						{...(disableDrag ? {} : attributes)}
						{...(disableDrag ? {} : listeners)}
						style={{ cursor: disableDrag ? 'pointer' : 'grab' }}
						onClick={() => setIsEditingTitle(true)}
					>
						{column.title}
					</h6>
				)}
				<div className="dropdown ms-2 position-relative">
					<button
						className={`btn btn-sm p-0 border-0 ${showMenu ? 'text-dark' : 'text-muted'} rounded-circle d-flex align-items-center justify-content-center`}
						style={{ width: '28px', height: '28px' }}
						onClick={() => setShowMenu(!showMenu)}
						title="Column actions"
					>
						<i className="bi bi-three-dots-vertical fs-6"></i>
					</button>
					{showMenu && (
						<ul
							className="dropdown-menu show shadow-lg border-0 py-2 position-absolute end-0"
							style={{
								zIndex: 1050,
								minWidth: '200px',
								borderRadius: '12px',
								boxShadow:
									'0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)'
							}}
						>
							<li className="px-3 py-1 border-bottom mb-1">
								<span
									className="text-uppercase text-muted fw-bold"
									style={{
										fontSize: '0.7rem',
										letterSpacing: '0.5px'
									}}
								>
									Column Options
								</span>
							</li>
							<li>
								<button
									className="dropdown-item text-danger d-flex align-items-center gap-2 px-3 py-2 fs-7 rounded-2 mx-1"
									style={{ width: 'calc(100% - 8px)' }}
									onClick={() => {
										onDeleteColumn(column.id);
										setShowMenu(false);
									}}
								>
									<i className="bi bi-trash3"></i> Delete
									Column
								</button>
							</li>
						</ul>
					)}
				</div>
			</div>

			{/* Cards Container */}
			<div
				ref={setDroppableNodeRef}
				className="column-cards flex-grow-1 overflow-auto px-2 py-1"
			>
				<SortableContext
					items={column.cards.map(c => c.id)}
					strategy={verticalListSortingStrategy}
				>
					{column.cards.map(card => (
						<CardItem
							key={card.id}
							card={card}
							currentColumnId={column.id}
							columns={allColumns}
							onEdit={(cardId, updates) =>
								onEditCard(column.id, cardId, updates)
							}
							onDelete={cardId => onDeleteCard(column.id, cardId)}
							onMoveCard={onMoveCard}
							disableDrag={disableDrag}
						/>
					))}
				</SortableContext>
			</div>

			{/* Add Card */}
			<div className="column-footer px-2 pb-2">
				{isAdding ? (
					<div className="add-card-form">
						<textarea
							className="form-control form-control-sm mb-1 border-0 shadow-sm"
							rows={2}
							placeholder="Enter a title for this card..."
							value={newCardTitle}
							onChange={e => setNewCardTitle(e.target.value)}
							onKeyDown={handleKeyDown}
							autoFocus
						/>
						<div className="d-flex align-items-center gap-1">
							<button
								className="btn btn-primary btn-sm fw-semibold"
								onClick={handleAddCard}
							>
								Add card
							</button>
							<button
								className="btn btn-sm text-muted p-1"
								onClick={() => {
									setIsAdding(false);
									setNewCardTitle('');
								}}
							>
								<i className="bi bi-x-lg"></i>
							</button>
						</div>
					</div>
				) : (
					<button
						className="btn btn-sm text-muted w-100 text-start d-flex align-items-center gap-1 add-card-btn"
						onClick={() => setIsAdding(true)}
					>
						<i className="bi bi-plus-lg"></i>
						<span>Add a card</span>
					</button>
				)}
			</div>
			{showMenu && (
				<div
					className="position-fixed top-0 start-0 w-100 h-100"
					style={{ zIndex: 999 }}
					onClick={() => setShowMenu(false)}
				></div>
			)}
		</div>
	);
};
