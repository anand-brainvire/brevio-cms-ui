import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const CHANGE_SUBADMIN_STATUS = gql`
	${META_FRAGMENT}
	mutation ToggleSubAdminStatus($uuid: ID!) {
		toggleSubAdminStatus(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_SUBADMIN = gql`
	${META_FRAGMENT}
	mutation DeleteSubAdmin($uuid: ID!) {
		deleteSubAdmin(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CHANGE_SUBADMIN_PASSWORD = gql`
	${META_FRAGMENT}
	mutation ChangeSubAdminPassword($changeSubAdminPasswordId: UUID, $newPassword: String, $confirmPassword: String) {
		changeSubAdminPassword(uuid: $changeSubAdminPasswordId, newPassword: $newPassword, confirmPassword: $confirmPassword) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CREATE_SUBADMIN = gql`
	${META_FRAGMENT}
	mutation CreateSubAdmin($email: String!, $password: String!, $firstName: String!, $lastName: String!, $middleName: String, $roleId: String, $isActive: Boolean) {
		createSubAdmin(email: $email, password: $password, first_name: $firstName, last_name: $lastName, middle_name: $middleName, role_id: $roleId, is_active: $isActive) {
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

export const UPDATE_SUBADMIN = gql`
	${META_FRAGMENT}
	mutation UpdateSubAdmin($uuid: ID!, $firstName: String, $lastName: String, $middleName: String, $roleId: String, $isActive: Boolean) {
		updateSubAdmin(uuid: $uuid, first_name: $firstName, last_name: $lastName, middle_name: $middleName, role_id: $roleId, is_active: $isActive) {
				meta {
				...MetaFragment
			}
		}
	}
`;
export const GROUP_DELETE_SUBADMIN = gql`
	${META_FRAGMENT}
	mutation GroupDeleteSubAdmins($groupDeleteSubAdminsId: [UUID]) {
		groupDeleteSubAdmins(uuid: $groupDeleteSubAdminsId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
