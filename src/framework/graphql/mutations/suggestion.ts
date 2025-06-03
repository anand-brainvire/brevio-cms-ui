import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const CREATE_SUGGESTION = gql`
	${META_FRAGMENT}
	mutation CreateSuggestion($categoryId: Int!, $suggestion: String!, $status: Int) {
		createSuggestion(category_id: $categoryId, suggestion: $suggestion, status: $status) {
			data {
				id
				category_id
				suggestion
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

export const DELETE_SUGGESTION = gql`
	${META_FRAGMENT}
	mutation DeleteSuggestion($deleteSuggestionId: UUID) {
		deleteSuggestion(uuid: $deleteSuggestionId) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const UDPATE_SUGGESTION_STATUS = gql`
	${META_FRAGMENT}
	mutation UpdateSuggestionStatus($suggestionStatusUpdateId: UUID, $status: Int, $note: String) {
		updateSuggestionStatus(uuid: $suggestionStatusUpdateId, status: $status, note: $note) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GRP_DELETE_SUGGESTION = gql`
	${META_FRAGMENT}
	mutation GroupDeleteSuggestions($groupDeleteSuggestionsId: [UUID]) {
		groupDeleteSuggestions(uuid: $groupDeleteSuggestionsId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GROUP_DELETE_SUGGESTION = gql`
	${META_FRAGMENT}
	mutation GroupDeleteSuggestions($groupDeleteSuggestionsId: [Int]) {
		groupDeleteSuggestions(id: $groupDeleteSuggestionsId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
