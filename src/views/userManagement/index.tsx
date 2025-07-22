import React, { ReactElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterUserManagement from '@views/userManagement/filterUserManagment';
import { FilterUserProps, PaginationParams } from '@type/user';
import { GET_USER } from '@framework/graphql/queries/user';
import PassWordChange from '@views/userManagement/changeUserPassword';
// import Button from '@components/button/button';
import filterServiceProps from '@components/filter/filter';
// import { OptionsPropsForButton } from '@type/component';
// import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps, IListData } from '@components/BVDatatable/DataTable';
import { MultipleProfileIcon } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortBy, sortOrder, ROUTES } from '@config/constant';
import { UserData } from '@framework/graphql/graphql';
import { DELETE_USER, CHANGE_USER_STATUS} from '@framework/graphql/mutations/user';
// import { downloadFile } from '@utils/helpers';
// import { useNavigate } from 'react-router-dom';

const UserManagement = (): ReactElement => {
	const { t } = useTranslation();
	// const navigate = useNavigate();
	const [isChangeUserPassword, setIsChangeUserPassword] = useState<boolean>(false);
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const { localFilterData } = useSaveFilterData();
	const [limit, setLimit] = useState(DEFAULT_LIMIT);
	const [filterData, setFilterData] = useState<PaginationParams>(
		localFilterData('filterusermangment') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			search: '',
			userType: 'all',
		}
	);

	const handleLimitChange = (newLimit:number) => {
	  setLimit(newLimit);
	  setFilterData((prev) => ({ ...prev, limit: newLimit, page: 1 }));
	};
	// const [isLoadingDownloadFile, setIsLoadingDownloadFile] = useState<boolean>(false);

	const COL_ARR_USER_MNGT = [
		// { name: t('First Name'), sortable: true, type: 'text', fieldName: 'first_name' },
		{ name: t('Email'), sortable: true, type: 'text', fieldName: 'email',headerCenter: true },
		{ name: t('Subscription status'), sortable: true, type: 'subscriptionStatus', fieldName: 'is_subscribed', headerCenter: true },
		{ name: t('Current streak count'), sortable: false, type: 'number', fieldName: 'current_streak_count',headerCenter: true },
		{ name: t('Books completed'), sortable: true, type: 'number', fieldName: 'books_completed',headerCenter: true },
		{ name: t('Daily goal'), sortable: false, type: 'number', fieldName: 'daily_goal_minutes',headerCenter: true },
		{ name: t('Registration At'), sortable: false, type: 'date', fieldName: 'signed_up_at',headerCenter: true },
		{ name: t('Status'), sortable: true, type: 'status', fieldName: 'is_active', headerCenter: true },

	] as IColumnsProps[];
	const [userObj, setUserObj] = useState<UserData>({} as UserData);

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const onSearchUser = useCallback((values: FilterUserProps) => {
		setSelectedUsers([]);
		const updatedFilterData = {
			...filterData,
			search: values.search,
			isActive: values.isActive,
			page: DEFAULT_PAGE,
			limit:limit,
			userType: values.subscriptionStatus,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterusermangment', JSON.stringify(updatedFilterData));
	}, [limit,filterData]);

	const handleRowRef = useCallback(
		(data: IListData) => {
			setUserObj(data as UserData);
		},
		[userObj]
	);
	const onClose = useCallback(() => {
		setIsChangeUserPassword(false);
	}, []);

	const clearSelectionUserMng = useCallback(() => {
		setSelectedUsers([]);
	}, [selectedUsers]);

	return (
		<div>
			<FilterUserManagement onLimitChange={handleLimitChange} onSearchUser={onSearchUser} clearSelectionUserMng={clearSelectionUserMng} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header '>
					<div className='flex items-center'>
						<span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
							<MultipleProfileIcon />
						</span>
						{t('User List')}
					</div>

					<div className='flex  flex-wrap gap-2'>
					</div>
				</div>
				<div className='card-body'>
					<div className='flex justify-between mb-3'></div>
					<BVDataTable
					    limit={limit}
    					onLimitChange={handleLimitChange}
						defaultActions={['delete', 'view', 'multiple_delete']}
						columns={COL_ARR_USER_MNGT}
						queryName={GET_USER}
						sessionFilterName='filterusermangment'
						singleDeleteMutation={DELETE_USER}
						// multipleDeleteMutation={GRP_DEL_USER}
						updateStatusMutation={CHANGE_USER_STATUS}
						actionWisePermissions={{
							view: PERMISSION_LIST.UserManagement.ViewAccess,
							delete: PERMISSION_LIST.UserManagement.DeleteAccess,
							changeStatus: PERMISSION_LIST.UserManagement.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.UserManagement.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.user,
							},
							view: {
								route: ROUTES.user,
							},
						}}
						statusKey='is_active'
						idKey='uuid'
						singleDeleteApiId='uuid'
						statusChangeApiId='status'
						statusChangeApiKeyTitle='status'
						rowRefData={handleRowRef}
					/>
				</div>
			</div>
			{isChangeUserPassword && <PassWordChange onClose={onClose} UserObj={userObj} show={isChangeUserPassword} />}
		</div>
	);
};
export default UserManagement;
