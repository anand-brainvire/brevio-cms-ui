import { DATE_FORMAT, bsMediaViewDetailsConstant } from '@config/constant';
import { getDateFromat } from '@utils/helpers';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { BsMediaViewDetailsProps } from '@type/bsMedia';

const BsMediaViewDetails = ({ data }: BsMediaViewDetailsProps): ReactElement => {
	const viewType = (data: string) => {
		return data.split('/')[0];
	};
	const { t } = useTranslation();
	return (
		<div>
			{!data?.is_folder && (
				<div className='px-4 my-4'>
					{viewType(data?.mime_type) === bsMediaViewDetailsConstant.image && <img className='w-full' src={data?.media_url} alt='Media Preview' />}
					{viewType(data?.mime_type) === bsMediaViewDetailsConstant.audio && <audio className='w-full' src={data?.media_url} controls>
						<track kind="captions" src="" srcLang="en" label="English" /></audio>}
					{viewType(data?.mime_type) === bsMediaViewDetailsConstant.video && (
						<video className='w-full' controls>
							<source src={data?.media_url} type='video/mp4' />
							<track kind="captions" src="" srcLang="en" label="English" />
						</video>
					)}
				</div>
			)}
			<div className='px-4'>
				<div className='flex '>
					<label className='mr-3 font-bold'>{t('Title')}</label>
					<p>{data?.name}</p>
				</div>
				<div className='flex '>
					<label className='mr-3 font-bold'>{t('Size')}</label>
					<p>{data?.size}</p>
				</div>
				{!data.is_folder && (
					<div className='flex '>
						<label className='mr-3 font-bold'>{t('Url')}</label>
						<p>
							<a className='text-primary  cursor-pointer hover:underline' href={data?.media_url} target='blank'>
								Click Here
							</a>
						</p>
					</div>
				)}
				<div className='flex '>
					<label className='mr-3 font-bold'>{t('Created At')}</label>
					<p>{getDateFromat(data?.created_at, DATE_FORMAT.DateHoursMinFormat)}</p>
				</div>
			</div>
		</div>
	);
};
export default BsMediaViewDetails;
