export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
	type: 'image' | 'text' | 'date' | 'status' | 'action';
	headerCenter?: boolean;
};
export type PaginationProps = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	search: string;
};
export type CreateEmailTemplate = {
	subject: string;
	content: string;
	templateFor: string;
	templateType: number;
	status: number;
};
