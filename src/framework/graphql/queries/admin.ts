import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_ADMIN = gql`
	query GetProfile {
		getProfile {
			data {
			    	uuid
			    	email
			    	first_name
			    	last_name
			    	middle_name
			    	role_id
			    	role
			    	is_active
			    	created_at
			    	updated_at
			    	last_login_at
			    	last_login_ip
			    }
			meta {
				...MetaFragment
			}
		}
	}
	${META_FRAGMENT}
`;
