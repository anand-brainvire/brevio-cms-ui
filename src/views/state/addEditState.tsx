import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { CreateState } from '@type/state';
import { FETCH_COUNTRY, GET_STATE_BY_ID } from '@framework/graphql/queries/state';
import { useMutation, useQuery } from '@apollo/client';
import { DropdownOptionType } from '@type/component';
import { CreateStateRes, StateDataArr, UpdateState } from '@framework/graphql/graphql';
import { CREATE_STATE, UPDATE_STATE } from '@framework/graphql/mutations/state';
import { useNavigate, useParams } from 'react-router-dom';
import { IS_ALL, ROUTES, STATUS, STATUS_RADIO } from '@config/constant';
import Dropdown from '@components/dropdown/dropDown';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import Button from '@components/button/button';
import TextInput from '@components/textinput/TextInput';
import { whiteSpaceRemover } from '@utils/helpers';
import RadioButton from '@components/radiobutton/radioButton';
import { Loader } from '@components/index';
const AddEditStateData = () => {
	const { t } = useTranslation();
	const { refetch: fetchCountry } = useQuery(FETCH_COUNTRY, {
		variables: {
			isAll: IS_ALL,
		},
		fetchPolicy: 'network-only',
	});
	const [createState, { loading: createLoader }] = useMutation(CREATE_STATE);
	const [UpdateState, { loading: updateLoader }] = useMutation(UPDATE_STATE);
	const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
	const navigate = useNavigate();
	const params = useParams();
	const {
		data: stateData,
		refetch,
		loading,
	} = useQuery(GET_STATE_BY_ID, {
		fetchPolicy: 'network-only',
		variables: { getStateId: params.id },
		skip: !params.id,
	});
	const { addstateValidationSchema } = useValidation();

	/**
	 * Method used for set state status data array for dropdown
	 */

	useEffect(() => {
		fetchCountry().then((res) => {
			const data = res?.data;
			if (res.data?.fetchCountries?.data) {
				const tempDataArr = [] as DropdownOptionType[];
				data?.fetchCountries?.data?.Countrydata?.map((data: StateDataArr) => {
					tempDataArr.push({ name: data.name, key: data.id });
				});
				setStateDrpData(tempDataArr);
			}
		});
	}, [fetchCountry]);

	/**
	 * Method used for get state api with id
	 */
	useEffect(() => {
		if (params.id) {
			refetch({ getStateId: params.id }).catch((e) => toast.error(e));
		}
	}, [params.id]);

	/**
	 * Method used for setvalue from state data by id
	 */

	useEffect(() => {
		if (stateData && params.id) {
			const data = stateData?.getState?.data;
			formik
				.setValues({
					name: data?.name,
					stateCode: data?.state_code,
					status: data?.status,
					countryId: data?.country_id,
				})
				.catch((e) => toast.error(e));
		}
	}, [stateData]);

	const initialValues: CreateState = {
		name: '',
		stateCode: '',
		status: STATUS.active,
		countryId: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addstateValidationSchema,
		onSubmit: (values) => {
			if (params.id) {
				UpdateState({
					variables: {
						updateStateId: params.id,
						name: values?.name,
						stateCode: values?.stateCode,
						status: +values.status,
						countryId: parseInt(values?.countryId),
					},
				})
					.then((res) => {
						const data = res.data as UpdateState;
						if (data.updateState.meta.statusCode === 200) {
							toast.success(data.updateState.meta.message);
							formik.resetForm();
							onCancelState();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createState({
					variables: {
						name: values?.name,
						stateCode: values?.stateCode,
						status: +values.status,
						countryId: parseInt(values?.countryId),
					},
				})
					.then((res) => {
						const data = res.data as CreateStateRes;
						if (data.createState.meta.statusCode === 201) {
							toast.success(data.createState.meta.message);
							formik.resetForm();
							onCancelState();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	/**
	 * Method that redirect to list page
	 */
	const onCancelState = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.state}/${ROUTES.list}`);
	}, []);
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	return (
		<div className='card'>
			{(loading || createLoader || updateLoader) && <Loader />}
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-title-container'>
						<p>
							{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
						</p>
					</div>

					<div className='md:grid-cols-2 card-grid-addedit-page'>
						<Dropdown placeholder={t('Select Country')} name='countryId' onChange={formik.handleChange} value={formik.values.countryId} options={stateDrpData} id='countryId' label={t('Country Name')} error={formik.errors.countryId && formik.touched.countryId ? formik.errors.countryId : ''} required={true} />

						<div>
							<TextInput id={'stateName'} onBlur={OnBlur} placeholder={t('State Name')} name='name' onChange={formik.handleChange} label={t('State Name')} value={formik.values.name} error={formik.errors.name && formik.touched.name ? formik.errors.name : ''} required={true} />
						</div>
						<div>
							<TextInput id={'stateCode'} onBlur={OnBlur} placeholder={t('State Code')} name='stateCode' onChange={formik.handleChange} label={t('State Code')} value={formik.values.stateCode} error={formik.errors.stateCode && formik.touched.stateCode ? formik.errors.stateCode : ''} required={true} />
						</div>
						<RadioButton id={'statusState'} required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning ' label={t('Cancel')} onClick={onCancelState}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddEditStateData;
