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
	title: 'Project Management',
	columns: [
		{
			id: uuidv4(),
			title: 'To Do',
			cards: [
				{ id: uuidv4(), title: 'Design UI mockups' },
				{ id: uuidv4(), title: 'Setup project structure' },
				{ id: uuidv4(), title: 'Write API documentation' }
			]
		},
		{
			id: uuidv4(),
			title: 'In Progress',
			cards: [
				{ id: uuidv4(), title: 'Implement authentication' },
				{ id: uuidv4(), title: 'Build dashboard layout' }
			]
		},
		{
			id: uuidv4(),
			title: 'Review',
			cards: [{ id: uuidv4(), title: 'Code review: payment module' }]
		},
		{
			id: uuidv4(),
			title: 'Done',
			cards: [
				{ id: uuidv4(), title: 'Setup CI/CD pipeline' },
				{ id: uuidv4(), title: 'Configure database' }
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
