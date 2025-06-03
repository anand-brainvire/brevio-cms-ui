export type CreatePlanManagementProps = {
	name: string;
	description: string;
	type: 'yearly' | 'monthly' | 'quarterly';
	price: string;
	isRecommended: string | number | undefined;
	status: string | number;
};

export type FilterPlanManagementProps = {
	type: string;
	price: string;
	status: string;
};

export type PlanManagementPropsProps = {
	onSearchPlan: (value: FilterPlanManagementProps) => void;
	filterData: PaginationParams;
	onClearPlanManagement: () => void;
};

export type PaginationParamsPlanMng = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	suggestion: string;
	price: number | null;
	status: number | null;
	type: 'quarterly' | 'yearly' | 'monthly' | '';
};

export type PlanManagementDataProps = {
	id: number;
	name: string;
	price: number;
	description: string;
	type: string;
	uuid: string;
	status?: number;
};
