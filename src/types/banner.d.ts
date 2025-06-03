import { BannerData, MetaRes } from '@framework/graphql/graphql';

export type CreateBanner = {
	bannerTitle: string;
	bannerImage: string;
	status: number | null;
	createdBy: string;
};
export type UpdateBanner = {
	updateBanner: {
		data: BannerData;
		meta: MetaRes;
	};
};
export type bannerPagination = {
	page: number;
	limit: number;
	bannerTitle: string;
	createdBy: string;
	status: number | null;
	sortBy: string;
	sortOrder: string;
};
export type FilterBannerProps = {
	bannerTitle: string;
	createdBy: string;
	status: string;
};

export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
	type: 'image' | 'text' | 'date' | 'status' | 'action';
};

export type BannerProps = {
	onSearchBanner: (value: FilterBannerProps) => void;
	filterData: bannerPagination;
};
export type BannerChangeProps = {
	onClose: () => void;
	changeBannerStatus: () => void;
};

export type BannerUpdateProps = {
	BannerTitle: string;
	bannerImage: string;
	status: string;
	bannerTitleArabic: string;
};
