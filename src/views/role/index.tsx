import React, { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ROLES_DATA } from '@framework/graphql/queries/role';
import { RoleDataArr } from '@framework/graphql/graphql';
import { UPDATE_ROLE_STATUS, DELETE_ROLE } from '@framework/graphql/mutations/role';
import { useTranslation } from 'react-i18next';
import { PaginationParams, RoleProps } from '@type/role';
import { AccesibilityNames, DEFAULT_LIMIT, DEFAULT_PAGE, sortBy, sortOrder } from '@config/constant';
import AddEditRole from '@views/role/addEditRole';

import Button from '@components/button/button';
import { Edit, MenuBurger, PlusCircle } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import filterServiceProps from '@components/filter/filter';
import { OptionsPropsForButton } from '@type/component';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps, IListData } from '@components/BVDatatable/DataTable';

const RolePermission = ({ refetchRoleData }: RoleProps) => {
	const [isRoleModelShow, setIsRoleModelShow] = useState<boolean>(false);
	const [roleObj, setRoleObj] = useState<RoleDataArr>({} as RoleDataArr);
	const [roleVal, setRoleVal] = useState<string>('');
	const { t } = useTranslation();
	const [isRoleEditable, setIsRoleEditable] = useState<boolean>(false);
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParams>(
		localFilterData('filterRuleSets') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			search: '',
		}
	);
	const { data, refetch } = useQuery(GET_ROLES_DATA, { variables: { ...filterData }, fetchPolicy: 'network-only' });

	const COL_ARR_ROLE = [
		{ name: t('Title'), sortable: true, fieldName: 'role_name', type: 'text' },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: 'true' },
	] as IColumnsProps[];

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsRoleModelShow(false);
	}, []);

	/**
	 * Method used for refetch data and close model after submit
	 */
	const onSubmitRole = useCallback(() => {
		setIsRoleModelShow(false);
		refetch(filterData);
		refetchRoleData().catch(() => {
			return;
		});
	}, []);

	/**
	 * Method used for add new role
	 */
	const createNewRole = useCallback(() => {
		setIsRoleModelShow(true);
		setIsRoleEditable(false);
		setRoleVal('');
	}, []);

	const roleEditFun = useCallback(
		({ data }: OptionsPropsForButton) => {
			setRoleObj(data);
			setIsRoleModelShow(true);
			setRoleVal(roleObj.role_name);
			setIsRoleEditable(true);
		},
		[roleObj, isRoleModelShow, isRoleEditable, roleVal]
	);

	/**
	 *
	 * @param e Method used for store search value
	 */
	const onSearchRole = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const updatedFilterData = {
			...filterData,
			search: e.target.value,
			page: DEFAULT_PAGE,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterRuleSets', JSON.stringify(updatedFilterData));
	}, []);

	const handleRowRef = useCallback(
		(data: IListData) => {
			setRoleObj(data as RoleDataArr);
		},
		[roleObj]
	);

	return (
		<div className='card-table'>
			<div className='card-header'>
				<div className='flex items-center'>
					<span className='svg-icon inline-block h-3.5 w-3.5 mr-3'>
						<MenuBurger />
					</span>
					{t('Role List')}
				</div>
				<div className='w-6/12 pl-4	'>
					<TextInput type='text' id='table-search' value={filterData.search} placeholder={t('Search...')} onChange={onSearchRole} />
				</div>
				<RoleBaseGuard permissions={[PERMISSION_LIST.Role.AddAccess]}>
					<div>
						<Button className='btn-primary  ' onClick={createNewRole} type='button' label={t('Add New')}>
							<span className='inline-block w-4 h-4 mr-1 svg-icon'>
								<PlusCircle />
							</span>
						</Button>
					</div>
				</RoleBaseGuard>
			</div>
			<div className='card-body'>
				<BVDataTable
					defaultActions={['delete', 'change_status']}
					columns={COL_ARR_ROLE}
					queryName={GET_ROLES_DATA}
					sessionFilterName='filterRuleSets'
					singleDeleteMutation={DELETE_ROLE}
					updateStatusMutation={UPDATE_ROLE_STATUS}
					actionWisePermissions={{
						edit: PERMISSION_LIST.Role.EditAccess,
						delete: PERMISSION_LIST.Role.DeleteAccess,
						changeStatus: PERMISSION_LIST.Role.ChangeStatusAccess,
					}}
					rowRefData={handleRowRef}
					extraActions={
						<RoleBaseGuard permissions={[PERMISSION_LIST.Role.EditAccess]}>
							<Button title={AccesibilityNames.Edit} data={data} onClick={roleEditFun} label={''} icon={<Edit />} spanClassName='svg-icon inline-block h-3.5 w-3.5' className='btn-default' />
						</RoleBaseGuard>
					}
					updatedFilterData={filterData}
					statusKey={'status'}
					idKey={'uuid'}
					singleDeleteApiId={'uuid'}
					statusChangeApiId={'uuid'}
					statusChangeApiKeyTitle={'status'}
				/>
			</div>

			{isRoleModelShow && <AddEditRole roleVal={roleVal} isRoleModelShow={isRoleModelShow} isRoleEditable={isRoleEditable} onSubmitRole={onSubmitRole} onClose={onClose} roleObj={roleObj} />}
		</div>
	);
};
export default RolePermission;
