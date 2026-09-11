import App from '@/App';
import { createBrowserRouter } from 'react-router';
// Modules in project
import Trello from '@modules/trello';
import Ecommerce from '@modules/ecommerce';
import { Boards } from '@/modules/trello/pages/Boards';
import { Home } from '@modules/trello/pages/Home';

const router = createBrowserRouter([
	{
		path: '/',
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
