import React, { FC, ReactElement } from 'react';
import loader from '@assets/svg/loader.svg';
import { LoaderProps } from '@type/component';

/**
 * Global loader
 * @param showtext Display loader text or not
 * @returns
 */
const LoadingIndicator: FC<LoaderProps> = ({ showText }): ReactElement => {
	return (
		<div className='text-center w-full h-full flex items-center justify-center loader-wrapper'>
			<img src={loader} className='w-2/12 h-2/12 lg:w-wide-8 lg:h-rise-7' alt='loader' />
			{/* Added alt attributeName to the image */}
			{showText}
		</div>
	);
};

export default LoadingIndicator;
