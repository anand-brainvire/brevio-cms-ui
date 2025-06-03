import { BsMediadataArr } from '@framework/graphql/graphql';

export type BsMediaListItemProps = {
	key: string;
	data: BsMediadataArr;
	isViewFolder: boolean;
	onClick: (data: BsMediadataArr) => void;
	onDoubleClick: (data: number, folderName, previousParentId) => void;
	activeItem: string | null;
};

export type PaginationParams = {
	search: string;
	sortBy: string;
	sortOrder: string;
	parentId: number | null;
	fileType: string | null;
};
export type filterBsMediaProps = {
	search: string;
	sortBy: string;
	sortOrder: string;
};
export type BsMediaFilterProps = {
	onSearchBsMedia: (values: filterBsMediaProps) => void;
};

export type BsMediaViewDetailsProps = {
	data: BsMediadataArr;
};

export type AddNewBsMediaProps = {
	isShowModel: boolean;
	onClose: () => void;
	data: BsMediadataArr | null;
	modelType: string;
	onRefresh: () => void;
	parentAndCurrent: {
		parent: Array<number | null>;
		current: number | null;
	};
};

export type AddFolderProps = {
	folderName: string;
};

export type BsMediaNavTabsProps = {
	data: {
		icon: ReactElement;
		name: string;
		id: string;
	};
	onClick: (tabData: string) => void;
	activeTab: string | null;
};
