import type {
  FeatureFlagDraft,
  Operator,
  OperatorValueKind,
  RuleLogic,
  VariationType,
} from '../types/feature-flag'

export const FLAG_KEY_PATTERN = /^[a-z0-9]+(?:[-_.][a-z0-9]+)*$/
export const VARIATION_KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

export const MAX_DESCRIPTION_LENGTH = 200
export const MAX_FLAG_KEY_LENGTH = 64
export const MAX_VARIATION_KEY_LENGTH = 32
export const MAX_ATTRIBUTE_LENGTH = 64
export const MAX_RULE_NAME_LENGTH = 60

export const OPERATOR_LABELS: Record<Operator, string> = {
  equals: 'equals',
  notEquals: 'does not equal',
  contains: 'contains',
  notContains: 'does not contain',
  startsWith: 'starts with',
  endsWith: 'ends with',
  greaterThan: 'greater than',
  lessThan: 'less than',
  in: 'is one of',
  notIn: 'is not one of',
  isTrue: 'is true',
  isFalse: 'is false',
}

export const OPERATOR_VALUE_KINDS: Record<Operator, OperatorValueKind> = {
  equals: 'text',
  notEquals: 'text',
  contains: 'text',
  notContains: 'text',
  startsWith: 'text',
  endsWith: 'text',
  greaterThan: 'number',
  lessThan: 'number',
  in: 'list',
  notIn: 'list',
  isTrue: 'none',
  isFalse: 'none',
}

export const VARIATION_TYPE_LABELS: Record<VariationType, string> = {
  boolean: 'Boolean',
  string: 'String',
  number: 'Number',
}

export const RULE_LOGIC_LABELS: Record<RuleLogic, string> = {
  and: 'Match ALL conditions',
  or: 'Match ANY condition',
}

export const ATTRIBUTE_SUGGESTIONS = [
  'country',
  'email',
  'userId',
  'plan',
  'role',
  'group',
  'appVersion',
  'deviceType',
]

export const INITIAL_FLAG_DRAFT: FeatureFlagDraft = {
  key: 'new-checkout',
  description: 'Enable new checkout flow',
  enabled: true,
  variations: [
    { id: 'variation-on', key: 'on', type: 'boolean', value: 'true' },
    { id: 'variation-off', key: 'off', type: 'boolean', value: 'false' },
  ],
  targeting: [],
  defaultVariation: 'off',
}
