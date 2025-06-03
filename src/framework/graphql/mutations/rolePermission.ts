import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const CREARTE_ROLE_PERMISSIONS = gql`
	${META_FRAGMENT}
	mutation CreateRolePermisssion($roleId: UUID, $permissionIds: [UUID]) {
		createRolePermisssion(role_id: $roleId, permission_ids: $permissionIds) {
			meta {
				...MetaFragment
			}
		}
	}
`;
