import type { Board } from '@modules/trello/interfaces/BoardInterface';

export const mockBoardData: Board = {
	id: 'board-1',
	title: 'Project Management',
	columns: [
		{
			id: 'col-1',
			title: 'To Do',
			cards: [
				{
					id: 'card-1',
					title: 'Design UI mockups',
					description: 'Create responsive wireframes and prototypes'
				},
				{
					id: 'card-2',
					title: 'Setup project structure',
					description: 'Initialize repository with TypeScript & Vite'
				},
				{
					id: 'card-3',
					title: 'Write API documentation',
					description:
						'Document endpoints for authentication and boards'
				}
			]
		},
		{
			id: 'col-2',
			title: 'In Progress',
			cards: [
				{
					id: 'card-4',
					title: 'Implement authentication',
					description: 'Add JWT login and auth reducer'
				},
				{
					id: 'card-5',
					title: 'Build dashboard layout',
					description: 'Create sidebar, header, and board grid'
				}
			]
		},
		{
			id: 'col-3',
			title: 'Review',
			cards: [
				{
					id: 'card-6',
					title: 'Code review: payment module',
					description: 'Verify payment gateway integration'
				}
			]
		},
		{
			id: 'col-4',
			title: 'Done',
			cards: [
				{
					id: 'card-7',
					title: 'Setup CI/CD pipeline',
					description: 'Automate build and test on push'
				},
				{
					id: 'card-8',
					title: 'Configure database',
					description: 'Setup PostgreSQL migrations and seeders'
				}
			]
		}
	]
};

export default mockBoardData;
