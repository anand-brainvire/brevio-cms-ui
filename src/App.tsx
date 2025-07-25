import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './styles/main.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ROUTES, privateRoutes } from '@config/constant';
import ResetPassword from '@views/resetPassword';
import Geg from '@views/geg';
import PrivateRoutes from '@components/privateRoutes';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
const DefaultLayout = React.lazy(() => import('@layout/DefaultLayout'));
const PublicLayout = React.lazy(() => import('@layout/PublicLayout'));
const NotFound = React.lazy(() => import('@views/404'));
const Login = React.lazy(() => import('@views/login'));

function App() {
	return (
		<>
			<ToastContainer pauseOnHover={true} />

			<Suspense>
				<Routes>
					<Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
					{/* Public routes  */}
					<Route element={<PublicLayout />}>
						<Route path={ROUTES.login} element={<Login />} />
						<Route path={`${ROUTES.resetPassword}/?`} element={<ResetPassword />} />
						<Route path={`${ROUTES.setPassWord}/?`} element={<ResetPassword />} />
						<Route path='' element={<Navigate to={`/${ROUTES.login}`} />} />
					</Route>
					{/* Private routes  */}
					<Route element={<PrivateRoutes />}>
						<Route path={ROUTES.app} element={<DefaultLayout />}>
							{privateRoutes.map((route) => {
								return route.element && <Route key={route.path} path={route.path} element={<route.element />} />;
							})}
						</Route>
					</Route>
					<Route path='*' element={<NotFound />} />
					<Route path={ROUTES.geg} element={<Geg />} />
				</Routes>
			</Suspense>
		</>
	);
}

export default App;
