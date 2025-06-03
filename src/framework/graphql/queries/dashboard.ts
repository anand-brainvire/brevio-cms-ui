import { gql } from '@apollo/client';
import { META_FRAGMENT } from '../fragments';


export const FETCH_DASHBOARD_COUNT = gql`
	${META_FRAGMENT}
	query DashboardDataCount {
		dashboardDataCount {
			data {
				adminCount
				userCount
				enquiryCount
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const USER_COUNT_BY_YEAR = gql`
${META_FRAGMENT}
query UserCountByYear($year: String) {
    userCountByYear(year: $year) {
      data {
        January
        February
        March
        April
        May
        June
        July
        August
        September
        October
        November
        December
      }
      meta {
        ...MetaFragment
    }
 }
}
`;
