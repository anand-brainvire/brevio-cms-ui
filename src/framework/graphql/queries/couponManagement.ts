import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const FETCH_COUPONS = gql`
	${META_FRAGMENT}
	query FetchOffers($page: Int, $limit: Int, $sortBy: String, $sortOrder: String, $offerName: String, $startDate: Date, $endDate: Date, $status: Int) {
		fetchOffers(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder, offer_name: $offerName, start_date: $startDate, end_date: $endDate, status: $status) {
			data {
				Offerdata {
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
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GET_COUPON_BY_ID = gql`
	${META_FRAGMENT}
	query GetOffer($uuid: UUID) {
		getOffer(uuid: $uuid) {
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
	}
`;
