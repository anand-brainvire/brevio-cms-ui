import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_RULES_SETS = gql`
	${META_FRAGMENT}
	query FetchSetRules($page: Int, $ruleName: String, $status: Int, $limit: Int, $sortBy: String, $sortOrder: String) {
		fetchSetRules(page: $page, rule_name: $ruleName, status: $status, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
			data {
				ruleData {
					id
					uuid
					rule_name
					description
					times_triggered
					priority
					on_action
					status
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
export const FETCH_RULES_SET_BY_ID = gql`
	query FetchSingleSetRule($fetchSingleSetRuleId: UUID) {
		fetchSingleSetRule(uuid: $fetchSingleSetRuleId) {
			data {
				rule_name
				description
				priority
				on_action
				times_triggered
				status
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
