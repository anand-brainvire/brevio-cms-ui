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
				cover_image_url_view
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
      			count
    		}

			meta {
				...MetaFragment
			}
		}
	}
`;

export const FETCH_BOOK_BY_ID = gql`
	${META_FRAGMENT}
	query GetBookById($uuid: ID!) {
	  	getBookById(uuid: $uuid) {
	    	data {
	    		uuid
	    		published_version_id
	    		is_published
	    		published_at
	    		published_by
	    		is_content_modified
	    		is_active
	    		is_best_seller
	    		is_free
	    		total_unique_completion
	    		total_completion
	    		created_at
	    		updated_at
	    		created_by
	    		updated_by
	    	  	versions {
	    	    	uuid
	    	    	page_count
	    	    	cover_image_url
	    	    	slug
	    	    	status
	    	    	version_number
	    	    	total_key_points
	    	    	total_minutes
	    	    	total_insights
	    	    	is_active
	    	    translations {
	    	    	uuid
	    	    	book_version_id
	    	    	lang_code
	    	    	title
	    	    	about_book
	    	    	about_author
	    	    	learning_points
	    	    }
	    	    authors {
	    	    	uuid
	    	    	is_active
	    	      	author_translations {
	    	        	lang_code
	    	        	name
	    	    	}
	    	    }
	    	    categories {
	    	    	uuid
	    	    	slug
	    	    	is_active
	    	    	category_translations {
	    	        	lang_code
	    	        	name
	    	        	description
	    	      	}
	    	    }
	    	}
		}	
		meta {
			...MetaFragment
		}	
	}
}
`;

export const GET_ALL_BOOK_PAGES = gql`
	${META_FRAGMENT}
	query GetAllBookPages($bookId: String!) {
		getAllBookPages(book_id: $bookId) {
		data {
			version_status
				pages {
					uuid
					page_number
					is_active
					translations {
						uuid
						lang_code
						key_point
						html_content
						audio_male
						audio_female
						total_minutes
						total_seconds
						regenerate_audio
					}
					insights {
						uuid
						book_page_id
						key
						translations {
							lang_code
							text
						}
					}
				}
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
