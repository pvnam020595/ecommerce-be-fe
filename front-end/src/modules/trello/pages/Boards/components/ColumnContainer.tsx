import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column } from '../../../interfaces/BoardInterface';
import { CardItem } from './CardItem';

interface ColumnContainerProps {
	column: Column;
	onAddCard: (columnId: string, title: string) => void;
	onEditCard: (columnId: string, cardId: string, title: string) => void;
	onDeleteCard: (columnId: string, cardId: string) => void;
	onDeleteColumn: (columnId: string) => void;
}

export const ColumnContainer = ({ 
	column, 
	onAddCard, 
	onEditCard, 
	onDeleteCard, 
	onDeleteColumn 
}: ColumnContainerProps) => {
	const [isAdding, setIsAdding] = useState(false);
	const [newCardTitle, setNewCardTitle] = useState('');
	const [showMenu, setShowMenu] = useState(false);

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
		}
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

	return (
		<div
			ref={setSortableNodeRef}
			style={style}
			className="board-column d-flex flex-column rounded-3"
		>
			{/* Column Header */}
			<div className="column-header d-flex align-items-center justify-content-between px-2 pt-2 pb-1">
				<h6 
					className="fw-bold m-0 fs-7 text-truncate flex-grow-1 column-drag-handle"
					{...attributes}
					{...listeners}
					style={{ cursor: 'grab' }}
				>
					{column.title}
				</h6>
				<div className="dropdown">
					<button
						className="btn btn-sm p-0 border-0 text-muted"
						onClick={() => setShowMenu(!showMenu)}
					>
						<i className="bi bi-three-dots"></i>
					</button>
					{showMenu && (
						<ul className="dropdown-menu show position-absolute end-0" style={{ zIndex: 1000 }}>
							<li>
								<button 
									className="dropdown-item text-danger d-flex align-items-center gap-2"
									onClick={() => {
										onDeleteColumn(column.id);
										setShowMenu(false);
									}}
								>
									<i className="bi bi-trash"></i> Delete Column
								</button>
							</li>
						</ul>
					)}
				</div>
			</div>

			{/* Cards Container */}
			<div ref={setDroppableNodeRef} className="column-cards flex-grow-1 overflow-auto px-2 py-1">
				<SortableContext
					items={column.cards.map(c => c.id)}
					strategy={verticalListSortingStrategy}
				>
					{column.cards.map(card => (
						<CardItem 
							key={card.id} 
							card={card} 
							onEdit={(cardId, newTitle) => onEditCard(column.id, cardId, newTitle)}
							onDelete={(cardId) => onDeleteCard(column.id, cardId)}
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
								onClick={() => { setIsAdding(false); setNewCardTitle(''); }}
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
