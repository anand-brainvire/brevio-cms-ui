import React, { useCallback, useEffect } from 'react';
import { ReviewProps, FilterDataArrReviewProps } from '@type/review';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { Refresh, Search } from '@components/icons/icons';
import filterServiceProps from '@components/filter/filter';

const FilterManageRulesSets = ({ onSearchReview, clearSelectionReviews, filterData }: ReviewProps) => {
	const { t } = useTranslation();
	const initialValues: FilterDataArrReviewProps = {
		search: '',
	};
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionReviews();
			onSearchReview(values);
		},
	});

	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filterreview', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, []);
	/**
	 * method that reset filter data
	 */
	const onResetReview = useCallback(() => {
		formik.resetForm();
		onSearchReview(initialValues);
	}, []);
	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter '>
						<div className='lg:col-span-1'>
							<TextInput type='text' id='table-search' name='search' value={formik.values.search} placeholder={t('To Name')} onChange={formik.handleChange} />
						</div>
						<div className='md:col-span-2 [.show-menu~div_&]:md:col-span-1 [.show-menu~div_&]:lg:col-span-2'>
							<div className='btn-group  flex items-start justify-end '>
								<Button className='btn-primary ' type='submit' label={t('Search')}>
									<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
										<Search />
									</span>
								</Button>
								<Button className='btn-warning ' onClick={onResetReview} label={t('Reset')}>
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
export default FilterManageRulesSets;
