import { Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { VARIATION_TYPES } from '../types/feature-flag'
import { VARIATION_TYPE_LABELS } from '../constants/feature-flag'
import { defaultValueForVariationType } from '../utils/feature-flag'
import { visibleFieldErrors } from '../utils/form-error'
import { FieldShell } from './ui/field-shell'
import { Select } from './ui/select'
import type { VariationType } from '../types/feature-flag'
import type { FeatureFlagFormApi } from '../hooks/use-feature-flag-form'

interface VariationItemProps {
  form: FeatureFlagFormApi
  index: number
  onRemove: () => void
}

export function VariationItem({ form, index, onRemove }: VariationItemProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-gradient-to-br from-violet-500/[0.05] via-transparent to-transparent p-3 transition-colors hover:border-violet-500/35">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8.5rem_minmax(0,1fr)_auto]">
        <form.Field name={`variations[${index}].key`}>
          {(field) => {
            const errors = visibleFieldErrors(field.state.meta)
            return (
              <FieldShell
                label={`Key #${index + 1}`}
                htmlFor={`variation-${index}-key`}
                errors={errors}
              >
                <Input
                  id={`variation-${index}-key`}
                  className="font-mono"
                  placeholder="on"
                  value={field.state.value}
                  aria-required
                  aria-invalid={errors.length > 0}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </FieldShell>
            )
          }}
        </form.Field>

        <form.Field name={`variations[${index}].type`}>
          {(typeField) => (
            <>
              <FieldShell
                label="Type"
                htmlFor={`variation-${index}-type`}
                errors={[]}
              >
                <Select
                  id={`variation-${index}-type`}
                  value={typeField.state.value}
                  onBlur={typeField.handleBlur}
                  onChange={(event) => {
                    const nextType = event.target.value as VariationType
                    typeField.handleChange(nextType)
                    form.setFieldValue(
                      `variations[${index}].value`,
                      defaultValueForVariationType(nextType),
                    )
                  }}
                >
                  {VARIATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {VARIATION_TYPE_LABELS[type]}
                    </option>
                  ))}
                </Select>
              </FieldShell>

              <form.Field name={`variations[${index}].value`}>
                {(valueField) => {
                  const errors = visibleFieldErrors(valueField.state.meta)
                  const inputId = `variation-${index}-value`
                  return (
                    <FieldShell label="Value" htmlFor={inputId} errors={errors}>
                      {typeField.state.value === 'boolean' ? (
                        <Select
                          id={inputId}
                          value={valueField.state.value}
                          aria-required
                          onBlur={valueField.handleBlur}
                          onChange={(event) =>
                            valueField.handleChange(event.target.value)
                          }
                        >
                          <option value="true">true</option>
                          <option value="false">false</option>
                        </Select>
                      ) : (
                        <Input
                          id={inputId}
                          className="font-mono"
                          inputMode={
                            typeField.state.value === 'number'
                              ? 'decimal'
                              : 'text'
                          }
                          placeholder={
                            typeField.state.value === 'number' ? '0' : 'value'
                          }
                          value={valueField.state.value}
                          aria-required
                          aria-invalid={errors.length > 0}
                          onBlur={valueField.handleBlur}
                          onChange={(event) =>
                            valueField.handleChange(event.target.value)
                          }
                        />
                      )}
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
            variant="destructive"
            size="icon-sm"
            aria-label={`Remove variation ${index + 1}`}
            onClick={onRemove}
            className="focus-visible:ring-2 focus-visible:ring-destructive/40"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  )
}
