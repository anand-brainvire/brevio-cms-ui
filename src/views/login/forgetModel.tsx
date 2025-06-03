import { useMutation } from '@apollo/client';
import Button from '@components/button/button';
import { Cross } from '@components/icons/icons';
import { Loader } from '@components/index';
import TextInput from '@components/textinput/TextInput';
import { ForgotPasswordResponse } from '@framework/graphql/graphql';
import { USER_FORGOT_PASSWORD } from '@framework/graphql/mutations/user';
import useValidation from '@src/hooks/validations';
import { useFormik } from 'formik';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ForgetModelProps } from '@type/common';
import { ForgotPasswordInput } from '@type/views';

const ForgetModel = ({ onClose, action, show }: ForgetModelProps): ReactElement => {
	const { t } = useTranslation();

	const [forgotPassword, { loading }] = useMutation(USER_FORGOT_PASSWORD);
	const initialValues: ForgotPasswordInput = {
		email: '',
	};
	const { forgotPasswordValidationSchema } = useValidation();
	const formik = useFormik({
		initialValues,
		validationSchema: forgotPasswordValidationSchema,
		onSubmit: (values) => {
			forgotPassword({
				variables: values,
			})
				.then((res) => {
					const data = res?.data as ForgotPasswordResponse;
					if (data?.forgotPassword?.meta?.statusCode === 200) {
						toast.success(t(data?.forgotPassword?.meta?.message));
						action();
					}
					formik.resetForm();
				})
				.catch(() => {
					return;
				});
		},
	});
	return (
		<div className={`${show ? '' : 'hidden'} model-container`}>
			{loading && <Loader />}
			<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={'model animate-fade-in '}>
				<div className=' max-h-full '>
					{/* <!-- Modal content --> */}
					<div className='model-content'>
						<div className='model-header'>
							<div className='flex'>
								<h3 className='text-xl font-semibold text-white '>Forget Password</h3>
							</div>
							<Button onClick={onClose} label={''}>
								<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
									<Cross />
								</span>
							</Button>
						</div>
						<form onSubmit={formik.handleSubmit}>
							<div className='model-body'>
								<TextInput label={t('Enter your e-mail address below to reset your password.')} placeholder={t('Email')} name='email' onChange={formik.handleChange} value={formik.values.email} error={formik.errors.email} />
							</div>
							<div className='model-footer'>
								<Button type='submit' className='btn-primary  ' disabled={!!(formik.values.email === '' || formik.errors.email)} label={t('Submit')} />
								<Button className='  hover:bg-gray-400 btn-gray' onClick={onClose} label={t('Close')} />
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgetModel;
