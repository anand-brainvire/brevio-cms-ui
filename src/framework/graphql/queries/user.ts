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
	query FetchUsers($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $fullName: String, $email: String, $status: Int, $gender: Int, $phoneNo: String, $isAll: Boolean) {
		fetchUsers(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, full_name: $fullName, email: $email, status: $status, gender: $gender, phone_no: $phoneNo, is_all: $isAll) {
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
					created_at
					updated_at
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

export const GET_USER_BY_ID = gql`
	${META_FRAGMENT}
	query GetUser($uuid: UUID) {
		getUser(uuid: $uuid) {
			data {
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
				status
				created_at
				updated_at
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
