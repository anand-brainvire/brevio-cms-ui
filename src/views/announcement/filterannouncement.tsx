import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { DateCalendar, Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { AccesibilityNames, AnnouncementAddType, AnnouncementPlatform, DATE_FORMAT } from '@config/constant';
import { AnnouncementProps, FilterAnnouncementProps } from '@type/announcement';
import DropDown from '@components/dropdown/dropDown';
import { CalendarChangeEvent } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
import { getDateFromat } from '@utils/helpers';
import DatePicker from '@components/datapicker/datePicker';
import filterServiceProps from '@components/filter/filter';

const FilterAnnouncement = ({ onSearchAnnouncement, filterData }: AnnouncementProps) => {
	const { t } = useTranslation();
	const initialValues: FilterAnnouncementProps = {
		title: '',
		startDate: '',
		endDate: '',
		annoucemntType: '',
		platform: '',
	};
	const [dates, setDates] = useState<Date[]>([]);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			if (dates.length === 2) {
				onSearchAnnouncement({ ...values, startDate: getDateFromat(dates[0]?.toString(), DATE_FORMAT.simpleDateFormat), endDate: getDateFromat(dates[1]?.toString(), DATE_FORMAT.simpleDateFormat) });
			} else {
				onSearchAnnouncement(values);
			}
		},
	});
	/**
	 * reset form data
	 */
	const onResetAnnouncment = useCallback(() => {
		formik.resetForm();
		setDates([]);
		onSearchAnnouncement(initialValues);
	}, []);
	/**
	 * Handle's date
	 */
	const OnChangeAnnouncement = useCallback(
		(e: CalendarChangeEvent) => {
			setDates(e.value as Date[]);
		},
		[setDates]
	);
	/**
	 * Method that sets filters data in local storage
	 */
	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterannouncement', JSON.stringify(filterData));
		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);
		if (savedFilterData.startDate !== '') {
			setDates([new Date(getDateFromat(savedFilterData.startDate, DATE_FORMAT.momentDateFormat)), new Date(getDateFromat(savedFilterData.endDate, DATE_FORMAT.momentDateFormat))]);
		}
		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, []);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<div className=' col-span-1'>
							<TextInput id={'title'} placeholder={t('Title')} name='title' type='text' onChange={formik.handleChange} value={formik.values.title} />
						</div>

						<DatePicker
							id='createdAt'
							placeholder={`${t('Created At')} `}
							value={dates}
							numberOfMonths={2}
							onChange={OnChangeAnnouncement}
							selectionMode='range'
							showIcon={true}
							inputIcon={
								<span className='text-black w-4 h-4 inline-block svg-icon'>
									<DateCalendar />
								</span>
							}
						/>

						<DropDown ariaLabel={AccesibilityNames.annoucemntType} placeholder={t('Select Type')} name='annoucemntType' onChange={formik.handleChange} value={formik.values.annoucemntType ?? ''} options={AnnouncementAddType} id='annoucemntType' />

						<DropDown ariaLabel={AccesibilityNames.platform} placeholder={t('Select Platform')} name='platform' onChange={formik.handleChange} value={formik.values.platform ?? ''} options={AnnouncementPlatform} id='platform' />

						<div className='col-span-1 md:col-span-2'>
							<div className='btn-group flex items-baseline  justify-end '>
								<Button type='submit' label={t('Search')} className='btn-primary   '>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button onClick={onResetAnnouncment} label={t('Reset')} className='btn-warning   '>
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
export default FilterAnnouncement;
