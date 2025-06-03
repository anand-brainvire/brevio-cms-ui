export type CreateAnnouncement = {
	endDate: string;
	title: string;
	announcementType: string;
	status: string | number;
	description: string;
	pushImage?: File | string;
	platform: string;
	userType: string;
	userFilter: string;
	startDate: string;
	userToExclude?: int[];
	onlySendTo?: int[];
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	fullName: string;
	isAll?: boolean;
};
export type PaginationParamsViewAnnouncement = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	fullNameUserToExclude: string;
	fullNameOnlySendTo: string;
	isAll?: boolean;
	uuid?: string;
};
export type FilterAnnouncementProps = {
	title: string;
	startDate?: string | Date;
	endDate?: string | Date;
	annoucemntType: string;
	platform: string;
};
export type AnnouncementProps = {
	onSearchAnnouncement: (value: FilterAnnouncementProps) => void;
	filterData: PaginationParamsList;
};
export type PaginationParamsList = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	title: string;
	startDate?: string | Date;
	endDate?: string | Date;
	annoucemntType: string;
	platform: string;
};
