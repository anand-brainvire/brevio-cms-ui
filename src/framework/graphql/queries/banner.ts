import { gql } from '@apollo/client';
import { BANNER_IMAGE_FRAGMENT, META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_BANNER = gql`
	${META_FRAGMENT}
	${BANNER_IMAGE_FRAGMENT}
	query FetchBanner($page: Int, $limit: Int, $bannerTitle: String, $createdBy: String, $status: Int, $sortBy: String, $sortOrder: String) {
		fetchBanner(page: $page, limit: $limit, banner_title: $bannerTitle, created_by: $createdBy, status: $status, sortBy: $sortBy, sortOrder: $sortOrder) {
			data {
				BannerData {
					id
					uuid
					banner_title
					banner_title_arabic
					banner_image
					status
					created_by
					created_at
					updated_at
					filePath {
						...BannerFragment
					}
					User {
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
					serialNo
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GET_BANNER_BY_ID = gql`
	${META_FRAGMENT}
	${BANNER_IMAGE_FRAGMENT}
	query Query($getBannerDetailId: UUID) {
		getBannerDetail(uuid: $getBannerDetailId) {
			data {
				id
				uuid
				banner_title
				banner_title_arabic
				banner_image
				status
				created_by
				created_at
				updated_at
				filePath {
					...BannerFragment
				}
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
