import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import TextInput from '@components/textinput/TextInput';
import { VERIFY_USER_RESET_PASSWORD } from '@framework/graphql/mutations/user';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { ROUTES } from '@config/constant';
import { ResetPasswordInput } from '@type/views';
import Button from '@components/button/button';
import useValidation from '@src/hooks/validations';
import EncryptionFunction from '@src/services/encryption';
import { Loader } from '@components/index';

const ResetPassword = (): ReactElement => {
	const { t } = useTranslation();
	const [params] = useSearchParams();
	const token = params.get('token');

	useEffect(() => {
		localStorage.clear();
		if (params) {
			localStorage.setItem('param', EncryptionFunction(params?.get('token') as string));
		}
	}, []);

	const { resetPasswordValidationSchema } = useValidation();
	// const [resetPassword, { loading: resetLoader }] = useMutation(USER_RESET_PASSWORD);
	const [verifyResetPassword, { loading: verifyPassword }] = useMutation(VERIFY_USER_RESET_PASSWORD);

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [confirmShowPassword, setConfirmShowPassword] = useState<boolean>(false);
	const navigate = useNavigate();

	const initialValues: ResetPasswordInput = {
		password: '',
		confirmPassword: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: resetPasswordValidationSchema,
		onSubmit: (values) => {
			verifyResetPassword({
				variables: {
					input: {
						token: token,
						password: values.password,
						confirmPassword: values.confirmPassword,
					},
				},
			})
				.then((res) => {
					const data = res?.data;
					if (data?.resetPassword?.meta?.statusCode === 200) {
						toast.success(data?.resetPassword?.meta?.message);
						localStorage.clear();
						sessionStorage.clear();
						navigate(`/${ROUTES.login}`);
					} else {
						navigate(`/${ROUTES.login}`);
					}
				})
				.catch(() => {
					return;
				});
		},
	});

	const handleToggleShowPassword = useCallback(() => {
		setShowPassword((prevState) => !prevState);
	}, [showPassword]);
	const handleToggleConfirmShowPassword = useCallback(() => {
		setConfirmShowPassword((prevState) => !prevState);
	}, [confirmShowPassword]);
	const onCancelClick = useCallback(() => {
		navigate(`/${ROUTES.login}`);
	}, []);

	return (
		<div className='flex w-full h-full mx-auto items-center justify-center'>
			{(verifyPassword) && <Loader />}
			<div className='w-full sm:max-w-wide-2 lg:max-w-wide-3 bg-white  rounded py-0 px-1 md:p-6 border border-default'>
				<form onSubmit={formik.handleSubmit}>
					<div className='card-body'>
						<h1 className='text-primary mb-2 font-medium leading-md text-h2'> {t('Reset Password')}</h1>
						<div className='mb-4 '>
							<TextInput btnShowHide={showPassword} btnShowHideFun={handleToggleShowPassword} password={true} label={t('New Password')} placeholder='New Password' name='password' type={showPassword ? 'text' : 'password'} onChange={formik.handleChange} value={formik.values.password} error={formik.errors.password && formik.touched.password ? formik.errors.password : ''} />
						</div>
						<div className='mb-4 '>
							<TextInput btnShowHide={confirmShowPassword} btnShowHideFun={handleToggleConfirmShowPassword} password={true} label={t('Confirm Password')} placeholder='Confirm Password' name='confirmPassword' type={confirmShowPassword ? 'text' : 'password'} onChange={formik.handleChange} value={formik.values.confirmPassword} error={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ''} />
						</div>
						<div className='flex items-center space-x-2'>
							<Button className='btn-primary   ' type='submit' label={t('Reset')} />
							<Button className='btn-secondary  ' label={t('Cancel')} onClick={onCancelClick} />
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};
export default ResetPassword;
