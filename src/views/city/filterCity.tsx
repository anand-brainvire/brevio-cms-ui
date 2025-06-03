import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { StateDataArr } from '@framework/graphql/graphql';
import { FETCH_COUNTRY, GET_STATE } from '@framework/graphql/queries/state';
import { useTranslation } from 'react-i18next';
import { CityProps, FilterCityProps } from '@type/city';
import { DropdownOptionType } from '@type/component';
import DropDown from '@components/dropdown/dropDown';
import { AccesibilityNames, IS_ALL, STATUS_DRP } from '@config/constant';
import filterServiceProps from '@components/filter/filter';
const FilterCity = ({ onSearchCity, clearSelectionCity, filterData }: CityProps) => {
	const { t } = useTranslation();
	const { refetch: fetchCountries } = useQuery(FETCH_COUNTRY, { skip: true, fetchPolicy: 'network-only' });
	const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
	const [countryDrpData, setCountryDrpData] = useState<DropdownOptionType[]>([]);
	const { refetch: fetchStates } = useQuery(GET_STATE, { fetchPolicy: 'network-only' });
	const initialValues: FilterCityProps = {
		cityName: '',
		stateId: '',
		status: '',
		state: {
			countryId: '',
		},
		countryId: '',
	};
	/**
	 * Method that sets filters data in local storage
	 */
	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterCity', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);

		fetchCountries({ status: 0, isAll: IS_ALL }).then((res) => {
			const countryData = res?.data?.fetchCountries?.data?.Countrydata?.map((data: StateDataArr) => {
				return { name: data?.name, key: data?.id };
			});
			setCountryDrpData(countryData);
		});
	}, []);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionCity();
			onSearchCity(values);
		},
	});
	/**
	 * Method used for set state data array for dropdown
	 */
	useEffect(() => {
		if (formik.values.countryId) {
			fetchStates({ countryId: +formik.values.countryId, status: 0 })
				.then((res) => {
					if (res?.data?.fetchStates?.meta?.statusCode === 200) {
						const statesData = res?.data?.fetchStates?.data?.Statedata?.map((data: StateDataArr) => {
							return { name: data?.name, key: data?.id };
						});

						setStateDrpData(statesData);
					} else if (res?.data?.fetchStates?.meta?.statusCode === 204) {
						setStateDrpData([]);
					} else {
						setStateDrpData([]);
					}
				})
				.catch(() => {
					return;
				});
		}
	}, [formik.values.countryId]);
	/**
	 * reset the form data
	 */
	const onResetCity = useCallback(() => {
		formik.resetForm();
		onSearchCity(initialValues);
	}, []);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<TextInput id={'cityName'} placeholder={t('City Name')} name='cityName' type='text' onChange={formik.handleChange} value={formik.values.cityName} />

						<DropDown ariaLabel={AccesibilityNames.countryId} placeholder={t('Select Country')} name='countryId' onChange={formik.handleChange} value={formik.values.countryId ?? ''} options={countryDrpData} id='countryId' />

						<DropDown ariaLabel={AccesibilityNames.stateId} placeholder={t('Select State')} name='stateId' onChange={formik.handleChange} value={formik.values.stateId ?? ''} options={stateDrpData} id='stateId' disabled={!formik.values.countryId} />

						<DropDown ariaLabel={AccesibilityNames.Status} placeholder={''} name='status' onChange={formik.handleChange} value={formik.values.status ?? ''} options={STATUS_DRP} id='status' />

						<div className='md:col-span-2'>
							<div className='flex items-start justify-end col-span-3 btn-group  '>
								<Button className='btn-primary ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning ' onClick={onResetCity} label={t('Reset')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Refresh />
									</span>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};
export default FilterCity;
