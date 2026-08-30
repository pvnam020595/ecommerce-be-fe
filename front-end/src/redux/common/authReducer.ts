import {
	LoginState,
	LoginAction
} from '../../interfaces/common/LoginInterface';
const initialState: LoginState = {
	isLoggedIn: false,
	user: null
};
export const authReducer = (state = initialState, action: LoginAction) => {
	switch (action.type) {
	case 'LOGIN':
		return { ...state, isLoggedIn: true };
	case 'LOGOUT':
		return { ...state, isLoggedIn: false };
	default:
		return state;
	}
};
