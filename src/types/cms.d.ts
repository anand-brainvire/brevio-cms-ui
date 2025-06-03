export type ColArrTypeNew = {
	name: string;
	sortable: boolean;
	fieldName: string;
	type: 'image' | 'text' | 'date' | 'status' | 'action';
	headerCenter: boolean;
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	search: string;
};

export type DeleteCmsProps = {
	onClose: () => void;
	deleteCms: () => void;
};

export type CreateCms = {
	status: string | number;
	titleEnglish: string;
	descriptionEnglish: string;
	metaTitleEnglish: string;
	metaDescriptionEnglish: string;
};
