import React, { ReactElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DELETE_FAQ, GRP_DEL_FAQ, UPDATE_FAQ_STATUS } from '@framework/graphql/mutations/faq';
import { ColArrType, PaginationParams } from '@type/role';
import Button from '@components/button/button';
import TextInput from '@components/textinput/TextInput';
import filterServiceProps from '@components/filter/filter';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { Question, PlusCircle } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortOrder, ROUTES } from '@config/constant';
import { GET_FAQS_DATA } from '@framework/graphql/queries/faq';
const FaqManagement = (): ReactElement => {
	const [selectedFaq, setSelectedFaq] = useState<string[][]>([]);

	const { t } = useTranslation();
	const { localFilterData } = useSaveFilterData();

	const [filterData, setFilterData] = useState<PaginationParams>(
		localFilterData('filterFaqmangment') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: 'createdAt',
			sortOrder: sortOrder,
			search: '',
		}
	);
	const COL_ARR_FAQ = [
		{ name: t('Question'), sortable: true, fieldName: 'question_english', type: 'text' },
		{ name: t('FAQ Topic'), sortable: false, fieldName: 'faq_topic.name', type: 'text' },
		{ name: t('Created At'), sortable: true, fieldName: 'createdAt', type: 'date' },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: 'true' },
	] as ColArrType[];

	const navigate = useNavigate();
	/**
	 *
	 * @param e Method used for store search value
	 */
	const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const updatedFilterData = {
			...filterData,
			...localFilterData('filterFaqmangment'),
			search: e.target.value,
			page: DEFAULT_PAGE,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterFaqmangment', JSON.stringify(updatedFilterData));
	};

	/**
	 * Handle's page chnage
	 */
	const Navigation = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.faq}/${ROUTES.add}`);
	}, []);

	const clearSelectionFaq = useCallback(() => {
		setSelectedFaq([]);
	}, [selectedFaq]);

	const searchChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		clearSelectionFaq();
		onSearch(e);
	}, []);

	return (
		<div>
			<div className='card-table'>
				<div className='card-header'>
					<div className='flex items-center'>
						<span className='mr-2 w-3.5 h-3.5 inline-block svg-icon text-md'>
							<Question />
						</span>
						{t('FAQ List')}
					</div>

					<div className='flex flex-wrap gap-2'>
						<TextInput value={filterData.search} id={'faqSearch'} placeholder={t('Search Question...')} name='search' type='text' onChange={searchChangeHandler} />
						<RoleBaseGuard permissions={[PERMISSION_LIST.FAQ.AddAccess]}>
							<Button className=' btn-primary   ' onClick={Navigation} type='button' label={t('Add New')}>
								<span className='inline-block w-4 h-4 mr-1 svg-icon'>
									<PlusCircle />
								</span>
							</Button>
						</RoleBaseGuard>
					</div>
				</div>
				<div className='card-body'>
					<BVDataTable
						defaultActions={['edit', 'delete', 'change_status', 'multiple_delete']}
						columns={COL_ARR_FAQ}
						queryName={GET_FAQS_DATA}
						sessionFilterName='filterFaqmangment'
						singleDeleteMutation={DELETE_FAQ}
						multipleDeleteMutation={GRP_DEL_FAQ}
						updateStatusMutation={UPDATE_FAQ_STATUS}
						actionWisePermissions={{
							edit: PERMISSION_LIST.FAQ.EditAccess,
							delete: PERMISSION_LIST.FAQ.DeleteAccess,
							changeStatus: PERMISSION_LIST.FAQ.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.FAQ.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.faq,
							},
						}}
						statusKey={'status'}
						idKey={'uuid'}
						multipleDeleteApiId={'groupDeleteFaqsId'}
						singleDeleteApiId={'deleteFaqId'}
						statusChangeApiId={'changeFaqStatusId'}
						statusChangeApiKeyTitle={'status'}
					/>
				</div>
			</div>
		</div>
	);
};
export default FaqManagement;
