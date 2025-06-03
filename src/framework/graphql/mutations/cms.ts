import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const DELETE_CMS = gql`
	${META_FRAGMENT}
	mutation DeleteCMS($uuid: UUID) {
		deleteCMS(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CREATE_CMS = gql`
	${META_FRAGMENT}
	mutation CreateCMS($titleEnglish: String, $descriptionEnglish: String, $metaTitleEnglish: String, $metaDescriptionEnglish: String, $status: Int) {
		createCMS(title_english: $titleEnglish, description_english: $descriptionEnglish, meta_title_english: $metaTitleEnglish, meta_description_english: $metaDescriptionEnglish, status: $status) {
			data {
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
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GET_CMS_BY_ID = gql`
	${META_FRAGMENT}
	query GetSingleCMS($uuid: UUID) {
		getSingleCMS(uuid: $uuid) {
			data {
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
			meta {
				...MetaFragment
			}
		}
	}
`;

export const UPDATE_CMS = gql`
	${META_FRAGMENT}
	mutation UpdateCMS($titleEnglish: String, $descriptionEnglish: String, $metaTitleEnglish: String, $metaDescriptionEnglish: String, $status: Int, $uuid: UUID) {
		updateCMS(title_english: $titleEnglish, description_english: $descriptionEnglish, meta_title_english: $metaTitleEnglish, meta_description_english: $metaDescriptionEnglish, status: $status, uuid: $uuid) {
			data {
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
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GRP_DEL_CMS = gql`
	${META_FRAGMENT}
	mutation GroupDeleteCMS($uuid: [UUID]) {
		groupDeleteCMS(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CHANGESTATUS_CMS = gql`
	${META_FRAGMENT}
	mutation UpdateCMSStatus($uuid: UUID, $status: Int) {
		updateCMSStatus(uuid: $uuid, status: $status) {
			meta {
				...MetaFragment
			}
		}
	}
`;
