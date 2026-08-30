import App from '@/App';
import { createBrowserRouter } from 'react-router';
// Modules in project
import Trello from '@modules/trello/index.tsx';
import Ecommerce from '@modules/ecommerce/index.tsx';
import { Boards } from '@/modules/trello/pages/Boards';
import Home from '@/layouts/clients/Home';

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
