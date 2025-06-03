import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const FETCH_SUBSCRIPTION = gql`
	${META_FRAGMENT}
	query FetchSubscriptions($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $status: Int) {
		fetchSubscriptions(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, status: $status) {
			data {
				SubscriptionData {
					id
					uuid
					user_name
					plan_name
					plan_price
					user_id
					plan_id
					start_date
					end_date
					status
					created_by
					updated_by
					created_at
					updated_at
					plans {
						id
						uuid
						name
						description
						type
						price
						is_recommended
						status
						created_by
						updated_by
						created_at
						updated_at
					}
					users {
						id
						uuid
						first_name
						middle_name
						last_name
						user_name
						email
						gender
						date_of_birth
						phone_no
						phone_country_id
						role
						user_type
						profile_img
						device_type
						device_token
						status
						created_at
						updated_at
						serialNo
					}
					serialNo
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CREATE_SUBSCRIPTION = gql`
	${META_FRAGMENT}
	mutation CreateSubscription($userId: Int, $planId: Int, $paymentStatus: Int, $stripeApiResponse: String, $startDate: Date, $endDate: Date, $status: Int) {
		createSubscription(user_id: $userId, plan_id: $planId, payment_status: $paymentStatus, stripe_api_response: $stripeApiResponse, start_date: $startDate, end_date: $endDate, status: $status) {
			data {
				id
				uuid
				plan_name
				plan_price
				user_name
				user_id
				plan_id
				payment_status
				stripe_api_response
				start_date
				end_date
				status
				created_by
				updated_by
				created_at
				updated_at
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
