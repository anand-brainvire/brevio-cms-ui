import React, { ReactElement } from 'react';
import { TDatePicker } from '@type/component';
import FormClassess from '@pageStyles/Form.module.scss';
import { Calendar } from 'primereact/calendar';
import { useTranslation } from 'react-i18next';

const DatePicker = ({ id, label, name, onChange, value, error, note, inputIcon, min, max, dateFormat, placeholder, required = false, showTime = false, hourFormat, disabled, numberOfMonths = 1, selectionMode = 'single', showIcon = false, view }: TDatePicker): ReactElement => {
	const { t } = useTranslation();

	return (
		<div className={FormClassess['form-group']}>
			{label && (
				<label htmlFor={id}>
					{label}
					{required && <span className='text-primary'> *</span>}
				</label>
			)}
			<div className={`${FormClassess['input-group']} `}>
				{!view && <Calendar id={id} placeholder={placeholder} name={name} onChange={onChange} value={value} minDate={min} maxDate={max} dateFormat={dateFormat} showTime={showTime} hourFormat={hourFormat} disabled={disabled} numberOfMonths={numberOfMonths} selectionMode={selectionMode} showIcon={showIcon} icon={inputIcon} />}
				{view && <Calendar id={id} placeholder={placeholder} view={view} name={name} onChange={onChange} value={value} minDate={min} maxDate={max} dateFormat={dateFormat} showTime={showTime} hourFormat={hourFormat} disabled={disabled} numberOfMonths={numberOfMonths} selectionMode={selectionMode} showIcon={showIcon} icon={inputIcon} />}
			</div>
			{error && <p className='text-red-600 text-sm error'>{t(error)}</p>}
			{note && <p className='text-black text-sm font-medium my-1'>{t(note)}</p>}
		</div>
	);
};

export default React.memo(DatePicker);
