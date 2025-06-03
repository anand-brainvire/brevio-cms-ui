import { gql } from '@apollo/client';
import { IMAGE_FRAGMENT, META_FRAGMENT } from '@framework/graphql/fragments';

export const UPDATE_SETTINGS = gql`
	${META_FRAGMENT}
	${IMAGE_FRAGMENT}
	mutation UpdateSetting($siteName: String, $tagLine: String, $supportEmail: String, $contactEmail: String, $contactNoContryId: Int, $contactNo: String, $address: String, $appLanguage: String, $allowMultipleLogin: Boolean, $abuseThreshold: Int) {
		updateSetting(site_name: $siteName, tag_line: $tagLine, support_email: $supportEmail, contact_email: $contactEmail, contact_no_contry_id: $contactNoContryId, contact_no: $contactNo, address: $address, app_language: $appLanguage, allow_multiple_login: $allowMultipleLogin, abuse_threshold: $abuseThreshold) {
			data {
				id
				uuid
				key
				value
				filePath {
					...SettingsImageFragment
				}
				is_active
				is_deleted
				is_for_admin
				is_for_front
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GET_SETTINGS_BY_ID = gql`
	${META_FRAGMENT}
	${IMAGE_FRAGMENT}

	query GetSettingDetails {
		getSettingDetails {
			data {
				id
				uuid
				key
				value
				filePath {
				...SettingsImageFragment
				}
				is_active
				is_deleted
				is_for_admin
				is_for_front
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
