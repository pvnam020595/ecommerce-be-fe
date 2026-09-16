import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Member, Column, SubTask, Attachment } from '../../../interfaces/BoardInterface';

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
	subtasks: SubTask[];
	attachments: Attachment[];
}

const MOCK_MEMBERS: readonly Member[] = [
	{
		id: 'm1',
		name: 'Nam Pham',
		avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
	},
	{
		id: 'm2',
		name: 'Alex Rivera',
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
	},
	{
		id: 'm3',
		name: 'Sarah Connor',
		avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
	},
	{
		id: 'm4',
		name: 'John Doe',
		avatar: 'https://avatars.githubusercontent.com/u/2?v=4'
	}
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
		members: card.members || [],
		subtasks: card.subtasks || [],
		attachments: card.attachments || []
	}));

	useEffect(() => {
		if (isOpen) {
			setFormData({
				title: card.title,
				description: card.description || '',
				startDate: card.startDate || '',
				endDate: card.endDate || '',
				members: card.members || [],
				subtasks: card.subtasks || [],
				attachments: card.attachments || []
			});
		}
	}, [isOpen, card]);

	const updateField = useCallback(
		<K extends keyof CardFormData>(key: K, value: CardFormData[K]) => {
			setFormData(prev => ({ ...prev, [key]: value }));
		},
		[]
	);

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
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
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
								{isSelected && (
									<i className="bi bi-check-lg ms-2"></i>
								)}
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
			<div
				className="d-flex align-items-center gap-1 flex-wrap"
				style={{ minHeight: '32px' }}
			>
				{selectedMembers.map(m => (
					<div
						key={m.id}
						className="avatar-circle"
						title={m.name}
						style={{ width: '32px', height: '32px' }}
					>
						<img
							src={m.avatar}
							alt={m.name}
							className="w-100 h-100 rounded-circle"
						/>
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
							const isSelected = selectedMembers.some(
								sm => sm.id === m.id
							);
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
											style={{
												width: '24px',
												height: '24px'
											}}
										/>
										<span>{m.name}</span>
										{isSelected && (
											<i className="bi bi-check2 ms-auto"></i>
										)}
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
			<div
				className="d-flex align-items-center gap-2"
				style={{ height: '32px' }}
			>
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
					Note: Real project should install react-quill or
					ckeditor-react.
				</div>
			</div>
		</div>
	);
};

// ==========================================
// Subcomponent: SubtasksSection
// ==========================================

interface SubtasksSectionProps {
	subtasks: SubTask[];
	onUpdateSubtasks: (subtasks: SubTask[]) => void;
	isAddingSubtask: boolean;
	setIsAddingSubtask: (val: boolean) => void;
}

const SubtasksSection: React.FC<SubtasksSectionProps> = ({
	subtasks,
	onUpdateSubtasks,
	isAddingSubtask,
	setIsAddingSubtask
}) => {
	const [newTitle, setNewTitle] = useState('');
	const [newAssignee, setNewAssignee] = useState<Member | undefined>(undefined);
	const [newStartDate, setNewStartDate] = useState('');
	const [newDueDate, setNewDueDate] = useState('');

	const completedCount = subtasks.filter(st => st.completed).length;
	const progressPercent = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

	const handleToggleSubtask = (id: string) => {
		onUpdateSubtasks(
			subtasks.map(st =>
				st.id === id ? { ...st, completed: !st.completed } : st
			)
		);
	};

	const handleDeleteSubtask = (id: string) => {
		onUpdateSubtasks(subtasks.filter(st => st.id !== id));
	};

	const handleUpdateAssignee = (id: string, member?: Member) => {
		onUpdateSubtasks(
			subtasks.map(st =>
				st.id === id ? { ...st, assignee: member } : st
			)
		);
	};

	const handleUpdateDates = (
		id: string,
		startDate?: string,
		dueDate?: string
	) => {
		onUpdateSubtasks(
			subtasks.map(st =>
				st.id === id ? { ...st, startDate, dueDate } : st
			)
		);
	};

	const handleAddSubtask = () => {
		if (!newTitle.trim()) return;
		const newSubtask: SubTask = {
			id: `subtask-${Date.now()}`,
			title: newTitle.trim(),
			completed: false,
			assignee: newAssignee,
			startDate: newStartDate || undefined,
			dueDate: newDueDate || undefined
		};
		onUpdateSubtasks([...subtasks, newSubtask]);
		setNewTitle('');
		setNewAssignee(undefined);
		setNewStartDate('');
		setNewDueDate('');
		setIsAddingSubtask(false);
	};

	return (
		<div className="mb-4">
			<div className="d-flex align-items-center justify-content-between mb-2">
				<div className="d-flex align-items-center gap-2">
					<i className="bi bi-check2-square fs-5 text-muted"></i>
					<h6 className="m-0 fw-semibold">Subtasks</h6>
					{subtasks.length > 0 && (
						<span className="badge bg-light text-muted border">
							{completedCount}/{subtasks.length}
						</span>
					)}
				</div>
				{!isAddingSubtask && (
					<button
						type="button"
						className="btn btn-sm btn-light border d-flex align-items-center gap-1"
						onClick={() => setIsAddingSubtask(true)}
					>
						<i className="bi bi-plus-lg"></i>
						<span>Add Subtask</span>
					</button>
				)}
			</div>

			{/* Progress Bar */}
			{subtasks.length > 0 && (
				<div className="ps-4 mb-3">
					<div className="d-flex align-items-center gap-2 mb-1 fs-8 text-muted">
						<span>{progressPercent}%</span>
						<div className="progress flex-grow-1" style={{ height: '6px' }}>
							<div
								className={`progress-bar ${
									progressPercent === 100 ? 'bg-success' : 'bg-primary'
								}`}
								role="progressbar"
								style={{ width: `${progressPercent}%` }}
								aria-valuenow={progressPercent}
								aria-valuemin={0}
								aria-valuemax={100}
							></div>
						</div>
					</div>
				</div>
			)}

			{/* Subtasks List */}
			<div className="ps-4 d-flex flex-column gap-2">
				{subtasks.map(st => (
					<div
						key={st.id}
						className="d-flex flex-column p-2 rounded border bg-light bg-opacity-50"
					>
						<div className="d-flex align-items-center justify-content-between gap-2">
							<div className="d-flex align-items-center gap-2 flex-grow-1">
								<input
									type="checkbox"
									className="form-check-input mt-0 cursor-pointer"
									style={{ width: '18px', height: '18px' }}
									checked={st.completed}
									onChange={() => handleToggleSubtask(st.id)}
									id={`subtask-check-${st.id}`}
								/>
								<label
									htmlFor={`subtask-check-${st.id}`}
									className={`m-0 cursor-pointer user-select-none ${
										st.completed
											? 'text-decoration-line-through text-muted fst-italic'
											: 'text-dark fw-medium'
									}`}
								>
									{st.title}
								</label>
							</div>

							<div className="d-flex align-items-center gap-2">
								{/* Assignee button / avatar */}
								<div className="dropdown">
									<button
										type="button"
										className="btn btn-sm btn-light border-0 p-0 rounded-circle"
										style={{ width: '28px', height: '28px' }}
										data-bs-toggle="dropdown"
										title={st.assignee ? `Assigned to: ${st.assignee.name}` : 'Assign member'}
									>
										{st.assignee ? (
											<img
												src={st.assignee.avatar}
												alt={st.assignee.name}
												className="rounded-circle w-100 h-100 object-fit-cover"
											/>
										) : (
											<span className="d-flex align-items-center justify-content-center w-100 h-100 text-muted bg-white border rounded-circle">
												<i className="bi bi-person-plus fs-7"></i>
											</span>
										)}
									</button>
									<ul className="dropdown-menu dropdown-menu-end shadow-sm">
										<li>
											<h6 className="dropdown-header">Assign Member</h6>
										</li>
										{MOCK_MEMBERS.map(m => (
											<li key={m.id}>
												<button
													type="button"
													className={`dropdown-item d-flex align-items-center gap-2 ${
														st.assignee?.id === m.id ? 'active' : ''
													}`}
													onClick={() =>
														handleUpdateAssignee(
															st.id,
															st.assignee?.id === m.id ? undefined : m
														)
													}
												>
													<img
														src={m.avatar}
														alt={m.name}
														className="rounded-circle"
														style={{ width: '22px', height: '22px', objectFit: 'cover' }}
													/>
													<span>{m.name}</span>
													{st.assignee?.id === m.id && (
														<i className="bi bi-check2 ms-auto"></i>
													)}
												</button>
											</li>
										))}
										{st.assignee && (
											<>
												<li>
													<hr className="dropdown-divider" />
												</li>
												<li>
													<button
														type="button"
														className="dropdown-item text-danger d-flex align-items-center gap-2"
														onClick={() => handleUpdateAssignee(st.id, undefined)}
													>
														<i className="bi bi-x-circle"></i>
														<span>Remove Assignee</span>
													</button>
												</li>
											</>
										)}
									</ul>
								</div>

								{/* Date Icon button with Dropdown for Start Date & Due Date */}
								<div className="dropdown">
									<button
										type="button"
										className={`btn btn-sm ${
											st.startDate || st.dueDate
												? 'btn-light border text-primary fw-medium'
												: 'btn-light border text-muted'
										} px-2 py-0 d-flex align-items-center gap-1 fs-8`}
										style={{ height: '28px' }}
										data-bs-toggle="dropdown"
										data-bs-auto-close="outside"
										title="Choose start date & due date"
									>
										<i className="bi bi-calendar-event"></i>
										{st.startDate || st.dueDate ? (
											<span>
												{st.startDate ? st.startDate.slice(5) : ''}
												{st.startDate && st.dueDate ? ' - ' : ''}
												{st.dueDate ? st.dueDate.slice(5) : ''}
											</span>
										) : null}
									</button>
									<div
										className="dropdown-menu dropdown-menu-end shadow p-3"
										style={{ minWidth: '260px' }}
									>
										<h6 className="dropdown-header px-0 pt-0 text-uppercase fs-8 fw-bold">
											Subtask Dates
										</h6>
										<div className="mb-2">
											<label className="form-label fs-8 text-muted mb-1 d-flex align-items-center gap-1">
												<i className="bi bi-calendar-check"></i>
												<span>Start Date</span>
											</label>
											<input
												type="date"
												className="form-control form-control-sm shadow-none"
												value={st.startDate || ''}
												onChange={e =>
													handleUpdateDates(
														st.id,
														e.target.value || undefined,
														st.dueDate
													)
												}
											/>
										</div>
										<div className="mb-3">
											<label className="form-label fs-8 text-muted mb-1 d-flex align-items-center gap-1">
												<i className="bi bi-calendar-x"></i>
												<span>Due Date</span>
											</label>
											<input
												type="date"
												className="form-control form-control-sm shadow-none"
												value={st.dueDate || ''}
												onChange={e =>
													handleUpdateDates(
														st.id,
														st.startDate,
														e.target.value || undefined
													)
												}
											/>
										</div>
										{(st.startDate || st.dueDate) && (
											<div className="d-flex justify-content-end">
												<button
													type="button"
													className="btn btn-sm btn-link text-danger text-decoration-none p-0 fs-8"
													onClick={() =>
														handleUpdateDates(st.id, undefined, undefined)
													}
												>
													Clear dates
												</button>
											</div>
										)}
									</div>
								</div>

								{/* Delete Subtask */}
								<button
									type="button"
									className="btn btn-sm btn-light border-0 text-muted p-0 d-flex align-items-center justify-content-center"
									style={{ width: '24px', height: '24px' }}
									onClick={() => handleDeleteSubtask(st.id)}
									title="Delete subtask"
								>
									<i className="bi bi-trash fs-8"></i>
								</button>
							</div>
						</div>
					</div>
				))}

				{/* Add Subtask Inline Form */}
				{isAddingSubtask && (
					<div className="p-3 rounded border bg-white shadow-sm mt-1">
						<input
							type="text"
							className="form-control form-control-sm mb-2 shadow-none"
							placeholder="What needs to be done?"
							value={newTitle}
							onChange={e => setNewTitle(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter') handleAddSubtask();
								if (e.key === 'Escape') setIsAddingSubtask(false);
							}}
							autoFocus
						/>
						<div className="d-flex align-items-center gap-2 flex-wrap mb-2">
							{/* Assign Member for new subtask */}
							<div className="dropdown">
								<button
									type="button"
									className="btn btn-sm btn-light border p-0 rounded-circle d-flex align-items-center justify-content-center"
									style={{ width: '28px', height: '28px' }}
									data-bs-toggle="dropdown"
									title={newAssignee ? `Assignee: ${newAssignee.name}` : 'Choose member'}
								>
									{newAssignee ? (
										<img
											src={newAssignee.avatar}
											alt={newAssignee.name}
											className="rounded-circle w-100 h-100 object-fit-cover"
										/>
									) : (
										<i className="bi bi-person-plus fs-7 text-muted"></i>
									)}
								</button>
								<ul className="dropdown-menu shadow-sm">
									<li>
										<h6 className="dropdown-header">Choose Member</h6>
									</li>
									{MOCK_MEMBERS.map(m => (
										<li key={m.id}>
											<button
												type="button"
												className={`dropdown-item d-flex align-items-center gap-2 ${
													newAssignee?.id === m.id ? 'active' : ''
												}`}
												onClick={() => setNewAssignee(newAssignee?.id === m.id ? undefined : m)}
											>
												<img
													src={m.avatar}
													alt={m.name}
													className="rounded-circle"
													style={{ width: '20px', height: '20px', objectFit: 'cover' }}
												/>
												<span>{m.name}</span>
												{newAssignee?.id === m.id && (
													<i className="bi bi-check2 ms-auto"></i>
												)}
											</button>
										</li>
									))}
									{newAssignee && (
										<>
											<li>
												<hr className="dropdown-divider" />
											</li>
											<li>
												<button
													type="button"
													className="dropdown-item text-danger d-flex align-items-center gap-2"
													onClick={() => setNewAssignee(undefined)}
												>
													<i className="bi bi-x-circle"></i>
													<span>Remove Assignee</span>
												</button>
											</li>
										</>
									)}
								</ul>
							</div>

							{/* Date Icon button with Dropdown for Start Date & Due Date */}
							<div className="dropdown">
								<button
									type="button"
									className={`btn btn-sm ${
										newStartDate || newDueDate
											? 'btn-light border text-primary fw-medium'
											: 'btn-light border text-muted'
									} d-flex align-items-center gap-1 fs-8 px-2`}
									style={{ height: '28px' }}
									data-bs-toggle="dropdown"
									data-bs-auto-close="outside"
									title="Choose start date & due date"
								>
									<i className="bi bi-calendar-event"></i>
									{newStartDate || newDueDate ? (
										<span>
											{newStartDate ? newStartDate.slice(5) : ''}
											{newStartDate && newDueDate ? ' - ' : ''}
											{newDueDate ? newDueDate.slice(5) : ''}
										</span>
									) : (
										<span>Dates</span>
									)}
								</button>
								<div
									className="dropdown-menu shadow p-3"
									style={{ minWidth: '260px' }}
								>
									<h6 className="dropdown-header px-0 pt-0 text-uppercase fs-8 fw-bold">
										Select Dates
									</h6>
									<div className="mb-2">
										<label className="form-label fs-8 text-muted mb-1 d-flex align-items-center gap-1">
											<i className="bi bi-calendar-check"></i>
											<span>Start Date</span>
										</label>
										<input
											type="date"
											className="form-control form-control-sm shadow-none"
											value={newStartDate}
											onChange={e => setNewStartDate(e.target.value)}
										/>
									</div>
									<div className="mb-3">
										<label className="form-label fs-8 text-muted mb-1 d-flex align-items-center gap-1">
											<i className="bi bi-calendar-x"></i>
											<span>Due Date</span>
										</label>
										<input
											type="date"
											className="form-control form-control-sm shadow-none"
											value={newDueDate}
											onChange={e => setNewDueDate(e.target.value)}
										/>
									</div>
									{(newStartDate || newDueDate) && (
										<div className="d-flex justify-content-end">
											<button
												type="button"
												className="btn btn-sm btn-link text-danger text-decoration-none p-0 fs-8"
												onClick={() => {
													setNewStartDate('');
													setNewDueDate('');
												}}
											>
												Clear dates
											</button>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="d-flex align-items-center gap-2">
							<button
								type="button"
								className="btn btn-primary btn-sm"
								onClick={handleAddSubtask}
							>
								Add
							</button>
							<button
								type="button"
								className="btn btn-light btn-sm text-muted"
								onClick={() => {
									setIsAddingSubtask(false);
									setNewTitle('');
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

// ==========================================
// Subcomponent: AttachmentsSection
// ==========================================

interface AttachmentsSectionProps {
	attachments: Attachment[];
	onUpdateAttachments: (attachments: Attachment[]) => void;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	onFileUpload?: (files: FileList | null) => void;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
	attachments,
	onUpdateAttachments,
	fileInputRef,
	onFileUpload
}) => {
	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (onFileUpload && e.dataTransfer.files) {
			onFileUpload(e.dataTransfer.files);
		}
	};
	const handleDeleteAttachment = (id: string) => {
		onUpdateAttachments(attachments.filter(att => att.id !== id));
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	const isImage = (type: string, name: string): boolean => {
		return (
			type.startsWith('image/') ||
			/\.(png|jpe?g|gif|webp|svg)$/i.test(name)
		);
	};

	const isPdf = (type: string, name: string): boolean => {
		return type === 'application/pdf' || /\.pdf$/i.test(name);
	};

	const isDoc = (type: string, name: string): boolean => {
		return (
			type.includes('word') ||
			type.includes('document') ||
			/\.(doc|docx|txt|rtf)$/i.test(name)
		);
	};

	return (
		<div className="mb-4">
			<div className="d-flex align-items-center justify-content-between mb-2">
				<div className="d-flex align-items-center gap-2">
					<i className="bi bi-paperclip fs-5 text-muted"></i>
					<h6 className="m-0 fw-semibold">Attachments</h6>
					{attachments.length > 0 && (
						<span className="badge bg-light text-muted border">
							{attachments.length}
						</span>
					)}
				</div>
				<button
					type="button"
					className="btn btn-sm btn-light border d-flex align-items-center gap-1"
					onClick={() => fileInputRef.current?.click()}
				>
					<i className="bi bi-plus-lg"></i>
					<span>Attach file</span>
				</button>
			</div>

			<div className="ps-4">
				{attachments.length === 0 ? (
					<div
						className="border border-dashed rounded p-3 text-center text-muted bg-light cursor-pointer"
						onClick={() => fileInputRef.current?.click()}
						onDragOver={e => e.preventDefault()}
						onDrop={handleDrop}
					>
						<i className="bi bi-cloud-arrow-up fs-4 d-block mb-1"></i>
						<span className="fs-8">
							Attach files here (PDF, DOC, DOCX, PNG, JPG/JPEG)
						</span>
					</div>
				) : (
					<div className="d-flex flex-column gap-2">
						{attachments.map(att => (
							<div
								key={att.id}
								className="d-flex align-items-center justify-content-between p-2 rounded border bg-light bg-opacity-50"
							>
								<div className="d-flex align-items-center gap-2 overflow-hidden">
									{/* Preview Icon or Thumbnail */}
									{isImage(att.type, att.name) ? (
										<img
											src={att.url}
											alt={att.name}
											className="rounded border"
											style={{
												width: '40px',
												height: '40px',
												objectFit: 'cover'
											}}
										/>
									) : isPdf(att.type, att.name) ? (
										<div
											className="rounded bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center"
											style={{ width: '40px', height: '40px' }}
										>
											<i className="bi bi-file-earmark-pdf fs-4"></i>
										</div>
									) : isDoc(att.type, att.name) ? (
										<div
											className="rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
											style={{ width: '40px', height: '40px' }}
										>
											<i className="bi bi-file-earmark-word fs-4"></i>
										</div>
									) : (
										<div
											className="rounded bg-secondary bg-opacity-10 text-secondary d-flex align-items-center justify-content-center"
											style={{ width: '40px', height: '40px' }}
										>
											<i className="bi bi-file-earmark fs-4"></i>
										</div>
									)}

									<div className="overflow-hidden">
										<a
											href={att.url}
											download={att.name}
											target="_blank"
											rel="noopener noreferrer"
											className="d-block text-dark fw-medium text-truncate text-decoration-none fs-7"
											title={att.name}
										>
											{att.name}
										</a>
										<span className="text-muted fs-8">
											{formatFileSize(att.size)} • Added {att.createdAt}
										</span>
									</div>
								</div>

								<div className="d-flex align-items-center gap-1 ms-2">
									<a
										href={att.url}
										download={att.name}
										className="btn btn-sm btn-light border-0 text-muted p-1"
										title="Download file"
									>
										<i className="bi bi-download fs-8"></i>
									</a>
									<button
										type="button"
										className="btn btn-sm btn-light border-0 text-muted p-1"
										onClick={() => handleDeleteAttachment(att.id)}
										title="Delete attachment"
									>
										<i className="bi bi-trash fs-8"></i>
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

// ==========================================
// Subcomponent: SidebarActions
// ==========================================

interface SidebarActionsProps {
	onAddSubtask: () => void;
	onAttachClick: () => void;
}

const SidebarActions: React.FC<SidebarActionsProps> = ({
	onAddSubtask,
	onAttachClick
}) => {
	return (
		<div className="col-md-3">
			<h6 className="text-muted fs-8 fw-semibold mb-2">Add to card</h6>
			<div className="d-flex flex-column gap-2">
				<button
					type="button"
					className="btn btn-light btn-sm text-start"
					onClick={onAddSubtask}
				>
					<i className="bi bi-check2-square me-2"></i> Subtask
				</button>
				<button
					type="button"
					className="btn btn-light btn-sm text-start"
					onClick={onAttachClick}
				>
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
	const [isAddingSubtask, setIsAddingSubtask] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

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
		const completedSubtasks = formData.subtasks.filter(st => st.completed).length;
		onSave({
			title: formData.title.trim() || card.title,
			description: formData.description,
			startDate: formData.startDate,
			endDate: formData.endDate,
			members: formData.members,
			subtasks: formData.subtasks,
			attachments: formData.attachments,
			attachmentsCount: formData.attachments.length,
			checklist: formData.subtasks.length > 0
				? { total: formData.subtasks.length, completed: completedSubtasks }
				: undefined
		});
		onClose();
	};

	const handleStatusChange = (newColumnId: string) => {
		if (newColumnId !== currentColumnId && onMoveCard) {
			const completedSubtasks = formData.subtasks.filter(st => st.completed).length;
			onMoveCard(
				{
					...card,
					title: formData.title.trim() || card.title,
					description: formData.description,
					startDate: formData.startDate,
					endDate: formData.endDate,
					members: formData.members,
					subtasks: formData.subtasks,
					attachments: formData.attachments,
					attachmentsCount: formData.attachments.length,
					checklist: formData.subtasks.length > 0
						? { total: formData.subtasks.length, completed: completedSubtasks }
						: undefined
				},
				newColumnId
			);
		}
	};

	const handleFileUpload = (files: FileList | null) => {
		if (!files || files.length === 0) return;

		const newAttachments: Attachment[] = [];
		Array.from(files).forEach(file => {
			const objectUrl = URL.createObjectURL(file);
			newAttachments.push({
				id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
				name: file.name,
				size: file.size,
				type: file.type || 'application/octet-stream',
				url: objectUrl,
				createdAt: new Date().toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric'
				})
			});
		});

		updateField('attachments', [...formData.attachments, ...newAttachments]);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const currentColumn = columns.find(c => c.id === currentColumnId);

	return (
		<>
			{/* Hidden file input for attachment upload */}
			<input
				type="file"
				ref={fileInputRef}
				className="d-none"
				accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg,image/jpg"
				multiple
				onChange={e => handleFileUpload(e.target.files)}
			/>

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
										onChange={val =>
											updateField('title', val)
										}
										onFinish={() =>
											setIsEditingTitle(false)
										}
									/>
								) : (
									<div
										className="fw-bold fs-5 px-2 py-1 rounded cursor-pointer flex-grow-1 text-truncate"
										onClick={() => setIsEditingTitle(true)}
										title="Click to edit title"
										role="button"
										tabIndex={0}
										onKeyDown={e => {
											if (e.key === 'Enter')
												setIsEditingTitle(true);
										}}
										style={{
											minHeight: '34px',
											lineHeight: '1.4'
										}}
									>
										{formData.title || card.title}
									</div>
								)}
							</div>

							{currentColumn && (
								<div
									className="text-muted fs-8 mt-1"
									style={{ paddingLeft: '1.75rem' }}
								>
									in list{' '}
									<span className="fw-semibold text-dark">
										{currentColumn.title}
									</span>
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
											onChangeStartDate={val =>
												updateField('startDate', val)
											}
											onChangeEndDate={val =>
												updateField('endDate', val)
											}
										/>
									</div>

									<RichDescriptionEditor
										description={formData.description}
										onDescriptionChange={val =>
											updateField('description', val)
										}
									/>

									{/* Subtasks Section */}
									<SubtasksSection
										subtasks={formData.subtasks}
										onUpdateSubtasks={sts =>
											updateField('subtasks', sts)
										}
										isAddingSubtask={isAddingSubtask}
										setIsAddingSubtask={setIsAddingSubtask}
									/>

									{/* Attachments Section */}
									<AttachmentsSection
										attachments={formData.attachments}
										onUpdateAttachments={atts =>
											updateField('attachments', atts)
										}
										fileInputRef={fileInputRef}
										onFileUpload={handleFileUpload}
									/>
								</div>

								<SidebarActions
									onAddSubtask={() => setIsAddingSubtask(true)}
									onAttachClick={() => fileInputRef.current?.click()}
								/>
							</div>
						</div>

						{/* Footer */}
						<div className="modal-footer border-0">
							<button
								type="button"
								className="btn btn-secondary me-2"
								onClick={onClose}
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleSave}
							>
								Save Changes
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
