import React, { useCallback, useState } from 'react';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortOrder } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { GET_AUTHOR } from '@framework/graphql/queries/author';
import { DELETE_AUTHOR, GROUP_DELETE_BANNER, STATUS_CHANGE } from '@framework/graphql/mutations/author';
import { authorPagination, FilterAuthorProps, ColArrType } from '@type/banner';
import FilterBanner from '@views/Author/filteredData';
import { useTranslation } from 'react-i18next';
import { BannerIcon, PlusCircle } from '@components/icons/icons';
import Button from '@components/button/button';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';

function Author() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<authorPagination>(
		localFilterData('filterBanner') ?? {
			page: DEFAULT_PAGE,
			limit: DEFAULT_LIMIT,
			search: '',
			createdBy: '',
			status: null,
			sortBy: 'created_at',
			sortOrder: sortOrder,
		}
	);
	const COL_ARR = [
		{
			name: t('Author Name'),
			sortable: true,
			fieldName: 'author_translations',
			type: 'multilang',
			translationKey: 'name',
		},
		{
			name: t('Status'),
			sortable: true,
			fieldName: 'is_active',
			type: 'status',
			headerCenter: true,
		},
		{
			name: t('Last Updated'),
			sortable: true,
			fieldName: 'updated_at',
			type: 'date',
		},
	] as ColArrType[];
	/**
	 * handle's search
	 */
	const onSearchAuthor = useCallback(
		(values: FilterAuthorProps) => {
			const updatedFilterData = {
				...filterData,
				search: values.search,
				page: DEFAULT_PAGE,
			};
			setFilterData(updatedFilterData);
		},
		[filterData]
	);
	/**
	 * Method that redirects to add page
	 */
	const Navigation = useCallback(() => {
		return navigate(`/${ROUTES.app}/${ROUTES.author}/add`);
	}, []);

	return (
		<div>
			<FilterBanner onSearchAuthor={onSearchAuthor} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header '>
					<div className='flex items-center'>
						<span className='w-3.5 h-3.5 mr-2 inline-block svg-icon'>
							<BannerIcon />
						</span>
						{t('Banner List')}
					</div>
					<div>
						<RoleBaseGuard permissions={[PERMISSION_LIST.Author.AddAccess]}>
							<Button className='btn-primary  ' onClick={Navigation} type='button' label={t('Add New')}>
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
						columns={COL_ARR}
						queryName={GET_AUTHOR}
						sessionFilterName='filterBanner'
						singleDeleteMutation={DELETE_AUTHOR}
						multipleDeleteMutation={GROUP_DELETE_BANNER}
						updateStatusMutation={STATUS_CHANGE}
						actionWisePermissions={{
							edit: PERMISSION_LIST.Author.EditAccess,
							delete: PERMISSION_LIST.Author.DeleteAccess,
							changeStatus: PERMISSION_LIST.Author.ChangeStatusAccess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.author,
							},
						}}
						statusKey={'is_active'}
						idKey={'uuid'}
						multipleDeleteApiId={'groupDeleteBannerId'}
						singleDeleteApiId={'groupDeleteBannerId'}
						statusChangeApiId={'updateBannerStatusId'}
						statusChangeApiKeyTitle={'status'}
					/>
				</div>
			</div>
		</div>
	);
}

export default Author;
