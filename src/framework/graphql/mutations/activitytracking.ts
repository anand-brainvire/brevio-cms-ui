import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const DELETE_ACTIVITY = gql`
	${META_FRAGMENT}
	mutation DeleteActivity($uuid: UUID!) {
		deleteActivity(uuid: $uuid) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GROUP_DELETE_ACTIVITY = gql`
	${META_FRAGMENT}
	mutation GroupDeleteActivities($uuids: [UUID!]!) {
		groupDeleteActivities(uuids: $uuids) {
			meta {
				...MetaFragment
			}
		}
	}
`;
