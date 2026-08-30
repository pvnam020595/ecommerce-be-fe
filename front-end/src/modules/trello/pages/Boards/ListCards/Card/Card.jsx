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

function Card() {
	return (
		<>
			<div className="card-content">
				{/* Cards */}
				{/* {list.cards.map((card: Card) => (
					<div className="p-2 card-infor" key={card.id}>
						<div className='card-title'>
							<span className='card-title-text'>
								<a href="#">{card.title}</a>
							</span>
						</div>
						<div className='sub-card'></div>
						<div className='external-card-infor'></div>
					</div>
				))} */}
			</div>
		</>
	);
}

export default Card;
