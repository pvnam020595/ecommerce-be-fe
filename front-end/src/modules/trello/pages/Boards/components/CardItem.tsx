import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../../../interfaces/BoardInterface';

interface CardItemProps {
	card: Card;
	onEdit: (cardId: string, newTitle: string) => void;
	onDelete: (cardId: string) => void;
}

export const CardItem = ({ card, onEdit, onDelete }: CardItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(card.title);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({
		id: card.id,
		data: {
			type: 'card',
			card
		},
		disabled: isEditing // Disable drag when editing
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1
	};

	const handleSave = () => {
		if (editTitle.trim() && editTitle !== card.title) {
			onEdit(card.id, editTitle.trim());
		}
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSave();
		}
		if (e.key === 'Escape') {
			setEditTitle(card.title);
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<div className="card-item bg-white rounded-2 shadow-sm p-2 mb-2">
				<input
					type="text"
					className="form-control form-control-sm mb-2"
					value={editTitle}
					onChange={e => setEditTitle(e.target.value)}
					onKeyDown={handleKeyDown}
					autoFocus
				/>
				<div className="d-flex gap-1">
					<button className="btn btn-primary btn-sm py-0" onClick={handleSave}>Save</button>
					<button className="btn btn-light btn-sm py-0" onClick={() => { setEditTitle(card.title); setIsEditing(false); }}>Cancel</button>
				</div>
			</div>
		);
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className="card-item bg-white rounded-2 shadow-sm p-2 mb-2 cursor-pointer position-relative group-hover"
		>
			<span className="fs-8">{card.title}</span>
			
			<div className="position-absolute top-0 end-0 p-1 opacity-0 group-hover-opacity-100 d-flex gap-1 bg-white rounded">
				<button 
					className="btn btn-sm text-muted p-0 border-0" 
					onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
				>
					<i className="bi bi-pencil fs-8"></i>
				</button>
				<button 
					className="btn btn-sm text-danger p-0 border-0" 
					onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
				>
					<i className="bi bi-trash fs-8"></i>
				</button>
			</div>
		</div>
	);
};
