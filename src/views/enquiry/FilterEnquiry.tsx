import React, { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import Dropdown from '@components/dropdown/dropDown';
import filterServiceProps from '@components/filter/filter';
import { EnquiryProps, FilterEnquiryProps } from '@type/enquiry';
import { Refresh, Search } from '@components/icons/icons';
import { AccesibilityNames, EnquiryDrpData } from '@config/constant';

const FilterEnquiryPage = ({ onSearchEnquiry, clearSelectionEnquiry, filterData }: EnquiryProps) => {
	const { t } = useTranslation();
	const initialValues: FilterEnquiryProps = {
		name: '',
		email: '',
		status: '',
	};
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionEnquiry();
			onSearchEnquiry(values);
		},
	});
	/**
	 * method that reset filter data
	 */
	const onResetEnquiry = useCallback(() => {
		formik.resetForm();
		onSearchEnquiry(initialValues);
	}, []);

	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterEnquiryManagement', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, []);
	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<TextInput id={'name'} placeholder={t('Name')} name='name' type='text' onChange={formik.handleChange} value={formik.values.name} />

						<TextInput id={'email'} placeholder={t('Email')} name='email' onChange={formik.handleChange} value={formik.values.email} />

						<Dropdown ariaLabel={AccesibilityNames.Status} placeholder={''} name='status' onChange={formik.handleChange} value={formik.values.status ?? ''} options={EnquiryDrpData} id='status' />

						<div className='[.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3'>
							<div className='btn-group col-span-3 flex items-start justify-end '>
								<Button className='btn-primary ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning ' onClick={onResetEnquiry} label={t('Reset')}>
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
export default FilterEnquiryPage;
