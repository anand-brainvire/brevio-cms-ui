import { ROUTES } from '@config/constant';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const [secondWord, thirdWord] = location.pathname.split('/').slice(2, 4);

	// Convert 'manage-category' to 'Manage Category'
	const convertToTitleCase = (inputString: string): string => {
		return inputString
			?.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	const routeProfileName = secondWord && convertToTitleCase(secondWord);

	const isListPage = thirdWord === 'list';

	return (
		<div className='flex flex-wrap bg-white py-3 px-4 border-b border-b-color-4 capitalize leading-5'>
			{/* Home link */}
			<span>
				<NavLink to={`/${ROUTES.app}/${ROUTES.dashboard}`} className='text-primary hover:underline cursor-pointer'>
					{t('Home')}
				</NavLink>
				<span className='mx-2 text-slate-500'>/</span>
			</span>

			{/* Second level breadcrumb */}
			{isListPage ? (
				// If on list page, show plain text
				<span className='text-slate-500'>{t(routeProfileName)}</span>
			) : (
				// Else show clickable link to list
				<>
					<NavLink to={`/${ROUTES.app}/${secondWord}/${ROUTES.list}`} className='text-primary hover:underline'>
						{t(routeProfileName)}
					</NavLink>
					{thirdWord && <span className='mx-2 text-slate-500'>/</span>}
				</>
			)}

			{/* Third level breadcrumb (edit/view/etc.) */}
			{thirdWord && !isListPage && (
				<span className='text-slate-500'>
					{t(thirdWord)} {t(routeProfileName)}
				</span>
			)}
		</div>
	);
};

export default React.memo(Breadcrumb);
