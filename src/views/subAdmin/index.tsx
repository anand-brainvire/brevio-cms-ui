import React, { ReactElement, useCallback, useState } from 'react';
import FilterSubAdmin from '@views/subAdmin/filterSubAdmin';
import { ColArrType, FilterSubadminProps, PaginationParams } from '@type/subAdmin';
import { useTranslation } from 'react-i18next';
import { GET_SUBADMIN } from '@framework/graphql/queries/subAdmin';
import { SubAdminDataArr } from '@framework/graphql/graphql';
import { ROUTES, sortOrder, sortBy, DEFAULT_LIMIT, DEFAULT_PAGE} from '@config/constant';
import { CHANGE_SUBADMIN_STATUS, DELETE_SUBADMIN, GROUP_DELETE_SUBADMIN } from '@framework/graphql/mutations/subAdmin';
import { useNavigate } from 'react-router-dom';
import Button from '@components/button/button';
import { PlusCircle, ProfileIcon} from '@components/icons/icons';
import PassWordChange from '@views/subAdmin/changePassword';
import filterServiceProps from '@components/filter/filter';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IListData } from '@components/BVDatatable/DataTable';

const SubAdmin = (): ReactElement => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [subAdminObj, setSubAdminObj] = useState<SubAdminDataArr>({} as SubAdminDataArr);
	const [isChangePasswordModel, setIsChangePasswordModel] = useState<boolean>(false);
	const { localFilterData } = useSaveFilterData();
	const [limit, setLimit] = useState(DEFAULT_LIMIT);
	const [filterData, setFilterData] = useState<PaginationParams>(
		localFilterData('filtersubadmin') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			search: '',
			offset: ((DEFAULT_PAGE ?? DEFAULT_PAGE) - 1) * DEFAULT_LIMIT,
		}
	);
	const COL_ARR_SUB_ADMIN = [
		{ name: t('First Name'), sortable: true, fieldName: 'first_name', type: 'text', headerCenter: true },
		{ name: t('Last Name'), sortable: true, fieldName: 'last_name', type: 'text', headerCenter: true },
		{ name: t('Email'), sortable: true, fieldName: 'email', type: 'text', headerCenter: true },
		{ name: t('Role'), sortable: false, fieldName: 'role_name', type: 'text', headerCenter: true },
		{ name: t('Created At'), sortable: true, fieldName: 'created_at', type: 'date', headerCenter: true },
		{ name: t('Updated At'), sortable: true, fieldName: 'updated_at', type: 'date', headerCenter: true },
		{ name: t('Status'), sortable: true, fieldName: 'is_active', type: 'status', headerCenter: true },
	] as ColArrType[];

	const handleLimitChange = (newLimit:number) => {
	  setLimit(newLimit);
	  setFilterData((prev) => ({ ...prev, limit: newLimit, page: 1 }));
	};

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const onSearchSubAdmin = useCallback((values: FilterSubadminProps) => {
		const updatedFilterData = {
			...filterData,
        	search: values.search.trim(),
			page: DEFAULT_PAGE,
			offset: ((DEFAULT_PAGE ?? filterData.page) - 1) * filterData.limit,
			limit:limit
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filtersubadmin', JSON.stringify(updatedFilterData));
	}, [limit,filterData]);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsChangePasswordModel(false);
	}, []);

	/**
	 * Method redirects to add page
	 */
	const handleAddsubadmin = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.subAdmin}/${ROUTES.add}`);
	}, []);

	/**
	 * Method that enables passowrd popup
	 */
	// const changePasswordSubAdminFun = useCallback(() => {
	// 	setIsChangePasswordModel(true);
	// }, [subAdminObj, isChangePasswordModel]);

	/**
	 * Get data from ref
	 */
	const handleRowRef = useCallback(
		(data: IListData) => {
			setSubAdminObj(data as SubAdminDataArr);
		},
		[subAdminObj]
	);

	return (
		<div>
			<FilterSubAdmin onLimitChange={handleLimitChange} onSearchSubAdmin={onSearchSubAdmin} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header'>
					<div className='flex items-center'>
						<span className='w-3.5 h-3.5 mr-2 text-md leading-4 inline-block svg-icon'>
							<ProfileIcon />
						</span>
						{t('Sub Admin List')}
					</div>
					<div className='btn-group flex gap-y-2 flex-wrap'>
						<RoleBaseGuard permissions={[PERMISSION_LIST.SubAdmin.AddAccess]}>
							<Button className='btn-primary ' onClick={handleAddsubadmin} type='button' label={t('Add New')}>
								<span className='inline-block w-4 h-4 mr-1 svg-icon'>
									<PlusCircle />
								</span>
							</Button>
						</RoleBaseGuard>
					</div>
				</div>
				<div className='card-body'>
					<BVDataTable
						limit={limit}
    					onLimitChange={handleLimitChange}
						defaultActions={['edit', 'delete', 'change_status', 'multiple_delete']}
						columns={COL_ARR_SUB_ADMIN}
						queryName={GET_SUBADMIN}
						sessionFilterName='filtersubadmin'
						singleDeleteMutation={DELETE_SUBADMIN}
						multipleDeleteMutation={GROUP_DELETE_SUBADMIN}
						updateStatusMutation={CHANGE_SUBADMIN_STATUS}
						actionWisePermissions={{
							edit: PERMISSION_LIST.SubAdmin.EditAccess,
							delete: PERMISSION_LIST.SubAdmin.DeleteAccess,
							changeStatus: PERMISSION_LIST.SubAdmin.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.SubAdmin.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData} // Pass the full filterData object
						actionData={{
							edit: {
								route: ROUTES.subAdmin,
							},
						}}
						statusKey={'is_active'}
						idKey={'uuid'}
						multipleDeleteApiId={'groupDeleteSubAdminsId'}
						singleDeleteApiId={'deleteSubAdminId'}
						statusChangeApiId={'toggleSubAdminStatus'}
						statusChangeApiKeyTitle={'status'}
						rowRefData={handleRowRef}
						// extraActions={
						// 	<RoleBaseGuard permissions={[PERMISSION_LIST.SubAdmin.ChangePasswordAccess]}>
						// 		<Button title={AccesibilityNames.ChangePassword} route={''} onClick={changePasswordSubAdminFun} icon={<Key />} spanClassName='svg-icon inline-block h-3.5 w-3.5' label={''} className='btn-default' />
						// 	</RoleBaseGuard>
						// }
					/>
				</div>
			</div>
			{isChangePasswordModel && <PassWordChange onClose={onClose} subAdminObj={subAdminObj} show={isChangePasswordModel} />}
		</div>
	);
};
export default SubAdmin;
