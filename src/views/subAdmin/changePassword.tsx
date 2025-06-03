import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { ChangeSubAdminPassword } from '@type/subAdmin';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import { useMutation } from '@apollo/client';
import { CHANGE_SUBADMIN_PASSWORD } from '@framework/graphql/mutations/subAdmin';
import { toast } from 'react-toastify';
import { ChangeSubAdminPasswordRes } from '@framework/graphql/graphql';
import { Cross, Info } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import { Loader } from '@components/index';
const ChangePassword = ({ onClose: onCloseSubAdmin, subAdminObj, show }: ChangeSubAdminPassword): ReactElement => {
	const { t } = useTranslation();
	const [changePassword, { loading: changePasswordLoader }] = useMutation(CHANGE_SUBADMIN_PASSWORD);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
	const { suadminpasswordValidationSchema } = useValidation();
	const initialValues = {
		newPassword: '',
		confirmPassword: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: suadminpasswordValidationSchema,
		onSubmit: (values) => {
			changePassword({
				variables: {
					changeSubAdminPasswordId: subAdminObj.uuid,
					newPassword: values.newPassword,
					confirmPassword: values.confirmPassword,
				},
			})
				.then((res) => {
					const data = res.data as ChangeSubAdminPasswordRes;
					if (data.changeSubAdminPassword.meta.statusCode === 200) {
						toast.success(data.changeSubAdminPassword.meta.message);
					} else {
						toast.error(data.changeSubAdminPassword.meta.message);
					}
					onCloseSubAdmin();
				})
				.catch(() => {
					return;
				});
		},
	});
	/**
	 * method that handle's password view
	 */
	const handleToggleConfirmPassword = useCallback(() => {
		setShowConfirmPassword((prevState) => !prevState);
	}, [showConfirmPassword]);
	/**
	 * method that handle's password view
	 */
	const handleToggleShowPassword = useCallback(() => {
		setShowPassword((prevState) => !prevState);
	}, [showPassword]);
	/**
	 * Method that closes pop on outeside click
	 */
	useEffect(() => {
		document.addEventListener('click', (event: globalThis.MouseEvent) => {
			if ((event.target as HTMLElement)?.id === 'sub-admin-changepassword-model' || (event.target as HTMLElement)?.id === 'sub-admin-changepassword-model-child') {
				onCloseSubAdmin();
			}

			const handleKeyDown = (event: KeyboardEvent) => {
				if (event.key === 'Escape' && show) {
					onCloseSubAdmin();
				}
			};

			if (show) {
				document.addEventListener('keydown', handleKeyDown);
			}
		});
	}, [show]);
	return (
		<div className={`${show ? '' : 'hidden'} model-container`} id='sub-admin-changepassword-model'>
			{changePasswordLoader && <Loader />}
			<div id='sub-admin-changepassword-model-child' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={' model animate-fade-in '}>
				<div className='model-content'>
					<div className='model-header'>
						<div className='flex items-center'>
							<span className='mr-2 text-white inline-block text-xl svg-icon w-5 h-5'>
								<Info />
							</span>
							<span className='model-title'>{t('Change Password')}</span>
						</div>
						<Button onClick={onCloseSubAdmin} label={''}>
							<span className='my-1 text-white w-2.5 h-2.5 inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
					<form onSubmit={formik.handleSubmit}>
						<div className='model-body'>
							<div className='mb-4'>
								<TextInput password={true} btnShowHide={showPassword} btnShowHideFun={handleToggleShowPassword} id={'newPassword'} label={t('New Password')} placeholder={t('New Password')} name='newPassword' type={showPassword ? 'text' : 'password'} onChange={formik.handleChange} value={formik.values.newPassword} error={formik.errors.newPassword && formik.touched.newPassword ? formik.errors.newPassword : ''} />
							</div>
							<div>
								<TextInput password={true} btnShowHide={showConfirmPassword} btnShowHideFun={handleToggleConfirmPassword} id={'confirmPassword'} label={t('Confirm Password')} placeholder={t('Confirm Password')} name='confirmPassword' type={showConfirmPassword ? 'text' : 'password'} onChange={formik.handleChange} value={formik.values.confirmPassword} error={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ''} />
							</div>
						</div>
						<div className='model-footer'>
							<Button className='btn-primary  ' type='submit' label={t('Submit')} />
							<Button className='btn-warning ' onClick={onCloseSubAdmin} label={t('Close')} />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ChangePassword;
