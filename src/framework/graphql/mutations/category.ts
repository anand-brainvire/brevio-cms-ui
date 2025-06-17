import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const UPDATE_CATEGORY = gql`
	${META_FRAGMENT}
	mutation UpdateCategory($uuid: ID!, $categoryData: [CategoryTranslationInput!]	!, $slug: String!, $isActive: Boolean, $goalUuids: [UUID]) {
  		updateCategory(uuid: $uuid, category_data: $categoryData, slug: $slug, is_active: $isActive, goal_uuids: $goalUuids) {
			meta {
				...MetaFragment
		}
  	}
}
`;
export const UPDATE_CATEGORY_STATUS = gql`
	${META_FRAGMENT}
	mutation ToggleCategoryStatus($uuid: ID!) {
		toggleCategoryStatus(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const DELETE_CATEGORY = gql`
	${META_FRAGMENT}
	mutation DeleteCategory($uuid: ID!) {
		deleteCategory(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const CREATE_CATEGORY = gql`
	${META_FRAGMENT}
	mutation CreateCategory($categoryData: [CategoryTranslationInput!]!, $goalUuids: [UUID!],$slug: String!, $isActive: Boolean) {
		createCategory(category_data: $categoryData, goal_uuids: $goalUuids, slug: $slug, is_active: $isActive) {
			meta {
				...MetaFragment
			}
		}
	}`;

export const GROUP_DELETE_CATEGORY = gql`
	${META_FRAGMENT}
	mutation GroupDeleteCategories($groupDeleteCategoriesId: [UUID]) {
		groupDeleteCategories(uuid: $groupDeleteCategoriesId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
