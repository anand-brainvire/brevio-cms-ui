import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { GET_CITY_BY_ID } from '@framework/graphql/queries/city';
import { useMutation, useQuery } from '@apollo/client';
import { DropdownOptionType } from '@type/component';
import { CreateCityRes, StateDataArr, UpdateCity } from '@framework/graphql/graphql';
import { CREATE_CITY, UPDATE_CITY } from '@framework/graphql/mutations/city';
import { useNavigate, useParams } from 'react-router-dom';
import { IS_ALL, ROUTES, STATUS, STATUS_RADIO } from '@config/constant';
import useValidation from '@src/hooks/validations';
import Dropdown from '@components/dropdown/dropDown';
import { FETCH_COUNTRY, GET_STATE } from '@framework/graphql/queries/state';
import { CreateCity } from '@type/city';
import { CheckCircle, Cross } from '@components/icons/icons';
import { whiteSpaceRemover } from '@utils/helpers';
import RadioButton from '@components/radiobutton/radioButton';
const AddEditCity = () => {
	const { t } = useTranslation();
	const { refetch: fetchCountries } = useQuery(FETCH_COUNTRY, { skip: true, fetchPolicy: 'network-only' });
	const { refetch: fetchStates } = useQuery(GET_STATE, { skip: true, fetchPolicy: 'network-only' });
	const { refetch } = useQuery(GET_CITY_BY_ID, { skip: true, fetchPolicy: 'network-only' });
	const [createCity] = useMutation(CREATE_CITY);
	const [updateCity] = useMutation(UPDATE_CITY);
	const [countryDrpData, setCountryDrpData] = useState<DropdownOptionType[]>([]);
	const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
	const navigate = useNavigate();
	const params = useParams();
	const { addcityValidationSchema } = useValidation();
	/**
	 * Method used for set country status data array for dropdown
	 */
	useEffect(() => {
		fetchCountries({ isAll: IS_ALL, status: STATUS.inactive }).then((res) => {
			const countryData = res?.data?.fetchCountries;
			if (countryData?.meta?.statusCode === 200) {
				const countryDropDownData = countryData?.data?.Countrydata?.map((data: StateDataArr) => {
					return { name: data.name, key: data.id };
				});

				setCountryDrpData(countryDropDownData);
			}
		});
	}, []);
	/**
	 * Method used for get city api with id
	 */
	useEffect(() => {
		if (params?.id) {
			refetch({ uuid: params?.id })
				.then((res) => {
					const cityData = res?.data?.getCity;
					if (cityData?.meta?.statusCode === 200) {
						formik
							.setValues({
								cityName: cityData?.data?.city_name,
								countryId: cityData?.data?.country_id,
								stateId: cityData?.data?.state_id,
								status: cityData?.data?.status,
							})
							.catch((e) => toast.error(e));
					}
				})
				.catch(() => {
					return;
				});
		}
	}, [params.id]);

	const initialValues: CreateCity = {
		cityName: '',
		countryId: '',
		status: STATUS.active,
		stateId: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addcityValidationSchema,
		onSubmit: (values) => {
			if (params?.id) {
				updateCity({
					variables: {
						uuid: params?.id,
						cityName: values?.cityName,
						countryId: +values?.countryId,
						status: +values.status,
						stateId: parseInt(values?.stateId),
					},
				})
					.then((res) => {
						const data = res?.data as UpdateCity;
						if (data?.updateCity?.meta?.statusCode === 200) {
							toast.success(data?.updateCity?.meta?.message);
							formik.resetForm();
							onCancelCity();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createCity({
					variables: {
						cityName: values?.cityName,
						countryId: parseInt(values?.countryId),
						status: +values?.status,
						stateId: parseInt(values?.stateId),
					},
				})
					.then((res) => {
						const data = res?.data as CreateCityRes;
						if (data?.createCity?.meta?.statusCode === 200) {
							toast.success(data?.createCity?.meta?.message);
							formik.resetForm();
							onCancelCity();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	/**
	 * Method that fetch's states data only after getting country data
	 */
	useEffect(() => {
		if (formik.values.countryId) {
			fetchStates({ countryId: +formik.values.countryId, status: STATUS.active }).then((res) => {
				if (res?.data?.fetchStates?.meta?.statusCode === 200) {
					const statesData = res?.data?.fetchStates?.data?.Statedata?.map((data: StateDataArr) => {
						return { name: data?.name, key: data?.id };
					});

					setStateDrpData(statesData);
				} else if (res?.data?.fetchStates?.meta?.statusCode === 204) {
					setStateDrpData([]);
				}
			});
		}
	}, [formik.values.countryId]);
	/**
	 * On cancle redirect to list view
	 */
	const onCancelCity = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.city}/${ROUTES.list}`);
	}, []);
	/**
	 * Handle blur that removes white space's
	 */
	const onBlurCity = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-title-container'>
						<p>
							{t('Fields markes with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
						</p>
					</div>

					<div className={`md:grid-cols-2 card-grid-addedit-page ${!formik.values.countryId || !stateDrpData.length} `}>
						<Dropdown placeholder={t('Select Country')} name='countryId' onChange={formik.handleChange} value={formik.values.countryId} options={countryDrpData} id='countryId' label={t('Select Country')} error={formik.errors.countryId && formik.touched.countryId ? formik.errors.countryId : ''} required={true} />

						<Dropdown placeholder={t('Select State')} disabled={!formik.values.countryId && !stateDrpData.length} name='stateId' onChange={formik.handleChange} value={formik.values.stateId} options={stateDrpData} id='stateId' label={'State Name'} error={formik.errors.stateId && formik.touched.stateId ? formik.errors.stateId : ''} required={true} />

						<div>
							<TextInput id={'cityName'} onBlur={onBlurCity} placeholder={t('City Name')} name='cityName' onChange={formik.handleChange} label={t('City Name')} value={formik.values.cityName} error={formik.errors.cityName && formik.touched.cityName ? formik.errors.cityName : ''} required={true} />
						</div>
						<RadioButton id={'statusCity'} required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning ' label={t('Cancel')} onClick={onCancelCity}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEditCity;
