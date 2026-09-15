export interface MockUser {
	id: string;
	name: string;
	email: string;
	password?: string;
	avatar: string;
}

export const MOCK_USERS: MockUser[] = [
	{
		id: 'user-1',
		name: 'Nam Pham Van',
		email: 'p_vannam@thk-hd.vn',
		password: 'password123',
		avatar: 'https://avatars.githubusercontent.com/u/1?v=4'
	},
	{
		id: 'user-2',
		name: 'Admin User',
		email: 'admin@trello.com',
		password: 'password123',
		avatar: 'https://avatars.githubusercontent.com/u/2?v=4'
	}
];

export const authenticateUser = (
	email: string,
	password?: string
): MockUser | null => {
	const user = MOCK_USERS.find(
		u => u.email.toLowerCase() === email.trim().toLowerCase()
	);

	if (!user) {
		// Fallback: create a user session for any valid email
		return {
			id: `user-${Date.now()}`,
			name: email.split('@')[0],
			email: email.trim(),
			avatar: 'https://avatars.githubusercontent.com/u/1?v=4'
		};
	}

	if (password && user.password && user.password !== password) {
		return null;
	}

	return user;
};

export default MOCK_USERS;
