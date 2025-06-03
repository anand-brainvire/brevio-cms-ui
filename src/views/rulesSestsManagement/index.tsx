import { useMutation, useQuery } from '@apollo/client';
import { GetDefaultIcon, PlusCircle, Trash, ManageRulesSetsIcon, AngleUp, AngleDown, Edit } from '@components/icons/icons';
import { ROUTES, SHOW_PAGE_COUNT_ARR as PAGE_COUNT_RULES, CHANGESTATUS_WARING_TEXT, DELETE_WARING_TEXT, GROUP_DELETE_WARING_TEXT, sortOrder, DEFAULT_PAGE, DEFAULT_LIMIT, STATUS, AccesibilityNames } from '@config/constant';
import { DeleteManageRulesSetsType, GroupDeleteRulesSetsRes, ManageRulesSetsDataArr, UpdateManageRulesSetsStatusType } from '@framework/graphql/graphql';
import { DELETE_MANAGE_RULES_SETS, GROUP_DELETE_RULES_SETS, UPDATE_MANAGE_RULES_SETS_STATUS } from '@framework/graphql/mutations/manageRulesSets';
import { GET_RULES_SETS } from '@framework/graphql/queries/manageRulesSets';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ColArrType } from '@type/common';
import { FilterDataArrRulesProps, PaginationParamsRulesSets } from '@type/manageRulesSets';
import FilterManageRulesSets from '@views/rulesSestsManagement/filterManageRulesSets';
import Button from '@components/button/button';
import DescriptionModel from '@views/discriptionModel';
import CommonModel from '@components/common/commonModel';
import Pagination from '@components/Pagination/Pagination';
import filterServiceProps from '@components/filter/filter';
import { OptionsPropsForButton } from '@type/component';
import { commonRedirectFun } from '@utils/helpers';

const ManageRulesSets = () => {
	const { t } = useTranslation();
	const { data, refetch: getRulesSets } = useQuery(GET_RULES_SETS, { fetchPolicy: 'network-only' });
	const [updateManageRulesSetsSatatus] = useMutation(UPDATE_MANAGE_RULES_SETS_STATUS);
	const [deleteManageRulesSetById] = useMutation(DELETE_MANAGE_RULES_SETS);
	const [deleteRules] = useMutation(GROUP_DELETE_RULES_SETS);
	const navigate = useNavigate();
	const [rulesSetsObj, setRulesSetsObj] = useState<ManageRulesSetsDataArr>({} as ManageRulesSetsDataArr);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [isDeleteRuleSets, setIsDeleteRuleSets] = useState<boolean>(false);
	const [description, setDescription] = useState<string>('');
	const [isDescriptionModelShow, setIsDescriptionModelShow] = useState<boolean>(false);
	const COL_ARR_RULES = [
		{ name: 'Sr.No', sortable: false },
		{ name: t('Rule Name'), sortable: true, fieldName: 'rule_name' },
		{ name: t('Description'), sortable: false, fieldName: 'description' },
		{ name: t('Times Triggered'), sortable: false, fieldName: 'times_triggered' },
		{ name: t('Status'), sortable: true, fieldName: 'status' },
	] as ColArrType[];
	const [isDeleteConfirmationOpenRules, setIsDeleteConfirmationOpenRules] = useState<boolean>(false);
	const [selectedAllRules, setSelectedAllRules] = useState<boolean>(false);
	const [selectedRules, setSelectedRules] = useState<string[]>([]);
	const [filterData, setFilterData] = useState<PaginationParamsRulesSets>({
		page: DEFAULT_PAGE,
		ruleName: '',
		status: null,
		limit: DEFAULT_LIMIT,
		sortOrder: sortOrder,
		sortBy: '',
	});
	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
	const totalRuleSets = data?.fetchSetRules.data?.count || 0;
	const totalPages = Math.ceil(totalRuleSets / recordsPerPage);

	/**
	 * Handle's page chnage
	 */
	const handlePageChangeRules = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
		};
		setSelectedRules([]);
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterRuleSets', JSON.stringify(updatedFilterData));
	}, []);
	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filterRuleSets', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortRules = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};

	/**method that sets all rules sets s selected */
	useEffect(() => {
		if (selectedAllRules) {
			getRulesSets().then((res) => {
				setSelectedRules(res?.data?.fetchSetRules?.data?.ruleData?.map((mappedSelectedRules: ManageRulesSetsDataArr) => mappedSelectedRules?.uuid));
			});
		}
	}, [data?.fetchSetRules]);
	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsStatusModelShow(false);
		setIsDeleteRuleSets(false);
		setIsDeleteConfirmationOpenRules(false);
		setIsDescriptionModelShow(false);
	}, []);

	/**
	 * Method used for change rules sets  status with API
	 */
	const changeRulesSetsStatus = useCallback(() => {
		updateManageRulesSetsSatatus({
			variables: {
				updateRuleStatusId: rulesSetsObj?.uuid,
				status: rulesSetsObj.status === STATUS.active ? STATUS.inactive : STATUS.active,
			},
		})
			.then((res) => {
				const data = res.data as UpdateManageRulesSetsStatusType;
				if (data?.updateRuleStatus?.meta?.statusCode === 200) {
					toast.success(data?.updateRuleStatus?.meta?.message);
					setIsStatusModelShow(false);
					getRulesSets(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isStatusModelShow]);
	/**
	 * Method used for change manage rules status model
	 */
	function onChangeStatusRules(data: ManageRulesSetsDataArr) {
		setIsStatusModelShow(true);
		setRulesSetsObj(data);
	}

	/**
	 * Method used for delete rules sets data
	 */
	const deleteRulesSets = useCallback(() => {
		deleteManageRulesSetById({
			variables: {
				deleteSetRuleId: rulesSetsObj?.uuid,
			},
		})
			.then((res) => {
				const data = res?.data as DeleteManageRulesSetsType;
				if (data?.deleteSetRule?.meta?.statusCode === 200) {
					toast.success(data?.deleteSetRule?.meta?.message);
					setIsDeleteRuleSets(false);
					getRulesSets(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isDeleteRuleSets]);

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const onSearchManageRulesSets = useCallback((values: FilterDataArrRulesProps) => {
		setSelectedRules([]);
		setFilterData({
			...filterData,
			ruleName: values.ruleName,
			status: values.RulesStatus === '' ? null : +values.RulesStatus,
			page: DEFAULT_PAGE,
		});
	}, []);
	/**
	 * if filter data changes then retchs the data as per the filterdata
	 */
	useEffect(() => {
		getRulesSets(filterData).catch((err) => toast.error(err));
	}, [filterData]);

	/**
	 * Method that handles group delete
	 */
	const confirmDeleteRules = useCallback(() => {
		// Perform the mutation to delete the selected manage rules sets
		deleteRules({
			variables: { groupDeleteSetRulesId: selectedRules },
		})
			.then((res) => {
				const data = res?.data as GroupDeleteRulesSetsRes;
				if (data?.groupDeleteSetRules?.meta?.statusCode === 200) {
					toast.success(data?.groupDeleteSetRules?.meta?.message);
					setIsDeleteConfirmationOpenRules(false);
					getRulesSets(filterData).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to delete manage Rules sets'));
			});
		setSelectedRules([]);
	}, [selectedRules]);
	// method used to set all check box based on length
	useEffect(() => {
		if (selectedRules?.length === data?.fetchSetRules?.data?.ruleData?.length) {
			setSelectedAllRules(true);
		} else {
			setSelectedAllRules(false);
		}
	}, [selectedRules]);
	// method used to show model for group deletion
	const handleDeleteRulesSets = useCallback(() => {
		if (selectedRules?.length > 0) {
			setIsDeleteConfirmationOpenRules(true);
		} else {
			toast.error('Please select atleast one record');
		}
	}, [selectedRules]);
	// method used to set individual checkboxs to cheked or unchecked
	const handleSelectRuleSet = (rulesId: string) => {
		// Check if the rules sets  ID is already selected
		let updateSelectedRulesSets = [...selectedRules];

		const isSelected = updateSelectedRulesSets?.includes(rulesId);
		if (isSelected) {
			// If the rules sets  ID is already selected, remove it from the selection
			updateSelectedRulesSets = updateSelectedRulesSets.filter((id: string) => id !== rulesId);
		} else {
			// If the rules sets  ID is not selected, add it to the selection
			updateSelectedRulesSets = [...updateSelectedRulesSets, rulesId];
		}
		setSelectedRules(updateSelectedRulesSets);
	};
	// method used set all checkboxs  checked or unchecked
	const handleSelectAllRules = (event: React.ChangeEvent<HTMLInputElement>) => {
		let updateSelectedRulesSets = [...selectedRules];
		if (!event?.target?.checked) {
			// Select all checkboxes
			updateSelectedRulesSets = [];
			setSelectedRules(updateSelectedRulesSets);
		} else {
			// Deselect all checkboxes
			updateSelectedRulesSets = data?.fetchSetRules.data?.ruleData?.map((mappedSelectedRules: ManageRulesSetsDataArr) => {
				return mappedSelectedRules?.uuid;
			});
			setSelectedRules(updateSelectedRulesSets);
		}
	};
	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelectRules = (e: string) => {
		setRecordsPerPage(Number(e));
		const updatedFilterData = {
			...filterData,
			limit: parseInt(e),
			page: DEFAULT_PAGE,
		};
		setSelectedRules([]);
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterRuleSets', JSON.stringify(updatedFilterData));
	};

	// method used set description model visisble
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
	const addRedirectionRules = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.manageRulesSets}/${ROUTES.add}`);
	}, []);
	const clearSelectionRuleSets = useCallback(() => {
		setSelectedRules([]);
	}, [selectedRules]);
	const deleteRulesetsFun = useCallback(
		(options: OptionsPropsForButton) => {
			setRulesSetsObj(options?.data as unknown as ManageRulesSetsDataArr);
			setIsDeleteRuleSets(true);
		},
		[rulesSetsObj, isDeleteRuleSets]
	);
	return (
		<div>
			<FilterManageRulesSets onSearchManageRulesSets={onSearchManageRulesSets} clearSelectionRuleSets={clearSelectionRuleSets} />
			<div className='card-table'>
				<div className='card-header flex-wrap gap-2'>
					<div className='flex items-center '>
						<span className='w-3.5 h-3.5 mr-2 fill-gray-700 inline-block svg-icon'>
							<ManageRulesSetsIcon />
						</span>
						<span className='text-sm font-normal'>{t('Rule Sets List')} </span>
					</div>
					<div className='btn-group  flex gap-y-2 flex-wrap  '>
						<Button className='btn-primary ' onClick={handleDeleteRulesSets} type='button' label={t('Delete Selected')} disabled={!selectedRules.length}>
							<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
								<Trash />
							</span>
						</Button>
						<Button className='btn-primary ' onClick={addRedirectionRules} type='button' label={t('Add New')}>
							<span className='inline-block w-4 h-4 mr-1 svg-icon'>
								<PlusCircle />
							</span>
						</Button>
					</div>
				</div>
				<div className='card-body'>
					<div className='table-select-dropdown-container justify-start'>
						<span className='table-select-dropdown-label'>{t('Show')}</span>
						<select aria-label={AccesibilityNames.Entries} className='table-select-dropdown' onChange={(e) => onPageDrpSelectRules(e.target.value)} value={filterData.limit}>
							{PAGE_COUNT_RULES?.map((item: number) => {
								return <option key={item}>{item}</option>;
							})}
						</select>
						<span className=' table-select-dropdown-label'>{t('entries')}</span>
					</div>
					<div className='overflow-auto custom-datatable '>
						<table>
							<thead>
								<tr>
									<th scope='col'>
										<div className='flex justify-center items-center'>
											<input type='checkbox' className='checkbox' checked={selectedRules?.length === data?.fetchSetRules.data?.ruleData?.length} onChange={handleSelectAllRules} />
										</div>
									</th>
									{COL_ARR_RULES?.map((rulesVal: ColArrType) => {
										return (
											<th scope='col' key={rulesVal.fieldName}>
												<div className={`flex items-center ${rulesVal.name === t('Description') || rulesVal.name === 'Sr.No' || rulesVal.name == t('Status') ? 'justify-center' : ''}`}>
													{rulesVal.name}
													{rulesVal.sortable && (
														<button title='sort' onClick={() => onHandleSortRules(rulesVal.fieldName)} className='cursor-pointer'>
															{(filterData.sortOrder === '' || filterData.sortBy !== rulesVal.fieldName) && (
																<span className='svg-icon inline-block ml-1 w-3 h-3'>
																	<GetDefaultIcon />
																</span>
															)}
															{filterData.sortOrder === 'asc' && filterData.sortBy === rulesVal.fieldName && <AngleUp />}
															{filterData.sortOrder === 'desc' && filterData.sortBy === rulesVal.fieldName && <AngleDown />}
														</button>
													)}
												</div>
											</th>
										);
									})}
									<th scope='col'>
										<div className='flex items-center justify-center'>{t('Action')}</div>
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.fetchSetRules.data?.ruleData?.map((data: ManageRulesSetsDataArr, index: number) => {
									return (
										<tr key={data.id}>
											<td>
												<div className='flex justify-center items-center'>
													<input type='checkbox' className='checkbox' id={`${data.id}`} checked={selectedRules?.includes(data.uuid)} onChange={() => handleSelectRuleSet(data.uuid)} />
												</div>
											</td>
											<th scope='row' className=' font-normal text-gray-700 text-center whitespace-nowrap '>
												{index + 1}
											</th>
											<td>{data.rule_name} </td>
											<td className='text-center'>
												{data.description.length > 20 ? data.description.slice(0, 20) : data.description}
												{data.description.length > 20 ? (
													<button title='Show more' className='text-red-500 hover:underline cursor-pointer' onClick={() => descriptionHandler(data.description)}>
														Show more...
													</button>
												) : (
													''
												)}
											</td>
											<td>{data.times_triggered ?? 0}</td>
											<td>
												<div className=' flex justify-center'>{data.status === STATUS.active ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>}</div>
											</td>
											<td>
												<div className='flex justify-center '>
													<Button icon={<Edit />} data={data} route={ROUTES.manageRulesSets} onClick={commonRedirectFun} label={''} className='btn-default' />
													<div className='flex justify-center px-2 py-1'>
														<span aria-label='toggle-status'
															aria-hidden='true' onClick={() => onChangeStatusRules(data)} className='font-medium text-blue-600 mt-2  hover:underline'>
															<label aria-label='toggle-status' aria-hidden='true' className='relative inline-flex items-center cursor-pointer'>
																<input type='checkbox' className='sr-only peer' value={data.status} checked={data.status === STATUS.active} readOnly />
																<div className={'w-7 h-4 bg-gray-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200   peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all  peer-checked:bg-primary'}></div>
															</label>
														</span>
													</div>
													<div>
														<Button data={data} route={''} onClick={deleteRulesetsFun} icon={<Trash />} spanClassName='svg-icon inline-block h-3.5 w-3.5' label={''} className='btn-default' />
													</div>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{(data?.fetchSetRules?.data === null || data?.fetchSetRules?.data === undefined) && (
							<div className='no-data'>
								<div>{t('No Data')}</div>
							</div>
						)}
					</div>
					<div className='datatable-footer'>
						<div className='datatable-total-records'>
							{`${data?.fetchSetRules.data?.count === null || data?.fetchSetRules.data?.count === undefined ? '0' : data?.fetchSetRules.data?.count}`}
							<span className='ml-1'>{t(' Total Records')}</span>
						</div>
						<Pagination currentPage={filterData.page} totalPages={totalPages} onPageChange={handlePageChangeRules} recordsPerPage={recordsPerPage} />
					</div>
				</div>
			</div>
			{isDescriptionModelShow && <DescriptionModel onClose={onClose} data={description} show={isDescriptionModelShow} />}
			{isStatusModelShow && <CommonModel warningText={CHANGESTATUS_WARING_TEXT} onClose={onClose} action={changeRulesSetsStatus} show={isStatusModelShow} />}
			{isDeleteRuleSets && <CommonModel warningText={DELETE_WARING_TEXT} onClose={onClose} action={deleteRulesSets} show={isDeleteRuleSets} />}
			{isDeleteConfirmationOpenRules && <CommonModel warningText={GROUP_DELETE_WARING_TEXT} onClose={onClose} action={confirmDeleteRules} show={isDeleteConfirmationOpenRules} />}
		</div>
	);
};
export default ManageRulesSets;
