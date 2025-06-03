import React, { useCallback, useState } from 'react';
import { ColArrTypeNew, FilterCountryProps, PaginationParams } from '@type/country';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortBy, sortOrder } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { GET_COUNTRY } from '@framework/graphql/queries/country';
import { DELETE_COUNTRY, CHANGE_COUNTRY_STATUS, GROUP_DELETE_COUNTRY } from '@framework/graphql/mutations/country';
import FilterCountry from '@views/country/filterCountry';
import { Marker, PlusCircle } from '@components/icons/icons';
import Button from '@components/button/button';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
const Country = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [selectedCountry, setSelectedCountry] = useState<string[]>([]);
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParams>(
		localFilterData('filtercountry') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			name: '',
			countryCode: '',
			status: null,
			currencyCode: '',
			phoneCode: '',
		}
	);
	const COL_ARR = [
		{ name: t('Country Name'), sortable: true, fieldName: 'name', type: 'text', headerCenter: false },
		{ name: t('Country Code'), sortable: true, fieldName: 'country_code', type: 'text', headerCenter: false },
		{ name: t('Phone Code'), sortable: true, fieldName: 'phone_code', type: 'text', headerCenter: false },
		{ name: t('Currency Symbol'), sortable: true, fieldName: 'currency_code', type: 'text', headerCenter: false },
		{ name: t('Created At'), sortable: true, fieldName: 'created_at', type: 'date', headerCenter: false },
		{ name: t('Updated At'), sortable: true, fieldName: 'updated_at', type: 'date', headerCenter: false },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
	] as ColArrTypeNew[];
	const onSearchCountry = useCallback(
		(values: FilterCountryProps) => {
			const updatedFilterData = {
				...filterData,
				name: values.name,
				countryCode: values.countryCode,
				status: parseInt(values.status),
				currencyCode: values.currencyCode,
				phoneCode: values.phoneCode,
				page: DEFAULT_PAGE,
			};
			setFilterData(updatedFilterData);
		},
		[filterData]
	);

	const handleAddcity = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.country}/${ROUTES.add}`);
	}, []);

	const clearSelectionCountry = useCallback(() => {
		setSelectedCountry([]);
	}, [selectedCountry]);
	return (
		<div>
			<FilterCountry onSearchCountry={onSearchCountry} clearSelectionCountry={clearSelectionCountry} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header'>
					<div className='flex items-center'>
						<span className='svg-icon inline-block h-3.5 w-3.5 mr-2 text-md'>
							<Marker />
						</span>
						{t('Country List')}
					</div>

					<div>
						<RoleBaseGuard permissions={[PERMISSION_LIST.Country.AddAccess]}>
							<Button className='btn-primary  ' onClick={handleAddcity} type='button' label={t('Add New')}>
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
						queryName={GET_COUNTRY}
						sessionFilterName='filtercountry'
						singleDeleteMutation={DELETE_COUNTRY}
						multipleDeleteMutation={GROUP_DELETE_COUNTRY}
						updateStatusMutation={CHANGE_COUNTRY_STATUS}
						actionWisePermissions={{
							edit: PERMISSION_LIST.Country.EditAccess,
							delete: PERMISSION_LIST.Country.DeleteAccess,
							changeStatus: PERMISSION_LIST.Country.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.Country.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.country,
							},
						}}
						statusKey={'status'}
						idKey={'uuid'}
						multipleDeleteApiId={'groupDeleteCountriesId'}
						singleDeleteApiId={'deleteCountryId'}
						statusChangeApiId={'changeCountryStatusId'}
						statusChangeApiKeyTitle={'status'}
					/>
				</div>
			</div>
		</div>
	);
};
export default Country;
