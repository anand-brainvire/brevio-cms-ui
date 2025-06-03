import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';
export const UPDATE_MANAGE_RULES_SET = gql`
	${META_FRAGMENT}
	mutation UpdateSetRule($updateSetRuleId: UUID, $ruleName: String, $description: String, $priority: priority, $onAction: on_action, $status: Int) {
		updateSetRule(uuid: $updateSetRuleId, rule_name: $ruleName, description: $description, priority: $priority, on_action: $onAction, status: $status) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const UPDATE_MANAGE_RULES_SETS_STATUS = gql`
	${META_FRAGMENT}
	mutation UpdateRuleStatus($updateRuleStatusId: UUID, $status: Int) {
		updateRuleStatus(uuid: $updateRuleStatusId, status: $status) {
			data {
				id
				uuid
				rule_name
				description
				priority
				on_action
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
export const DELETE_MANAGE_RULES_SETS = gql`
	${META_FRAGMENT}
	mutation DeleteSetRule($deleteSetRuleId: UUID!) {
		deleteSetRule(uuid: $deleteSetRuleId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const CREATE_RULES_SET = gql`
	${META_FRAGMENT}
	mutation CreateSetRule($ruleName: String!, $description: String!, $priority: priority!, $onAction: on_action!) {
		createSetRule(rule_name: $ruleName, description: $description, priority: $priority, on_action: $onAction) {
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GROUP_DELETE_RULES_SETS = gql`
	${META_FRAGMENT}
	mutation GroupDeleteSetRules($groupDeleteSetRulesId: [UUID]) {
		groupDeleteSetRules(uuid: $groupDeleteSetRulesId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
