import { useMutation, useQuery } from '@apollo/client';
import { PLAN_MANAGEMENT_ISRECOMMENDED_OPTIONS, PLAN_MANAGEMENT_STATUS_OPTIONS, PLAN_MANAGEMENT_TYPE_OPTIONS, ROUTES } from '@config/constant';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useValidation from '@src/hooks/validations';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { CheckCircle, Cross } from '@components/icons/icons';
import RadioButton from '@components/radiobutton/radioButton';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
import { Loader } from '@components/index';
import { CreatePlanManagementProps } from '@type/planManagement';
import { GET_PLAN_MANAGEMENT } from '@framework/graphql/queries/planManagement';
import { CREATE_PLAN_MANAGEMENT, UPDATE_PLAN_MANAGEMENT } from '@framework/graphql/mutations/planManagement';
import { whiteSpaceRemover } from '@utils/helpers';
const AddEditPlanManagement = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const paramsId = useParams();
	const { refetch, loading } = useQuery(GET_PLAN_MANAGEMENT, { skip: true });
	const [createPlan, { loading: createLoader }] = useMutation(CREATE_PLAN_MANAGEMENT);
	const [updatePlan, { loading: updateLoader }] = useMutation(UPDATE_PLAN_MANAGEMENT);
	const { planManagementValidationSchema } = useValidation();
	const initialValues: CreatePlanManagementProps = {
		name: '',
		description: '',
		type: 'yearly',
		price: '',
		isRecommended: 'true',
		status: '1',
	};

	// while edit time it sets the data to form
	const dataAllocationFunction = useCallback((paramsId: string) => {
		if (paramsId) {
			refetch({ uuid: paramsId })
				.then((res) => {
					if (res?.data?.getPlanManagement?.meta?.statusCode === 200) {
						const data = res?.data?.getPlanManagement?.data;

						formik
							.setValues({
								name: data?.name,
								description: data?.description,
								type: data?.type,
								price: data?.price,
								isRecommended: data?.is_recommended.toString(),
								status: data?.status,
							})
							.catch((err) => {
								toast.error(err);
							});
					}
				})
				.catch(() => {
					return;
				});
		}
	}, []);

	/**
	 * Method used for get Plan api with id
	 */
	useEffect(() => {
		if (paramsId?.id) {
			dataAllocationFunction(paramsId?.id);
		}
	}, []);

	const formik = useFormik({
		initialValues,
		validationSchema: planManagementValidationSchema,
		onSubmit: (values) => {
			const commonValues = {
				name: values.name,
				description: values.description,
				type: values.type,
				price: +values?.price,
				isRecommended: Boolean(values.isRecommended),
				status: +values.status,
			};
			if (paramsId.id) {
				updatePlan({
					variables: {
						uuid: paramsId.id,
						...commonValues,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data?.updatePlanManagement.meta.statusCode === 200) {
							toast.success(data.updatePlanManagement.meta.message);
							formik.resetForm();
							onCancel();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createPlan({
					variables: {
						...commonValues,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data.createPlanManagement.meta.statusCode === 201) {
							toast.success(data.createPlanManagement.meta.message);
							formik.resetForm();
							onCancel();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.planManagement}/${ROUTES.list}`);
	}, []);

	const getErrorPlan = (fieldName: keyof CreatePlanManagementProps) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlurCpn = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	return (
		<div className='card'>
			{(loading || createLoader || updateLoader) && <Loader />}
			<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
				<form onSubmit={formik.handleSubmit}>
					<div className='card-body'>
						<div className='card-title-container'>
							<p>
								{t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
							</p>
						</div>
						<div className='card-grid-addedit-page md:grid-cols-2'>
							<div>
								<TextInput id={'planName'} required={true} placeholder={t('Plan Name')} name='name' onChange={formik.handleChange} onBlur={OnBlurCpn} label={t('Plan Name')} value={formik.values.name} error={getErrorPlan('name')} />
							</div>
							<div>
								<TextInput id={'description'} required={true} placeholder={t('Plan Description')} name='description' onChange={formik.handleChange} onBlur={OnBlurCpn} label={t('Plan Description')} value={formik.values.description} error={getErrorPlan('description')} />
							</div>
							<div>
								<TextInput id={'price'} required={true} placeholder={t('Plan Price')} name='price' onChange={formik.handleChange} onBlur={OnBlurCpn} label={t('Plan Price')} value={formik.values.price} error={getErrorPlan('price')} />
							</div>
							<RadioButton id={'type'} checked={formik.values.type} onChange={formik.handleChange} name={'type'} radioOptions={PLAN_MANAGEMENT_TYPE_OPTIONS} label={t(' Plan Type')} required={true} error={formik.errors.type && formik.touched.type ? formik.errors.type : ''} />
							<RadioButton id={'isRecommended'} checked={formik.values.isRecommended} onChange={formik.handleChange} name={'isRecommended'} radioOptions={PLAN_MANAGEMENT_ISRECOMMENDED_OPTIONS} label={t('Is Recommended Plan')} required={true} error={formik.errors.isRecommended && formik.touched.isRecommended ? formik.errors.isRecommended : ''} />
							<RadioButton id={'status'} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={PLAN_MANAGEMENT_STATUS_OPTIONS} label={t(' Plan status')} required={true} error={formik.errors.status && formik.touched.status ? formik.errors.status : ''} />
						</div>
					</div>
					<div className='card-footer btn-group'>
						<Button className='btn-primary ' type='submit' label={paramsId?.id ? t('Update') : t('Save')}>
							<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
								<CheckCircle />
							</span>
						</Button>
						<Button className='btn-warning ' label={t('Cancel')} onClick={onCancel}>
							<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
				</form>
			</WithTranslateFormErrors>
		</div>
	);
};
export default AddEditPlanManagement;
