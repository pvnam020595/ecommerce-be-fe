import { Card } from '../../interfaces/BoardInterface';

export const ADD_COLUMN = 'ADD_COLUMN';
export const DELETE_COLUMN = 'DELETE_COLUMN';
export const EDIT_COLUMN = 'EDIT_COLUMN';
export const ADD_CARD = 'ADD_CARD';
export const EDIT_CARD = 'EDIT_CARD';
export const DELETE_CARD = 'DELETE_CARD';
export const MOVE_CARD = 'MOVE_CARD';
export const MOVE_COLUMN = 'MOVE_COLUMN';
export const SET_BOARD = 'SET_BOARD';

export interface AddColumnAction {
	type: typeof ADD_COLUMN;
	payload: { title: string };
}

export interface DeleteColumnAction {
	type: typeof DELETE_COLUMN;
	payload: { columnId: string };
}

export interface EditColumnAction {
	type: typeof EDIT_COLUMN;
	payload: { columnId: string; newTitle: string };
}

export interface AddCardAction {
	type: typeof ADD_CARD;
	payload: { columnId: string; title: string };
}

export interface EditCardAction {
	type: typeof EDIT_CARD;
	payload: { columnId: string; cardId: string; updates: Partial<Card> };
}

export interface DeleteCardAction {
	type: typeof DELETE_CARD;
	payload: { columnId: string; cardId: string };
}

export interface MoveCardAction {
	type: typeof MOVE_CARD;
	payload: {
		card: Card;
		sourceColumnId: string;
		destinationColumnId: string;
		newIndex: number;
	};
}

export interface MoveColumnAction {
	type: typeof MOVE_COLUMN;
	payload: {
		sourceIndex: number;
		destinationIndex: number;
	};
}

export interface SetBoardAction {
	type: typeof SET_BOARD;
	payload: { columns: import('../../interfaces/BoardInterface').Column[] };
}

export type BoardActionTypes = 
	| AddColumnAction 
	| DeleteColumnAction
	| EditColumnAction
	| AddCardAction 
	| EditCardAction
	| DeleteCardAction
	| MoveCardAction 
	| MoveColumnAction 
	| SetBoardAction;
