import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const FETCH_BS_MEDIA = gql`
	${META_FRAGMENT}
	query FetchBsMedia($search: String, $sortBy: String, $sortOrder: String, $parentId: Int, $fileType: String) {
		fetchBsMedia(search: $search, sortBy: $sortBy, sortOrder: $sortOrder, parent_id: $parentId, file_type: $fileType) {
			data {
				BsMediadata {
					id
					uuid
					name
					is_folder
					parent_id
					mime_type
					extensions
					media_url
					media_url_200
					media_url_300
					status
					size
					original_name
					created_by
					created_at
					updated_at
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GET_BS_MEDIA_BY_UUID = gql`
	${META_FRAGMENT}
	query GetBsMedia($uuid: UUID) {
		getBsMedia(uuid: $uuid) {
			data {
				id
				uuid
				name
				is_folder
				parent_id
				mime_type
				extensions
				media_url
				media_url_200
				media_url_300
				status
				created_by
				created_at
				updated_at
				original_name
				size
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
