import { ROUTES, sortOrder, sortBy, DEFAULT_LIMIT, DEFAULT_PAGE } from '@config/constant';
import React, { ReactElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ColArrType, PaginationProps } from '@type/emailNotificationTemplate';
import { PlusCircle, Email } from '@components/icons/icons';
import Button from '@components/button/button';
import TextInput from '@components/textinput/TextInput';
import filterServiceProps from '@components/filter/filter';
import { FETCH_EMAIL_NOTIFICATION_TEMPLATE } from '@framework/graphql/queries/emailNotificationTemplate';
import { DELETE_EMAIL_TEMPLATE, EMAIL_TEMPLATE_STATUS_UPDATE, GROUP_DELETE_EMAIL_NOTIFICATION_TEMPLATE } from '@framework/graphql/mutations/emailNotificationTemplate';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import BVDataTable from '@components/BVDatatable/BVDataTable';

const EmailNotificationTemplate = (): ReactElement => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationProps>(
		localFilterData('filterEmailTemplate') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			search: '',
		}
	);

	const COL_ARR_EMAIL_TEMPLATE = [
		{ name: t('Email Subject'), sortable: true, fieldName: 'subject', type: 'text' },
		{ name: t('Template For'), sortable: true, fieldName: 'template_for', type: 'text' },
		{ name: t('Template Type'), sortable: true, fieldName: 'template_type', type: 'text' },
		{ name: t('Status'), sortable: true, fieldName: 'status', type: 'status', headerCenter: true },
	] as ColArrType[];

	/**
	 *
	 * @param values are used set the filter data
	 */
	const onSearchEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		const updatedFilterData = {
			...filterData,
			...localFilterData('filterEmailTemplate'),
			search: e.target.value,
			page: DEFAULT_PAGE,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterEmailTemplate', JSON.stringify(updatedFilterData));
	};

	const onSearchEmailTemplate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		onSearchEmail(e);
	}, []);

	/**
	 * Method that redirects to add page
	 */
	const addRedirectionEmailTemplate = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.email}/${ROUTES.add}`);
	}, []);

	return (
		<div>
			<div className='card-table'>
				<div className='card-header '>
					<div className='flex items-center'>
						<span className='mr-2 w-3.5 h-3.5 inline-block svg-icon'>
							<Email />
						</span>
						<span className='text-sm font-normal'>{t('Email Template List')}</span>
					</div>
					<div className='flex flex-wrap gap-2'>
						<TextInput value={filterData.search} id={'emailTemplateSearch'} placeholder={t('Search...')} name='search' type='text' onChange={onSearchEmailTemplate} />

						<RoleBaseGuard permissions={[PERMISSION_LIST.EmailTemplate.AddAccess]}>
							<Button className='btn-primary' onClick={addRedirectionEmailTemplate} type='button' label={t('Add New')}>
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
						columns={COL_ARR_EMAIL_TEMPLATE}
						queryName={FETCH_EMAIL_NOTIFICATION_TEMPLATE}
						sessionFilterName='filterEmailTemplate'
						singleDeleteMutation={DELETE_EMAIL_TEMPLATE}
						multipleDeleteMutation={GROUP_DELETE_EMAIL_NOTIFICATION_TEMPLATE}
						updateStatusMutation={EMAIL_TEMPLATE_STATUS_UPDATE}
						actionWisePermissions={{
							edit: PERMISSION_LIST.EmailTemplate.EditAccess,
							delete: PERMISSION_LIST.EmailTemplate.DeleteAccess,
							changeStatus: PERMISSION_LIST.EmailTemplate.ChangeStatusAccess,
							multipleDelete: PERMISSION_LIST.EmailTemplate.GroupDeleteAcsess,
						}}
						updatedFilterData={filterData}
						actionData={{
							edit: {
								route: ROUTES.email,
							},
						}}
						statusKey={'status'}
						idKey={'uuid'}
						multipleDeleteApiId={'uuid'}
						singleDeleteApiId={'uuid'}
						statusChangeApiId={'uuid'}
						statusChangeApiKeyTitle={'status'}
					/>
				</div>
			</div>
		</div>
	);
};
export default EmailNotificationTemplate;
