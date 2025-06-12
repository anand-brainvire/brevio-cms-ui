import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '@framework/graphql/queries/user';
import { useTranslation } from 'react-i18next';
import { DATE_FORMAT, ROUTES } from '@config/constant';
import Button from '@components/button/button';
import { ArrowSmallLeft, ProfileIcon } from '@components/icons/icons';
// import profile from '@assets/images/default-user-image.png';
import { getDateFromat } from '@utils/helpers';
import { Loader } from '@components/index';
import { toast } from 'react-toastify';
const ViewUser = () => {
	const { t } = useTranslation();
	const UserId = useParams();
	const { data, refetch, loading } = useQuery(GET_USER_BY_ID, { variables: { uuid: UserId.id }, skip: !UserId.id, fetchPolicy: 'network-only' });
	const navigate = useNavigate();

	/**
	 * IF WE GET ID BASED ON THAT WE WILL GET EVENT DATA
	 */
	useEffect(() => {
		if (UserId.id) {
			refetch().catch((err) => toast.error(err));
		}
	}, [UserId.id]);

	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.user}/${ROUTES.list}`);
	}, []);

	const user = data?.getUserById?.data;

	return (
		<div className='card'>
			{loading && <Loader />}
			<div className='card-header'>
				<div className='flex items-center'>
					<span className='w-3.5 h-3.5 mr-2 text-md leading-sm inline-block svg-icon'>
						<ProfileIcon />
					</span>
					{t('User Details')}
				</div>
				<Button className='btn-primary  text-bold' label={t('Back')} onClick={onCancel}>
					<span className='mr-1 w-4 h-4 inline-block svg-icon '>
						<ArrowSmallLeft />
					</span>
				</Button>
			</div>
			<div className='card-body'>
				<div className='grid grid-cols-1 md:grid-cols-2'>
					<div className='flex pb-2 flex-col sm:flex-row'>
						<p className='mr-3 font-bold flex-1'>{t('Full Name')}</p>
						<p className='px-0 sm:px-3 flex-1'>
							{user?.first_name || ''} {user?.last_name || ''}
						</p>
					</div>
					<div className='flex pb-2 flex-col sm:flex-row'>
						<p className='mr-3 font-bold flex-1'>{t('Registration Date')}</p>
						<p className='px-0 sm:px-3 flex-1'>
							{user?.created_at
								? getDateFromat(
										typeof user.created_at === 'string' && /^\d+$/.test(user.created_at)
											? Number(user.created_at)
											: user.created_at,
										DATE_FORMAT.momentDateTime24Format
								  )
								: ''}
						</p>
					</div>
					<div className='flex pb-2 flex-col sm:flex-row'>
						<p className='mr-3 font-bold flex-1'>{t('Email')}</p>
						<a href={`mailto:${user?.email}`} className='px-0 sm:px-3 flex-1 font-medium text-primary hover:underline cursor-pointer break-all'>
							{user?.email}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewUser;
