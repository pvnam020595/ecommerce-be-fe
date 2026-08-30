import { List, Card } from '../../interfaces/BoardInterface.ts';
import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import Header from '../../trello/components/Header.tsx';
import Footer from '../../trello/components/Footer.tsx';

import '../../../public/css/main.css';
import '../../../public/css/trello/trello.css';

function ListCards() {
	const [boardData, setBoard] = useState < Board > board;
	const handleDragEnd = event => {
		console.log(event);
	};
	return (
		<>
			{/* <ol id="board-list" className="board-list w-100 d-flex flex-row gap-3 list-unstyled">
				{boardData.lists.map((list: List) => (
					<li className='card-list rounded' id='card-1' key={list.id}>
						<div className="cards rounded d-flex flex-column p-2">
							<div className="d-flex justify-content-between align-items-center mb-2 p-2">
								<strong>{list.title}</strong>
								<i className="fas fa-ellipsis-h text-muted"></i>
							</div>

							<div className='card-content'>
								
								
							</div>
							
						</div>
					</li>
				))}
			</ol> */}
		</>
	);
}

export default ListCards;
