import React from 'react';
import { Outlet } from 'react-router-dom';

const Content = () => {
	return (
		<main className='flex flex-col py-6 px-8 bg-bg-3 flex-1' id='mainId'>
			<Outlet />
		</main>
	);
};

export default React.memo(Content);
