import { X } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  ATTRIBUTE_SUGGESTIONS,
  OPERATOR_LABELS,
  OPERATOR_VALUE_KINDS,
} from '../constants/feature-flag'
import { OPERATORS } from '../types/feature-flag'
import { visibleFieldErrors } from '../utils/form-error'
import { FieldShell } from './ui/field-shell'
import { Select } from './ui/select'
import type { Operator } from '../types/feature-flag'
import type { FeatureFlagFormApi } from '../hooks/use-feature-flag-form'

interface ConditionRowProps {
  form: FeatureFlagFormApi
  ruleIndex: number
  conditionIndex: number
  canRemove: boolean
  onRemove: () => void
}

const VALUE_PLACEHOLDERS: Record<string, string> = {
  text: 'TH',
  number: '10',
  list: 'TH, SG, MY',
}

export function ConditionRow({
  form,
  ruleIndex,
  conditionIndex,
  canRemove,
  onRemove,
}: ConditionRowProps) {
  const fieldPrefix =
    `targeting[${ruleIndex}].conditions[${conditionIndex}]` as const
  const idPrefix = `rule-${ruleIndex}-condition-${conditionIndex}`

  return (
    <div className="grid gap-2 rounded-lg border border-border/60 bg-background/70 p-2.5 transition-colors hover:border-sky-500/30 sm:grid-cols-[minmax(0,1fr)_11rem_minmax(0,1fr)_auto] dark:bg-background/30">
      <form.Field name={`${fieldPrefix}.attribute`}>
        {(field) => {
          const errors = visibleFieldErrors(field.state.meta)
          return (
            <FieldShell
              label="Attribute"
              htmlFor={`${idPrefix}-attribute`}
              errors={errors}
            >
              <Select
                id={`${idPrefix}-attribute`}
                value={field.state.value}
                aria-required
                aria-invalid={errors.length > 0}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              >
                <option value="">Select an attribute…</option>
                {field.state.value !== '' &&
                  !ATTRIBUTE_SUGGESTIONS.includes(field.state.value) && (
                    <option value={field.state.value}>
                      {field.state.value} (unknown)
                    </option>
                  )}
                {ATTRIBUTE_SUGGESTIONS.map((attribute) => (
                  <option key={attribute} value={attribute}>
                    {attribute}
                  </option>
                ))}
              </Select>
            </FieldShell>
          )
        }}
      </form.Field>

      <form.Field name={`${fieldPrefix}.operator`}>
        {(operatorField) => (
          <>
            <FieldShell
              label="Operator"
              htmlFor={`${idPrefix}-operator`}
              errors={[]}
            >
              <Select
                id={`${idPrefix}-operator`}
                value={operatorField.state.value}
                onBlur={operatorField.handleBlur}
                onChange={(event) => {
                  const nextOperator = event.target.value as Operator
                  operatorField.handleChange(nextOperator)
                  if (OPERATOR_VALUE_KINDS[nextOperator] === 'none') {
                    form.setFieldValue(`${fieldPrefix}.value`, '')
                  }
                }}
              >
                {OPERATORS.map((operator) => (
                  <option key={operator} value={operator}>
                    {OPERATOR_LABELS[operator]}
                  </option>
                ))}
              </Select>
            </FieldShell>

            <form.Field name={`${fieldPrefix}.value`}>
              {(valueField) => {
                const valueKind =
                  OPERATOR_VALUE_KINDS[operatorField.state.value]
                const errors = visibleFieldErrors(valueField.state.meta)

                if (valueKind === 'none') {
                  return (
                    <FieldShell
                      label="Value"
                      htmlFor={`${idPrefix}-value`}
                      errors={[]}
                    >
                      <p
                        id={`${idPrefix}-value`}
                        className="flex h-8 items-center rounded-lg border border-dashed border-border px-2.5 text-xs text-muted-foreground"
                      >
                        No value needed
                      </p>
                    </FieldShell>
                  )
                }

                return (
                  <FieldShell
                    label="Value"
                    htmlFor={`${idPrefix}-value`}
                    errors={errors}
                    hint={valueKind === 'list' ? 'Comma separated' : undefined}
                  >
                    <Input
                      id={`${idPrefix}-value`}
                      className="font-mono"
                      inputMode={valueKind === 'number' ? 'decimal' : 'text'}
                      placeholder={VALUE_PLACEHOLDERS[valueKind]}
                      value={valueField.state.value}
                      aria-required
                      aria-invalid={errors.length > 0}
                      onBlur={valueField.handleBlur}
                      onChange={(event) =>
                        valueField.handleChange(event.target.value)
                      }
                    />
                  </FieldShell>
                )
              }}
            </form.Field>
          </>
        )}
      </form.Field>

      <div className="flex items-end justify-end pb-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={!canRemove}
          aria-label={`Remove condition ${conditionIndex + 1}`}
          onClick={onRemove}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:border-destructive/40 focus-visible:ring-2 focus-visible:ring-destructive/30"
        >
          <X />
        </Button>
      </div>
    </div>
  )
}
