export type RoleEditProps = {
	isRoleModelShow: boolean;
	onHandleChange?: React.ChangeEventHandler<HTMLInputElement>;
	onSubmitRole: () => void;
	onClose: () => void;
	isRoleEditable: boolean;
	roleObj: roleData;
	roleVal?: string;
};

export type roleData = {
	created_at: string;
	key: string;
	role_name: string;
	status: number;
	updated_at: string;
	uuid: string;
	id: string;
};

export type RoleChangeProps = {
	onClose: () => void;
	changeRoleStatus: () => void;
};

export type RoleInput = {
	role: string;
};

export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
	type: 'image' | 'text' | 'date' | 'status' | 'action';
	headerCenter?: boolean;
	isBase64ImageUrl?: boolean;
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	search: string;
};

export type RoleProps = {
	getRolePermission: (value: string) => void;
	setDropDownData: React.Dispatch<React.SetStateAction<RolePermissionsProps>>;
	refetchRoleData: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<roleData>>;
};
