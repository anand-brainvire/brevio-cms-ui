import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortBy, sortOrder } from '@config/constant';
import { UserReportIcon } from '@components/icons/icons';
import filterServiceProps from '@components/filter/filter';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import { CHANGE_USER_REPORT_STATUS, DELETE_USER_REPORT, FETCH_USER_REPORT, GRP_DELETE_USER_REPORT } from '@framework/graphql/queries/userReport';
import { FilterUserReportProps, PaginationParamsUserReport } from '@type/userReport';
import FilterUserReport from '@views/userReport/filterUserReport';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps } from '@components/BVDatatable/DataTable';

const UserReport = () => {
	const { t } = useTranslation();
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParamsUserReport>(
		localFilterData('filterUserReport') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			search: '',
		}
	);

	const COL_ARR_USR = [
		{ name: t('Username'), sortable: false, fieldName: 'reporter.first_name', type: 'text' },
		{ name: t('Reported By'), sortable: false, fieldName: 'reporterUser.first_name', type: 'text' },
		{ name: t('Note'), sortable: true, fieldName: 'moderator_notes', type: 'text' },
		{ name: t('Created At'), sortable: true, fieldName: 'created_at', type: 'date' },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status' },
	] as IColumnsProps[];

	/**
	 * @param values Method used for set filter data
	 */
	const onSearchUserReport = useCallback((values: FilterUserReportProps) => {
		const updatedFilterData = {
			...filterData,
			...localFilterData('filterUserReport'),
			search: values.search,
			page: DEFAULT_PAGE,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterUserReport', JSON.stringify(updatedFilterData));
	}, []);

	return (
		<div>
			<FilterUserReport onSearchUserReport={onSearchUserReport} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header '>
					<div className='flex items-center'>
						<span className='svg-icon inline-block h-3.5 w-3.5 mr-2 text-md'>
							<UserReportIcon />
						</span>
						{t('Report List')}
					</div>
				</div>

				<div className='card-body'>
					<BVDataTable
						defaultActions={['delete', 'change_status', 'multiple_delete']}
						columns={COL_ARR_USR}
						queryName={FETCH_USER_REPORT}
						sessionFilterName='filterUserReport'
						singleDeleteMutation={DELETE_USER_REPORT}
						multipleDeleteMutation={GRP_DELETE_USER_REPORT}
						updateStatusMutation={CHANGE_USER_REPORT_STATUS}
						actionWisePermissions={{
							delete: PERMISSION_LIST.UserReport.DeleteAccess,
							changeStatus: PERMISSION_LIST.UserReport.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.UserReport.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.userReport,
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

export default UserReport;
