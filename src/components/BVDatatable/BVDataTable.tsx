import { AccesibilityNames, BadgesCodeEnum, BadgesColor,DATE_FORMAT, DEFAULT_LIMIT, DEFAULT_PAGE, DELETE_WARING_TEXT, GROUP_DELETE_WARING_TEXT, ROUTES, SHOW_PAGE_COUNT_ARR, STATUS } from '@config/constant';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import { IBVDataTablesProps, IFilterTypes, IListData } from '@components/BVDatatable/DataTable';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import filterServiceProps from '@components/filter/filter';
import { AngleDown, AngleUp, Edit, Eye, GetDefaultIcon, Trash } from '@components/icons/icons';
import RoleBaseGuard from '@components/roleGuard';
import { useTranslation } from 'react-i18next';
import { getDateFromat } from '@utils/helpers';
import Pagination from '@components/Pagination/Pagination';
import { useApolloClient, useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { useNavigate } from 'react-router-dom';
import CommonModel from '@components/common/commonModel';
import { toast } from 'react-toastify';
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator';
import ImageModel from '@views/imageModel';
import { Rating } from 'primereact/rating';
import DescriptionModel from '@views/discriptionModel';
import ImageCell from './imageCell';
import TextCell from './textCell';
import BadgeCell from './badgeCell';

const BVDataTable = ({ columns, queryName, singleDeleteMutation, multipleDeleteMutation, updateStatusMutation, sessionFilterName, updatedFilterData, actionWisePermissions, defaultActions, actionData, extraActions, statusKey, idKey, multipleDeleteApiId, rowRefData }: IBVDataTablesProps): ReactElement => {
	const { localFilterData } = useSaveFilterData();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [listData, setListData] = useState<IListData[]>([]);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [totalRecords, setTotalRecords] = useState<number>(0);
	const [selectedList, setSelectedList] = useState<string[]>([]);
	const [singleDeleteId, setSingleDeleteId] = useState<string>('');
	const [isDeletePopup, setIsDeletePopup] = useState<boolean>(false);
	const [statusChangeId, setStatusChangeId] = useState<string>('');
	const [currentStatus, setCurrentStatus] = useState<string | number>('');
	const [nextStatus, setNextStatus] = useState<'active' | 'inactive'>('active');
	const [isStatusPopup, setIsStatusPopup] = useState<boolean>(false);
	const [isImageModelShow, setIsImageModelShow] = useState<boolean>(false);
	const [imageURL, setImageURL] = useState<string | number>('');
	const [showDescriptionModelShow, setShowDescriptionModelShow] = useState<boolean>(false);

	const [description, setDescription] = useState<string>('');
	const descriptionHandler = (value: string) => {
		setDescription(value);
		setShowDescriptionModelShow((prev) => !prev);
	};
	const [loadingState, setLoadingState] = useState<boolean>(false);
	const client = useApolloClient();

	/**
	 * Initialize a Filter
	 */
	const [filterData, setFilterData] = useState<IFilterTypes>(
		localFilterData(sessionFilterName) ?? {
			page: DEFAULT_PAGE,
			limit: DEFAULT_LIMIT,
			sortBy: 'created_at',
			sortOrder: 'desc',
			...updatedFilterData,
		}
	);
	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);

	/**
	 * Data Fetching Query
	 */
	const { data, refetch } = useQuery(queryName, {
		variables: {
			...filterData, // Use the merged filterData state
		},
		fetchPolicy: 'network-only',
	});

	/**
	 * After Data comes from api end handle the data structure
	 */
	useEffect(() => {
		if (data) {
			handleToSetDataListing();
		}
	}, [data]);

	/**
	 * Update Filter Data Values
	 */
	useEffect(() => {
		const tableFilterData = {
			...filterData,
			...updatedFilterData,
		};
		setSelectedList([]);
		setFilterData(tableFilterData);
		filterServiceProps.saveState(sessionFilterName, JSON.stringify(tableFilterData));
	}, [updatedFilterData]);

	/**
	 * Set Per Page Limit
	 */
	useEffect(() => {
		setRecordsPerPage(filterData.limit);
	}, [filterData.limit]);

	/**
	 * Particular Format Filter Data Settings
	 */
	const handleToSetDataListing = () => {
		const firstLevelKey = Object.keys(data)?.[0];
		const topLevel = data?.[firstLevelKey];

		if (topLevel?.data && typeof topLevel.data === 'object') {
			const arrayKey = Object.keys(topLevel.data).find(
				(key) => Array.isArray(topLevel.data[key])
			);

			const list = arrayKey ? topLevel.data[arrayKey] : [];
			const count = typeof topLevel.data.count === 'number' ? topLevel.data.count : list.length;

			setListData(list);
			setTotalRecords(count);
			setTotalPages(Math.ceil(count / filterData.limit));
		} else {
			setListData([]);
			setTotalRecords(0);
			setTotalPages(0);
		}
	};

	/**
	 * Handle On Sorting changes
	 */
	const handleOnSort = useCallback(
		(sortFieldName: string) => {
			const updatedFilterData = {
				...filterData,
				page: DEFAULT_PAGE,
				sortBy: sortFieldName,
				sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
			};
			setSelectedList([]);
			setFilterData(updatedFilterData);
			filterServiceProps.saveState(sessionFilterName, JSON.stringify(updatedFilterData));
		},
		[filterData]
	);

	/**
	 * Handle the pagination change event
	 */

	const handlePageChange = useCallback(
		(newPage: number): void => {
			const updatedFilterData = {
				...filterData,
				page: newPage,
				offset: (newPage - 1) * filterData.limit, // <-- Add this line
			};
			setSelectedList([]);
			setFilterData(updatedFilterData);
			filterServiceProps.saveState(sessionFilterName, JSON.stringify(updatedFilterData));
		},
		[filterData]
	);

	/**
	 * Handle Page Count Change event
	 * @param e string
	 */
	const handlePageCountChange = (e: string) => {
		setRecordsPerPage(Number(e));
		const updatedFilterData = {
			...filterData,
			limit: parseInt(e),
			page: DEFAULT_PAGE,
			offset: 0,
		};
		setSelectedList([]);
		setFilterData(updatedFilterData);
		filterServiceProps.saveState(sessionFilterName, JSON.stringify(updatedFilterData));
	};

	/**
	 * Handle Select All
	 * @param event
	 */
	// const handleOnSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	let updateSelected = [...selectedList];
	// 	if (!event.target.checked) {
	// 		updateSelected = [];
	// 		setSelectedList(updateSelected);
	// 	} else {
	// 		updateSelected = listData?.map((data) => data?.[`${idKey}`]);
	// 		setSelectedList(updateSelected);
	// 	}
	// };

	/**
	 * Handle Single Selection
	 * @param id
	 */
	// const handleSingleSelect = (id: string) => {
	// 	let updateSelected = [...selectedList];
	// 	const isSelected = updateSelected?.includes(id);
	// 	if (isSelected) {
	// 		updateSelected = updateSelected.filter((filterId: string) => filterId !== id);
	// 	} else {
	// 		updateSelected = [...updateSelected, id];
	// 	}
	// 	setSelectedList(updateSelected);
	// };

	const openImageModel = useCallback((url: string) => {
		setImageURL(url);
		setIsImageModelShow(true);
	}, []);

	/**
	 * Single and Multiple Delete Popup open
	 */
	const deletePopup = useCallback(
		(id: string | string[], type: string) => {
			if (type === 'single') {
				setSingleDeleteId(id as string);
			} else if (selectedList?.length <= 0) {
				toast.error('Please select atleast one record');
				return true;
			}
			setIsDeletePopup(true);
		},
		[singleDeleteId, isDeletePopup, selectedList]
	);

	/**
	 * Multiple Delete Items
	 */
	const multipleDeleteAction = useCallback(() => {
		// Perform the mutation to delete the selected manage rules sets

		if (multipleDeleteMutation) {
			setLoadingState(true);
			client
				.mutate({
					fetchPolicy: 'network-only',
					mutation: multipleDeleteMutation,
					variables: {
						[multipleDeleteApiId ? `${multipleDeleteApiId}` : `${idKey}`]: selectedList,
					},
				})
				.then((res) => {
					const data = res?.data;
					const firstLevelKey = Object.keys(data);
					if (data?.[`${firstLevelKey}`]?.meta?.statusCode === 200) {
						setLoadingState(false);
						toast.success(data?.[`${firstLevelKey}`]?.meta?.message);
						setIsDeletePopup(false);
						setSingleDeleteId('');
						onClose(false);
						setSelectedList([]);
					}
				})
				.catch(() => {
					return setLoadingState(false);
				});
		}
	}, [selectedList, loadingState]);

	/**
	 * Delete Single items
	 */
	const singleDeleteAction = useCallback(() => {
		setLoadingState(true);
		if (singleDeleteMutation) {
			client
				.mutate({
					fetchPolicy: 'network-only',
					mutation: singleDeleteMutation,
					variables: {
						uuid: singleDeleteId,
					},
				})
				.then((res) => {
					const data = res?.data;
					const firstLevelKey = Object.keys(data);
					if (data?.[`${firstLevelKey}`]?.meta?.statusCode === 200) {
						setLoadingState(false);
						toast.success(data?.[`${firstLevelKey}`]?.meta?.message);
						setIsDeletePopup(false);
						setSingleDeleteId('');
						onClose(false);
					}
				})
				.catch(() => {
					return setLoadingState(false);
				});
		}
	}, [isDeletePopup, singleDeleteId, loadingState]);

	const statusPopup = useCallback(
		(id: string, status: string | number) => {
			setStatusChangeId(id);
			setCurrentStatus(status);
			setNextStatus(+status === STATUS.active ? 'inactive' : 'active');
			setIsStatusPopup(true);
		},
		[statusChangeId, isStatusPopup, currentStatus]
	);

	const changeStatusAction = useCallback(() => {
		setLoadingState(true);
		if (updateStatusMutation) {
			client
				.mutate({
					fetchPolicy: 'network-only',
					mutation: updateStatusMutation,
					variables: {
						uuid: statusChangeId, // <--- THIS IS WHERE THE UUID IS SENT
					},
				})
				.then((res) => {
					const data = res.data;
					const firstLevelKey = Object.keys(data);
					if (data?.[`${firstLevelKey}`]?.meta?.statusCode === 200) {
						setLoadingState(false);
						toast.success(data?.[`${firstLevelKey}`]?.meta?.message);
						setIsStatusPopup(false);
						setCurrentStatus('');
						setStatusChangeId('');
						onClose(false);
					}
				})
				.catch(() => {
					return setLoadingState(false);
				});
		}
	}, [isStatusPopup, currentStatus, statusChangeId, loadingState]);

	/**
	 * Handle Single & Multiple Delete.
	 */
	const onClose = useCallback(
		(isRefresh = true) => {
			setIsDeletePopup(false);
			setIsStatusPopup(false);
			setIsImageModelShow(false);
			setShowDescriptionModelShow(false);
			if (!isRefresh) {
				refetch();
			}
		},
		[isDeletePopup, isStatusPopup]
	);

	/**
	 * If Inside Object key needed then used
	 * @param columns
	 * @param row
	 * @returns
	 */
	const getApiColumnName = (columns: string, row: IListData) => {
		const column = columns?.split('.');

		if (column.length === 1) {
			return row?.[column?.[0]] ?? '';
		} else {
			let result = row;

			for (const element of column) {
				result = result?.[element] ?? '';
			}
			return result;
		}
	};
	return (
		<>
			{loadingState && <LoadingIndicator />}
			<div className='table-select-dropdown-container w-full'>
				<div className='flex items-center space-x-2 justify-between w-full'>
					<div>
						<span className='table-select-dropdown-label'>{t('Show')}</span>
						<select aria-label={AccesibilityNames.Entries} className='table-select-dropdown' onChange={(e) => handlePageCountChange(e.target.value)} value={filterData.limit}>
							{SHOW_PAGE_COUNT_ARR?.map((item: number) => {
								return <option key={item}>{item}</option>;
							})}
						</select>
						<span className='table-select-dropdown-label'>{t('entries')}</span>
					</div>
				</div>
			</div>
			<div className='overflow-auto custom-datatable relative'>
				<table>
					<thead>
						<tr>
							{columns?.map((column, index: number) => {
								return (
									<th scope='col' key={`${index + 1}`}>
										<div className={`flex items-center ${column?.headerCenter && 'justify-center'} `}>
											{column?.name}
											{column.sortable && (
												<button title='Sort' className='cursor-pointer' onClick={() => handleOnSort(column.sortKey || column?.fieldName)}>
													{(filterData?.sortOrder === '' || filterData?.sortBy !== (column.sortKey || column?.fieldName)) && (
														<span className='svg-icon inline-block ml-1 w-3 h-3'>
															<GetDefaultIcon />
														</span>
													)}
													{filterData?.sortOrder === 'asc' && filterData?.sortBy === (column.sortKey || column.fieldName) && <AngleUp />}
													{filterData?.sortOrder === 'desc' && filterData?.sortBy === (column.sortKey || column.fieldName) && <AngleDown />}
												</button>
											)}
										</div>
									</th>
								);
							})}
							{defaultActions && defaultActions.length > 0 && (
								<RoleBaseGuard permissions={[actionWisePermissions?.edit ?? '', actionWisePermissions?.delete ?? '', actionWisePermissions?.changeStatus ?? '', actionWisePermissions?.view ?? '', actionWisePermissions?.multipleDelete ?? '']}>
									<th scope='col'>
										<div className='flex items-center justify-center'>{t('Action')}</div>
									</th>
								</RoleBaseGuard>
							)}
						</tr>
					</thead>
					<tbody>
						{listData?.map((row) => {
							return (
								<tr className='text-left' key={row?.[`${idKey}`] ?? row.uuid}>
									{columns?.map((column) => (
										<td className='text-center' key={column.name}>
											{column.type === 'image' && <ImageCell
												column={column}
												row={row}
												openImageModel={openImageModel}
											/>}
											{column.type === 'date' && getDateFromat(
												typeof row?.[column.fieldName] === 'string' && /^\d+$/.test(row?.[column.fieldName])
													? Number(row?.[column.fieldName])
													: row?.[column.fieldName],
												DATE_FORMAT.momentDateTime24Format
											)}
											{column.type === 'number' && row?.[column.fieldName]}
											{column.type === 'text' &&
												(<TextCell
													text={getApiColumnName(column.fieldName, row)}
													descriptionHandler={descriptionHandler}
												/>)}
											{column.type === 'multilang' && (
												<span>
													{
														// Always show 'en' for now
														column.translationKey
															? (
																	row[column.fieldName]?.find?.(
																		(tr: any) => tr.lang_code === 'en'
																	)?.[column.translationKey] ||
																	row[column.fieldName]?.[0]?.[column.translationKey] ||
																	''
																)
															: ''
													}
												</span>
											)}
											{column.type === 'multipleText' && (
												<span>
													{Array.isArray(row[column.fieldName])
														? row[column.fieldName]
																.map((item: any) => item.name)
																.filter(Boolean)
																.join(', ')
														: ''}
												</span>
											)}
											{column.type === 'status' && (
												<div className=' flex justify-center'>
													{row?.[column.fieldName] === true || row?.[column.fieldName] === 1 ? (
														<span className='badge badge-success rounded'>{t('Active')}</span>
													) : (
														<span className='badge badge-danger rounded'>{t('InActive')}</span>
													)}
												</div>
											)}
											{column.type === 'bookStatus' && (
												<div className='flex flex-col items-center justify-center'>
													{row?.[column.fieldName] === 'published' ? (
														<span className='badge badge-success rounded'>{t('Published')}</span>
													) : row?.[column.fieldName] === 'unpublished' ? (
														<span className='badge badge-danger rounded'>{t('Unpublished')}</span>
													) : (
														<span className='badge badge-warning rounded'>{t('Draft')}</span>
													)}
											
													{/* Show "Modified" label if is_content_modified is true */}
													{row?.is_content_modified && (
														<span className='text-xs text-gray-500 mt-1'>{t('Modified')}</span>
													)}
												</div>
											)}
											{column.type === 'ratings' && <Rating value={+row?.[column.fieldName]} cancel={false} style={{ display: 'flex' }} />}
											{column.type === 'badge' && (
												<BadgeCell
													BadgesColor={BadgesColor[
														BadgesCodeEnum[
														row?.[column.fieldName]
														] as keyof typeof BadgesCodeEnum
													] || ''}
													BadgesCode={BadgesCodeEnum[row?.[column.fieldName]]}
													conversationValue={column?.conversationValue?.[
														row?.[column.fieldName]
													]}
												/>
											)}
										</td>
									))}
									{defaultActions && defaultActions.length > 0 && (
										<RoleBaseGuard permissions={[actionWisePermissions?.edit ?? '', actionWisePermissions?.delete ?? '', actionWisePermissions?.changeStatus ?? '', actionWisePermissions?.view ?? '', actionWisePermissions?.multipleDelete ?? '']}>
											<td>
												<div className='flex justify-center'>
													{defaultActions?.includes('edit') && actionWisePermissions?.edit && (
														<RoleBaseGuard permissions={[actionWisePermissions?.edit]}>
															<Button title={AccesibilityNames.Edit} icon={<Edit />} data={data} onClick={() => navigate(`/${ROUTES.app}/${actionData?.edit?.route}/edit/${row?.[idKey]}`)} className='btn-default' />
														</RoleBaseGuard>
													)}

													{defaultActions?.includes('view') && (
														<RoleBaseGuard permissions={[actionWisePermissions?.view ?? '']}>
															<Button title={AccesibilityNames.View} icon={<Eye />} data={data} onClick={() => navigate(`/${ROUTES.app}/${actionData?.view?.route}/view/${row?.[idKey]}`)} className='btn-default' />
														</RoleBaseGuard>
													)}
													{defaultActions?.includes('change_status') && actionWisePermissions?.changeStatus && (
														<RoleBaseGuard permissions={[actionWisePermissions?.changeStatus]}>
															<div title={t('Change Status') ?? ''} className='flex justify-center'>
																<span aria-label={row?.[`${statusKey}`]} aria-hidden='true' onClick={() => statusPopup(row?.[`${idKey}`], row?.[`${statusKey}`])} className='font-medium text-blue-600 mt-2 hover:underline'>
																	<label aria-label={row?.[`${statusKey}`]} aria-hidden='true' title={t(AccesibilityNames.ChangeStatus).toString()} className='relative inline-flex items-center cursor-pointer'>
																		<input
																			type='checkbox'
																			className='sr-only peer'
																			value={+row?.[`${statusKey}`]} // Converts true → 1, false → 0
																			checked={+row?.[`${statusKey}`] === STATUS.active}
																			readOnly
																		/>
																		<div className={'w-7 h-4 bg-gray-400 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200   peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all  peer-checked:bg-primary'}></div>
																	</label>
																</span>
															</div>
														</RoleBaseGuard>
													)}
													{defaultActions?.includes('change_book_status') && actionWisePermissions?.changeStatus && (
													<RoleBaseGuard permissions={[actionWisePermissions?.changeStatus]}>
														<div title={t('Change Status') ?? ''} className='flex justify-center'>
															<span
																aria-label={row?.[`${statusKey}`]} aria-hidden='true' className='font-medium text-blue-600 mt-2'>
																<label
																	title={t(AccesibilityNames.ChangeStatus).toString()}
																	className={`relative inline-flex items-center cursor-pointer ${row?.[`${statusKey}`] === 'draft' ? 'cursor-not-allowed opacity-50' : ''}`}>
																	<input
																		type='checkbox'
																		className='sr-only peer'
																		value={row?.[`${statusKey}`]}
																		checked={row?.[`${statusKey}`] === 'published'}
																		onChange={() => {
																			// Only allow toggle if not in 'draft'
																			if (row?.[`${statusKey}`] !== 'draft') {
																				statusPopup(row?.[`${idKey}`], row?.[`${statusKey}`]);
																			}
																		}}
																		disabled={row?.[`${statusKey}`] === 'draft'}
																	/>
																	<div className='w-7 h-4 bg-gray-400 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary'></div>
																</label>
															</span>
														</div>
													</RoleBaseGuard>
													)}

													{defaultActions?.includes('delete') && actionWisePermissions?.delete && (
														<RoleBaseGuard permissions={[actionWisePermissions?.delete]}>
															<Button title={AccesibilityNames.Delete} route={''} onClick={() => deletePopup(row?.[`${idKey}`], 'single')} icon={<Trash />} spanClassName='svg-icon inline-block h-3.5 w-3.5' className='btn-default' />
														</RoleBaseGuard>
													)}
													{extraActions && rowRefData && <span aria-label='custom-action' aria-hidden='true' onClick={() => rowRefData(row)}>{extraActions}</span>}
												</div>
											</td>
										</RoleBaseGuard>
									)}
								</tr>
							);
						})}
					</tbody>
				</table>

				{loadingState && (
					<div className='w-full px-2.5 py-2 bg-white bg-opacity-75 flex justify-center transition-all duration-200 ease-in-out absolute top-10 '>
						<div className='text-xl'>{t('Processing...')}</div>
					</div>
				)}
				{listData?.length <= 0 && (
					<div className='no-data'>
						<div>{t('No Data')}</div>
					</div>
				)}
			</div>
			<div className='datatable-footer'>
				<div className='datatable-total-records'>{`${t(' Total Records :')} ${totalRecords ?? 0}`}</div>
				{totalPages > 0 && <Pagination currentPage={filterData?.page} totalPages={totalPages} onPageChange={handlePageChange} recordsPerPage={recordsPerPage} />}
			</div>
			{isDeletePopup && (singleDeleteId ? <CommonModel warningText={DELETE_WARING_TEXT} onClose={onClose} action={singleDeleteAction} show={isDeletePopup} /> : <CommonModel warningText={GROUP_DELETE_WARING_TEXT} onClose={onClose} action={multipleDeleteAction} show={isDeletePopup} />)}
			{isStatusPopup && (
				<CommonModel
					warningText={`Are you sure want to change user status to ${nextStatus}?`}
					onClose={onClose}
					action={changeStatusAction}
					show={isStatusPopup}
				/>
			)}
			{isImageModelShow && <ImageModel onClose={onClose} data={`${imageURL}`} show={isImageModelShow} />}
			{showDescriptionModelShow && <DescriptionModel onClose={onClose} data={description} show={showDescriptionModelShow} />}
		</>
	);
};

export default BVDataTable;
