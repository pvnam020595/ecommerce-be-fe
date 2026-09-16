import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Column } from '../../../interfaces/BoardInterface';
import { CardDetailModal } from './CardDetailModal';

interface CardItemProps {
	card: Card;
	currentColumnId?: string;
	columns?: Column[];
	onEdit: (cardId: string, updates: Partial<Card>) => void;
	onDelete: (cardId: string) => void;
	onMoveCard?: (card: Card, targetColumnId: string) => void;
}

export const CardItem = ({
	card,
	currentColumnId,
	columns,
	onEdit,
	onDelete,
	onMoveCard
}: CardItemProps) => {
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

	const hasLabels = card.labels && card.labels.length > 0;
	const totalSubtasks = card.subtasks ? card.subtasks.length : (card.checklist ? card.checklist.total : 0);
	const completedSubtasks = card.subtasks ? card.subtasks.filter(st => st.completed).length : (card.checklist ? card.checklist.completed : 0);
	const hasChecklist = totalSubtasks > 0;
	const totalAttachments = (card.attachments ? card.attachments.length : 0) || card.attachmentsCount || 0;
	const hasAttachments = totalAttachments > 0;
	const hasComments = Boolean(card.commentsCount && card.commentsCount > 0);
	const hasDates = Boolean(card.startDate || card.endDate);
	const hasMembers = Boolean(card.members && card.members.length > 0);
	const hasBottomRow =
		hasDates ||
		hasChecklist ||
		card.description ||
		hasComments ||
		hasAttachments ||
		hasMembers;

	return (
		<>
			<div
				ref={setNodeRef}
				style={style}
				{...attributes}
				{...listeners}
				className="card-item bg-white rounded-3 shadow-sm p-3 mb-2 cursor-pointer position-relative group-hover"
				onClick={() => setIsModalOpen(true)}
			>
				{/* Top Labels / Badges */}
				{hasLabels && (
					<div className="card-labels-container d-flex flex-wrap gap-1 mb-2">
						{card.labels!.map(lbl => (
							<span
								key={lbl.id}
								className="badge card-tag-badge fw-medium"
								style={{
									backgroundColor: lbl.bg,
									color: lbl.color,
									fontSize: '1.1rem',
									padding: '0.3rem 0.7rem',
									borderRadius: '0.4rem'
								}}
							>
								{lbl.text}
							</span>
						))}
					</div>
				)}

				{/* Card Title */}
				<div className="card-title-text fw-medium text-dark mb-2">
					{card.title}
				</div>

				{/* Card Meta & Bottom Row */}
				{hasBottomRow && (
					<div className="card-meta-row d-flex align-items-center justify-content-between gap-2 mt-2 pt-1">
						{/* Left Indicators */}
						<div className="d-flex align-items-center flex-wrap gap-2 text-muted fs-8">
							{/* Due Date Indicator */}
							{hasDates && (
								<div className="card-meta-item d-flex align-items-center gap-1 badge bg-light text-secondary border fw-normal py-1 px-2 rounded">
									<i className="bi bi-clock"></i>
									<span>
										{card.startDate ? card.startDate.slice(5) : ''}
										{card.endDate ? ` - ${card.endDate.slice(5)}` : ''}
									</span>
								</div>
							)}

							{/* Description Indicator */}
							{card.description && (
								<div
									className="card-meta-item d-flex align-items-center"
									title="This card has a description"
								>
									<i className="bi bi-justify-left"></i>
								</div>
							)}

							{/* Checklist Indicator */}
							{hasChecklist && (
								<div
									className={`card-meta-item d-flex align-items-center gap-1 ${
										completedSubtasks === totalSubtasks
											? 'text-success'
											: ''
									}`}
									title={`Subtasks: ${completedSubtasks}/${totalSubtasks}`}
								>
									<i className="bi bi-check2-square"></i>
									<span>
										{completedSubtasks}/{totalSubtasks}
									</span>
								</div>
							)}

							{/* Comments Indicator */}
							{hasComments && (
								<div
									className="card-meta-item d-flex align-items-center gap-1"
									title={`${card.commentsCount} comments`}
								>
									<i className="bi bi-chat-left-text"></i>
									<span>{card.commentsCount}</span>
								</div>
							)}

							{/* Attachments Indicator */}
							{hasAttachments && (
								<div
									className="card-meta-item d-flex align-items-center gap-1"
									title={`${totalAttachments} attachments`}
								>
									<i className="bi bi-paperclip"></i>
									<span>{totalAttachments}</span>
								</div>
							)}
						</div>

						{/* Right Assigned Members Avatars */}
						{hasMembers && (
							<div className="card-members-stack d-flex align-items-center ms-auto">
								{card.members!.map((m, idx) => (
									<div
										key={m.id}
										className="card-member-avatar rounded-circle border border-2 border-white overflow-hidden shadow-xs"
										title={m.name}
										style={{
											width: '2.4rem',
											height: '2.4rem',
											marginLeft: idx > 0 ? '-0.6rem' : 0,
											zIndex: 5 - idx
										}}
									>
										<img
											src={m.avatar}
											alt={m.name}
											className="w-100 h-100"
											style={{ objectFit: 'cover' }}
										/>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Quick Delete / Edit Action on Hover */}
				<div className="card-hover-actions position-absolute top-0 end-0 p-1 opacity-0 group-hover-opacity-100 d-flex gap-1">
					<button
						className="btn btn-sm btn-light p-1 rounded-circle border-0 text-danger shadow-xs d-flex align-items-center justify-content-center"
						style={{ width: '2.4rem', height: '2.4rem' }}
						title="Delete card"
						onClick={e => {
							e.stopPropagation();
							onDelete(card.id);
						}}
					>
						<i className="bi bi-trash fs-8"></i>
					</button>
				</div>
			</div>

			<CardDetailModal
				card={card}
				currentColumnId={currentColumnId}
				columns={columns}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={updates => onEdit(card.id, updates)}
				onMoveCard={onMoveCard}
			/>
		</>
	);
};
