import React, { ReactElement, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LinkELementProps } from '@type/common';
import { uuid } from '@utils/helpers';

const LinkElement = ({ to, className, onClick, content, data, icon }: LinkELementProps): ReactElement => {
	const onClickHanlder = useCallback(() => {
		onClick(data);
	}, []);
	return (
		<Link to={to} className={className} onClick={onClickHanlder} key={uuid()}>
			{icon && <span className='fill-b-color-4 -ml-2.5 mr-2.5 w-3.5 h-3.5 inline-block svg-icon'>{icon}</span>}
			{content}
		</Link>
	);
};
export default LinkElement;
