import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_CITY = gql`
	${META_FRAGMENT}
	query FetchCities($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $countryId: Int, $stateId: Int, $cityName: String, $status: Int, $isAll: Boolean) {
		fetchCities(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, country_id: $countryId, state_id: $stateId, city_name: $cityName, status: $status, is_all: $isAll) {
			data {
				Citydata {
					id
					uuid
					country_id
					state_id
					city_name
					created_at
					updated_at
					status
					State {
						id
						uuid
						name
						country_id
						state_code
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

export const GET_CITY_BY_ID = gql`
	${META_FRAGMENT}
	query GetCity($uuid: UUID) {
		getCity(uuid: $uuid) {
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
