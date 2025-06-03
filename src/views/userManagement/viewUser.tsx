import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '@framework/graphql/queries/user';
import { useTranslation } from 'react-i18next';
import { DATE_FORMAT, IMAGE_BASE_URL, ROUTES } from '@config/constant';
import Button from '@components/button/button';
import { ArrowSmallLeft, ProfileIcon } from '@components/icons/icons';
import profile from '@assets/images/default-user-image.png';
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
			<div className='flex flex-col p-5 pb-0'>
				<p className='mb-2 font-bold'>{t('Profile Photo')}</p>
				<img
					aria-label='profile-photo'
					aria-hidden='true'
					src={`${IMAGE_BASE_URL}/${data?.getUser?.data?.profile_img}`}
					alt={'Profile Preview'}
					className='w-wide-6 h-rise-6 mr-4 border border-dashed border-b-color-2'
					onError={({ currentTarget }) => {
						const image = profile;
						currentTarget.onerror = null;
						currentTarget.src = image;
					}}
				/>
			</div>
			<div className='card-body'>
				<div className='grid grid-cols-1 md:grid-cols-2'>
					<div className='flex pb-2 flex-col sm:flex-row'>
						<p className='mr-3 font-bold flex-1'>{t('Full Name')}</p>
						<p className='px-0 sm:px-3 flex-1'>
							{data?.getUser?.data?.first_name} {data?.getUser?.data?.last_name}
						</p>
					</div>

					<div className='flex pb-2 flex-col sm:flex-row'>
						<p className='mr-3 font-bold flex-1'>{t('Email')}</p>
						<a href={`mailto:${data?.getUser?.data?.email}`} className='px-0 sm:px-3 flex-1 font-medium text-primary  hover:underline cursor-pointer break-all'>
							{data?.getUser?.data?.email}
						</a>
					</div>

					<div className='flex pb-2 flex-col sm:flex-row'>
						<p className='mr-3 font-bold flex-1'>{t('Username')}</p>
						<p className='px-0 sm:px-3 flex-1'>{data?.getUser?.data?.user_name}</p>
					</div>

					<div className='flex pb-2 flex-col sm:flex-row'>
						<p className='mr-3 font-bold flex-1'>{t('Phone Number')}</p>
						<p className='px-0 sm:px-3 flex-1'>{data?.getUser?.data?.phone_no}</p>
					</div>

					<div className='flex pb-2 flex-col sm:flex-row'>
						<p className='mr-3 font-bold flex-1'>{t('Date of Birth')}</p>
						<p className='px-0 sm:px-3 flex-1'>{`${data?.getUser?.data?.date_of_birth ? getDateFromat(data?.getUser?.data?.date_of_birth, DATE_FORMAT.momentDateOfBirth) : ''}`}</p>
					</div>

					<div className='flex pb-2 flex-col sm:flex-row'>
						<p className='mr-3 font-bold flex-1'>{t('Gender')}</p>
						<p className='px-0 sm:px-3 flex-1'>
							{data?.getUser?.data?.gender === 1 && t('male')} {data?.getUser?.data?.gender === 2 && t('female')}
							{data?.getUser?.data?.gender === 3 && t('other')}
						</p>
					</div>

					<div className='flex pb-2 flex-col sm:flex-row'>
						<p className='mr-3 font-bold flex-1'>{t('Status')}</p>
						<p className='px-0 sm:px-3 flex-1'>{data?.getUser?.data?.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewUser;
