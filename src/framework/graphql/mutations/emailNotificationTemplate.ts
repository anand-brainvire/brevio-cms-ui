import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const EMAIL_TEMPLATE_STATUS_UPDATE = gql`
	${META_FRAGMENT}
	mutation EmailTemplateStatusUpdate($uuid: UUID, $status: Int) {
		emailTemplateStatusUpdate(uuid: $uuid, status: $status) {
			data {
				id
				uuid
				subject
				content
				template_for
				template_type
				status
				created_by
				created_at
			  updated_at
				serialNo
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CREATE_EMAIL_TEMPLATE = gql`
	${META_FRAGMENT}
	mutation CreateEmailTemplate($subject: String, $content: String, $templateFor: String, $templateType: Int, $status: Int) {
		createEmailTemplate(subject: $subject, content: $content, template_for: $templateFor, template_type: $templateType, status: $status) {
			data {
				id
				uuid
				subject
				content
				template_for
				template_type
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

export const DELETE_EMAIL_TEMPLATE = gql`
	${META_FRAGMENT}
	mutation DeleteEmailTemplate($uuid: UUID) {
		deleteEmailTemplate(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const UPADTE_EMAIL_TEMPLATE = gql`
	${META_FRAGMENT}
	mutation UpdateEmailTemplate($uuid: UUID, $subject: String, $templateFor: String, $content: String, $templateType: Int, $status: Int) {
		updateEmailTemplate(uuid: $uuid, subject: $subject, template_for: $templateFor, content: $content, template_type: $templateType, status: $status) {
			data {
				id
				uuid
				subject
				content
				template_for
				template_type
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
export const GROUP_DELETE_EMAIL_NOTIFICATION_TEMPLATE = gql`
	${META_FRAGMENT}
	mutation GroupDeleteEmailtemplates($uuid: [UUID]) {
		groupDeleteEmailtemplates(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;
