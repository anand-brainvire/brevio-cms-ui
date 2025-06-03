import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_EVENTS = gql`
	${META_FRAGMENT}
	query FetchEvents($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $eventName: String, $startDate: Date, $endDate: Date) {
		fetchEvents(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, event_name: $eventName, start_date: $startDate, end_date: $endDate) {
			data {
				FetchEventData {
					id
					uuid
					event_name
					description
					email
					address
					is_reccuring
					send_notification
					start_date
					end_date
					status
					created_at
					updated_at
					created_by
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
						profile_img
						device_type
						status
						created_at
						updated_at
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
export const GET_EVENT_BY_ID = gql`
	${META_FRAGMENT}
	query FetchEvent($fetchEventId: UUID) {
		fetchEvent(uuid: $fetchEventId) {
			data {
				id
				uuid
				event_name
				description
				email
				address
				is_reccuring
				send_notification
				start_date
				end_date
				status
				participant_mail_ids
				reccurance_date
				created_at
				updated_at
				created_by
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GET_DROPDOWNFILTER_DATA = gql`
	${META_FRAGMENT}
	query FetchEventsList {
		fetchEventsList {
			data {
				FetchEventData {
					id
					uuid
					event_name
					description
					email
					address
					is_reccuring
					send_notification
					start_date
					end_date
					status
					created_at
					updated_at
					created_by
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
						profile_img
						device_type
						status
						created_at
						updated_at
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
export const VIEW_EVENT = gql`
	${META_FRAGMENT}
	query FetchEvent($fetchEventId: UUID) {
		fetchEvent(uuid: $fetchEventId) {
			data {
				id
				event_name
				description
				email
				is_reccuring
				start_date
				end_date
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
