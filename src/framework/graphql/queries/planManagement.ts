import { gql } from '@apollo/client';
import { META_FRAGMENT } from '../fragments';

export const FETCH_PLAN_MANAGEMENT = gql`
	${META_FRAGMENT}
	query FetchPlanManagement($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $type: String, $price: Float, $isRecommended: Boolean, $status: Int, $isAll: Boolean) {
		fetchPlanManagement(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, type: $type, price: $price, is_recommended: $isRecommended, status: $status, is_all: $isAll) {
			data {
				PlanData {
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

export const GET_PLAN_MANAGEMENT = gql`
	${META_FRAGMENT}
	query GetPlanManagement($uuid: UUID) {
		getPlanManagement(uuid: $uuid) {
			data {
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
			meta {
				...MetaFragment
			}
		}
	}
`;
