import React, { ReactElement, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { useTranslation } from 'react-i18next';
import { SubAdminProps } from '@type/subAdmin';
import filterServiceProps from '@components/filter/filter';

const FilterSubAdmin = ({ onSearchSubAdmin, filterData }: SubAdminProps): ReactElement => {
    const { t } = useTranslation();

    const initialValues = {
        search: '',
    };

    useEffect(() => {
        const savedFilterDataJSONUser = filterServiceProps.getState('filtersubadmin', JSON.stringify(filterData));
        const savedFilterData = JSON.parse(savedFilterDataJSONUser);
        formik.setValues(savedFilterData || initialValues);
    }, [filterData]);

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            onSearchSubAdmin(values);
        },
    });

    const onReset = useCallback(() => {
        formik.resetForm();
        onSearchSubAdmin(initialValues);
    }, []);

    return (
        <div className='card'>
            <form onSubmit={formik.handleSubmit}>
                <div className='card-body'>
                    <div className='card-grid-filter'>
                        <TextInput
                            id={'search'}
                            placeholder={t('Search')}
                            name='search'
                            type='text'
                            onChange={formik.handleChange}
                            value={formik.values.search}
                        />
                        <div>
                            <div className='btn-group flex items-start justify-end'>
                                <Button type='submit' className='btn-primary ' label={t('Search')}>
                                    <span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
                                        <Search />
                                    </span>
                                </Button>
                                <Button onClick={onReset} className='btn-warning ' label={t('Reset')}>
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

export default FilterSubAdmin;
