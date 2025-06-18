import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { AccesibilityNames, BOOK_STATUS_DRP, DATE_FORMAT, IS_ALL } from '@config/constant';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CouponsManagementProps, FilterCouponsProps } from '@type/couponManagement';
import { getDateFromat } from '@utils/helpers';
import filterServiceProps from '@components/filter/filter';
import { MultiSelect } from 'primereact/multiselect';
import { useQuery } from '@apollo/client';
import { FETCH_CATEGORY } from '@framework/graphql/queries/category';
import i18n from '@src/i18n';

const FilterBooks = ({ onSearchCoupon, clearSelectionCoupons, filterData }: CouponsManagementProps) => {
	const { t } = useTranslation();

	const { data, refetch: fetchAllCategories } = useQuery(FETCH_CATEGORY, { variables: { isAll: IS_ALL } });
	const [categoryDroData, setCategoryDroData] = useState([]);

	const initialValues: FilterCouponsProps = {
		offerName: '',
		startDate: '',
		endDate: '',
		status: '',
		categoryId: [],
	};

	const [datesCpn, setDatesCpn] = useState<Date[]>([]);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionCoupons();

			const payload = {
				...values,
				categoryId: values.categoryId, // UUID array
			};

			if (datesCpn.length === 2) {
				payload.startDate = getDateFromat(datesCpn[0]?.toString(), DATE_FORMAT.simpleDateFormat);
				payload.endDate = getDateFromat(datesCpn[1]?.toString(), DATE_FORMAT.simpleDateFormat);
			}

			onSearchCoupon(payload);
		},
	});

	useEffect(() => {
		fetchAllCategories();
		if (data?.getAllCategories?.data?.categories?.length) {
			const tempDataArr = data.getAllCategories.data.categories.map((category: any) => {
				let translation;
				if (Array.isArray(category.category_translations)) {
					translation =
						category.category_translations.find((tr: any) => tr.lang_code === i18n.language) ||
						category.category_translations.find((tr: any) => tr.lang_code === 'en') ||
						category.category_translations[0];
				}
				return {
					name: translation?.name || category.slug || '',
					key: category.uuid,
				};
			});
			setCategoryDroData(tempDataArr);
		}
	}, [data]);
	console.log('categoryDroData', categoryDroData);

	const onReset = useCallback(() => {
		formik.resetForm();
		setDatesCpn([]);
		clearSelectionCoupons();
		onSearchCoupon(initialValues);
	}, []);

	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterCoupon', JSON.stringify(filterData));
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		if (savedFilterData.startDate && savedFilterData.endDate) {
			setDatesCpn([
				new Date(getDateFromat(savedFilterData.startDate, DATE_FORMAT.momentDateFormat)),
				new Date(getDateFromat(savedFilterData.endDate, DATE_FORMAT.momentDateFormat)),
			]);
		}

		formik.setValues(savedFilterData || initialValues);
	}, []);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<div>
							<TextInput
								id='offerName'
								placeholder={t('Search by Book Title,Author')}
								name='offerName'
								type='text'
								onChange={formik.handleChange}
								value={formik.values.offerName}
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

						<Dropdown
							ariaLabel={AccesibilityNames.Status}
							placeholder={t('')}
							name='status'
							onChange={formik.handleChange}
							value={formik.values.status ?? ''}
							options={BOOK_STATUS_DRP}
							id='status'
						/>

						<div className='[.show-menu~div_&]:lg:col-span-3 [.show-menu~div_&]:md:col-span-1 md:col-span-3'>
							<div className='btn-group col-span-3 flex items-start justify-end'>
								<Button className='btn-primary' type='submit' label={t('Search')}>
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

export default FilterBooks;
