import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
	fas,
	faCheckSquare,
	faCoffee
} from '@fortawesome/free-solid-svg-icons';

library.add(fas, fab, faCheckSquare, faCoffee);

const routes = {
	trello: '/trello',
	ecommerce: '/ecommerce'
} as const;

function App() {
	const navigate = useNavigate();

	const handlePlatformChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	): void => {
		const route = routes[event.target.value as keyof typeof routes];

		if (route) {
			navigate(route, { replace: true });
		}
	};

	const location = useLocation();

	const showPlatformSelector = location.pathname === '/';

	return (
		<div className="container-full">
			{showPlatformSelector && (
				<select
					className="form-select"
					defaultValue=""
					onChange={handlePlatformChange}
				>
					<option value="" disabled>
						Open this select menu
					</option>

					<option value="trello">Trello</option>
					<option value="ecommerce">Ecommerce</option>
				</select>
			)}

			<Outlet />
		</div>
	);
}

export default App;
