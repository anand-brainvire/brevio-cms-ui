import { gql } from '@apollo/client';

export const CREATE_QR = gql`
	mutation CreateQrcode($url: String, $status: Int) {
		createQrcode(url: $url, status: $status) {
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

export const UPDATE_QR = gql`
	mutation UpdateQrcode($uuid: UUID, $url: String, $status: Int) {
		updateQrcode(uuid: $uuid, url: $url, status: $status) {
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

export const CHANGE_STATUS_QR = gql`
	mutation UpdateQrcodeStatus($uuid: UUID, $status: Int) {
		updateQrcodeStatus(uuid: $uuid, status: $status) {
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

export const DELETE_QR = gql`
	mutation DeleteQrcode($uuid: UUID) {
		deleteQrcode(uuid: $uuid) {
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

export const GRP_DELETE_QR = gql`
	mutation GroupDeleteQrcodes($uuid: [UUID]) {
		groupDeleteQrcodes(uuid: $uuid) {
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
