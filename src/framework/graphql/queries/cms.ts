import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const FETCH_CMS = gql`
	${META_FRAGMENT}
	query FetchCMS($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
		fetchCMS(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
			data {
				cmsData {
					title_english
					description_english
					meta_title_english
					meta_description_english
					status
					created_at
					updated_at
					id
					uuid
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
