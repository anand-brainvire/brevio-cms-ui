import React, { useCallback, useState } from 'react';
import { ColArrType, FilterCityProps, PaginationParams } from '@type/city';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GET_CITY } from '@framework/graphql/queries/city';
import { CHANGE_CITY_STATUS, DELETE_CITY, GROUP_DELETE_CITY } from '@framework/graphql/mutations/city';
import { Marker, PlusCircle } from '@components/icons/icons';
import Button from '@components/button/button';
import FilterCity from '@views/city/filterCity';
import filterServiceProps from '@components/filter/filter';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import { PERMISSION_LIST } from '@config/permission';
import RoleBaseGuard from '@components/roleGuard';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortOrder } from '@config/constant';
const City = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [selectedCity, setSelectedCity] = useState<string[]>([]);
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParams>(
		localFilterData('filterCity') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: 'created_at',
			sortOrder: sortOrder,
			cityName: '',
			status: null,
			stateId: null,
			countryId: null,
		}
	);
	const COL_ARR_CITY = [
		{ name: t('City Name'), sortable: true, type: 'text', fieldName: 'city_name' },
		{ name: t('State Name'), sortable: true, type: 'text', fieldName: 'State.name' },
		{ name: t('Created At'), sortable: true, type: 'date', fieldName: 'created_at' },
		{ name: t('Updated At'), sortable: true, type: 'date', fieldName: 'updated_at' },
		{ name: t('Status'), sortable: true, type: 'status', fieldName: 'status', headerCenter: 'true' },
	] as ColArrType[];

	/**
	 * handle's search
	 */
	const onSearchCity = useCallback(
		(values: FilterCityProps) => {
			setFilterData({
				...filterData,
				cityName: values.cityName,
				countryId: parseInt(values.countryId),
				stateId: parseInt(values.stateId),
				status: parseInt(values.status),
				page: DEFAULT_PAGE,
			});
			setSelectedCity([]);
			filterServiceProps.saveState('filterCity', JSON.stringify({ ...filterData, cityName: values.cityName, stateId: parseInt(values.stateId), status: parseInt(values.status), countryId: parseInt(values.countryId) }));
		},
		[filterData]
	);
	/**
	 * Method that redirects to add page
	 */
	const handleAddNavigate = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.city}/add`);
	}, []);
	/**
	 * Method that clears the selcted data
	 */
	const clearSelectionCity = useCallback(() => {
		setSelectedCity([]);
	}, [selectedCity]);

	return (
		<div>
			<FilterCity onSearchCity={onSearchCity} clearSelectionCity={clearSelectionCity} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header'>
					<div className='flex items-center'>
						<span className='svg-icon inline-block h-3.5 w-3.5 mr-2 text-md'>
							<Marker />
						</span>
						{t('City List')}
					</div>
					<div>
						<RoleBaseGuard permissions={[PERMISSION_LIST.City.AddAccess]}>
							<Button className=' btn-primary   ' onClick={handleAddNavigate} type='button' label={t('Add New')}>
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
						columns={COL_ARR_CITY}
						queryName={GET_CITY}
						sessionFilterName='filterCity'
						singleDeleteMutation={DELETE_CITY}
						multipleDeleteMutation={GROUP_DELETE_CITY}
						updateStatusMutation={CHANGE_CITY_STATUS}
						actionWisePermissions={{
							edit: PERMISSION_LIST.City.EditAccess,
							delete: PERMISSION_LIST.City.DeleteAccess,
							changeStatus: PERMISSION_LIST.City.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.City.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.city,
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
export default City;
