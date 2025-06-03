import { CsvFile, ExcelFile, PdfFile, TimerIcon } from '@components/icons/icons';
import { sortOrder, sortBy, DEFAULT_LIMIT, DEFAULT_PAGE, EXPORT_CSV_PDF_EXCEL_CONSTANTS, AccesibilityNames } from '@config/constant';
import React, { ReactElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import filterServiceProps from '@components/filter/filter';
import FilterActivityTracking from '@views/activityTracking/filterActivityTracking';
import { GET_ACTIVITY_LIST } from '@framework/graphql/queries/activityTracking';
import { FilterActivityProps, PaginationParamsActivity } from '@type/activityTracking';
import { downloadFile } from '@utils/helpers';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import { ColArrTypeNew } from '@type/cms';
import BVDataTable from '@components/BVDatatable/BVDataTable';

const ActivityTracking = (): ReactElement => {
	const { t } = useTranslation();
	const [selectedActivity, setSelectedActivity] = useState<Array<string>>([]);
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParamsActivity>(
		localFilterData('filterActivity') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			name: '',
			email: '',
			startDate: '',
			endDate: '',
			activity: '',
		}
	);
	const COL_ARR_ENQ = [
		{ name: t('Name'), sortable: false, fieldName: 'User.first_name', type: 'text', headerCenter: false },
		{ name: t('Email'), sortable: false, fieldName: 'User.email', type: 'text', headerCenter: false },
		{ name: t('Activity'), sortable: true, fieldName: 'title', type: 'text', headerCenter: false },
		{ name: t('IP Address'), sortable: true, fieldName: 'ip_address', type: 'text', headerCenter: false },
		{ name: t('Created At'), sortable: true, fieldName: 'created_at', type: 'date', headerCenter: false },
	] as ColArrTypeNew[];
	const [isLoadingDownloadFile, setIsLoadingDownloadFile] = useState<boolean>(false);

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const onSearchActivity = useCallback((values: FilterActivityProps) => {
		const updatedFilterData = {
			...filterData,
			name: values.name,
			email: values.email,
			activity: values.activity,
			startDate: values.startDate,
			endDate: values.endDate,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterActivity', JSON.stringify(updatedFilterData));
		setSelectedActivity([]);
	}, []);

	const clearSelectionActivity = useCallback(() => {
		setSelectedActivity([]);
	}, [selectedActivity]);

	const onDownloadActivity = useCallback(
		async (e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			const target = e.currentTarget as HTMLButtonElement;
			const updateFilterData: { [key: string]: string | number | null | Date } = {
				name: filterData.name,
				page: filterData.page,
				sortBy: filterData.sortBy,
				sortOrder: filterData.sortOrder,
				'end_date': filterData.endDate as string | Date,
				'start_date': filterData.startDate as string | Date,
				activity: filterData.activity,
				email: filterData.email,
			};
			switch (target.id) {
				case 'csv':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.activityTracking, EXPORT_CSV_PDF_EXCEL_CONSTANTS.csv, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
					setIsLoadingDownloadFile(false);
					break;
				case 'pdf':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.activityTracking, EXPORT_CSV_PDF_EXCEL_CONSTANTS.pdf, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
					setIsLoadingDownloadFile(false);
					break;
				case 'excel':
					setIsLoadingDownloadFile(true);
					await downloadFile(EXPORT_CSV_PDF_EXCEL_CONSTANTS.activityTracking, EXPORT_CSV_PDF_EXCEL_CONSTANTS.excel, EXPORT_CSV_PDF_EXCEL_CONSTANTS.all, { ...updateFilterData });
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
			<FilterActivityTracking onSearchActivity={onSearchActivity} filterData={filterData} clearSelectionActivity={clearSelectionActivity} />
			<div className='card-table'>
				<div className='card-header '>
					<div className='flex items-center'>
						<span className='svg-icon inline-block h-3.5 w-3.5 mr-2 text-md'>
							<TimerIcon />
						</span>
						{t('Activity Tracking List')}
					</div>
					<div className='flex flex-wrap gap-2'>
						<button title={AccesibilityNames.Excel} id={'excel'} className='btn btn-success py-1.5 px-3' onClick={onDownloadActivity}>
							<span className='w-4 h-5 svg-icon fill-white '>
								<ExcelFile />
							</span>
						</button>
						<button title={AccesibilityNames.PDF} id={'pdf'} className='btn btn-success py-1.5 px-3' onClick={onDownloadActivity}>
							<span className='w-4 h-5 svg-icon fill-white '>
								<PdfFile />
							</span>
						</button>
						<button title={AccesibilityNames.CSV} id={'csv'} className='btn btn-success py-1.5 px-3' onClick={onDownloadActivity}>
							<span className='w-4 h-5 svg-icon fill-white text-black '>
								<CsvFile />
							</span>
						</button>
					</div>
				</div>
				<div className='card-body'>
					<BVDataTable defaultActions={null} columns={COL_ARR_ENQ} queryName={GET_ACTIVITY_LIST} sessionFilterName='filterActivity' updatedFilterData={filterData} idKey={'uuid'} />
				</div>
			</div>
		</div>
	);
};
export default ActivityTracking;
