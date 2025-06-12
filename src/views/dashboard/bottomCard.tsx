import React from 'react';
import { BottomCardProps } from '@type/dashboard';
import { useNavigate } from 'react-router-dom';
// import { ROUTES } from '@config/constant';

const BottomCard = ({ title, value}: BottomCardProps) => {
	const navigate = useNavigate();
	const redirectFunction = () => {
		return navigate('#');
	};
	return (
		<div aria-label='card' aria-hidden='true' className='realtive rounded-md  mb-6 text-white bg-primary hover:cursor-pointer' onClick={redirectFunction ?? ''}>
			<div className='flex flex-col'>
				<div className='p-5 pb-0 '>
					<div className='text-center '>
						<h3 className='text-h1 leading-xl font-medium mb-2'>{value}</h3>
					</div>
				</div>
				<div className='my-4 text-center'>
					<h4 className='text-h3 leading-6 font-medium mb-2'>{title}</h4>
				</div>
			</div>
		</div>
	);
};
export default BottomCard;
