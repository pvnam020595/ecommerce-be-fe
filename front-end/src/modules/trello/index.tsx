import { Home } from '@modules/trello/pages/Home/index.tsx';
import { Login } from '@modules/trello/pages/Login/index.tsx';
import { useSelector } from 'react-redux';
import type {RootState} from '../../redux/store.ts';
function Trello() {
	const isLoginedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    debugger;
	if (isLoginedIn) {
		return <Home />;
	}
	return <Login />;
}

export default Trello;
