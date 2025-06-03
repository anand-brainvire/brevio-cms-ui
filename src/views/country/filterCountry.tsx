import React, { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import { AccesibilityNames, STATUS_DRP } from '@config/constant';
import { useTranslation } from 'react-i18next';
import { CountryProps, FilterCountryProps } from '@type/country';
import DropDown from '@components/dropdown/dropDown';
import filterServiceProps from '@components/filter/filter';

const FilterCountry = ({ onSearchCountry, clearSelectionCountry, filterData }: CountryProps) => {
	const { t } = useTranslation();

	const initialValues: FilterCountryProps = {
		name: '',
		countryCode: '',
		status: '',
		phoneCode: '',
		currencyCode: '',
	};
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionCountry();
			onSearchCountry(values);
		},
	});

	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filtercountry', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, []);
	/**
	 * reset form data
	 */
	const onResetCountry = useCallback(() => {
		formik.resetForm();
		onSearchCountry(initialValues);
	}, []);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<TextInput id={'countryName'} placeholder={t('Country Name')} name='name' type='text' onChange={formik.handleChange} value={formik.values.name} />

						<TextInput id={'countryCode'} placeholder={t('Country Code')} name='countryCode' type='text' onChange={formik.handleChange} value={formik.values.countryCode} />

						<TextInput id={'phoneCode'} placeholder={t('Phone Code')} name='phoneCode' type='text' onChange={formik.handleChange} value={formik.values.phoneCode} />

						<TextInput id={'currencyCode'} placeholder={t('Currency Symbol')} name='currencyCode' type='text' onChange={formik.handleChange} value={formik.values.currencyCode ?? ''} />

						<DropDown ariaLabel={AccesibilityNames.Status} placeholder={''} name='status' onChange={formik.handleChange} value={formik.values.status ?? ''} options={STATUS_DRP} id='status' />

						<div className=' [.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3'>
							<div className='flex  items-start justify-end col-span-3 btn-group '>
								<Button className='btn-primary  ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning  ' onClick={onResetCountry} label={t('Reset')}>
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
export default FilterCountry;
