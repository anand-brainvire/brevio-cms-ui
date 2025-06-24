import { FETCH_BOOKS } from '@framework/graphql/queries/bookManagement';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BOOK_PUBLISH_STATUS, DELETE_BOOK_BY_ID, GROUP_DELETE_COUPON } from '@framework/graphql/mutations/bookManagement';
import FilterBooks from '@views/bookManagement/filterBooks';
import Button from '@components/button/button';
import filterServiceProps from '@components/filter/filter';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { BookIcon, PlusCircle } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE,sortOrder, ROUTES } from '@config/constant';
import { PaginationParamsCoupon, FilterCouponsProps } from '@type/bookManagement';
import { useLocation, useNavigate } from 'react-router-dom';
import { IColumnsProps } from '@components/BVDatatable/DataTable';

const bookManagaement = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { localFilterData } = useSaveFilterData();
	const page = DEFAULT_PAGE;
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const defaultCategoryId = queryParams.get('categoryId');
	const [filterData, setFilterData] = useState<PaginationParamsCoupon>(() => {
  	const saved = localFilterData('filterCoupon');
	if (defaultCategoryId) {
		return {
			limit: DEFAULT_LIMIT,
			sortBy: 'updated_at',
			sortOrder: sortOrder,
			offset: 0,
			filter: {
			  categories: [defaultCategoryId]
			}
		};
		}	
		return saved ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: 'updated_at',
			sortOrder: sortOrder,
			offset: ((DEFAULT_PAGE ?? DEFAULT_PAGE) - 1) * DEFAULT_LIMIT,
		};
	});

	const COL_ARR_COUPONS = [
		{ name: t('Book Title'), sortable: true, fieldName: 'title', type: 'text' },
		{ name: t('Category'), sortable: true, fieldName: 'categories', type: 'multipleText' },
		{ name: t('Book Author'), sortable: true, fieldName: 'authors', type: 'multipleText' },
		{ name: t('Cover Image'), sortable: false, fieldName: 'cover_image', type: 'image' },
		{ name: t('Status'), sortable: false, fieldName: 'status', type: 'bookStatus', headerCenter: true },
		{ name: t('Last Updated'), sortable: true, fieldName: 'start_date', type: 'date' },
	] as IColumnsProps[];

	/**
	 *
	 * @param values are used set the filter data
	 */
	const onSearchCoupon = useCallback(
	(values: FilterCouponsProps & { filter?: PaginationParamsCoupon['filter'] }) => {
		const payload = {
			sortBy: 'updated_at',
			sortOrder: sortOrder,
			limit: DEFAULT_LIMIT,
			offset: ((DEFAULT_PAGE ?? page) - 1) * DEFAULT_LIMIT,
			filter: values.filter
		};

		setFilterData(payload);
		filterServiceProps.saveState('filterCoupon', JSON.stringify(payload));
	},
	[filterData]
);

	// useEffect(() => {
  	// 	if (defaultCategoryId) {
  	// 	  navigate(`/${ROUTES.app}/${ROUTES.manageBooks}/${ROUTES.list}`, { replace: true });
  	// 	}
	// }, []);


	/**
	 * Method that redirects to add page
	 */
	const addRedirectionCpn = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.manageBooks}/${ROUTES.add}`);
	}, []);
	/**
	 * function that download file base on file type
	 */

	return (
		<div>
			<FilterBooks onSearchCoupon={onSearchCoupon} filterData={filterData} defaultCategoryId={defaultCategoryId ?? undefined}/>
			<div className='card-table'>
				<div className='card-header'>
					<div className='flex items-center'>
						<span className='w-3.5 h.3.5 mr-2 text-gray-800 inline-block svg-icon'>
							<BookIcon />
						</span>
						<span className='text-sm font-normal'>{t('Book List')}</span>
					</div>
					<div className='flex flex-wrap gap-2'>
						<RoleBaseGuard permissions={[PERMISSION_LIST.Coupon.AddAccess]}>
							<Button className='btn-primary  ' onClick={addRedirectionCpn} type='button' label={t('Add New')}>
								<span className='inline-block w-4 h-4 mr-1 svg-icon'>
									<PlusCircle />
								</span>
							</Button>
						</RoleBaseGuard>
					</div>
				</div>
				<div className='card-body'>
					<BVDataTable
						defaultActions={['edit', 'delete', 'multiple_delete','change_status']}
						columns={COL_ARR_COUPONS}
						queryName={FETCH_BOOKS}
						sessionFilterName='filterCoupon'
						singleDeleteMutation={DELETE_BOOK_BY_ID}
						multipleDeleteMutation={GROUP_DELETE_COUPON}
						updateStatusMutation={BOOK_PUBLISH_STATUS}
						actionWisePermissions={{
							edit: PERMISSION_LIST.Coupon.EditAccess,
							delete: PERMISSION_LIST.Coupon.DeleteAccess,
							changeStatus: PERMISSION_LIST.Coupon.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.Coupon.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.manageOffer,
							},
						}}
						statusKey={'is_published'}
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
export default bookManagaement;
