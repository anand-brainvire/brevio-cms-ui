import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { useMutation, useQuery } from '@apollo/client';
import { GET_EVENT_BY_ID } from '@framework/graphql/queries/event';
import { CREATE_EVENT, UPDATE_EVENT } from '@framework/graphql/mutations/event';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateEventRes, SingleEventDataArr, UpdateEventRes } from '@framework/graphql/graphql';
import { CreateEvent } from '@type/event';
import { DATE_FORMAT, EVENTS_RADIO_IS_RECURRING_OPTIONS, ROUTES, STATUS } from '@config/constant';
import useValidation from '@src/hooks/validations';
import { CheckCircle, Cross } from '@components/icons/icons';
import RadioButton from '@components/radiobutton/radioButton';
import TextInput from '@components/textinput/TextInput';
import { getDateFromat, whiteSpaceRemover } from '@utils/helpers';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
import DatePicker from '@components/datapicker/datePicker';
import TextArea from '@components/textarea/TextArea';

const EditEvent = () => {
	const { t } = useTranslation();
	const { data: EventData, refetch } = useQuery(GET_EVENT_BY_ID);
	const [createEvent] = useMutation(CREATE_EVENT);
	const [updateEvent] = useMutation(UPDATE_EVENT);
	const navigate = useNavigate();
	const updateEventId = useParams();
	const { addEventValidationSchema } = useValidation();
	/**
	 * value for send notification
	 */
	const [toggleEvents, setToggleEvents] = useState<boolean>(false);

	const initialValues: CreateEvent = updateEventId.id
		? {
			eventName: '',
			description: '',
			sendNotification: false,
			address: '',
			startDate: undefined,
			endDate: undefined,
			isReccuring: '0',
			reccuranceDate: '',
			participants: '',
			participantMailIds: '',
		}
		: {
			eventName: '',
			description: '',
			sendNotification: false,
			address: '',
			startDate: undefined,
			endDate: undefined,
			isReccuring: '0',
			reccuranceDate: '',
		};

	/**
	 * Method used for get event api with id
	 */
	useEffect(() => {
		if (updateEventId?.id) {
			refetch({ fetchEventId: updateEventId?.id }).catch((err) => {
				toast.error(err);
			});
		}
	}, [updateEventId.id]);
	/**
	 * Method used for setvalue from event data by id
	 */
	useEffect(() => {
		if (EventData && updateEventId.id) {
			const data = EventData?.fetchEvent?.data as SingleEventDataArr;
			setToggleEvents(data?.send_notification);
			formik
				.setValues({
					eventName: data?.event_name,
					description: data?.description,
					sendNotification: data?.send_notification,
					address: data?.address,
					startDate: new Date(getDateFromat(data?.start_date, DATE_FORMAT.DateHoursMinFormat)),
					endDate: new Date(getDateFromat(data?.end_date, DATE_FORMAT.DateHoursMinFormat)),
					isReccuring: data?.is_reccuring == 'never' ? '0' : '1',
					reccuranceDate: data?.participant_mail_ids === null ? '' : getDateFromat(data?.reccurance_date, DATE_FORMAT.simpleDateFormat),
					participantMailIds: data?.participant_mail_ids === null || data?.participant_mail_ids.length === 0 ? '' : data?.participant_mail_ids.join(','),
				})
				.catch((err) => {
					toast.error(err);
				});
		}
	}, [EventData]);

	const formik = useFormik({
		initialValues,
		validationSchema: addEventValidationSchema,
		onSubmit: (values) => {
			const variables =
				values.isReccuring === '1'
					? {
						eventName: values.eventName,
						description: values.description,
						sendNotification: toggleEvents,
						address: values.address,
						startDate: values.startDate,
						endDate: values.endDate,
						isReccuring: 'daily',
						participantMailIds: values?.participantMailIds?.split(','),
						reccuranceDate: formik.values.reccuranceDate,
					}
					: {
						eventName: values.eventName,
						description: values.description,
						sendNotification: toggleEvents,
						address: values.address,
						startDate: values.startDate,
						endDate: values.endDate,
						isReccuring: 'never',
						participantMailIds: values?.participantMailIds?.split(','),
					};
			if (updateEventId.id) {
				updateEvent({
					variables: {
						updateEventId: updateEventId.id,
						...variables,
					},
				})
					.then((res) => {
						const data = res.data as UpdateEventRes;
						if (data.updateEvent.meta.statusCode === 200) {
							toast.success(data.updateEvent.meta.message);
							formik.resetForm();
							onCancel();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createEvent({
					variables: {
						...variables,
					},
				})
					.then((res) => {
						const data = res.data as CreateEventRes;
						if (data.createEvent.meta.statusCode === 200) {
							toast.success(data.createEvent.meta.message);
							navigate(`/${ROUTES.app}/${ROUTES.event}/${ROUTES.list}`);
							formik.resetForm();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.event}/${ROUTES.list}`);
	}, []);
	const getErrorEvents = (fieldName: keyof CreateEvent) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const OnBlurEvent = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	return (
		<div className='card'>
			<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
				<form onSubmit={formik.handleSubmit}>
					<div className='card-body'>
						<div className='card-title-container'>
							<p>
								{t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
							</p>
						</div>

						<div className='card-grid-addedit-page md:grid-cols-2'>
							<div>
								<TextInput id={'eventName'} required={true} placeholder={t('Event Name')} name='eventName' onChange={formik.handleChange} label={t('Event Name')} value={formik.values.eventName} error={getErrorEvents('eventName')} onBlur={OnBlurEvent} />
							</div>
							<div>
								<label className='block text-gray-700 text-sm font-normal mb-2' htmlFor={'sendNotification'}>
									{t('Send Notifications')}
								</label>
								<div>
									<span aria-label='toggle-status' aria-hidden='true'
										onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
											e.preventDefault();
											setToggleEvents((prev) => !prev);
										}}
										className='font-medium text-blue-600  hover:underline'
									>
										<label aria-hidden='true' aria-label='toggle-status' className='relative inline-flex items-center cursor-pointer '>
											<input id={'sendNotification'} type='checkbox' value={toggleEvents === true ? STATUS.active : STATUS.inactive} className='sr-only peer' name='sendNotification' checked={toggleEvents} readOnly />
											<div className={'w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-700   peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-primary'}></div>
										</label>
									</span>
								</div>
							</div>
							<div>
								<TextArea label={t('Description')} id='Description' placeholder={`${t('Description')}`} name='description' onChange={formik.handleChange} value={formik.values.description} rows={4} cols={50} onBlur={OnBlurEvent} error={formik.errors.description && formik.touched.description ? formik.errors.description : ''} />
							</div>

							<div>
								<TextArea label={t('Address')} id='Address' placeholder={`${t('Address')}`} name='address' onChange={formik.handleChange} value={formik.values.address} rows={4} cols={50} onBlur={OnBlurEvent} error={formik.errors.address && formik.touched.address ? formik.errors.address : ''}></TextArea>
							</div>
							<DatePicker required={true} id='startDate' placeholder={'Start Date'} name='startDate' onChange={formik.handleChange} label={t('Start Date')} value={formik.values.startDate} error={getErrorEvents('startDate')} min={updateEventId.id ? formik.values.startDate : new Date()} showTime={true} hourFormat={'12'} disabled={!!updateEventId.id} />

							<DatePicker required={true} placeholder={'End Date'} name='endDate' id='endDtate' onChange={formik.handleChange} label={t('End Date')} value={formik.values.endDate} min={formik.values.startDate} error={formik.values.startDate && getErrorEvents('endDate')} showTime={true} hourFormat={'12'} disabled={!formik.values.startDate} />

							<RadioButton id='isReccuring' checked={formik.values.isReccuring} onChange={formik.handleChange} name={'isReccuring'} radioOptions={EVENTS_RADIO_IS_RECURRING_OPTIONS} label={t('Recurrence')} required={true} />

							{formik.values.isReccuring == '1' && <DatePicker id='reccuranceDate' placeholder={'reccuranceDate'} name='reccuranceDate' onChange={formik.handleChange} label={t('Reccurance Date')} value={formik.values.reccuranceDate} disabled={!(formik.values.startDate && formik.values.endDate)} />}
							{EventData && updateEventId.id && (
								<div>
									<TextInput type='text' id='participantMailIds' placeholder={t('Email')} name='participantMailIds' onChange={formik.handleChange} onBlur={OnBlurEvent} label={t('Add Participants')} value={formik.values.participantMailIds} />
								</div>
							)}
						</div>
					</div>
					<div className='card-footer btn-group'>
						<Button className='btn-primary ' type='submit' label={updateEventId?.id ? t('Update') : t('Save')}>
							<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
								<CheckCircle />
							</span>
						</Button>
						<Button className='btn-warning  ' label={t('Cancel')} onClick={onCancel}>
							<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
				</form>
			</WithTranslateFormErrors>
		</div>
	);
};
export default EditEvent;
