import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_NOTIFICATIONS = gql`
	${META_FRAGMENT}
	query FetchNotificationTemplate($page: Int, $search: String, $sortBy: String, $sortOrder: String, $limit: Int) {
		fetchNotificationTemplate(page: $page, search: $search, sortBy: $sortBy, sortOrder: $sortOrder, limit: $limit) {
			data {
				notificationdata {
					id
					uuid
					template
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
export const GET_NOTIFICATION_BY_ID = gql`
	${META_FRAGMENT}
	query GetNotificationTemplate($getNotificationTemplateId: UUID) {
		getNotificationTemplate(uuid: $getNotificationTemplateId) {
			data {
				id
				uuid
				template
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
