import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_STATE = gql`
	${META_FRAGMENT}
	query FetchStates($page: Int, $sortBy: String, $limit: Int, $sortOrder: String, $name: String, $stateCode: String, $countryId: Int, $status: Int, $isAll: Boolean) {
		fetchStates(page: $page, sortBy: $sortBy, limit: $limit, sortOrder: $sortOrder, name: $name, state_code: $stateCode, country_id: $countryId, status: $status, is_all: $isAll) {
			data {
				Statedata {
					id
					uuid
					name
					country_id
					state_code
					status
					created_at
					updated_at
					Country {
						id
						uuid
						name
						country_code
						phone_code
						currency_code
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

export const GET_STATE_BY_ID = gql`
	${META_FRAGMENT}
	query GetState($getStateId: UUID) {
		getState(uuid: $getStateId) {
			data {
				id
				uuid
				name
				state_code
				country_id
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

export const FETCH_COUNTRY = gql`
	${META_FRAGMENT}
	query FetchCountries($isAll: Boolean, $status: Int, $currencyCode: String, $phoneCode: String, $countryCode: String, $sortOrder: String, $name: String, $sortBy: String, $limit: Int, $page: Int) {
		fetchCountries(is_all: $isAll, status: $status, currency_code: $currencyCode, phone_code: $phoneCode, country_code: $countryCode, sortOrder: $sortOrder, name: $name, sortBy: $sortBy, limit: $limit, page: $page) {
			data {
				Countrydata {
					id
					uuid
					name
					country_code
					phone_code
					currency_code
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
export const FETCH_COUNTRY_LIST = gql`
	${META_FRAGMENT}
	query GetCountries {
		getCountries {
			data {
				Countrydata {
					id
					uuid
					name
					country_code
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
export const GET_STATE_LIST = gql`
	${META_FRAGMENT}
	query FetchStates {
		fetchStates {
			data {
				Statedata {
					id
					uuid
					name
					country_id
					state_code
					status
					created_at
					updated_at
					Country {
						id
						uuid
						name
						country_code
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
