import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const FETCH_BOOKS = gql`
	${META_FRAGMENT}
	query GetAllBooks($filter: BookFilterInput, $sortBy: String, $sortOrder: String, $limit: Int, $offset: Int) {
		getAllBooks(filter: $filter, sortBy: $sortBy, sortOrder: $sortOrder, limit: $limit, offset: $offset) {
		data {
    		books {
    			uuid
    			is_content_modified
				is_published
    			updated_at
    			version_id
    			version_uuid
    			title
    			cover_image_url
    			slug
    			status
    			authors {
    				uuid
    				name
    			}
    			categories {
    				uuid
    				name
    			}
    		}
      			totalCount
    		}

			meta {
				...MetaFragment
			}
		}
	}
`;
export const GET_COUPON_BY_ID = gql`
	${META_FRAGMENT}
	query GetOffer($uuid: UUID) {
		getOffer(uuid: $uuid) {
			data {
				id
				uuid
				offer_name
				offer_code
				offer_type
				value
				offer_usage
				applicable
				total_usage
				status
				start_date
				end_date
				selected_users
				created_at
				updated_at
				serialNo
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
