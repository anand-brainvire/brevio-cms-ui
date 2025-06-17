import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_PERMISSIONS = gql`
	${META_FRAGMENT}
	query FetchPermissions {
		fetchPermissions {
			meta {
				...MetaFragment
			}
    		data {
    			id
    			uuid
    			module_name
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
		}
	}
`;
export const FETCH_ROLE_PERMISSIONS_BY_ID = gql`
	${META_FRAGMENT}
	query Role($uuid: ID!) {
		role(uuid: $uuid) {
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
