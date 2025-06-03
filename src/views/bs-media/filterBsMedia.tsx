import React, { useCallback } from 'react';
import { useFormik } from 'formik';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import Dropdown from '@components/dropdown/dropDown';
import { Refresh, Search } from '@components/icons/icons';
import { BsMediaFilterProps, filterBsMediaProps } from '@type/bsMedia';
import { AccesibilityNames, BsMediaDirectionDrpData, BsMediaOrderByDrpData, sortBy, sortOrder } from '@config/constant';

const FilterBsMediaPage = ({ onSearchBsMedia }: BsMediaFilterProps) => {
	const { t } = useTranslation();
	const initialValues: filterBsMediaProps = {
		search: '',
		sortBy: sortBy,
		sortOrder: sortOrder,
	};
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			onSearchBsMedia(values);
		},
	});
	/**
	 * reset form data
	 */
	const onReset = useCallback(() => {
		formik.resetForm();
		onSearchBsMedia(initialValues);
	}, []);
	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<TextInput id={'name'} placeholder={t('Name')} name='search' type='text' onChange={formik.handleChange} value={formik.values.search} />

						<Dropdown ariaLabel={AccesibilityNames.sortBy} placeholder={''} name='sortBy' onChange={formik.handleChange} value={formik.values.sortBy ?? ''} options={BsMediaOrderByDrpData} id='sortBy' />

						<Dropdown ariaLabel={AccesibilityNames.sortOrder} placeholder={''} name='sortOrder' onChange={formik.handleChange} value={formik.values.sortOrder ?? ''} options={BsMediaDirectionDrpData} id='sortOrder' />

						<div className='[.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3'>
							<div className='btn-group col-span-3 flex items-start justify-end '>
								<Button className='btn-primary ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning ' onClick={onReset} label={t('Reset')}>
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
export default FilterBsMediaPage;
