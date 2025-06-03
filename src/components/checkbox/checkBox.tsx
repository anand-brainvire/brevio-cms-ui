import React, { ReactElement } from 'react';
import FormClassess from '@pageStyles/Form.module.scss';
import { CheckBoxOption, TCheckBox } from '@type/component';
import { useTranslation } from 'react-i18next';
const CheckBox = ({ id, label, error, note, option, IsCheckList, required = false, disabled = false }: TCheckBox): ReactElement => {
	const { t } = useTranslation();
	return (
		<div className={FormClassess['form-group']}>
			{label && (
				<label htmlFor={id}>
					{label}
					{required && <span className='text-red-500'> *</span>}
				</label>
			)}
			<div id={id} className={(FormClassess['checkbox-group'], `${IsCheckList ? FormClassess['checkbox-group-list'] : ''}`)}>
				{option?.map((optionList: CheckBoxOption) => (
					<label htmlFor={optionList.id} key={optionList.id} className={FormClassess['checkbox-item']}>
						<input className={`${FormClassess['form-control']} ${error ? 'error' : ''}`} id={optionList.id} type='checkbox' onChange={optionList.onChange} name={optionList.name} value={optionList.value} checked={optionList.checked} disabled={disabled} />
						<span>{optionList.name}</span>
					</label>
				))}
			</div>
			{error && <p className='text-red-600 text-sm'>{t(error)}</p>}
			{note && <p className='text-black text-sm font-medium my-1'>{t(note)}</p>}
		</div>
	);
};

export default React.memo(CheckBox);
