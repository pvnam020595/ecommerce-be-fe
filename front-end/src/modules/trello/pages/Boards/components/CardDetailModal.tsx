import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
	Card,
	Member,
	Column,
	SubTask,
	Attachment,
	CardComment,
	CardCommentReply,
	CardActivity
} from '../../../interfaces/BoardInterface';
import { addCard } from '../../../redux/actions/boardActions';

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
	onConvertSubtaskToCard?: (subtask: SubTask) => void;
}

interface CardFormData {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	members: Member[];
	subtasks: SubTask[];
	attachments: Attachment[];
	comments: CardComment[];
	activities: CardActivity[];
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

const formatDateDisplay = (dateStr?: string): string => {
	if (!dateStr) return '';
	try {
		const parts = dateStr.split('-');
		if (parts.length === 3) {
			const months = [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec'
			];
			const monthIdx = parseInt(parts[1], 10) - 1;
			const day = parseInt(parts[2], 10);
			if (monthIdx >= 0 && monthIdx < 12) {
				return `${months[monthIdx]} ${day}`;
			}
		}
	} catch (err) {
		void err;
	}
	return dateStr.slice(5);
};

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
		attachments: card.attachments || [],
		comments: card.comments || [],
		activities: card.activities || []
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
				attachments: card.attachments || [],
				comments: card.comments || [],
				activities: card.activities || []
			});
		}
	}, [isOpen, card]);

	const updateField = useCallback(
		<K extends keyof CardFormData>(key: K, value: CardFormData[K]) => {
			setFormData(prev => ({ ...prev, [key]: value }));
		},
		[]
	);

	const logActivity = useCallback(
		(type: CardActivity['type'], text: string) => {
			const now = new Date();
			const timeStr = now.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit'
			});
			const dateStr = now.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric'
			});
			const newActivity: CardActivity = {
				id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
				type,
				user: MOCK_MEMBERS[0],
				text,
				timestamp: `${dateStr}, ${timeStr}`
			};
			setFormData(prev => ({
				...prev,
				activities: [newActivity, ...(prev.activities || [])]
			}));
		},
		[]
	);

	const addComment = useCallback(
		(content: string) => {
			if (!content.trim()) return;
			const now = new Date();
			const timeStr = now.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit'
			});
			const dateStr = now.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric'
			});
			const newComment: CardComment = {
				id: `com-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
				author: MOCK_MEMBERS[0],
				content: content.trim(),
				createdAt: `${dateStr}, ${timeStr}`,
				replies: []
			};
			setFormData(prev => ({
				...prev,
				comments: [newComment, ...(prev.comments || [])]
			}));
			logActivity('comment', 'added a comment');
		},
		[logActivity]
	);

	const replyComment = useCallback(
		(commentId: string, content: string) => {
			if (!content.trim()) return;
			const now = new Date();
			const timeStr = now.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit'
			});
			const dateStr = now.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric'
			});
			const newReply: CardCommentReply = {
				id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
				author: MOCK_MEMBERS[0],
				content: content.trim(),
				createdAt: `${dateStr}, ${timeStr}`
			};
			setFormData(prev => ({
				...prev,
				comments: (prev.comments || []).map(com =>
					com.id === commentId
						? {
							...com,
							replies: [...(com.replies || []), newReply]
						}
						: com
				)
			}));
			logActivity('comment', 'replied to a comment');
		},
		[logActivity]
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

	return {
		formData,
		updateField,
		toggleMember,
		logActivity,
		addComment,
		replyComment
	};
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
	const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
		null
	);
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	const handleToggle = () => {
		if (!isOpen && dropdownRef.current) {
			const rect = dropdownRef.current.getBoundingClientRect();
			const menuHeight = 220;
			const menuWidth = 240;
			const spaceBelow = window.innerHeight - rect.bottom;
			const openUp = spaceBelow < menuHeight && rect.top > menuHeight;
			const top = openUp ? rect.top - menuHeight - 4 : rect.bottom + 4;
			const left = Math.min(
				window.innerWidth - menuWidth - 10,
				Math.max(10, rect.left)
			);
			setMenuPos({ top, left });
		}
		setIsOpen(prev => !prev);
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		const handleScroll = () => {
			if (isOpen) setIsOpen(false);
		};
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			window.addEventListener('scroll', handleScroll, true);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [isOpen]);

	if (columns.length === 0) return null;

	return (
		<div className="dropdown position-relative" ref={dropdownRef}>
			<button
				type="button"
				className={`btn btn-sm ${
					isOpen ? 'btn-secondary bg-secondary-subtle' : 'btn-light'
				} border-0 p-1 rounded-circle d-flex align-items-center justify-content-center text-muted`}
				style={{
					width: '32px',
					height: '32px',
					transition: 'all 0.15s ease'
				}}
				onClick={handleToggle}
				title="Card options & status"
				aria-expanded={isOpen}
			>
				<i className="bi bi-three-dots-vertical fs-6"></i>
			</button>

			{isOpen && menuPos && (
				<div
					className="dropdown-menu show shadow-lg border-0 py-2 position-fixed"
					style={{
						top: `${menuPos.top}px`,
						left: `${menuPos.left}px`,
						zIndex: 1075,
						minWidth: '240px',
						borderRadius: '12px',
						boxShadow:
							'0 12px 30px rgba(15, 23, 42, 0.15), 0 2px 8px rgba(15, 23, 42, 0.08)'
					}}
				>
					<div className="px-3 py-1 border-bottom mb-1">
						<span
							className="text-uppercase text-muted fw-bold"
							style={{
								fontSize: '0.7rem',
								letterSpacing: '0.5px'
							}}
						>
							Change Status / List
						</span>
					</div>
					{columns.map(col => {
						const isSelected = col.id === currentColumnId;
						return (
							<button
								key={col.id}
								type="button"
								className={`dropdown-item d-flex align-items-center justify-content-between px-3 py-2 fs-7 rounded-2 mx-1 ${
									isSelected
										? 'bg-primary-subtle text-primary fw-semibold'
										: 'text-dark'
								}`}
								style={{ width: 'calc(100% - 8px)' }}
								onClick={() => {
									setIsOpen(false);
									onSelectColumn(col.id);
								}}
							>
								<span className="d-flex align-items-center gap-2">
									<i
										className={`bi ${
											isSelected
												? 'bi-kanban-fill text-primary'
												: 'bi-kanban text-muted'
										}`}
									></i>
									<span>{col.title}</span>
								</span>
								{isSelected && (
									<i className="bi bi-check2-circle text-primary fs-6"></i>
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
				<span className="text-muted d-flex align-items-center px-1">
					<i
						className="bi bi-arrow-right-short fs-5 text-primary align-middle"
						style={{ lineHeight: 1 }}
					></i>
				</span>
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
					className="form-control rounded-bottom rounded-top-0 border shadow-none w-100"
					contentEditable
					style={{
						minHeight: '130px',
						backgroundColor: '#f7f8f9',
						width: '100%',
						wordBreak: 'break-word',
						overflowWrap: 'anywhere'
					}}
					onBlur={e => onDescriptionChange(e.currentTarget.innerHTML)}
					dangerouslySetInnerHTML={{ __html: description }}
				></div>
			</div>
		</div>
	);
};

// ==========================================
// Subcomponent: SubtaskOptionsMenu
// ==========================================

interface SubtaskOptionsMenuProps {
	subtask: SubTask;
	onDelete: (id: string) => void;
	onConvertToCard: (subtask: SubTask) => void;
	onEditTitle?: () => void;
}

const SubtaskOptionsMenu: React.FC<SubtaskOptionsMenuProps> = ({
	subtask,
	onDelete,
	onConvertToCard,
	onEditTitle
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
		null
	);
	const menuRef = useRef<HTMLDivElement | null>(null);

	const handleToggle = () => {
		if (!isOpen && menuRef.current) {
			const rect = menuRef.current.getBoundingClientRect();
			const menuHeight = 175;
			const menuWidth = 200;
			const spaceBelow = window.innerHeight - rect.bottom;
			const openUp = spaceBelow < menuHeight && rect.top > menuHeight;
			const top = openUp ? rect.top - menuHeight - 4 : rect.bottom + 4;
			const left = Math.max(10, rect.right - menuWidth);
			setMenuPos({ top, left });
		}
		setIsOpen(prev => !prev);
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		const handleScroll = () => {
			if (isOpen) setIsOpen(false);
		};
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			window.addEventListener('scroll', handleScroll, true);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [isOpen]);

	return (
		<div className="dropdown position-relative" ref={menuRef}>
			<button
				type="button"
				className={`btn btn-sm ${
					isOpen ? 'btn-secondary bg-secondary-subtle' : 'btn-light'
				} border-0 text-muted p-0 rounded-circle d-flex align-items-center justify-content-center`}
				style={{
					width: '28px',
					height: '28px',
					transition: 'all 0.15s ease'
				}}
				onClick={handleToggle}
				title="Subtask options"
				aria-expanded={isOpen}
			>
				<i className="bi bi-three-dots-vertical fs-7"></i>
			</button>

			{isOpen && menuPos && (
				<div
					className="dropdown-menu show shadow-lg border-0 py-2 position-fixed"
					style={{
						top: `${menuPos.top}px`,
						left: `${menuPos.left}px`,
						zIndex: 1075,
						minWidth: '200px',
						borderRadius: '12px',
						boxShadow:
							'0 12px 30px rgba(15, 23, 42, 0.15), 0 2px 8px rgba(15, 23, 42, 0.08)'
					}}
				>
					<div className="px-3 py-1 border-bottom mb-1">
						<span
							className="text-uppercase text-muted fw-bold"
							style={{
								fontSize: '0.7rem',
								letterSpacing: '0.5px'
							}}
						>
							Subtask Options
						</span>
					</div>
					{onEditTitle && (
						<button
							type="button"
							className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 fs-7 text-dark rounded-2 mx-1"
							style={{ width: 'calc(100% - 8px)' }}
							onClick={() => {
								setIsOpen(false);
								onEditTitle();
							}}
						>
							<i className="bi bi-pencil text-muted"></i>
							<span>Edit subtask title</span>
						</button>
					)}
					<button
						type="button"
						className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 fs-7 text-dark rounded-2 mx-1"
						style={{ width: 'calc(100% - 8px)' }}
						onClick={() => {
							setIsOpen(false);
							onConvertToCard(subtask);
						}}
					>
						<i className="bi bi-box-arrow-up-right text-primary"></i>
						<span>Convert to new card</span>
					</button>
					<div className="dropdown-divider my-1"></div>
					<button
						type="button"
						className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 fs-7 text-danger rounded-2 mx-1"
						style={{ width: 'calc(100% - 8px)' }}
						onClick={() => {
							setIsOpen(false);
							onDelete(subtask.id);
						}}
					>
						<i className="bi bi-trash3"></i>
						<span>Delete subtask</span>
					</button>
				</div>
			)}
		</div>
	);
};

// ==========================================
// Priority Configuration & Types
// ==========================================

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface PriorityOption {
	value: PriorityLevel;
	label: string;
	color: string;
	bgColor: string;
	icon: string;
}

const PRIORITY_OPTIONS: readonly PriorityOption[] = [
	{
		value: 'urgent',
		label: 'Urgent',
		color: '#ef4444',
		bgColor: '#fef2f2',
		icon: 'bi bi-exclamation-diamond-fill'
	},
	{
		value: 'high',
		label: 'High',
		color: '#f97316',
		bgColor: '#fff7ed',
		icon: 'bi bi-flag-fill'
	},
	{
		value: 'medium',
		label: 'Medium',
		color: '#eab308',
		bgColor: '#fefce8',
		icon: 'bi bi-flag-fill'
	},
	{
		value: 'low',
		label: 'Low',
		color: '#3b82f6',
		bgColor: '#eff6ff',
		icon: 'bi bi-flag'
	}
];

// ==========================================
// Subcomponent: SubtaskPriorityDropdown
// ==========================================

interface SubtaskPriorityDropdownProps {
	priority?: PriorityLevel;
	onChange: (priority?: PriorityLevel) => void;
	showLabelWhenEmpty?: boolean;
}

const SubtaskPriorityDropdown: React.FC<SubtaskPriorityDropdownProps> = ({
	priority,
	onChange,
	showLabelWhenEmpty = true
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
		null
	);
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	const handleToggle = () => {
		if (!isOpen && dropdownRef.current) {
			const rect = dropdownRef.current.getBoundingClientRect();
			const menuHeight = 220;
			const menuWidth = 160;
			const spaceBelow = window.innerHeight - rect.bottom;
			const openUp = spaceBelow < menuHeight && rect.top > menuHeight;
			const top = openUp ? rect.top - menuHeight - 4 : rect.bottom + 4;
			const left = Math.max(10, rect.right - menuWidth);
			setMenuPos({ top, left });
		}
		setIsOpen(prev => !prev);
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		const handleScroll = () => {
			if (isOpen) setIsOpen(false);
		};
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			window.addEventListener('scroll', handleScroll, true);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [isOpen]);

	const selectedOpt = PRIORITY_OPTIONS.find(p => p.value === priority);

	return (
		<div className="dropdown position-relative" ref={dropdownRef}>
			<button
				type="button"
				className={`btn btn-sm ${
					priority
						? 'border fw-medium'
						: 'btn-light border text-muted'
				} d-flex align-items-center gap-1 fs-8 px-2`}
				style={{
					height: '28px',
					color: selectedOpt ? selectedOpt.color : undefined,
					backgroundColor: selectedOpt
						? selectedOpt.bgColor
						: undefined
				}}
				onClick={handleToggle}
				title={
					selectedOpt
						? `Priority: ${selectedOpt.label}`
						: 'Choose priority'
				}
				aria-expanded={isOpen}
			>
				<i
					className={selectedOpt ? selectedOpt.icon : 'bi bi-flag'}
				></i>
				{selectedOpt ? (
					<span>{selectedOpt.label}</span>
				) : showLabelWhenEmpty ? (
					<span>Priority</span>
				) : null}
			</button>

			{isOpen && menuPos && (
				<div
					className="dropdown-menu show shadow border py-1 position-fixed"
					style={{
						top: `${menuPos.top}px`,
						left: `${menuPos.left}px`,
						zIndex: 1075,
						minWidth: '160px'
					}}
				>
					<h6 className="dropdown-header fs-8 text-uppercase fw-bold">
						Select Priority
					</h6>
					{PRIORITY_OPTIONS.map(opt => (
						<button
							key={opt.value}
							type="button"
							className={`dropdown-item d-flex align-items-center gap-2 py-1 fs-8 ${
								priority === opt.value
									? 'active fw-semibold'
									: ''
							}`}
							onClick={() => {
								onChange(
									priority === opt.value
										? undefined
										: opt.value
								);
								setIsOpen(false);
							}}
						>
							<i
								className={opt.icon}
								style={{ color: opt.color }}
							></i>
							<span>{opt.label}</span>
							{priority === opt.value && (
								<i className="bi bi-check2 ms-auto"></i>
							)}
						</button>
					))}
					{priority && (
						<>
							<div className="dropdown-divider my-1"></div>
							<button
								type="button"
								className="dropdown-item text-danger d-flex align-items-center gap-2 py-1 fs-8"
								onClick={() => {
									onChange(undefined);
									setIsOpen(false);
								}}
							>
								<i className="bi bi-x-circle"></i>
								<span>Clear Priority</span>
							</button>
						</>
					)}
				</div>
			)}
		</div>
	);
};

// ==========================================
// Subcomponent: SubtaskDatePickerDropdown
// ==========================================

interface SubtaskDatePickerDropdownProps {
	startDate?: string;
	dueDate?: string;
	onChange: (startDate?: string, dueDate?: string) => void;
	buttonClassName?: string;
	showLabelWhenEmpty?: boolean;
	emptyLabel?: string;
}

const SubtaskDatePickerDropdown: React.FC<SubtaskDatePickerDropdownProps> = ({
	startDate,
	dueDate,
	onChange,
	buttonClassName,
	showLabelWhenEmpty = true,
	emptyLabel = 'Due Date'
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
		null
	);
	const [tempStartDate, setTempStartDate] = useState(startDate || '');
	const [tempDueDate, setTempDueDate] = useState(dueDate || '');
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	const handleToggle = () => {
		if (!isOpen && dropdownRef.current) {
			const rect = dropdownRef.current.getBoundingClientRect();
			const menuHeight = 350;
			const menuWidth = 320;
			const spaceBelow = window.innerHeight - rect.bottom;
			const openUp = spaceBelow < menuHeight && rect.top > menuHeight;
			const top = openUp ? rect.top - menuHeight - 4 : rect.bottom + 4;
			const left = Math.max(
				10,
				Math.min(
					window.innerWidth - menuWidth - 10,
					rect.right - menuWidth
				)
			);
			setMenuPos({ top, left });
		}
		setIsOpen(prev => !prev);
	};

	useEffect(() => {
		setTempStartDate(startDate || '');
		setTempDueDate(dueDate || '');
	}, [startDate, dueDate, isOpen]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		const handleScroll = () => {
			if (isOpen) setIsOpen(false);
		};
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			window.addEventListener('scroll', handleScroll, true);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [isOpen]);

	const getTodayStr = () => new Date().toISOString().split('T')[0];
	const getTomorrowStr = () => {
		const d = new Date();
		d.setDate(d.getDate() + 1);
		return d.toISOString().split('T')[0];
	};
	const getNextWeekStr = () => {
		const d = new Date();
		d.setDate(d.getDate() + 7);
		return d.toISOString().split('T')[0];
	};

	const handleApply = () => {
		onChange(tempStartDate || undefined, tempDueDate || undefined);
		setIsOpen(false);
	};

	const handleClear = () => {
		setTempStartDate('');
		setTempDueDate('');
		onChange(undefined, undefined);
		setIsOpen(false);
	};

	const hasDates = !!(startDate || dueDate);

	return (
		<div className="dropdown position-relative" ref={dropdownRef}>
			<button
				type="button"
				className={
					buttonClassName ||
					`btn btn-sm ${
						hasDates
							? 'bg-primary-subtle text-primary border-primary-subtle fw-medium'
							: 'btn-light border text-muted'
					} d-inline-flex align-items-center gap-1 fs-8 px-2 py-0 rounded-pill border`
				}
				style={{
					height: '26px',
					fontSize: '0.78rem',
					transition: 'all 0.15s ease'
				}}
				onClick={handleToggle}
				title="Choose start date & due date"
				aria-expanded={isOpen}
			>
				<i className="bi bi-calendar3 text-primary fs-8"></i>
				{hasDates ? (
					<span className="d-inline-flex align-items-center">
						{startDate && (
							<span>{formatDateDisplay(startDate)}</span>
						)}
						{startDate && dueDate && (
							<i
								className="bi bi-arrow-right-short mx-1 text-primary-emphasis align-middle"
								style={{ fontSize: '1.15rem', lineHeight: 1 }}
							></i>
						)}
						{dueDate && <span>{formatDateDisplay(dueDate)}</span>}
					</span>
				) : showLabelWhenEmpty ? (
					<span>{emptyLabel}</span>
				) : null}
			</button>

			{isOpen && menuPos && (
				<div
					className="dropdown-menu show shadow-lg border-0 p-3 position-fixed"
					style={{
						top: `${menuPos.top}px`,
						left: `${menuPos.left}px`,
						zIndex: 1075,
						minWidth: '310px',
						borderRadius: '12px',
						backgroundColor: '#ffffff',
						boxShadow:
							'0 12px 32px rgba(15, 23, 42, 0.15), 0 2px 6px rgba(15, 23, 42, 0.08)'
					}}
				>
					{/* Modal Header */}
					<div className="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
						<div className="d-flex align-items-center gap-2">
							<div
								className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary"
								style={{ width: '28px', height: '28px' }}
							>
								<i className="bi bi-calendar3 fs-8"></i>
							</div>
							<div>
								<h6 className="m-0 fw-semibold fs-7 text-dark">
									Schedule & Due Date
								</h6>
							</div>
						</div>
						{(tempStartDate || tempDueDate) && (
							<button
								type="button"
								className="btn btn-sm btn-link text-danger text-decoration-none p-0 fs-8 fw-medium"
								onClick={handleClear}
							>
								Clear
							</button>
						)}
					</div>

					{/* Quick Select Buttons */}
					<div className="mb-3">
						<div
							className="text-muted fs-8 fw-semibold mb-1 text-uppercase"
							style={{ letterSpacing: '0.5px' }}
						>
							Quick Due Date
						</div>
						<div className="d-flex gap-1 flex-wrap">
							<button
								type="button"
								className={`btn btn-sm py-1 px-2 fs-8 rounded-pill border ${
									tempDueDate === getTodayStr()
										? 'btn-primary text-white border-primary fw-medium'
										: 'btn-light text-dark'
								}`}
								onClick={() => setTempDueDate(getTodayStr())}
							>
								Today
							</button>
							<button
								type="button"
								className={`btn btn-sm py-1 px-2 fs-8 rounded-pill border ${
									tempDueDate === getTomorrowStr()
										? 'btn-primary text-white border-primary fw-medium'
										: 'btn-light text-dark'
								}`}
								onClick={() => setTempDueDate(getTomorrowStr())}
							>
								Tomorrow
							</button>
							<button
								type="button"
								className={`btn btn-sm py-1 px-2 fs-8 rounded-pill border ${
									tempDueDate === getNextWeekStr()
										? 'btn-primary text-white border-primary fw-medium'
										: 'btn-light text-dark'
								}`}
								onClick={() => setTempDueDate(getNextWeekStr())}
							>
								Next Week
							</button>
						</div>
					</div>

					{/* Date Inputs */}
					<div className="row g-2 mb-3">
						<div className="col-6">
							<label className="form-label fs-8 text-muted mb-1 d-flex align-items-center gap-1 fw-medium">
								<i className="bi bi-calendar-event text-primary"></i>
								<span>Start Date</span>
							</label>
							<input
								type="date"
								className="form-control form-control-sm rounded-3 shadow-none border"
								style={{
									fontSize: '0.8rem',
									backgroundColor: '#f8fafc',
									height: '34px'
								}}
								value={tempStartDate}
								onChange={e => setTempStartDate(e.target.value)}
							/>
						</div>
						<div className="col-6">
							<label className="form-label fs-8 text-muted mb-1 d-flex align-items-center gap-1 fw-medium">
								<i className="bi bi-calendar-check text-danger"></i>
								<span>Due Date</span>
							</label>
							<input
								type="date"
								className="form-control form-control-sm rounded-3 shadow-none border"
								style={{
									fontSize: '0.8rem',
									backgroundColor: '#f8fafc',
									height: '34px'
								}}
								value={tempDueDate}
								onChange={e => setTempDueDate(e.target.value)}
							/>
						</div>
					</div>

					{/* Modal Footer / Actions */}
					<div className="d-flex align-items-center justify-content-between pt-2 border-top">
						<button
							type="button"
							className="btn btn-sm btn-light text-muted px-3 py-1 fs-8 rounded-3"
							onClick={() => setIsOpen(false)}
						>
							Cancel
						</button>
						<button
							type="button"
							className="btn btn-sm btn-primary px-3 py-1 fs-8 rounded-3 fw-medium shadow-xs"
							onClick={handleApply}
						>
							Save Date
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

// ==========================================
// Subcomponent: SubtaskAssigneeDropdown
// ==========================================

interface SubtaskAssigneeDropdownProps {
	assignee?: Member;
	onSelectAssignee: (member?: Member) => void;
	showLabelWhenEmpty?: boolean;
}

const SubtaskAssigneeDropdown: React.FC<SubtaskAssigneeDropdownProps> = ({
	assignee,
	onSelectAssignee,
	showLabelWhenEmpty = false
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
		null
	);
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	const handleToggle = () => {
		if (!isOpen && dropdownRef.current) {
			const rect = dropdownRef.current.getBoundingClientRect();
			const menuHeight = 220;
			const menuWidth = 190;
			const spaceBelow = window.innerHeight - rect.bottom;
			const openUp = spaceBelow < menuHeight && rect.top > menuHeight;
			const top = openUp ? rect.top - menuHeight - 4 : rect.bottom + 4;
			const left = Math.max(10, rect.right - menuWidth);
			setMenuPos({ top, left });
		}
		setIsOpen(prev => !prev);
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		const handleScroll = () => {
			if (isOpen) setIsOpen(false);
		};
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			window.addEventListener('scroll', handleScroll, true);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [isOpen]);

	return (
		<div className="dropdown position-relative" ref={dropdownRef}>
			{showLabelWhenEmpty ? (
				<button
					type="button"
					className={`btn btn-sm ${
						assignee
							? 'btn-light border text-dark fw-medium'
							: 'btn-light border text-muted'
					} d-flex align-items-center gap-1 fs-8 px-2`}
					style={{ height: '28px' }}
					onClick={handleToggle}
					title={
						assignee
							? `Assignee: ${assignee.name}`
							: 'Assign member'
					}
					aria-expanded={isOpen}
				>
					{assignee ? (
						<>
							<img
								src={assignee.avatar}
								alt={assignee.name}
								className="rounded-circle"
								style={{
									width: '18px',
									height: '18px',
									objectFit: 'cover'
								}}
							/>
							<span>{assignee.name}</span>
						</>
					) : (
						<>
							<i className="bi bi-person-plus fs-7"></i>
							<span>Assign</span>
						</>
					)}
				</button>
			) : (
				<button
					type="button"
					className="btn btn-sm btn-light border-0 p-0 rounded-circle"
					style={{
						width: '28px',
						height: '28px'
					}}
					onClick={handleToggle}
					title={
						assignee
							? `Assigned to: ${assignee.name}`
							: 'Assign member'
					}
					aria-expanded={isOpen}
				>
					{assignee ? (
						<img
							src={assignee.avatar}
							alt={assignee.name}
							className="rounded-circle w-100 h-100 object-fit-cover"
						/>
					) : (
						<span className="d-flex align-items-center justify-content-center w-100 h-100 text-muted bg-white border rounded-circle">
							<i className="bi bi-person-plus fs-7"></i>
						</span>
					)}
				</button>
			)}

			{isOpen && menuPos && (
				<div
					className="dropdown-menu show shadow-lg border-0 py-2 position-fixed"
					style={{
						top: `${menuPos.top}px`,
						left: `${menuPos.left}px`,
						zIndex: 1075,
						minWidth: '190px',
						borderRadius: '12px'
					}}
				>
					<div className="px-3 py-1 border-bottom mb-1">
						<span
							className="text-uppercase text-muted fw-bold"
							style={{
								fontSize: '0.7rem',
								letterSpacing: '0.5px'
							}}
						>
							Assign Member
						</span>
					</div>
					{MOCK_MEMBERS.map(m => (
						<button
							key={m.id}
							type="button"
							className={`dropdown-item d-flex align-items-center gap-2 py-1 fs-8 ${
								assignee?.id === m.id ? 'active' : ''
							}`}
							onClick={() => {
								onSelectAssignee(
									assignee?.id === m.id ? undefined : m
								);
								setIsOpen(false);
							}}
						>
							<img
								src={m.avatar}
								alt={m.name}
								className="rounded-circle"
								style={{
									width: '20px',
									height: '20px',
									objectFit: 'cover'
								}}
							/>
							<span>{m.name}</span>
							{assignee?.id === m.id && (
								<i className="bi bi-check2 ms-auto"></i>
							)}
						</button>
					))}
					{assignee && (
						<>
							<div className="dropdown-divider my-1"></div>
							<button
								type="button"
								className="dropdown-item text-danger d-flex align-items-center gap-2 py-1 fs-8"
								onClick={() => {
									onSelectAssignee(undefined);
									setIsOpen(false);
								}}
							>
								<i className="bi bi-x-circle"></i>
								<span>Remove Assignee</span>
							</button>
						</>
					)}
				</div>
			)}
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
	onConvertToCard?: (subtask: SubTask) => void;
	onLogActivity?: (type: CardActivity['type'], text: string) => void;
}

const SubtasksSection: React.FC<SubtasksSectionProps> = ({
	subtasks,
	onUpdateSubtasks,
	isAddingSubtask,
	setIsAddingSubtask,
	onConvertToCard,
	onLogActivity
}) => {
	const [newTitle, setNewTitle] = useState('');
	const [newAssignee, setNewAssignee] = useState<Member | undefined>(
		undefined
	);
	const [newStartDate, setNewStartDate] = useState('');
	const [newDueDate, setNewDueDate] = useState('');
	const [newPriority, setNewPriority] = useState<PriorityLevel | undefined>(
		undefined
	);
	const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(
		null
	);
	const [editingTitle, setEditingTitle] = useState('');

	const completedCount = subtasks.filter(st => st.completed).length;
	const progressPercent =
		subtasks.length > 0
			? Math.round((completedCount / subtasks.length) * 100)
			: 0;

	const handleSaveEditTitle = (id: string) => {
		const trimmed = editingTitle.trim();
		const current = subtasks.find(st => st.id === id);
		if (trimmed && current && trimmed !== current.title) {
			onUpdateSubtasks(
				subtasks.map(st =>
					st.id === id ? { ...st, title: trimmed } : st
				)
			);
			onLogActivity?.('subtask', `renamed subtask to "${trimmed}"`);
		}
		setEditingSubtaskId(null);
	};

	const handleToggleSubtask = (id: string) => {
		const current = subtasks.find(st => st.id === id);
		const willBeCompleted = !current?.completed;
		onUpdateSubtasks(
			subtasks.map(st =>
				st.id === id ? { ...st, completed: willBeCompleted } : st
			)
		);
		if (current) {
			onLogActivity?.(
				'subtask',
				`${willBeCompleted ? 'completed' : 'marked incomplete'} subtask "${current.title}"`
			);
		}
	};

	const handleDeleteSubtask = (id: string) => {
		const current = subtasks.find(st => st.id === id);
		onUpdateSubtasks(subtasks.filter(st => st.id !== id));
		if (current) {
			onLogActivity?.('subtask', `deleted subtask "${current.title}"`);
		}
	};

	const handleConvertToCard = (subtask: SubTask) => {
		if (onConvertToCard) {
			onConvertToCard(subtask);
		}
		onLogActivity?.(
			'subtask',
			`converted subtask "${subtask.title}" to card`
		);
	};

	const handleUpdateAssignee = (id: string, member?: Member) => {
		const current = subtasks.find(st => st.id === id);
		onUpdateSubtasks(
			subtasks.map(st =>
				st.id === id ? { ...st, assignee: member } : st
			)
		);
		if (current) {
			onLogActivity?.(
				'member',
				member
					? `assigned "${current.title}" to ${member.name}`
					: `removed assignee from "${current.title}"`
			);
		}
	};

	const handleUpdateDates = (
		id: string,
		startDate?: string,
		dueDate?: string
	) => {
		const current = subtasks.find(st => st.id === id);
		onUpdateSubtasks(
			subtasks.map(st =>
				st.id === id ? { ...st, startDate, dueDate } : st
			)
		);
		if (current) {
			const dateStr = [
				startDate ? formatDateDisplay(startDate) : '',
				dueDate ? formatDateDisplay(dueDate) : ''
			]
				.filter(Boolean)
				.join(' → ');
			onLogActivity?.(
				'date',
				dateStr
					? `updated dates for subtask "${current.title}" to ${dateStr}`
					: `cleared dates for subtask "${current.title}"`
			);
		}
	};

	const handleUpdatePriority = (id: string, priority?: PriorityLevel) => {
		const current = subtasks.find(st => st.id === id);
		onUpdateSubtasks(
			subtasks.map(st => (st.id === id ? { ...st, priority } : st))
		);
		if (current) {
			onLogActivity?.(
				'subtask',
				priority
					? `set priority of "${current.title}" to ${priority}`
					: `cleared priority for "${current.title}"`
			);
		}
	};

	const handleAddSubtask = () => {
		if (!newTitle.trim()) return;
		const subtaskTitle = newTitle.trim();
		const newSubtask: SubTask = {
			id: `subtask-${Date.now()}`,
			title: subtaskTitle,
			completed: false,
			assignee: newAssignee,
			startDate: newStartDate || undefined,
			dueDate: newDueDate || undefined,
			priority: newPriority
		};
		onUpdateSubtasks([...subtasks, newSubtask]);
		onLogActivity?.('subtask', `added subtask "${subtaskTitle}"`);
		setNewTitle('');
		setNewAssignee(undefined);
		setNewStartDate('');
		setNewDueDate('');
		setNewPriority(undefined);
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
						<div
							className="progress flex-grow-1"
							style={{ height: '6px' }}
						>
							<div
								className={`progress-bar ${
									progressPercent === 100
										? 'bg-success'
										: 'bg-primary'
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
						className={`d-flex flex-column p-2 rounded-3 border transition-all ${
							st.completed
								? 'bg-light bg-opacity-50'
								: 'bg-white shadow-xs'
						}`}
						style={{ transition: 'all 0.15s ease' }}
					>
						<div className="d-flex align-items-start justify-content-between gap-2">
							<div
								className="d-flex align-items-start gap-2 flex-grow-1"
								style={{ minWidth: 0 }}
							>
								<input
									type="checkbox"
									className="form-check-input mt-1 cursor-pointer flex-shrink-0"
									style={{ width: '18px', height: '18px' }}
									checked={st.completed}
									onChange={() => handleToggleSubtask(st.id)}
									id={`subtask-check-${st.id}`}
								/>
								{editingSubtaskId === st.id ? (
									<textarea
										className="form-control form-control-sm py-1 px-2 fw-medium border-primary shadow-none flex-grow-1"
										rows={1}
										style={{
											minHeight: '28px',
											fontSize: '0.875rem',
											lineHeight: '1.4',
											resize: 'none',
											wordBreak: 'break-word',
											overflowWrap: 'anywhere'
										}}
										value={editingTitle}
										onChange={e =>
											setEditingTitle(e.target.value)
										}
										onBlur={() =>
											handleSaveEditTitle(st.id)
										}
										onKeyDown={e => {
											if (
												e.key === 'Enter' &&
												!e.shiftKey
											) {
												e.preventDefault();
												handleSaveEditTitle(st.id);
											}
											if (e.key === 'Escape')
												setEditingSubtaskId(null);
										}}
										autoFocus
									/>
								) : (
									<div
										className="flex-grow-1 min-width-0"
										style={{ minWidth: 0 }}
									>
										<span
											className={`user-select-none cursor-pointer d-block ${
												st.completed
													? 'text-decoration-line-through text-muted fst-italic'
													: 'text-dark fw-medium'
											}`}
											style={{
												cursor: 'pointer',
												wordBreak: 'break-word',
												overflowWrap: 'anywhere',
												lineHeight: '1.4',
												minWidth: 0
											}}
											onClick={() => {
												setEditingSubtaskId(st.id);
												setEditingTitle(st.title);
											}}
											title={`${st.title} (Click to edit title)`}
										>
											{st.title}
										</span>
									</div>
								)}
							</div>

							<div className="d-flex align-items-center gap-2 flex-shrink-0 mt-0.5">
								{/* Assignee button / avatar */}
								<SubtaskAssigneeDropdown
									assignee={st.assignee}
									onSelectAssignee={member =>
										handleUpdateAssignee(st.id, member)
									}
									showLabelWhenEmpty={false}
								/>

								{/* Date button with smooth dropdown for Start Date & Due Date */}
								<SubtaskDatePickerDropdown
									startDate={st.startDate}
									dueDate={st.dueDate}
									onChange={(sDate, dDate) =>
										handleUpdateDates(st.id, sDate, dDate)
									}
									showLabelWhenEmpty={false}
								/>

								{/* Priority dropdown */}
								<SubtaskPriorityDropdown
									priority={st.priority}
									onChange={p =>
										handleUpdatePriority(st.id, p)
									}
									showLabelWhenEmpty={false}
								/>

								{/* Subtask options (3 dots) */}
								<SubtaskOptionsMenu
									subtask={st}
									onDelete={handleDeleteSubtask}
									onConvertToCard={handleConvertToCard}
									onEditTitle={() => {
										setEditingSubtaskId(st.id);
										setEditingTitle(st.title);
									}}
								/>
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
								if (e.key === 'Escape')
									setIsAddingSubtask(false);
							}}
							autoFocus
						/>
						<div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
							{/* Left Group: Add & Cancel */}
							<div className="d-flex align-items-center gap-2">
								<button
									type="button"
									className="btn btn-primary btn-sm px-3"
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
										setNewAssignee(undefined);
										setNewStartDate('');
										setNewDueDate('');
										setNewPriority(undefined);
									}}
								>
									Cancel
								</button>
							</div>

							{/* Right Group: Assign, Due Date, Priority */}
							<div className="d-flex align-items-center gap-2">
								{/* Assign Member with text 'Assign' */}
								<SubtaskAssigneeDropdown
									assignee={newAssignee}
									onSelectAssignee={setNewAssignee}
									showLabelWhenEmpty={true}
								/>

								{/* Due Date with beautiful smooth popover */}
								<SubtaskDatePickerDropdown
									startDate={newStartDate}
									dueDate={newDueDate}
									onChange={(sDate, dDate) => {
										setNewStartDate(sDate || '');
										setNewDueDate(dDate || '');
									}}
									showLabelWhenEmpty={true}
									emptyLabel="Due Date"
								/>

								{/* Choose Priority Dropdown */}
								<SubtaskPriorityDropdown
									priority={newPriority}
									onChange={setNewPriority}
									showLabelWhenEmpty={true}
								/>
							</div>
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
											style={{
												width: '40px',
												height: '40px'
											}}
										>
											<i className="bi bi-file-earmark-pdf fs-4"></i>
										</div>
									) : isDoc(att.type, att.name) ? (
										<div
											className="rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
											style={{
												width: '40px',
												height: '40px'
											}}
										>
											<i className="bi bi-file-earmark-word fs-4"></i>
										</div>
									) : (
										<div
											className="rounded bg-secondary bg-opacity-10 text-secondary d-flex align-items-center justify-content-center"
											style={{
												width: '40px',
												height: '40px'
											}}
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
											{formatFileSize(att.size)} • Added{' '}
											{att.createdAt}
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
										onClick={() =>
											handleDeleteAttachment(att.id)
										}
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
// Subcomponent: ActivitySection
// ==========================================

interface ActivitySectionProps {
	comments: CardComment[];
	activities: CardActivity[];
	currentUser: Member;
	onAddComment: (content: string) => void;
	onReplyComment: (commentId: string, content: string) => void;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
	comments,
	activities,
	currentUser,
	onAddComment,
	onReplyComment
}) => {
	const [newCommentText, setNewCommentText] = useState('');
	const [isCommentInputOpen, setIsCommentInputOpen] = useState(false);
	const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
	const [replyText, setReplyText] = useState('');
	const [activeFilter, setActiveFilter] = useState<
		'all' | 'comments' | 'history'
	>('all');

	const handlePostComment = () => {
		if (!newCommentText.trim()) return;
		onAddComment(newCommentText.trim());
		setNewCommentText('');
		setIsCommentInputOpen(false);
	};

	const handlePostReply = (commentId: string) => {
		if (!replyText.trim()) return;
		onReplyComment(commentId, replyText.trim());
		setReplyText('');
		setActiveReplyId(null);
	};

	const totalCommentsCount = comments.reduce(
		(sum, c) => sum + 1 + (c.replies ? c.replies.length : 0),
		0
	);

	type TimelineItem =
		| { kind: 'comment'; data: CardComment; timestamp: string }
		| { kind: 'activity'; data: CardActivity; timestamp: string };

	const timelineItems: TimelineItem[] = [];

	if (activeFilter === 'all' || activeFilter === 'comments') {
		comments.forEach(c => {
			timelineItems.push({
				kind: 'comment',
				data: c,
				timestamp: c.createdAt
			});
		});
	}

	if (activeFilter === 'all' || activeFilter === 'history') {
		activities.forEach(a => {
			timelineItems.push({
				kind: 'activity',
				data: a,
				timestamp: a.timestamp
			});
		});
	}

	const getActivityIcon = (type: string) => {
		switch (type) {
		case 'subtask':
			return 'bi-check2-square text-success';
		case 'date':
			return 'bi-calendar-event text-warning';
		case 'attachment':
			return 'bi-paperclip text-info';
		case 'status':
			return 'bi-kanban text-primary';
		case 'member':
			return 'bi-people text-secondary';
		case 'title':
			return 'bi-pencil text-secondary';
		case 'comment':
			return 'bi-chat-left-text text-primary';
		default:
			return 'bi-activity text-muted';
		}
	};

	return (
		<div
			className="activity-section h-100 d-flex flex-column"
			style={{
				width: '100%',
				maxWidth: '100%',
				minWidth: 0,
				overflowX: 'hidden'
			}}
		>
			{/* Activity Header & Filter */}
			<div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom flex-wrap gap-2">
				<div className="d-flex align-items-center gap-2">
					<div
						className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0"
						style={{ width: '28px', height: '28px' }}
					>
						<i className="bi bi-activity fs-7"></i>
					</div>
					<h6 className="m-0 fw-semibold text-dark">Activity</h6>
				</div>

				<div className="btn-group btn-group-sm flex-shrink-0" role="group">
					<button
						type="button"
						className={`btn btn-sm py-0 px-2 fs-8 rounded-start-pill ${
							activeFilter === 'all'
								? 'btn-primary text-white fw-medium'
								: 'btn-light border text-muted'
						}`}
						onClick={() => setActiveFilter('all')}
					>
						All
					</button>
					<button
						type="button"
						className={`btn btn-sm py-0 px-2 fs-8 ${
							activeFilter === 'comments'
								? 'btn-primary text-white fw-medium'
								: 'btn-light border text-muted'
						}`}
						onClick={() => setActiveFilter('comments')}
					>
						Comments ({totalCommentsCount})
					</button>
					<button
						type="button"
						className={`btn btn-sm py-0 px-2 fs-8 rounded-end-pill ${
							activeFilter === 'history'
								? 'btn-primary text-white fw-medium'
								: 'btn-light border text-muted'
						}`}
						onClick={() => setActiveFilter('history')}
					>
						History
					</button>
				</div>
			</div>

			{/* Add Comment Box */}
			<div className="mb-3" style={{ minWidth: 0, maxWidth: '100%' }}>
				<div className="d-flex gap-2 align-items-start">
					<img
						src={currentUser.avatar}
						alt={currentUser.name}
						className="rounded-circle flex-shrink-0"
						style={{
							width: '32px',
							height: '32px',
							objectFit: 'cover'
						}}
					/>
					<div
						className="flex-grow-1"
						style={{ minWidth: 0, maxWidth: '100%' }}
					>
						<div
							className={`border rounded-3 p-2 bg-white shadow-xs ${
								isCommentInputOpen ? 'border-primary' : ''
							}`}
							style={{
								transition: 'border-color 0.15s ease',
								minWidth: 0,
								maxWidth: '100%'
							}}
						>
							<textarea
								className="form-control border-0 p-1 shadow-none fs-7"
								rows={isCommentInputOpen ? 3 : 1}
								placeholder="Write a comment..."
								value={newCommentText}
								onChange={e =>
									setNewCommentText(e.target.value)
								}
								onFocus={() => setIsCommentInputOpen(true)}
								style={{
									resize: 'none',
									wordBreak: 'break-word',
									overflowWrap: 'anywhere'
								}}
							/>
							{isCommentInputOpen && (
								<div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top flex-wrap gap-2">
									<span className="text-muted fs-8">
										Press Comment to post
									</span>
									<div className="d-flex gap-2">
										<button
											type="button"
											className="btn btn-sm btn-light text-muted px-2 py-1 fs-8"
											onClick={() => {
												setIsCommentInputOpen(false);
												setNewCommentText('');
											}}
										>
											Cancel
										</button>
										<button
											type="button"
											className="btn btn-sm btn-primary px-3 py-1 fs-8 fw-medium"
											disabled={!newCommentText.trim()}
											onClick={handlePostComment}
										>
											Comment
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Timeline Stream */}
			<div
				className="timeline-stream d-flex flex-column gap-3 pe-1 flex-grow-1"
				style={{
					maxHeight: '480px',
					overflowY: 'auto',
					overflowX: 'hidden',
					scrollbarGutter: 'stable',
					width: '100%',
					maxWidth: '100%',
					minWidth: 0
				}}
			>
				{timelineItems.length === 0 ? (
					<div className="text-center text-muted py-4 fs-8">
						<i className="bi bi-chat-dots fs-3 d-block mb-1 text-muted opacity-50"></i>
						No activity or comments yet.
					</div>
				) : (
					timelineItems.map((item, index) => {
						if (item.kind === 'comment') {
							const comment = item.data;
							const hasReplies =
								comment.replies && comment.replies.length > 0;
							return (
								<div
									key={comment.id || `com-${index}`}
									className="comment-item d-flex gap-2 align-items-start"
									style={{ minWidth: 0, maxWidth: '100%' }}
								>
									<img
										src={comment.author.avatar}
										alt={comment.author.name}
										className="rounded-circle flex-shrink-0 mt-1"
										style={{
											width: '28px',
											height: '28px',
											objectFit: 'cover'
										}}
									/>
									<div
										className="flex-grow-1"
										style={{
											minWidth: 0,
											maxWidth: '100%'
										}}
									>
										<div
											className="p-2 px-3 rounded-3 bg-light bg-opacity-75 border"
											style={{
												minWidth: 0,
												maxWidth: '100%',
												overflowWrap: 'anywhere',
												wordBreak: 'break-word'
											}}
										>
											<div className="d-flex align-items-center justify-content-between mb-1 gap-2">
												<span
													className="fw-semibold fs-8 text-dark text-truncate"
													style={{ minWidth: 0 }}
												>
													{comment.author.name}
												</span>
												<span className="text-muted fs-8 flex-shrink-0">
													{comment.createdAt}
												</span>
											</div>
											<div
												className="fs-7 text-dark"
												style={{
													whiteSpace: 'pre-wrap',
													wordBreak: 'break-word',
													overflowWrap: 'anywhere',
													minWidth: 0,
													maxWidth: '100%'
												}}
											>
												{comment.content}
											</div>
										</div>

										{/* Reply action button */}
										<div className="d-flex align-items-center gap-2 mt-1 ps-1">
											<button
												type="button"
												className="btn btn-sm btn-link text-decoration-none p-0 fs-8 text-primary fw-medium d-inline-flex align-items-center gap-1"
												onClick={() =>
													setActiveReplyId(prev =>
														prev === comment.id
															? null
															: comment.id
													)
												}
											>
												<i className="bi bi-reply-fill"></i>
												<span>Reply</span>
											</button>
										</div>

										{/* Nested replies */}
										{hasReplies && (
											<div
												className="border-start border-2 border-primary border-opacity-25 ps-2 ms-2 mt-2 d-flex flex-column gap-2"
												style={{
													minWidth: 0,
													maxWidth: '100%'
												}}
											>
												{comment.replies!.map(
													(rep, rIdx) => (
														<div
															key={
																rep.id ||
																`rep-${rIdx}`
															}
															className="d-flex gap-2 align-items-start"
															style={{
																minWidth: 0,
																maxWidth: '100%'
															}}
														>
															<img
																src={
																	rep.author
																		.avatar
																}
																alt={
																	rep.author
																		.name
																}
																className="rounded-circle flex-shrink-0 mt-1"
																style={{
																	width: '22px',
																	height: '22px',
																	objectFit:
																		'cover'
																}}
															/>
															<div
																className="flex-grow-1 p-2 rounded-3 bg-light border"
																style={{
																	minWidth: 0,
																	maxWidth:
																		'100%',
																	wordBreak:
																		'break-word',
																	overflowWrap:
																		'anywhere'
																}}
															>
																<div className="d-flex align-items-center justify-content-between mb-0.5 gap-2">
																	<span
																		className="fw-semibold fs-8 text-dark text-truncate"
																		style={{
																			minWidth: 0
																		}}
																	>
																		{
																			rep
																				.author
																				.name
																		}
																	</span>
																	<span className="text-muted fs-8 flex-shrink-0">
																		{
																			rep.createdAt
																		}
																	</span>
																</div>
																<div
																	className="fs-8 text-dark"
																	style={{
																		whiteSpace:
																			'pre-wrap',
																		wordBreak:
																			'break-word',
																		overflowWrap:
																			'anywhere',
																		minWidth: 0,
																		maxWidth:
																			'100%'
																	}}
																>
																	{
																		rep.content
																	}
																</div>
															</div>
														</div>
													)
												)}
											</div>
										)}

										{/* Inline Reply Form */}
										{activeReplyId === comment.id && (
											<div
												className="border-start border-2 border-primary ps-2 ms-2 mt-2"
												style={{
													minWidth: 0,
													maxWidth: '100%'
												}}
											>
												<div className="d-flex gap-2 align-items-start">
													<img
														src={currentUser.avatar}
														alt={currentUser.name}
														className="rounded-circle flex-shrink-0 mt-1"
														style={{
															width: '22px',
															height: '22px',
															objectFit: 'cover'
														}}
													/>
													<div
														className="flex-grow-1"
														style={{
															minWidth: 0,
															maxWidth: '100%'
														}}
													>
														<textarea
															className="form-control form-control-sm shadow-none fs-8"
															rows={2}
															placeholder={`Reply to ${comment.author.name}...`}
															value={replyText}
															onChange={e =>
																setReplyText(
																	e.target
																		.value
																)
															}
															autoFocus
															style={{
																resize: 'none',
																wordBreak:
																	'break-word',
																overflowWrap:
																	'anywhere'
															}}
														/>
														<div className="d-flex gap-2 justify-content-end mt-2">
															<button
																type="button"
																className="btn btn-sm btn-light py-0 px-2 fs-8"
																onClick={() => {
																	setActiveReplyId(
																		null
																	);
																	setReplyText(
																		''
																	);
																}}
															>
																Cancel
															</button>
															<button
																type="button"
																className="btn btn-sm btn-primary py-0 px-2 fs-8 fw-medium"
																disabled={
																	!replyText.trim()
																}
																onClick={() =>
																	handlePostReply(
																		comment.id
																	)
																}
															>
																Reply
															</button>
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							);
						} else {
							const activity = item.data;
							const iconClass = getActivityIcon(activity.type);
							return (
								<div
									key={activity.id || `act-${index}`}
									className="activity-item d-flex align-items-start gap-2 fs-8"
									style={{ minWidth: 0, maxWidth: '100%' }}
								>
									<div
										className="rounded-circle bg-light border d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5"
										style={{
											width: '26px',
											height: '26px'
										}}
									>
										<i className={`bi ${iconClass}`}></i>
									</div>
									<div
										className="flex-grow-1"
										style={{
											minWidth: 0,
											maxWidth: '100%'
										}}
									>
										<div
											style={{
												wordBreak: 'break-word',
												overflowWrap: 'anywhere',
												minWidth: 0
											}}
										>
											<span className="fw-semibold text-dark">
												{activity.user.name}
											</span>{' '}
											<span className="text-secondary">
												{activity.text}
											</span>
										</div>
										<div className="text-muted fs-8 mt-0.5">
											{activity.timestamp}
										</div>
									</div>
								</div>
							);
						}
					})
				)}
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
	onMoveCard,
	onConvertSubtaskToCard
}) => {
	const dispatch = useDispatch();
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [isAddingSubtask, setIsAddingSubtask] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const {
		formData,
		updateField,
		toggleMember,
		logActivity,
		addComment,
		replyComment
	} = useCardForm(card, isOpen);

	const totalComments = formData.comments.reduce(
		(sum, c) => sum + 1 + (c.replies ? c.replies.length : 0),
		0
	);

	const handleConvertSubtaskToCard = (subtask: SubTask) => {
		const targetColId =
			currentColumnId ||
			(columns && columns.length > 0 ? columns[0].id : '');

		if (onConvertSubtaskToCard) {
			onConvertSubtaskToCard(subtask);
		} else if (targetColId) {
			dispatch(addCard(targetColId, subtask.title));
		}

		const updatedSubtasks = formData.subtasks.filter(
			st => st.id !== subtask.id
		);
		updateField('subtasks', updatedSubtasks);

		const completedSubtasks = updatedSubtasks.filter(
			st => st.completed
		).length;
		onSave({
			title: formData.title.trim() || card.title,
			description: formData.description,
			startDate: formData.startDate,
			endDate: formData.endDate,
			members: formData.members,
			subtasks: updatedSubtasks,
			attachments: formData.attachments,
			attachmentsCount: formData.attachments.length,
			comments: formData.comments,
			activities: formData.activities,
			commentsCount: totalComments,
			checklist:
				updatedSubtasks.length > 0
					? {
						total: updatedSubtasks.length,
						completed: completedSubtasks
					}
					: undefined
		});
	};

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
		const completedSubtasks = formData.subtasks.filter(
			st => st.completed
		).length;
		onSave({
			title: formData.title.trim() || card.title,
			description: formData.description,
			startDate: formData.startDate,
			endDate: formData.endDate,
			members: formData.members,
			subtasks: formData.subtasks,
			attachments: formData.attachments,
			attachmentsCount: formData.attachments.length,
			comments: formData.comments,
			activities: formData.activities,
			commentsCount: totalComments,
			checklist:
				formData.subtasks.length > 0
					? {
						total: formData.subtasks.length,
						completed: completedSubtasks
					}
					: undefined
		});
		onClose();
	};

	const handleStatusChange = (newColumnId: string) => {
		if (newColumnId !== currentColumnId && onMoveCard) {
			const targetCol = columns.find(c => c.id === newColumnId);
			if (targetCol) {
				logActivity('status', `moved card to "${targetCol.title}"`);
			}
			const completedSubtasks = formData.subtasks.filter(
				st => st.completed
			).length;
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
					comments: formData.comments,
					activities: formData.activities,
					commentsCount: totalComments,
					checklist:
						formData.subtasks.length > 0
							? {
								total: formData.subtasks.length,
								completed: completedSubtasks
							}
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
			logActivity('attachment', `attached file "${file.name}"`);
		});

		updateField('attachments', [
			...formData.attachments,
			...newAttachments
		]);
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
				<div
					className="modal-dialog modal-xl modal-dialog-centered"
					style={{ maxWidth: '1080px', width: '95%' }}
				>
					<div
						className="modal-content border-0 shadow-lg"
						style={{ borderRadius: '16px', maxHeight: '92vh' }}
					>
						{/* Header */}
						<div className="modal-header border-0 pb-0 pt-4 px-4 px-md-5 flex-column align-items-stretch">
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
										onChange={val => {
											updateField('title', val);
											if (
												val.trim() &&
												val.trim() !== card.title
											) {
												logActivity(
													'title',
													`changed card title to "${val.trim()}"`
												);
											}
										}}
										onFinish={() =>
											setIsEditingTitle(false)
										}
									/>
								) : (
									<div
										className="fw-bold fs-5 px-2 py-1 rounded cursor-pointer flex-grow-1"
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
											lineHeight: '1.4',
											wordBreak: 'break-word',
											overflowWrap: 'anywhere',
											minWidth: 0
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
						<div
							className="modal-body pt-3 pb-4 px-4 px-md-5"
							style={{
								maxHeight: 'calc(92vh - 140px)',
								overflowY: 'auto',
								overflowX: 'hidden',
								scrollbarGutter: 'stable'
							}}
						>
							<div
								className="w-100"
								style={{ maxWidth: '100%', minWidth: 0 }}
							>
								{/* Members & Dates */}
								<div className="d-flex flex-wrap gap-4 mb-4 align-items-start">
									<MembersSection
										selectedMembers={formData.members}
										onToggleMember={m => {
											toggleMember(m);
											const exists =
												formData.members.some(
													sm => sm.id === m.id
												);
											logActivity(
												'member',
												`${exists ? 'unassigned' : 'assigned'} member ${m.name}`
											);
										}}
									/>
									<DatesSection
										startDate={formData.startDate}
										endDate={formData.endDate}
										onChangeStartDate={val => {
											updateField('startDate', val);
											logActivity(
												'date',
												val
													? `updated card start date to ${formatDateDisplay(val)}`
													: 'cleared card start date'
											);
										}}
										onChangeEndDate={val => {
											updateField('endDate', val);
											logActivity(
												'date',
												val
													? `updated card due date to ${formatDateDisplay(val)}`
													: 'cleared card due date'
											);
										}}
									/>
								</div>

								{/* Description Section */}
								<RichDescriptionEditor
									description={formData.description}
									onDescriptionChange={val => {
										updateField('description', val);
										logActivity(
											'general',
											'updated card description'
										);
									}}
								/>

								{/* Subtasks Section */}
								<SubtasksSection
									subtasks={formData.subtasks}
									onUpdateSubtasks={sts =>
										updateField('subtasks', sts)
									}
									isAddingSubtask={isAddingSubtask}
									setIsAddingSubtask={setIsAddingSubtask}
									onConvertToCard={
										handleConvertSubtaskToCard
									}
									onLogActivity={logActivity}
								/>

								{/* Attachments Section */}
								<AttachmentsSection
									attachments={formData.attachments}
									onUpdateAttachments={atts => {
										const removed =
											formData.attachments.find(
												fa =>
													!atts.some(
														a => a.id === fa.id
													)
											);
										if (removed) {
											logActivity(
												'attachment',
												`removed attachment "${removed.name}"`
											);
										}
										updateField('attachments', atts);
									}}
									fileInputRef={fileInputRef}
									onFileUpload={handleFileUpload}
								/>

								{/* Activity Section (positioned below Attachments) */}
								<div className="border-top pt-4 mt-4">
									<ActivitySection
										comments={formData.comments}
										activities={formData.activities}
										currentUser={MOCK_MEMBERS[0]}
										onAddComment={addComment}
										onReplyComment={replyComment}
									/>
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className="modal-footer border-top bg-light py-2 px-4 px-md-5 rounded-bottom-4">
							<button
								type="button"
								className="btn btn-sm btn-light border me-2"
								onClick={onClose}
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-sm btn-primary px-3 fw-medium"
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
