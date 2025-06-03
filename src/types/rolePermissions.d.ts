export type RolePermissionsProps = {
	roleId: string | null;
};
export interface TreeViewArr {
	label: React.ReactNode;
	value: string;
	children?: Array<Node>;
	className?: string;
	disabled?: boolean;
	icon?: React.ReactNode;
	showCheckbox?: boolean;
	title?: string;
}

export type ModuleListType = {
	id: string;
	uuid: string;
	module_name: string;
	description: string;
	key: string;
	status: number;
	permissions: ChildListType[];
};
export type ChildListType = {
	id: string;
	uuid: string;
	module_id: string;
	permission_name: string;
	key: string;
	status: number;
	created_by: string;
	createdAt: string;
	updatedAt: string;
};
