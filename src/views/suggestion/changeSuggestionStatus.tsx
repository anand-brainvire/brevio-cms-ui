import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { Cross, Info } from '@components/icons/icons';
import TextArea from '@components/textarea/TextArea';
import { SuggestionCategoryDrpData } from '@config/constant';
import { t } from 'i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { SuggestionChangeProps } from '@type/suggestion';

const ChangeSuggestionStatus = ({ onCloseSuggestion, changeSuggestionStatus, show, data }: SuggestionChangeProps) => {
	const [selectedStatus, setSelectedStatus] = useState<number>(data.status == 4 ? 7 : data.status);
	const [note, setNote] = useState<string>('');
	/**
	 * handle's status change
	 */
	const handleStatusChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedStatus(Number(event.target.value));
	}, []);
	/**
	 * handle's note change
	 */
	const handleNoteChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNote(event.target.value);
	}, []);
	/**
	 * handle's submit form
	 */
	const handleSubmit = useCallback(() => {
		changeSuggestionStatus(selectedStatus, note);
	}, [selectedStatus, note]);
	/**
	 * handle's close popup
	 */
	useEffect(() => {
		document.addEventListener('click', (event: globalThis.MouseEvent) => {
			if ((event.target as HTMLElement)?.id === 'suggestion-changeUserStatusModel' || (event.target as HTMLElement)?.id === 'suggestion-changeUserStatusModel-child') {
				onCloseSuggestion();
			}
			const handleKeyDown = (event: KeyboardEvent) => {
				if (event.key === 'Escape' && show) {
					onCloseSuggestion();
				}
			};

			if (show) {
				document.addEventListener('keydown', handleKeyDown);
			}
		});
	}, [show]);

	return (
		<div className={`${show ? '' : 'hidden'} model-container`} id='suggestion-changeUserStatusModel'>
			<div id='suggestion-changeUserStatusModel-child' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={'model animate-fade-in '}>
				<div className='model-content'>
					<div className='model-header'>
						<div className='flex items-center '>
							<span className='mr-2 text-white inline-block text-xl svg-icon w-5 h-5'>
								<Info />
							</span>
							<span className='model-title ml-2'>{t('Change Status')}</span>
						</div>
						<Button onClick={onCloseSuggestion} label={''}>
							<span className='my-1 w-2.5 h-2.5 text-white inline-block svg-icon '>
								<Cross />
							</span>
						</Button>
					</div>

					<div className='model-body grid grid-cols-1 '>
						<div className='mb-4'>
							<Dropdown label={t('Status')} required={true} className='' id='status' value={selectedStatus} onChange={handleStatusChange} placeholder={''} options={SuggestionCategoryDrpData} />
						</div>
						<div>
							<TextArea label={t('Note')} id='note' placeholder={`${t('note')}`} name='note' onChange={handleNoteChange} value={note}></TextArea>
						</div>
					</div>

					<div className='flex items-center justify-end px-5 py-5 space-x-2  rounded-b '>
						<Button className='btn-primary ' onClick={handleSubmit} label={t(t('Submit'))} />
						<Button className='btn-warning ' onClick={onCloseSuggestion} label={t(t('Close'))} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChangeSuggestionStatus;
