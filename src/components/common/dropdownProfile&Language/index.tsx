import React, { ReactElement } from 'react';
import { DropDownProfileAndLanguageProps } from '@type/common';
import LinkElement from '@components/common/dropdownProfile&Language/link';
import { useTranslation } from 'react-i18next';

const DropDownProfileAndLanguage = ({ onClick, List, className = '' }: DropDownProfileAndLanguageProps): ReactElement => {
	const { t } = useTranslation()
	return (
		<div className={'lang absolute z-50 flex flex-col border border-b-color-4 mt-1 bg-white min-w-wide-2 rounded  font-normal'} id='lang-model'>
			{List.map((item) => (
				<LinkElement key={item.route} to={item.route ? item.route : '#'} className={`${className} border-b border-b-color-4 hover:cursor-pointer hover:bg-slate-100 w-full px-5 py-3 focus:bg-primary text-sm leading-4`} onClick={onClick} data={item.data} icon={item.icon && <item.icon />} content={t(item.content)} />
			))}
		</div>
	);
};
export default DropDownProfileAndLanguage;
