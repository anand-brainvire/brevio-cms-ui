import { FilterPlanManagementProps, PlanManagementPropsProps } from '@type/planManagement';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import filterServiceProps from '@components/filter/filter';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import DropDown from '@components/dropdown/dropDown';
import { AccesibilityNames, PLAN_MANAGEMENT_TYPE_DRPDOWN, STATUS_DRP } from '@config/constant';

const FilterPlanManagement = ({ onClearPlanManagement, onSearchPlan, filterData }: PlanManagementPropsProps) => {
	const { t } = useTranslation();
	const initialValues: FilterPlanManagementProps = {
		price: '',
		status: '',
		type: '',
	};
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			onSearchPlan(values);
			onClearPlanManagement();
		},
	});

	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterPlanManagement', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, []);
	/**
	 * method that reset filter data
	 */
	const onResetPlanManagement = () => {
		formik.resetForm();
		onSearchPlan(initialValues);
	};
	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter '>
						<div className='lg:col-span-1'>
							<TextInput type='string' id='price' name='price' value={formik.values.price ? formik.values.price : ''} placeholder={t('Plan Price')} onChange={formik.handleChange} />
						</div>
						<DropDown ariaLabel={AccesibilityNames.planType} placeholder={''} name='type' onChange={formik.handleChange} value={formik.values.type} options={PLAN_MANAGEMENT_TYPE_DRPDOWN} id='type' />
						<DropDown ariaLabel={AccesibilityNames.Status} placeholder={''} name='status' onChange={formik.handleChange} value={formik.values.status ?? ''} options={STATUS_DRP} id='status' />
						<div className='[.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3'>
							<div className='btn-group col-span-3 flex items-start justify-end '>
								<Button className='btn-primary ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning ' onClick={onResetPlanManagement} label={t('Reset')}>
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

export default FilterPlanManagement;
