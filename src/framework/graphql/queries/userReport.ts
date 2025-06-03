import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const FETCH_USER_REPORT = gql`
	${META_FRAGMENT}
	query FetchUserReports($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $search: String) {
		fetchUserReports(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, search: $search) {
			data {
				reportData {
					id
					uuid
					reporter_id
					reporter_user_id
					user_report_type
					description
					report_status
					moderator_notes
					status
					created_at
					updated_at
					serialNo
					reporter {
						id
						uuid
						first_name
						middle_name
						last_name
						email
					}
					reporterUser {
						id
						uuid
						first_name
						middle_name
						last_name
						email
					}
					userReportType {
						id
						uuid
						value
					}
					userReportStatus {
						id
						uuid
						value
					}
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_USER_REPORT = gql`
	mutation DeleteUserReport($uuid: UUID) {
		deleteUserReport(uuid: $uuid) {
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

export const GRP_DELETE_USER_REPORT = gql`
	mutation GroupDeleteUserReports($uuid: [UUID]) {
		groupDeleteUserReports(uuid: $uuid) {
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

export const CHANGE_USER_REPORT_STATUS = gql`
	mutation UpdateUserReportStatus($uuid: UUID, $status: Int) {
		updateUserReportStatus(uuid: $uuid, status: $status) {
			data {
				id
				uuid
				reporter_id
				reporter_user_id
				user_report_type
				description
				report_status
				moderator_notes
				status
				created_at
				updated_at
				serialNo
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
