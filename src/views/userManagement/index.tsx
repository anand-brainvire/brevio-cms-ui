import React, { ReactElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterUserManagement from '@views/userManagement/filterUserManagment';
import { FilterUserProps, PaginationParams } from '@type/user';
import { GET_USER } from '@framework/graphql/queries/user';
import PassWordChange from '@views/userManagement/changeUserPassword';
import Button from '@components/button/button';
import filterServiceProps from '@components/filter/filter';
import { OptionsPropsForButton } from '@type/component';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps, IListData } from '@components/BVDatatable/DataTable';
import { ProfileIcon, ExcelFile, PdfFile, CsvFile, PlusCircle, Key } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortBy, sortOrder, UserGenderEnum, ROUTES, EXPORT_CSV_PDF_EXCEL_CONSTANTS, AccesibilityNames } from '@config/constant';
import { UserData } from '@framework/graphql/graphql';
import { DELETE_USER, CHANGE_USER_STATUS, GRP_DEL_USER } from '@framework/graphql/mutations/user';
import { downloadFile } from '@utils/helpers';
import { useNavigate } from 'react-router-dom';

const UserManagement = (): ReactElement => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [isChangeUserPassword, setIsChangeUserPassword] = useState<boolean>(false);

	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParams>(
		localFilterData('filterusermangment') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			fullName: '',
			email: '',
			status: null,
			gender: null,
			phoneNo: '',
		}
	);
	const [isLoadingDownloadFile, setIsLoadingDownloadFile] = useState<boolean>(false);

	const COL_ARR_USER_MNGT = [
		{ name: t('Full Name'), sortable: true, type: 'text', fieldName: 'first_name' },
		{ name: t('User Name'), sortable: true, type: 'text', fieldName: 'user_name' },
		{ name: t('Email'), sortable: true, type: 'text', fieldName: 'email' },
		{ name: t('Gender'), sortable: true, type: 'badge', fieldName: 'gender', conversationValue: UserGenderEnum },
		{ name: t('Date of Birth'), sortable: true, type: 'date', fieldName: 'date_of_birth' },
		{ name: t('Phone Number'), sortable: true, type: 'text', fieldName: 'phone_no' },
		{ name: t('Registration At'), sortable: true, type: 'date', fieldName: 'created_at' },
		{ name: t('Last Updated At'), sortable: true, type: 'date', fieldName: 'updated_at' },
		{ name: t('Status'), sortable: true, type: 'status', fieldName: 'status' },
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
			fullName: values.fullName,
			email: values.email,
			status: parseInt(values.status),
			gender: parseInt(values.gender),
			phoneNo: values.phoneNo,
			page: DEFAULT_PAGE,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterusermangment', JSON.stringify(updatedFilterData));
	}, []);
	const changeUserPasswordFun = useCallback(
		(options: OptionsPropsForButton) => {
			setUserObj(options?.data as unknown as UserData);
			setIsChangeUserPassword(true);
		},
		[userObj, isChangeUserPassword]
	);
	const handleRowRef = useCallback(
		(data: IListData) => {
			setUserObj(data as UserData);
		},
		[userObj]
	);
	const onClose = useCallback(() => {
		setIsChangeUserPassword(false);
	}, []);
	/**
	 * Method redirects to add page
	 */
	const handleAddusermangment = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.user}/${ROUTES.add}`);
	}, []);
	/**
	 * Method that clears the selcted data
	 */
	const clearSelectionUserMng = useCallback(() => {
		setSelectedUsers([]);
	}, [selectedUsers]);

	const onDownload = useCallback(
		async (e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			const target = e.currentTarget as HTMLButtonElement;
			const updateFilterData: { [key: string]: string | number | null | Date } = {
				'full_name': filterData.fullName,
				page: filterData.page,
				sortBy: filterData.sortBy,
				sortOrder: filterData.sortOrder,
				status: filterData.status,
				email: filterData.email,
				gender: filterData.gender,
			};
			switch (target.id) {
				case 'csv':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.user, EXPORT_CSV_PDF_EXCEL_CONSTANTS.csv, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
					setIsLoadingDownloadFile(false);
					break;
				case 'pdf':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.user, EXPORT_CSV_PDF_EXCEL_CONSTANTS.pdf, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
					setIsLoadingDownloadFile(false);
					break;
				case 'excel':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.user, EXPORT_CSV_PDF_EXCEL_CONSTANTS.excel, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
					setIsLoadingDownloadFile(false);
					break;
				default:
					break;
			}
		},
		[isLoadingDownloadFile, filterData]
	);
	return (
		<div>
			<FilterUserManagement onSearchUser={onSearchUser} clearSelectionUserMng={clearSelectionUserMng} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header '>
					<div className='flex items-center'>
						<span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
							<ProfileIcon />
						</span>
						{t('User List')}
					</div>

					<div className='flex  flex-wrap gap-2'>
						<div className='flex flex-wrap gap-2'>
							<button title={AccesibilityNames.Excel} id={'excel'} className='btn btn-success' onClick={onDownload}>
								<span className='w-4 h-5 svg-icon fill-white '>
									<ExcelFile />
								</span>
							</button>
							<button title={AccesibilityNames.PDF} id={'pdf'} className='btn btn-success' onClick={onDownload}>
								<span className='w-4 h-5 svg-icon fill-white '>
									<PdfFile />
								</span>
							</button>
							<button title={AccesibilityNames.CSV} id={'csv'} className='btn btn-success' onClick={onDownload}>
								<span className='w-4 h-5 svg-icon fill-white text-black '>
									<CsvFile />
								</span>
							</button>
						</div>

						<Button className='btn-primary ' onClick={handleAddusermangment} type='button' label={t('Add New')}>
							<span className='inline-block w-4 h-4 mr-1 svg-icon'>
								<PlusCircle />
							</span>
						</Button>
					</div>
				</div>
				<div className='card-body'>
					<div className='flex justify-between mb-3'></div>
					<BVDataTable
						defaultActions={['edit', 'delete', 'change_status', 'view', 'multiple_delete']}
						columns={COL_ARR_USER_MNGT}
						queryName={GET_USER}
						sessionFilterName='filterusermangment'
						singleDeleteMutation={DELETE_USER}
						multipleDeleteMutation={GRP_DEL_USER}
						updateStatusMutation={CHANGE_USER_STATUS}
						actionWisePermissions={{
							edit: PERMISSION_LIST.UserManagement.EditAccess,
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
						statusKey={'status'}
						idKey={'uuid'}
						multipleDeleteApiId={'groupDeleteUsersId'}
						singleDeleteApiId={'deleteUserId'}
						statusChangeApiId={'changeUserStatusId'}
						statusChangeApiKeyTitle={'status'}
						rowRefData={handleRowRef}
						extraActions={
							<RoleBaseGuard permissions={[PERMISSION_LIST.UserManagement.ChangePasswordAccess]}>
								<Button title={AccesibilityNames.ChangePassword} data={{}} onClick={changeUserPasswordFun} icon={<Key />} spanClassName='svg-icon inline-block h-3.5 w-3.5' label={''} className='btn-default' />
							</RoleBaseGuard>
						}
					/>
				</div>
			</div>
			{isChangeUserPassword && <PassWordChange onClose={onClose} UserObj={userObj} show={isChangeUserPassword} />}
		</div>
	);
};
export default UserManagement;
