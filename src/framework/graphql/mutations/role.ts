import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const UPDATE_ROLE = gql`
	${META_FRAGMENT}
	mutation UpdateRole($uuid: UUID!, $roleName: String!) {
		updateRole(uuid: $uuid, role_name: $roleName) {
			data {
				id
				uuid
				role_name
				key
				status
				created_at
				updated_at
				serialNo
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CREATE_ROLE = gql`
	${META_FRAGMENT}
	mutation CreateRole($roleName: String!) {
		createRole(role_name: $roleName) {
			data {
				id
				uuid
				role_name
				key
				status
				created_at
				updated_at
				serialNo
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const UPDATE_ROLE_STATUS = gql`
	${META_FRAGMENT}
	mutation UpdateRoleStatus($uuid: UUID!, $status: Int!) {
		updateRoleStatus(uuid: $uuid, status: $status) {
			data {
				id
				uuid
				role_name
				key
				status
				created_at
				updated_at
				serialNo
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_ROLE = gql`
	${META_FRAGMENT}
	mutation DeleteRole($uuid: UUID) {
		deleteRole(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_GROUP_ROLE = gql`
	${META_FRAGMENT}
	mutation GroupDeleteRoles($groupDeleteRolesId: [Int]) {
		groupDeleteRoles(id: $groupDeleteRolesId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
