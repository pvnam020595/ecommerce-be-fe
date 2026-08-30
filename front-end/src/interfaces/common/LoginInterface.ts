interface User {
	id: string;
	name: string;
	email: string;
}

interface LoginState {
	isLoggedIn: boolean;
	user?: User | null;
}

interface LoginAction {
	type: string;
	payload?: User;
}

export { LoginState, LoginAction };
