import React, { useCallback, useState } from 'react';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortOrder } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { GET_BANNER } from '@framework/graphql/queries/banner';
import { GROUP_DELETE_BANNER, STATUS_CHANGE } from '@framework/graphql/mutations/banner';
import { bannerPagination, FilterBannerProps, ColArrType } from '@type/banner';
import FilterBanner from '@views/banner/filteredData';
import { useTranslation } from 'react-i18next';
import { BannerIcon, PlusCircle } from '@components/icons/icons';
import Button from '@components/button/button';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';

function Banner() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<bannerPagination>(
		localFilterData('filterBanner') ?? {
			page: DEFAULT_PAGE,
			limit: DEFAULT_LIMIT,
			bannerTitle: '',
			createdBy: '',
			status: null,
			sortBy: 'created_at',
			sortOrder: sortOrder,
		}
	);
	const COL_ARR = [
		{ name: t('Thumb'), sortable: false, fieldName: 'filePath', type: 'image', headerCenter: true },
		{
			name: t('Banner Title'),
			sortable: true,
			fieldName: 'banner_title',
			type: 'text',
		},
		{
			name: t('Created By'),
			sortable: true,
			fieldName: 'User.first_name',
			type: 'text',
		},
		{
			name: t('Created At'),
			sortable: true,
			fieldName: 'created_at',
			type: 'date',
		},
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
	] as ColArrType[];
	/**
	 * handle's search
	 */
	const onSearchBanner = useCallback(
		(values: FilterBannerProps) => {
			const updatedFilterData = {
				...filterData,
				...localFilterData('filterBanner'),
				bannerTitle: values.bannerTitle,
				createdBy: values.createdBy,
				status: parseInt(values.status),
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
		return navigate(`/${ROUTES.app}/${ROUTES.banner}/add`);
	}, []);

	return (
		<div>
			<FilterBanner onSearchBanner={onSearchBanner} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header '>
					<div className='flex items-center'>
						<span className='w-3.5 h-3.5 mr-2 inline-block svg-icon'>
							<BannerIcon />
						</span>
						{t('Banner List')}
					</div>
					<div>
						<RoleBaseGuard permissions={[PERMISSION_LIST.Banner.AddAccess]}>
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
						queryName={GET_BANNER}
						sessionFilterName='filterBanner'
						singleDeleteMutation={GROUP_DELETE_BANNER}
						multipleDeleteMutation={GROUP_DELETE_BANNER}
						updateStatusMutation={STATUS_CHANGE}
						actionWisePermissions={{
							edit: PERMISSION_LIST.Banner.EditAccess,
							delete: PERMISSION_LIST.Banner.DeleteAccess,
							changeStatus: PERMISSION_LIST.Banner.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.Banner.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.banner,
							},
						}}
						statusKey={'status'}
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

export default Banner;
