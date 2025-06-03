import React, { useCallback, useState } from 'react';
import FilterAnnouncement from '@views/announcement/filterannouncement';
import { useNavigate } from 'react-router-dom';
import { GET_ANNOUCEMENTS } from '@framework/graphql/queries/announcement';
import { FilterAnnouncementProps, PaginationParamsList } from 'src/types/announcement';
import Button from '@components/button/button';
import filterServiceProps from '@components/filter/filter';
import { useTranslation } from 'react-i18next';
import useSaveFilterData from '@src/hooks/useSaveFilterData';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import BVDataTable from '@components/BVDatatable/BVDataTable';
import { IColumnsProps } from '@components/BVDatatable/DataTable';
import { AnnouncementIco, PlusCircle } from '@components/icons/icons';
import { DEFAULT_LIMIT, DEFAULT_PAGE, sortBy, sortOrder, AnnouncementEnum, ROUTES } from '@config/constant';

const Announcement = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { localFilterData } = useSaveFilterData();
	const [filterData, setFilterData] = useState<PaginationParamsList>(
		localFilterData('filtervaluesAnnouncement') ?? {
			limit: DEFAULT_LIMIT,
			page: DEFAULT_PAGE,
			sortBy: sortBy,
			sortOrder: sortOrder,
			title: '',
			startDate: '',
			endDate: '',
			annoucemntType: '',
			platform: '',
		}
	);
	const COL_ARR = [
		{ name: t('Title'), sortable: true, fieldName: 'title', type: 'text' },
		{ name: t('Type'), sortable: true, fieldName: 'annoucemnt_type', type: 'text' },
		{ name: t('Target Platform'), sortable: true, fieldName: 'platform', type: 'text' },
		{ name: t('Status'), sortable: true, fieldName: 'status', headerCenter: 'true', type: 'badge', conversationValue: AnnouncementEnum },
		{ name: t('Created At'), sortable: true, fieldName: 'created_at', type: 'date' },
	] as IColumnsProps[];

	/**
	 *
	 * @param values Method used for set filter data
	 */

	const onSearchAnnouncement = useCallback((values: FilterAnnouncementProps) => {
		const updatedFilterData = {
			...filterData,
			title: values?.title,
			startDate: values?.startDate,
			endDate: values?.endDate,
			annoucemntType: values?.annoucemntType,
			platform: values?.platform,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterannouncement', JSON.stringify(updatedFilterData));
	}, []);

	const addRedirectionAnnounce = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.announcement}/add`);
	}, []);

	return (
		<div>
			<FilterAnnouncement onSearchAnnouncement={onSearchAnnouncement} filterData={filterData} />
			<div className='card-table'>
				<div className='card-header'>
					<div className='flex items-center'>
						<span className='mr-2 w-3.5 h-3.5 inline-block svg-icon'>
							<AnnouncementIco />
						</span>
						<span className='text-sm font-normal'>{t('Announcement List')}</span>
					</div>
					<div>
						<RoleBaseGuard permissions={[PERMISSION_LIST.Announcement.AddAccess]}>
							<Button className='btn-primary  ' onClick={addRedirectionAnnounce} type='button' label={t('Add New')}>
								<span className='inline-block w-4 h-4 mr-1 svg-icon'>
									<PlusCircle />
								</span>
							</Button>
						</RoleBaseGuard>
					</div>
				</div>
				<div className='card-body'>
					<BVDataTable
						defaultActions={['view']}
						columns={COL_ARR}
						queryName={GET_ANNOUCEMENTS}
						sessionFilterName='filterannouncement'
						updatedFilterData={filterData}
						statusKey={'status'}
						idKey={'uuid'}
						actionData={{
							view: {
								route: ROUTES.announcement,
							},
						}}
					/>
				</div>
			</div>
		</div>
	);
};
export default Announcement;
