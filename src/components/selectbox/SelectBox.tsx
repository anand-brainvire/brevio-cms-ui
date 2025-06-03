import React, { ReactElement } from 'react';
import { ISelectBoxOption, SelectBoxProps } from '@type/component';
import FormClassess from '@pageStyles/Form.module.scss';
import { useTranslation } from 'react-i18next';

const SelectBox = ({ id, label, name, value, error, note, option, inputIcon, disabled, required = false }: SelectBoxProps): ReactElement => {
	const { t } = useTranslation();
	return (
		<div className={FormClassess['form-group']}>
			{label && (
				<label htmlFor={id}>
					{label}
					{required && <span className='text-red-500'> *</span>}
				</label>
			)}
			<div className={`${FormClassess['input-group']} ${inputIcon ? FormClassess['with-icon'] : ''}`}>
				{inputIcon && <div className={FormClassess['input-icon']}>{inputIcon}</div>}
				<select className={`${FormClassess['form-control']} ${FormClassess['custom-select']} ${error ? 'error' : ''}`} id={id} name={name} value={value} disabled={disabled}>
					{option?.map((list: ISelectBoxOption) => (
						<option key={list.name} value={list.key} disabled={list?.disabled}>
							{list.name}
						</option>
					))}
				</select>
			</div>
			{error && <p className='text-red-600 text-sm'>{t(error)}</p>}
			{note && <p className='text-black text-sm font-medium my-1'>{t(note)}</p>}
		</div>
	);
};

export default React.memo(SelectBox);
