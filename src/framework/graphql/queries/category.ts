import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const FETCH_CATEGORY = gql`
	${META_FRAGMENT}
	query FetchCategory($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
		fetchCategory(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
			data {
				Categorydata {
					id
					uuid
					category_name
					parent_category
					description
					status
					created_by
					created_at
					updated_at
					parentData {
						id
						uuid
						category_name
						parent_category
						description
						status
						created_by
						created_at
						updated_at
					}
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GET_CATEGORY_BY_ID = gql`
	${META_FRAGMENT}
	query GetSingleCategory($getSingleCategoryId: UUID) {
		getSingleCategory(uuid: $getSingleCategoryId) {
			data {
				id
				uuid
				category_name
				parent_category
				description
				status
				created_by
				created_at
				updated_at
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const FETCH_CATEGORY_LIST = gql`
	${META_FRAGMENT}
	query FetchCategory {
		fetchCategory {
			data {
				Categorydata {
					id
					uuid
					category_name
					parent_category
					description
					status
					created_by
					created_at
					updated_at
					parentData {
						id
						uuid
						category_name
						parent_category
						description
						status
						created_by
						created_at
						updated_at
					}
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
