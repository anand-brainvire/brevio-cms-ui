import BVDataTable from '@components/BVDatatable/BVDataTable'
import Button from '@components/button/button'
import { GeoLocationIcon, PlusCircle } from '@components/icons/icons'
import RoleBaseGuard from '@components/roleGuard'
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortOrder } from '@config/constant'
import { PERMISSION_LIST } from '@config/permission'
import { CHANGE_GEOLOCATION_STATUS, GROUP_DELETE_GEOLOCATION, SINGLE_DELETE_GEOLOCATION } from '@framework/graphql/mutations/geoLocation'
import { FETCH_GEOLOCATION } from '@framework/graphql/queries/geoLocation'
import useSaveFilterData from '@src/hooks/useSaveFilterData'
import { ColArrType } from '@type/banner'
import { t } from 'i18next'
import filterServiceProps from '@components/filter/filter';
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterGeoLocation from '@views/geoLocation/filterGeoLocation'
import { PaginationParams } from '@type/role'
import { FilterGeoLocationProps } from '@type/geoLocation'
const GeoLocation = () => {
    const { localFilterData } = useSaveFilterData();
    const [selectedGeoLocation, setSelectedGeoLocation] = useState<string[]>([]);
    const [filterData, setFilterData] = useState<PaginationParams>(
        localFilterData('filterGeoLocation') ?? {
            page: DEFAULT_PAGE,
            limit: DEFAULT_LIMIT,
            name: '',
            address: '',
            status: null,
            sortBy: 'created_at',
            sortOrder: sortOrder,
        }
    );

    const COL_ARR = [
        {
            name: t('name'),
            sortable: true,
            fieldName: 'name',
            type: 'text',
        },
        {
            name: t('Address'),
            sortable: true,
            fieldName: 'address',
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

    const navigate = useNavigate()

    const Navigation = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.geoLocation}/add`);
    }, []);
    const onSearchGeoLocation = useCallback((values: FilterGeoLocationProps) => {
        const updatedFilterData = {
            ...filterData,
            name: values.name,
            address: values.address,
            page: DEFAULT_PAGE,
        };
        setFilterData(updatedFilterData);
        setSelectedGeoLocation([]);
        filterServiceProps.saveState('filterGeoLocation', JSON.stringify(updatedFilterData));
    }, []);
    const clearSelectionGeoLocation = useCallback(() => {
        setSelectedGeoLocation([]);
    }, [selectedGeoLocation]);
    return (
        <div>
            <FilterGeoLocation onSearchGeoLocation={onSearchGeoLocation} clearSelectionGeoLocation={clearSelectionGeoLocation} filterData={filterData} />

            <div className='card-table'>
                <div className='card-header '>
                    <div className='flex items-center'>
                        <span className='w-3.5 h-3.5 mr-2 inline-block svg-icon'>
                            <GeoLocationIcon />
                        </span>
                        {t('Geo Location List')}
                    </div>
                    <div>
                        <RoleBaseGuard permissions={[PERMISSION_LIST.GeoLocation.AddAccess]}>
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
                        defaultActions={['edit', 'delete', 'view', 'change_status', 'multiple_delete']}
                        columns={COL_ARR}
                        queryName={FETCH_GEOLOCATION}
                        sessionFilterName='filterGeoLocation'
                        singleDeleteMutation={SINGLE_DELETE_GEOLOCATION}
                        multipleDeleteMutation={GROUP_DELETE_GEOLOCATION}
                        updateStatusMutation={CHANGE_GEOLOCATION_STATUS}
                        actionWisePermissions={{
                            edit: PERMISSION_LIST.GeoLocation.EditAccess,
                            delete: PERMISSION_LIST.GeoLocation.DeleteAccess,
                            changeStatus: PERMISSION_LIST.GeoLocation.ChangeStatusAccess,
                            multipleDelete: PERMISSION_LIST.GeoLocation.GroupDeleteAcsess,
                        }}
                        updatedFilterData={filterData}
                        actionData={{
                            edit: {
                                route: ROUTES.geoLocation,
                            },
                            view: {
                                route: ROUTES.geoLocation,
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
    )
}

export default GeoLocation