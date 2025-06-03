export type CreateState = {
	name: string;
	stateCode: string;
	status: number;
	countryId: string;
};

export type DeleteStateProps = {
	onClose: () => void;
	deleteState: () => void;
};
export type StateChangeProps = {
	onClose: () => void;
	changeStateStatus: () => void;
};
export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
	type: 'image' | 'text' | 'date' | 'status' | 'action';
	headerCenter?: boolean;
};

export type FilterStateProps = {
	name: string;
	stateCode: string;
	status: string;
	countryId: string;
};
export type FilterStateDataProps = {
	name: string;
	stateCode: string;
	status: string;
	countryId: string;
};
export type StateProps = {
	onSearchState: (value: FilterStateProps) => void;
	filterData: PaginationParams;
	clearSelectionState: () => void;
};
export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	name: string;
	stateCode: string;
	status: number | null;
	countryId: number | null;
};

export type StateInput = {
	countryId: string;
};
