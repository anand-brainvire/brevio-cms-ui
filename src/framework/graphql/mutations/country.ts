import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const CREATE_COUNTRY = gql`
	${META_FRAGMENT}
	mutation CreateCountry($name: String, $countryCode: String, $status: Int,$phoneCode: String,$currencyCode:String ) {
		createCountry(name: $name, country_code: $countryCode, status: $status, phone_code:$phoneCode,currency_code:$currencyCode
			) {
			data {
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
			meta {
				...MetaFragment
			}
		}
	}
`;

export const CHANGE_COUNTRY_STATUS = gql`
	${META_FRAGMENT}
	mutation ChangeCountryStatus($changeCountryStatusId: UUID, $status: Int) {
		changeCountryStatus(uuid: $changeCountryStatusId, status: $status) {
			data {
				id
				uuid
				name
				country_code
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

export const DELETE_COUNTRY = gql`
	${META_FRAGMENT}
	mutation DeleteCountry($deleteCountryId: UUID) {
		deleteCountry(uuid: $deleteCountryId) {
			data {
				id
				uuid
				name
				country_code
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

export const UPDATE_COUNTRY = gql`
	${META_FRAGMENT}
	mutation UpdateCountry($uuid: UUID, $name: String, $countryCode: String, $status: Int,$phoneCode: String,$currencyCode:String ) {
		updateCountry(uuid: $uuid, name: $name, country_code: $countryCode, status: $status,phone_code:$phoneCode,currency_code:$currencyCode) {
			data {
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
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GROUP_DELETE_COUNTRY = gql`
	${META_FRAGMENT}
	mutation GroupDeleteCountries($groupDeleteCountriesId: [UUID]) {
		groupDeleteCountries(uuid: $groupDeleteCountriesId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
