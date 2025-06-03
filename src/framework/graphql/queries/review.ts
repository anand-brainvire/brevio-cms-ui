import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_REVIEW_DATA = gql`
	${META_FRAGMENT}
	query FetchUserReviews($page: Int, $search: String, $limit: Int, $sortBy: String, $sortOrder: String) {
		fetchUserReviews(page: $page, search: $search, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
			data {
				responseData {
					id
					uuid
					review
					rating
					status
					created_at
					updated_at
					user_details {
						uuid
						email
						first_name
						middle_name
						last_name
						user_name
						deleted_at
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
export const GET_ALLUSER_DATA = gql`
	${META_FRAGMENT}
	query GetUsers {
		getUsers {
			data {
				userList {
					id
					uuid
					first_name
					middle_name
					last_name
					email
					gender
					phone_no
					phone_country_id
					role
					profile_img
					status
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
