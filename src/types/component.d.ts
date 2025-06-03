import { DefaultTFuncReturn } from 'i18next';
import React, { ReactNode } from 'react';

export type HeaderProps = {
	onClick: React.Dispatch<React.SetStateAction<boolean>>;
	logoutConformation: (newValue: boolean) => void;
	toggleHeaderImage: boolean;
};
export type SideBarProps = {
	show: boolean;
	menuHandler: React.Dispatch<React.SetStateAction<boolean>>;
	setToggleImage: React.Dispatch<React.SetStateAction<boolean>>;
};
export type TextInputProps = {
	id?: string;
	required?: boolean;
	label?: string | DefaultTFuncReturn;
	placeholder: string;
	name?: string;
	type?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onBlur?: React.FocusEventHandler<HTMLInputElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
	value?: string | number;
	error?: string | string[];
	note?: string;
	inputIcon?: React.JSXElementConstructor;
	disabled?: boolean;
	hidden?: boolean;
	loginInput?: boolean;
	max?: string;
	disabled: boolean;
	min?: string;
	maxLength?: number;
	minLength?: number;
	pattern?: string;
	password?: boolean;
	className?: string;
	btnShowHideFun?: () => void;
	btnShowHide?: boolean;
	autoComplete?: string;
};
export type TextAreaInputProps = {
	id?: string;
	className?: string;
	required?: boolean;
	label?: string | DefaultTFuncReturn;
	placeholder: string;
	name?: string;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
	onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
	value?: string | number;
	error?: string | string[] | null;
	note?: string;
	disabled?: boolean;
	hidden?: boolean;
	rows?: number;
	disabled: boolean;
	cols?: number;
	maxLength?: number;
	minLength?: number;
};
export type ButtonProps = {
	label?: string | DefaultTFuncReturn;
	className?: string;
	type?: 'submit' | 'button';
	primary?: boolean;
	secondary?: boolean;
	warning?: boolean;
	children?: ReactNode;
	disabled?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement> | unknown;
	data?: CommonDataArrOfModules;
	setObj?: React<SetStateAction<data>>;
	setIsDelete?: React<SetStateAction<boolean>>;
	route?: string;
	id?: string;
	setIsChangePassword?: React<SetStateAction<boolean>>;
	icon?: ReactElement;
	spanClassName?: string;
	title?: string;
};

export type DropdownProps = {
	id?: string;
	required?: boolean;
	label?: string | DefaultTFuncReturn;
	placeholder?: string | null;
	name?: string;
	onChange: React.ChangeEventHandler<HTMLSelectElement>;
	value?: number | string;
	error?: string;
	options: StatusOptionType[];
	inputIcon?: React.JSXElementConstructor;
	disabled?: boolean;
	note?: string;
	className?: string;
	ariaLabel?: string;
};

export type DropdownOptionType = {
	name: string | number;
	key: number | string;
};

export type RadioButtonProps = {
	value?: string | number;
	label?: string;
	checked?: boolean;
	id?: string;
	name?: string;
	className?: string;
	onChange: (value: string | number | boolean | string[]) => void;
	radioOptions?: IRadioButtonOptions[];
	IsRadioList?: boolean;
	error?: string;
	note?: string;
};

export type IRadioButtonOptions = {
	name: string;
	value: string | number;
	key: string;
	disabled?: boolean;
};

export type SelectBoxProps = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	name?: string;
	type?: 'text' | 'password';
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	value?: string | number;
	error?: string;
	note?: string;
	option?: ISelectBoxOption[];
	inputIcon?: React.JSXElementConstructor;
	disabled?: boolean;
	placeholder?: string;
	required?: boolean;
};
export type ISelectBoxOption = {
	name: string | number;
	key: number | string;
	disabled?: boolean;
};

export type TRadioButton = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	name: string;
	error?: string | string[] | FormikErrors<string> | FormikErrors<string>[] | undefined;
	note?: string;
	label?: string;
	radioOptions: IRadioButtonOptions[];
	IsRadioList?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	checked?: string | number;
	required?: boolean;
};

// export type IRadioButtonOptions = {
// 	name: string;
// 	key: string | number;
// 	disabled?: boolean;
// };
export type TCheckBox = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	value?: string;
	error?: string;
	note?: string;
	option?: CheckBoxOption[];
	inputIcon?: React.JSXElementConstructor;
	IsCheckList?: boolean;
	required?: boolean;
	disabled?: boolean;
};
export type CheckBoxOption = {
	id?: string;
	name: string;
	value: string;
	checked?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onClick?: () => void;
};

export type TDatePicker = {
	id?: string;
	label?: string | DefaultTFuncReturn;
	name?: string;
	onChange?(event: CalendarChangeEvent): void;
	value?: date;
	error?: string;
	note?: string;
	min?: Date;
	max?: Date;
	inputIcon?: React.JSXElementConstructor;
	dateFormat?: string;
	placeholder?: string;
	required?: boolean;
	showTime?: boolean;
	hourFormat?: '12' | '24';
	disabled?: boolean;
	numberOfMonths?: number;
	selectionMode?: 'single' | 'multiple' | 'range';
	showIcon?: boolean;
	view?: 'month' | 'year' | 'date';
};
export type NotificationIconProps = {
	onOpen: () => void;
};
export type JoditEditorProps = {
	id: string;
	onChange: (content: string) => void;
	value?: string;
	config?: {
		readonly?: boolean;
		autofocus?: boolean;
		tabIndex?: number;
		askBeforePasteHTML?: boolean;
		askBeforePasteFromWord?: boolean;
		defaultActionOnPaste?: 'insert_clear_html' | 'insert_as_text' | 'insert_only_text';
		placeholder?: string;
		beautyHTML?: boolean;
		toolbarButtonSize?: 'tiny' | 'xsmall' | 'small' | 'middle' | 'large';
		uploader: {
			insertImageAsBase64URI?: boolean;
		};
	};
	error?: string;
	note?: string;
	label: string;
	required?: boolean;
	className?: string;
};

export type PrivateRoutesProps = {
	element: JSX.Element;
};

export type OptionsPropsForButton = {
	route?: string | undefined;
	data?: CommonDataArrOfModules;
	navigateRoute?: () => void;
	viewNavigateRoute?: () => void;
};

export type CommonDataArrOfModules = RoleDataArr | FetchCouponsDataArr | EnquiryDataArr | NotificationDataArr | SuggestionDataArr | BannerDataArr | SubAdminDataArr | EnquiryDataArr | NotificationDataArr | CategoryDataArr | CmsDataArr | ReviewUserDataArr | FaqDataArr | CityDataArr | RoleDataArr | StateDataArr | CountryDataArr | EmailNotificationTemplateDataArr;

export type LoaderProps = {
	showText?: boolean;
};
