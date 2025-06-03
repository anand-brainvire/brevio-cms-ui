export type PaginationParamsUserReport = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	search: string;
};

export type FilterUserReportProps = {
	search: string;
};

export type UserReportProps = {
	onSearchUserReport: (value: FilterUserReportProps) => void;
	filterData: PaginationParamsUserReport;
};

export type UserReportData = {
	id: number;
	uuid: string;
	reporter_id: number;
	reporter_user_id: number;
	user_report_type: number;
	description: string;
	report_status: number;
	moderator_notes: string;
	status: number;
	created_at: string;
	updated_at: string;

	reporter: {
		uuid: string;
		first_name: string;
		middle_name: string;
		last_name: string;
		email: string;
	};
	reporterUser: {
		id: number;
		uuid: string;
		first_name: string;
		middle_name: string;
		last_name: string;
		email: string;
	};
	userReportType: {
		id: string;
		uuid: string;
		value: string;
	};
	userReportStatus: {
		id: string;
		uuid: string;
		value: string;
	};
};
export type UserReportDataArr = {
	UserData: UserReportDataArr;
	count: number | string;
};
