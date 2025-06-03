import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '@config/constant';
import { verifyAuth } from '@utils/helpers';

const PublicLayout = () => {
	const navigate = useNavigate();

	React.useEffect(() => {
		if (verifyAuth()) {
			navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
		}
	}, []);

	return (
		<div className='h-full flex px-4'>
			<Outlet />
		</div>
	);
};

export default PublicLayout;
