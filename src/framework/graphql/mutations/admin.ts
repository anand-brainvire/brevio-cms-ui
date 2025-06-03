import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const UPDATE_ADMIN_PROFILE = gql`
	${META_FRAGMENT}
	mutation UpdateUserProfile($firstName: String, $lastName: String) {
		updateUserProfile(first_name: $firstName, last_name: $lastName) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const CHANGE_USERPROFILE_PASSWORD = gql`
	${META_FRAGMENT}
	mutation ChangePassword($currentPassword: String, $newPassword: String) {
	  changePassword(current_password: $currentPassword, new_password: $newPassword) {
	    data {
	      accessToken
	      refreshToken
	      user {
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
	      permissions
	    }
		meta {
			...MetaFragment
		}  
	  }
}`;
