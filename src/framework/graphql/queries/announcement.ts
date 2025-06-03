import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_ANNOUCEMENTS = gql`
	${META_FRAGMENT}
	query FetchAnnoucements($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $title: String, $startDate: Date, $endDate: Date, $annoucemntType: String, $platform: String, $status: Int) {
		fetchAnnoucements(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, title: $title, start_date: $startDate, end_date: $endDate, annoucemnt_type: $annoucemntType, platform: $platform, status: $status) {
			data {
				announcementData {
					id
					uuid
					title
					description
					annoucemnt_type
					email_attachment
					platform
					userType
					userFilter
					userToExclude
					onlySendTo
					start_date
					end_date
					status
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

export const GET_USER = gql`
	${META_FRAGMENT}
	query FetchUsers($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $fullName: String, $email: String, $status: Int, $gender: Int, $phoneNo: String, $isAll: Boolean) {
		fetchUsers(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, full_name: $fullName, email: $email, status: $status, gender: $gender, phone_no: $phoneNo, is_all: $isAll) {
			data {
				userList {
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
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GET_ANNOUNCEMENT_BY_ID = gql`
	${META_FRAGMENT}
	query GetAnnoucement($uuid: UUID) {
		getAnnoucement(uuid: $uuid) {
			data {
				id
				uuid
				title
				description
				annoucemnt_type
				email_attachment
				file_name
				platform
				userType
				userFilter
				userToExclude
				onlySendTo
				start_date
				end_date
				filePath {
					original_file
					image_200
				}
				status
				created_at
				updated_at
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
