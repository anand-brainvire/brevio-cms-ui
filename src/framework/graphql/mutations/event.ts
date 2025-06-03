import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const DELETE_EVENT = gql`
	${META_FRAGMENT}
	mutation DeleteEvent($deleteEventId: UUID) {
		deleteEvent(uuid: $deleteEventId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const UPDATE_EVENT = gql`
	${META_FRAGMENT}
	mutation UpdateEvent($updateEventId: UUID, $eventName: String, $description: String, $sendNotification: Boolean, $address: String, $startDate: Date, $endDate: Date, $isReccuring: String, $reccuranceDate: Date, $participantMailIds: [String]) {
		updateEvent(uuid: $updateEventId, event_name: $eventName, description: $description, send_notification: $sendNotification, address: $address, start_date: $startDate, end_date: $endDate, is_reccuring: $isReccuring, reccurance_date: $reccuranceDate, participant_mail_ids: $participantMailIds) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const CREATE_EVENT = gql`
	${META_FRAGMENT}
	mutation CreateEvent($eventName: String, $description: String, $sendNotification: Boolean, $address: String, $startDate: Date, $endDate: Date, $isReccuring: String, $reccuranceDate: Date) {
		createEvent(event_name: $eventName, description: $description, send_notification: $sendNotification, address: $address, start_date: $startDate, end_date: $endDate, is_reccuring: $isReccuring, reccurance_date: $reccuranceDate) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GROUP_DELETE_EVENTS = gql`
	${META_FRAGMENT}
	mutation GroupDeleteEvents($groupDeleteEventsId: [UUID]) {
		groupDeleteEvents(uuid: $groupDeleteEventsId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
