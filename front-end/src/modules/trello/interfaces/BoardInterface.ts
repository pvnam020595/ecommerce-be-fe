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
	priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface Attachment {
	id: string;
	name: string;
	size: number;
	type: string; // e.g. 'image/png', 'application/pdf', etc.
	url: string;
	createdAt: string;
}

export interface CardCommentReply {
	id: string;
	author: Member;
	content: string;
	createdAt: string;
}

export interface CardComment {
	id: string;
	author: Member;
	content: string;
	createdAt: string;
	replies?: CardCommentReply[];
}

export interface CardActivity {
	id: string;
	type:
		| 'status'
		| 'subtask'
		| 'date'
		| 'member'
		| 'attachment'
		| 'title'
		| 'comment'
		| 'general';
	user: Member;
	text: string;
	timestamp: string;
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
	comments?: CardComment[];
	activities?: CardActivity[];
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
