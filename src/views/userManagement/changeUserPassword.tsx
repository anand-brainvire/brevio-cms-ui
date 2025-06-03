import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { ChangeUserPasswordRes } from '@framework/graphql/graphql';
import { ChangeUserPassword } from '@type/user';
import { CHANGE_USER_PASSWORD } from '@framework/graphql/mutations/user';
import { Cross, Info } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import { Loader } from '@components/index';
const PassWordChange = ({ onClose, UserObj, show }: ChangeUserPassword): ReactElement => {
	const { t } = useTranslation();
	const [changePasswordUser, { loading: changePasswordLoader }] = useMutation(CHANGE_USER_PASSWORD);
	const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
	const { changeProfileValidationSchema } = useValidation();
	const initialValues = {
		newPassword: '',
		confirmPassword: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: changeProfileValidationSchema,
		onSubmit: (values) => {
			changePasswordUser({
				variables: {
					changeUserPasswordId: UserObj.uuid,
					confirmPassword: values.confirmPassword,
					newPassword: values.newPassword,
				},
			})
				.then((res) => {
					const data = res?.data as ChangeUserPasswordRes;
					if (data?.changeUserPassword?.meta?.statusCode === 200) {
						toast.success(data?.changeUserPassword?.meta?.message);
					}
					onClose();
				})
				.catch(() => {
					return;
				});
		},
	});
	/**
	 * Method that closes pop on outeside click
	 */
	useEffect(() => {
		document.addEventListener('click', (event: globalThis.MouseEvent) => {
			if ((event.target as HTMLElement)?.id === 'user-changepassword-model' || (event.target as HTMLElement)?.id === 'user-changepassword-model-child') {
				onClose();
			}
			const handleKeyDown = (event: KeyboardEvent) => {
				if (event.key === 'Escape' && show) {
					onClose();
				}
			};

			if (show) {
				document.addEventListener('keydown', handleKeyDown);
			}
		});
	}, [show]);

	/**
	 * method that handle's password view
	 */
	const handlesShowconformpassword = useCallback(() => {
		setShowConfirmPassword(!showConfirmPassword);
	}, [showConfirmPassword]);

	/**
	 * method that handle's password view
	 */
	const handleShowNewpassword = useCallback(() => {
		setShowNewPassword(!showNewPassword);
	}, [showNewPassword]);

	return (
		<div className={`${show ? '' : 'hidden'} model-container `} id='user-changepassword-model'>
			{changePasswordLoader && <Loader />}
			<div id='user-changepassword-model-child' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={'model animate-fade-in'}>
				<div className='model-content'>
					{/* <!-- Modal content --> */}
					<div className='model-header'>
						<div className='flex items-center '>
							<span className='mr-2 text-white inline-block text-xl svg-icon w-5 h-5'>
								<Info />
							</span>
							<span className='model-title ml-2'>{t('Change Password')}</span>
						</div>
						<Button onClick={onClose} label={''}>
							<span className='my-1 text-white w-2.5 h-2.5 inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>{' '}
					<form onSubmit={formik.handleSubmit}>
						<div className='model-body'>
							<div className='mb-4'>
								<TextInput password={true} btnShowHide={showNewPassword} btnShowHideFun={handleShowNewpassword} id={'newPassword'} placeholder={t('New Password')} name='newPassword' type={showNewPassword ? 'text' : 'password'} onChange={formik.handleChange} value={formik.values.newPassword} error={formik.errors.newPassword && formik.touched.newPassword ? formik.errors.newPassword : ''} label={'New Password'} />
							</div>
							<div className='mb-4'>
								<TextInput password={true} btnShowHide={showConfirmPassword} btnShowHideFun={handlesShowconformpassword} id={'confirmPassword'} placeholder={t('Confirm Password')} name='confirmPassword' type={showConfirmPassword ? 'text' : 'password'} onChange={formik.handleChange} value={formik.values.confirmPassword} error={formik.errors.confirmPassword && formik.touched.confirmPassword ? formik.errors.confirmPassword : ''} label={'Confirm Password'} />
							</div>
						</div>

						<div className='model-footer'>
							<Button type='submit' className='btn-primary ' label={t('Submit')}></Button>

							<Button className='btn-warning ' onClick={onClose} label={t('Close')}></Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default PassWordChange;
