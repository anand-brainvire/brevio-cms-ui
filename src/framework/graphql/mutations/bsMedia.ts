import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const MOVE_BS_MEDIA = gql`
	${META_FRAGMENT}
	mutation MoveBsMedia($uuid: UUID, $parentId: Int) {
		moveBsMedia(uuid: $uuid, parent_id: $parentId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const CREATE_BS_MEDIA_FOLDER = gql`
	${META_FRAGMENT}
	mutation CreateBsMediaFolder($parentId: Int, $folderName: String) {
		createBsMediaFolder(parent_id: $parentId, folder_name: $folderName) {
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

export const RENAME_BS_MEDIA = gql`
	${META_FRAGMENT}
	mutation RenameBsMedia($uuid: UUID, $name: String) {
		renameBsMedia(uuid: $uuid, name: $name) {
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

export const DELETE_BS_MEDIA = gql`
	${META_FRAGMENT}
	mutation GroupDeleteBsMedia($uuid: [UUID]) {
		groupDeleteBsMedia(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;
