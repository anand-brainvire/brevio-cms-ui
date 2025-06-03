export type UserProps = {
	onSearchUser: (value: FilterUserProps) => void;
	clearSelectionUserMng: () => void;
	filterData: PaginationParams
};

export type FilterUserProps = {
	fullName: string;
	email: string;
	status: string;
	gender: string;
	phoneNo: string;
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	fullName: string;
	email: string;
	status: number | null;
	gender: number | null;
	phoneNo: string;
};

export type UserChangeProps = {
	onClose: () => void;
	changeUserStatus: () => void;
};

export type UserForm = {
	profileImg?: string;
	firstName: string;
	lastName: string;
	userName: string;
	email: string;
	password: string;
	confirmPassword: string;
	dateOfBirth?: Date;
	phoneNo: string;
	gender: number | string;
};

export type PasswordChange = {
	oldPassword: string;
	newPassword: string;
};
export type ChangeUserPassword = {
	onClose: () => void;
	UserObj: UserDataArr;
	show?: boolean;
};
