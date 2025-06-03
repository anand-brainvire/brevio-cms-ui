import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { DateCalendar, Refresh, Search } from '@components/icons/icons';
import { CalendarChangeEvent } from 'primereact/calendar';
import DatePicker from '@components/datapicker/datePicker';
import { ActivityProps, FilterActivityProps } from '@type/activityTracking';
import { getDateFromat } from '@utils/helpers';
import { DATE_FORMAT } from '@config/constant';
import filterServiceProps from '@components/filter/filter';

const FilterActivityTracking = ({ onSearchActivity, clearSelectionActivity, filterData }: ActivityProps): ReactElement => {
	const [datesActivity, setDatesActivity] = useState<Date[]>([]);
	const { t } = useTranslation();
	const initialValues: FilterActivityProps = {
		name: '',
		email: '',
		activity: '',
		startDate: '',
		endDate: '',
	};

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionActivity();
			if (datesActivity.length === 2) {
				onSearchActivity({ ...values, startDate: getDateFromat(datesActivity[0]?.toString(), DATE_FORMAT.simpleDateFormat), endDate: getDateFromat(datesActivity[1]?.toString(), DATE_FORMAT.simpleDateFormat) });
			} else {
				onSearchActivity(values);
			}
		},
	});
	/**
	 * Method use to reset form
	 */
	const onReset = useCallback(() => {
		formik.resetForm();
		setDatesActivity([]);
		onSearchActivity(initialValues);
	}, []);
	/**
	 * Methos used to change date
	 */
	const OnChangeEvent = useCallback(
		(e: CalendarChangeEvent) => {
			setDatesActivity(e.value as Date[]);
		},
		[datesActivity]
	);

	/**
	 * Method that sets filters data in local storage
	 */
	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterActivity', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);
		if (savedFilterData.startDate !== '' && savedFilterData.endDate !== '') {
			setDatesActivity([new Date(getDateFromat(savedFilterData.startDate, DATE_FORMAT.momentDateFormat)), new Date(getDateFromat(savedFilterData.endDate, DATE_FORMAT.momentDateFormat))]);
		}
		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, [filterData]);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<div>
							<TextInput id={'name'} placeholder={t('Name')} name='name' type='text' onChange={formik.handleChange} value={formik.values.name} />
						</div>
						<div>
							<TextInput id={'email'} placeholder={t('Email')} name='email' onChange={formik.handleChange} value={formik.values.email} />
						</div>
						<div>
							<TextInput id={'activity'} placeholder={t('Activity Description')} name='activity' type='text' onChange={formik.handleChange} value={formik.values.activity} />
						</div>
						<DatePicker
							id='startToEnd'
							placeholder={`${t('Select Date')}  `}
							value={datesActivity}
							numberOfMonths={2}
							onChange={OnChangeEvent}
							selectionMode='range'
							showIcon={true}
							inputIcon={
								<span className='text-black w-4 h-4 inline-block svg-icon'>
									<DateCalendar />
								</span>
							}
						/>

						<div className='[.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3'>
							<div className='btn-group col-span-3 flex items-start justify-end '>
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
export default FilterActivityTracking;
