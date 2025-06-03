import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const DELETE_COUPON_BY_ID = gql`
	${META_FRAGMENT}
	mutation DeleteOffer($uuid: UUID) {
		deleteOffer(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const COUPON_STATUS_CHANGE_BY_ID = gql`
	${META_FRAGMENT}
	mutation UpdateOfferStatus($uuid: UUID, $status: Int) {
		updateOfferStatus(uuid: $uuid, status: $status) {
			data {
				id
				uuid
				offer_name
				offer_code
				offer_type
				value
				offer_usage
				applicable
				total_usage
				status
				start_date
				end_date
				created_at
				updated_at
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const UPDATE_COUPON = gql`
	${META_FRAGMENT}
	mutation UpdateOffer($uuid: UUID, $offerName: String, $offerCode: String, $offerType: Int, $value: REAL, $startDate: Date, $endDate: Date, $offerUsage: Int, $applicable: Int, $selectedUsers: [UUID]) {
		updateOffer(uuid: $uuid, offer_name: $offerName, offer_code: $offerCode, offer_type: $offerType, value: $value, start_date: $startDate, end_date: $endDate, offer_usage: $offerUsage, applicable: $applicable, selected_users: $selectedUsers) {
		  data {
			id
			uuid
			offer_name
			offer_code
			offer_type
			value
			offer_usage
			applicable
			total_usage
			status
			start_date
			end_date
			selected_users
			created_at
			updated_at
		  }
			meta {
				...MetaFragment
			}
		}
	}
`;
export const CREATE_COUPON = gql`
	${META_FRAGMENT}
	mutation CreateOffer($offerName: String, $offerCode: String, $offerType: Int, $value: REAL, $startDate: Date, $endDate: Date, $offerUsage: Int, $applicable: Int, $selectedUsers: [UUID]) {
		createOffer(offer_name: $offerName, offer_code: $offerCode, offer_type: $offerType, value: $value, start_date: $startDate, end_date: $endDate, offer_usage: $offerUsage, applicable: $applicable, selected_users: $selectedUsers) {
		  data {
			id
			uuid
			offer_name
			offer_code
			offer_type
			value
			offer_usage
			applicable
			total_usage
			status
			start_date
			end_date
			selected_users
			created_at
			updated_at
			serialNo
		  }
		  meta {
			...MetaFragment
		  }
		}
	  }`

export const GROUP_DELETE_COUPON = gql`
	${META_FRAGMENT}
	mutation GroupDeleteOffers($uuid: [UUID]) {
		groupDeleteOffers(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;
