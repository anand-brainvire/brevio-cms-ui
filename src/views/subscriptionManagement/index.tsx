import React from 'react';
import SubscribersCommmonCard from '@src/views/subscriptionManagement/subcribersCard';
import { FETCH_PLAN_MANAGEMENT } from '@framework/graphql/queries/planManagement';
import { useQuery } from '@apollo/client';
import { uuid } from '@utils/helpers';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@config/constant';
import { PlanManagementDataProps } from '@type/planManagement';

const SubscribersCard = () => {
	const { data } = useQuery(FETCH_PLAN_MANAGEMENT, {
		variables: {
			isAll: true,
		},
	});
	const clientSecretKey = process.env.REACT_APP_CLIENT_SECRET;
	const options = {
		clientSecret: clientSecretKey,
	};

	return (
		<div className='grid grid-cols md:grid-cols-3 gap-2' key={uuid()}>
			{data?.fetchPlanManagement?.data?.PlanData?.map((plan: PlanManagementDataProps) => {
				if (plan.status === 1) {
					return (
						<div key={plan.id}>
							<Elements stripe={stripePromise} options={options}>
								<SubscribersCommmonCard title={plan.name} price={plan.price} description={plan.description} type={plan.type} planUuid={plan.uuid} planId={plan.id} />
							</Elements>
						</div>
					);
				}
				return null;
			})}
		</div>
	);
};

export default SubscribersCard;
