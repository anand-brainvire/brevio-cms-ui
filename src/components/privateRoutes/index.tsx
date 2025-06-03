import { ROUTES } from '@config/constant';
import { verifyAuth } from '@utils/helpers';
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
	const [verified, setVerified] = useState<boolean>(verifyAuth());
	useEffect(() => {
		setVerified(verifyAuth());
	}, [verifyAuth]);

	if (verified) {
		return <Outlet />;
	} else {
		return <Navigate to={`/${ROUTES.login}`} />;
	}
};
export default React.memo(PrivateRoutes);
