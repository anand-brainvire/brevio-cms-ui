import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const CREARTE_ROLE_PERMISSIONS = gql`
	${META_FRAGMENT}
	mutation UpdateRolePermissions($roleUuid: UUID!, $permissionUuids: [UUID!]!) {
		updateRolePermissions(roleUuid: $roleUuid, permissionUuids: $permissionUuids) {
			data {
    			id
    			uuid
    			role_name
    			is_active
    			created_at
    			updated_at
    			updated_by
    			created_by
    			permissions {
    				id
    				uuid
    				module_id
    				permission_name
    				key
    				is_active
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
