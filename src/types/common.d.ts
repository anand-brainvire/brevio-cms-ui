import { CityDataArr, CmsDataArr, CountryDataArr, AnnouncementDataArr, SubAdminDataArr, StateDataArr } from '@framework/graphql/graphql';

import React, { ReactElement, SetStateAction } from 'react';

export type ResetPasswordNavParams = {
	token: string;
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	search: string;
};

export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
	type: 'image' | 'text' | 'date' | 'status' | 'action' | 'ratings';
	headerCenter?: boolean;
};
export type CommonModelProps = {
	onClose: () => void;
	action?: () => void;
	show?: boolean;
	warningText?: string;
	actionLabel?: string;
	onCloseLabel?: string;
	headerTitle?: string;
	modalBody?: ReactElement;
	modalFooter?: ReactElement;
};
export type ForgetModelProps = {
	onClose: () => void;
	action: () => void;
	show?: boolean;
	warningText?: string;
};
export type DropDownProfileAndLanguageProps = {
	onClick: (data?: string | null) => void;
	List: { content: string; data?: string; icon?: () => ReactElement; route?: string }[];
	className: string;
};
export type LanguageModelProps = {
	onClick: () => void;
	setState?: (value) => boolean;
};
export type LanguageModelListArr = {
	language: string;
	name: string;
};
export type LinkELementProps = {
	to: string;
	className: string;
	onClick: (data?: string | null) => void;
	content: string;
	data?: string;
	icon?: ReactElement;
};
export type ProfileModelProps = {
	profileHandler: () => void;
	logoutHandler: () => void;
};

export type ChangeStatusProps = {
	onClose: () => void;
	changeStatus: () => void;
	show?: boolean;
};

export type DeleteDataProps = {
	onClose: () => void;
	deleteData?: () => void;
	changeStatus?: () => void;
	show?: boolean;
};
export type DescriptionDataProps = {
	onClose: () => void;
	data: string;
	show?: boolean;
};
export type ImageDataProps = {
	onClose: () => void;
	data: string;
	show?: boolean;
};
export type TreeNode = {
	id: number;
	label: string;
	children?: TreeNode[];
};

export type TreeViewProps = {
	data1: TreeNode[];
};
export type validationProps = {
	params?: number | string | undefined;
};
export type EditComponentProps = {
	data: FetchCouponsDataArr | EventsDataArr | ManageRulesSetsDataArr | RoleDataArr | NotificationDataArr | AnnouncementDataArr | CityDataArr | CountryDataArr | CmsDataArr;
	route?: string;
	id?: string;
};
export type ViewComponentProps = {
	data: NotificationDataArr | EventsDataArr | AnnouncementDataArr;
	route?: string;
};
export type DeleteComponentsProps = {
	data: FetchCouponsDataArr | EventsDataArr | ManageRulesSetsDataArr | RoleDataArr | NotificationDataArr | CityDataArr | CountryDataArr | StateDataArr;
	setObj: React<SetStateAction<data>>;
	setIsDelete: React<SetStateAction<boolean>>;
	id?: string;
};
export type PasswordComponentsProps = {
	data: SubAdminDataArr | UserData;
	setObj: React<SetStateAction<data>>;
	setIsChangePassword: React<SetStateAction<boolean>>;
};
export type TreeRouteComponentProps = {
	route?: string;
};
export type RoleEditComponentsProps = {
	data: FetchCouponsDataArr | EventsDataArr | ManageRulesSetsDataArr | RoleDataArr | NotificationDataArr;
	data: RoleDataArr;
	editData: (data: RoleDataArr) => void;
};

export type childRoutesLinksArray = {
	to: string;
	text: string;
	icon: ReactElement;
	redirectPage: string;
	permissions: string[];
};
//Sidebar NavLinks
export type sidebarNavlinksArray = {
	to: string;
	text: string;
	icon: ReactElement;
	redirectPage: string;
	childRoutes: childRoutesLinksArray[];
	permissions: string[];
};

export type CipherParams = CryptoJS.lib.CipherParams;
export type WordArray = CryptoJS.lib.WordArray;
export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (newPage: number, newRecordsPerPage?: number) => void;
	recordsPerPage?: number; // this is kept for future enchancement of the code based on the BE side changes.....;
}

export interface IRoleBaseGuardProps {
	children?: ReactNode;
	permissions: string[];
}
