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
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { Listing, PlusCircle, Refresh, Search } from '@components/icons/icons';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  sortOrder,
  ROUTES,
  STATUS_OPTION,
} from '@config/constant';
import {
  DELETE_CATEGORY,
  UPDATE_CATEGORY_STATUS,
} from '@framework/graphql/mutations/category';
import { FETCH_CATEGORY } from '@framework/graphql/queries/category';
import DropDown from '@components/dropdown/dropDown';

const categoryManagement = (): ReactElement => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const initialFilter = {
    limit: DEFAULT_LIMIT,
    offset: 0,
    sortBy: 'created_at',
    sortOrder: sortOrder,
    search: '',
    page: DEFAULT_PAGE,
    isActive: null,
  };

  const [filterData, setFilterData] = useState<PaginationParams>(initialFilter);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [tempFilter, setTempFilter] = useState({
    search: initialFilter.search || '',
    isActive:
      initialFilter.isActive === true
        ? 'true'
        : initialFilter.isActive === false
        ? 'false'
        : '',
  });

  const COL_ARR_CATEGORY = [
    {
      name: t('Name'),
      sortable: true,
      fieldName: 'category_translations',
      type: 'multilang',
      translationKey: 'name',
      sortKey: 'name',
      headerCenter: true,
    },
    {
      name: t('Slug'),
      sortable: false,
      fieldName: 'slug',
      type: 'text',
      headerCenter: true,
    },
    {
      name: t('Description'),
      sortable: false,
      fieldName: 'category_translations',
      translationKey: 'description',
      type: 'multilang',
      headerCenter: true,
    },
    {
      name: t('Status'),
      sortable: true,
      fieldName: 'is_active',
      type: 'status',
      headerCenter: true,
    },
  ] as ColArrType[];

  const handleLimitChange = (newLimit:number) => {
	  setLimit(newLimit);
	  setFilterData((prev) => ({ ...prev, limit: newLimit, page: 1 }));
	};

  const onSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTempFilter((prev) => ({ ...prev, search: e.target.value }));
    },
    []
  );

  const onStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTempFilter((prev) => ({ ...prev, isActive: e.target.value }));
    },
    []
  );

  const onSearchButtonClick = useCallback(() => {
    const updatedFilter: PaginationParams = {
      ...filterData,
      search: tempFilter.search.trim(),
      isActive:
        tempFilter.isActive === 'true'
          ? true
          : tempFilter.isActive === 'false'
          ? false
          : null,
      page: DEFAULT_PAGE,
      offset: 0,
			limit:limit
    };

    setFilterData(updatedFilter);
    filterServiceProps.saveState(
      'filterFaqmangment',
      JSON.stringify(updatedFilter)
    );
  }, [tempFilter, filterData, limit]);

  const onResetButtonClick = useCallback(() => {
    const resetFilter: PaginationParams = {
      ...filterData,
      search: '',
      isActive: null,
      page: DEFAULT_PAGE,
      offset: 0,
      limit: DEFAULT_LIMIT
    };
    handleLimitChange(DEFAULT_LIMIT);
    setTempFilter({
      search: '',
      isActive: '',
    });
    setFilterData(resetFilter);
    filterServiceProps.saveState(
      'filterFaqmangment',
      JSON.stringify(resetFilter)
    );
  }, [filterData]);

  const Navigation = useCallback(() => {
    navigate(`/${ROUTES.app}/${ROUTES.category}/${ROUTES.add}`);
  }, [navigate]);

  return (
    <div>
      <div className='card'>
        <div className='card-body'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchButtonClick();
            }}
          >
            <div className='card-grid-filter'>
              <TextInput
                value={tempFilter.search}
                id='faqSearch'
                placeholder={t('Search by Category Name or Slug')}
                name='search'
                type='text'
                onChange={onSearchInputChange}
              />
              <DropDown
                id='status'
                name='status'
                placeholder='Select Status'
                options={STATUS_OPTION}
                onChange={onStatusChange}
                value={tempFilter.isActive}
                className='w-64'
              />
              <div>
                <div className='flex items-start justify-end col-span-3 btn-group '>
                  <Button
                    className='btn-primary'
                    type='submit'
                    label={t('Search')}
                  >
                    <span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
                      <Search />
                    </span>
                  </Button>
                  <Button
                    className='btn-secondary'
                    type='button'
                    onClick={onResetButtonClick}
                    label={t('Reset')}
                  >
                    <span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
                      <Refresh />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
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
              <Button
                className='btn-primary'
                onClick={Navigation}
                type='button'
                label={t('Add New')}
              >
                <span className='inline-block w-4 h-4 mr-1 svg-icon'>
                  <PlusCircle />
                </span>
              </Button>
            </RoleBaseGuard>
          </div>
        </div>
        <div className='card-body'>
          <BVDataTable
            limit={limit}
    				onLimitChange={handleLimitChange}
            defaultActions={[
              'edit',
              'delete',
              'change_status',
              'multiple_delete',
            ]}
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
            statusKey='is_active'
            idKey='uuid'
            multipleDeleteApiId='groupDeleteFaqsId'
            singleDeleteApiId='deleteFaqId'
            statusChangeApiId='changeFaqStatusId'
            statusChangeApiKeyTitle='status'
          />
        </div>
      </div>
    </div>
  );
};

export default categoryManagement;
