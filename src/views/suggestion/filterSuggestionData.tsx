import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { AccesibilityNames, SuggestionCategoryDrpData } from '@config/constant';
import { GET_CATEGORY } from '@framework/graphql/queries/suggestion';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownOptionType } from '@type/component';
import filterServiceProps from '@components/filter/filter';
import { CategoryDrpDataArr, FilterSuggestionProps, SuggestionProps } from '@type/suggestion';

const FilterSuggestionData = ({ onSearchSuggestion, filterData }: SuggestionProps) => {
	const { data } = useQuery(GET_CATEGORY);
	const [categoryDrpData, setCategoryDrpData] = useState<DropdownOptionType[]>([]);
	const { t } = useTranslation();

	/**
	 * Method used for set category dropdown array
	 */
	useEffect(() => {
		if (data?.fetchCategory) {
			const tempDataArr = [] as DropdownOptionType[];
			if (data) {
				data?.fetchCategory?.data?.Categorydata?.map((data: CategoryDrpDataArr) => {
					tempDataArr.push({ name: data.category_name, key: data.id });
				});
				setCategoryDrpData(tempDataArr);
			}
		}
	}, [data]);

	useEffect(() => {
		const savedFilterDataJSONUser = filterServiceProps.getState('filtersuggestion', JSON.stringify(filterData));

		// Parse the JSON data retrieved from local storage
		const savedFilterData = JSON.parse(savedFilterDataJSONUser);

		// Set the formik field values using setValues
		formik.setValues(savedFilterData || initialValues);
	}, [filterData]);

	const initialValues: FilterSuggestionProps = {
		suggestion: '',
		createdBy: '',
		status: '',
		categoryId: '',
	};

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			onSearchSuggestion(values);
		},
	});
	/**
	 * method that reset filter data
	 */
	const onReset = useCallback(() => {
		formik.resetForm();
		onSearchSuggestion(initialValues);
	}, []);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-grid-filter'>
						<Dropdown ariaLabel={AccesibilityNames.categoryId} placeholder={t('Select Category')} name='categoryId' onChange={formik.handleChange} value={formik.values.categoryId ?? ''} options={categoryDrpData} id='categoryId' />

						<TextInput id={'suggestion'} placeholder={t('Suggestion')} name='suggestion' type='text' onChange={formik.handleChange} value={formik.values.suggestion} />

						<TextInput id={'createdBy'} placeholder={t('Posted By')} name='createdBy' onChange={formik.handleChange} value={formik.values.createdBy} />

						<Dropdown ariaLabel={AccesibilityNames.Status} placeholder={t('Select Status')} name='status' onChange={formik.handleChange} value={formik.values.status ?? ''} options={SuggestionCategoryDrpData} id='status' />

						<div className='md:col-span-2'>
							<div className=' flex space-x-2 justify-end '>
								<Button type='submit' className='btn-primary ' label={t('Search')}>
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

export default FilterSuggestionData;
