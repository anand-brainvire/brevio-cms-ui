import { MetaRes, UserData } from '@framework/graphql/graphql';

export type ColArrType = {
	name: string;
	sortable: boolean;
	fildName: string;
};

export type PaginationParamsActivity = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	name: string;
	activity: string;
	email: string;
	startDate?: string | Date;
	endDate?: string | Date;
};
export type ActivityTrackingData = {
	id: number;
	uuid: string;
	user_id: number;
	title: string;
	ip_address: string;
	details: {
		desc_message: string;
		old: { [key: string]: string };
		new: { [key: string]: string };
	};
	status: number;
	module: string;
	sub_module: string;
	User: UserData;
	created_by: number;
	updated_by: number;
	deleted_by: number;
	created_at: Date;
	updated_at: Date;
};

export type ActivityPagination = {
	activityData: ActivityTrackingData[];
	count: number;
};
export type ActivityData = {
	data: ActivityPagination;
	Meta: MetaRes;
};

export type FilterActivityProps = {
	name: string;
	email: string;
	activity: string;
	startDate?: string;
	endDate?: string;
};

export type ActivityProps = {
	onSearchActivity: (value: FilterActivityProps) => void;
	clearSelectionActivity: () => void;
	filterData: PaginationParamsActivity;
};
export type DeleteActivityRes = {
	deleteActivity: { meta: MetaRes };
};

export type GroupDeleteActivityRes = {
	groupDeleteActivities: {
		meta: MetaRes;
	};
};

export type JsonPopupProps = {
	onClose: () => void;
	data: ActivityTrackingData;
	show: boolean;
};
