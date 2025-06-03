import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_ADMIN = gql`
	query GetProfileInformation {
		getProfileInformation {
			data {
				id
				uuid
				first_name
				middle_name
				last_name
				user_name
				email
				gender
				date_of_birth
				phone_no
				phone_country_id
				role
				user_type
				profile_img
				device_type
				device_token
				status
				created_at
				updated_at
				serialNo
			}
			meta {
				...MetaFragment
			}
		}
	}
	${META_FRAGMENT}
`;
