import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const DELETE_NOTIFICATION = gql`
	${META_FRAGMENT}
	mutation DeleteNotificationTemplate($deleteNotificationTemplateId: UUID) {
		deleteNotificationTemplate(uuid: $deleteNotificationTemplateId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const UPDATE_NOTIFICATION = gql`
	${META_FRAGMENT}
	mutation UpdateNotificationTemplate($updateNotificationTemplateId: UUID, $status: Int, $template: String) {
		updateNotificationTemplate(uuid: $updateNotificationTemplateId, status: $status, template: $template) {
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
export const CHANGE_NOTIFICATION_STATUS = gql`
	${META_FRAGMENT}
	mutation UpdateNotificationTemplate($updateNotificationTemplateId: UUID, $status: Int) {
		updateNotificationTemplate(uuid: $updateNotificationTemplateId, status: $status) {
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
export const CREATE_NOTIFICATION = gql`
	${META_FRAGMENT}
	mutation CreateNotificationTemplate($template: String) {
		createNotificationTemplate(template: $template) {
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
export const GROUP_DELETE_NOTIFICATION = gql`
	${META_FRAGMENT}
	mutation GroupDeletenotificationTemplate($groupDeletenotificationTemplateId: [UUID]) {
		groupDeletenotificationTemplate(uuid: $groupDeletenotificationTemplateId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
