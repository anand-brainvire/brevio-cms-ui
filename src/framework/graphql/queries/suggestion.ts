import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_SUGGESTION = gql`
	${META_FRAGMENT}
	query FetchSuggestion($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $categoryId: Int, $suggestion: String, $createdBy: String, $status: Int) {
		fetchSuggestion(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, category_id: $categoryId, suggestion: $suggestion, created_by: $createdBy, status: $status) {
			data {
				Suggestiondata {
					id
					uuid
					category_id
					suggestion
					status
					created_by
					created_at
					updated_at
					Category {
						id
						uuid
						category_name
						parent_category
						description
						status
						created_by
						created_at
						updated_at
					}
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

export const GET_CATEGORY = gql`
	query FetchCategory {
		fetchCategory {
			data {
				Categorydata {
					id
					category_name
				}
			}
		}
	}
`;
