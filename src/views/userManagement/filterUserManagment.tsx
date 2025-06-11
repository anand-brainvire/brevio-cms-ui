import React, { ReactElement, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { FilterUserProps, UserProps } from '@type/user';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import filterServiceProps from '@components/filter/filter';

const FilterUserManagement = ({ onSearchUser, clearSelectionUserMng, filterData }: UserProps): ReactElement => {
	const { t } = useTranslation();

	const initialValues: FilterUserProps = {
		search: '',
	};

	/**
	 * Method that sets the filterdata in local storage
	 */
	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterusermangment', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, [filterData]);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionUserMng();
			onSearchUser(values);
		},
	});

	/**
	 * method that reset filter data
	 */
	const onReset = useCallback(() => {
		formik.resetForm();
		onSearchUser(initialValues);
	}, []);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<TextInput id={'search'} placeholder={t('Search')} name='search' type='text' onChange={formik.handleChange} value={formik.values.search} />

						<div>
							<div className='flex items-start justify-end col-span-3 btn-group '>
								<Button className='btn-primary ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-secondary' onClick={onReset} label={t('Reset')}>
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
