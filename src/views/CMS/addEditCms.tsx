import React, { ReactElement, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { UpdateCms, createCms } from '@framework/graphql/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import { DEFAULT_STATUS, ROUTES, STATUS_RADIO } from '@config/constant';
import { CreateCms } from '@type/cms';
import { CREATE_CMS, GET_CMS_BY_ID, UPDATE_CMS } from '@framework/graphql/mutations/cms';
import { CheckCircle, Cross } from '@components/icons/icons';
import RadioButton from '@components/radiobutton/radioButton';
import useValidation from '@src/hooks/validations';
import CKEditorComponent from '@components/ckEditor/ckEditor';
import { whiteSpaceRemover } from '@utils/helpers';
import { Loader } from '@components/index';

const AddEditCms = (): ReactElement => {
	const { t } = useTranslation();
	const [createCms, { loading: createLoader }] = useMutation(CREATE_CMS);
	const [updateCmsData, { loading: updateLoader }] = useMutation(UPDATE_CMS);
	const navigate = useNavigate();
	const params = useParams();
	const { data: cmsData, loading } = useQuery(GET_CMS_BY_ID, {
		variables: { uuid: params.id },
		skip: !params.id,
		fetchPolicy: 'network-only',
	});
	const { addEditCmsValidationSchema } = useValidation();
	/**
	 * Method used for setvalue from cms data by id
	 */
	useEffect(() => {
		if (cmsData && params.id) {
			const data = cmsData.getSingleCMS.data;
			formik
				.setValues({
					titleEnglish: data?.title_english,
					descriptionEnglish: data?.description_english,
					metaTitleEnglish: data?.meta_title_english,
					metaDescriptionEnglish: data?.meta_description_english,
					status: +data?.status,
				})
				.catch((err) => {
					toast.error(err);
				});
		}
	}, [cmsData]);

	const initialValues: CreateCms = {
		titleEnglish: '',
		descriptionEnglish: '',
		metaTitleEnglish: '',
		metaDescriptionEnglish: '',
		status: DEFAULT_STATUS,
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addEditCmsValidationSchema,

		onSubmit: (values) => {
			if (values.descriptionEnglish == '<p><br></p>' || values.descriptionEnglish == '<p></p>') {
				toast.error('please enter description');
			} else if (params.id) {
				updateCmsData({
					variables: {
						uuid: params.id,
						titleEnglish: values.titleEnglish,
						descriptionEnglish: values.descriptionEnglish,
						metaTitleEnglish: values.metaTitleEnglish,
						metaDescriptionEnglish: values.metaDescriptionEnglish,
						status: +values.status,
					},
				})
					.then((res) => {
						const data = res?.data as UpdateCms;
						if (data?.updateCMS?.meta?.statusCode === 200 || data?.updateCMS?.meta?.statusCode === 201) {
							toast.success(data.updateCMS.meta.message);
							formik.resetForm();
							onCancelCms();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createCms({
					variables: {
						titleEnglish: values.titleEnglish,
						descriptionEnglish: values.descriptionEnglish,
						metaTitleEnglish: values.metaTitleEnglish,
						metaDescriptionEnglish: values.metaDescriptionEnglish,
						status: +values.status,
					},
				})
					.then((res) => {
						const data = res.data as createCms;
						if (data.createCMS.meta.statusCode === 201) {
							toast.success(data.createCMS.meta.message);
							formik.resetForm();
							onCancelCms();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	const handleCkeditor = useCallback((e: string) => {
		formik.setFieldValue('descriptionEnglish', e);
	}, []);
	/**
	 * On cancle redirect to list view
	 */
	const onCancelCms = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.CMS}/${ROUTES.list}`);
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
						<div>
							<TextInput id={'titleEnglish'} onBlur={OnBlur} required={true} placeholder={t('Content Page Title')} name='titleEnglish' onChange={formik.handleChange} label={t('Content Page Title (English)')} value={formik.values.titleEnglish} error={formik.errors.titleEnglish && formik.touched.titleEnglish ? formik.errors.titleEnglish : ''} />
						</div>

						<CKEditorComponent id='cmsCkEditorDescription' value={formik.values.descriptionEnglish} onChange={handleCkeditor} label={`${t('Description')} ${t('English')}`} error={formik.errors.descriptionEnglish && formik.touched.descriptionEnglish ? formik.errors.descriptionEnglish : ''} required={true} />

						<div>
							<TextInput id={'metaTitleEnglish'} onBlur={OnBlur} required={true} placeholder={t('Meta Title')} name='metaTitleEnglish' onChange={formik.handleChange} label={t('Meta Title (English)')} value={formik.values.metaTitleEnglish} error={formik.errors.metaTitleEnglish && formik.touched.metaTitleEnglish ? formik.errors.metaTitleEnglish : ''} />
						</div>
						<div>
							<TextInput id={'metaDescriptionEnglish'} onBlur={OnBlur} required={true} placeholder={t('Meta Description')} name='metaDescriptionEnglish' onChange={formik.handleChange} label={t('Meta Description (English)')} value={formik.values.metaDescriptionEnglish} error={formik.errors.metaDescriptionEnglish && formik.touched.metaDescriptionEnglish ? formik.errors.metaDescriptionEnglish : ''} />
						</div>
						<RadioButton id={'status'} required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning ' label={t('Cancel')} onClick={onCancelCms}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEditCms;
