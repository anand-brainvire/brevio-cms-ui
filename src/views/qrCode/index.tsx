import React, { ReactElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ColArrType, PaginationParams } from '@type/role';
import Button from '@components/button/button';
import filterServiceProps from '@components/filter/filter';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { PlusCircle, QrCodeIcon } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortOrder, ROUTES } from '@config/constant';
import { GET_QR_CODE } from '@framework/graphql/queries/qrCode';
import { CHANGE_STATUS_QR, DELETE_QR, GRP_DELETE_QR } from '@framework/graphql/mutations/qrCode';
import { FilterQrCodeProps } from '@type/qrcode';
import FilterQrCode from '@src/views/qrCode/filterQrCode';
const QrCode = (): ReactElement => {
	const [selectedQr, setSelectedQr] = useState<string[][]>([]);

	const { t } = useTranslation();
	const { localFilterData } = useSaveFilterData();

	const [filterData, setFilterData] = useState<PaginationParams>(
		localFilterData('filterQrCode') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: '',
			sortOrder: sortOrder,
			url: '',
		}
	);
	const COL_ARR_QR = [
		{ name: t('Url'), sortable: true, fieldName: 'url', type: 'text' },
		{ name: t('QR Code'), sortable: false, fieldName: 'qrcode', type: 'image', isBase64ImageUrl: true },
		{ name: t('Created At'), sortable: true, fieldName: 'created_at', type: 'date' },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: 'true' },
	] as ColArrType[];

	const navigate = useNavigate();

	/**
	 * Handle's page chnage
	 */
	const Navigation = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.qrcode}/add`);
	}, []);

	/**
	 *
	 * @param e Method used for store search value
	 */
	const onSearchQrCode = useCallback(
		(values: FilterQrCodeProps) => {
			const updatedFilterData = {
				...filterData,
				url: values.url,
				page: DEFAULT_PAGE,
			};
			setFilterData(updatedFilterData);
			filterServiceProps.saveState('filterQrCode', JSON.stringify(updatedFilterData));
		},
		[filterData]
	);
	/**
	 * Method that clears the selcted data
	 */
	const clearSelectionQrCode = useCallback(() => {
		setSelectedQr([]);
	}, [selectedQr]);

	return (
		<div>
			<FilterQrCode onSearchQrCode={onSearchQrCode} clearSelectionQrCode={clearSelectionQrCode} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header flex-wrap gap-2'>
					<div className='flex items-center'>
						<span className='mr-2 w-3.5 h-3.5 inline-block svg-icon text-md'>
							<QrCodeIcon />
						</span>
						{t('QR Code')}
					</div>

					<div className='flex space-x-2 flex-wrap '>
						<RoleBaseGuard permissions={[PERMISSION_LIST.QrCode.AddAccess]}>
							<Button className=' btn-primary   ' onClick={Navigation} type='button' label={t('Add New')}>
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
						columns={COL_ARR_QR}
						queryName={GET_QR_CODE}
						sessionFilterName='filterQrCode'
						singleDeleteMutation={DELETE_QR}
						multipleDeleteMutation={GRP_DELETE_QR}
						updateStatusMutation={CHANGE_STATUS_QR}
						actionWisePermissions={{
							edit: PERMISSION_LIST.QrCode.EditAccess,
							delete: PERMISSION_LIST.QrCode.DeleteAccess,
							changeStatus: PERMISSION_LIST.QrCode.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.QrCode.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.qrcode,
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
export default QrCode;
