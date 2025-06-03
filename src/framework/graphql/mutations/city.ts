import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const CREATE_CITY = gql`
	${META_FRAGMENT}
	mutation CreateCity($cityName: String, $countryId: Int, $stateId: Int, $status: Int) {
		createCity(city_name: $cityName, country_id: $countryId, state_id: $stateId, status: $status) {
			data {
				id
				uuid
				country_id
				state_id
				city_name
				created_at
				updated_at
				status
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CHANGE_CITY_STATUS = gql`
	${META_FRAGMENT}
	mutation ChangeCityStatus($uuid: UUID, $status: Int) {
		changeCityStatus(uuid: $uuid, status: $status) {
			data {
				id
				uuid
				country_id
				state_id
				city_name
				created_at
				updated_at
				status
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_CITY = gql`
	${META_FRAGMENT}
	mutation DeleteCity($uuid: UUID) {
		deleteCity(uuid: $uuid) {
			data {
				id
				uuid
				country_id
				state_id
				city_name
				created_at
				updated_at
				status
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const UPDATE_CITY = gql`
	${META_FRAGMENT}
	mutation UpdateCity($uuid: UUID, $cityName: String, $stateId: Int, $countryId: Int, $status: Int) {
		updateCity(uuid: $uuid, city_name: $cityName, state_id: $stateId, country_id: $countryId, status: $status) {
			data {
				id
				uuid
				country_id
				state_id
				city_name
				created_at
				updated_at
				status
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GROUP_DELETE_CITY = gql`
	${META_FRAGMENT}
	mutation GroupDeleteCities($uuid: [UUID]) {
		groupDeleteCities(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;
