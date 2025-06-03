import React, { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { CreateCountry } from '@type/country';
import { GET_COUNTRY_BY_ID } from '@framework/graphql/queries/country';
import { useMutation, useQuery } from '@apollo/client';
import { CreateCountryRes, UpdateCountry } from '@framework/graphql/graphql';
import { CREATE_COUNTRY, UPDATE_COUNTRY } from '@framework/graphql/mutations/country';
import { useNavigate, useParams } from 'react-router-dom';
import { DEFAULT_STATUS, ROUTES, STATUS_RADIO } from '@config/constant';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import RadioButton from '@components/radiobutton/radioButton';
import { Loader } from '@components/index';
const AddEditCountry = () => {
	const { t } = useTranslation();
	const params = useParams();
	const {
		data: countryData,
		refetch,
		loading,
	} = useQuery(GET_COUNTRY_BY_ID, {
		fetchPolicy: 'network-only',
		variables: { getCountryId: params.id },
		skip: !params.id,
	});
	const [createCountry] = useMutation(CREATE_COUNTRY);
	const [UpdateCountry] = useMutation(UPDATE_COUNTRY);
	const { addcountryValidationSchema } = useValidation();
	const navigate = useNavigate();

	/**
	 * Method used for get country api with id
	 */
	useEffect(() => {
		if (params.id) {
			refetch({ getCountryId: params.id }).catch((e) => toast.error(e));
		}
	}, [params.id]);

	/**
	 * Method used for setvalue from country data by id
	 */
	useEffect(() => {
		if (countryData && params.id) {
			const data = countryData?.getCountry?.data;
			formik
				.setValues({
					name: data?.name,
					countryCode: data?.country_code,
					status: data?.status,
					phoneCode: data?.phone_code,
					currencyCode: data?.currency_code,
				})
				.catch((e) => toast.error(e));
		}
	}, [countryData]);

	const initialValues: CreateCountry = {
		name: '',
		countryCode: '',
		status: DEFAULT_STATUS,
		phoneCode: '',
		currencyCode: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addcountryValidationSchema,
		onSubmit: (values) => {
			if (params.id) {
				UpdateCountry({
					variables: {
						uuid: params.id,
						name: values?.name.toUpperCase(),
						countryCode: values?.countryCode.toUpperCase(),
						status: +values?.status,
						currencyCode: values?.currencyCode,
						phoneCode: values.phoneCode,
					},
				})
					.then((res) => {
						const data = res.data as UpdateCountry;
						if (data?.updateCountry?.meta?.statusCode === 200) {
							toast.success(data?.updateCountry?.meta.message);
							formik.resetForm();
							onCancelClick();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createCountry({
					variables: {
						name: values?.name.toUpperCase(),
						countryCode: values?.countryCode.toUpperCase(),
						status: +values?.status,
						currencyCode: values?.currencyCode,
						phoneCode: values.phoneCode,
					},
				})
					.then((res) => {
						const data = res.data as CreateCountryRes;
						if (data.createCountry.meta.statusCode === 201) {
							toast.success(data.createCountry.meta.message);
							formik.resetForm();
							onCancelClick();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	/**
	 * On cancle redirect to list view
	 */
	const onCancelClick = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.country}/${ROUTES.list}`);
	}, []);
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
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
							<TextInput className='uppercase' id={'countryName'} onBlur={OnBlur} placeholder={t('Country Name')} name='name' onChange={formik.handleChange} label={t('Country Name')} value={formik.values.name} error={formik.errors.name && formik.touched.name ? formik.errors.name : ''} required={true} />
						</div>

						<div>
							<TextInput className='uppercase' id={'countryCode'} onBlur={OnBlur} placeholder={t('Country Code')} name='countryCode' onChange={formik.handleChange} label={t('Country Code')} value={formik.values.countryCode} error={formik.errors.countryCode && formik.touched.countryCode ? formik.errors.countryCode : ''} required={true} />
						</div>

						<div>
							<TextInput id={'phoneCode'} onBlur={OnBlur} placeholder={t('Phone Code')} name='phoneCode' label={t('Phone Code')} onChange={formik.handleChange} value={formik.values.phoneCode} error={formik.errors.phoneCode && formik.touched.phoneCode ? formik.errors.phoneCode : ''} required={true} />
						</div>

						<div>
							<TextInput id={'currencyCode'} onBlur={OnBlur} placeholder={t('Currency Symbol')} name='currencyCode' onChange={formik.handleChange} label={t('Currency Symbol')} value={formik.values.currencyCode} error={formik.errors.currencyCode && formik.touched.currencyCode ? formik.errors.currencyCode : ''} required={true} />
						</div>
						<RadioButton id={'statusCountry'} required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning  ' label={t('Cancel')} onClick={onCancelClick}>
						<span className='mr-1 w-2.5 h-2.5 inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEditCountry;
