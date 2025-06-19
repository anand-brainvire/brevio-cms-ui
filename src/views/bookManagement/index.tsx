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
import { Gift, PlusCircle } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortBy, sortOrder, ROUTES } from '@config/constant';
import { PaginationParamsCoupon, FilterCouponsProps } from '@type/couponManagement';
import { useNavigate } from 'react-router-dom';
import { IColumnsProps } from '@components/BVDatatable/DataTable';

const CouponManagaement = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParamsCoupon>(
		localFilterData('filterCoupon') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			offerName: '',
			startDate: '',
			endDate: '',
			status: null,
		}
	);
	const COL_ARR_COUPONS = [
		{ name: t('Book Title'), sortable: true, fieldName: 'title', type: 'text' },
		{ name: t('Category'), sortable: true, fieldName: 'categories', type: 'multipleText' },
		{ name: t('Book Author'), sortable: true, fieldName: 'authors', type: 'multipleText' },
		{ name: t('Cover Image'), sortable: false, fieldName: 'cover_image', type: 'image' },
		{ name: t('Status'), sortable: false, fieldName: 'status', type: 'bookStatus', headerCenter: true },
		{ name: t('Last Updated'), sortable: true, fieldName: 'start_date', type: 'date' },
	] as IColumnsProps[];
	const [selectedCoupons, setSelectedCoupons] = useState<Array<string>>([]);

	/**
	 *
	 * @param values are used set the filter data
	 */
	const onSearchCoupon = useCallback(
		(values: FilterCouponsProps) => {
			setFilterData({
				...filterData,
				offerName: values.offerName,
				status: parseInt(values.status),
				startDate: values.startDate,
				endDate: values.endDate,
				page: DEFAULT_PAGE,
			});
			setSelectedCoupons([]);
			filterServiceProps.saveState('filterCoupon', JSON.stringify({ ...filterData, offerName: values.offerName, status: values.status === '' ? null : +values.status, startDate: values.startDate, endDate: values.endDate, page: DEFAULT_PAGE }));
		},
		[filterData]
	);
	const clearSelectionCoupons = useCallback(() => {
		setSelectedCoupons([]);
	}, [selectedCoupons]);

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
			<FilterBooks onSearchCoupon={onSearchCoupon} clearSelectionCoupons={clearSelectionCoupons} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header'>
					<div className='flex items-center'>
						<span className='w-3.5 h.3.5 mr-2 text-gray-800 inline-block svg-icon'>
							<Gift />
						</span>
						<span className='text-sm font-normal'>{t('Offer List')}</span>
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
						defaultActions={['edit', 'delete', 'change_book_status', 'multiple_delete']}
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
export default CouponManagaement;
