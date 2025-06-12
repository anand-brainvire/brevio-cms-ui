import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const UPDATE_CATEGORY = gql`
	${META_FRAGMENT}
	mutation UpdateCategory($updateCategoryId: UUID, $categoryName: String, $description: String, $parentCategory: Int, $status: Int) {
		updateCategory(uuid: $updateCategoryId, category_name: $categoryName, description: $description, parent_category: $parentCategory, status: $status) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const UPDATE_CATEGORY_STATUS = gql`
	${META_FRAGMENT}
	mutation CategoryStatusUpdate($categoryStatusUpdateId: UUID, $status: Int) {
		categoryStatusUpdate(uuid: $categoryStatusUpdateId, status: $status) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const DELETE_CATEGORY = gql`
	${META_FRAGMENT}
	mutation Mutation($deleteCategoryId: UUID) {
		deleteCategory(uuid: $deleteCategoryId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const CREATE_CATEGORY = gql`
	${META_FRAGMENT}
	mutation CreateCategory($categoryData: [CategoryTranslationInput!]!, $goalUuids: [UUID!],$slug: String!) {
		createCategory(category_data: $categoryData, goal_uuids: $goalUuids, slug: $slug) {
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
