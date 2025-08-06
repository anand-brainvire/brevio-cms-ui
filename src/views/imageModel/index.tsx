import React, { useEffect } from 'react';
import Button from '@components/button/button';
import { ImageDataProps } from '@type/common';
import { BannerIcon, Cross } from '@components/icons/icons';
import { useTranslation } from 'react-i18next';

const ImageModel = ({ onClose, data, show, showAccept, onAccept }: ImageDataProps) => {
	const { t } = useTranslation();

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (
				(event.target as HTMLElement)?.id === 'image-model' ||
				(event.target as HTMLElement)?.id === 'image-model-child'
			) {
				onClose();
			}
		};
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, [show]);

	return (
		<div
			id='image-model'
			tabIndex={-1}
			data-modal-show={true}
			aria-hidden='false'
			className={`${show ? '' : 'hidden'} model-container`}
		>
			<div className='model animate-fade-in'>
				{/* <!-- Modal content --> */}
				<div id='image-model-child' className='model-content'>
					<div className='model-header'>
						<div className='flex items-center '>
							<span className='mr-1 w-wide-1 h-rise-1 text-white inline-block svg-icon'>
								<BannerIcon />
							</span>
							<span className='model-title'> {t('View Image')} </span>
						</div>
						<Button onClick={onClose} title={t('Close') ?? ''}>
							<span className='my-1 text-white w-2.5 h-2.5 inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>

					<div className='model-body flex flex-col items-center space-y-4'>
						<img
							src={data}
							alt='Model Preview'
							className='rounded shadow-md'
							style={{
								height: 600,
								width: 600,
								objectFit: 'contain',
							}}
						/>

						{showAccept && (
							<div className='flex space-x-4 mt-4'>
								<Button onClick={onAccept} className='btn btn-primary'>
									{t('Accept')}
								</Button>
								<Button onClick={onClose} className='btn btn-secondary'>
									{t('Close')}
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageModel;
