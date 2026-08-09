import { OPERATOR_VALUE_KINDS } from '../constants/feature-flag'
import type {
  ConditionDraft,
  ConditionValue,
  FeatureFlagDraft,
  SerializedCondition,
  SerializedFeatureFlag,
  SerializedTargetingRule,
  TargetingRuleDraft,
  VariationDraft,
  VariationType,
  VariationValue,
} from '../types/feature-flag'

let draftIdCounter = 0

function createDraftId(prefix: string): string {
  draftIdCounter += 1
  return `${prefix}-${draftIdCounter}`
}

export function defaultValueForVariationType(type: VariationType): string {
  switch (type) {
    case 'boolean':
      return 'true'
    case 'number':
      return '0'
    case 'string':
      return ''
  }
}

export function createVariationDraft(): VariationDraft {
  return {
    id: createDraftId('variation'),
    key: '',
    type: 'boolean',
    value: 'true',
  }
}

export function createConditionDraft(): ConditionDraft {
  return {
    id: createDraftId('condition'),
    attribute: '',
    operator: 'equals',
    value: '',
  }
}

export function createTargetingRuleDraft(
  variation: string,
): TargetingRuleDraft {
  return {
    id: createDraftId('rule'),
    name: '',
    logic: 'and',
    conditions: [createConditionDraft()],
    variation,
  }
}

export function splitListValue(raw: string): Array<string> {
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function toVariationValue(variation: VariationDraft): VariationValue {
  switch (variation.type) {
    case 'boolean':
      return variation.value === 'true'
    case 'number': {
      const parsed = Number(variation.value)
      return Number.isFinite(parsed) ? parsed : variation.value
    }
    case 'string':
      return variation.value
  }
}

export function toConditionValue(
  condition: ConditionDraft,
): ConditionValue | undefined {
  switch (OPERATOR_VALUE_KINDS[condition.operator]) {
    case 'none':
      return undefined
    case 'number': {
      const parsed = Number(condition.value)
      return Number.isFinite(parsed) && condition.value.trim() !== ''
        ? parsed
        : condition.value
    }
    case 'list':
      return splitListValue(condition.value)
    case 'text':
      return condition.value
  }
}

export function listVariationKeys(draft: FeatureFlagDraft): Array<string> {
  const keys: Array<string> = []
  for (const variation of draft.variations) {
    const key = variation.key.trim()
    if (key && !keys.includes(key)) keys.push(key)
  }
  return keys
}

function serializeCondition(condition: ConditionDraft): SerializedCondition {
  const value = toConditionValue(condition)
  const base = {
    attribute: condition.attribute.trim(),
    operator: condition.operator,
  }
  return value === undefined ? base : { ...base, value }
}

function serializeRule(rule: TargetingRuleDraft): SerializedTargetingRule {
  const name = rule.name.trim()
  return {
    ...(name ? { name } : {}),
    logic: rule.logic,
    conditions: rule.conditions.map(serializeCondition),
    variation: rule.variation,
  }
}

export function serializeFeatureFlag(
  draft: FeatureFlagDraft,
): SerializedFeatureFlag {
  const variations: Record<string, VariationValue> = {}
  for (const variation of draft.variations) {
    const key = variation.key.trim()
    if (key) variations[key] = toVariationValue(variation)
  }

  const description = draft.description.trim()

  return {
    key: draft.key.trim(),
    ...(description ? { description } : {}),
    enabled: draft.enabled,
    variations,
    targeting: draft.targeting.map(serializeRule),
    defaultVariation: draft.defaultVariation,
  }
}
