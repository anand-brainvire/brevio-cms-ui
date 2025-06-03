import React, { useCallback, useState } from 'react';
import { ColArrType, FilterStateProps, PaginationParams } from '@type/state';
import { useTranslation } from 'react-i18next';
import { ROUTES, sortOrder, sortBy, DEFAULT_LIMIT, DEFAULT_PAGE } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { GET_STATE } from '@framework/graphql/queries/state';
import { DELETE_STATE, CHANGE_STATE_STATUS, GROUP_DELETE_STATE } from '@framework/graphql/mutations/state';
import FilterState from '@views/state/filterState';
import Button from '@components/button/button';
import { Marker, PlusCircle } from '@components/icons/icons';
import filterServiceProps from '@components/filter/filter';
import { PERMISSION_LIST } from '@config/permission';
import RoleBaseGuard from '@components/roleGuard';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';

const State = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [selectedState, setSelectedState] = useState<string[]>([]);
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParams>(
		localFilterData('filterstate') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			name: '',
			stateCode: '',
			status: null,
			countryId: null,
		}
	);
	const COL_ARR_STATE = [
		{ name: t('State Name'), sortable: true, fieldName: 'name', type: 'text' },
		{ name: t('State Code'), sortable: true, fieldName: 'state_code', type: 'text' },
		{ name: t('Country Name'), sortable: true, fieldName: 'name', type: 'text' },
		{ name: t('Created At'), sortable: true, fieldName: 'created_at', type: 'date' },
		{ name: t('Updated At'), sortable: true, fieldName: 'updated_at', type: 'date' },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
	] as ColArrType[];

	/**
	 *
	 * @param values Method used for set filter data
	 */

	const onSearchState = useCallback(
		(values: FilterStateProps) => {
			const updatedFilterData = {
				...filterData,
				...localFilterData('filterstate'),
				name: values.name,
				stateCode: values.stateCode,
				status: parseInt(values.status),
				countryId: parseInt(values.countryId),
				page: DEFAULT_PAGE,
			};
			setFilterData(updatedFilterData);
			filterServiceProps.saveState('filterstate', JSON.stringify(updatedFilterData));
		},
		[filterData]
	);

	/**
	 * Method redirects to add page
	 */
	const handleAddState = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.state}/${ROUTES.add}`);
	}, []);
	/**
	 * Method that clears the selcted data
	 */
	const clearSelectionState = useCallback(() => {
		setSelectedState([]);
	}, [selectedState]);

	return (
		<div>
			<FilterState onSearchState={onSearchState} clearSelectionState={clearSelectionState} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header '>
					<div className='flex items-center'>
						<span className='svg-icon inline-block h-3.5 w-3.5 mr-2 text-md'>
							<Marker />
						</span>
						{t('State List')}
					</div>
					<div className='btn-group flex gap-y-2 flex-wrap  '>
						<RoleBaseGuard permissions={[PERMISSION_LIST.State.AddAccess]}>
							<Button className=' btn-primary   ' onClick={handleAddState} type='button' label={t('Add New')}>
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
						columns={COL_ARR_STATE}
						queryName={GET_STATE}
						sessionFilterName='filterstate'
						singleDeleteMutation={DELETE_STATE}
						multipleDeleteMutation={GROUP_DELETE_STATE}
						updateStatusMutation={CHANGE_STATE_STATUS}
						actionWisePermissions={{
							edit: PERMISSION_LIST.State.EditAccess,
							delete: PERMISSION_LIST.State.DeleteAccess,
							changeStatus: PERMISSION_LIST.State.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.State.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.state,
							},
						}}
						statusKey={'status'}
						idKey={'uuid'}
						multipleDeleteApiId={'groupDeleteStatesId'}
						singleDeleteApiId={'deleteStateId'}
						statusChangeApiId={'changeStateStatusId'}
						statusChangeApiKeyTitle={'status'}
					/>
				</div>
			</div>
		</div>
	);
};
export default State;
