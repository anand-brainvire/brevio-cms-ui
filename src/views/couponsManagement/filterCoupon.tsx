import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { DateCalendar, Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { AccesibilityNames, DATE_FORMAT, STATUS_DRP } from '@config/constant';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CouponsManagementProps, FilterCouponsProps } from '@type/couponManagement';
import { getDateFromat } from '@utils/helpers';
import { CalendarChangeEvent } from 'primereact/calendar';
import DatePicker from '@components/datapicker/datePicker';
import filterServiceProps from '@components/filter/filter';
const FilterCoupon = ({ onSearchCoupon, clearSelectionCoupons, filterData }: CouponsManagementProps) => {
	const { t } = useTranslation();
	const initialValues: FilterCouponsProps = {
		offerName: '',
		startDate: '',
		endDate: '',
		status: '',
	};
	const [datesCpn, setDatesCpn] = useState<Date[]>([]);
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionCoupons();
			if (datesCpn.length === 2) {
				onSearchCoupon({ ...values, startDate: getDateFromat(datesCpn[0]?.toString(), DATE_FORMAT.simpleDateFormat), endDate: getDateFromat(datesCpn[1]?.toString(), DATE_FORMAT.simpleDateFormat) });
			} else {
				onSearchCoupon(values);
			}
		},
	});
	/**
	 * reset form data
	 */
	const onReset = useCallback(() => {
		formik.resetForm();
		setDatesCpn([]);
		clearSelectionCoupons();
		onSearchCoupon(initialValues);
	}, []);
	/**
	 * Handle change user date
	 */
	const OnChange = useCallback(
		(e: CalendarChangeEvent) => {
			setDatesCpn(e.value as Date[]);
		},
		[setDatesCpn]
	);
	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterCoupon', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);
		if (savedFilterData.startDate !== '' && savedFilterData.endDate !== '') {
			setDatesCpn([new Date(getDateFromat(savedFilterData.startDate, DATE_FORMAT.momentDateFormat)), new Date(getDateFromat(savedFilterData.endDate, DATE_FORMAT.momentDateFormat))]);
		}
		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, []);
	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<div>
							<TextInput id={'offerName'} placeholder={t('Offer Name')} name='offerName' type='text' onChange={formik.handleChange} value={formik.values.offerName} />
						</div>

						<DatePicker
							id={'offerStarttoEnd'}
							placeholder={`${t('Offer Start')}  ${t('To')} ${t('End Date')}`}
							value={datesCpn}
							numberOfMonths={2}
							onChange={OnChange}
							selectionMode='range'
							showIcon={true}
							inputIcon={
								<span className='text-black w-4 h-4 inline-block svg-icon'>
									<DateCalendar />
								</span>
							}
						/>

						<Dropdown ariaLabel={AccesibilityNames.Status} placeholder={t('')} name='status' onChange={formik.handleChange} value={formik.values.status ?? ''} options={STATUS_DRP} id='status' />

						<div className=' [.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3 '>
							<div className='btn-group col-span-3 flex items-start justify-end '>
								<Button className='btn-primary  ' type='submit' label={t('Search')}>
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
export default FilterCoupon;
