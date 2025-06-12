import { useMutation, useQuery } from '@apollo/client';
import { IS_ALL, ROUTES, STATUS, STATUS_RADIO } from '@config/constant';
import { FETCH_GOALS,GET_CATEGORY_BY_ID } from '@framework/graphql/queries/category';
import { useFormik } from 'formik';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DropdownOptionType } from '@type/component';
import { CreateFaq} from '@type/faq';
import {GoalDataArr} from '@type/category';
import { CheckCircle, Cross } from '@components/icons/icons';
import useValidation from '@src/hooks/validations';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import RadioButton from '@components/radiobutton/radioButton';
import { whiteSpaceRemover } from '@utils/helpers';
import TextArea from '@components/textarea/TextArea';
import { Loader } from '@components/index';
import i18n from '@src/i18n';
import { MultiSelect } from 'primereact/multiselect';
import {CREATE_CATEGORY, UPDATE_CATEGORY} from '@framework/graphql/mutations/category';

const AddEditCategory = (): ReactElement => {
	const { t } = useTranslation();
	const { data, refetch: fetchAllGoals } = useQuery(FETCH_GOALS, { variables: { isAll: IS_ALL } });
	const [goalDroData, setGoalDroData] = useState<DropdownOptionType[]>([]);
	const [createFaq, { loading: createLoader }] = useMutation(CREATE_CATEGORY);
	const [updateFaq, { loading: updateLoader }] = useMutation(UPDATE_CATEGORY);
	const navigate = useNavigate();
		const params = useParams();
		const { data: faqByIdData } = useQuery(GET_CATEGORY_BY_ID, {
			variables: { uuid: params.id },
			skip: !params.id,
			fetchPolicy: 'network-only',
		});
		const { addCategoryValidationSchema } = useValidation();
		/**
		 * Method used for set faq data array for dropdown
		 */
		useEffect(() => {
			fetchAllGoals({ isAll: IS_ALL });
			if (data?.getAllGoals?.data) {
				const tempDataArr = data.getAllGoals.data.map((goal: GoalDataArr) => {
					// Find translation for current language, fallback to 'en', then to first translation
					let translation;
					if (Array.isArray(goal.translations)) {
						translation =
							goal.translations.find((tr: any) => tr.lang_code === i18n.language) ||
							goal.translations.find((tr: any) => tr.lang_code === 'en') ||
							goal.translations[0];
					} else {
						translation = undefined;
					}
					return {
						name: translation?.title || goal.key || '',
						key: goal.uuid,
					};
				});
				setGoalDroData(tempDataArr);
			}
		}, [data?.getAllGoals, i18n.language]);
		/**
		 * Sets's form data while edit time
		 */
		useEffect(() => {
			if (faqByIdData && params.id) {
				const data = faqByIdData?.getCategoryById?.data;
				const translation = Array.isArray(data?.category_translations)
					? data.category_translations.find((tr: any) => tr.lang_code === 'en') || data.category_translations[0]
					: {};

				formik
					.setValues({
						goalId: Array.isArray(data?.goals) ? data.goals.map((g: any) => g.uuid) : [],
						categoryName: translation?.name || '',
						categorySlug: data?.slug || '',
						description: translation?.description || '',
						status: data?.is_active ? STATUS.active : STATUS.inactive,
					})
					.catch((e) => toast.error(e));
			}
		}, [faqByIdData, params.id]);
		const initialValues = {
			goalId: [],
			categoryName: '',
			categorySlug: '',
			description: '',
			status: STATUS.active,
		};
		const formik = useFormik({
			initialValues,
			validationSchema: addCategoryValidationSchema,
			onSubmit: (values) => {
				const variables = {
					categoryData: [
						{
							langCode: 'en',
							name: values.categoryName,
							description: values.description,
						}
					],
					slug: slugify(values.categorySlug),
					goalUuids: values.goalId,
					status: values.status,
				};
			if (params.id) {
				updateFaq({
					variables: {
						uuid: params?.id,
						...variables,
					},
				})
        		.then((res) => {
        		    const data = res.data;
        		    if (data?.updateCategory?.meta?.statusCode === 200) {
        		        toast.success(data.updateCategory.meta.message);
        		        formik.resetForm();
        		        onCancelFaq();
        		    } else {
        		        toast.error(data?.updateCategory?.meta?.message || t('Update failed'));
        		    }
        		})
        		.catch(() => {
        		    toast.error(t('Something went wrong'));
        		});
			}else{
				createFaq({ variables })
					.then((res) => {
						const data = res.data;
						if (data.createCategory.meta.statusCode === 200) {
							toast.success(data.createCategory.meta.message);
							formik.resetForm();
							onCancelFaq();
						}
					})
					.catch(() => {
						return;
					});
			}	
			},
		});
		/**
		 * On cancle redirect to list view
		 */
		const onCancelFaq = useCallback(() => {
			navigate(`/${ROUTES.app}/${ROUTES.category}/${ROUTES.list}`);
		}, []);
		/**
		 * Handle blur that removes white space's
		 */
		const OnBlurFaq = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
			formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
		}, []);
		/**
		 * Error message handler
		 * @param fieldName
		 * @returns
		 */
		const getErrorFaq = (fieldName: keyof CreateFaq) => {
			return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
		};

		function slugify(text: string): string {
			return text
			.toString()
				.toLowerCase()
				.trim()
				.replace(/\s+/g, '-')
				.replace(/[^\w\-]+/g, '')
				.replace(/\-\-+/g, '-');
		}		
		return (
			<div className='card'>
				{(createLoader || updateLoader) && <Loader />}
				<form onSubmit={formik.handleSubmit}>
					<div className='card-body'>
						<div className='card-title-container'>
							<p>
								{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
							</p>
						</div>
						<div className='card-grid-addedit-page'>
							<div>
								<TextInput
									id={'categoryName'}
									required={true}
									placeholder={t('Add Category')}
									name='categoryName'
									onChange={(e) => {
										formik.handleChange(e);
										formik.setFieldValue('categorySlug', slugify(e.target.value));
									}}
									label={t(' Category Name')}
									value={formik.values.categoryName}
									error={getErrorFaq('categoryName')}
									onBlur={OnBlurFaq}
								/>
							</div>
							<div>
								<TextInput label={t('Category Slug')} required={true} onBlur={OnBlurFaq} type='text' id='categorySlug' placeholder={t('Add Slug')} name='categorySlug' onChange={formik.handleChange} value={formik.values.categorySlug} error={getErrorFaq('categorySlug')} />
							</div>
							<div>
								<label className="block mb-2 font-medium text-gray-700">
									{t('Map Goal')}
								</label>
								<MultiSelect
									value={formik.values.goalId}
									onChange={(e) => formik.setFieldValue('goalId', e.value)}
									options={goalDroData}
									optionLabel="name"
									optionValue="key"
									filter
									placeholder={t('Select Goal') ?? 'Select Goal'}
									display="chip"
									className="w-full"
									maxSelectedLabels={3}
								/>
							</div>
							<div>
								<TextArea required={true} id='description' onChange={formik.handleChange} value={formik.values.description} onBlur={OnBlurFaq} label={t('Description')} error={getErrorFaq('description')} placeholder={''} />
							</div>
							<RadioButton id={'statusFaq'} required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
						</div>
					</div>
					<hr />
					<div className='card-footer btn-group'>
						<Button className='btn-primary ' type='submit' label={params.id ? t('Update') : t('Save')}>
							<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
								<CheckCircle />
							</span>
						</Button>
						<Button className='btn-secondary' label={t('Cancel')} onClick={onCancelFaq}>
							<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
				</form>
			</div>
		);
	};

	export default AddEditCategory;
