import { legacy_createStore as createStore, combineReducers } from 'redux';
import { boardReducer } from './reducers/boardReducer';

const rootReducer = combineReducers({
	board: boardReducer
});

export const store = createStore(rootReducer);
