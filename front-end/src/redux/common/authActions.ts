import type { Action } from 'redux';
import { User } from '@/interfaces/common/LoginInterface';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export interface BaseAuthAction<T extends string = string> extends Action<T> {
	[extraProps: string]: unknown;
}

export interface LoginAction extends BaseAuthAction<typeof LOGIN> {
	payload: User;
}

export interface LogoutAction extends BaseAuthAction<typeof LOGOUT> {
	payload?: undefined;
}

export type AuthAction = LoginAction | LogoutAction;

export const loginSuccess = (user: User): LoginAction => ({
	type: LOGIN,
	payload: user
});

export const logout = (): LogoutAction => ({
	type: LOGOUT
});
