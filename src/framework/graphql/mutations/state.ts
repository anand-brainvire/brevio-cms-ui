import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const CREATE_STATE = gql`
	${META_FRAGMENT}
	mutation CreateState($name: String, $stateCode: String, $status: Int, $countryId: Int) {
		createState(name: $name, state_code: $stateCode, status: $status, country_id: $countryId) {
			data {
				id
				uuid
				name
				country_id
				state_code
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

export const CHANGE_STATE_STATUS = gql`
	${META_FRAGMENT}
	mutation ChangeStateStatus($changeStateStatusId: UUID, $status: Int) {
		changeStateStatus(uuid: $changeStateStatusId, status: $status) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_STATE = gql`
	${META_FRAGMENT}
	mutation DeleteState($deleteStateId: UUID) {
		deleteState(uuid: $deleteStateId) {
			meta {
				...MetaFragment
			}
			data {
				id
				uuid
				name
				state_code
				status
				created_at
				updated_at
			}
		}
	}
`;

export const UPDATE_STATE = gql`
	${META_FRAGMENT}
	mutation UpdateState($updateStateId: UUID, $name: String, $stateCode: String, $status: Int, $countryId: Int) {
		updateState(uuid: $updateStateId, name: $name, state_code: $stateCode, status: $status, country_id: $countryId) {
			data {
				id
				uuid
				name
				state_code
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
export const GROUP_DELETE_STATE = gql`
	${META_FRAGMENT}
	mutation GroupDeleteStates($groupDeleteStatesId: [UUID]) {
		groupDeleteStates(uuid: $groupDeleteStatesId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
