import React, { useCallback, useState } from 'react';
import { FilterEnquiryProps, PaginationParamsEnquiry } from '@type/enquiry';
import { useTranslation } from 'react-i18next';
import { EnquiryDataArr } from '@framework/graphql/graphql';
import { DEFAULT_LIMIT, DEFAULT_PAGE, ROUTES, sortOrder } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { GET_ENQUIRY } from '@framework/graphql/queries/enquiry';
import { DELETE_ENQUIRY, GROUP_DELETE_ENQ } from '@framework/graphql/mutations/enquiry';
import FilterEnquiryPage from '@views/enquiry/FilterEnquiry';
import { PhoneCall, PlusCircle, StatusIcon } from '@components/icons/icons';
import Button from '@components/button/button';
import filterServiceProps from '@components/filter/filter';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import ChangeEnquiryStatusModal from '@views/enquiry/changeEnquiryStatus';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps, IListData } from '@components/BVDatatable/DataTable';

const Enquiry = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [isStatusModelShow, setIsStatusModelShow] = useState<boolean>(false);
	const [enquiryObj, setEnquiryObj] = useState<EnquiryDataArr>({} as EnquiryDataArr);
	const [selectedEnquiry, setSelectedEnquiry] = useState<string[]>([]);
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParamsEnquiry>(
		localFilterData('filterEnquiryManagement') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: 'sendAt',
			sortOrder: sortOrder,
			name: '',
			email: '',
			status: null,
		}
	);

	const COL_ARR_ENQ = [
		{ name: t('Name'), sortable: true, fieldName: 'name', type: 'text' },
		{ name: t('Email'), sortable: false, fieldName: 'email', type: 'text' },
		{ name: t('Subject'), sortable: true, fieldName: 'subject', type: 'text' },
		{ name: t('Message'), sortable: false, fieldName: 'message', type: 'text' },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'badge', headerCenter: true, conversationValue: t('') },
		{ name: t('Send At'), sortable: true, fieldName: 'sendAt', type: 'date' },
	] as IColumnsProps[];

	/**
	 *
	 * @param values Method used for set filter data
	 */
	const onSearchEnquiry = useCallback((values: FilterEnquiryProps) => {
		const updatedFilterData = {
			...filterData,
			name: values.name,
			email: values.email,
			status: parseInt(values.status),
			page: DEFAULT_PAGE,
		};
		setFilterData(updatedFilterData);
		setSelectedEnquiry([]);
		filterServiceProps.saveState('filterEnquiryManagement', JSON.stringify(updatedFilterData));
	}, []);

	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */

	const changeStatusEnquiry = useCallback(() => {
		setIsStatusModelShow(true);
	}, [isStatusModelShow]);

	/**
	 * Method used for close model
	 */
	const onClose = useCallback(() => {
		setIsStatusModelShow(false);
	}, []);
	/**
	 * Method that redirects to add page
	 */
	const Navigation = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.enquiry}/${ROUTES.add}`);
	}, []);
	/**
	 * Method that clears the selcted data
	 */
	const clearSelectionEnquiry = useCallback(() => {
		setSelectedEnquiry([]);
	}, [selectedEnquiry]);

	const handleRowRef = useCallback(
		(data: IListData) => {
			setEnquiryObj(data as EnquiryDataArr);
		},
		[enquiryObj]
	);

	return (
		<div>
			<FilterEnquiryPage onSearchEnquiry={onSearchEnquiry} clearSelectionEnquiry={clearSelectionEnquiry} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header'>
					<div className='flex items-center'>
						<span className='svg-icon inline-block h-3.5 w-3.5 mr-2 text-md'>
							<PhoneCall />
						</span>
						{t('Enquiry List')}
					</div>
					<div>
						<RoleBaseGuard permissions={[PERMISSION_LIST.Enquiry.AddAccess]}>
							<Button className='btn-primary   ' onClick={Navigation} type='button' label={t('Add New')}>
								<span className='inline-block w-4 h-4 mr-1 svg-icon'>
									<PlusCircle />
								</span>
							</Button>
						</RoleBaseGuard>
					</div>
				</div>
				<div className='card-body'>
					<BVDataTable
						defaultActions={['delete', 'multiple_delete']}
						columns={COL_ARR_ENQ}
						queryName={GET_ENQUIRY}
						sessionFilterName='filterBanner'
						singleDeleteMutation={DELETE_ENQUIRY}
						multipleDeleteMutation={GROUP_DELETE_ENQ}
						actionWisePermissions={{
							changeStatus: PERMISSION_LIST.Enquiry.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.Enquiry.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.enquiry,
							},
						}}
						statusKey={'status'}
						idKey={'uuid'}
						multipleDeleteApiId={'uuid'}
						singleDeleteApiId={'uuid'}
						statusChangeApiKeyTitle={'status'}
						rowRefData={handleRowRef}
						extraActions={
							<Button onClick={changeStatusEnquiry} type='button' title={t('Status') ?? ''}>
								<span className='text-primary svg-icon inline-block h-3.5 w-3.5 mr-1'>
									<StatusIcon />
								</span>
							</Button>
						}
					/>
				</div>
				{isStatusModelShow && <ChangeEnquiryStatusModal onClose={onClose} show={isStatusModelShow} setStatusModel={setIsStatusModelShow} subAdminObj={enquiryObj} />}
			</div>
		</div>
	);
};

export default Enquiry;
