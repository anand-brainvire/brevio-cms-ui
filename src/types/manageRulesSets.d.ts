export type PaginationParamsRulesSets = {
  limit: number;
  page: number;
  ruleName: string;
  status: number | null;
  sortOrder: string;
  sortBy: string;
};
export type FilterDataArrRulesProps = {
  RulesStatus: string;
  ruleName: string;
};
export type RulesSetsProps = {
  onSearchManageRulesSets: (values: FilterDataArrRulesProps) => void;
  clearSelectionRuleSets:()=>void
};
export type CreateRulesSet = {
  ruleName: string;
  description: string;
  priority: string;
  onAction: string;
};
