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
export type authorPagination = {
	page: number;
	limit: number;
	search: string;
	createdBy: string;
	status: number | null;
	sortBy: string;
	sortOrder: string;
};
export type FilterAuthorProps = {
	search: string;
};

export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
	type: 'image' | 'text' | 'date' | 'status' | 'action';
	headerCenter?: boolean;
};

export type BannerProps = {
	onSearchAuthor: (value: FilterAuthorProps) => void;
	filterData: authorPagination;
	onLimitChange: (newLimit: number) => void;
};
export type BannerChangeProps = {
	onClose: () => void;
	changeBannerStatus: () => void;
};

export type BannerUpdateProps = {
	authorName: string;
	status: number | string | boolean;
};
