import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Member, Column } from '../../../interfaces/BoardInterface';

// ==========================================
// Types & Constants
// ==========================================

export interface CardDetailModalProps {
	card: Card;
	currentColumnId?: string;
	columns?: Column[];
	isOpen: boolean;
	onClose: () => void;
	onSave: (updates: Partial<Card>) => void;
	onMoveCard?: (card: Card, targetColumnId: string) => void;
}

interface CardFormData {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	members: Member[];
}

const MOCK_MEMBERS: readonly Member[] = [
	{ id: 'm1', name: 'Nam Pham', avatar: 'https://avatars.githubusercontent.com/u/1?v=4' },
	{ id: 'm2', name: 'John Doe', avatar: 'https://avatars.githubusercontent.com/u/2?v=4' },
	{ id: 'm3', name: 'Jane Smith', avatar: 'https://avatars.githubusercontent.com/u/3?v=4' },
];

// ==========================================
// Custom Hook: useCardForm
// ==========================================

const useCardForm = (card: Card, isOpen: boolean) => {
	const [formData, setFormData] = useState<CardFormData>(() => ({
		title: card.title,
		description: card.description || '',
		startDate: card.startDate || '',
		endDate: card.endDate || '',
		members: card.members || []
	}));

	useEffect(() => {
		if (isOpen) {
			setFormData({
				title: card.title,
				description: card.description || '',
				startDate: card.startDate || '',
				endDate: card.endDate || '',
				members: card.members || []
			});
		}
	}, [isOpen, card]);

	const updateField = useCallback(<K extends keyof CardFormData>(key: K, value: CardFormData[K]) => {
		setFormData(prev => ({ ...prev, [key]: value }));
	}, []);

	const toggleMember = useCallback((member: Member) => {
		setFormData(prev => {
			const exists = prev.members.some(m => m.id === member.id);
			const nextMembers = exists
				? prev.members.filter(m => m.id !== member.id)
				: [...prev.members, member];
			return { ...prev, members: nextMembers };
		});
	}, []);

	return { formData, updateField, toggleMember };
};

// ==========================================
// Subcomponent: AutoResizeTitleTextarea
// ==========================================

interface AutoResizeTitleTextareaProps {
	value: string;
	fallbackTitle: string;
	onChange: (val: string) => void;
	onFinish: () => void;
}

const AutoResizeTitleTextarea: React.FC<AutoResizeTitleTextareaProps> = ({
	value,
	fallbackTitle,
	onChange,
	onFinish
}) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const adjustHeight = useCallback(() => {
		const el = textareaRef.current;
		if (el) {
			el.style.height = 'auto';
			el.style.height = `${el.scrollHeight}px`;
		}
	}, []);

	useEffect(() => {
		adjustHeight();
	}, [adjustHeight, value]);

	const handleBlur = () => {
		if (!value.trim()) {
			onChange(fallbackTitle);
		}
		onFinish();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (!value.trim()) onChange(fallbackTitle);
			onFinish();
		} else if (e.key === 'Escape') {
			onChange(fallbackTitle);
			onFinish();
		}
	};

	return (
		<textarea
			ref={textareaRef}
			className="form-control fw-bold fs-5 border rounded px-2 py-1 shadow-sm flex-grow-1"
			rows={1}
			style={{
				margin: 0,
				resize: 'none',
				overflow: 'hidden',
				minHeight: '34px',
				lineHeight: '1.4'
			}}
			value={value}
			onChange={e => onChange(e.target.value)}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			autoFocus
		/>
	);
};

// ==========================================
// Subcomponent: StatusDropdownMenu
// ==========================================

interface StatusDropdownMenuProps {
	columns: Column[];
	currentColumnId?: string;
	onSelectColumn: (colId: string) => void;
}

const StatusDropdownMenu: React.FC<StatusDropdownMenuProps> = ({
	columns,
	currentColumnId,
	onSelectColumn
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	if (columns.length === 0) return null;

	return (
		<div className="dropdown position-relative" ref={dropdownRef}>
			<button
				type="button"
				className="btn btn-sm btn-light border-0 p-1 rounded d-flex align-items-center justify-content-center text-muted"
				style={{ width: '28px', height: '28px' }}
				onClick={() => setIsOpen(prev => !prev)}
				title="Card options & status"
				aria-expanded={isOpen}
			>
				<i className="bi bi-three-dots fs-6"></i>
			</button>

			{isOpen && (
				<div
					className="dropdown-menu show shadow border-0 py-2"
					style={{
						position: 'absolute',
						top: '100%',
						left: 0,
						zIndex: 1061,
						minWidth: '220px'
					}}
				>
					<h6 className="dropdown-header text-uppercase fs-8 fw-bold">
						Change Status / List
					</h6>
					{columns.map(col => {
						const isSelected = col.id === currentColumnId;
						return (
							<button
								key={col.id}
								type="button"
								className={`dropdown-item d-flex align-items-center justify-content-between py-2 fs-7 ${
									isSelected ? 'active fw-semibold' : ''
								}`}
								onClick={() => {
									setIsOpen(false);
									onSelectColumn(col.id);
								}}
							>
								<span>{col.title}</span>
								{isSelected && <i className="bi bi-check-lg ms-2"></i>}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

// ==========================================
// Subcomponent: MembersSection
// ==========================================

interface MembersSectionProps {
	selectedMembers: Member[];
	onToggleMember: (member: Member) => void;
}

const MembersSection: React.FC<MembersSectionProps> = ({
	selectedMembers,
	onToggleMember
}) => {
	return (
		<div>
			<h6 className="text-muted fs-8 fw-semibold mb-2">Members</h6>
			<div className="d-flex align-items-center gap-1 flex-wrap" style={{ minHeight: '32px' }}>
				{selectedMembers.map(m => (
					<div
						key={m.id}
						className="avatar-circle"
						title={m.name}
						style={{ width: '32px', height: '32px' }}
					>
						<img src={m.avatar} alt={m.name} className="w-100 h-100 rounded-circle" />
					</div>
				))}
				<div className="dropdown">
					<button
						type="button"
						className="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center border"
						style={{ width: '32px', height: '32px' }}
						data-bs-toggle="dropdown"
						title="Assign members"
					>
						<i className="bi bi-plus fs-5"></i>
					</button>
					<ul className="dropdown-menu shadow-sm">
						<li>
							<h6 className="dropdown-header">Assign members</h6>
						</li>
						{MOCK_MEMBERS.map(m => {
							const isSelected = selectedMembers.some(sm => sm.id === m.id);
							return (
								<li key={m.id}>
									<button
										type="button"
										className="dropdown-item d-flex align-items-center gap-2"
										onClick={() => onToggleMember(m)}
									>
										<img
											src={m.avatar}
											alt={m.name}
											className="rounded-circle"
											style={{ width: '24px', height: '24px' }}
										/>
										<span>{m.name}</span>
										{isSelected && <i className="bi bi-check2 ms-auto"></i>}
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};

// ==========================================
// Subcomponent: DatesSection
// ==========================================

interface DatesSectionProps {
	startDate: string;
	endDate: string;
	onChangeStartDate: (val: string) => void;
	onChangeEndDate: (val: string) => void;
}

const DatesSection: React.FC<DatesSectionProps> = ({
	startDate,
	endDate,
	onChangeStartDate,
	onChangeEndDate
}) => {
	return (
		<div>
			<h6 className="text-muted fs-8 fw-semibold mb-2">Dates</h6>
			<div className="d-flex align-items-center gap-2" style={{ height: '32px' }}>
				<div className="input-group input-group-sm h-100">
					<span className="input-group-text bg-light text-muted border-end-0 px-2 py-0">
						<i className="bi bi-calendar-event fs-8"></i>
					</span>
					<input
						type="date"
						className="form-control form-control-sm border-start-0 px-2 h-100 shadow-none"
						style={{ height: '32px', fontSize: '0.85rem' }}
						value={startDate}
						onChange={e => onChangeStartDate(e.target.value)}
						title="Start Date"
					/>
				</div>
				<span className="text-muted">-</span>
				<div className="input-group input-group-sm h-100">
					<span className="input-group-text bg-light text-muted border-end-0 px-2 py-0">
						<i className="bi bi-calendar-check fs-8"></i>
					</span>
					<input
						type="date"
						className="form-control form-control-sm border-start-0 px-2 h-100 shadow-none"
						style={{ height: '32px', fontSize: '0.85rem' }}
						value={endDate}
						onChange={e => onChangeEndDate(e.target.value)}
						title="Due Date"
					/>
				</div>
			</div>
		</div>
	);
};

// ==========================================
// Subcomponent: RichDescriptionEditor
// ==========================================

interface RichDescriptionEditorProps {
	description: string;
	onDescriptionChange: (val: string) => void;
}

const RichDescriptionEditor: React.FC<RichDescriptionEditorProps> = ({
	description,
	onDescriptionChange
}) => {
	const execCommand = useCallback((command: string) => {
		document.execCommand(command, false, '');
	}, []);

	return (
		<div className="mb-4">
			<div className="d-flex align-items-center gap-2 mb-2">
				<i className="bi bi-justify-left fs-5 text-muted"></i>
				<h6 className="m-0 fw-semibold">Description</h6>
			</div>
			<div className="ps-4">
				<div className="border border-bottom-0 rounded-top bg-light p-1 d-flex gap-1">
					<button
						type="button"
						className="btn btn-sm btn-light p-1 px-2"
						onClick={() => execCommand('bold')}
						title="Bold"
					>
						<i className="bi bi-type-bold"></i>
					</button>
					<button
						type="button"
						className="btn btn-sm btn-light p-1 px-2"
						onClick={() => execCommand('italic')}
						title="Italic"
					>
						<i className="bi bi-type-italic"></i>
					</button>
					<button
						type="button"
						className="btn btn-sm btn-light p-1 px-2"
						onClick={() => execCommand('underline')}
						title="Underline"
					>
						<i className="bi bi-type-underline"></i>
					</button>
				</div>
				<div
					className="form-control rounded-bottom rounded-top-0 border shadow-none"
					contentEditable
					style={{ minHeight: '100px', backgroundColor: '#f7f8f9' }}
					onBlur={e => onDescriptionChange(e.currentTarget.innerHTML)}
					dangerouslySetInnerHTML={{ __html: description }}
				></div>
				<div className="form-text fs-8 mt-1 text-muted">
					Note: Real project should install react-quill or ckeditor-react.
				</div>
			</div>
		</div>
	);
};

// ==========================================
// Subcomponent: SidebarActions
// ==========================================

const SidebarActions: React.FC = () => {
	return (
		<div className="col-md-3">
			<h6 className="text-muted fs-8 fw-semibold mb-2">Add to card</h6>
			<div className="d-flex flex-column gap-2">
				<button type="button" className="btn btn-light btn-sm text-start">
					<i className="bi bi-person me-2"></i> Members
				</button>
				<button type="button" className="btn btn-light btn-sm text-start">
					<i className="bi bi-tag me-2"></i> Labels
				</button>
				<button type="button" className="btn btn-light btn-sm text-start">
					<i className="bi bi-clock me-2"></i> Dates
				</button>
				<button type="button" className="btn btn-light btn-sm text-start">
					<i className="bi bi-paperclip me-2"></i> Attachment
				</button>
			</div>
		</div>
	);
};

// ==========================================
// Main Component: CardDetailModal
// ==========================================

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
	card,
	currentColumnId,
	columns = [],
	isOpen,
	onClose,
	onSave,
	onMoveCard
}) => {
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const { formData, updateField, toggleMember } = useCardForm(card, isOpen);

	// Close on Escape when modal is open and not editing title
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && !isEditingTitle && isOpen) {
				onClose();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, isEditingTitle, onClose]);

	if (!isOpen) return null;

	const handleSave = () => {
		onSave({
			title: formData.title.trim() || card.title,
			description: formData.description,
			startDate: formData.startDate,
			endDate: formData.endDate,
			members: formData.members
		});
		onClose();
	};

	const handleStatusChange = (newColumnId: string) => {
		if (newColumnId !== currentColumnId && onMoveCard) {
			onMoveCard(
				{
					...card,
					title: formData.title.trim() || card.title,
					description: formData.description,
					startDate: formData.startDate,
					endDate: formData.endDate,
					members: formData.members
				},
				newColumnId
			);
		}
	};

	const currentColumn = columns.find(c => c.id === currentColumnId);

	return (
		<>
			<div
				className="modal-backdrop fade show"
				style={{ zIndex: 1050 }}
				onClick={onClose}
			></div>
			<div
				className="modal fade show d-block"
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				style={{ zIndex: 1055 }}
			>
				<div className="modal-dialog modal-lg modal-dialog-centered">
					<div className="modal-content border-0 shadow">
						{/* Header */}
						<div className="modal-header border-0 pb-0 pt-3 px-4 flex-column align-items-stretch">
							<div className="d-flex align-items-center justify-content-between mb-2">
								<StatusDropdownMenu
									columns={columns}
									currentColumnId={currentColumnId}
									onSelectColumn={handleStatusChange}
								/>
								<button
									type="button"
									className="btn-close"
									onClick={onClose}
									aria-label="Close"
								></button>
							</div>

							{/* Title row */}
							<div className="d-flex align-items-center gap-2 flex-nowrap w-100">
								<i className="bi bi-card-heading fs-5 text-muted flex-shrink-0 align-self-start mt-1"></i>
								{isEditingTitle ? (
									<AutoResizeTitleTextarea
										value={formData.title}
										fallbackTitle={card.title}
										onChange={val => updateField('title', val)}
										onFinish={() => setIsEditingTitle(false)}
									/>
								) : (
									<div
										className="fw-bold fs-5 px-2 py-1 rounded cursor-pointer flex-grow-1 text-truncate"
										onClick={() => setIsEditingTitle(true)}
										title="Click to edit title"
										role="button"
										tabIndex={0}
										onKeyDown={e => {
											if (e.key === 'Enter') setIsEditingTitle(true);
										}}
										style={{ minHeight: '34px', lineHeight: '1.4' }}
									>
										{formData.title || card.title}
									</div>
								)}
							</div>

							{currentColumn && (
								<div className="text-muted fs-8 mt-1" style={{ paddingLeft: '1.75rem' }}>
									in list <span className="fw-semibold text-dark">{currentColumn.title}</span>
								</div>
							)}
						</div>

						{/* Body */}
						<div className="modal-body pt-3">
							<div className="row">
								<div className="col-md-9">
									<div className="d-flex flex-wrap gap-4 mb-4 align-items-start">
										<MembersSection
											selectedMembers={formData.members}
											onToggleMember={toggleMember}
										/>
										<DatesSection
											startDate={formData.startDate}
											endDate={formData.endDate}
											onChangeStartDate={val => updateField('startDate', val)}
											onChangeEndDate={val => updateField('endDate', val)}
										/>
									</div>

									<RichDescriptionEditor
										description={formData.description}
										onDescriptionChange={val => updateField('description', val)}
									/>
								</div>

								<SidebarActions />
							</div>
						</div>

						{/* Footer */}
						<div className="modal-footer border-0">
							<button type="button" className="btn btn-secondary me-2" onClick={onClose}>
								Cancel
							</button>
							<button type="button" className="btn btn-primary" onClick={handleSave}>
								Save Changes
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
