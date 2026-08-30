import rootReducer from './rootReducers';
import { legacy_createStore as createStore} from 'redux'

export const store = createStore(rootReducer);

export default store;
export type RootState = ReturnType<typeof store.getState>;
