import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const testGetUser = gql`
	query testFetch {
		testFetch {
			id
			user_name
		}
	}
`;

export const GET_USER = gql`
	${META_FRAGMENT}
		query GetAllUsers($search: String, $isActive: Boolean, $sortBy: String, $sortOrder: String, $limit: Int, $offset: 	Int, $isSubscribed: Boolean, $userType: [String]) {
  		getAllUsers(search: $search, is_active: $isActive, sortBy: $sortBy, sortOrder: $sortOrder, limit: $limit, offset: $offset, is_subscribed: $isSubscribed, user_type: $userType) {
		data {
			users {
				uuid
				email
				first_name
				last_name
				is_active
				created_at
				is_subscribed
				daily_goal_minutes
				books_completed
				signed_up_at
				current_streak_count
				is_trial
			}
			count
		}
		meta {
			...MetaFragment
		}
  	}
}
`;

export const GET_USER_BY_ID = gql`
	${META_FRAGMENT}
	query GetUserById($uuid: ID!) {
	getUserById(uuid: $uuid) {
		data {
			uuid
			email
			first_name
			last_name
			is_active
			created_at
			is_subscribed
			daily_goal_minutes
			books_completed
			signed_up_at
			current_streak_count
			userSubscriptionDetails {
				subscription_id
				starts_at
				expires_at
				is_trial
				is_active
				auto_renew_status
				product_id
				product_name
				receipt_id
				receipt_identifier
				original_transaction_id
				receipt_created_at
			}
		}
		meta {
			...MetaFragment
		}
	}
}
`;

export const GET_USER_INTERESTED_CATEGORIES = gql`
	${META_FRAGMENT}
	query GetUserInterestedCategories {
	getUserInterestedCategories {
		categories {
			uuid
			slug
			name
		}
		meta {
			...MetaFragment
		}
	}
}
`;

export const GET_USER_INTERESTED_GOALS = gql`
	${META_FRAGMENT}
	query GetUserInterestedGoals {
	getUserInterestedGoals {
		goals {
			uuid
			key
			title
			emoji
		}
		meta {
			...MetaFragment
		}
	}
}
`;

export const GET_MY_STATISTICS = gql`
	${META_FRAGMENT}
	query GetMyStatistics($guestUserId: String) {
  	getMyStatistics(guest_user_id: $guestUserId) {
	data {
		summaries
		key_points
		percentile
		number_of_people_behind_you	
	}
    meta {
		...MetaFragment
	}
	}
}
`;

export const GET_USERS_LIST = gql`
	${META_FRAGMENT}
	query GetUsers {
		getUsers {
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
					profile_img
					device_type
					status
					user_role_id
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

export const GET_MY_ACHIEVEMENTS = gql`
	${META_FRAGMENT}
	query GetMyAchievements {
	getMyAchievements {
		data {
			perseverant {
				level
				current_progress_in_percentage
			}
			smart {
				level
				current_progress_in_percentage
			}
			wise {
				level
				current_progress_in_percentage
			}
			influencer {
				level
				current_progress_in_percentage
			}
		}
		meta {
			...MetaFragment
		}
	}
}
`;
