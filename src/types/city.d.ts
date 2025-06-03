export type CreateCity = {
	cityName: string;
	countryId: string;
	stateId: string;
	status: number;
};
export type DeleteCityProps = {
	onClose: () => void;
	deleteCity: () => void;
};
export type FilterCityProps = {
	cityName: string;
	stateId: string;
	status: string;
	state?: {
		countryId: string;
	};
	countryId: string;
};

export type CityProps = {
	onSearchCity: (value: FilterCityProps) => void;
	clearSelectionCity: () => void;
	filterData: PaginationParams;
};

export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
	type: 'image' | 'text' | 'date' | 'status' | 'action';
	headerCenter?: boolean;
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	cityName: string;
	stateId: number | null;
	status: number | null;
	countryId: number | null;
};
