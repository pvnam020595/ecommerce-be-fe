import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../../../interfaces/BoardInterface';
import { CardDetailModal } from './CardDetailModal';

interface CardItemProps {
	card: Card;
	onEdit: (cardId: string, updates: Partial<Card>) => void;
	onDelete: (cardId: string) => void;
}

export const CardItem = ({ card, onEdit, onDelete }: CardItemProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

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
		}
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1
	};

	const hasDetails = card.description || card.startDate || card.endDate || (card.members && card.members.length > 0);

	return (
		<>
			<div
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				className="card-item bg-white rounded-2 shadow-sm p-2 mb-2 cursor-pointer position-relative group-hover"
				onClick={() => setIsModalOpen(true)}
			>
				<span className="fs-8">{card.title}</span>
				
				{/* Details Indicators (Members, Dates, etc.) */}
				{hasDetails && (
					<div className="d-flex flex-wrap align-items-center gap-2 mt-2">
						{(card.startDate || card.endDate) && (
							<div className="badge bg-light text-dark fw-normal border">
								<i className="bi bi-clock me-1"></i>
								{card.startDate ? card.startDate.slice(5) : ''} 
								{card.endDate ? ` - ${card.endDate.slice(5)}` : ''}
							</div>
						)}
						{card.description && (
							<i className="bi bi-justify-left text-muted fs-8"></i>
						)}
						{card.members && card.members.length > 0 && (
							<div className="d-flex align-items-center ms-auto">
								{card.members.map(m => (
									<div key={m.id} className="avatar-circle ms-n1 border border-white rounded-circle" title={m.name} style={{ width: '20px', height: '20px' }}>
										<img src={m.avatar} alt={m.name} className="w-100 h-100 rounded-circle" />
									</div>
								))}
							</div>
						)}
					</div>
				)}
				
				{/* Hover Actions */}
				<div className="position-absolute top-0 end-0 p-1 opacity-0 group-hover-opacity-100 d-flex gap-1 bg-white rounded">
					<button 
						className="btn btn-sm text-danger p-0 border-0" 
						onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
					>
						<i className="bi bi-trash fs-8"></i>
					</button>
				</div>
			</div>

			<CardDetailModal 
				card={card}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={(updates) => onEdit(card.id, updates)}
			/>
		</>
	);
};
