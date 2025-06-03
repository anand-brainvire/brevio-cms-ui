import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_PERMISSIONS = gql`
	${META_FRAGMENT}
	query GetModuleWisePermissions {
		getModuleWisePermissions {
			meta {
				...MetaFragment
			}
			data {
				id
				module_name
				description
				key
				status
				permissions {
					id
					uuid
					module_id
					permission_name
					key
					status
					created_by
					createdAt
					updatedAt
				}
			}
		}
	}
`;
export const FETCH_ROLE_PERMISSIONS_BY_ID = gql`
	${META_FRAGMENT}
	query FetchRolePermissions($roleId: UUID) {
		fetchRolePermissions(roleId: $roleId) {
			data {
				permissionList {
					id
					uuid
					module_id
					permission_name
					key
					status
					created_by
					createdAt
					updatedAt
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
