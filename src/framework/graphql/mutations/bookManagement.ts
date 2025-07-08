import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const DELETE_BOOK_BY_ID = gql`
	${META_FRAGMENT}
	mutation DeleteBook($uuid: ID!) {
		deleteBook(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const BOOK_PUBLISH_STATUS = gql`
	${META_FRAGMENT}
	mutation TogglePublishBook($uuid: UUID) {
		togglePublishBook(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CREATE_BOOK = gql`
	${META_FRAGMENT}
	mutation CreateBook($bookData: [BookInputType]) {
	createBook(book_data: $bookData) {
		meta {
			...MetaFragment
		}
	}
}
`;
export const UPDATE_BOOK_INFO = gql`
	${META_FRAGMENT}
	mutation UpdateBook($bookUuid: UUID, $categoryUuids: [UUID], $authorsUuids: [UUID], $bookData: [BookVersionTranslationInput]) {
	updateBook(book_uuid: $bookUuid, category_uuids: $categoryUuids, authors_uuids: $authorsUuids, book_data: $bookData) {
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

export const REFINE_ABOUT_BOOK = gql`
	${META_FRAGMENT}
	mutation RefineAboutBook($uuid: ID!) {
	refineAboutBook(uuid: $uuid) {
		data {
			refinedData
		}
		meta {
			...MetaFragment
		}	
	}
	}
`;

export const REFINE_ABOUT_AUTHOR = gql`
	${META_FRAGMENT}
	mutation RefineAboutAuthor($uuid: ID!) {
	refineAboutAuthor(uuid: $uuid) {
		data {
			refinedData
		}
		meta {
			...MetaFragment
		}	
	}
}
`;
export const REFINE_LEARNING_POINTS = gql`
	${META_FRAGMENT}
	mutation RefineLearningPoints($uuid: ID!) {
	refineLearningPoints(uuid: $uuid) {
		data {
			refinedData
		}
		meta {
			...MetaFragment
		}
	}	
}
`;

export const TOGGLE_FREE_BOOK = gql`
	${META_FRAGMENT}
	mutation ToggleFreeBook($uuid: UUID) {
	toggleFreeBook(uuid: $uuid) {
		meta {
			...MetaFragment
		}
	}
}
`;

export const PUBLISH_BOOK = gql`
	${META_FRAGMENT}
	mutation PublishBook($input: saveBookInput) {
		publishBook(input: $input) {
			meta {
				...MetaFragment
			}
		}
}
`;

export const REFINE_COVER_IMAGE = gql`
	${META_FRAGMENT}
	mutation RefineCoverImage($uuid: ID!) {
	refineCoverImage(uuid: $uuid) {
		data {
			refinedCoverImage
		}
		meta {
			...MetaFragment
		}
	}
}
`;

export const CREATE_BOOK_PAGE = gql`
	${META_FRAGMENT}
	mutation CreateBookPage($bookId: String!, $translations: [BookPageTranslationInput!]!, $insights: [BookPageInsightInput!]!) {
  	createBookPage(book_id: $bookId, translations: $translations, insights: $insights) {
    	meta {
				...MetaFragment
			}
		}
	}
`;

export const UPDATE_BOOK_PAGE = gql`
	${META_FRAGMENT}
	mutation UpdateBookPage($uuid: ID!, $insights: [BookPageInsightInput!]!, $translations: [BookPageTranslationInput!]) {
	updateBookPage(uuid: $uuid, insights: $insights, translations: $translations) {
		meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_DRAFT_BOOK_PAGE = gql`
	${META_FRAGMENT}
	mutation DeleteDraftBookPages($bookUuid: UUID) {
  	deleteDraftBookPages(bookUuid: $bookUuid) {
		meta {
				...MetaFragment
			}
		}
  	}
`;

export const DELETE_BOOK_PAGE = gql`
	${META_FRAGMENT}
	mutation DeleteBookPage($uuid: ID!) {
		deleteBookPage(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GENERATE_NEW_BOOK = gql`
	${META_FRAGMENT}
mutation GenerateBookContent($input: GenerateBookContentInput!) {
  generateBookContent(input: $input) {
		data {
			slug
			title
			status
			book_uuid
			book_version_uuid
			total_pages
			total_insights
			author_names
			about_book
			about_authors
			learning_points
			cover_image_url
			pages {
				page_number
				key_point
				html_content
				insights {
				key
				text
				}
			}
			authors {
				name
				uuid
			}
			categories {
				name
				slug
				uuid
				description
			}
		}
    	meta {
			...MetaFragment
		}
  	}
}
`;
export const RESTORE_TO_DRAFT = gql`
	${META_FRAGMENT}
mutation ClonePublishToDraft($uuid: UUID) {
	clonePublishToDraft(uuid: $uuid) {
		meta {
			...MetaFragment
		}
	}
}
`;
export const UPDATE_COUPON = gql`
	${META_FRAGMENT}
	mutation UpdateOffer($uuid: UUID, $offerName: String, $offerCode: String, $offerType: Int, $value: REAL, $startDate: Date, $endDate: Date, $offerUsage: Int, $applicable: Int, $selectedUsers: [UUID]) {
		updateOffer(uuid: $uuid, offer_name: $offerName, offer_code: $offerCode, offer_type: $offerType, value: $value, start_date: $startDate, end_date: $endDate, offer_usage: $offerUsage, applicable: $applicable, selected_users: $selectedUsers) {
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
		  }
			meta {
				...MetaFragment
			}
		}
	}
`;
export const CREATE_COUPON = gql`
	${META_FRAGMENT}
	mutation CreateOffer($offerName: String, $offerCode: String, $offerType: Int, $value: REAL, $startDate: Date, $endDate: Date, $offerUsage: Int, $applicable: Int, $selectedUsers: [UUID]) {
		createOffer(offer_name: $offerName, offer_code: $offerCode, offer_type: $offerType, value: $value, start_date: $startDate, end_date: $endDate, offer_usage: $offerUsage, applicable: $applicable, selected_users: $selectedUsers) {
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
	  }`

export const GROUP_DELETE_COUPON = gql`
	${META_FRAGMENT}
	mutation GroupDeleteOffers($uuid: [UUID]) {
		groupDeleteOffers(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const REFINE_KEY_POINTS = gql`
	${META_FRAGMENT}
mutation RefinePageKeyPoint($uuid: ID!) {
  refinePageKeyPoint(uuid: $uuid) {
    data {
      refinedData
    }
    meta {
		...MetaFragment
	}
  }
}
`;

export const REFINE_PAGE_CONTENT = gql`
	${META_FRAGMENT}
mutation RefinePageContent($uuid: ID!) {
  refinePageContent(uuid: $uuid) {
    data {
      refinedData
    }
    meta {
		...MetaFragment
	}
  }
}
`;

export const REFINE_INSIGHTS = gql`
	${META_FRAGMENT}
	mutation RefinePageInsight($bookPageUuid: ID!, $insightUuid: ID!) {
  refinePageInsight(bookPageUuid: $bookPageUuid, insightUuid: $insightUuid) {
    data {
      refinedData
    }
	meta {
		...MetaFragment
	}  
  }
}
`;

export const GENERATE_AUDIO = gql`
	${META_FRAGMENT}
	mutation GeneratePageAudio($bookPageUuid: ID!, $type: String) {
  	generatePageAudio(book_page_uuid: $bookPageUuid, type: $type) {
    data {
      url
      path
    }
    meta {
		...MetaFragment
	} 
  }
}
`;