export type UserProps = {
	onSearchUser: (value: FilterUserProps) => void;
	clearSelectionUserMng: () => void;
	filterData: PaginationParams
	onLimitChange: (newLimit: number) => void;
};

export type FilterUserProps = {
	search: string;
	isActive?: string | null;
	subscriptionStatus?: string[] | [] | undefined;
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	search: string;
	userType: string[];
	offset: number
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
