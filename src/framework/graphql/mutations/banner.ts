import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const ADD_BANNER = gql`
	${META_FRAGMENT}
	mutation CreateBanner($bannerTitle: String,$status: Int,$bannerTitleArabic:String) {
		createBanner(
			banner_title: $bannerTitle
			status: $status
			banner_title_arabic:$bannerTitleArabic
		) {
			data {
				id
				uuid
				banner_title
				status
				created_by
				banner_title_arabic
				created_at
				updated_at
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const UPDATE_BANNER = gql`
	${META_FRAGMENT}
	mutation UpdateBanner($updateBannerId: UUID, $bannerTitle: String,  $status: Int,$bannerTitleArabic:String) {
		updateBanner(uuid: $updateBannerId, banner_title: $bannerTitle,  status: $status,banner_title_arabic:$bannerTitleArabic) {
			data {
			    uuid  
				banner_title
				status
				created_by
				created_at
				updated_at
				banner_title_arabic
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const DELETE_BANNER = gql`
	${META_FRAGMENT}
	mutation Mutation($deleteBannerId: UUID) {
		deleteBanner(uuid: $deleteBannerId) {
			data {
				id
				banner_title
				banner_image
				status
				created_by
				created_at
				updated_at
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const STATUS_CHANGE = gql`
	${META_FRAGMENT}
	mutation UpdateBannerStatus($updateBannerStatusId: UUID, $status: Int) {
		updateBannerStatus(uuid: $updateBannerStatusId, status: $status) {
			data {
				id
				banner_title
				banner_image
				status
				created_by
				created_at
				updated_at
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GROUP_DELETE_BANNER = gql`
	${META_FRAGMENT}
	mutation GroupDeleteBanner($groupDeleteBannerId: [UUID]) {
		groupDeleteBanner(uuid: $groupDeleteBannerId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
