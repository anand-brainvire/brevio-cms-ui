import React, { ReactElement, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { FilterUserProps, UserProps } from '@type/user';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
// import filterServiceProps from '@components/filter/filter';
import { DEFAULT_LIMIT, STATUS_DRP, SUBSCRIPTION_STATUS } from '@config/constant';
import DropDown from '@components/dropdown/dropDown';

const FilterUserManagement = ({
  onSearchUser,
  clearSelectionUserMng,
  onLimitChange,
}: UserProps): ReactElement => {
  const { t } = useTranslation();

  const initialValues: FilterUserProps = {
    search: '',
    isActive: '',
    subscriptionStatus: '',
  };

  /**
   * Method that sets the filterdata in local storage
   */
//   useEffect(() => {
//     const savedFilterDataJSONUser = filterServiceProps.getState(
//       'filterusermangment',
//       JSON.stringify(filterData)
//     );

    // Parse the JSON data retrieved from local storage
    // const savedFilterData = JSON.parse(savedFilterDataJSONUser);

    // Set the formik field values using setValues
    // formik.setValues(savedFilterData || initialValues);
//   }, [filterData]);

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      clearSelectionUserMng();
      const payload: any = {
        search: values.search.trim(),
        subscriptionStatus: values.subscriptionStatus
      };
      if (values.isActive === '1') {
        payload.isActive = true;
      } else if (values.isActive === '0') {
        payload.isActive = false;
      } else {
        payload.isActive = null;
      }
      onSearchUser(payload);
    },
  });

  /**
   * method that reset filter data
   */
  const onReset = useCallback(() => {
    onLimitChange(DEFAULT_LIMIT);
    formik.resetForm();
    const resetPayload: any = {
      search: '',
      isActive: null,
      subscriptionStatus: null,
    };

    onSearchUser(resetPayload);
  }, []);

  useEffect(() => {
	formik.resetForm();
	const resetPayload: any = {
      search: '',
      isActive: null,
      subscriptionStatus: null,
    };
	onSearchUser(resetPayload)
  },[])
  return (
    <div className='card'>
      <form onSubmit={formik.handleSubmit}>
        <div className='card-body'>
          <div className='card-grid-filter'>
            <TextInput
              id={'search'}
              placeholder={t('Search by Email Id')}
              name='search'
              type='text'
              onChange={formik.handleChange}
              value={formik.values.search}
            />
            <DropDown
              id='subscriptionStatus'
              name='subscriptionStatus'
              options={SUBSCRIPTION_STATUS}
              onChange={(e) => formik.setFieldValue('subscriptionStatus', e.target.value)}
              value={formik.values.subscriptionStatus ?? ''}
              className='w-full'
            />
            <DropDown
              id='isActive'
              name='isActive'
              options={STATUS_DRP}
              onChange={(e) => formik.setFieldValue('isActive', e.target.value)}
              value={formik.values.isActive ?? ''}
              className='w-full'
            />
              <div className='[.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3'>
                <div className='btn-group col-span-3 flex items-start justify-end'>
                  <Button
                    className='btn-primary '
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
export default FilterUserManagement;
