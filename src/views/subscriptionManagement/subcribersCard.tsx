import React, { useState } from 'react';
import { SubcriptionCardProps } from '@type/subscription';
import PaymentModal from './paymentModal';

const SubscribersCommmonCard = ({ title, price, type, description, planUuid, planId }: SubcriptionCardProps) => {
	const [isRoleModelShow, setIsRoleModelShow] = useState<boolean>(false);

	const onBuySubcription = () => {
		setIsRoleModelShow(true);
	};

	const onClose = () => {
		setIsRoleModelShow(false);
	};

	return (
		<div className='border-primary rounded-2xl border  divide-y divide-gray-200 max-w-sm mx-auto mt-18' key={planUuid}>
			<div className='p-6'>
				<div className='flex justify-between'>
					<h2 className='text-lg font-semibold text-gray-600'>{title}</h2>
				</div>
				<p className='mt-0.5 text-sm text-gray-500'>{description}</p>
				<p className='mt-8'>
					<span className='text-4xl font-bold tracking-tight text-gray-900'>${price}</span>
					<span className='text-base font-medium text-gray-500'>/{type}</span>
				</p>
				<button className='flex justify-center w-full py-3 mt-4 text-sm font-medium text-white bg-primary border border-primary rounded active:text-indigo-500 hover:bg-transparent hover:text-primary focus:outline-none focus:ring' onClick={onBuySubcription} type='button'>
					Subscribe
				</button>
				{isRoleModelShow && <PaymentModal onClose={onClose} isModalShow={isRoleModelShow} price={price} description={description} planId={planId} planType={type} />}
			</div>
		</div>
	);
};
export default SubscribersCommmonCard;
