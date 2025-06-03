import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const CREATE_REVIEW = gql`
	${META_FRAGMENT}
	mutation CreateReview($fromUserId: Int, $review: String, $rating: Float) {
		createReview(from_user_id: $fromUserId, review: $review, rating: $rating) {
			data {
				id
				uuid
				review
				rating
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

export const UPDATE_REVIEW_STATUS = gql`
	${META_FRAGMENT}
	mutation UpdateReviewStatus($uuid: UUID, $status: Int) {
		updateReviewStatus(uuid: $uuid, status: $status) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_REVIEW = gql`
	${META_FRAGMENT}
	mutation DeleteReview($deleteReviewId: UUID) {
		deleteReview(uuid: $deleteReviewId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GROUP_DELETE_REVIEW = gql`
	${META_FRAGMENT}
	mutation GroupDeleteReviews($groupDeleteReviewsId: [UUID]) {
		groupDeleteReviews(uuid: $groupDeleteReviewsId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
