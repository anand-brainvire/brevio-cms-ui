import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const FETCH_CATEGORY = gql`
	${META_FRAGMENT}
	query GetAllCategories($search: String, $isActive: Boolean, $sortBy: String, $sortOrder: String, $limit: Int, $offset: Int) {
		getAllCategories(search: $search, is_active: $isActive, sortBy: $sortBy, sortOrder: $sortOrder, limit: $limit, offset: $offset) {
    		data {
    		  	categories {
    		    	uuid
    		    	slug
    		    	category_translations {
    		    	  lang_code
    		    	  name
    		    	  description
    		    	}
					is_active
    		    	created_at
    		    	updated_at
    		    	updated_by
    		    	created_by
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
	query GetCategoryById($uuid: ID!) {
		getCategoryById(uuid: $uuid) {
		data {
		    	uuid
		    	slug
		    	is_active
		    		category_translations {
		    			lang_code
		    			name
		    			description
		    		}
		    	goals {
		    		uuid
		    		emoji
		    		key
		    		translations {
		    			lang_code
		    			title
		    		}
		    	}
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

export const FETCH_GOALS = gql`
	${META_FRAGMENT}
		query GetAllGoals($search: String, $isActive: Boolean, $sortBy: String, $sortOrder: String, $limit: Int, $offset: Int) {
			getAllGoals(search: $search, is_active: $isActive, sortBy: $sortBy, sortOrder: $sortOrder, limit: $limit, offset: $offset) {
				data {
					uuid
					key
					emoji
					is_active
					translations {
					  lang_code
					  title
					}
					created_at
					updated_at
				}
			meta {
				...MetaFragment
			}
		}
}`;

