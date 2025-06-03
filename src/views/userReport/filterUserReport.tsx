import React, { ReactElement, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { Refresh, Search } from '@components/icons/icons';
import { FilterUserReportProps, UserReportProps } from '@type/userReport';
import filterServiceProps from '@components/filter/filter';

const FilterUserReport = ({ onSearchUserReport, filterData }: UserReportProps): ReactElement => {
	const { t } = useTranslation();
	const initialValues: FilterUserReportProps = {
		search: '',
	};
	/**
	 * Method that sets the filterdata in localstorage
	 */
	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterUserReport', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, [filterData]);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			onSearchUserReport(values);
		},
	});

	/**
	 * method that reset filter data
	 */
	const onResetUserReport = useCallback(() => {
		formik.resetForm();
		onSearchUserReport(initialValues);
	}, []);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<TextInput id={'search'} placeholder={t('User Name/ Reported By')} name='search' type='text' onChange={formik.handleChange} value={formik.values.search} />
						<div className='[.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3'>
							<div className='btn-group col-span-3 flex items-start justify-end '>
								<Button className='btn-primary ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning ' onClick={onResetUserReport} label={t('Reset')}>
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
export default FilterUserReport;
