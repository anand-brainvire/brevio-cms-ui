import { useQuery, useMutation } from '@apollo/client';
import Button from '@components/button/button';
import CommonModel from '@components/common/commonModel';
import { AngleDown, AngleUp, Category, Edit, GetDefaultIcon, PlusCircle, Trash } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { AccesibilityNames, CHANGESTATUS_WARING_TEXT, DEFAULT_LIMIT, DEFAULT_PAGE, DELETE_WARING_TEXT, GROUP_DELETE_WARING_TEXT, ROUTES, SHOW_PAGE_COUNT_ARR, STATUS, sortOrder } from '@config/constant';
import { CategoryData, CategoryDataArr, DeleteGroupCategory } from '@framework/graphql/graphql';
import { DELETE_CATEGORY, GROUP_DELETE_CATEGORY, UPDATE_CATEGORY_STATUS } from '@framework/graphql/mutations/category';
import { FETCH_CATEGORY } from '@framework/graphql/queries/category';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PaginationParams, ColArrType } from '@type/common';
import filterServiceProps from '@components/filter/filter';
import Pagination from '@components/Pagination/Pagination';
import TreePageBtn from '@views/manageCategory/TreeRoute';
import { OptionsPropsForButton } from '@type/component';
import { commonRedirectFun } from '@utils/helpers';

const ManageCategory = () => {
	const { data, refetch } = useQuery(FETCH_CATEGORY);
	const [categoryData, setCategoryData] = useState<CategoryData>({} as CategoryData);
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [isDeleteCategory, setIsDeleteCategory] = useState<boolean>(false);
	const [categoryObj, setCategoryObj] = useState<CategoryDataArr>({} as CategoryDataArr);
	const [updateCategoryStatus] = useMutation(UPDATE_CATEGORY_STATUS);
	const [isDeleteConfirmationOpenCategory, setIsDeleteConfirmationOpenCategory] = useState<boolean>(false);
	const [selectedAllCategory, setSelectedAllCategory] = useState<boolean>(false);
	const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
	const [deleteCategoryGr] = useMutation(GROUP_DELETE_CATEGORY);
	const [deleteCategoryById] = useMutation(DELETE_CATEGORY);
	const { t } = useTranslation();
	const [filterDataCategory, setFilterDataCategory] = useState<PaginationParams>({
		limit: DEFAULT_LIMIT,
		page: DEFAULT_PAGE,
		sortBy: '',
		sortOrder: sortOrder,
		search: '',
	});
	const COL_ARR = [
		{ name: t('Sr.No'), sortable: false },
		{ name: t('Category Name'), sortable: true, fieldName: 'category_name' },
		{ name: t('Parent Category'), sortable: true, fieldName: 'parent_category' },
		{ name: t('Status'), sortable: true, fieldName: 'status' },
	] as ColArrType[];
	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterDataCategory.limit);
	const navigate = useNavigate();

	/**
	 * Used for refetch listing of category data after filter
	 */
	useEffect(() => {
		if (data?.fetchCategory) {
			setCategoryData(data?.fetchCategory?.data);
		}
	}, [data?.fetchCategory]);
	/**method that sets all rules sets s selected */
	useEffect(() => {
		if (selectedAllCategory) {
			refetch().then((res) => {
				setSelectedCategory(res?.data?.fetchCategory?.data?.Categorydata?.map((mappedSelectedCategory: CategoryDataArr) => mappedSelectedCategory.uuid));
			});
		}
	}, [data?.fetchCategory]);

	//Function to return the selected category
	const SelCategoryFun = () => {
		return setSelectedCategory([]);
	};

	/**
	 * Method used for close model
	 */
	const onCloseCategory = useCallback(() => {
		setIsDeleteCategory(false);
		setIsStatusModelShow(false);
		setIsDeleteConfirmationOpenCategory(false);
	}, []);
	/**
	 * Method used for change Category status model
	 */
	const onChangeStatus = useCallback((data: CategoryDataArr) => {
		setIsStatusModelShow(true);
		setCategoryObj(data);
	}, []);
	/**
	 * Method used for change Category status with API
	 */
	const changeCategoryStatus = useCallback(() => {
		updateCategoryStatus({
			variables: {
				categoryStatusUpdateId: categoryObj?.uuid,
				status: categoryObj.status === 1 ? 0 : 1,
			},
		})
			.then((res) => {
				const data = res.data;
				if (data.categoryStatusUpdate.meta.statusCode === 200) {
					toast.success(data.categoryStatusUpdate.meta.message);
					setIsStatusModelShow(false);
					refetch(filterDataCategory).catch((error) => toast.error(error));
				}
			})
			.catch(() => {
				toast.error(t('Failed to update'));
			});
	}, [isStatusModelShow]);

	/**
	 *
	 * @param e Method used for store search value
	 */
	const onSearchCategory = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFilterDataCategory({ ...filterDataCategory, search: e.target.value, page: DEFAULT_PAGE });
		setSelectedCategory([]);
	}, []);
	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortCategory = (sortFieldName: string) => {
		setFilterDataCategory({
			...filterDataCategory,
			sortBy: sortFieldName,
			sortOrder: filterDataCategory.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};
	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */

	const onPageDrpSelectCategory = (e: string) => {
		setRecordsPerPage(Number(e));
		const updatedFilterData = {
			...filterDataCategory,
			limit: parseInt(e),
			page: DEFAULT_PAGE,
		};
		setSelectedCategory([]);
		setFilterDataCategory(updatedFilterData);
		filterServiceProps.saveState('filterCategorymangment', JSON.stringify(updatedFilterData));
	};
	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filterCategorymangment', JSON.stringify(filterDataCategory));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterDataCategory(savedFilterData);
		}
	}, []);

	/**
	 *
	 * @param data Method used for delete Category
	 */
	const deleteCategoryData = useCallback(() => {
		deleteCategoryById({
			variables: {
				deleteCategoryId: categoryObj?.uuid,
			},
		})
			.then((res) => {
				const data = res.data;
				if (data.deleteCategory.meta.statusCode === 200) {
					toast.success(data.deleteCategory.meta.message);
					setIsDeleteCategory(false);
				} else if (data.deleteCategory.meta.status === 'ERROR') {
					toast.error(data.deleteCategory.meta.message);
					refetch(filterDataCategory).catch((e) => toast.error(e));
					setIsDeleteCategory(false);
				}
			})
			.catch(() => {
				toast.error(data.deleteCategory.meta.message);
			});
	}, [isDeleteCategory]);
	useEffect(() => {
		refetch(filterDataCategory).catch((err) => toast.error(err));
	}, [filterDataCategory]);

	/**
	 * Method that handles group delete
	 */
	const confirmDeleteCategory = useCallback(() => {
		// Perform the mutation to delete the selected manage rules sets
		deleteCategoryGr({
			variables: {
				groupDeleteCategoriesId: selectedCategory,
			},
		})
			.then((res) => {
				const data = res?.data as DeleteGroupCategory;
				if (data?.groupDeleteCategories?.meta?.statusCode === 200) {
					toast.success(data?.groupDeleteCategories?.meta?.message);
					setIsDeleteConfirmationOpenCategory(false);
					refetch(filterDataCategory).catch((err) => {
						toast.error(err);
					});
				}
			})
			.catch(() => {
				toast.error(t('Failed to delete this category'));
			});
		SelCategoryFun();
	}, [selectedCategory]);

	useEffect(() => {
		if (selectedCategory?.length === data?.fetchCategory?.data?.Categorydata?.length) {
			setSelectedAllCategory(true);
		} else {
			setSelectedAllCategory(false);
		}
	}, [selectedCategory]);

	const handleDeleteCategory = useCallback(() => {
		if (selectedCategory?.length > 0) {
			setIsDeleteConfirmationOpenCategory(true);
		} else {
			toast.error('Please select atleast one record');
		}
	}, [selectedCategory]);

	const handleSelectCategory = (CategoryId: string) => {
		// Check if the rules sets  ID is already selected
		let updateSelectedCategory = [...selectedCategory];

		const isSelected = updateSelectedCategory?.includes(CategoryId);
		if (isSelected) {
			// If the rules sets  ID is already selected, remove it from the selection
			updateSelectedCategory = updateSelectedCategory.filter((id: string) => id !== CategoryId);
		} else {
			// If the rules sets  ID is not selected, add it to the selection
			updateSelectedCategory = [...updateSelectedCategory, CategoryId];
		}
		setSelectedCategory(updateSelectedCategory);
	};

	const handleSelectAllCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
		let updateSelectedCategory = [...selectedCategory];
		if (!event.target.checked) {
			// Select all checkboxes
			updateSelectedCategory = [];
			setSelectedCategory(updateSelectedCategory);
		} else {
			// Deselect all checkboxes
			updateSelectedCategory = data?.fetchCategory?.data?.Categorydata?.map((mappedSelectedCategory: CategoryDataArr) => {
				return mappedSelectedCategory.id;
			});
			setSelectedCategory(updateSelectedCategory);
		}
	};
	const totalUsermangment = data?.fetchCategory?.data?.count || 0;
	const totalPages = Math.ceil(totalUsermangment / recordsPerPage);
	/**
	 * Handle's page chnage
	 */
	const handlePageChange = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterDataCategory,
			page: newPage,
		};
		setSelectedCategory([]);
		setFilterDataCategory(updatedFilterData);
		filterServiceProps.saveState('filterCategorymangment', JSON.stringify(updatedFilterData));
	}, []);
	useEffect(() => {
		setRecordsPerPage(filterDataCategory.limit);
	}, [filterDataCategory.limit]);
	const Navigation = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.category}/${ROUTES.add}`);
	}, []);

	const deleteCategoryFun = useCallback(
		(options: OptionsPropsForButton) => {
			setCategoryObj(options?.data as unknown as CategoryDataArr);
			setIsDeleteCategory(true);
		},
		[categoryObj, isDeleteCategory]
	);
	return (
		<div>
			<div className='card-table'>
				<div className='card-header flex-wrap gap-2'>
					<div className='flex items-center'>
						<span className='mr-2 w-3.5 h-3.5 inline-block svg-icon'>
							<Category />
						</span>
						{t('Category List')}
					</div>
					<div className='btn-group flex gap-y-2 flex-wrap  '>
						<TreePageBtn route={`${ROUTES.category}`} />
						<Button className='btn-primary ' onClick={handleDeleteCategory} type='button' label={t('Delete Selected')} disabled={!selectedCategory.length}>
							<span className='svg-icon inline-block h-3.5 w-3.5 mr-1'>
								<Trash />
							</span>
						</Button>
						<Button className='btn-primary ' onClick={Navigation} type='button' label={t('Add New')}>
							<span className='inline-block w-4 h-4 mr-1 svg-icon'>
								<PlusCircle />
							</span>
						</Button>
					</div>
				</div>
				<div className='card-body'>
					<div className='table-select-dropdown-container justify-start md:justify-between'>
						<div className='mb-4 sm:mb-0'>
							<span className='table-select-dropdown-label'>{t('Show')}</span>
							<select aria-label={AccesibilityNames.Entries} className='table-select-dropdown' onChange={(e) => onPageDrpSelectCategory(e.target.value)} value={filterDataCategory.limit}>
								{SHOW_PAGE_COUNT_ARR?.map((data: number) => {
									return <option key={data}>{data}</option>;
								})}
							</select>
							<span className='table-select-dropdown-label'>{t('entries')}</span>
						</div>
						<div className='w-1/4'>
							<TextInput id='searchCategory' placeholder={t('Search...')} name='search' type='text' onChange={onSearchCategory} />
						</div>
					</div>
					<div className='overflow-auto custom-datatable '>
						<table>
							<thead>
								<tr>
									<th scope='col'>
										<div className='flex justify-center items-center'>
											<input type='checkbox' className='checkbox' checked={selectedCategory?.length === data?.fetchCategory?.data?.Categorydata?.length} onChange={handleSelectAllCategory} />
										</div>
									</th>
									{COL_ARR?.map((colVal: ColArrType, index: number) => {
										return (
											<th scope='col' className='items-center' key={`${index + 1}`}>
												<div className={`flex items-center ${colVal.name == t('Status') || colVal.name == t('Sr.No') ? 'justify-center' : ''}`}>
													{colVal.name}
													{colVal.sortable && (
														<button title='Sort' onClick={() => onHandleSortCategory(colVal.fieldName)}>
															{(filterDataCategory.sortOrder === '' || filterDataCategory.sortBy !== colVal.fieldName) && (
																<span className='svg-icon inline-block ml-1 w-3 h-3'>
																	<GetDefaultIcon />
																</span>
															)}
															{filterDataCategory.sortOrder === 'asc' && filterDataCategory.sortBy === colVal.fieldName && <AngleUp />}
															{filterDataCategory.sortOrder === 'desc' && filterDataCategory.sortBy === colVal.fieldName && <AngleDown />}
														</button>
													)}
												</div>
											</th>
										);
									})}
									<th className='items-center' scope='col'>
										<div className='flex items-center justify-center'>Action</div>
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.fetchCategory?.data?.Categorydata?.map((data: CategoryDataArr, index: number) => {
									return (
										<tr key={data.id}>
											<td>
												<div className='flex justify-center items-center'>
													<input type='checkbox' className='checkbox' id={`${data.uuid}`} checked={selectedCategory?.includes(data.uuid)} onChange={() => handleSelectCategory(data.uuid)} />
												</div>
											</td>
											<td className='text-center' scope='row'>
												{index + 1}
											</td>
											<td className='text-left'>{data?.category_name}</td>
											<td className='text-left'>{data?.parentData?.category_name}</td>
											<td className='text-center'>
												<div className='flex justify-center'>{data.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>}</div>
											</td>
											<td>
												<div className='flex justify-center'>
													<Button icon={<Edit />} data={data} route={ROUTES.category} onClick={commonRedirectFun} label={''} className='btn-default' />
													<div className='flex justify-center px-2 py-1'>
														<span aria-label='toggle-status' aria-hidden='true' onClick={() => onChangeStatus(data)} className='font-medium text-blue-600 mt-2 hover:underline'>
															<label aria-label='toggle-status' aria-hidden='true' className='relative inline-flex items-center cursor-pointer'>
																<input id='toggleStatus' type='checkbox' className='sr-only peer' value={data.status} checked={data.status === STATUS.active} readOnly />
																<div className={'w-7 h-4 bg-gray-200 rounded-full peer peer-focus:ring-3 peer-focus:ring-red-200  peer-checked:after:translate-x-full peer-checked:after:border-white after:content- after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all  peer-checked:bg-primary'}></div>
															</label>
														</span>
													</div>

													<Button data={data} route={''} onClick={deleteCategoryFun} icon={<Trash />} spanClassName='svg-icon inline-block h-3.5 w-3.5' label={''} className='btn-default' />
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						{(data?.fetchCategory?.data === undefined || data?.fetchCategory?.data === null) && (
							<div className='no-data'>
								<div>{t('No Data')}</div>
							</div>
						)}
					</div>
					<div className='datatable-footer'>
						<div className='datatable-total-records'>{`${categoryData?.count === null || categoryData?.count === undefined ? '0' : categoryData?.count}` + t('Total Records')}</div>

						<Pagination currentPage={filterDataCategory.page} totalPages={totalPages} onPageChange={handlePageChange} recordsPerPage={recordsPerPage} />
					</div>
				</div>
			</div>
			{isStatusModelShow && <CommonModel warningText={CHANGESTATUS_WARING_TEXT} onClose={onCloseCategory} action={changeCategoryStatus} show={isStatusModelShow} />}
			{isDeleteCategory && <CommonModel warningText={DELETE_WARING_TEXT} onClose={onCloseCategory} action={deleteCategoryData} show={isDeleteCategory} />}
			{isDeleteConfirmationOpenCategory && <CommonModel warningText={GROUP_DELETE_WARING_TEXT} onClose={onCloseCategory} action={confirmDeleteCategory} show={isDeleteConfirmationOpenCategory} />}
		</div>
	);
};
export default ManageCategory;
