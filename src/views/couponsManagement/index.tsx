import { FETCH_COUPONS } from '@framework/graphql/queries/couponManagement';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COUPON_STATUS_CHANGE_BY_ID, DELETE_COUPON_BY_ID, GROUP_DELETE_COUPON } from '@framework/graphql/mutations/couponManagement';
import FilterCoupon from '@views/couponsManagement/filterCoupon';
import Button from '@components/button/button';
import { downloadFile } from '@utils/helpers';
import filterServiceProps from '@components/filter/filter';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { Gift, ExcelFile, PdfFile, CsvFile, PlusCircle } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortBy, sortOrder, ROUTES, EXPORT_CSV_PDF_EXCEL_CONSTANTS, AccesibilityNames, OfferTypeEnum, OfferUsageEnum, OfferApplicableEnum } from '@config/constant';
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
		{ name: t('Offer Name'), sortable: true, fieldName: 'offer_name', type: 'text' },
		{ name: t('Offer Code'), sortable: false, fieldName: 'offer_code', type: 'text' },
		{ name: t('Type'), sortable: false, fieldName: 'offer_type', type: 'badge', headerCenter: true, conversationValue: OfferTypeEnum },
		{ name: t('Value'), sortable: true, fieldName: 'value', type: 'number', headerCenter: true },
		{ name: t('Usage'), sortable: false, fieldName: 'offer_usage', headerCenter: true, type: 'badge', conversationValue: OfferUsageEnum },
		{ name: t('Total Usage'), sortable: false, fieldName: 'total_usage', type: 'number', headerCenter: true },
		{ name: t('Applicable For'), sortable: false, fieldName: 'applicable', headerCenter: true, type: 'badge', conversationValue: OfferApplicableEnum },
		{ name: t('Start Date'), sortable: true, fieldName: 'start_date', type: 'date' },
		{ name: t('End Date'), sortable: true, fieldName: 'end_date', type: 'date' },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
	] as IColumnsProps[];
	const [isLoadingDownloadFile, setIsLoadingDownloadFile] = useState<boolean>(false);
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
		navigate(`/${ROUTES.app}/${ROUTES.manageOffer}/${ROUTES.add}`);
	}, []);
	/**
	 * function that download file base on file type
	 */
	const onDownloadCoupon = useCallback(
		async (e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			const target = e.currentTarget as HTMLButtonElement;
			const updateFilterData: { [key: string]: string | number | null | Date } = {
				'offer_name': filterData.offerName,
				page: filterData.page,
				sortBy: filterData.sortBy,
				sortOrder: filterData.sortOrder,
				'start_date': filterData.startDate as string | Date,
				'end_date': filterData.endDate as string | Date,
				status: filterData.status,
			};
			switch (target.id) {
				case 'csv':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.offer, EXPORT_CSV_PDF_EXCEL_CONSTANTS.csv, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
					setIsLoadingDownloadFile(false);
					break;
				case 'pdf':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.offer, EXPORT_CSV_PDF_EXCEL_CONSTANTS.pdf, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
					setIsLoadingDownloadFile(false);
					break;
				case 'excel':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.offer, EXPORT_CSV_PDF_EXCEL_CONSTANTS.excel, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
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
			<FilterCoupon onSearchCoupon={onSearchCoupon} clearSelectionCoupons={clearSelectionCoupons} filterData={filterData} />
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
							<div className='flex justify-between'>
								<div className='table-select-dropdown-container justify-start'></div>
								<div className='flex gap-2 items-center'>
									<button title={AccesibilityNames.Excel} id={'excel'} className='btn btn-success py-1.5 px-3' onClick={onDownloadCoupon}>
										<span className='w-4 h-5 svg-icon fill-white '>
											<ExcelFile />
										</span>
									</button>
									<button title={AccesibilityNames.PDF} id={'pdf'} className='btn btn-success py-1.5 px-3' onClick={onDownloadCoupon}>
										<span className='w-4 h-5 svg-icon fill-white '>
											<PdfFile />
										</span>
									</button>
									<button title={AccesibilityNames.CSV} id={'csv'} className='btn btn-success py-1.5 px-3' onClick={onDownloadCoupon}>
										<span className='w-4 h-5 svg-icon fill-white text-black '>
											<CsvFile />
										</span>
									</button>
								</div>
							</div>
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
						defaultActions={['edit', 'delete', 'change_status', 'multiple_delete']}
						columns={COL_ARR_COUPONS}
						queryName={FETCH_COUPONS}
						sessionFilterName='filterCoupon'
						singleDeleteMutation={DELETE_COUPON_BY_ID}
						multipleDeleteMutation={GROUP_DELETE_COUPON}
						updateStatusMutation={COUPON_STATUS_CHANGE_BY_ID}
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
