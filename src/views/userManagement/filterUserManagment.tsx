import React, { ReactElement, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import Dropdown from '@components/dropdown/dropDown';
import { AccesibilityNames, GENDER_DRP, STATUS_DRP } from '@config/constant';
import { FilterUserProps, UserProps } from '@type/user';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import filterServiceProps from '@components/filter/filter';

const FilterUserManagement = ({ onSearchUser, clearSelectionUserMng, filterData }: UserProps): ReactElement => {
	const { t } = useTranslation();

	const initialValues: FilterUserProps = {
		fullName: '',
		email: '',
		phoneNo: '',
		status: '',
		gender: '',
	};

	/**
	 * Method that sets the filterdata in local storage
	 */
	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterusermangment', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, [filterData]);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionUserMng();
			onSearchUser(values);
		},
	});

	/**
	 * method that reset filter data
	 */
	const onReset = useCallback(() => {
		formik.resetForm();
		onSearchUser(initialValues);
	}, []);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<TextInput id={'fullName'} placeholder={t('Full Name')} name='fullName' type='text' onChange={formik.handleChange} value={formik.values.fullName} />

						<TextInput id={'email'} placeholder={t('Email')} name='email' onChange={formik.handleChange} value={formik.values.email} />

						<Dropdown ariaLabel={AccesibilityNames.Status} placeholder={''} name='status' onChange={formik.handleChange} value={formik.values.status ?? ''} options={STATUS_DRP} id='status' />

						<Dropdown ariaLabel={AccesibilityNames.gender} placeholder={t('Select Gender')} name='gender' onChange={formik.handleChange} value={formik.values.gender ?? ''} options={GENDER_DRP} id='gender' />

						<TextInput id={'phoneNo'} placeholder={t('Phone Number')} name='phoneNo' onChange={formik.handleChange} value={formik.values.phoneNo} />

						<div>
							<div className='flex items-start justify-end col-span-3 btn-group '>
								<Button className='btn-primary ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning ' onClick={onReset} label={t('Reset')}>
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
export default FilterUserManagement;
