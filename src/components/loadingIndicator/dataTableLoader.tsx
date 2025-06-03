import { t } from 'i18next';
import React from 'react';
const TableLoader = () => {
	return (
		<div className='w-full px-2.5 py-2 bg-white bg-opacity-75 flex justify-center transition-all duration-200 ease-in-out absolute top-10 '>
			<div className='text-xl'>{t('Processing...')}</div>
		</div>
	);
};
export default TableLoader;
