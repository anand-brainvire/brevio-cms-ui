import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { ArrowSmallLeft, DateCalendar } from '@components/icons/icons';
import { ROUTES } from '@config/constant';
import { VIEW_EVENT } from '@framework/graphql/queries/event';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewEvent = () => {
	const { t } = useTranslation();
	const { data, refetch } = useQuery(VIEW_EVENT);
	const EventId = useParams();
	const navigate = useNavigate();
	/**
	 * IF WE GET ID BASED ON THAT WE WILL GET EVENT DATA
	 */
	useEffect(() => {
		if (EventId.id) {
			refetch({ fetchEventId: EventId.id }).catch((err) => toast.error(err));
		}
	}, [EventId.id]);
	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.event}/${ROUTES.list}`);
	}, []);
	return (
		<div className='card'>
			<div className='card-header'>
				<div className='flex items-center '>
					<span className='mr-2 w-3.5 h-3.5 inline-block svg-icon'>
						<DateCalendar />
					</span>
					{t('Event Details')}
				</div>
				<Button className='btn-primary ' label={t('Back')} onClick={onCancel}>
					<span className='mr-1 w-3.5 h-3.5 inline-block svg-icon'>
						<ArrowSmallLeft />
					</span>
				</Button>
			</div>
			<div className='card-body '>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8'>
					<div className='flex '>
						<label className='mr-3 font-bold'>{t('Event Name')}</label>
						<p>{data?.fetchEvent?.data?.event_name}</p>
					</div>
					<div className='flex '>
						<label className='mr-3 font-bold '>{t('Description')}&nbsp;</label>
						<p>{data?.fetchEvent?.data?.description}</p>
					</div>
					<div className='flex '>
						<label className='mr-3 font-bold'>{t('Email')}</label>
						<p> {data?.fetchEvent?.data?.email}</p>
					</div>
					<div className='flex '>
						<label className='mr-3 font-bold'>{t('Reccurance')}</label>
						<p>{data?.fetchEvent?.data?.is_reccuring}</p>
					</div>
					<div className='flex '>
						<label className='mr-3 font-bold'>{t('Start Date')}</label>
						<p> {data?.fetchEvent?.data?.start_date}</p>
					</div>
					<div className='flex '>
						<label className='mr-3 font-bold'>{t('End Date')}</label>
						<p> {data?.fetchEvent?.data?.end_date}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ViewEvent;
