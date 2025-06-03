export type CreateCountry = {
	name: string;
	countryCode: string;
	status: number | string;
	phoneCode: string;
	currencyCode: string;
};

export type DeleteCountryProps = {
	onClose: () => void;
	deleteCountry: () => void;
};
export type CountryChangeProps = {
	onClose: () => void;
	changeCountryStatus: () => void;
};
export type ColArrType = {
	name: string;
	sortable: boolean;
	fildName: string;
};

export type ColArrTypeNew = {
	name: string;
	sortable: boolean;
	fieldName: string;
	type: 'image' | 'text' | 'date' | 'status' | 'action' | 'ratings';
	headerCenter?: boolean;
};

export type FilterCountryProps = {
	name: string;
	countryCode: string;
	status: string;
	phoneCode: string;
	currencyCode: string;
};

export type CountryProps = {
	onSearchCountry: (value: FilterCountryProps) => void;
	clearSelectionCountry: () => void;
	filterData: PaginationParams;
};
export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	name: string;
	countryCode: string;
	status: number | null;
	currencyCode: string;
	phoneCode: string;
};
