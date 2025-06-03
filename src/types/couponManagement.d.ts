export type PaginationParamsCoupon = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	offerName: string;
	startDate?: string | Date;
	endDate?: string | Date;
	status: number | null;
};
export type CouponColArrType = {
	name: string;
	sortable: boolean;
	fildName: string;
};
export type CouponsManagementProps = {
	onSearchCoupon: (values: FilterCouponsProps) => void;
	clearSelectionCoupons: () => void;
	filterData: PaginationParamsCoupon;
};
export type FilterCouponsProps = {
	offerName: string;
	startDate?: string | Date;
	endDate?: string | Date;
	status: string;
};
export type CreateUpdateCouponProps = {
	offerName: string;
	offerCode: string;
	startDate?: Date | string;
	endDate?: Date | string;
	value?: number | string;
	offerType: string | number;
	offerUsage: string | number;
	applicable: string | number;
};

export type UsersDataStructureType = {
	name: string;
	code: string;
};
export type GetCouponRes = {
	id: string;
	uuid: string;
	offer_name: string;
	offer_code: string;
	offer_type: number;
	offer_usage: number;
	applicable: number;
	total_usage: number;
	status: number;
	start_date: string;
	end_date: string;
	selected_users: string[];
	value: number;
};
