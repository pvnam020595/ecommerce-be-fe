import { combineReducers } from 'redux';
import { authReducer } from '@/redux/common/authReducer';
import { boardReducer } from '@/modules/trello/redux/reducers/boardReducer';
// import { ecommerceReducer } from './ecommerce/reducers/ecommerceReducer';

const rootReducer = combineReducers({
	auth: authReducer,
	board: boardReducer
	//   ecommerce: ecommerceReducer,
});
export default rootReducer;
