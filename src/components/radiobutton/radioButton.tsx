import React, { ReactElement } from 'react';
import { IRadioButtonOptions, TRadioButton } from '@type/component';
import FormClassess from '@pageStyles/Form.module.scss';
import { useTranslation } from 'react-i18next';
const RadioButton = ({ label, error, note, radioOptions, name, IsRadioList, onChange, checked, required, id }: TRadioButton): ReactElement => {
	const { t } = useTranslation();
	return (
		<div id={id} className={FormClassess['form-group']}>
			{label && (
				<label htmlFor={id}>
					{label}
					{required && <span className='text-red-500'> *</span>}
				</label>
			)}
			<div id={id} className={`${FormClassess['radio-btn-group']} ${IsRadioList ? FormClassess['radio-btn-group-list'] : ''}`}>
				{radioOptions?.map((item: IRadioButtonOptions) => (
					<label htmlFor={item.key} className={FormClassess['radio-btn']} key={item.name}>
						<input
							key={item.name}
							type='radio'
							name={name}
							id={item.key}
							disabled={item?.disabled}
							onChange={onChange}
							value={item.value}
							checked={item.value == checked} // Compare with the 'checked' prop
						/>
						<span className='ml-2 font-normal'>{t(item.name)}</span>
					</label>
				))}
			</div>
			{error && <p className='text-sm error'>{t(error)}</p>}
			{note && <p className='my-1 text-sm font-medium text-black'>{t(note)}</p>}
		</div>
	);
};

export default React.memo(RadioButton);
