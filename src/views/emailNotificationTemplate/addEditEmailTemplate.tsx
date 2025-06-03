import React, { ReactElement, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { EmailNotificationTemplateDataArr, CreateEmailTemplateRes, UpdateEmailTemplateRes } from '@framework/graphql/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import { EMAIL_TEMPLATE_RADIO_TYPE_LIST, ROUTES, STATUS_RADIO } from '@config/constant';
import { CheckCircle, Cross } from '@components/icons/icons';
import RadioButton from '@components/radiobutton/radioButton';
import useValidation from '@src/hooks/validations';
import CKEditorComponent from '@components/ckEditor/ckEditor';
import { whiteSpaceRemover } from '@utils/helpers';
import { GET_EMAIL_TEMPLATE_BY_ID } from '@framework/graphql/queries/emailNotificationTemplate';
import { CREATE_EMAIL_TEMPLATE, UPADTE_EMAIL_TEMPLATE } from '@framework/graphql/mutations/emailNotificationTemplate';
import { CreateEmailTemplate } from '@type/emailNotificationTemplate';
import { Loader } from '@components/index';

const AddEditEmailTemplate = (): ReactElement => {
	const { t } = useTranslation();
	const [createEmailTemplate, { loading: createLoader }] = useMutation(CREATE_EMAIL_TEMPLATE);
	const [updateEmailTemplate, { loading: updateLoader }] = useMutation(UPADTE_EMAIL_TEMPLATE);
	const navigate = useNavigate();
	const params = useParams();
	const { data: emailTemplateData, loading } = useQuery(GET_EMAIL_TEMPLATE_BY_ID, {
		variables: { uuid: params.id },
		skip: !params.id,
		fetchPolicy: 'network-only',
	});
	const { addEditEmailTemplateSchema } = useValidation();

	/**
	 * Method used for setvalue from email Template data by id
	 */

	useEffect(() => {
		if (emailTemplateData && params.id) {
			const data = emailTemplateData.getEmailTemplate.data as EmailNotificationTemplateDataArr;
			formik
				.setValues({
					subject: data?.subject,
					content: data?.content,
					templateFor: data?.template_for,
					templateType: data?.template_type,
					status: data?.status,
				})
				.catch((err) => {
					toast.error(err);
				});
		}
	}, [emailTemplateData]);

	const initialValues: CreateEmailTemplate = {
		subject: '',
		content: '',
		templateFor: '',
		templateType: 1,
		status: 1,
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addEditEmailTemplateSchema,
		onSubmit: (values) => {
			if (params.id) {
				updateEmailTemplate({
					variables: {
						uuid: params.id,
						subject: values.subject,
						content: values.content,
						templateFor: values.templateFor,
						templateType: +values.templateType,
						status: +values.status,
					},
				})
					.then((res) => {
						const data = res?.data as UpdateEmailTemplateRes;
						if (data?.updateEmailTemplate?.meta?.statusCode === 200) {
							toast.success(data?.updateEmailTemplate?.meta?.message);
							formik.resetForm();
							onCancelEmailTemplate();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createEmailTemplate({
					variables: {
						subject: values.subject,
						content: values.content,
						templateFor: values.templateFor,
						templateType: +values.templateType,
						status: +values.status,
					},
				})
					.then((res) => {
						const data = res?.data as CreateEmailTemplateRes;
						if (data?.createEmailTemplate?.meta?.statusCode === 201) {
							toast.success(data?.createEmailTemplate?.meta?.message);
							formik.resetForm();
							onCancelEmailTemplate();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});

	//CkEditor onChange Function
	const handleCkeditor = useCallback((e: string) => {
		formik.setFieldValue('content', e);
	}, []);
	/**
	 * On cancle redirect to list view
	 */
	const onCancelEmailTemplate = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.email}/${ROUTES.list}`);
	}, []);
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	return (
		<div className='card'>
			{(createLoader || updateLoader || loading) && <Loader />}
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-title-container'>
						<p>
							{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
						</p>
					</div>
					<div className='card-grid-addedit-page'>
						<TextInput id={'subject'} onBlur={OnBlur} required={true} placeholder={`${t('Subject')} ${t('(English)')}`} name='subject' onChange={formik.handleChange} label={`${t('Subject')} ${t('(English)')}`} value={formik.values.subject} error={formik.errors.subject && formik.touched.subject ? formik.errors.subject : ''} />

						<RadioButton id={'templateType'} required={true} checked={formik.values.templateType} onChange={formik.handleChange} name={'templateType'} radioOptions={EMAIL_TEMPLATE_RADIO_TYPE_LIST} label={t('Template Type')} />

						<CKEditorComponent id='emailTemplateCkEditorContent' value={formik.values.content} onChange={handleCkeditor} label={`${t('Content')} ${t('(English)')}`} error={formik.errors.content && formik.touched.content ? formik.errors.content : ''} required={true} />

						<TextInput id={'templateFor'} onBlur={OnBlur} required={true} placeholder={t('Template For')} name='templateFor' onChange={formik.handleChange} label={t('Template For')} value={formik.values.templateFor} error={formik.errors.templateFor && formik.touched.templateFor ? formik.errors.templateFor : ''} />

						<RadioButton id={'status'} required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning ' label={t('Cancel')} onClick={onCancelEmailTemplate}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEditEmailTemplate;
