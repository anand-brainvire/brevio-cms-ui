import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@config/constant';
import { CREATE_ENQUIRY } from '@framework/graphql/mutations/enquiry';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import { Loader } from '@components/index';

const AddEnquiryPage = () => {
	const { t } = useTranslation();
	const [createEnquiry, { loading }] = useMutation(CREATE_ENQUIRY);
	const navigate = useNavigate();
	const { addEnquireValidationSchema } = useValidation();

	const initialValues = {
		name: '',
		email: '',
		subject: '',
		message: '',
		status: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addEnquireValidationSchema,
		onSubmit: (values) => {
			createEnquiry({
				variables: {
					status: 4,
					name: values.name,
					email: values.email,
					subject: values.subject,
					message: values.message,
				},
			})
				.then((res) => {
					const data = res?.data;
					if (data?.createEnquiry?.meta?.statusCode === 201) {
						toast.success(data?.createEnquiry?.meta?.message);
						formik.resetForm();
						onCancelEnquiry();
					}
				})
				.catch(() => {
					return;
				});
		},
	});
	/**
	 * On cancle redirect to list view
	 */
	const onCancelEnquiry = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.enquiry}/${ROUTES.list}`);
	}, []);
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlurEnq = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	return (
		<div className='card'>
			{loading && <Loader />}
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-title-container'>
						<p>
							{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
						</p>
					</div>
					<div className='card-grid-addedit-page md:grid-cols-2'>
						<div>
							<TextInput id={'name'} required={true} placeholder={t('Name')} name='name' onChange={formik.handleChange} label={t('Name')} value={formik.values.name} error={formik.errors.name && formik.touched.name ? formik.errors.name : ''} onBlur={OnBlurEnq} />
						</div>
						<div>
							<TextInput id={'subject'} required={true} placeholder={t('Subject')} name='subject' onChange={formik.handleChange} label={t('Subject')} value={formik.values.subject} error={formik.errors.subject && formik.touched.subject ? formik.errors.subject : ''} onBlur={OnBlurEnq} />
						</div>
						<div>
							<TextInput id={'message'} required={true} placeholder={t('Message')} name='message' onChange={formik.handleChange} label={t('Message')} value={formik.values.message} error={formik.errors.message && formik.touched.message ? formik.errors.message : ''} onBlur={OnBlurEnq} />
						</div>
						<div>
							<TextInput id={'email'} required={true} placeholder={t('Email')} name='email' onChange={formik.handleChange} label={t('Email')} value={formik.values.email} error={formik.errors.email && formik.touched.email ? formik.errors.email : ''} onBlur={OnBlurEnq} />
						</div>
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button type='submit' className='btn-primary ' label={t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button label={t('Cancel')} className=' btn-warning  ' onClick={onCancelEnquiry}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEnquiryPage;
