import { ReactNode } from 'react';

export interface IColumnsProps {
	sortKey?: string;
	fieldName: string;
	name: string;
	sortable: boolean;
	type: 'image' | 'text' | 'date' | 'status' | 'action' | 'badge' | 'ratings' | 'number' | 'multilang' | 'multipleText' | 'bookStatus' | 'subscriptionStatus';
	headerCenter?: boolean;
	conversationValue?: IListData;
	isBase64ImageUrl?: boolean;
	isShowMore?: boolean;
	translationKey?: string;
}

export interface IListData {
	[x: string]: T;
}

export interface IFilterProps {
	name: string;
	type: text | radio | select | checkbox;
	data: T;
}

export type IFilterTypes = {
	[x: string]: T;
};

export interface IActionWisePermissions {
	edit?: string;
	delete?: string;
	changeStatus?: string;
	view?: string;
	multipleDelete?: string;
}

export interface IActionData {
	edit?: {
		route: string;
	};
	view?: {
		route: string;
	};
}

export interface IBVDataTablesProps {
	columns: IColumnsProps[];
	queryName: DocumentNode | TypedDocumentNode<TData, TVariables>;
	singleDeleteMutation?: DocumentNode | TypedDocumentNode<TData, TVariables>;
	multipleDeleteMutation?: DocumentNode | TypedDocumentNode<TData, TVariables>;
	updateStatusMutation?: DocumentNode | TypedDocumentNode<TData, TVariables>;
	sessionFilterName: string;
	updatedFilterData: IFilterTypes;
	actionWisePermissions?: IActionWisePermissions;
	defaultActions: Array<'edit' | 'delete' | 'change_status'| 'change_book_status' | 'view' | 'multiple_delete'> | null;
	actionData?: IActionData;
	extraActions?: ReactNode;
	statusKey?: string;
	idKey: string;
	multipleDeleteApiId?: string;
	singleDeleteApiId?: string;
	statusChangeApiId?: string;
	statusChangeApiKeyTitle?: string;
	rowRefData?: (data: IListData) => void;
	limit?: number;
    onLimitChange?: (newLimit: number) => void;
}

export interface IImageCell {
	column: IColumnsProps;
	row: IListData;
	openImageModel: (url: string) => void
}

export interface ITextCell {
	text: string;
	descriptionHandler: (value: string, label?: string) => void;
	field?: string;
	descriptionLabel?: string;
}

export interface IBadgeCell {
	BadgesColor: string;
	BadgesCode: string;
	conversationValue: string
}
