import { z } from 'zod'
import {
  FLAG_KEY_PATTERN,
  MAX_ATTRIBUTE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_FLAG_KEY_LENGTH,
  MAX_RULE_NAME_LENGTH,
  MAX_VARIATION_KEY_LENGTH,
  OPERATOR_VALUE_KINDS,
  VARIATION_KEY_PATTERN,
} from '../constants/feature-flag'
import { splitListValue } from '../utils/feature-flag'
import { OPERATORS, RULE_LOGICS, VARIATION_TYPES } from '../types/feature-flag'

const variationSchema = z
  .object({
    id: z.string(),
    key: z
      .string()
      .trim()
      .min(1, 'Variation key is required')
      .max(
        MAX_VARIATION_KEY_LENGTH,
        `Keep the key under ${MAX_VARIATION_KEY_LENGTH} characters`,
      )
      .regex(
        VARIATION_KEY_PATTERN,
        'Use letters, numbers, "-" or "_" (e.g. on, off, variant_a)',
      ),
    type: z.enum(VARIATION_TYPES),
    value: z.string(),
  })
  .superRefine((variation, ctx) => {
    const value = variation.value.trim()
    if (
      variation.type === 'number' &&
      (value === '' || !Number.isFinite(Number(value)))
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Value must be a valid number',
      })
    }
    if (variation.type === 'string' && value === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Value is required',
      })
    }
  })

const variationsSchema = z
  .array(variationSchema)
  .min(1, 'A flag needs at least one variation')
  .superRefine((variations, ctx) => {
    const firstIndexByKey = new Map<string, number>()
    variations.forEach((variation, index) => {
      const key = variation.key.trim()
      if (!key) return
      if (firstIndexByKey.has(key)) {
        ctx.addIssue({
          code: 'custom',
          path: [index, 'key'],
          message: `Duplicate key "${key}" — variation keys must be unique`,
        })
        return
      }
      firstIndexByKey.set(key, index)
    })
  })

const conditionSchema = z
  .object({
    id: z.string(),
    attribute: z
      .string()
      .trim()
      .min(1, 'Attribute is required')
      .max(
        MAX_ATTRIBUTE_LENGTH,
        `Keep the attribute under ${MAX_ATTRIBUTE_LENGTH} characters`,
      ),
    operator: z.enum(OPERATORS),
    value: z.string(),
  })
  .superRefine((condition, ctx) => {
    const kind = OPERATOR_VALUE_KINDS[condition.operator]
    if (kind === 'none') return

    if (condition.value.trim() === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'This operator requires a value',
      })
      return
    }

    if (kind === 'number' && !Number.isFinite(Number(condition.value))) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Value must be a number',
      })
    }

    if (kind === 'list' && splitListValue(condition.value).length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Provide at least one value, separated by commas',
      })
    }
  })

const targetingRuleSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .trim()
    .max(
      MAX_RULE_NAME_LENGTH,
      `Keep the rule name under ${MAX_RULE_NAME_LENGTH} characters`,
    ),
  logic: z.enum(RULE_LOGICS),
  conditions: z
    .array(conditionSchema)
    .min(1, 'A rule needs at least one condition'),
  variation: z.string().min(1, 'Choose the variation this rule serves'),
})

export const featureFlagSchema = z
  .object({
    key: z
      .string()
      .trim()
      .min(1, 'Flag key is required')
      .max(
        MAX_FLAG_KEY_LENGTH,
        `Keep the key under ${MAX_FLAG_KEY_LENGTH} characters`,
      )
      .regex(
        FLAG_KEY_PATTERN,
        'Use lowercase letters, numbers and - _ . as separators (e.g. new-checkout)',
      ),
    description: z
      .string()
      .trim()
      .max(
        MAX_DESCRIPTION_LENGTH,
        `Keep the description under ${MAX_DESCRIPTION_LENGTH} characters`,
      ),
    enabled: z.boolean(),
    variations: variationsSchema,
    targeting: z.array(targetingRuleSchema),
    defaultVariation: z
      .string()
      .min(1, 'Choose the variation served when no rule matches'),
  })
  .superRefine((flag, ctx) => {
    const knownKeys = new Set(
      flag.variations.map((variation) => variation.key.trim()).filter(Boolean),
    )

    if (flag.defaultVariation && !knownKeys.has(flag.defaultVariation)) {
      ctx.addIssue({
        code: 'custom',
        path: ['defaultVariation'],
        message: `"${flag.defaultVariation}" is not one of the defined variations`,
      })
    }

    flag.targeting.forEach((rule, index) => {
      if (rule.variation && !knownKeys.has(rule.variation)) {
        ctx.addIssue({
          code: 'custom',
          path: ['targeting', index, 'variation'],
          message: `"${rule.variation}" is not one of the defined variations`,
        })
      }
    })
  })

export type FeatureFlagSchemaOutput = z.output<typeof featureFlagSchema>
