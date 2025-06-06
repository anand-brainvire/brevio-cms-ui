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
	query GetAllSubAdmins($search: String, $isActive: Boolean, $sortBy: String, $sortOrder: String, $limit: Int, $offset: Int) {
		getAllSubAdmins(search: $search, is_active: $isActive, sortBy: $sortBy, sortOrder: $sortOrder, limit: $limit, offset: $offset) {
			data {
				uuid
    			email
    			first_name
    			last_name
    			middle_name
    			role_id
    			role_name
    			role_uuid
    			is_active
    			created_at
    			updated_at
    			updated_by
    			created_by
		}
			meta {
			...MetaFragment
		  }
		}
	}
`;

export const GET_SUBADMIN_BY_ID = gql`
	${META_FRAGMENT}
	query GetSubAdminById($uuid: ID!) {
		getSubAdminById(uuid: $uuid) {
			data {
    			uuid
    			email
    			first_name
    			last_name
    			middle_name
    			role_id
    			role_name
    			role_uuid
    			is_active
    			created_at
    			updated_at
    			updated_by
    			created_by
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
