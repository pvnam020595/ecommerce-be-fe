import { Login } from '@modules/trello/pages/Login/index.tsx';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import type {RootState} from '../../redux/store.ts';

function Trello() {
	// const isLoginedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
	const isLoginedIn = true;

	if (isLoginedIn) {
		return <Outlet />;
	}
	return <Login />;
}

export default Trello;
