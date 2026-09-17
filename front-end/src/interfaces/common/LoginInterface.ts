export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
}

export interface LoginState {
	isLoggedIn: boolean;
	user: User | null;
}

export interface LoginAction {
	type: 'LOGIN';
	payload: User;
	[key: string]: unknown;
}

export interface LogoutAction {
	type: 'LOGOUT';
	[key: string]: unknown;
}

export type AuthAction = LoginAction | LogoutAction;
