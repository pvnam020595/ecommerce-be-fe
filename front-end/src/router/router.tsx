import { createBrowserRouter } from 'react-router';

import App from '@/App';
import Trello from '@modules/trello';
import Ecommerce from '@modules/ecommerce';
import { Boards, Home } from '@modules/trello/pages';
import { PATHS } from '@router/paths';

const router = createBrowserRouter([
	{
		path: PATHS.ROOT,
		element: <App />,
		children: [
			{
				path: 'trello',
				element: <Trello />,
				children: [
					{
						path: 'boards',
						element: <Boards />
					},
					{
						path: 'home',
						element: <Home />
					}
				]
			},
			{
				path: 'ecommerce',
				element: <Ecommerce />
			}
		]
	}
]);

export default router;
