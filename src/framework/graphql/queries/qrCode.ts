import { gql } from '@apollo/client';

export const GET_QR_CODE = gql`
	query FetchQrcodes($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $url: String, $status: Int, $isAll: Boolean) {
		fetchQrcodes(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, url: $url, status: $status, is_all: $isAll) {
			data {
				Qrcodedata {
					id
					uuid
					url
					qrcode
					status
					created_by
					updated_by
					created_at
					updated_at
					serialNo
				}
				count
			}
			meta {
				message
				messageCode
				statusCode
				status
				type
				errors {
					errorField
					error
				}
				errorType
			}
		}
	}
`;

export const GET_SINGLE_QR_CODE = gql`
	query GetQrcode($uuid: UUID) {
		getQrcode(uuid: $uuid) {
			data {
				id
				uuid
				url
				qrcode
				status
				created_by
				updated_by
				created_at
				updated_at
				users {
					id
					uuid
					first_name
					middle_name
					last_name
					user_name
					email
					gender
					date_of_birth
					phone_no
					phone_country_id
					role
					user_type
					profile_img
					device_type
					device_token
					status
					created_at
					updated_at
					serialNo
				}
			}
			meta {
				message
				messageCode
				statusCode
				status
				type
				errors {
					errorField
					error
				}
				errorType
			}
		}
	}
`;
