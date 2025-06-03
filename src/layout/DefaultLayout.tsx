import React, { ReactElement, Suspense, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGOUT_WANRING_TEXT, ROUTES } from '@config/constant';
import { destroyAuth, verifyAuth } from '@utils/helpers';
import { Content, Sidebar, Footer, Header, Breadcrumb } from '@components/index';
import CommonModel from '@components/common/commonModel';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
import { useMutation } from '@apollo/client';
import { LOGOUT } from '@framework/graphql/mutations/user';

const DefaultLayout = (): ReactElement => {
	const navigate = useNavigate();
	const [show, setShow] = useState<boolean>(true);
	const [isShowLogoutModel, setIsShowLogoutModel] = useState<boolean>(false);
	const [toggleImage, setToggleImage] = useState<boolean>(false);
	const [runLogout] = useMutation(LOGOUT);
	/**
	 * Method that verify authentication on first renderging
	 * If not verified navigate to login page
	 */
	React.useEffect(() => {
		if (!verifyAuth()) {
			navigate(`/${ROUTES.login}`);
		}
	}, []);
	/**
	 * Function that closes model
	 */
	const onCloseModel = useCallback(() => {
		setIsShowLogoutModel(false);
	}, [setIsShowLogoutModel]);
	/**
	 * Function that clears local storage data and navigate to login page
	 */
	const clearLocalStorage = () => {
		destroyAuth();
		localStorage.clear();
		sessionStorage.clear();
		navigate(`/${ROUTES.login}`);
	};
	/**
	 * Function that triggers logout api
	 */
	const logout = useCallback(() => {
		runLogout()
			.then(() => {
				clearLocalStorage();
			})
			.catch(() => {
				clearLocalStorage();
			});
	}, []);
	/**
	 * Function that help's to enable logout model
	 */
	const onConformation = useCallback((newValue: boolean): void => {
		setIsShowLogoutModel(newValue);
	}, []);
	/**
	 * Method that handles storage data
	 */
	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === null && event.storageArea === localStorage) {
				destroyAuth();
				navigate(`/${ROUTES.login}`);
			}
		};
		window.addEventListener('storage', handleStorageChange);
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, [navigate]);

	return (
		<div className='flex flex-col h-screen'>
			<Header onClick={setShow} logoutConformation={onConformation} toggleHeaderImage={toggleImage} />
			<div className='relative flex flex-1 max-h-full overflow-y-auto  '>
				<Sidebar show={show} menuHandler={setShow} setToggleImage={setToggleImage} />
				<div className='flex flex-col w-full overflow-auto bg-bg-3'>
					<Breadcrumb />
					<Suspense>
						<Content />
						{isShowLogoutModel && <CommonModel action={logout} show={isShowLogoutModel} onClose={onCloseModel} warningText={LOGOUT_WANRING_TEXT} />}
					</Suspense>
					<Footer />
				</div>
			</div>
		</div>
	);
};

export default DefaultLayout;
