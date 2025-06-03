import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { StateDataArrList } from '@framework/graphql/graphql';
import { FETCH_COUNTRY } from '@framework/graphql/queries/state';
import { useTranslation } from 'react-i18next';
import { DropdownOptionType } from '@type/component';
import { StateProps, FilterStateProps } from '@type/state';

import DropDown from '@components/dropdown/dropDown';
import { AccesibilityNames, IS_ALL, STATUS, STATUS_DRP } from '@config/constant';
import filterServiceProps from '@components/filter/filter';

const FilterStateList = ({ onSearchState, clearSelectionState, filterData }: StateProps) => {
	const { t } = useTranslation();
	const { data } = useQuery(FETCH_COUNTRY, {
		fetchPolicy: 'network-only',
		variables: {
			isAll: IS_ALL,
		},
	});
	const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);

	const initialValues: FilterStateProps = {
		name: '',
		stateCode: '',
		status: '',
		countryId: '',
	};
	/**
	 * Method that sets filter data in local storage
	 */
	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterstate', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, [filterData]);

	/**
	 * Method used for set state dropdown array
	 */
	useEffect(() => {
		if (data?.fetchCountries) {
			const tempDataArr = [] as DropdownOptionType[];
			data?.fetchCountries?.data?.Countrydata?.map((data: StateDataArrList) => {
				if (Number(data?.status) === STATUS.active) {
					tempDataArr.push({ name: data.name, key: data.id });
				}
			});
			setStateDrpData(tempDataArr);
		}
	}, [data?.fetchCountries]);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionState();
			onSearchState(values);
		},
	});
	/**
	 * method that reset filter data
	 */
	const onResetState = useCallback(() => {
		formik.resetForm();
		onSearchState(initialValues);
	}, []);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<TextInput id={'stateName'} placeholder={t('State Name')} name='name' type='text' onChange={formik.handleChange} value={formik.values.name} />

						<TextInput id={'stateCode'} placeholder={t('State Code')} name='stateCode' type='text' onChange={formik.handleChange} value={formik.values.stateCode} />

						<DropDown ariaLabel={AccesibilityNames.countryId} placeholder={t('Select Country')} name='countryId' onChange={formik.handleChange} value={formik.values.countryId ?? ''} options={stateDrpData} id='countryId' />

						<DropDown ariaLabel={AccesibilityNames.Status} placeholder={''} name='status' onChange={formik.handleChange} value={formik.values.status ?? ''} options={STATUS_DRP} id='status' />

						<div className=' md:col-span-2'>
							<div className='flex  items-start justify-end btn-group '>
								<Button className='btn-primary  ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning  ' onClick={onResetState} label={t('Reset')}>
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
export default FilterStateList;
