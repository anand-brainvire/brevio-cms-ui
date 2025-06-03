import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const SEARCH_SUBADMIN = gql`
	${META_FRAGMENT}
	query SearchSubAdmin($firstName: String, $lastName: String, $email: String, $status: Int, $role: Int) {
		searchSubAdmin(first_name: $firstName, last_name: $lastName, email: $email, status: $status, role: $role) {
			data {
				count
				subAdminData {
					id
					first_name
					last_name
					user_name
					email
					password
					role
					status
					created_at
					updated_at
				}
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GET_COUNTRY = gql`
	${META_FRAGMENT}
	query FetchCountries($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $name: String, $countryCode: String, $phoneCode: String, $currencyCode: String, $status: Int, $isAll: Boolean) {
		fetchCountries(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, name: $name, country_code: $countryCode, phone_code: $phoneCode, currency_code: $currencyCode, status: $status, is_all: $isAll) {
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

export const GET_COUNTRY_BY_ID = gql`
	${META_FRAGMENT}
	query GetCountry($getCountryId: UUID) {
		getCountry(uuid: $getCountryId) {
			data {
				id
				uuid
				name
				country_code
				status
				created_at
				updated_at
				phone_code
				currency_code
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const FETCH_COUNTRY_CODE = gql`
	${META_FRAGMENT}
	query FetchCountries($isAll: Boolean, $status: Int, $currencyCode: String, $page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $name: String, $countryCode: String, $phoneCode: String) {
		fetchCountries(is_all: $isAll, status: $status, currency_code: $currencyCode, page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, name: $name, country_code: $countryCode, phone_code: $phoneCode) {
			data {
				Countrydata {
					id
					uuid
					currency_code
					phone_code
				}
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
