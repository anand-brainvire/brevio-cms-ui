import Button from '@components/button/button';
import { Info, Cross } from '@components/icons/icons';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonModelProps } from '@type/common';

const CommonModel = ({ onClose, action, show, warningText, actionLabel = 'Yes', onCloseLabel = 'No', headerTitle = 'Confirmation', modalBody, modalFooter }: CommonModelProps) => {
	const { t } = useTranslation();
	const [addClass, setAddClass] = useState<boolean>(false);

	useEffect(() => {
		if (show) {
			setTimeout(() => {
				setAddClass(true);
			}, 100);
		}
		document.addEventListener('click', (event: globalThis.MouseEvent) => {
			if ((event.target as HTMLElement)?.id === 'common-model' || (event.target as HTMLElement)?.id === 'common-model-child') {
				onClose();
			}
			const handleKeyDown = (event: KeyboardEvent) => {
				if (event.key === 'Escape' && show) {
					onClose();
				}
			};

			if (show) {
				setTimeout(() => {
					setAddClass(true);
				}, 100);

				document.addEventListener('keydown', handleKeyDown);
			}
		});
	}, [show]);

	return (
		<div className={`${show ? '' : 'hidden'} model-container`} id='common-model'>
			<div id='common-model-child' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`model ${addClass ? '' : 'model-transition-effect '}`}>
				<div className='model-content '>
					<div className='model-header'>
						<div className='flex items-center'>
							<span className='mr-2 text-white inline-block text-xl svg-icon w-5 h-5'>
								<Info />
							</span>
							<span className='model-title'> {t(headerTitle)} </span>
						</div>
						<Button onClick={onClose} title={t('Close') ?? ''}>
							<span className='my-1 text-white w-2.5 h-2.5 inline-block  svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
					<div className='model-body font-normal text-center'>
						{!modalBody && <p className='pb-4'>{t(warningText as string)}</p>}
						{modalBody && <>{modalBody}</>}
					</div>
					<div className='model-footer'>
						{!modalFooter && (
							<>
								<Button className='btn-primary ' onClick={action} label={t(actionLabel)} />
								<Button className='btn-warning ' onClick={onClose} label={t(onCloseLabel)} />
							</>
						)}
						{modalFooter && <>{modalFooter}</>}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CommonModel;
