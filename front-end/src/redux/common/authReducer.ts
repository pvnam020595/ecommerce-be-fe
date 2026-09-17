import { LoginState, User } from '@/interfaces/common/LoginInterface';
import { LOGIN, LOGOUT, AuthAction } from './authActions';

const getInitialState = (): LoginState => {
	try {
		const storedUser = localStorage.getItem('trello_auth_user');
		if (storedUser) {
			const parsedUser: User = JSON.parse(storedUser);
			return {
				isLoggedIn: true,
				user: parsedUser
			};
		}
	} catch (e) {
		console.error('Failed to parse auth user from localStorage', e);
	}
	return {
		isLoggedIn: false,
		user: null
	};
};

const initialState: LoginState = getInitialState();

export const authReducer = (
	state = initialState,
	action: AuthAction
): LoginState => {
	switch (action.type) {
		case LOGIN: {
			try {
				localStorage.setItem(
					'trello_auth_user',
					JSON.stringify(action.payload)
				);
			} catch (e) {
				console.error('Failed to save auth user to localStorage', e);
			}
			return {
				...state,
				isLoggedIn: true,
				user: action.payload
			};
		}
		case LOGOUT: {
			try {
				localStorage.removeItem('trello_auth_user');
			} catch (e) {
				console.error(
					'Failed to remove auth user from localStorage',
					e
				);
			}
			return {
				...state,
				isLoggedIn: false,
				user: null
			};
		}
		default:
			return state;
	}
};

export default authReducer;
