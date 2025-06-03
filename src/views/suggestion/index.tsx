import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AccesibilityNames, DEFAULT_LIMIT, DEFAULT_PAGE, EXPORT_CSV_PDF_EXCEL_CONSTANTS, ROUTES, sortBy, sortOrder } from '@config/constant';
import { GET_SUGGESTION } from '@framework/graphql/queries/suggestion';
import { DELETE_SUGGESTION, GRP_DELETE_SUGGESTION, UDPATE_SUGGESTION_STATUS } from '@framework/graphql/mutations/suggestion';
import { FilterSuggestionProps, PaginationParamsSuggestion } from '@type/suggestion';
import FilterSuggestionData from '@views/suggestion/filterSuggestionData';
import Button from '@components/button/button';
import { CsvFile, ExcelFile, PdfFile, PlusCircle, SuggestionIcon } from '@components/icons/icons';
import { downloadFile } from '@utils/helpers';
import filterServiceProps from '@components/filter/filter';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
const Suggestion = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [isLoadingDownloadFile, setIsLoadingDownloadFile] = useState<boolean>(false);
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParamsSuggestion>(
		localFilterData('filtersuggestion') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			suggestion: '',
			createdBy: '',
			status: null,
			categoryId: null,
		}
	);
	const COL_ARR_SUGG = [
		{ name: t('Category'), sortable: true, fieldName: 'Category.category_name', type: 'text' },
		{ name: t('Suggestion'), sortable: false, fieldName: 'suggestion', type: 'text' },
		{ name: t('Posted By'), sortable: true, fieldName: 'created_by', type: 'date' },
		{ name: t('Posted At'), sortable: false, fieldName: 'created_at', type: 'date' },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
	] as IColumnsProps[];

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const onSearchSuggestion = useCallback(
		(values: FilterSuggestionProps) => {
			const updatedFilterData = {
				...filterData,
				...localFilterData('filtersuggestion'),
				suggestion: values.suggestion,
				createdBy: values.createdBy,
				status: parseInt(values.status),
				categoryId: parseInt(values.categoryId),
				page: DEFAULT_PAGE,
			};
			setFilterData(updatedFilterData);
			filterServiceProps.saveState('filtersuggestion', JSON.stringify(updatedFilterData));
		},
		[filterData]
	);

	/**
	 * Method that checkcs filter data in session if true sets filter data
	 */
	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filtersuggestion', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);

	/**
	 * Method redirects to add page
	 */
	const handleAddsuggestion = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.suggestion}/${ROUTES.add}`);
	}, []);

	/**
	 * function that download file base on file type
	 */
	const onDownloadSuggestion = useCallback(
		async (e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			const target = e.currentTarget as HTMLButtonElement;
			const updateFilterData: { [key: string]: string | number | null | Date } = {
				'category_id': filterData.categoryId,
				page: filterData.page,
				sortBy: filterData.sortBy,
				sortOrder: filterData.sortOrder,
				status: filterData.status,
				suggestion: filterData.suggestion,
				'created_by': filterData.createdBy,
			};
			switch (target.id) {
				case 'csv':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.suggestion, EXPORT_CSV_PDF_EXCEL_CONSTANTS.csv, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
					setIsLoadingDownloadFile(false);
					break;
				case 'pdf':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.suggestion, EXPORT_CSV_PDF_EXCEL_CONSTANTS.pdf, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
					setIsLoadingDownloadFile(false);
					break;
				case 'excel':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.suggestion, EXPORT_CSV_PDF_EXCEL_CONSTANTS.excel, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
					setIsLoadingDownloadFile(false);
					break;
				default:
					break;
			}
		},
		[isLoadingDownloadFile, filterData]
	);

	return (
		<div>
			<FilterSuggestionData onSearchSuggestion={onSearchSuggestion} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header'>
					<div className='flex items-center '>
						<span className='w-3.5 h-3.5 mr-2 inline-block svg-icon'>
							<SuggestionIcon />
						</span>
						{t('Suggestion List')}
					</div>

					<div className='btn-group flex gap-y-2 flex-wrap'>
						<button title={AccesibilityNames.Excel} id={'excel'} className='btn btn-success py-1.5 px-3' onClick={onDownloadSuggestion}>
							<span className='w-4 h-5 svg-icon fill-white '>
								<ExcelFile />
							</span>
						</button>
						<button title={AccesibilityNames.PDF} id={'pdf'} className='btn btn-success py-1.5 px-3' onClick={onDownloadSuggestion}>
							<span className='w-4 h-5 svg-icon fill-white '>
								<PdfFile />
							</span>
						</button>
						<button title={AccesibilityNames.CSV} id={'csv'} className='btn btn-success py-1.5 px-3' onClick={onDownloadSuggestion}>
							<span className='w-4 h-5 svg-icon fill-white text-black '>
								<CsvFile />
							</span>
						</button>
						<RoleBaseGuard permissions={[PERMISSION_LIST.Suggestion.AddAccess]}>
							<Button className='btn-primary  ' onClick={handleAddsuggestion} type='button' label={t('Add New')}>
								<span className='inline-block w-4 h-4 mr-1 svg-icon'>
									<PlusCircle />
								</span>
							</Button>
						</RoleBaseGuard>
					</div>
				</div>
				<div className='card-body'>
					<BVDataTable
						defaultActions={['delete', 'change_status', 'multiple_delete']}
						columns={COL_ARR_SUGG}
						queryName={GET_SUGGESTION}
						sessionFilterName='filtersuggestion'
						singleDeleteMutation={DELETE_SUGGESTION}
						multipleDeleteMutation={GRP_DELETE_SUGGESTION}
						updateStatusMutation={UDPATE_SUGGESTION_STATUS}
						actionWisePermissions={{
							delete: PERMISSION_LIST.Suggestion.DeleteAccess,
							changeStatus: PERMISSION_LIST.Suggestion.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.Suggestion.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.suggestion,
							},
						}}
						statusKey={'status'}
						idKey={'uuid'}
						multipleDeleteApiId={'groupDeleteSuggestionsId'}
						singleDeleteApiId={'deleteSuggestionId'}
						statusChangeApiId={'suggestionStatusUpdateId'}
						statusChangeApiKeyTitle={'status'}
					/>
				</div>
			</div>
		</div>
	);
};
export default Suggestion;
