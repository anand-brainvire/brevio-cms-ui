export type PaginationParamsCoupon = {
	filter?: {
		statusFilter?: {
			status?: number | null | string;
			isContentModified?: boolean | null;
		};
		search?: string | null;
		categories?: string[] | null;
	};
	limit: number;
	offset: number;
	sortBy: string;
	sortOrder: string;
};

export type BookInputType = {
	bookName: string;
}

export type editBookInfo = {
	title: string;
	categoryId: string[];
	authorId: string[];
	whatsInside: string;
	aboutAuthor: string;
	coverImage: string | null;
	learningPoints: string[];
}
export type CouponColArrType = {
	name: string;
	sortable: boolean;
	fildName: string;
};
export type CouponsManagementProps = {
	defaultCategoryId?: string
	onSearchCoupon: (values: FilterCouponsProps) => void;
	filterData: PaginationParamsCoupon;
};
export type FilterCouponsProps = {
	search: string;
	status?: string;
	categoryId?: string[];
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
