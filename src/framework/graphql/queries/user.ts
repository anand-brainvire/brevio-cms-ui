import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const testGetUser = gql`
	query testFetch {
		testFetch {
			id
			user_name
		}
	}
`;

export const GET_USER = gql`
	${META_FRAGMENT}
	query GetAllUsers($search: String, $isActive: Boolean, $sortBy: String, $sortOrder: String, $limit: Int, $offset: Int) {
	getAllUsers(search: $search, is_active: $isActive, sortBy: $sortBy, sortOrder: $sortOrder, limit: $limit, offset: $offset) {
		data {
			users {
				uuid
				email
				first_name
				last_name
				is_active
				created_at
				is_subscribed
				daily_goal_minutes
				books_completed
				signed_up_at
				current_streak_count
			}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GET_USER_BY_ID = gql`
	${META_FRAGMENT}
	query GetUserById($uuid: ID!) {
		getUserById(uuid: $uuid) {
    		data {
    			uuid
    			email
    			first_name
    			last_name
    			middle_name
    			role_id
    			role
    			is_active
    			created_at
    			updated_at
    			last_login_at
    			last_login_ip
    		}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GET_USERS_LIST = gql`
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
					user_name
					email
					gender
					date_of_birth
					phone_no
					phone_country_id
					role
					profile_img
					device_type
					status
					user_role_id
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
