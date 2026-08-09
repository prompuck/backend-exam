import { ArrowDown, ArrowUp, CircleAlert, Trash2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { RULE_LOGIC_LABELS } from '../constants/feature-flag'
import { RULE_LOGICS } from '../types/feature-flag'
import { createConditionDraft } from '../utils/feature-flag'
import { toErrorMessages, visibleFieldErrors } from '../utils/form-error'
import { ConditionRow } from './condition-row'
import { AddButton } from './ui/add-button'
import { FieldShell } from './ui/field-shell'
import { Select } from './ui/select'
import { StatusPill } from './ui/status-pill'
import { VariationSelect } from './variation-select'
import type { RuleLogic } from '../types/feature-flag'
import type { FeatureFlagFormApi } from '../hooks/use-feature-flag-form'

interface TargetingRuleProps {
  form: FeatureFlagFormApi
  index: number
  total: number
  onRemove: () => void
  onMove: (direction: -1 | 1) => void
}

export function TargetingRule({
  form,
  index,
  total,
  onRemove,
  onMove,
}: TargetingRuleProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-border/70 bg-card/60 transition-colors hover:border-sky-500/35">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-gradient-to-r from-sky-500/10 via-sky-500/[0.04] to-transparent px-3 py-2">
        <div className="flex items-center gap-2">
          <StatusPill tone="info" className="font-mono">
            #{index + 1}
          </StatusPill>
          <span className="text-xs text-muted-foreground">
            {index === 0 ? 'Evaluated first' : `Evaluated after rule #${index}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
            disabled={index === 0}
            aria-label={`Move rule ${index + 1} up`}
            onClick={() => onMove(-1)}
          >
            <ArrowUp />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
            disabled={index === total - 1}
            aria-label={`Move rule ${index + 1} down`}
            onClick={() => onMove(1)}
          >
            <ArrowDown />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            aria-label={`Remove rule ${index + 1}`}
            onClick={onRemove}
            className="hover:bg-destructive/20 focus-visible:ring-2 focus-visible:ring-destructive/40"
          >
            <Trash2 />
          </Button>
        </div>
      </header>

      <div className="space-y-4 p-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <form.Field name={`targeting[${index}].name`}>
            {(field) => {
              const errors = visibleFieldErrors(field.state.meta)
              return (
                <FieldShell
                  label="Rule name"
                  htmlFor={`rule-${index}-name`}
                  errors={errors}
                  hint="Optional"
                >
                  <Input
                    id={`rule-${index}-name`}
                    placeholder="Beta testers in Thailand"
                    value={field.state.value}
                    aria-invalid={errors.length > 0}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </FieldShell>
              )
            }}
          </form.Field>

          <form.Field name={`targeting[${index}].logic`}>
            {(field) => (
              <FieldShell
                label="Logic"
                htmlFor={`rule-${index}-logic`}
                errors={[]}
              >
                <Select
                  id={`rule-${index}-logic`}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value as RuleLogic)
                  }
                >
                  {RULE_LOGICS.map((logic) => (
                    <option key={logic} value={logic}>
                      {RULE_LOGIC_LABELS[logic]}
                    </option>
                  ))}
                </Select>
              </FieldShell>
            )}
          </form.Field>

          <form.Field name={`targeting[${index}].variation`}>
            {(field) => {
              const errors = visibleFieldErrors(field.state.meta)
              return (
                <FieldShell
                  label="Serve variation"
                  htmlFor={`rule-${index}-variation`}
                  errors={errors}
                >
                  <VariationSelect
                    id={`rule-${index}-variation`}
                    form={form}
                    value={field.state.value}
                    required
                    invalid={errors.length > 0}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                  />
                </FieldShell>
              )
            }}
          </form.Field>
        </div>

        <form.Field name={`targeting[${index}].conditions`} mode="array">
          {(conditionsField) => {
            const conditions = conditionsField.state.value
            const errors = toErrorMessages(conditionsField.state.meta.errors)

            return (
              <div className="space-y-3 rounded-xl border border-border/60 bg-muted/30 p-3 dark:bg-background/40">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Conditions
                    <StatusPill
                      tone={conditions.length > 0 ? 'info' : 'neutral'}
                      className="min-w-6 justify-center font-mono tabular-nums"
                    >
                      {conditions.length}
                    </StatusPill>
                  </h3>
                  <AddButton
                    size="xs"
                    onClick={() =>
                      conditionsField.pushValue(createConditionDraft())
                    }
                  >
                    Add condition
                  </AddButton>
                </div>

                {conditions.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-sky-500/30 bg-sky-500/[0.04] px-3 py-4 text-center text-xs text-muted-foreground">
                    This rule has no conditions yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {conditions.map((condition, conditionIndex) => (
                      <ConditionRow
                        key={condition.id}
                        form={form}
                        ruleIndex={index}
                        conditionIndex={conditionIndex}
                        canRemove={conditions.length > 1}
                        onRemove={() =>
                          conditionsField.removeValue(conditionIndex)
                        }
                      />
                    ))}
                  </div>
                )}

                {errors.map((error) => (
                  <p
                    key={error}
                    className="flex items-start gap-1.5 text-xs font-medium text-destructive"
                  >
                    <CircleAlert
                      aria-hidden
                      className="mt-px size-3.5 shrink-0"
                    />
                    {error}
                  </p>
                ))}
              </div>
            )
          }}
        </form.Field>
      </div>
    </article>
  )
}
