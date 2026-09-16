export interface Member {
	id: string;
	name: string;
	avatar: string;
}

export interface CardLabel {
	id: string;
	text: string;
	color: string;
	bg: string;
}

export interface SubTask {
	id: string;
	title: string;
	completed: boolean;
	assignee?: Member;
	startDate?: string;
	dueDate?: string;
}

export interface Attachment {
	id: string;
	name: string;
	size: number;
	type: string; // e.g. 'image/png', 'application/pdf', etc.
	url: string;
	createdAt: string;
}

export interface Card {
	id: string;
	title: string;
	description?: string;
	startDate?: string;
	endDate?: string;
	members?: Member[];
	labels?: CardLabel[];
	commentsCount?: number;
	attachmentsCount?: number;
	checklist?: { total: number; completed: number };
	subtasks?: SubTask[];
	attachments?: Attachment[];
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
