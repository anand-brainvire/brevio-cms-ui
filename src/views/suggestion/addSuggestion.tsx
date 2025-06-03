import { useMutation, useQuery } from '@apollo/client';
import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { ROUTES } from '@config/constant';
import { CREATE_SUGGESTION } from '@framework/graphql/mutations/suggestion';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DropdownOptionType } from '@type/component';
import { CategoryDrpDataArr } from '@type/suggestion';
import { GET_CATEGORY } from '@framework/graphql/queries/suggestion';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import TextInput from '@components/textinput/TextInput';
import { whiteSpaceRemover } from '@utils/helpers';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';

const AddSuggestion = () => {
	const [categoryDrpData, setCategoryDrpData] = useState<DropdownOptionType[]>([]);
	const { t } = useTranslation();
	const { data } = useQuery(GET_CATEGORY);
	const [createSuggestion] = useMutation(CREATE_SUGGESTION);
	const { addSuggestionValidationSchema } = useValidation();
	const navigate = useNavigate();
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

	const initialValues = {
		categoryId: '',
		suggestion: '',
		status: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addSuggestionValidationSchema,
		onSubmit: (values) => {
			createSuggestion({
				variables: {
					status: 4,
					categoryId: parseInt(values.categoryId),
					suggestion: values.suggestion,
				},
			})
				.then((res) => {
					const data = res.data;
					if (data.createSuggestion.meta.statusCode === 200) {
						toast.success(data.createSuggestion.meta.message);
						formik.resetForm();
						onCancelSuggestion();
					}
				})
				.catch(() => {
					return;
				});
		},
	});
	/**
	 * Method that redirect to list page
	 */
	const onCancelSuggestion = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.suggestion}/${ROUTES.list}`);
	}, []);
	/**
	 * Handle blur that removes white space's
	 */
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	return (
		<div className='card'>
			<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
				<form onSubmit={formik.handleSubmit}>
					<div className='card-body'>
						<div className='card-title-container'>
							<p>
								{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
							</p>
						</div>
						<div className='card-grid-addedit-page'>
							<Dropdown required={true} placeholder={t('Select Category')} name='categoryId' onChange={formik.handleChange} value={formik.values.categoryId} options={categoryDrpData} id='categoryId' label={t('Select Category')} error={formik.errors.categoryId && formik.touched.categoryId ? formik.errors.categoryId : ''} />

							<div>
								<TextInput id={'suggestion'} onBlur={OnBlur} required={true} placeholder={t('Suggestion')} name='suggestion' onChange={formik.handleChange} label={t('Suggestion')} value={formik.values.suggestion} error={formik.errors.suggestion && formik.touched.suggestion ? formik.errors.suggestion : ''} />
							</div>
							{/* 
							<Dropdown required={true} placeholder={t('Select Status')} name='status' onChange={formik.handleChange} value={formik.values.status} label={t('Status')} options={SuggestionCategoryDrpData} id='status' error={formik.errors.status && formik.touched.status ? formik.errors.status : ''} /> */}
						</div>
					</div>
					<div className='card-footer btn-group'>
						<Button className='btn-primary ' type='submit' label={t('Save')}>
							<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
								<CheckCircle />
							</span>
						</Button>
						<Button className='btn-warning ' label={t('Cancel')} onClick={onCancelSuggestion}>
							<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
				</form>
			</WithTranslateFormErrors>
		</div>
	);
};

export default AddSuggestion;
