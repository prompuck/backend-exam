export const VARIATION_TYPES = ['boolean', 'string', 'number'] as const
export type VariationType = (typeof VARIATION_TYPES)[number]

export const RULE_LOGICS = ['and', 'or'] as const
export type RuleLogic = (typeof RULE_LOGICS)[number]

export const OPERATORS = [
  'equals',
  'notEquals',
  'contains',
  'notContains',
  'startsWith',
  'endsWith',
  'greaterThan',
  'lessThan',
  'in',
  'notIn',
  'isTrue',
  'isFalse',
] as const
export type Operator = (typeof OPERATORS)[number]

export type OperatorValueKind = 'none' | 'text' | 'number' | 'list'

export interface VariationDraft {
  id: string
  key: string
  type: VariationType
  value: string
}

export interface ConditionDraft {
  id: string
  attribute: string
  operator: Operator
  value: string
}

export interface TargetingRuleDraft {
  id: string
  name: string
  logic: RuleLogic
  conditions: Array<ConditionDraft>
  variation: string
}

export interface FeatureFlagDraft {
  key: string
  description: string
  enabled: boolean
  variations: Array<VariationDraft>
  targeting: Array<TargetingRuleDraft>
  defaultVariation: string
}

export type VariationValue = boolean | number | string
export type ConditionValue = string | number | Array<string>

export interface SerializedCondition {
  attribute: string
  operator: Operator
  value?: ConditionValue
}

export interface SerializedTargetingRule {
  name?: string
  logic: RuleLogic
  conditions: Array<SerializedCondition>
  variation: string
}

export interface SerializedFeatureFlag {
  key: string
  description?: string
  enabled: boolean
  variations: Record<string, VariationValue>
  targeting: Array<SerializedTargetingRule>
  defaultVariation: string
}
