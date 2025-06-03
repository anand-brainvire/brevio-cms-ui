import React, { useCallback } from 'react';
import JoditReact from 'jodit-react-ts';
import 'jodit/build/jodit.min.css';
import { JoditEditorProps } from '@type/component';
import { CK_EDITOR_CONFIGURATION } from '@config/constant';
import FormClassess from '@pageStyles/Form.module.scss';
import { useTranslation } from 'react-i18next';

const CKEditorComponent: React.FC<JoditEditorProps> = ({ onChange, value, config = CK_EDITOR_CONFIGURATION, error, note, label, required = false, className = '', id }): JSX.Element => {
	const { t } = useTranslation();

	const handleEditorChange = useCallback((editor: string) => {
		onChange(editor);
	}, []);
	return (
		<div className={FormClassess['form-group']}>
			{label && (
				<label htmlFor={id}>
					{label}
					{required && <span className='text-red-500'> *</span>}
				</label>
			)}
			<div id={id} className={` ${className ?? ''} ${error ? FormClassess['error'] : ''}`}>
				<JoditReact onChange={handleEditorChange} config={config} defaultValue={value} />
			</div>
			{error && error !== '' && <p className='error'>{t(error)}</p>}
			{note && <p className='my-1 text-sm font-medium text-black'>{t(note)}</p>}
		</div>
	);
};

export default React.memo(CKEditorComponent);
