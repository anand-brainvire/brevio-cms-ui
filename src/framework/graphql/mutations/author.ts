import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const ADD_AUTHOR = gql`
	${META_FRAGMENT}
	mutation CreateAuthor($authorData: [AuthorInputType], $isActive: Boolean) {
		createAuthor(author_data: $authorData, is_active: $isActive) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const UPDATE_AUTHOR = gql`
	${META_FRAGMENT}
	mutation UpdateAuthor($uuid: ID!, $authorData: [AuthorInputType],$isActive: Boolean) {
		updateAuthor(uuid: $uuid, author_data: $authorData, is_active: $isActive) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const DELETE_AUTHOR = gql`
	${META_FRAGMENT}
	mutation DeleteAuthor($uuid: ID!) {
		deleteAuthor(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const STATUS_CHANGE = gql`
	${META_FRAGMENT}
	mutation ToggleAuthorStatus($uuid: ID!) {
		toggleAuthorStatus(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GROUP_DELETE_BANNER = gql`
	${META_FRAGMENT}
	mutation GroupDeleteBanner($groupDeleteBannerId: [UUID]) {
		groupDeleteBanner(uuid: $groupDeleteBannerId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
