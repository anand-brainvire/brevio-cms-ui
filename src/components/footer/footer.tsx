import { useTranslation } from 'react-i18next';
import React from 'react';
import { getYear } from '@utils/helpers';
const Footer = () => {
	const { t } = useTranslation();
	return (
		<footer className='bg-bg-1 px-4 py-3.5 border border-t-default '>
			<p className='text-right'>
				&copy; &nbsp;{getYear(new Date())}&nbsp;{t('All rights reserved')}.
			</p>
		</footer>
	);
};

export default React.memo(Footer);
