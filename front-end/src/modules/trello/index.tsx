import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Login } from '@modules/trello/pages';
import type { RootState } from '@redux/store';

function Trello() {
	const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

	if (isLoggedIn) {
		return <Outlet />;
	}
	return <Login />;
}

export default Trello;
