import { Card, Column } from '../../interfaces/BoardInterface';
import {
	BoardActionTypes,
	ADD_CARD,
	ADD_COLUMN,
	DELETE_COLUMN,
	EDIT_COLUMN,
	EDIT_CARD,
	DELETE_CARD,
	MOVE_CARD,
	MOVE_COLUMN,
	SET_BOARD
} from '../types/board';

export const addColumn = (title: string): BoardActionTypes => ({
	type: ADD_COLUMN,
	payload: { title }
});

export const deleteColumn = (columnId: string): BoardActionTypes => ({
	type: DELETE_COLUMN,
	payload: { columnId }
});

export const editColumn = (
	columnId: string,
	newTitle: string
): BoardActionTypes => ({
	type: EDIT_COLUMN,
	payload: { columnId, newTitle }
});

export const addCard = (columnId: string, title: string): BoardActionTypes => ({
	type: ADD_CARD,
	payload: { columnId, title }
});

export const editCard = (
	columnId: string,
	cardId: string,
	updates: Partial<Card>
): BoardActionTypes => ({
	type: EDIT_CARD,
	payload: { columnId, cardId, updates }
});

export const deleteCard = (
	columnId: string,
	cardId: string
): BoardActionTypes => ({
	type: DELETE_CARD,
	payload: { columnId, cardId }
});

export const moveCard = (
	card: Card,
	sourceColumnId: string,
	destinationColumnId: string,
	newIndex: number
): BoardActionTypes => ({
	type: MOVE_CARD,
	payload: { card, sourceColumnId, destinationColumnId, newIndex }
});

export const moveColumn = (
	sourceIndex: number,
	destinationIndex: number
): BoardActionTypes => ({
	type: MOVE_COLUMN,
	payload: { sourceIndex, destinationIndex }
});

export const setBoard = (columns: Column[]): BoardActionTypes => ({
	type: SET_BOARD,
	payload: { columns }
});
