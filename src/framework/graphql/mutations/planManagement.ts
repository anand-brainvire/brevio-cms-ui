import { gql } from '@apollo/client';
import { META_FRAGMENT } from '../fragments';

export const CREATE_PLAN_MANAGEMENT = gql`
	${META_FRAGMENT}
	mutation CreatePlanManagement($name: String, $description: String, $type: String, $price: Float, $isRecommended: Boolean, $status: Int) {
		createPlanManagement(name: $name, description: $description, type: $type, price: $price, is_recommended: $isRecommended, status: $status) {
			data {
				id
				uuid
				name
				description
				type
				price
				is_recommended
				status
				created_by
				updated_by
				created_at
				updated_at
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_SINGLE_PLAN = gql`
	mutation DeletePlanManagement($uuid: UUID) {
		deletePlanManagement(uuid: $uuid) {
			meta {
				message
				messageCode
				statusCode
				status
				type
				errors {
					errorField
					error
				}
				errorType
			}
		}
	}
`;

export const GROUP_DELETE_PLAN = gql`
	mutation GroupDeletePlanManagement($uuid: [UUID]) {
		groupDeletePlanManagement(uuid: $uuid) {
			meta {
				message
				messageCode
				statusCode
				status
				type
				errors {
					errorField
					error
				}
				errorType
			}
		}
	}
`;

export const UPDATE_PLAN_MANAGEMENT = gql`
	${META_FRAGMENT}
	mutation UpdatePlanManagement($uuid: UUID, $name: String, $description: String, $type: String, $price: Float, $isRecommended: Boolean, $status: Int) {
		updatePlanManagement(uuid: $uuid, name: $name, description: $description, type: $type, price: $price, is_recommended: $isRecommended, status: $status) {
			data {
				id
				uuid
				name
				description
				type
				price
				is_recommended
				status
				created_by
				updated_by
				created_at
				updated_at
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const UPDATE_PLAN_STATUS = gql`
	${META_FRAGMENT}
	mutation UpdatePlanManagementStatus($uuid: UUID, $status: Int) {
		updatePlanManagementStatus(uuid: $uuid, status: $status) {
			data {
				id
				uuid
				name
				description
				type
				price
				is_recommended
				status
				created_by
				updated_by
				created_at
				updated_at
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
