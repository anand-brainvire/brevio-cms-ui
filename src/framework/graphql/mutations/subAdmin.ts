import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const CHANGE_SUBADMIN_STATUS = gql`
	${META_FRAGMENT}
	mutation ChangeSubAdminStatus($changeSubAdminStatusId: UUID, $status: Int) {
		changeSubAdminStatus(uuid: $changeSubAdminStatusId, status: $status) {
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

export const DELETE_SUBADMIN = gql`
	${META_FRAGMENT}
	mutation DeleteSubAdmin($deleteSubAdminId: UUID) {
		deleteSubAdmin(uuid: $deleteSubAdminId) {
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
	mutation CreateSubAdmin($userName: String, $firstName: String, $lastName: String, $email: String, $password: String, $confirmPassword: String, $role: Int) {
		createSubAdmin(user_name: $userName, first_name: $firstName, last_name: $lastName, email: $email, password: $password, confirm_password: $confirmPassword, role: $role) {
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

export const UPDATE_SUBADMIN = gql`
	${META_FRAGMENT}
	mutation UpdateSubAdmin($updateSubAdminId: UUID, $firstName: String, $lastName: String, $email: String, $role: Int) {
		updateSubAdmin(uuid: $updateSubAdminId, first_name: $firstName, last_name: $lastName, email: $email, role: $role) {
			data {
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
