import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const SEARCH_SUBADMIN = gql`
	${META_FRAGMENT}
	query SearchSubAdmin($firstName: String, $lastName: String, $email: String, $status: Int, $role: Int) {
		searchSubAdmin(first_name: $firstName, last_name: $lastName, email: $email, status: $status, role: $role) {
			data {
				count
				subAdminData {
					id
					first_name
					last_name
					user_name
					email
					password
					role
					status
					created_at
					updated_at
				}
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GET_SUBADMIN = gql`
${META_FRAGMENT}
	query GetSubAdmins($page: Int, $limit: Int, $firstName: String, $lastName: String, $email: String, $status: Int, $role: Int, $sortBy: String, $sortOrder: String) {
		getSubAdmins(page: $page, limit: $limit, first_name: $firstName, last_name: $lastName, email: $email, status: $status, role: $role, sortBy: $sortBy, sortOrder: $sortOrder) {
		  data {
			subAdminData {
			  id
			  uuid
			  first_name
			  last_name
			  user_name
			  email
			  role
			  status
			  created_at
			  updated_at
			  serialNo
			  Role {
				id
				uuid
				role_name
				key
				status
				created_at
				updated_at
				serialNo
			  }
			}
			count
		  }
		  meta {
			...MetaFragment
		  }
		}
	  }
`;

export const GET_SUBADMIN_BY_ID = gql`
	${META_FRAGMENT}
	query GetSubAdmin($getSubAdminId: UUID) {
		getSubAdmin(uuid: $getSubAdminId) {
			data {
				id
				first_name
				last_name
				user_name
				email
				role
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
