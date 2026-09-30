import { v4 as uuidv4 } from 'uuid';
import {
	ADD_COLUMN,
	DELETE_COLUMN,
	EDIT_COLUMN,
	ADD_CARD,
	EDIT_CARD,
	DELETE_CARD,
	MOVE_CARD,
	MOVE_COLUMN,
	SET_BOARD,
	BoardActionTypes
} from '../types/board';
import { Board } from '../../interfaces/BoardInterface';

const initialState: Board = {
	id: uuidv4(),
	title: 'Acme Mobile App Redesign',
	columns: [
		{
			id: 'col-backlog',
			title: 'Backlog',
			cards: [
				{
					id: 'card-1',
					title: 'User research & interviews',
					description:
						'Conduct qualitative interviews with 10 target users.',
					labels: [
						{
							id: 'l1',
							text: 'Research',
							color: '#09326c',
							bg: '#e9f2ff'
						},
						{
							id: 'l2',
							text: 'Discovery',
							color: '#5e4db2',
							bg: '#f3f0ff'
						}
					],
					startDate: '2026-09-10',
					endDate: '2026-09-18',
					checklist: { total: 4, completed: 3 },
					commentsCount: 2,
					attachmentsCount: 1,
					subtasks: [
						{
							id: 'st-1',
							title: 'Prepare interview questionnaires',
							completed: true,
							assignee: {
								id: 'm1',
								name: 'Nam Pham',
								avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
							},
							startDate: '2026-09-10',
							dueDate: '2026-09-12'
						},
						{
							id: 'st-2',
							title: 'Recruit 10 test participants',
							completed: true,
							assignee: {
								id: 'm2',
								name: 'Alex Rivera',
								avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
							},
							startDate: '2026-09-11',
							dueDate: '2026-09-14'
						},
						{
							id: 'st-3',
							title: 'Conduct user interview calls',
							completed: true,
							assignee: {
								id: 'm1',
								name: 'Nam Pham',
								avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
							},
							startDate: '2026-09-13',
							dueDate: '2026-09-16'
						},
						{
							id: 'st-4',
							title: 'Synthesize insights into key takeaways',
							completed: false,
							assignee: {
								id: 'm2',
								name: 'Alex Rivera',
								avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
							},
							startDate: '2026-09-16',
							dueDate: '2026-09-18'
						}
					],
					attachments: [
						{
							id: 'att-1',
							name: 'user_interview_summary.pdf',
							size: 245000,
							type: 'application/pdf',
							url: '#',
							createdAt: 'Sep 12'
						}
					],
					members: [
						{
							id: 'm1',
							name: 'Nam Pham',
							avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
						},
						{
							id: 'm2',
							name: 'Alex Rivera',
							avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
						}
					],
					comments: [
						{
							id: 'com-1',
							author: {
								id: 'm2',
								name: 'Alex Rivera',
								avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
							},
							content:
								'I have finished interviewing the first 5 participants. Key insights are uploaded in the PDF attachment!',
							createdAt: 'Sep 12, 10:30 AM',
							replies: [
								{
									id: 'rep-1',
									author: {
										id: 'm1',
										name: 'Nam Pham',
										avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
									},
									content:
										'Awesome job Alex! Let me review the summary points before our next sync.',
									createdAt: 'Sep 12, 11:15 AM'
								}
							]
						}
					],
					activities: [
						{
							id: 'act-1',
							type: 'subtask',
							user: {
								id: 'm1',
								name: 'Nam Pham',
								avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
							},
							text: 'completed subtask "Conduct user interview calls"',
							timestamp: 'Sep 13, 02:45 PM'
						},
						{
							id: 'act-2',
							type: 'attachment',
							user: {
								id: 'm2',
								name: 'Alex Rivera',
								avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
							},
							text: 'attached file "user_interview_summary.pdf"',
							timestamp: 'Sep 12, 10:28 AM'
						},
						{
							id: 'act-3',
							type: 'general',
							user: {
								id: 'm1',
								name: 'Nam Pham',
								avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
							},
							text: 'created this card in Backlog',
							timestamp: 'Sep 10, 09:00 AM'
						}
					]
				},
				{
					id: 'card-2',
					title: 'Competitive analysis report',
					description:
						'Benchmark top 5 competing apps in Southeast Asia.',
					labels: [
						{
							id: 'l3',
							text: 'Strategy',
							color: '#7f5f01',
							bg: '#fff7d6'
						}
					],
					commentsCount: 1,
					members: [
						{
							id: 'm3',
							name: 'Sarah Connor',
							avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
						}
					]
				}
			]
		},
		{
			id: 'col-todo',
			title: 'To Do',
			cards: [
				{
					id: 'card-3',
					title: 'Design UI mockups & component tokens',
					description:
						'Create Figma design system components and tokens.',
					labels: [
						{
							id: 'l4',
							text: 'Design',
							color: '#ae2e24',
							bg: '#ffeceb'
						},
						{
							id: 'l5',
							text: 'Figma',
							color: '#5e4db2',
							bg: '#f3f0ff'
						}
					],
					startDate: '2026-09-15',
					endDate: '2026-09-22',
					checklist: { total: 5, completed: 2 },
					commentsCount: 4,
					attachmentsCount: 3,
					members: [
						{
							id: 'm1',
							name: 'Nam Pham',
							avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
						}
					]
				},
				{
					id: 'card-4',
					title: 'Setup project structure with Vite & React',
					description:
						'Strict TypeScript configuration and Redux core setup.',
					labels: [
						{
							id: 'l6',
							text: 'Engineering',
							color: '#216e4e',
							bg: '#dcfff1'
						}
					],
					commentsCount: 2,
					checklist: { total: 3, completed: 3 },
					members: [
						{
							id: 'm2',
							name: 'Alex Rivera',
							avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
						}
					]
				}
			]
		},
		{
			id: 'col-inprogress',
			title: 'In Progress',
			cards: [
				{
					id: 'card-5',
					title: 'Implement authentication flow & JWT validation',
					description:
						'Connect login and register APIs with Laravel 12 backend.',
					labels: [
						{
							id: 'l7',
							text: 'Backend',
							color: '#a54800',
							bg: '#fff3eb'
						},
						{
							id: 'l8',
							text: 'High Priority',
							color: '#ae2e24',
							bg: '#ffeceb'
						}
					],
					startDate: '2026-09-14',
					endDate: '2026-09-20',
					checklist: { total: 4, completed: 1 },
					commentsCount: 6,
					attachmentsCount: 2,
					members: [
						{
							id: 'm1',
							name: 'Nam Pham',
							avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
						},
						{
							id: 'm3',
							name: 'Sarah Connor',
							avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop'
						}
					]
				}
			]
		},
		{
			id: 'col-review',
			title: 'Review',
			cards: [
				{
					id: 'card-6',
					title: 'Code review: payment module gateway integration',
					description:
						'Review webhook handler and secure token storage.',
					labels: [
						{
							id: 'l9',
							text: 'QA & Review',
							color: '#206a83',
							bg: '#e7f9ff'
						}
					],
					commentsCount: 3,
					checklist: { total: 2, completed: 2 },
					members: [
						{
							id: 'm2',
							name: 'Alex Rivera',
							avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
						}
					]
				}
			]
		},
		{
			id: 'col-done',
			title: 'Done',
			cards: [
				{
					id: 'card-7',
					title: 'Setup CI/CD pipeline with GitHub Actions',
					description:
						'Automated test suite and lint checks on every commit.',
					labels: [
						{
							id: 'l10',
							text: 'DevOps',
							color: '#216e4e',
							bg: '#dcfff1'
						}
					],
					checklist: { total: 3, completed: 3 },
					members: [
						{
							id: 'm1',
							name: 'Nam Pham',
							avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'
						}
					]
				}
			]
		}
	]
};

export const boardReducer = (
	state = initialState,
	action: BoardActionTypes
): Board => {
	switch (action.type) {
	case ADD_COLUMN:
		return {
			...state,
			columns: [
				...state.columns,
				{
					id: uuidv4(),
					title: action.payload.title,
					cards: []
				}
			]
		};

	case DELETE_COLUMN:
		return {
			...state,
			columns: state.columns.filter(
				column => column.id !== action.payload.columnId
			)
		};

	case EDIT_COLUMN:
		return {
			...state,
			columns: state.columns.map(column =>
				column.id === action.payload.columnId
					? { ...column, title: action.payload.newTitle }
					: column
			)
		};

	case ADD_CARD:
		return {
			...state,
			columns: state.columns.map(column =>
				column.id === action.payload.columnId
					? {
						...column,
						cards: [
							...column.cards,
							{
								id: uuidv4(),
								title: action.payload.title
							}
						]
					}
					: column
			)
		};

	case EDIT_CARD:
		return {
			...state,
			columns: state.columns.map(column =>
				column.id === action.payload.columnId
					? {
						...column,
						cards: column.cards.map(card =>
							card.id === action.payload.cardId
								? { ...card, ...action.payload.updates }
								: card
						)
					}
					: column
			)
		};

	case DELETE_CARD:
		return {
			...state,
			columns: state.columns.map(column =>
				column.id === action.payload.columnId
					? {
						...column,
						cards: column.cards.filter(
							card => card.id !== action.payload.cardId
						)
					}
					: column
			)
		};

	case MOVE_CARD: {
		const { card, sourceColumnId, destinationColumnId, newIndex } =
				action.payload;
		const newColumns = state.columns
			.map(column => {
				if (column.id === sourceColumnId) {
					return {
						...column,
						cards: column.cards.filter(c => c.id !== card.id)
					};
				}
				return column;
			})
			.map(column => {
				if (column.id === destinationColumnId) {
					const newCards = [...column.cards];
					newCards.splice(newIndex, 0, card);
					return {
						...column,
						cards: newCards
					};
				}
				return column;
			});
		return { ...state, columns: newColumns };
	}

	case MOVE_COLUMN: {
		const { sourceIndex, destinationIndex } = action.payload;
		const newColumns = [...state.columns];
		const [movedColumn] = newColumns.splice(sourceIndex, 1);
		newColumns.splice(destinationIndex, 0, movedColumn);
		return { ...state, columns: newColumns };
	}

	case SET_BOARD:
		return {
			...state,
			columns: action.payload.columns
		};

	default:
		return state;
	}
};
