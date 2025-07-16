import React, { useCallback, useState } from 'react';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortOrder } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { GET_AUTHOR } from '@framework/graphql/queries/author';
import { DELETE_AUTHOR, GROUP_DELETE_BANNER, STATUS_CHANGE } from '@framework/graphql/mutations/author';
import { authorPagination, FilterAuthorProps, ColArrType } from '@type/banner';
import FilterBanner from '@views/Author/filteredData';
import { useTranslation } from 'react-i18next';
import { AuthorIcon, PlusCircle } from '@components/icons/icons';
import Button from '@components/button/button';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import filterServiceProps from '@components/filter/filter';


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
			offset: ((DEFAULT_PAGE ?? DEFAULT_PAGE) - 1) * DEFAULT_LIMIT,
		}
	);
	const COL_ARR = [
		{
			name: t('Author Name'),
			sortable: true,
			fieldName: 'author_translations',
			type: 'multilang',
			translationKey: 'name',
			sortKey: 'name',
			headerCenter: true
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
			// headerCenter: true,
		},
	] as ColArrType[];
	/**
	 * handle's search
	 */
	const onSearchAuthor = useCallback(
		(values: FilterAuthorProps) => {
			const updatedFilterData = {
				...filterData,
				search: values.search.trim(),
				page: DEFAULT_PAGE,
				offset: ((DEFAULT_PAGE ?? filterData.page) - 1) * filterData.limit,
			};
			setFilterData(updatedFilterData);
			filterServiceProps.saveState('filterBanner', JSON.stringify(updatedFilterData));

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
							<AuthorIcon />
						</span>
						{t('Author List')}
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
