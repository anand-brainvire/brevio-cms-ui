import { Audio, BannerIcon, Directory, Document, VideoRecorder } from '@components/icons/icons';
import React, { ReactElement } from 'react';
import { BsMediaListItemProps } from '@type/bsMedia';

const BsMediaListItem = ({ data, isViewFolder, onClick, onDoubleClick, activeItem }: BsMediaListItemProps) => {
	const iconObject: { [key: string]: ReactElement } = {
		image: <BannerIcon />,
		folder: <Directory />,
		video: <VideoRecorder />,
		audio: <Audio />,
		application: <Document />,
	};
	const iconSetter = (fileType: string): ReactElement => {
		return iconObject[fileType];
	};
	/**
	 * function that handles onCLick and onDouble
	 * @param e is event object that provides number of clicks details
	 */
	const handleCilck = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.detail) {
			case 1:
				onClick(data);
				break;
			case 2:
				data?.is_folder && onDoubleClick(+data.id, data.original_name, data.parent_id);
				break;
			default:
				break;
		}
	};
	return (
		<li key={data?.name} aria-hidden='true' className={`${isViewFolder ? '' : 'even:bg-default'} cursor-pointer ${activeItem === data?.uuid ? 'active' : ''}`} onClick={handleCilck}>
			<div className='bs-card'>
				<div className='bs-icon-container'>
					<div className='flex items-center'>
						<span className='bs-icon'>{data?.is_folder ? <Directory /> : iconSetter(data?.mime_type.split('/')[0])}</span>
						<span className='hidden-span'>{data?.original_name}</span>
					</div>
					<div className='size'>{data?.size}</div>
				</div>
				<div className='hidden-div'>{data?.original_name}</div>
				<div className='size-hidden'>{data?.size}</div>
			</div>
		</li>
	);
};
export default BsMediaListItem;
