export interface Member {
	id: string;
	name: string;
	avatar: string;
}

export interface Card {
	id: string;
	title: string;
	description?: string;
	startDate?: string;
	endDate?: string;
	members?: Member[];
}

export interface Column {
	id: string;
	title: string;
	cards: Card[];
}

export interface Board {
	id: string;
	title: string;
	columns: Column[];
}
