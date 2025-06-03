import Button from '@components/button/button';
import TextInput from '@components/textinput/TextInput';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { EventProps, FilterDataArr, FilterEventProps } from '@type/event';
import { useTranslation } from 'react-i18next';
import { DropdownOptionType } from '@type/component';
import { useQuery } from '@apollo/client';
import { GET_DROPDOWNFILTER_DATA } from '@framework/graphql/queries/event';
import { DateCalendar, Refresh, Search } from '@components/icons/icons';
import Dropdown from '@components/dropdown/dropDown';
import { getDateFromat } from '@utils/helpers';
import { AccesibilityNames, DATE_FORMAT } from '@config/constant';
import { CalendarChangeEvent } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
import DatePicker from '@components/datapicker/datePicker';
const FilterEvents = ({ onSearchEvent, clearSelectionEvents }: EventProps) => {
	const { t } = useTranslation();
	const { data } = useQuery(GET_DROPDOWNFILTER_DATA);
	const [createdByData, setCreatedByData] = useState<DropdownOptionType[]>([]);
	const initialValues: FilterEventProps = {
		eventName: '',
		startDate: '',
		endDate: '',
		createdBy: '',
	};
	const [datesEvent, setDatesEvent] = useState<Date[]>([]);
	/**
	 * Method used for set rol dropdown array
	 */
	useEffect(() => {
		if (data?.fetchEventsList) {
			const tempDataArr = [] as DropdownOptionType[];
			data?.fetchEventsList?.data?.FetchEventData?.map((data: FilterDataArr) => {
				tempDataArr.push({ name: data?.User.user_name, key: data.created_By });
			});
			setCreatedByData(tempDataArr);
		}
	}, [data]);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionEvents();
			if (datesEvent.length === 2) {
				onSearchEvent({ ...values, startDate: getDateFromat(datesEvent[0]?.toString(), DATE_FORMAT.simpleDateFormat), endDate: getDateFromat(datesEvent[1]?.toString(), DATE_FORMAT.simpleDateFormat) });
			} else {
				onSearchEvent(values);
			}
		},
	});
	/**
	 *  reset the input fileds of filter
	 */
	const onReset = useCallback(() => {
		formik.resetForm();
		setDatesEvent([]);
		onSearchEvent(initialValues);
	}, []);
	const OnChangeEvent = useCallback(
		(e: CalendarChangeEvent) => {
			setDatesEvent(e.value as Date[]);
		},
		[datesEvent]
	);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<div>
							<TextInput id={'eventName'} placeholder={t('Event Name')} name='eventName' type='text' onChange={formik.handleChange} value={formik.values.eventName} />
						</div>
						<DatePicker
							id='eventstartToEnd'
							placeholder={`${t('Event Start')}  ${t('To')} ${t('End Date')}`}
							value={datesEvent}
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

						<Dropdown ariaLabel={AccesibilityNames.role} placeholder={t('Created By')} name='role' onChange={formik.handleChange} value={formik.values.createdBy ?? ''} options={createdByData} id='role' />

						<div className=' [.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3 btn-group  flex items-start justify-end'>
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
			</form>
		</div>
	);
};
export default FilterEvents;
