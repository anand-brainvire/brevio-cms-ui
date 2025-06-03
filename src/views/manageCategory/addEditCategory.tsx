import { useQuery, useMutation } from '@apollo/client';
import { ROUTES, STATUS_RADIO } from '@config/constant';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@components/button/button';
import TextInput from '@components/textinput/TextInput';
import TextArea from '@components/textarea/TextArea';
import { FETCH_CATEGORY, GET_CATEGORY_BY_ID } from '@framework/graphql/queries/category';
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@framework/graphql/mutations/category';
import { CategoryTreeDataArr, TreeNode, TreeNodeProps } from '@type/category';
import { TreeSelect, TreeSelectChangeEvent } from 'primereact/treeselect';
import 'primereact/resources/primereact.min.css';
import { CheckCircle, Cross } from '@components/icons/icons';
import RadioButton from '@components/radiobutton/radioButton';
import useValidation from '@src/hooks/validations';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
import { translationFun, whiteSpaceRemover } from '@utils/helpers';
const AddEditCategory = () => {
	const { t } = useTranslation();
	const { data } = useQuery(FETCH_CATEGORY);
	const { data: categoryByIdData, refetch } = useQuery(GET_CATEGORY_BY_ID);
	const [createCategory] = useMutation(CREATE_CATEGORY);
	const [updateCategory] = useMutation(UPDATE_CATEGORY);
	const navigate = useNavigate();
	const params = useParams();
	const [categoryDrpData, setCategoryDrpData] = useState<TreeNodeProps[]>([]);
	const { addManageCategoryValidationSchema } = useValidation();
	useEffect(() => {
		const parentData = [] as TreeNode[];

		const findChildren = (node: TreeNode, categories: CategoryTreeDataArr[]) => {
			const childCategories = categories.filter((category: CategoryTreeDataArr) => category.parent_category === node.key);

			childCategories.forEach((category: CategoryTreeDataArr) => {
				const childNode: TreeNode = {
					label: category.category_name,
					key: category.id,
					children: [],
				};
				if (node.children) {
					node.children.push(childNode);
				}
				findChildren(childNode, categories);
			});
		};
		if (data?.fetchCategory) {
			const categories = data.fetchCategory.data.Categorydata;
			const rootCategories = categories.filter((category: CategoryTreeDataArr) => category.parent_category === 0);

			rootCategories.forEach((category: CategoryTreeDataArr) => {
				const rootNode: TreeNode = {
					label: category.category_name,
					key: category.id,
					children: [],
				};
				parentData.push(rootNode);
				findChildren(rootNode, categories);
			});
			setCategoryDrpData(parentData);
		}
	}, [data]);

	/**
	 * Method used for get faq api with id
	 */
	useEffect(() => {
		if (params.id) {
			refetch({ getSingleCategoryId: params.id }).catch((e) => toast.error(e));
		}
	}, [params.id]);

	/**
	 * Method used for setvalue from faq data by id
	 */
	useEffect(() => {
		if (categoryByIdData && params.id) {
			const data = categoryByIdData?.getSingleCategory?.data;
			formik
				.setValues({
					categoryName: data?.category_name,
					parentCategory: data?.parent_category,
					description: data?.description,
					status: data?.status,
				})
				.catch((e) => toast.error(e));
		}
	}, [categoryByIdData]);
	const initialValues = {
		categoryName: '',
		parentCategory: '',
		description: '',
		status: '1',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addManageCategoryValidationSchema,
		onSubmit: (values) => {
			const commonValues = {
				categoryName: values.categoryName,
				parentCategory: +values.parentCategory,
				description: values.description,
				status: parseInt(values.status),
			};
			if (params.id) {
				updateCategory({
					variables: {
						updateCategoryId: params.id,

						...commonValues,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data?.updateCategory.meta.statusCode === 200) {
							toast.success(data.updateCategory.meta.message);
							formik.resetForm();
							onCancelCategory();
						}
					})
					.catch(() => {
						return;
					});
			} else {
				createCategory({
					variables: {
						...commonValues,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data.createCategory.meta.statusCode === 201) {
							toast.success(data.createCategory.meta.message);
							formik.resetForm();
							onCancelCategory();
						}
					})
					.catch(() => {
						return;
					});
			}
		},
	});
	const onCancelCategory = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.category}/${ROUTES.list}`);
	}, []);

	const OnBlurCategory = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	const treeChangeHandler = useCallback(
		(e: TreeSelectChangeEvent) => {
			e.preventDefault();
			formik.setFieldValue('parentCategory', e.target.value);
		},
		[formik]
	);

	return (
		<div className='card'>
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='card-title-container'>
						<p>
							{t('Fields marked with')} <span className='text-red-700'>*</span> {t('are mandatory.')}
						</p>
					</div>
					<div className='card-grid-addedit-page'>
						<div>
							<TextInput id='categoryName' placeholder={t('Category Name')} required={true} name='categoryName' onChange={formik.handleChange} label={t('Category Name')} value={formik.values.categoryName} error={formik.errors.categoryName && formik.touched.categoryName ? formik.errors.categoryName : ''} onBlur={OnBlurCategory} />
						</div>
						<div className='flex flex-col'>
							<label className='block text-gray-700 text-sm font-normal mb-2' htmlFor='parentCategory'>
								{t('Parent Category')}
							</label>
							<TreeSelect id='parentCategory' name='parentCategory' value={formik.values.parentCategory} options={categoryDrpData} placeholder={translationFun('Select Category')} onChange={treeChangeHandler} />
						</div>
						<div>
							<TextArea required={true} id='Description' label={t('Category Description')} placeholder={`${t('Category Description')}`} name='description' onChange={formik.handleChange} value={formik.values.description} onBlur={OnBlurCategory} error={formik.errors.description && formik.touched.description ? t(formik.errors.description) : ''} />
						</div>
						<RadioButton id={'statusCategory'} required={true} checked={formik.values.status} onChange={formik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
					</div>
				</div>
				<div className='card-footer btn-group'>
					<Button className='btn-primary ' type='submit' label={params.id ? t('Update') : t('Save')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					<Button className='btn-warning ' label={t('Cancel')} onClick={onCancelCategory}>
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
