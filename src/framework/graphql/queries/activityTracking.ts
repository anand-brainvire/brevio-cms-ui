import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const GET_ACTIVITY_LIST = gql`
	${META_FRAGMENT}
	query FetchActivityTrackings($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $name: String, $email: String, $activity: String, $startDate: Date, $endDate: Date) {
		fetchActivityTrackings(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, name: $name, email: $email, activity: $activity, start_date: $startDate, end_date: $endDate) {
			data {
				activityData {
					id
					uuid
					user_id
					title
					ip_address
					details {
						desc_message
						old
						new
					}
					status
					module
					sub_module
					User {
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
					}
					created_by
					updated_by
					deleted_by
					created_at
					updated_at
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
