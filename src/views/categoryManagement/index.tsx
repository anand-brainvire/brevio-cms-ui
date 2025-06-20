import React, { ReactElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GRP_DEL_FAQ } from '@framework/graphql/mutations/faq';
import { ColArrType, PaginationParams } from '@type/role';
import Button from '@components/button/button';
import TextInput from '@components/textinput/TextInput';
import filterServiceProps from '@components/filter/filter';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { Listing, PlusCircle, Refresh, Search } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortOrder, ROUTES } from '@config/constant';
import { DELETE_CATEGORY,UPDATE_CATEGORY_STATUS } from '@framework/graphql/mutations/category';
import {FETCH_CATEGORY} from '@framework/graphql/queries/category';
const categoryManagement = (): ReactElement => {
    const { t } = useTranslation();
    const { localFilterData } = useSaveFilterData();

    const [filterData, setFilterData] = useState<PaginationParams>(
        localFilterData('filterFaqmangment') ?? {
            limit: DEFAULT_LIMIT,
            offset: ((DEFAULT_PAGE ?? DEFAULT_PAGE) - 1) * DEFAULT_LIMIT,
            sortBy: 'created_at',
            sortOrder: sortOrder,
            search: '',
            page: DEFAULT_PAGE,
        }
    );

    const [searchInput, setSearchInput] = useState(filterData.search || '');

    const COL_ARR_CATEGORY = [
        { name: t('Name'), sortable: false, fieldName: 'category_translations', type: 'multilang', translationKey: 'name' },
        { name: t('Slug'), sortable: false, fieldName: 'slug', type: 'text' },
        { name: t('Description'), sortable: false, fieldName: 'category_translations', type: 'multilang', translationKey: 'description' },
        { name: t('Status'), sortable: true, fieldName: 'is_active', type: 'status', headerCenter: 'true' },
    ] as ColArrType[];

    const navigate = useNavigate();

    const onSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }, []);

    const onSearchButtonClick = useCallback(() => {
        const updatedFilterData = {
            ...filterData,
            search: searchInput.trim(),
            page: DEFAULT_PAGE,
            offset: ((DEFAULT_PAGE ?? filterData.page) - 1) * filterData.limit,
        };
        setFilterData(updatedFilterData);
        filterServiceProps.saveState('filterFaqmangment', JSON.stringify(updatedFilterData));
    }, [filterData, searchInput]);

    const onResetButtonClick = useCallback(() => {
        const resetFilter = {
            ...filterData,
            search: '',
            page: DEFAULT_PAGE,
        };
        setSearchInput('');
        setFilterData(resetFilter);
        filterServiceProps.saveState('filterFaqmangment', JSON.stringify(resetFilter));
    }, [filterData]);

    const Navigation = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.category}/${ROUTES.add}`);
    }, [navigate]);

    return (
        <div>
            <div className='card'>
                <div className='card-body'>
                    <div className='card-grid-filter'>
                        <TextInput
                            value={searchInput}
                            id={'faqSearch'}
                            placeholder={t('Search')}
                            name='search'
                            type='text'
                            onChange={onSearchInputChange}
                        />
                        <div>
                            <div className='flex items-start justify-end col-span-3 btn-group '>
                                <Button className='btn-primary' type='button' label={t('Search')} onClick={onSearchButtonClick}>
                                    <span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
                                        <Search />
                                    </span>
                                </Button>
                                <Button className='btn-secondary' type='button' onClick={onResetButtonClick} label={t('Reset')}>
                                    <span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
                                        <Refresh />
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card-table'>
                <div className='card-header'>
                    <div className='flex items-center'>
                        <span className='mr-2 w-3.5 h-3.5 inline-block svg-icon text-md'>
                            <Listing />
                        </span>
                        {t('Category List')}
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        <RoleBaseGuard permissions={[PERMISSION_LIST.Category.AddAccess]}>
                            <Button className=' btn-primary' onClick={Navigation} type='button' label={t('Add New')}>
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
                        columns={COL_ARR_CATEGORY}
                        queryName={FETCH_CATEGORY}
                        sessionFilterName='filterFaqmangment'
                        singleDeleteMutation={DELETE_CATEGORY}
                        multipleDeleteMutation={GRP_DEL_FAQ}
                        updateStatusMutation={UPDATE_CATEGORY_STATUS}
                        actionWisePermissions={{
                            edit: PERMISSION_LIST.Category.EditAccess,
                            delete: PERMISSION_LIST.Category.DeleteAccess,
                            changeStatus: PERMISSION_LIST.Category.ChangeStatusAccess,
                        }}
                        updatedFilterData={filterData}
                        actionData={{
                            edit: {
                                route: ROUTES.category,
                            },
                        }}
                        statusKey={'is_active'}
                        idKey={'uuid'}
                        multipleDeleteApiId={'groupDeleteFaqsId'}
                        singleDeleteApiId={'deleteFaqId'}
                        statusChangeApiId={'changeFaqStatusId'}
                        statusChangeApiKeyTitle={'status'}
                    />
                </div>
            </div>
        </div>
    );
};
export default categoryManagement;
