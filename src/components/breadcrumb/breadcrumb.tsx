import { ROUTES } from '@config/constant';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const [secondWord, thirdWord] = location.pathname.split('/').slice(2, 4);
	//Function to remove the hypen (-) and then conver the first letter to Capital case
	const convertToTitleCase = (inputString: string): string => {
		const words = inputString?.split('-');
		const titleCaseString = words
			.map((word) => {
				return word.charAt(0).toUpperCase() + word.slice(1);
			})
			.join(' ');
		return titleCaseString;
	};

	const RouteProfileName = secondWord && convertToTitleCase(secondWord);

	return (
		<div className='flex flex-wrap bg-white py-3 px-4 border-b border-b-color-4 capitalize leading-5'>
			<span>
				<NavLink to={`/${ROUTES.app}/${ROUTES.dashboard}`} className='text-primary hover:underline cursor-pointer '>
					{t('Home')}
				</NavLink>
				<span className='m-2 text-slate-500'>/</span>
			</span>
			{thirdWord && (
				<NavLink to={`/${ROUTES.app}/${secondWord}/${ROUTES.list}`} className='text-primary hover:underline'>
					{t(`${RouteProfileName}`)}
				</NavLink>
			)}

			{!thirdWord && (
				<NavLink to={`/${ROUTES.app}/${secondWord}`} className='text-primary '>
					<span className={'text-slate-500 cursor-pointer'}>{t(`${RouteProfileName}`)}</span>
				</NavLink>
			)}

			{thirdWord !== undefined && (
				<span className='text-slate-500'>
					<span className='m-2 text-slate-500 '>/</span>
					{thirdWord !== 'list' ? `${t(thirdWord)} ${t(RouteProfileName)}` : `${t(RouteProfileName)} ${t(thirdWord)} `}
				</span>
			)}
		</div>
	);
};

export default React.memo(Breadcrumb);
