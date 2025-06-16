import React, { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { useTranslation } from 'react-i18next';
import { BannerProps, FilterAuthorProps } from '@type/banner';
// import { AccesibilityNames, STATUS_DRP } from '@config/constant';
// import DropDown from '@components/dropdown/dropDown';
import filterServiceProps from '@components/filter/filter';

const FilterBanner = ({ onSearchAuthor, filterData }: BannerProps) => {
	const { t } = useTranslation();

	const initialValues: FilterAuthorProps = {
		search: '',
	};
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			onSearchAuthor(values);
		},
	});
	/**
	 * Method that sets filters data in local storage
	 */
	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterBanner', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, []);

	const onReset = useCallback(() => {
		formik.resetForm();
		onSearchAuthor(initialValues);
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
								<Button onClick={onReset} className='btn-secondary' label={t('Reset')}>
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
export default FilterBanner;
