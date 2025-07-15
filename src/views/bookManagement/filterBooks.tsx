import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { BOOK_STATUS_DRP, IS_ALL } from '@config/constant';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CouponsManagementProps,
  FilterCouponsProps,
  PaginationParamsCoupon,
} from '@type/bookManagement';
import filterServiceProps from '@components/filter/filter';
import { MultiSelect } from 'primereact/multiselect';
import { useQuery } from '@apollo/client';
import { FETCH_CATEGORY } from '@framework/graphql/queries/category';
import i18n from '@src/i18n';

const FilterBooks = ({
  onSearchCoupon,
  filterData,
}: CouponsManagementProps) => {
  const { t } = useTranslation();

  const { data, refetch: fetchAllCategories } = useQuery(FETCH_CATEGORY, {
    variables: { isAll: IS_ALL, isActive: true },
  });
  const [categoryDroData, setCategoryDroData] = useState([]);
  // const [isInitialRedirected, setIsInitialRedirected] = useState(false);
  const initialValues: FilterCouponsProps = {
    search: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const getStatusLabel = (key: string) => {
        const status = BOOK_STATUS_DRP.find((s) => s.key === key);
        return status ? status.name : '';
      };

      // Build the statusFilter array
      let statusFilterArr: Array<{
        status: string;
        isContentModified?: boolean;
      }> = [];

      if (Array.isArray(values.status) && values.status.length > 0) {
        statusFilterArr = values.status
          .map((key: string) => {
            const statusLabel = getStatusLabel(key);
            if (statusLabel === 'Draft') {
              return { status: 'draft' };
            }
            if (statusLabel === 'Published (Modified)') {
              return { status: 'published', isContentModified: true };
            }
            if (statusLabel === 'Unpublished (Modified)') {
              return { status: 'unpublished', isContentModified: true };
            }
            if (statusLabel === 'Published') {
              return { status: 'published', isContentModified: false };
            }
            if (statusLabel === 'Unpublished') {
              return { status: 'unpublished', isContentModified: false };
            }
            return null; // Return null for invalid
          })
          .filter(
            (obj): obj is { status: string; isContentModified?: boolean } =>
              !!obj
          ); // Filter out nulls
      }

      const filter: PaginationParamsCoupon['filter'] = {};

      // Add only if value exists
      if (values.search?.trim()) {
        filter.search = values.search.trim();
      }
      if (statusFilterArr.length > 0) {
        filter.statusFilter = statusFilterArr;
      }
      if (values.categoryId?.length) {
        filter.categories = values.categoryId;
      }
      const payload: FilterCouponsProps = {
        ...values,
        ...(Object.keys(filter).length > 0 ? { filter } : {}), // Only include `filter` if not empty
      };
      onSearchCoupon(payload);
    },
  });

  useEffect(() => {
    fetchAllCategories();
    if (data?.getAllCategories?.data?.categories?.length) {
      const tempDataArr = data.getAllCategories.data.categories.map(
        (category: any) => {
          let translation;
          if (Array.isArray(category.category_translations)) {
            translation =
              category.category_translations.find(
                (tr: any) => tr.lang_code === i18n.language
              ) ||
              category.category_translations.find(
                (tr: any) => tr.lang_code === 'en'
              ) ||
              category.category_translations[0];
          }
          return {
            name: translation?.name || category.slug || '',
            key: category.uuid,
          };
        }
      );
      setCategoryDroData(tempDataArr);
    }
  }, [data]);
  const onReset = useCallback(() => {
    formik.resetForm();
    onSearchCoupon(initialValues);
  }, []);

  useEffect(() => {
    const savedFilterDataJSONUser = filterServiceProps.getState(
      'filterCoupon',
      JSON.stringify(filterData)
    );
    const savedFilterData = JSON.parse(savedFilterDataJSONUser);

    formik.setValues(savedFilterData || initialValues);
  }, []);

  return (
    <div className='card'>
      <form onSubmit={formik.handleSubmit}>
        <div className='card-body'>
          <div className='card-grid-filter'>
            <div>
              <TextInput
                id='search'
                placeholder={t('Search by Book Title or Author')}
                name='search'
                type='text'
                onChange={formik.handleChange}
                value={formik.values.search}
              />
            </div>

            <MultiSelect
              value={formik.values.categoryId || []}
              onChange={(e) => formik.setFieldValue('categoryId', e.value)}
              options={categoryDroData}
              optionLabel='name'
              optionValue='key'
              filter
              placeholder={t('Select Category') ?? 'Select Category'}
              display='chip'
              className='w-full'
              maxSelectedLabels={6}
            />

            <MultiSelect
              value={formik.values.status ?? ''}
              onChange={(e) => formik.setFieldValue('status', e.value)}
              options={BOOK_STATUS_DRP}
              optionLabel='name'
              optionValue='key'
              placeholder={t('Select Status') ?? 'Select Status'}
              display='chip'
              className='w-full'
            />

            {/* <Dropdown
							ariaLabel={AccesibilityNames.Status}
							placeholder={t('Select Status')}
							name='status'
							onChange={formik.handleChange}
							value={formik.values.status ?? ''}
							options={BOOK_STATUS_DRP}
							id='status'
						/> */}

            <div className='[.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3'>
              <div className='btn-group col-span-3 flex items-start justify-end'>
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
                  onClick={onReset}
                  label={t('Reset')}
                >
                  <span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
                    <Refresh />
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterBooks;
