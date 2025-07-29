import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_AUTHOR = gql`
	${META_FRAGMENT}
		query GetAllAuthors($search: String, $isActive: Boolean, $sortBy: String, $sortOrder: String, $limit: Int, $offset: Int, $authorUuids: [UUID]) {
		  	getAllAuthors(search: $search, is_active: $isActive, sortBy: $sortBy, sortOrder: $sortOrder, limit: $limit, offset: $offset, authorUuids: $authorUuids) {
		    	data {
		    	  	authors {
		    	    	uuid
		    	    	is_active
		    	    	author_translations {
		    	    		lang_code
		    	    		name
		    	    	}
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

export const GET_AUTHOR_BY_ID = gql`
	${META_FRAGMENT}
	query GetAuthorById($uuid: ID!) {
		getAuthorById(uuid: $uuid) {
    		data {
    			uuid
    			is_active
    			author_translations {
    			  lang_code
    			  name
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
