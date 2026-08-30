import { BoardActionTypes, ADD_CARD, ADD_LIST } from '../types/board';

export const addList = (title: string): BoardActionTypes => ({
	type: ADD_LIST,
	payload: { title }
});

export const addCard = (listId: string, title: string): BoardActionTypes => ({
	type: ADD_CARD,
	payload: { listId, title }
});
