import { useMutation, useQuery } from '@apollo/client';
import { ROUTES, SHOW_PAGE_COUNT_ARR as PAGE_COUNT_NOTF, CHANGESTATUS_WARING_TEXT, DELETE_WARING_TEXT, GROUP_DELETE_WARING_TEXT, DATE_FORMAT, sortOrder, DEFAULT_LIMIT, DEFAULT_PAGE, AccesibilityNames, STATUS } from '@config/constant';
import { DeleteNotificationType, GroupDeleteNotificationsRes, NotificationDataArr, UpdateNotificationStatusType } from '@framework/graphql/graphql';
import { CHANGE_NOTIFICATION_STATUS, DELETE_NOTIFICATION, GROUP_DELETE_NOTIFICATION } from '@framework/graphql/mutations/notifications';
import { GET_NOTIFICATIONS } from '@framework/graphql/queries/notifications';
import { commonRedirectFun, commonViewRedirectFun, getDateFromTimestamp, getDateFromat } from '@utils/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ColArrType, PaginationProps } from '@type/notifications';
import { GetDefaultIcon, Bell, PlusCircle, Trash, AngleUp, AngleDown, Edit, Eye } from '@components/icons/icons';
import Button from '@components/button/button';
import TextInput from '@components/textinput/TextInput';
import CommonModel from '@components/common/commonModel';
import Pagination from '@components/Pagination/Pagination';
import filterServiceProps from '@components/filter/filter';
import { OptionsPropsForButton } from '@type/component';

const NotificationsTemplate = () => {
	const { t } = useTranslation();
	const { data, refetch: getNotifications } = useQuery(GET_NOTIFICATIONS);
	const [deleteNotificationBYId] = useMutation(DELETE_NOTIFICATION);
	const [UpdateNotificationStatus] = useMutation(CHANGE_NOTIFICATION_STATUS);
	const [deleteNotifications] = useMutation(GROUP_DELETE_NOTIFICATION);
	const navigate = useNavigate();
	const [filterData, setFilterData] = useState<PaginationProps>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrder,
		search: '',
	});
	const [notificationObj, setNotificationObj] = useState<NotificationDataArr>({} as NotificationDataArr);
	const [isDeleteNotification, setIsDeleteNotification] = useState<boolean>(false);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const COL_ARR_NOTF = [
		{ name: 'Sr.No', sortable: false },
		{ name: t('Template'), sortable: true, fildName: 'template' },
		{ name: t('Created At'), sortable: true, fildName: 'created_at' },
		{ name: t('Updated At'), sortable: true, fildName: 'updated_at' },
		{ name: t('Status'), sortable: true, fildName: 'status' },
	] as ColArrType[];
	const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false);
	const [selectedAllNtf, setSelectedAllNtf] = useState<boolean>(false);
	const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
	const totalRuleSets = data?.fetchNotificationTemplate?.data?.count || 0;
	const totalPages = Math.ceil(totalRuleSets / recordsPerPage);

	/**
	 * Handle's page chnage
	 */
	const handlePageChangeNtf = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
		};
		setSelectedNotifications([]);
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterntf', JSON.stringify(updatedFilterData));
	}, []);

	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filterntf', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);

	/**method that sets all notifications selected */
	useEffect(() => {
		if (selectedAllNtf) {
			getNotifications().then((res) => {
				setSelectedNotifications(res?.data?.fetchNotificationTemplate?.data?.notificationdata?.map((mappedSelectedNotf: NotificationDataArr) => parseInt(mappedSelectedNotf.uuid)));
			});
		}
	}, [data?.fetchNotificationTemplate]);

	/**
	 * Used for refetch listing of notification data after filter
	 */
	useEffect(() => {
		if (filterData) {
			getNotifications(filterData).catch((err) => {
				toast.error(err);
			});
		}
	}, [filterData]);
	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortNtf = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};

	/**
	 * Method used for delete notification data
	 */
	const deleteNotification = useCallback(() => {
		deleteNotificationBYId({
			variables: {
				deleteNotificationTemplateId: notificationObj.uuid,
			},
		})
			.then((res) => {
				const data = res.data as DeleteNotificationType;
				if (data?.deleteNotificationTemplate?.meta?.statusCode === 200) {
					toast.success(data.deleteNotificationTemplate.meta.message);
					setIsDeleteNotification(false);
					getNotifications(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isDeleteNotification]);

	/**
	 * Method used for close model
	 */
	const onCloseNtf = useCallback(() => {
		setIsStatusModelShow(false);
		setIsDeleteNotification(false);
		setIsDeleteConfirmationOpen(false);
	}, []);
	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelectNtf = (e: string) => {
		setRecordsPerPage(Number(e));
		const updatedFilterData = {
			...filterData,
			limit: parseInt(e),
			page: DEFAULT_PAGE,
		};
		setSelectedNotifications([]);
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterntf', JSON.stringify(updatedFilterData));
	};
	/**
	 * Method used for change notification status model
	 */
	function onChangeStatusNtf(data: NotificationDataArr) {
		setIsStatusModelShow(true);
		setNotificationObj(data);
	}
	/**
	 * Method used for change notification status with API
	 */
	const changeNotificationStatus = useCallback(() => {
		UpdateNotificationStatus({
			variables: {
				updateNotificationTemplateId: notificationObj.uuid,
				status: notificationObj.status === 1 ? 0 : 1,
			},
		})
			.then((res) => {
				const data = res.data as UpdateNotificationStatusType;
				if (data?.updateNotificationTemplate?.meta?.statusCode === 200) {
					toast.success(data?.updateNotificationTemplate?.meta?.message);
					setIsStatusModelShow(false);
					getNotifications(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isStatusModelShow]);
	/**
	 *
	 * @param values are used set the filter data
	 */
	const onSearchNotification = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFilterData({ ...filterData, search: e.target.value, page: DEFAULT_PAGE });
		setSelectedNotifications([]);
	}, []);

	/**
	 * Method that handles group delete
	 */
	const confirmDeleteNtf = useCallback(() => {
		// Perform the mutation to delete the selected notificaions
		deleteNotifications({
			variables: { groupDeletenotificationTemplateId: selectedNotifications },
		})
			.then((res) => {
				const data = res?.data as GroupDeleteNotificationsRes;
				if (data?.groupDeletenotificationTemplate?.meta?.statusCode === 200) {
					toast.success(data?.groupDeletenotificationTemplate?.meta?.message);
					setIsDeleteConfirmationOpen(false);
					getNotifications(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to delete Notifications'));
			});
		setSelectedNotifications([]);
	}, [selectedNotifications]);
	useEffect(() => {
		if (selectedNotifications?.length === data?.fetchNotificationTemplate?.data?.notificationdata?.length) {
			setSelectedAllNtf(true);
		} else {
			setSelectedAllNtf(false);
		}
	}, [selectedNotifications]);

	const handleDeleteNotifications = useCallback(() => {
		if (selectedNotifications?.length > 0) {
			setIsDeleteConfirmationOpen(true);
		} else {
			toast.error('Please select atleast one record');
		}
	}, [selectedNotifications]);
	const handleSelectNotification = (notificationId: string) => {
		// Check if the notification ID is already selected
		let updateSelectedNotification = [...selectedNotifications];

		const isSelected = updateSelectedNotification?.includes(notificationId);
		if (isSelected) {
			// If the notification ID is already selected, remove it from the selection
			updateSelectedNotification = updateSelectedNotification.filter((id: string) => id !== notificationId);
		} else {
			// If the notification ID is not selected, add it to the selection
			updateSelectedNotification = [...updateSelectedNotification, notificationId];
		}
		setSelectedNotifications(updateSelectedNotification);
	};

	const handleSelectAllNtf = (event: React.ChangeEvent<HTMLInputElement>) => {
		let updateSelectedNotification = [...selectedNotifications];
		if (!event.target.checked) {
			// Select all checkboxes
			updateSelectedNotification = [];
			setSelectedNotifications(updateSelectedNotification);
		} else {
			// Deselect all checkboxes
			updateSelectedNotification = data?.fetchNotificationTemplate?.data?.notificationdata?.map((mappedSelectedNotf: NotificationDataArr) => {
				return mappedSelectedNotf.uuid;
			});
			setSelectedNotifications(updateSelectedNotification);
		}
	};
	/**
	 * Method that sets total number of records to show
	 */
	useEffect(() => {
		setRecordsPerPage(filterData.limit);
	}, [filterData.limit]);
	const addRedirectionNtf = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.notifications}/${ROUTES.add}`);
	}, []);
	/**
	 * Method that enables the delete popup
	 */
	const deleteNotificationFun = useCallback(
		(options: OptionsPropsForButton) => {
			setNotificationObj(options?.data as unknown as NotificationDataArr);
			setIsDeleteNotification(true);
		},
		[notificationObj, isDeleteNotification]
	);
	return (
		<div>
			<div className='card-table'>
				<div className='card-header flex-wrap gap-2'>
					<div className='flex items-center'>
						<span className='mr-2 w-3.5 h-3.5 inline-block svg-icon'>
							<Bell />
						</span>
						<span className='text-sm font-normal'>{t('Notification List')}</span>
					</div>
					<div className='btn-group  flex gap-y-2 flex-wrap'>
						<Button className='btn-primary ' onClick={handleDeleteNotifications} type='button' label={t('Delete Selected')} disabled={!selectedNotifications.length}>
							<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
								<Trash />
							</span>
						</Button>
						<Button className='btn-primary  ' onClick={addRedirectionNtf} type='button' label={t('Add New')}>
							<span className='inline-block w-4 h-4 mr-1 svg-icon'>
								<PlusCircle />
							</span>
						</Button>
					</div>
				</div>
				<div className='card-body'>
					<div className='table-select-dropdown-container justify-start md:justify-between '>
						<div>
							<span className='table-select-dropdown-label'>{t('Show')}</span>
							<select aria-label={AccesibilityNames.Entries} className='table-select-dropdown' onChange={(e) => onPageDrpSelectNtf(e.target.value)} value={filterData.limit}>
								{PAGE_COUNT_NOTF?.map((data: number) => {
									return <option key={data}>{data}</option>;
								})}
							</select>
							<span className='table-select-dropdown-label'>{t('entries')}</span>
						</div>
						<div>
							<TextInput id={'ntfSearch'} placeholder={t('Search template...')} name='search' type='text' onChange={onSearchNotification} />
						</div>
					</div>
					<div className='overflow-auto custom-datatable'>
						<table>
							<thead>
								<tr>
									<th scope='col'>
										<div className='flex justify-center items-center'>
											<input type='checkbox' className='checkbox' checked={selectedNotifications?.length === data?.fetchNotificationTemplate?.data?.notificationdata?.length} onChange={handleSelectAllNtf} />
										</div>
									</th>
									{COL_ARR_NOTF?.map((notfVal: ColArrType) => {
										return (
											<th scope='col' key={notfVal.fildName}>
												<div className={`flex items-center ${notfVal.name == t('Status') || notfVal.name == 'Sr.No' ? 'justify-center' : ''}`}>
													{notfVal.name}
													{notfVal.sortable && (
														<button title='sort' onClick={() => onHandleSortNtf(notfVal.fildName)}>
															{(filterData.sortOrder === '' || filterData.sortBy !== notfVal.fildName) && (
																<span className='svg-icon inline-block ml-1 w-3 h-3'>
																	<GetDefaultIcon />
																</span>
															)}
															{filterData.sortOrder === 'asc' && filterData.sortBy === notfVal.fildName && <AngleUp />}
															{filterData.sortOrder === 'desc' && filterData.sortBy === notfVal.fildName && <AngleDown />}
														</button>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col'>
										<div className='flex justify-center'>{t('Action')}</div>
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.fetchNotificationTemplate?.data?.notificationdata?.map((data: NotificationDataArr, index: number) => {
									return (
										<tr key={data.id}>
											<td>
												<div className='flex justify-center items-center'>
													<input type='checkbox' className='checkbox' id={data.uuid} checked={selectedNotifications?.includes(data.uuid)} onChange={() => handleSelectNotification(data.uuid)} />
												</div>
											</td>
											<th scope='row' className='font-normal text-gray-700 whitespace-nowrap  text-center'>
												{index + 1}
											</th>
											<td>{data.template} </td>
											<td>{getDateFromat(getDateFromTimestamp(data.created_at), DATE_FORMAT.momentDateTime24Format)}</td>
											<td>
												<p>{getDateFromTimestamp(data.updated_at)} </p>
											</td>
											<td>
												<div className='flex justify-center'>{data.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>}</div>
											</td>
											<td>
												<div className='flex items-center justify-center'>
													<Button icon={<Eye />} data={data} route={ROUTES.notifications} onClick={commonViewRedirectFun} label={''} className='btn-default' />
													<Button icon={<Edit />} data={data} route={ROUTES.notifications} onClick={commonRedirectFun} label={''} className='btn-default' />
													<div className='flex items-center px-2 py-1'>
														<span aria-label='toggle-status' aria-hidden='true' onClick={() => onChangeStatusNtf(data)} className='font-medium text-blue-600 mt-2  hover:underline'>
															<label aria-label='toggle-status' aria-hidden='true' className='relative inline-flex items-center cursor-pointer'>
																<input type='checkbox' className='sr-only peer' value={data.status} checked={data.status === STATUS.active} readOnly />
																<div className={'w-7 h-4 bg-gray-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200   peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all  peer-checked:bg-primary'}></div>
															</label>
														</span>
													</div>
													<Button data={data} route={''} onClick={deleteNotificationFun} icon={<Trash />} spanClassName='svg-icon inline-block h-3.5 w-3.5' label={''} className='btn-default' />
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{(data?.fetchNotificationTemplate?.data === null || data?.fetchNotificationTemplate?.data === undefined) && (
							<div className='no-data'>
								<div>{t('No Data')}</div>
							</div>
						)}
					</div>
					<div className='datatable-footer'>
						<div className='datatable-total-records'>
							{`${data?.fetchNotificationTemplate?.data?.count === null || data?.fetchNotificationTemplate?.data?.count === undefined ? '0' : data?.fetchNotificationTemplate?.data?.count}`}
							<span className='ml-1'>{t(' Total Records')}</span>
						</div>
						<Pagination currentPage={filterData.page} totalPages={totalPages} onPageChange={handlePageChangeNtf} recordsPerPage={recordsPerPage} />
					</div>
				</div>
			</div>
			{isStatusModelShow && <CommonModel warningText={CHANGESTATUS_WARING_TEXT} onClose={onCloseNtf} action={changeNotificationStatus} show={isStatusModelShow} />}
			{isDeleteNotification && <CommonModel warningText={DELETE_WARING_TEXT} onClose={onCloseNtf} action={deleteNotification} show={isDeleteNotification} />}
			{isDeleteConfirmationOpen && <CommonModel warningText={GROUP_DELETE_WARING_TEXT} onClose={onCloseNtf} action={confirmDeleteNtf} show={isDeleteConfirmationOpen} />}
		</div>
	);
};
export default NotificationsTemplate;
