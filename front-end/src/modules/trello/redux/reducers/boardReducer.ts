import { v4 as uuidv4 } from 'uuid';
import { ADD_LIST, ADD_CARD, BoardActionTypes } from '../types/board.js';
import { Board } from '../../../trello1/types/boards.js';

const initialState: Board = {
	id: uuidv4(),
	title: 'Trello Board',
	lists: []
};

export const boardReducer = (
	state = initialState,
	action: BoardActionTypes
): Board => {
	switch (action.type) {
	case ADD_LIST:
		return {
			...state,
			lists: [
				...state.lists,
				{
					id: uuidv4(),
					title: action.payload.title,
					cards: []
				}
			]
		};

	case ADD_CARD:
		return {
			...state,
			lists: state.lists.map(list =>
				list.id === action.payload.listId
					? {
						...list,
						cards: [
							...list.cards,
							{
								id: uuidv4(),
								title: action.payload.title
							}
						]
					}
					: list
			)
		};

	default:
		return state;
	}
};
