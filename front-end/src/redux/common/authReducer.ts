import {
	LoginState,
	LoginAction
} from '@/interfaces/common/LoginInterface';
const initialState: LoginState = {
	isLoggedIn: false,
	user: null
};
export const authReducer = (state = initialState, action: LoginAction) => {
	debugger;
	switch (action.type) {
	case 'LOGIN':
		return { ...state, isLoggedIn: true, user: action.payload };
	case 'LOGOUT':
		return { ...state, isLoggedIn: false, user: null };
	default:
		return state;
	}
};
