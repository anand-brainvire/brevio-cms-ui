import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const UPDATE_ENQUIRY_STATUS = gql`
	${META_FRAGMENT}
	mutation UpdateEnquiryStatus($uuid: UUID, $status: Int) {
		updateEnquiryStatus(uuid: $uuid, status: $status) {
			data {
				id
				uuid
				name
				email
				subject
				message
				status
				sendAt
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CREATE_ENQUIRY = gql`
	${META_FRAGMENT}
	mutation CreateEnquiry($name: String, $email: String, $subject: String, $message: String, $status: Int) {
		createEnquiry(name: $name, email: $email, subject: $subject, message: $message, status: $status) {
			data {
				id
				uuid
				name
				email
				subject
				message
				status
				sendAt
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_ENQUIRY = gql`
	${META_FRAGMENT}
	mutation DeleteEnquiry($uuid: UUID) {
		deleteEnquiry(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GROUP_DELETE_ENQ = gql`
	${META_FRAGMENT}
	mutation GroupDeleteEnquiries($uuid: [UUID]) {
		groupDeleteEnquiries(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;
