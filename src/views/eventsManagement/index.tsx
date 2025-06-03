import { useMutation, useQuery } from '@apollo/client';
import { ROUTES, SHOW_PAGE_COUNT_ARR as PAGE_COUNT_EVENTS, DELETE_WARING_TEXT, GROUP_DELETE_WARING_TEXT, DATE_FORMAT, sortOrder, DEFAULT_LIMIT, DEFAULT_PAGE, AccesibilityNames } from '@config/constant';
import { DeleteEventType, EventsDataArr, GroupDeleteEventsRes } from '@framework/graphql/graphql';
import { GET_EVENTS } from '@framework/graphql/queries/event';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterEventProps, PaginationParams } from '@type/event';
import { DELETE_EVENT, GROUP_DELETE_EVENTS } from '@framework/graphql/mutations/event';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import FilterEvents from '@views/eventsManagement/filterEvents';
import { GetDefaultIcon, DateCalendar, PlusCircle, Trash, AngleUp, AngleDown, Edit, Eye } from '@components/icons/icons';
import { ColArrType } from '@type/common';
import Button from '@components/button/button';
import DescriptionModel from '@views/discriptionModel';
import CommonModel from '@components/common/commonModel';
import { commonRedirectFun, commonViewRedirectFun, getDateFromat } from '@utils/helpers';
import Pagination from '@components/Pagination/Pagination';
import filterServiceProps from '@components/filter/filter';

import { OptionsPropsForButton } from '@type/component';
const Events = () => {
	const { data, refetch: getEvents } = useQuery(GET_EVENTS);
	const navigate = useNavigate();
	const [isDeleteEventShow, setIsDeleteEventShow] = useState<boolean>(false);
	const [eventObj, setEventObj] = useState<EventsDataArr>({} as EventsDataArr);
	const [deleteEventMutation] = useMutation(DELETE_EVENT);
	const [deleteEvents] = useMutation(GROUP_DELETE_EVENTS);
	const COL_ARR_EVENTS = [
		{ name: 'Sr.No', sortable: false },
		{ name: t('Event Name'), sortable: true, fieldName: 'event_name' },
		{ name: t('Description'), sortable: false, fieldName: 'description' },
		{ name: t('Recurrence'), sortable: true, fieldName: 'is_reccuring' },
		{ name: t('Start Date Time'), sortable: true, fieldName: 'start_date' },
		{ name: t('End Date Time'), sortable: true, fieldName: 'end_date' },
		{ name: t('Created by'), sortable: true, fieldName: 'created_by' },
	] as ColArrType[];
	const [filterData, setFilterData] = useState<PaginationParams>({
		page: DEFAULT_PAGE,
		limit: DEFAULT_LIMIT,
		sortBy: '',
		sortOrder: sortOrder,
		eventName: '',
		startDate: '',
		endDate: '',
	});
	const [isDescriptionModelShow, setIsDescriptionModelShow] = useState<boolean>(false);
	const [isDeleteConfirmationOpenEvents, setIsDeleteConfirmationOpenEvents] = useState<boolean>(false);
	const [selectedAllEvents, setSelectedAllEvents] = useState<boolean>(false);
	const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
	const totalRuleSets = data?.fetchEvents?.data?.count || 0;
	const totalPages = Math.ceil(totalRuleSets / recordsPerPage);
	/**
	 * Handle's page chnage
	 */
	const handlePageChangeEvent = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
		};
		setSelectedEvents([]);
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterEvent', JSON.stringify(updatedFilterData));
	}, []);

	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filterEvent', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);

	/**method that sets all events selected */
	useEffect(() => {
		if (selectedAllEvents) {
			getEvents().then((res) => {
				setSelectedEvents(res?.data?.fetchEvents?.data?.FetchEventData?.map((mappedSelectedEvents: EventsDataArr) => mappedSelectedEvents.uuid));
			});
		}
	}, [data?.fetchEvents]);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortEvent = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};

	/**
	 *
	 * @param e Method used for  dropdown for page limit
	 */
	const onPageDrpSelectEvent = (e: string) => {
		setRecordsPerPage(Number(e));
		const updatedFilterData = {
			...filterData,
			limit: parseInt(e),
			page: DEFAULT_PAGE,
		};
		setSelectedEvents([]);
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterEvent', JSON.stringify(updatedFilterData));
	};
	/**
	 * Method used for delete subadmin data
	 */
	const deleteEvent = useCallback(() => {
		deleteEventMutation({
			variables: { deleteEventId: eventObj?.uuid },
		})
			.then((res) => {
				const data = res?.data?.deleteEvent as DeleteEventType;
				if (data?.meta?.statusCode === 200) {
					toast.success(data?.meta?.message);
					setIsDeleteEventShow(false);
					getEvents(filterData).catch((e) => toast.error(e));
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isDeleteEventShow]);

	/**
	 * Method used for close model
	 */
	const onCloseEvent = useCallback(() => {
		setIsDeleteEventShow(false);
		setIsDeleteConfirmationOpenEvents(false);
		setIsDescriptionModelShow(false);
	}, []);

	/**
	 * Used for refetch listing of subadmin data after filter
	 */
	useEffect(() => {
		if (filterData) {
			getEvents(filterData).catch((err) => {
				toast.error(err);
			});
		}
	}, [filterData]);

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const onSearchEvent = useCallback((values: FilterEventProps) => {
		setFilterData({
			...filterData,
			eventName: values.eventName,
			startDate: values.startDate,
			endDate: values.endDate,
			page: DEFAULT_PAGE,
		});
		setSelectedEvents([]);
	}, []);

	/**
	 * Method that handles group delete
	 */
	const confirmDeleteEvents = useCallback(() => {
		// Perform the mutation to delete the selected coupons
		deleteEvents({
			variables: { groupDeleteEventsId: selectedEvents },
		})
			.then((res) => {
				const data = res?.data as GroupDeleteEventsRes;
				if (data?.groupDeleteEvents?.meta?.statusCode === 200) {
					toast.success(data?.groupDeleteEvents?.meta?.message);
					setIsDeleteConfirmationOpenEvents(false);
					getEvents(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to delete coupons'));
			});
		setSelectedEvents([]);
	}, [selectedEvents]);

	useEffect(() => {
		if (selectedEvents?.length === data?.fetchEvents?.data?.FetchEventData?.length) {
			setSelectedAllEvents(true);
		} else {
			setSelectedAllEvents(false);
		}
	}, [selectedEvents]);

	const handleDeleteEvents = useCallback(() => {
		if (selectedEvents?.length > 0) {
			setIsDeleteConfirmationOpenEvents(true);
		} else {
			toast.error('Please select atleast one record');
		}
	}, [selectedEvents]);
	const handleSelectEvent = (couponId: string) => {
		// Check if the cupon ID is already selected
		let updateSelectedEvents = [...selectedEvents];

		const isSelected = updateSelectedEvents?.includes(couponId);
		if (isSelected) {
			// If the cpoupon ID is already selected, remove it from the selection
			updateSelectedEvents = updateSelectedEvents.filter((id: string) => id !== couponId);
		} else {
			// If the coupon ID is not selected, add it to the selection
			updateSelectedEvents = [...updateSelectedEvents, couponId];
		}
		setSelectedEvents(updateSelectedEvents);
	};

	const handleSelectAllEvents = (event: React.ChangeEvent<HTMLInputElement>) => {
		let updateSelectedEvents = [...selectedEvents];
		if (!event.target.checked) {
			// Select all checkboxes
			updateSelectedEvents = [];
			setSelectedEvents(updateSelectedEvents);
		} else {
			// Deselect all checkboxes
			updateSelectedEvents = data?.fetchEvents?.data?.FetchEventData?.map((mappedSelectedEvents: EventsDataArr) => {
				return mappedSelectedEvents.uuid;
			});
			setSelectedEvents(updateSelectedEvents);
		}
	};
	const [description, setDescription] = useState<string>('');
	const descriptionHandler = (value: string) => {
		setDescription(value);
		setIsDescriptionModelShow((prev) => !prev);
	};
	/**
	 * Method that sets total number of records to show
	 */
	useEffect(() => {
		setRecordsPerPage(filterData.limit);
	}, [filterData.limit]);

	const addRedirectionEvent = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.event}/${ROUTES.add}`);
	}, []);

	const clearSelectionEvents = useCallback(() => {
		setSelectedEvents([]);
	}, [selectedEvents]);

	const deleteEventFun = useCallback(
		(options: OptionsPropsForButton) => {
			setEventObj(options?.data as unknown as EventsDataArr);
			setIsDeleteEventShow(true);
		},
		[eventObj, isDeleteEventShow]
	);
	return (
		<div>
			<FilterEvents onSearchEvent={onSearchEvent} clearSelectionEvents={clearSelectionEvents} />
			<div className='card-table'>
				<div className='card-header flex-wrap gap-2'>
					<div className='flex items-center'>
						<span className='text-black w-3.5 h-3.5 mr-2 inline-block svg-icon'>
							<DateCalendar />
						</span>
						<span className='text-sm font-normal'> {t('Event List')}</span>
					</div>
					<div className='btn-group flex gap-y-2 flex-wrap   '>
						<Button className='btn-primary ' onClick={handleDeleteEvents} type='button' label={t('Delete Selected')} disabled={!selectedEvents.length}>
							<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
								<Trash />
							</span>
						</Button>
						<Button className='btn-primary  ' onClick={addRedirectionEvent} type='button' label={t('Add New')}>
							<span className='inline-block w-4 h-4 mr-1 svg-icon'>
								<PlusCircle />
							</span>
						</Button>
					</div>
				</div>
				<div className='card-body'>
					<div className='table-select-dropdown-container justify-start'>
						<span className='table-select-dropdown-label'>{t('Show')}</span>
						<select aria-label={AccesibilityNames.Entries} className='table-select-dropdown' onChange={(e) => onPageDrpSelectEvent(e.target.value)} value={filterData.limit}>
							{PAGE_COUNT_EVENTS?.map((item: number) => {
								return <option key={item}>{item}</option>;
							})}
						</select>
						<span className='table-select-dropdown-label'>{t('entries')}</span>
					</div>
					<div className='overflow-auto custom-datatable'>
						<table>
							<thead>
								<tr>
									<th scope='col'>
										<div className='flex justify-center items-center'>
											<input type='checkbox' className='checkbox' checked={selectedEvents?.length === data?.fetchEvents?.data?.FetchEventData?.length} onChange={handleSelectAllEvents} />
										</div>
									</th>
									{COL_ARR_EVENTS?.map((eventVal: ColArrType) => {
										return (
											<th scope='col' key={eventVal.fieldName}>
												<div className={`flex items-center ${eventVal.name === 'Sr.No' || eventVal.name === t('Description') ? 'justify-center' : ''} `}>
													{eventVal.name}
													{eventVal.sortable && (
														<button title='sort' onClick={() => onHandleSortEvent(eventVal.fieldName)} className='cursor-pointer'>
															{(filterData.sortOrder === '' || filterData.sortBy !== eventVal.fieldName) && (
																<span className='svg-icon inline-block ml-1 w-3 h-3'>
																	<GetDefaultIcon />
																</span>
															)}
															{filterData.sortOrder === 'asc' && filterData.sortBy === eventVal.fieldName && <AngleUp />}
															{filterData.sortOrder === 'desc' && filterData.sortBy === eventVal.fieldName && <AngleDown />}
														</button>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col'>
										<div className='flex  justify-center'>{t('Action')}</div>
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.fetchEvents?.data?.FetchEventData?.map((data: EventsDataArr, index: number) => {
									return (
										<tr key={data.id}>
											<td>
												<div className='flex justify-center items-center'>
													<input type='checkbox' className='checkbox' id={`${data.uuid}`} checked={selectedEvents?.includes(data.uuid)} onChange={() => handleSelectEvent(data.uuid)} />
												</div>
											</td>
											<th scope='row' className=' font-normal text-gray-700 whitespace-nowrap  text-center'>
												{index + 1}
											</th>
											<td>{data.event_name}</td>
											<td className='text-center'>
												{data.description.length > 20 ? data.description.slice(0, 20) : data.description}
												{data.description.length > 20 ? (
													<button title='Show more' className='text-red-500 hover:underline hover:cursor-pointer ml-1' onClick={() => descriptionHandler(data.description)}>
														show more...
													</button>
												) : (
													''
												)}
											</td>
											<td>{data.is_reccuring}</td>
											<td>{getDateFromat(data.start_date, DATE_FORMAT.momentDateTime24Format)}</td>
											<td>{getDateFromat(data.end_date, DATE_FORMAT.momentDateTime24Format)}</td>
											<td>{data.User.user_name}</td>
											<td>
												<div className='flex justify-center'>
													<Button icon={<Eye />} data={data} route={ROUTES.event} onClick={commonViewRedirectFun} className='btn-default' />
													<Button icon={<Edit />} data={data} route={ROUTES.event} onClick={commonRedirectFun} className='btn-default' />
													<Button data={data} route={''} onClick={deleteEventFun} icon={<Trash />} spanClassName='svg-icon inline-block h-3.5 w-3.5' className='btn-default' />
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{(data?.fetchEvents?.data === null || data?.fetchEvents?.data === undefined) && (
							<div className='no-data'>
								<div>{t('No Data')}</div>
							</div>
						)}
					</div>
					<div className='datatable-footer'>
						<div className='datatable-total-records'>
							{`${data?.fetchEvents?.data?.count === null || data?.fetchEvents?.data?.count === undefined ? '0' : data?.fetchEvents?.data?.count}`}
							<span className='ml-1'>{t(' Total Records')}</span>
						</div>
						<Pagination currentPage={filterData.page} totalPages={totalPages} onPageChange={handlePageChangeEvent} recordsPerPage={recordsPerPage} />
					</div>
				</div>
			</div>
			{isDescriptionModelShow && <DescriptionModel onClose={onCloseEvent} data={description} show={isDescriptionModelShow} />}
			{isDeleteEventShow && <CommonModel warningText={DELETE_WARING_TEXT} onClose={onCloseEvent} action={deleteEvent} show={isDeleteEventShow} />}
			{isDeleteConfirmationOpenEvents && <CommonModel warningText={GROUP_DELETE_WARING_TEXT} onClose={onCloseEvent} action={confirmDeleteEvents} show={isDeleteConfirmationOpenEvents} />}
		</div>
	);
};
export default Events;
