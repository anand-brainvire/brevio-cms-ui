export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	eventName: string;
	startDate?: string;
	endDate?: string;
};
export type DeleteEventProps = {
	onClose: () => void;
	deleteEvent: () => void;
};
export type CreateEvent = {
	eventName: string;
	description: string;
	sendNotification: boolean;
	address: string;
	startDate?: Date;
	endDate?: Date;
	isReccuring: string;
	reccuranceDate: string;
	participants?: string;
	participantMailIds?: string;
};
export type FilterEventProps = {
	eventName: string;
	startDate?: string;
	endDate?: string;
	createdBy: string | number;
};
export type EventProps = {
	onSearchEvent: (value: FilterEventProps) => void;
	clearSelectionEvents: () => void;
};
export type FilterDataArr = {
	event_Name: string;
	start_Date: string;
	end_Date: string;
	created_By: number;
	User: {
		user_name: string;
	};
};
