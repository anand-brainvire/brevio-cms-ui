import React, { ReactElement, useCallback, useState } from 'react';
import { ColArrTypeNew, PaginationParams } from '@type/cms';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortBy, sortOrder } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { FETCH_CMS } from '@framework/graphql/queries/cms';
import { CHANGESTATUS_CMS, DELETE_CMS, GRP_DEL_CMS } from '@framework/graphql/mutations/cms';
import Button from '@components/button/button';
import { Document, PlusCircle } from '@components/icons/icons';
import filterServiceProps from '@components/filter/filter';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import TextInput from '@components/textinput/TextInput';

const CMS = (): ReactElement => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [selectedCms, setSelectedCms] = useState<string[]>([]);
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParams>(
		localFilterData('filterValuecms') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			search: '',
		}
	);
	const COL_ARR = [
		{
			name: t('Content Page Title'),
			sortable: true,
			fieldName: t('meta_title_english'),
			type: 'text',
			headerCenter: false,
		},
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
	] as ColArrTypeNew[];
	/**
	 *
	 * @param e Method used for store search value
	 */
	const onSearchCms = (e: string) => {
		const updatedFilterData = {
			...filterData,
			search: e,
			page: DEFAULT_PAGE,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterValuecms', JSON.stringify(updatedFilterData));
	};
	/**
	 * Method that clears the selcted data
	 */
	const clearSelectionCms = useCallback(() => {
		setSelectedCms([]);
	}, [selectedCms]);
	/**
	 * Method that redirects to add page
	 */
	const handleAdd = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.CMS}/${ROUTES.add}`);
	}, []);

	const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		clearSelectionCms();
		onSearchCms(e.target.value);
		setSelectedCms([]);
	}, []);

	return (
		<div className='card-table'>
			<div className='card-header '>
				<div className='flex items-center'>
					<span className='svg-icon inline-block h-3.5 w-3.5 mr-2 text-md'>
						<Document />
					</span>
					{t('CMS List')}
				</div>

				<div className='btn-group flex flex-wrap gap-2'>
					<TextInput value={filterData.search} id={'search'} placeholder={t('Search content page title...')} name='search' type='text' onChange={handleSearch} />

					<RoleBaseGuard permissions={[PERMISSION_LIST.CMS.AddAccess]}>
						<Button className=' btn-primary  ' onClick={handleAdd} type='button' label={t('Add New')}>
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
					queryName={FETCH_CMS}
					sessionFilterName='filterValuecms'
					singleDeleteMutation={DELETE_CMS}
					multipleDeleteMutation={GRP_DEL_CMS}
					updateStatusMutation={CHANGESTATUS_CMS}
					actionWisePermissions={{
						edit: PERMISSION_LIST.CMS.EditAccess,
						delete: PERMISSION_LIST.CMS.DeleteAccess,
						changeStatus: PERMISSION_LIST.CMS.ChangeStatusAccess,
						multipleDelete: PERMISSION_LIST.CMS.GroupDeleteAcsess,
					}}
					updatedFilterData={filterData}
					actionData={{
						edit: {
							route: ROUTES.CMS,
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
	);
};
export default CMS;
