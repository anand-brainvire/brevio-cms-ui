import React, { ReactElement, useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@config/constant';
import { toast } from 'react-toastify';
import { CHANGE_USERPROFILE_PASSWORD } from '@framework/graphql/mutations/admin';
import TextInput from '@components/textinput/TextInput';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import { Loader } from '@components/index';
const UserProfilePasswordChange = (): ReactElement => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [changePassword, { loading }] = useMutation(CHANGE_USERPROFILE_PASSWORD);
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { changeProfileValidationSchema } = useValidation();
	const initialValues = {
		oldPassword: '',
		newPassword: '',
		confirmPassword: '',
	};
	/**
	 * on cancel it will redirect to dashboard
	 */
	const cancelPassWordHandler = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
	}, []);
	const formik = useFormik({
		initialValues,
		validationSchema: changeProfileValidationSchema,
		onSubmit: (values) => {
			changePassword({
				variables: {
					currentPassword: values.oldPassword,
					newPassword: values.newPassword,
				},
			})
				.then((response) => {
					const meta = response.data?.changePassword?.meta;
					if (meta?.statusCode === 200) {
						toast.success(meta.message);
						cancelPassWordHandler();
					} else {
						toast.error(meta?.message || t('Password change failed'));
					}
				})
				.catch(() => {
					return;
				});
		},
	});
	/**
	 * Method that removes white spaces on blur event
	 */
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	/**
	 * handles show password
	 */
	const handleShowpassword = useCallback(() => {
		setShowOldPassword(!showOldPassword);
	}, [showOldPassword]);
	/**
	 * handles show new password
	 */
	const handleShownewpassword = useCallback(() => {
		setShowNewPassword(!showNewPassword);
	}, [showNewPassword]);
	/**
	 * handle comfirm passowrd
	 */
	const handleconformpassword = useCallback(() => {
		setShowConfirmPassword(!showConfirmPassword);
	}, [showConfirmPassword]);

	return (
		<div>
			<div className='card  '>
				{loading && <Loader />}
				<form onSubmit={formik.handleSubmit} className='max-w-full mx-auto'>
					<div className='card-body'>
						<div className='card-title-container'>
							<p>
								{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
							</p>
						</div>
						<h4 className='mb-3 text-l text-h3 font-medium leading-6'>{t('Change Password')}</h4>
						<div className='pt-4 bg-white border-t border-gray-300    '>
							<div className='card-grid-addedit-page md:grid-cols-2'>
								<TextInput error={formik.errors.oldPassword && formik.touched.oldPassword ? formik.errors.oldPassword : ''} btnShowHide={showOldPassword} btnShowHideFun={handleShowpassword} required={true} id='oldPassword' onBlur={OnBlur} type={showOldPassword ? 'text' : 'password'} password={true} label={t('Current Password')} value={formik.values.oldPassword} onChange={formik.handleChange} placeholder={t('Current Password')} />

								<TextInput btnShowHide={showNewPassword} btnShowHideFun={handleShownewpassword} error={formik.errors.newPassword && formik.touched.newPassword ? formik.errors.newPassword : ''} required={true} onBlur={OnBlur} id='newPassword' type={showNewPassword ? 'text' : 'password'} password={true} label={t('New Password')} value={formik.values.newPassword} onChange={formik.handleChange} placeholder={t('New Password')} />

								<TextInput error={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ''} btnShowHide={showConfirmPassword} btnShowHideFun={handleconformpassword} required={true} onBlur={OnBlur} id='confirmPassword' type={showConfirmPassword ? 'text' : 'password'} password={true} label={t('Confirm Password')} value={formik.values.confirmPassword} onChange={formik.handleChange} placeholder={t('Confirm Password')} />
							</div>
						</div>
					</div>
					<div className='card-footer '>
						<div className='flex btn-group '>
							<Button className='btn-primary ' label={t('Change Password')} type='submit'>
								<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
									<CheckCircle />
								</span>
							</Button>
							<Button className='btn-secondary' label={t('Cancel')} onClick={cancelPassWordHandler}>
								<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
									<Cross />
								</span>
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UserProfilePasswordChange;
