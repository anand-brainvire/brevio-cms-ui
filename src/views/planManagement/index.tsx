import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortBy, sortOrder } from '@config/constant';
import { PlanManagementIcon, PlusCircle } from '@components/icons/icons';
import filterServiceProps from '@components/filter/filter';
import { PERMISSION_LIST } from '@config/permission';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import { FETCH_PLAN_MANAGEMENT } from '@framework/graphql/queries/planManagement';
import { DELETE_SINGLE_PLAN, GROUP_DELETE_PLAN, UPDATE_PLAN_STATUS } from '@framework/graphql/mutations/planManagement';
import Button from '@components/button/button';
import RoleBaseGuard from '@components/roleGuard';
import { useNavigate } from 'react-router-dom';
import FilterPlanManagement from './filterPlanManagement';
import { FilterPlanManagementProps, PaginationParamsPlanMng } from '@type/planManagement';
const PlanManagement = () => {
	const { t } = useTranslation();
	const { localFilterData } = useSaveFilterData();
	const navigate = useNavigate();
	const [filterData, setFilterData] = useState<PaginationParamsPlanMng>(
		localFilterData('filterPlanManagement') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			type: '',
			price: null,
			status: null,
		}
	);
	const [selectedPlans, setSelectedPlans] = useState<Array<string>>([]);

	const COL_ARR_PLAN = [
		{ name: t('Plan Name'), sortable: true, fieldName: 'name', type: 'text' },
		{ name: t('Plan Description'), sortable: true, fieldName: 'description', type: 'text' },
		{ name: t('Plan Price'), sortable: true, fieldName: 'price', type: 'number' },
		{ name: t('Plan Type'), sortable: false, fieldName: 'type', type: 'text' },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
	] as IColumnsProps[];
	/**
	 *
	 * @param e Method used for store search value
	 */
	const onSeachPlanMng = useCallback(
		(values: FilterPlanManagementProps) => {
			const updatedFilterData = {
				...filterData,
				status: parseInt(values.status),
				price: values.price ? +values.price : null,
				type: values.type,
				page: DEFAULT_PAGE,
			};
			setSelectedPlans([]);

			setFilterData(updatedFilterData as PaginationParamsPlanMng);
		},
		[filterData]
	);
	/**
	 * Method that checkcs filter data in session if true sets filter data
	 */
	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filterPlanManagement', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);

	const clearSelectionPlans = useCallback(() => {
		setSelectedPlans([]);
	}, [selectedPlans]);
	/**
	 * Method that redirects to add page
	 */
	const addRedirectionPlan = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.planManagement}/${ROUTES.add}`);
	}, []);
	return (
		<div>
			<FilterPlanManagement onSearchPlan={onSeachPlanMng} filterData={filterData} onClearPlanManagement={clearSelectionPlans} />

			<div className='card-table'>
				<div className='card-header'>
					<div className='flex items-center '>
						<span className='w-3.5 h-3.5 mr-2 inline-block svg-icon'>
							<PlanManagementIcon />
						</span>
						{t('Plan Management List')}
					</div>
					<div className='flex flex-wrap gap-2'>
						<RoleBaseGuard permissions={[PERMISSION_LIST.PlanManagement.AddAccess]}>
							<Button className='btn-primary  ' onClick={addRedirectionPlan} type='button' label={t('Add New')}>
								<span className='inline-block w-4 h-4 mr-1 svg-icon'>
									<PlusCircle />
								</span>
							</Button>
						</RoleBaseGuard>
					</div>
				</div>
				<div className='card-body'>
					<BVDataTable
						defaultActions={['edit', 'delete', 'change_status', 'multiple_delete']}
						columns={COL_ARR_PLAN}
						queryName={FETCH_PLAN_MANAGEMENT}
						sessionFilterName='filterPlanManagement'
						singleDeleteMutation={DELETE_SINGLE_PLAN}
						multipleDeleteMutation={GROUP_DELETE_PLAN}
						updateStatusMutation={UPDATE_PLAN_STATUS}
						actionWisePermissions={{
							edit: PERMISSION_LIST.PlanManagement.EditAccess,
							delete: PERMISSION_LIST.PlanManagement.DeleteAccess,
							changeStatus: PERMISSION_LIST.PlanManagement.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.PlanManagement.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.planManagement,
							},
						}}
						statusKey={'status'}
						idKey={'uuid'}
						multipleDeleteApiId={'uuid'}
						singleDeleteApiId={'uuid'}
						statusChangeApiId={'uuid'}
						statusChangeApiKeyTitle={'status'}
					/>
				</div>
			</div>
		</div>
	);
};
export default PlanManagement;
