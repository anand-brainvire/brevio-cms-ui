import { ROUTES } from '@config/constant';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
	const { t } = useTranslation();
	const location = useLocation();

	const [secondWord, thirdWord] = location.pathname.split('/').slice(2, 4);
	const hasSecond = Boolean(secondWord);
	const hasThird = thirdWord && thirdWord !== 'list';

	const convertToTitleCase = (inputString: string): string => {
		return inputString
			?.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	// Extract main resource name: e.g. 'manage-sub-admin' -> 'Sub Admin'
	const getCleanSecondTitle = (input: string) => {
		const parts = input.split('-');
		if (parts[0] === 'manage') {
			parts.shift();
		}
		return convertToTitleCase(parts.join('-'));
	};

	const routeTitle = secondWord && convertToTitleCase(secondWord);       // Full name e.g. 'Manage Sub Admin'
	const cleanTitle = secondWord && getCleanSecondTitle(secondWord);     // e.g. 'Sub Admin'

	const getThirdLabel = (word: string): string => {
		switch (word) {
			case 'edit':
				return `${t('Edit')} ${cleanTitle}`;
			case 'view':
				return `${t('View')} ${cleanTitle}`;
			case 'add':
				return `${t('Add')} ${cleanTitle}`;
			default:
				return t(convertToTitleCase(word));
		}
	};

	return (
		<div className='flex flex-wrap bg-white py-3 px-4 border-b border-b-color-4 capitalize leading-5'>
			{/* Home */}
			<span>
				<NavLink
					to={`/${ROUTES.app}/${ROUTES.dashboard}`}
					className='text-primary hover:underline cursor-pointer'
				>
					{t('Home')}
				</NavLink>
				{hasSecond && <span className='mx-2 text-slate-500'>/</span>}
			</span>

			{/* Second Breadcrumb */}
			{hasSecond && (
				<span>
					{hasThird ? (
						<NavLink
							to={`/${ROUTES.app}/${secondWord}/list`}
							className='text-primary hover:underline cursor-pointer'
						>
							{t(routeTitle)}
						</NavLink>
					) : (
						<span className='text-slate-500'>{t(routeTitle)}</span>
					)}
				</span>
			)}

			{/* Third Breadcrumb */}
			{hasThird && (
				<>
					<span className='mx-2 text-slate-500'>/</span>
					<span className='text-slate-500'>{getThirdLabel(thirdWord)}</span>
				</>
			)}
		</div>
	);
};

export default React.memo(Breadcrumb);
