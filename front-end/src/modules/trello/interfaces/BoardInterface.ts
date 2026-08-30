export interface Card {
	id: string;
	title: string;
}

export interface List {
	id: string;
	title: string;
	cards: Card[];
}

export interface BoardInterface {
	id: string;
	title: string;
	// lists: List[];
}
