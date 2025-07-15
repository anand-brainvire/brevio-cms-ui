import React, { FC, ReactElement } from 'react';
import loader from '@assets/svg/loader.svg';
import { LoaderProps } from '@type/component';

/**
 * Global loader with a user-friendly common message
 * @param showText Optional: override default message
 */
const LoadingIndicator: FC<LoaderProps> = ({ showText }): ReactElement => {
	const message = showText || 'Please wait while we process your request...';

	return (
		<div className='text-center w-full h-full flex flex-col items-center justify-center loader-wrapper space-y-3 bg-white/70 text-gray-800'>
			<img
				src={loader}
				className='w-2/12 h-2/12 lg:w-wide-8 lg:h-rise-7 animate-spin-slow'
				alt='Loading...'
			/>
		<p className='text-primary text-sm lg:text-base'>{message}</p>
		</div>
	);
};

export default LoadingIndicator;
