import React, { useState, useCallback, useEffect, ReactElement } from 'react';
import { useMutation } from '@apollo/client';
import { LoginResponse } from '@framework/graphql/graphql';
import { LOGIN_USER } from '@framework/graphql/mutations/user';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { ROUTES } from '@config/constant';
import { LoginInput } from '@type/views';
import Button from '@components/button/button';
import { Email, Lock } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
// import { GET_SETTINGS_BY_ID } from '@framework/graphql/mutations/settings';
import useValidation from '@src/hooks/validations';
import ForgetModel from './forgetModel';
import EncryptionFunction from 'src/services/encryption';
import { getCookie, setCookie } from '@utils/helpers';
import DecryptionFunction from 'src/services/decryption';
import { Loader } from '@components/index';
import brevioLogo from '@assets/images/brevio-logo.png';
import { toast } from 'react-toastify';

const Login = (): ReactElement => {
	const { t } = useTranslation();
	const [login, { loading }] = useMutation(LOGIN_USER);
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	// const [getSettings] = useLazyQuery(GET_SETTINGS_BY_ID);
	const { loginValidationSchema } = useValidation();
	const [isShowForgetModel, setIsShowForgetModel] = useState<boolean>(false);
	const [rememberMe, setRememberMe] = useState<boolean>(false);

	const initialValues: LoginInput = {
		email: (getCookie('savedEmail') && DecryptionFunction(getCookie('savedEmail'))) || '',
		password: (getCookie('savedPassword') && DecryptionFunction(getCookie('savedPassword'))) || '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: loginValidationSchema,
		validateOnMount: false,
		onSubmit: (values) => {
			if (rememberMe) {
				const encryptedEmail = EncryptionFunction(formik.values.email);
				const encryptedPassword = EncryptionFunction(formik.values.password);
				setCookie('savedEmail', encryptedEmail, 7);
				setCookie('savedPassword', encryptedPassword, 7);
			}
			if (!rememberMe) {
				document.cookie = 'savedEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
				document.cookie = 'savedPassword=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			}
			login({
				variables: {
					input: values,
				},
			})
				.then((res) => {
					const data = res?.data as LoginResponse;
					if (data?.login?.meta?.statusCode === 200) {
						localStorage.setItem('userId', EncryptionFunction(data?.login?.data?.user?.uuid));
						localStorage.setItem('loggedUserId', EncryptionFunction(data.login.data?.user?.id));
						localStorage.setItem('authToken', EncryptionFunction(data.login.data.accessToken));
						localStorage.setItem('profileName', EncryptionFunction(data.login.data.user.first_name + ' ' + data.login.data.user.last_name));
						localStorage.setItem('profileImage', EncryptionFunction(data.login.data.user.profile_img));
						localStorage.setItem('permissions', EncryptionFunction(JSON.stringify(data.login.data.permissions)));
						localStorage.setItem('expireTime', EncryptionFunction(data.login.data.expiresAt));
						localStorage.setItem('refreshToken', EncryptionFunction(data.login.data.refreshToken));
						localStorage.setItem('expiresIn', EncryptionFunction(data.login.data.expiresIn));

						// getSettings().then((res) => {
						// 	const data = res?.data?.getSettingDetails?.data as SettingsDataArr[];
						// 	data?.forEach((mappedSettingsData: SettingsDataArr) => {
						// 		if (mappedSettingsData.key === 'favicon') {
						// 			localStorage.setItem('favicon', mappedSettingsData?.value);
						// 		}
						// 		if (mappedSettingsData.key === 'logo') {
						// 			localStorage.setItem('profileImage', mappedSettingsData?.value);
						// 		}
						// 	});
						// });
						navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
					} else {
						// Show toast for error
						toast.error(data?.login?.meta?.message || t('Login failed'));
					}
				})
				.catch(() => {
					return;
				});
		},
	});

	// const validNameMakerFunction = (name: string) => {
	// 	const NewName = name.replace(SPACE_REMOVER_REGEX, '');
	// 	return NewName.replace(SPECIAL_CHARACTERS_REMOVER, '');
	// };

	/**
	 * Method that gets the cookie and sets the user login detials
	 */
	useEffect(() => {
		if (getCookie('savedEmail')) {
			const decryptedEmail = DecryptionFunction(getCookie('savedEmail'));
			formik.setFieldValue('email', decryptedEmail);
			setRememberMe(true);
		}
		if (getCookie('savedPassword')) {
			const decryptedPassword = DecryptionFunction(getCookie('savedPassword'));
			formik.setFieldValue('password', decryptedPassword);
		}
	}, []);

	/**
	 * method that handle's password view
	 */
	const handleToggleShowPassword = useCallback(() => {
		setShowPassword((prevState) => !prevState);
	}, []);

	/**
	 * Method closes popup
	 */
	const onCloseForget = useCallback(() => {
		setIsShowForgetModel(false);
	}, []);

	/**
	 * Handle's submit and closes popup
	 */
	const onSubmit = useCallback(() => {
		setIsShowForgetModel(false);
	}, []);

	return (
		<React.Fragment>
			{loading && <Loader />}
			<div className='flex w-full h-full mx-auto items-center justify-center flex-col'>
				{/* Logo centered on top, outside the form card */}
				<div className='flex justify-center items-center mt-6 mb-10'>
					<img src={brevioLogo} alt='Brevio Logo' className='h-50 w-50' />
				</div>
				<div className='w-full sm:max-w-wide-2 lg:max-w-wide-3 bg-white rounded py-0 px-1 md:p-6 border border-default'>
					<form onSubmit={formik.handleSubmit}>
						<div className='card-body'>
							<h1 className='text-gray-800 mb-2 font-medium leading-md text-h2'>{t('Login')}</h1>
							<p className='text-base-font-1 mb-4 leading-5'>{t('Sign In to your account')}</p>
							<div className='mb-4'>
								<TextInput
									placeholder={t('Email')}
									name='email'
									onChange={formik.handleChange}
									value={formik.values.email}
									error={formik.errors.email}
									inputIcon={
										<span className='w-3.5 inline-block svg-icon'>
											<Email />
										</span>
									}
									loginInput={true}
								/>
							</div>
							<div className='mb-4 '>
								<TextInput
									btnShowHide={showPassword}
									btnShowHideFun={handleToggleShowPassword}
									placeholder='Password'
									name='password'
									type={showPassword ? 'text' : 'password'}
									password={true}
									onChange={formik.handleChange}
									value={formik.values.password}
									error={formik.errors.password && formik.touched.password ? formik.errors.password : ''}
									inputIcon={
										<span className='svg-icon inline-block w-3.5 h-3.5'>
											<Lock />
										</span>
									}
									loginInput={true}
								/>
							</div>
							<div className='flex items-center justify-between mb-3 '>
								<div className='flex items-center mr-2 '>
									<input
										id='default-checkbox'
										type='checkbox'
										value=''
										className='w-4 h-4 text-red-600 bg-gray-100 border border-gray-300  focus:ring-red-200 focus:ring-2 rounded-2xl'
										checked={rememberMe}
										onChange={(e) => setRememberMe(e.target.checked)}
									/>
									<label htmlFor='default-checkbox' className='ml-2 text-sm font-normal text-dark-gary-1 hover:cursor-pointer '>
										{t('Remember me')}
									</label>
								</div>
								<button
									type='button'
									title='Forgot Password'
									className='inline-block font-normal align-baseline text-sm text-primary hover:text-primary hover:underline hover:cursor-pointer'
									onClick={() => {
										// this code  added so that the user logs out from the tab once click on forgot password link .
										localStorage.clear();
										sessionStorage.clear();
										setIsShowForgetModel(true);
									}}
								>
									{t('Forgot Password')}?
								</button>
							</div>
							<div className='flex justify-between'>
								<Button className='btn-primary btn-login' type='submit' label={t('Login')} />
							</div>
						</div>
					</form>
				</div>
			</div>
			{isShowForgetModel && <ForgetModel show={isShowForgetModel} onClose={onCloseForget} action={onSubmit} />}
		</React.Fragment>
	);
};

export default Login;
