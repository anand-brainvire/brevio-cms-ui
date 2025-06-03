import React, { useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { useTranslation } from 'react-i18next';
import { BannerProps, FilterBannerProps } from '@type/banner';
import { AccesibilityNames, STATUS_DRP } from '@config/constant';
import DropDown from '@components/dropdown/dropDown';
import filterServiceProps from '@components/filter/filter';

const FilterBanner = ({ onSearchBanner, filterData }: BannerProps) => {
	const { t } = useTranslation();

	const initialValues: FilterBannerProps = {
		bannerTitle: '',
		createdBy: '',
		status: '',
	};
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			onSearchBanner(values);
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

	const onResetBanner = useCallback(() => {
		formik.resetForm();
		onSearchBanner(initialValues);
	}, []);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<div>
							<TextInput id={'bannerTitle'} placeholder={t('Banner Title')} name='bannerTitle' type='text' onChange={formik.handleChange} value={formik.values.bannerTitle} />
						</div>
						<div>
							<TextInput id={'createdBy'} placeholder={t('Created by')} name='createdBy' type='text' onChange={formik.handleChange} value={formik.values.createdBy} />
						</div>

						<DropDown ariaLabel={AccesibilityNames.Status} placeholder={''} name='status' onChange={formik.handleChange} value={formik.values.status ?? ''} options={STATUS_DRP} id='status' />

						<div className=' [.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3 '>
							<div className='flex  items-start justify-end col-span-3 btn-group '>
								<Button className='btn-primary  ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning ' onClick={onResetBanner} label={t('Reset')}>
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
