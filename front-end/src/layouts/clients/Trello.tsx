import Login from './Login';
import Boards from '../../trello1/layouts/Board.tsx';
import { Board } from '../../trello1/types/boards.ts';
// import Sidebar from '../../modules/trello/pages/Header';
import Header from '../../modules/trello/pages/Header';
const board: Board = {
	id: '1',
	title: 'Project Management',
	lists: [
		{
			id: '1',
			title: 'To Do',
			cards: [
				{ id: '1', title: 'Task 1: Design UI' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' },
				{ id: '2', title: 'Task 2: Implement Backend' }
			]
		},
		{
			id: '2',
			title: 'In Progress',
			cards: [
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' },
				{ id: '3', title: 'Task 3: Develop Frontend' }
			]
		},
		{
			id: '3',
			title: 'Done',
			cards: []
		},
		{
			id: '3',
			title: 'Done',
			cards: []
		},
		{
			id: '3',
			title: 'Done',
			cards: []
		},
		{
			id: '3',
			title: 'Done',
			cards: []
		}
	]
};
function Trello() {
	const isLogin = true;

	return (
		<>
			{isLogin ? (
				<>
					<Header />
					<Boards board={board} />
				</>
			) : (
				<Login />
			)}
		</>
	);
}
export default Trello;
