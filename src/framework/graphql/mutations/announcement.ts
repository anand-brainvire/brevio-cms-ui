import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const CREATE_ANNOUNCEMENT = gql`
	${META_FRAGMENT}
	mutation CreateAnnouncement($title: String, $description: String, $annoucemntType: String, $emailAttachment: String, $platform: String, $userType: String, $userFilter: String, $userToExclude: [Int], $onlySendTo: [Int], $startDate: Date, $endDate: Date) {
		createAnnouncement(title: $title, description: $description, annoucemnt_type: $annoucemntType, email_attachment: $emailAttachment, platform: $platform, userType: $userType, userFilter: $userFilter, userToExclude: $userToExclude, onlySendTo: $onlySendTo, start_date: $startDate, end_date: $endDate) {
			data {
				id
				uuid
				title
				description
				annoucemnt_type
				email_attachment
				platform
				userType
				userFilter
				userToExclude
				onlySendTo
				start_date
				end_date
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
