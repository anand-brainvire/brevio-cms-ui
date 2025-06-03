import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { GetDefaultIcon, AnnouncementIco, ArrowSmallLeft, Group, Reset, AngleUp, AngleDown } from '@components/icons/icons';
import { DATE_FORMAT, AccesibilityNames, DEFAULT_LIMIT, DEFAULT_PAGE, IMAGE_BASE_URL, ROUTES, SHOW_PAGE_COUNT_ARR, dataMapping, sortBy, sortOrder } from '@config/constant';
import { AnnouncementDataArr, DataMapping, UserData } from '@framework/graphql/graphql';
import { GET_ANNOUNCEMENT_BY_ID, GET_USER } from '@framework/graphql/queries/announcement';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PaginationParamsViewAnnouncement } from '@type/announcement';
import { ColArrType } from '@type/country';
import TextInput from '@components/textinput/TextInput';
import filterServiceProps from '@components/filter/filter';
import ImageModel from '@views/imageModel';
import { Loader } from '@components/index';
import { getDateFromat } from '@utils/helpers';
const AnnouncementDetails = () => {
	const { t } = useTranslation();
	const announcementId = useParams();
	const navigate = useNavigate();
	const { data, refetch, loading } = useQuery(GET_ANNOUNCEMENT_BY_ID, { variables: { uuid: announcementId?.id }, skip: !announcementId?.id, fetchPolicy: 'network-only' });
	const [userList, setUserList] = useState<UserData[]>([]);
	const [userToExclude, setUserToExclude] = useState<UserData[]>([]);
	const [userOnlySendTo, setUserOnlySendTo] = useState<UserData[]>([]);
	const [filterData, setFilterData] = useState<PaginationParamsViewAnnouncement>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: sortBy,
		sortOrder: sortOrder,
		fullNameUserToExclude: '',
		fullNameOnlySendTo: '',
		isAll: true,
	});
	const { loading: userDataLoading, refetch: userRefetch } = useQuery(GET_USER, { variables: { ...filterData }, fetchPolicy: 'network-only', skip: true });
	const COL_ARR = [
		{ name: 'Sr.No', sortable: false },
		{ name: 'Name', sortable: false, fildName: 'first_name' },
		{ name: 'Email', sortable: false, fildName: 'email' },
		{ name: 'Created At', sortable: false, fildName: 'created_at' },
	] as ColArrType[];
	const [isViewAttachment, setIsViewAttachment] = useState(false);
	/**
	 * IF WE GET ID BASED ON THAT WE WILL GET Announcement DATA
	 */
	useEffect(() => {
		if (announcementId?.id) {
			refetch(filterData).catch((err) => toast.error(err));
		}
	}, [announcementId.id, filterData]);
	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancelAnnouncement = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.announcement}/list`);
	}, []);
	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortAnnouncement = useCallback(
		(sortFieldName: string) => {
			setFilterData({
				...filterData,
				sortBy: sortFieldName,
				sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
			});
		},
		[filterData]
	);

	const renderRole = (role: number) => {
		if (role === 0) {
			return 'Customer';
		} else if (role === 1) {
			return 'Admin';
		} else if (role === 2) {
			return 'SuperAdmin';
		} else {
			return '-';
		}
	};

	/**
	 * Handle's user data refresh
	 */
	const RefreshUserToExcludedata = useCallback(() => {
		setFilterData({ ...filterData, fullNameUserToExclude: '' });
		userRefetch(filterData)
			.then((res) => {
				if (res?.data?.fetchUsers?.meta?.statusCode === 200) {
					setUserToExcludeAndInclude(res?.data?.fetchUsers?.data?.userList, data?.getAnnoucement?.data);
					setUserList(res?.data?.fetchUsers?.data?.userList);
				}
			})
			.catch(() => {
				return;
			});
	}, [filterData]);

	/**
	 * Handle's user data refresh
	 */
	const RefreshOnlySendTo = useCallback(() => {
		setFilterData({ ...filterData, fullNameOnlySendTo: '' });
		userRefetch(filterData)
			.then((res) => {
				if (res?.data?.fetchUsers?.meta?.statusCode === 200) {
					setUserToExcludeAndInclude(res?.data?.fetchUsers?.data?.userList, data?.getAnnoucement?.data);
					setUserList(res?.data?.fetchUsers?.data?.userList);
				}
			})
			.catch(() => {
				return;
			});
	}, [filterData]);

	/**
	 * Get the filterdata on fist rendering and set's filter data
	 */
	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('viewAnnouncement', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);

	/**
	 * Handle's search usre's
	 */
	const onSearchUserToExclude = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFilterData({ ...filterData, fullNameUserToExclude: e.target.value });
	}, []);

	/**
	 * Handle's search usre's
	 */
	const onSearchOnlySendTo = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFilterData({ ...filterData, fullNameOnlySendTo: e.target.value });
	}, []);
	/**
	 * Handle's pop close
	 */
	const onClose = useCallback(() => {
		setIsViewAttachment(false);
	}, []);

	/**
	 * Methid that handle's the view attachment
	 * @param e
	 */
	const onView = (e: React.MouseEvent<HTMLButtonElement>) => {
		const target = e.target as HTMLButtonElement;
		if (data?.getAnnoucement?.data?.annoucemnt_type === 'email') {
			target.setAttribute('href', `${IMAGE_BASE_URL}${data?.getAnnoucement?.data?.filePath?.original_file}`);
			target.setAttribute('target', '_blank');
		} else {
			setIsViewAttachment(true);
		}
	};

	/**
	 * Method that sets user data
	 * @param users
	 * @param announcemntData
	 */
	const setUserToExcludeAndInclude = (users: UserData[], announcemntData: AnnouncementDataArr) => {
		if (data?.getAnnoucement?.data?.userToExclude?.length) {
			setUserToExclude(
				users?.filter((user: UserData) => {
					if (announcemntData?.userToExclude?.includes(user?.id)) {
						return user;
					}
				})
			);
		}
		if (data?.getAnnoucement?.data?.onlySendTo?.length) {
			setUserOnlySendTo(
				users?.filter((user: UserData) => {
					if (announcemntData?.onlySendTo?.includes(user?.id)) {
						return user;
					}
				})
			);
		}
	};
	/**
	 * Mthod that filters serched data
	 * @param isSearch
	 * @param searchValue
	 * @param userIds
	 * @param type
	 */
	const FiltersearchedData = (isSearch: boolean, searchValue: string, userIds: number[], type: 'excluded' | 'onlySendTo') => {
		if (isSearch) {
			setUserToExclude(
				userList.filter((user: UserData) => {
					if ((user?.first_name.toLowerCase().includes(searchValue.toLowerCase()) || user?.last_name.toLowerCase().includes(searchValue.toLowerCase())) && userIds.includes(user?.id)) {
						return user;
					}
				})
			);
		} else {
			type === 'excluded' &&
				setUserToExclude(
					userList.filter((user: UserData) => {
						return userIds.includes(user?.id) && user;
					})
				);
			type === 'onlySendTo' &&
				setUserOnlySendTo(
					userList.filter((user: UserData) => {
						return userIds.includes(user?.id) && user;
					})
				);
		}
	};

	/**
	 * Mathod that fetch serached data
	 */
	useEffect(() => {
		FiltersearchedData(data?.getAnnoucement?.data?.userToExclude?.length && filterData.fullNameUserToExclude !== '', filterData.fullNameUserToExclude, data?.getAnnoucement?.data?.userToExclude, 'excluded');
	}, [filterData.fullNameUserToExclude]);

	/**
	 * Mathod that fetch serached data
	 */
	useEffect(() => {
		FiltersearchedData(data?.getAnnoucement?.data?.onlySendTo?.length && filterData.fullNameOnlySendTo !== '', filterData.fullNameOnlySendTo, data?.getAnnoucement?.data?.onlySendTo, 'onlySendTo');
	}, [filterData.fullNameOnlySendTo]);

	useEffect(() => {
		if (data?.getAnnoucement?.data?.userToExclude?.length || data?.getAnnoucement?.data?.onlySendTo?.length) {
			userRefetch()
				.then((res) => {
					if (res?.data?.fetchUsers?.meta?.statusCode === 200) {
						setUserToExcludeAndInclude(res?.data?.fetchUsers?.data?.userList, data?.getAnnoucement?.data);
						setUserList(res?.data?.fetchUsers?.data?.userList);
					}
				})
				.catch(() => {
					return;
				});
		}
	}, [data?.getAnnoucement?.data]);

	/**
	 * @param e
	 * Method that handle's records per page
	 */
	const onPageDrpSelectViewAnnouncemnt = (e: string) => {
		const updatedFilterData = {
			...filterData,
			limit: Number(e),
			page: DEFAULT_PAGE,
		};
		setFilterData(updatedFilterData);
	};
	const getMappedValue = (incomingData: keyof DataMapping): string | undefined => {
		return dataMapping[incomingData];
	};

	return (
		<>
			{(loading || userDataLoading) && <Loader />}
			<div className='card '>
				<div className='card-header'>
					<div className='flex items-center'>
						<span className='mr-2 w-3.5 h-3.5 inline-block svg-icon'>
							<AnnouncementIco />
						</span>
						<span>{t('Announcement')}</span>
					</div>
					<Button className='btn-primary ' label={t('Back')} onClick={onCancelAnnouncement}>
						<span className='mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<ArrowSmallLeft />
						</span>
					</Button>
				</div>

				<div className='card-body grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 '>
					<div className='flex'>
						<label className='font-bold'>{t('Title')} </label>
						<p className='px-3'>{data?.getAnnoucement?.data?.title}</p>
					</div>
					<div className='flex'>
						<label className='font-bold'>{t('Type')} </label>
						<p className='px-3'> {data?.getAnnoucement?.data?.annoucemnt_type === null ? '-' : data?.getAnnoucement?.data?.annoucemnt_type.charAt(0).toUpperCase() + data?.getAnnoucement?.data?.annoucemnt_type.slice(1)}</p>
					</div>
					<div className='flex'>
						<label className='font-bold'>{t('Platform')} </label>
						<p className='px-3'> {data?.getAnnoucement?.data?.platform.charAt(0).toUpperCase() + data?.getAnnoucement?.data?.platform.slice(1)}</p>
					</div>
					<div className='flex '>
						<label className='font-bold'>{t('Status')} </label>
						<p className='px-3 '>{data?.getAnnoucement?.data?.status === 1 ? <span className='badge badge-default'>In-Progress</span> : <span className='badge badge-danger rounded'>InActive</span>} </p>
					</div>
					<div className='flex'>
						<label className='font-bold'>{t('Advanced Filter')} </label>
						<p className='px-3'>{getMappedValue(data?.getAnnoucement?.data?.userFilter)}</p>
					</div>
					<div className='flex'>
						<label className='font-bold'>{t('Description')} </label>
						<p className='px-3'>
							{
								<p
									dangerouslySetInnerHTML={{
										__html: data?.getAnnoucement?.data?.description,
									}}
								></p>
							}
						</p>
					</div>

					{data?.getAnnoucement?.data?.annoucemnt_type !== 'sms' && (
						<div>
							<button title='View Attachement' className='btn btn-primary' onClick={onView}>
								{t('View Attachement')}
							</button>
						</div>
					)}
				</div>
			</div>
			{data?.getAnnoucement?.data?.userFilter === 'userToExclude' && (
				<div className='card '>
					<div className='card-header flex items-center justify-between flex-wrap gap-2'>
						<div className='flex mb-2 mr-2'>
							<span className='mr-1 w-5 h-5  inline-block svg-icon'>
								<Group />
							</span>
							{t('Excluded Users')}
						</div>
						<Button className='btn-primary ' id='userToExclude' label={t('Refresh')} onClick={RefreshUserToExcludedata}>
							<span className='mr-1 w-3.5 h-3.5 inline-block svg-icon '>
								<Reset />
							</span>
						</Button>
					</div>

					<div className='card-body '>
						<div className='flex justify-between flex-wrap gap-2'>
							<div className='table-select-dropdown-container justify-start'>
								<span className=' table-select-dropdown-label '>{t('Show')}</span>
								<select aria-label={AccesibilityNames.Entries} value={filterData.limit} className='table-select-dropdown' onChange={(e) => onPageDrpSelectViewAnnouncemnt(e.target.value)}>
									{SHOW_PAGE_COUNT_ARR?.map((item: number) => {
										return <option key={item}>{item}</option>;
									})}
								</select>
								<span className=' table-select-dropdown-label'>{t('entries')}</span>
							</div>

							<div className='btn-group items-center '>
								<TextInput type='text' value={filterData.fullNameUserToExclude} onChange={onSearchUserToExclude} placeholder='Search Users' />
							</div>
						</div>

						<div className='overflow-auto custom-datatable'>
							<table>
								<thead className='text-xs text-gray-700 uppercase bg-gray-50  '>
									<tr>
										{COL_ARR?.map((viewAnnouceData: ColArrType, index: number) => {
											return (
												<th scope='col' className='px-6 py-3   border border-slate-500' key={`${index + 1}`}>
													<div className='flex items-center'>
														{viewAnnouceData.name}
														{viewAnnouceData.sortable && (
															<button title='sort' onClick={() => onHandleSortAnnouncement(viewAnnouceData.fildName)}>
																{(filterData.sortOrder === '' || filterData.sortBy !== viewAnnouceData.fildName) && (
																	<span className='svg-icon inline-block ml-1 w-3 h-3'>
																		<GetDefaultIcon />
																	</span>
																)}
																{filterData.sortOrder === 'asc' && filterData.sortBy === viewAnnouceData.fildName && <AngleUp />}
																{filterData.sortOrder === 'desc' && filterData.sortBy === viewAnnouceData.fildName && <AngleDown />}
															</button>
														)}
													</div>
												</th>
											);
										})}
									</tr>
								</thead>
								<tbody>
									{userToExclude?.slice(0, filterData.limit).map((data: UserData, index: number) => {
										return (
											<tr className='bg-white border-b     border border-slate-500' key={`${index + 1}`}>
												<th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap    border border-slate-500'>
													{index + 1}
												</th>
												<td className='px-6 py-4   border border-slate-500'>{data.first_name + data.last_name}</td>
												<td className='px-6 py-4   border border-slate-500'>{data.email}</td>
												<td className='px-6 py-4   border border-slate-500'>{getDateFromat(data?.created_at, DATE_FORMAT.momentDateOfBirth)}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
							{!userToExclude.length && (
								<div className='no-data'>
									<div>{t('No Data')}</div>
								</div>
							)}

							<div className='datatable-footer'>
								<span className='datatable-total-records'>
									{`${userToExclude?.length} `}
									<span>{t(' Total Records')}</span>
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
			{data?.getAnnoucement?.data?.userFilter === 'onlySendTo' && (
				<div className='card '>
					<div className='card-header flex items-center justify-between flex-wrap gap-2'>
						<div className='flex mb-2 mr-2'>
							<span className='mr-1 w-5 h-5  inline-block svg-icon'>
								<Group />
							</span>
							{t('Only send to users')}
						</div>
						<Button className='btn-primary ' label={t('Refresh')} onClick={RefreshOnlySendTo}>
							<span className='mr-1 w-3.5 h-3.5 inline-block svg-icon '>
								<Reset />
							</span>
						</Button>
					</div>

					<div className='card-body'>
						<div className='flex justify-between'>
							<div className='table-select-dropdown-container justify-start'>
								<span className=' table-select-dropdown-label '>{t('Show')}</span>
								<select aria-label={AccesibilityNames.Entries} value={filterData.limit} className='table-select-dropdown' onChange={(e) => onPageDrpSelectViewAnnouncemnt(e.target.value)}>
									{SHOW_PAGE_COUNT_ARR?.map((item: number) => {
										return <option key={item}>{item}</option>;
									})}
								</select>
								<span className=' table-select-dropdown-label'>{t('entries')}</span>
							</div>

							<div className='btn-group items-center '>
								<TextInput type='text' value={filterData.fullNameOnlySendTo} onChange={onSearchOnlySendTo} placeholder='Search Users' />
							</div>
						</div>

						<div className='overflow-auto custom-datatable '>
							<table>
								<thead className='text-xs text-gray-700 uppercase bg-gray-50  '>
									<tr>
										{COL_ARR?.map((viewAnnouceData: ColArrType, index: number) => {
											return (
												<th scope='col' className='px-6 py-3   border border-slate-500' key={`${index + 1}`}>
													<div className='flex items-center'>
														{viewAnnouceData.name}
														{viewAnnouceData.sortable && (
															<button title='sort' onClick={() => onHandleSortAnnouncement(viewAnnouceData.fildName)} className='cursor-pointer'>
																{(filterData.sortOrder === '' || filterData.sortBy !== viewAnnouceData.fildName) && (
																	<span className='svg-icon inline-block ml-1 w-3 h-3'>
																		<GetDefaultIcon />
																	</span>
																)}
																{filterData.sortOrder === 'asc' && filterData.sortBy === viewAnnouceData.fildName && <AngleUp />}
																{filterData.sortOrder === 'desc' && filterData.sortBy === viewAnnouceData.fildName && <AngleDown />}
															</button>
														)}
													</div>
												</th>
											);
										})}
									</tr>
								</thead>
								<tbody>
									{userOnlySendTo?.map((data: UserData, index: number) => {
										return (
											<tr className='bg-white border-b     border border-slate-500' key={`${index + 1}`}>
												<th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap    border border-slate-500'>
													{index + 1}
												</th>
												<td className='px-6 py-4   border border-slate-500'>{data.first_name + data.last_name}</td>
												<td className='px-6 py-4   border border-slate-500'>{data.email}</td>
												<td className='px-6 py-4   border border-slate-500'>
													<div className=' w-20'> {renderRole(data?.role)}</div>
												</td>
												<td className='px-6 py-4   border border-slate-500'>{getDateFromat(data?.created_at, DATE_FORMAT.momentDateOfBirth)}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
							{!userOnlySendTo.length && (
								<div className='no-data'>
									<div>{t('No Data')}</div>
								</div>
							)}
						</div>
						<div className='datatable-footer'>
							<span className='datatable-total-records'>
								{`${userOnlySendTo?.length} `}
								<span>{t(' Total Records')}</span>
							</span>
						</div>
					</div>
				</div>
			)}
			{isViewAttachment && (
				<div>
					<ImageModel onClose={onClose} show={isViewAttachment} data={`${IMAGE_BASE_URL}${data?.getAnnoucement?.data?.filePath?.original_file}`} />
				</div>
			)}
		</>
	);
};
export default AnnouncementDetails;
