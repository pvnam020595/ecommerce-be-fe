export const ADD_LIST = 'ADD_LIST';
export const ADD_CARD = 'ADD_CARD';

export interface AddListAction {
	type: typeof ADD_LIST;
	payload: { title: string };
}

export interface AddCardAction {
	type: typeof ADD_CARD;
	payload: { listId: string; title: string };
}

export type BoardActionTypes = AddListAction | AddCardAction;
