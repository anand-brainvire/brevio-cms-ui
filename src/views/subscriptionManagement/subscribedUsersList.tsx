import { SubscriptionIcon } from '@components/icons/icons';
import { sortOrder, sortBy, DEFAULT_LIMIT, DEFAULT_PAGE } from '@config/constant';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationParamsActivity } from '@type/activityTracking';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import { ColArrTypeNew } from '@type/cms';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { FETCH_SUBSCRIPTION } from '@framework/graphql/queries/subscription';

const SubcribersList = (): ReactElement => {
	const { t } = useTranslation();
	const { localFilterData } = useSaveFilterData();
	const filterData: PaginationParamsActivity = localFilterData('filterActivity') ?? {
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: sortBy,
		sortOrder: sortOrder,
	};

	const COL_ARR_ENQ = [
		{ name: t('User Name'), sortable: true, fieldName: 'user_name', type: 'text', headerCenter: false },
		{ name: t('Plan Name'), sortable: true, fieldName: 'plan_name', type: 'text', headerCenter: false },
		{ name: t('Plan Price'), sortable: true, fieldName: 'plan_price', type: 'number', headerCenter: false },
		{ name: t('Purchase Date'), sortable: true, fieldName: 'start_date', type: 'date', headerCenter: false },
		{ name: t('Plan Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
	] as ColArrTypeNew[];

	return (
		<div>
			<div className='card-table'>
				<div className='card-header '>
					<div className='flex items-center'>
						<span className='svg-icon inline-block h-3.5 w-3.5 mr-2 text-md'>
							<SubscriptionIcon />
						</span>
						{t('Subscribers List')}
					</div>
				</div>
				<div className='card-body'>
					<BVDataTable defaultActions={null} columns={COL_ARR_ENQ} queryName={FETCH_SUBSCRIPTION} sessionFilterName='subscriptionFilter' updatedFilterData={filterData} idKey={'uuid'} />
				</div>
			</div>
		</div>
	);
};
export default SubcribersList;
