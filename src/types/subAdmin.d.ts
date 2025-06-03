export type FilterSubadminProps = {
	firstName: string;
	lastName: string;
	email: string;
	status: string;
	role: string;
};

export type SubAdminProps = {
	onSearchSubAdmin: (value: FilterSubadminProps) => void;
	filterData: PaginationParams;
};

export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
	type: 'image' | 'text' | 'date' | 'status' | 'action';
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	firstName: string;
	lastName: string;
	email: string;
	status: number | null;
	role: number | null;
};

export type SubAdminChangeProps = {
	onClose: () => void;
	changeRoleStatus: () => void;
};

export type DeleteSubAdminProps = {
	onClose: () => void;
	deleteSubAdmin: () => void;
};

export type ChangeSubAdminPassword = {
	onClose: () => void;
	subAdminObj: SubAdminDataArr;
	show?: boolean;
};

export type CreateSubAdmin = {
	userName: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: string;
};

export type latlongProps = {
	latitude: string;
	longitude: string;
};
export type createGeoLocation = {
	name: string;
	address: string;
	latLong: latlongProps[];
	status: string;
};
