import React from 'react';
import { DropdownProps, DropdownOptionType } from '@type/component';
import FormClasses from '@pageStyles/Form.module.scss';
import { useTranslation } from 'react-i18next';

const Dropdown = ({ id, placeholder, name, onChange, options, label, error, value, inputIcon, disabled, note, className = '', required = false, ariaLabel = '' }: DropdownProps) => {
	const { t } = useTranslation();
	return (
		<div className={`${className} ${FormClasses['form-group']}`}>
			{label && (
				<label htmlFor={id}>
					{label} {required && <span className='text-error'> *</span>}
				</label>
			)}
			<div className={`${FormClasses['input-group']} ${inputIcon ? FormClasses['with-icon'] : ''}`}>
				<select aria-label={ariaLabel} className={`${FormClasses['form-control']} ${FormClasses['custom-select']} ${error ? FormClasses['error'] : ''}`} id={id} onChange={onChange} name={name} value={value} disabled={disabled}>
					{placeholder && <option value=''>{t(placeholder)}</option>}
					{options?.map((data: DropdownOptionType) => {
						return (
							<option value={data.key} key={data.key}>
								{t(data.name as string)}
							</option>
						);
					})}
				</select>
			</div>

			{error && <p className='error '>{t(error)}</p>}
			{note && <p className='my-1 text-sm font-medium text-black'>{t(note)}</p>}
		</div>
	);
};

export default React.memo(Dropdown);
