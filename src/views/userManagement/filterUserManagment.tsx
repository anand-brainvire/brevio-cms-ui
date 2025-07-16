import React, { ReactElement, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { FilterUserProps, UserProps } from '@type/user';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
// import filterServiceProps from '@components/filter/filter';
import { STATUS_DRP } from '@config/constant';
import DropDown from '@components/dropdown/dropDown';

const FilterUserManagement = ({
  onSearchUser,
  clearSelectionUserMng,
}: UserProps): ReactElement => {
  const { t } = useTranslation();

  const initialValues: FilterUserProps = {
    search: '',
    isActive: '',
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
    formik.resetForm();

    const resetPayload: any = {
      search: '',
      isActive: null,
    };

    onSearchUser(resetPayload);
  }, []);

  useEffect(() => {
	formik.resetForm();
	const resetPayload: any = {
      search: '',
      isActive: null,
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
              id='isActive'
              name='isActive'
              options={STATUS_DRP}
              onChange={(e) => formik.setFieldValue('isActive', e.target.value)}
              value={formik.values.isActive ?? ''}
              className='w-64'
            />
            <div>
              <div className='flex items-start justify-end col-span-3 btn-group '>
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
