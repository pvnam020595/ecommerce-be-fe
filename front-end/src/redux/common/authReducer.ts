import { LoginState, AuthAction } from '@/interfaces/common/LoginInterface';

const initialState: LoginState = {
	isLoggedIn: false,
	user: null
};

export const authReducer = (
	state = initialState,
	action: AuthAction
): LoginState => {
	switch (action.type) {
	case 'LOGIN':
		return {
			...state,
			isLoggedIn: true,
			user: action.payload
		};
	case 'LOGOUT':
		return {
			...state,
			isLoggedIn: false,
			user: null
		};
	default:
		return state;
	}
};

export default authReducer;
