import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_ROLES_DATA = gql`
	${META_FRAGMENT}
	query FetchRoles($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
		fetchRoles(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
			data {
				Roledata {
					id
					uuid
					role_name
					key
					status
					created_at
					updated_at
					serialNo
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GET_ROLES_DATALIST = gql`
	${META_FRAGMENT}
	query FetchRoles($isAll: Boolean) {
		fetchRoles(is_all: $isAll) {
		  data {
			Roledata {
			  id
			  uuid
			  role_name
			  key
			  status
			  created_at
			  updated_at
			  serialNo
			}
			count
		  }
		  meta {
			...MetaFragment
		  }
		}
	  }
`;
