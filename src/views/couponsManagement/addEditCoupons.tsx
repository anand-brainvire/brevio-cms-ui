import { useMutation, useQuery } from '@apollo/client';
import { APPLICABLE, COUPON_RADIO_APPLICABLE_OPTIONS, COUPON_RADIO_IS_REUSABLE_OPTIONS, COUPON_RADIO_OPTION_COUPON_TYPE, DATE_FORMAT, DEFAULT_OFFERTYPE, IS_ALL, OFFER_TYPE, OFFER_USAGE, ROUTES } from '@config/constant';
import { CreateCoupon, UpdateCoupon, UserData } from '@framework/graphql/graphql';
import { CREATE_COUPON, UPDATE_COUPON } from '@framework/graphql/mutations/couponManagement';
import { GET_COUPON_BY_ID } from '@framework/graphql/queries/couponManagement';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateUpdateCouponProps, GetCouponRes, UsersDataStructureType } from '@type/couponManagement';
import useValidation from '@src/hooks/validations';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import { GET_USER } from '@framework/graphql/queries/user';
import Button from '@components/button/button';
import { CheckCircle, Cross } from '@components/icons/icons';
import RadioButton from '@components/radiobutton/radioButton';
import { getDateFromat, whiteSpaceRemover } from '@utils/helpers';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
import DatePicker from '@components/datapicker/datePicker';
import { Loader } from '@components/index';
const AddEditCoupons = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const CouponId = useParams();
	const { refetch: fetchUsers, loading } = useQuery(GET_USER, { variables: { isAll: IS_ALL } });
	const { refetch, loading: couponLoader } = useQuery(GET_COUPON_BY_ID, { skip: true });
	const [createCoupon, { loading: createLoader }] = useMutation(CREATE_COUPON);
	const [updateCoupon, { loading: updateLoader }] = useMutation(UPDATE_COUPON);
	const { addCoupenValidationSchema } = useValidation();
	const initialValues: CreateUpdateCouponProps = {
		offerName: '',
		offerCode: '',
		startDate: undefined,
		endDate: undefined,
		value: undefined,
		offerType: DEFAULT_OFFERTYPE,
		offerUsage: '',
		applicable: '',
	};
	const [options, setOptions] = useState<UsersDataStructureType[]>([]);
	const [selected, setSelected] = useState<UsersDataStructureType[]>([]);

	// function to get selected data
	const getSelected = (data: string[], options: UsersDataStructureType[]) => {
		const selected: UsersDataStructureType[] = [];
		data.forEach((element: string) => {
			options.forEach((singleUserData: UsersDataStructureType) => {
				if (element === singleUserData.code) {
					selected.push(singleUserData);
				}
			});
		});
		return selected;
	};
	// while edit time it sets the data to form
	const dataAllocationFunction = useCallback((CouponId: string, options: UsersDataStructureType[]) => {
		if (CouponId) {
			refetch({ uuid: CouponId })
				.then((res) => {
					if (res?.data?.getOffer?.meta?.statusCode === 200) {
						const data = res?.data?.getOffer?.data as GetCouponRes;
						if (data.applicable === 0) {
							setSelected(options);
						} else {
							const selected = getSelected(data.selected_users, options);
							selected && setSelected(selected);
						}

						formik
							.setValues({
								offerName: data?.offer_name,
								offerCode: data?.offer_code,
								startDate: new Date(getDateFromat(data?.start_date, DATE_FORMAT.simpleDateFormat)),
								endDate: new Date(getDateFromat(data?.end_date, DATE_FORMAT.simpleDateFormat)),
								value: data?.value,
								offerType: JSON.stringify(data?.offer_type),
								offerUsage: JSON.stringify(data?.offer_usage),
								applicable: JSON.stringify(data?.applicable),
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
	 * Method used for get coupon api with id
	 */
	useEffect(() => {
		fetchUsers().then((res) => {
			const data = res?.data?.fetchUsers?.data;
			const setOption: UsersDataStructureType[] = data?.userList?.map((mappedUserSet: UserData) => {
				return { name: mappedUserSet?.first_name, code: mappedUserSet?.uuid };
			});
			setOptions(setOption);
			if (CouponId?.id && setOption.length) {
				dataAllocationFunction(CouponId?.id, setOption);
			}
		});
	}, []);
	//update coupon function
	function UpdateCoupon(variables: CreateUpdateCouponProps, id: string) {
		if (selected.length !== 0) {
			updateCoupon({
				variables: {
					uuid: id,
					...variables,
				},
			})
				.then((res) => {
					const data = res?.data as UpdateCoupon;
					if (data?.updateOffer?.meta?.statusCode === 200) {
						toast.success(data?.updateOffer?.meta?.message);

						navigate(`/${ROUTES.app}/${ROUTES.manageOffer}/${ROUTES.list}`);
						formik.resetForm();
						onCancel();
					}
				})
				.catch(() => {
					return;
				});
		}
	}

	// create coupon function
	function CreateCoupon(variables: CreateUpdateCouponProps) {
		if (selected.length !== 0) {
			createCoupon({
				variables: {
					...variables,
				},
			})
				.then((res) => {
					const data = res?.data as CreateCoupon;
					if (data?.createOffer?.meta?.statusCode === 200) {
						toast.success(data?.createOffer?.meta?.message);
						navigate(`/${ROUTES.app}/${ROUTES.manageOffer}/list`);
						formik.resetForm();
					}
				})
				.catch(() => {
					return;
				});
		}
	}

	const formik = useFormik({
		initialValues,
		validationSchema: addCoupenValidationSchema,
		onSubmit: (values) => {
			const variables = {
				offerName: values.offerName,
				offerCode: values.offerCode,
				offerType: values.offerType === DEFAULT_OFFERTYPE ? OFFER_TYPE.percentage : OFFER_TYPE.amount,

				startDate: getDateFromat(values.startDate?.toString(), DATE_FORMAT.simpleDateFormat),
				endDate: getDateFromat(values.endDate?.toString(), DATE_FORMAT.simpleDateFormat),
				value: values.value !== undefined ? +values.value : values.value,
				applicable: values.applicable === DEFAULT_OFFERTYPE ? APPLICABLE.all : APPLICABLE.selectedUser,
				selectedUsers: values.applicable === DEFAULT_OFFERTYPE ? null : selected.map((mappedSelecterUser) => mappedSelecterUser.code),
				offerUsage: values.offerUsage === DEFAULT_OFFERTYPE ? OFFER_USAGE.oneTime : OFFER_USAGE.multipleTime,
			};
			CouponId?.id ? UpdateCoupon(variables, CouponId?.id) : CreateCoupon(variables);
		},
	});
	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.manageOffer}/${ROUTES.list}`);
	}, []);
	/**
	 * Method that selects all the users if its value is '0'
	 */
	useEffect(() => {
		if (formik.values.applicable === DEFAULT_OFFERTYPE && options) {
			const data = options?.map((mappedoUserDataStructure: UsersDataStructureType) => {
				return mappedoUserDataStructure;
			});
			setSelected(data);
		}
	}, [formik.values.applicable, CouponId]);

	const getErrorCoupon = (fieldName: keyof CreateUpdateCouponProps) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};
	/**
	 * Handle's multi select dropdown
	 * @param e
	 */
	const OnChangeCpnAdEd = (e: MultiSelectChangeEvent) => {
		setSelected(e.value);
	};
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlurCpn = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	return (
		<div className='card'>
			{(loading || couponLoader || createLoader || updateLoader) && <Loader />}
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
								<TextInput id={'offerName'} required={true} placeholder={t('Offer Name')} name='offerName' onChange={formik.handleChange} onBlur={OnBlurCpn} label={t('Offer Name')} value={formik.values.offerName} error={getErrorCoupon('offerName')} />
							</div>
							<div>
								<TextInput id={'offerCode'} required={true} placeholder={t('Offer Code')} name='offerCode' onChange={formik.handleChange} onBlur={OnBlurCpn} label={t('Offer Code')} value={formik.values.offerCode} error={getErrorCoupon('offerCode')} />
							</div>
							<RadioButton id={'offerType'} checked={formik.values.offerType} onChange={formik.handleChange} name={'offerType'} radioOptions={COUPON_RADIO_OPTION_COUPON_TYPE} label={t('Type')} required={true} error={formik.errors.offerType && formik.touched.offerType ? formik.errors.offerType : ''} />
							<div>
								<TextInput id={'value'} type='text' placeholder={t('Value')} name={'value'} onChange={formik.handleChange} label={formik.values.offerType === '0' ? `${t('Value')}(%)` : t('Value')} maxLength={formik.values.offerType !== '0' ? 12 : undefined} value={formik.values.value} error={getErrorCoupon('value')} />
							</div>

							<DatePicker required={true} id='startDate' placeholder={t('Start Date') ?? ''} name='startDate' onChange={formik.handleChange} label={t('Start Date')} value={formik.values.startDate} error={getErrorCoupon('startDate')} min={CouponId.id ? new Date(getDateFromat(formik.values.startDate as string, DATE_FORMAT.simpleDateFormat)) : new Date()} disabled={!!CouponId.id} />

							<DatePicker required={true} id='endDate' placeholder={t('End Date') ?? ''} name='endDate' onChange={formik.handleChange} label={t('End Date')} value={formik.values.endDate} error={formik.values.startDate && getErrorCoupon('endDate')} min={CouponId.id ? new Date(getDateFromat(formik.values.endDate as string, DATE_FORMAT.simpleDateFormat)) : new Date()} />

							<RadioButton id='offerUsage' required={true} checked={formik.values.offerUsage === '' ? '2' : formik.values.offerUsage} onChange={formik.handleChange} name={'offerUsage'} radioOptions={COUPON_RADIO_IS_REUSABLE_OPTIONS} label={t('Usage')} error={getErrorCoupon('offerUsage')} />

							<RadioButton id='applicable' required={true} checked={formik.values.applicable === '' ? '2' : formik.values.applicable} onChange={formik.handleChange} name={'applicable'} radioOptions={COUPON_RADIO_APPLICABLE_OPTIONS} label={t('Applicable')} error={getErrorCoupon('applicable')} />

							{formik.values.applicable === '1' && (
								<div>
									<label htmlFor='selectedUsers' className='ml-1 text-gray-700'>
										{t('Selected users')} <span className='text-red-500  '>*</span>
									</label>
									<div className='mt-3'>
										<MultiSelect id='selectedUsers' value={selected} onChange={OnChangeCpnAdEd} options={options} optionLabel='name' display='chip' placeholder={`${t('Select user')}`} maxSelectedLabels={10} className='w-full md:w-20rem ' filter />
									</div>
									{formik.values.applicable === '1' && formik.touched.applicable && selected?.length === 0 && <p className='text-red-500'>{t('Please select alteast one user')}</p>}
								</div>
							)}
						</div>
					</div>
					<div className='card-footer btn-group'>
						<Button className='btn-primary ' type='submit' label={CouponId?.id ? t('Update') : t('Save')}>
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
export default AddEditCoupons;
