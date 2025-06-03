import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_ENQUIRY = gql`
	${META_FRAGMENT}
	query FetchEnquiry($page: Int, $limit: Int, $name: String, $email: String, $status: Int, $sortBy: String, $sortOrder: String) {
		fetchEnquiry(page: $page, limit: $limit, name: $name, email: $email, status: $status, sortBy: $sortBy, sortOrder: $sortOrder) {
			data {
				enquiryData {
					id
					uuid
					name
					email
					subject
					message
					status
					sendAt
				}
				count
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
