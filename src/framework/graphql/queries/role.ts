import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_ROLES_DATA = gql`
	${META_FRAGMENT}
	query Roles($search: String, $limit: Int, $offset: Int, $sortBy: String, $sortOrder: String, $isActive: Boolean) {
		roles(search: $search, limit: $limit, offset: $offset, sortBy: $sortBy, sortOrder: $sortOrder, is_active: $isActive) {
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
export const GET_ROLES_DATALIST = gql`
	${META_FRAGMENT}
	query Roles($search: String, $limit: Int, $offset: Int, $sortBy: String, $sortOrder: String, $isActive: Boolean) {
		roles(search: $search, limit: $limit, offset: $offset, sortBy: $sortBy, sortOrder: $sortOrder, is_active: $isActive	) {
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
