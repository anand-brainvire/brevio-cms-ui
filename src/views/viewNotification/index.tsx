import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { ArrowSmallLeft, Bell } from '@components/icons/icons';
import { ROUTES } from '@config/constant';
import { GET_NOTIFICATION_BY_ID } from '@framework/graphql/queries/notifications';
import { getDateTimeFromTimestamp } from '@utils/helpers';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const NotificationDetails = () => {
	const { t } = useTranslation();
	const notificationId = useParams();
	const navigate = useNavigate();
	const { data, refetch } = useQuery(GET_NOTIFICATION_BY_ID);
	/**
	 * IF WE GET ID BASED ON THAT WE WILL GET EVENT DATA
	 */
	useEffect(() => {
		if (notificationId.id) {
			refetch({ getNotificationTemplateId: notificationId.id }).catch((err) => toast.error(err));
		}
	}, [notificationId.id]);
	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.notifications}/${ROUTES.list}`);
	}, []);
	return (
		<div className='card'>
			<div className='card-header'>
				<div className='flex items-center'>
					<span className='mr-1 w-3.5 h-3.5 inline-block svg-icon'>
						<Bell />
					</span>
					{t('Notification')}
				</div>
				<Button className='btn-primary ' label={t('Back')} onClick={onCancel}>
					<span className='mr-1 w-3.5 h-3.5 inline-block svg-icon'>
						<ArrowSmallLeft />
					</span>
				</Button>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 card-body gap-y-2 gap-x-8'>
				<div className='flex '>
					<label className='mr-3 font-bold'>{t('Template')}</label>
					<p>{data?.getNotificationTemplate?.data?.template}</p>
				</div>
				<div className='flex '>
					<label className='mr-3 font-bold'>{t('Status')}</label>
					<p> {data?.getNotificationTemplate?.data?.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>}</p>
				</div>
				<div className='flex '>
					<label className='mr-3 font-bold'>{t('Created At')}</label>
					<p>{getDateTimeFromTimestamp(data?.getNotificationTemplate?.data?.created_at)}</p>
				</div>
				<div className='flex  '>
					<label className='mr-3 font-bold'>{t('Updated At')}</label>
					<p>{getDateTimeFromTimestamp(data?.getNotificationTemplate?.data?.updated_at)}</p>
				</div>
			</div>
		</div>
	);
};
export default NotificationDetails;
