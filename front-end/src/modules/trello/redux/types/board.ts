import type { Action } from 'redux';
import { Card, Column } from '@modules/trello/interfaces/BoardInterface';

export const ADD_COLUMN = 'ADD_COLUMN';
export const DELETE_COLUMN = 'DELETE_COLUMN';
export const EDIT_COLUMN = 'EDIT_COLUMN';
export const ADD_CARD = 'ADD_CARD';
export const EDIT_CARD = 'EDIT_CARD';
export const DELETE_CARD = 'DELETE_CARD';
export const MOVE_CARD = 'MOVE_CARD';
export const MOVE_COLUMN = 'MOVE_COLUMN';
export const SET_BOARD = 'SET_BOARD';

export interface BaseBoardAction<T extends string = string> extends Action<T> {
	[extraProps: string]: unknown;
}

export interface AddColumnAction extends BaseBoardAction<typeof ADD_COLUMN> {
	payload: { title: string };
}

export interface DeleteColumnAction
	extends BaseBoardAction<typeof DELETE_COLUMN> {
	payload: { columnId: string };
}

export interface EditColumnAction extends BaseBoardAction<typeof EDIT_COLUMN> {
	payload: { columnId: string; newTitle: string };
}

export interface AddCardAction extends BaseBoardAction<typeof ADD_CARD> {
	payload: { columnId: string; title: string };
}

export interface EditCardAction extends BaseBoardAction<typeof EDIT_CARD> {
	payload: { columnId: string; cardId: string; updates: Partial<Card> };
}

export interface DeleteCardAction extends BaseBoardAction<typeof DELETE_CARD> {
	payload: { columnId: string; cardId: string };
}

export interface MoveCardAction extends BaseBoardAction<typeof MOVE_CARD> {
	payload: {
		card: Card;
		sourceColumnId: string;
		destinationColumnId: string;
		newIndex: number;
	};
}

export interface MoveColumnAction extends BaseBoardAction<typeof MOVE_COLUMN> {
	payload: {
		sourceIndex: number;
		destinationIndex: number;
	};
}

export interface SetBoardAction extends BaseBoardAction<typeof SET_BOARD> {
	payload: { columns: Column[] };
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
