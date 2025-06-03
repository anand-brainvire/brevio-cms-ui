import Button from '@components/button/button';
import { Cross, MenuBurger } from '@components/icons/icons';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { JsonPopupProps } from '@type/activityTracking';

const JsonViewerPopup = ({ onClose, data, show }: JsonPopupProps) => {
	const { t } = useTranslation();
	const onCloseView = useCallback(() => {
		onClose();
	}, []);
	/**
	 * Method that closes the popup on outside click
	 */
	useEffect(() => {
		document.addEventListener('click', (event: globalThis.MouseEvent) => {
			if ((event.target as HTMLElement)?.id === 'image-model' || (event.target as HTMLElement)?.id === 'image-model-child') {
				onClose();
			}
		});
	}, [show]);
	return (
		<div id='image-model' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`${show ? '' : 'hidden'} model-container  `}>
			<div className={'model '}>
				<div id='image-model-child' className='model-content'>
					<div className='model-header'>
						<div className='flex items-center '>
							<span className='mr-1 w-wide-1 h-rise-1 text-white inline-block svg-icon'>
								<MenuBurger />
							</span>
							<span className='model-title'> {t('View Old and New Data')} </span>
						</div>
						<Button onClick={onCloseView} label={''}>
							<span className='my-1 text-white w-2.5 h-2.5 inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
					<div className='model-body flex justify-center'>
						<div className='p-4 border mr-1'>
							<h4 className='text-center text-primary mb-2'>{t('Old Data')}</h4>
							<div>{JSON.stringify(data?.details.old)}</div>
						</div>
						<div className='p-4 border'>
							<h4 className='text-center text-primary mb-2'>{t('New Data')}</h4>
							<div>{JSON.stringify(data?.details?.new)}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default JsonViewerPopup;
