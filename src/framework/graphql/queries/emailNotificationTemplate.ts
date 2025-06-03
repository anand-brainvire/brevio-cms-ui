import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const FETCH_EMAIL_NOTIFICATION_TEMPLATE = gql`
	${META_FRAGMENT}
	query FetchEmailTemplate($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
		fetchEmailTemplate(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
		  data {
			emailData {
			  id
			  uuid
			  subject
			  content
			  template_for
			  template_type
			  status
			  created_by
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

export const GET_EMAIL_TEMPLATE_BY_ID = gql`
	${META_FRAGMENT}
	query GetEmailTemplate($uuid: UUID) {
		getEmailTemplate(uuid: $uuid) {
			data {
				id
				uuid
				subject
				content
				template_for
				template_type
				status
				created_by
				created_at
			    updated_at
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
