import { combineReducers } from 'redux';
import { authReducer } from './common/authReducer';
// import { trelloReducer } from './trello/reducers/trelloReducer';
// import { ecommerceReducer } from './ecommerce/reducers/ecommerceReducer';
const rootReducer = combineReducers({
	auth: authReducer
	//   trello: trelloReducer,
	//   ecommerce: ecommerceReducer,
});
export default rootReducer;
