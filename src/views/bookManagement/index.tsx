import { FETCH_BOOKS } from '@framework/graphql/queries/bookManagement';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BOOK_PUBLISH_STATUS,
  DELETE_BOOK_BY_ID,
  GROUP_DELETE_COUPON,
} from '@framework/graphql/mutations/bookManagement';
import FilterBooks from '@views/bookManagement/filterBooks';
import Button from '@components/button/button';
import filterServiceProps from '@components/filter/filter';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { BookIcon, PlusCircle } from '@components/icons/icons';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  ROUTES,
} from '@config/constant';
import {
  PaginationParamsCoupon,
  FilterCouponsProps,
} from '@type/bookManagement';
import { useLocation } from 'react-router-dom';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import CreateBook from './createBook';

const bookManagaement = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [defaultCategoryId] = useState<string | null>(
    queryParams.get('categoryId')
  );
  const [isBookModalOpen, setBookModalOpen] = useState(false);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [filterData, setFilterData] = useState<PaginationParamsCoupon>(
    {
      limit: DEFAULT_LIMIT,
      sortBy: '',
      sortOrder: '',
      offset: 0,
      page: DEFAULT_PAGE
    }
  );

  useEffect(() => {
    if (defaultCategoryId) {
      setFilterData({
        limit: DEFAULT_LIMIT,
        sortBy: '',
        sortOrder: '',
        offset: 0,
        filter: {
          categories: [defaultCategoryId],
        },
      });
    }
  }, [defaultCategoryId]);
	
  const handleLimitChange = (newLimit:number) => {
	  setLimit(newLimit);
	  setFilterData((prev) => ({ ...prev, limit: newLimit, page: 1 }));
	};


  const COL_ARR_COUPONS = [
    {
      name: t('Book Title'),
      sortable: true,
      fieldName: 'title',
      type: 'text',
      headerCenter: true,
    },
    {
      name: t('Category'),
      sortable: true,
      fieldName: 'categories',
      type: 'multipleText',
      headerCenter: true,
    },
    {
      name: t('Book Author'),
      sortable: true,
      fieldName: 'authors',
      type: 'multipleText',
      headerCenter: true,
    },
    {
      name: t('Cover Image'),
      sortable: false,
      fieldName: 'cover_image_url_view',
      type: 'image',
      headerCenter: true,
    },
    {
      name: t('Status'),
      sortable: false,
      fieldName: 'status',
      type: 'bookStatus',
      headerCenter: true,
    },
    {
      name: t('Last Updated'),
      sortable: true,
      fieldName: 'updated_at',
      type: 'date',
      headerCenter: true,
    },
  ] as IColumnsProps[];

  /**
   *
   * @param values are used set the filter data
   */
  const onSearchCoupon = useCallback((values: FilterCouponsProps & { filter?: PaginationParamsCoupon['filter'] }) => {
      setFilterData({
        ...filterData,
        filter: values.filter,
			  limit:limit
      });
      filterServiceProps.saveState('filterCoupon',JSON.stringify({...filterData,filter: values.filter,})
      );
    },
    [limit,filterData]
  );

  /**
   * Method that redirects to add page
   */
  const openAddBookModal = useCallback(() => {
    setBookModalOpen(true);
  }, []);

  const onSubmitBook = useCallback(() => {
    setBookModalOpen(false);
    setFilterData((prev) => ({
      ...prev,
      refreshKey: Date.now(), // This will cause BVDataTable to re-render
    }));
  }, []);

  /**
   * function that download file base on file type
   */

  return (
    <div>
      <FilterBooks onLimitChange={handleLimitChange} onSearchCoupon={onSearchCoupon} filterData={filterData} defaultCategoryId={defaultCategoryId}/>
      <div className='card-table'>
        <div className='card-header'>
          <div className='flex items-center'>
            <span className='w-3.5 h.3.5 mr-2 text-gray-800 inline-block svg-icon'>
              <BookIcon />
            </span>
            <span className='text-sm font-normal'>{t('Book List')}</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            <RoleBaseGuard permissions={[PERMISSION_LIST.Book.AddAccess]}>
              <Button
                className='btn-primary  '
                onClick={openAddBookModal}
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
              'multiple_delete',
              'change_book_status',
            ]}
            columns={COL_ARR_COUPONS}
            queryName={FETCH_BOOKS}
            sessionFilterName='filterCoupon'
            singleDeleteMutation={DELETE_BOOK_BY_ID}
            multipleDeleteMutation={GROUP_DELETE_COUPON}
            updateStatusMutation={BOOK_PUBLISH_STATUS}
            actionWisePermissions={{
              edit: PERMISSION_LIST.Book.EditAccess,
              delete: PERMISSION_LIST.Book.DeleteAccess,
              changeStatus: PERMISSION_LIST.Book.ChangeStatusAccess,
            }}
            updatedFilterData={filterData}
            actionData={{
              edit: {
                route: ROUTES.manageBooks,
              },
            }}
            statusKey={'status'}
            idKey={'uuid'}
            multipleDeleteApiId={'uuid'}
            singleDeleteApiId={'uuid'}
            statusChangeApiId={'uuid'}
            statusChangeApiKeyTitle={'is_published'}
          />
        </div>
      </div>
      <CreateBook isVisible={isBookModalOpen} onSubmitBook={onSubmitBook} />
    </div>
  );
};
export default bookManagaement;
