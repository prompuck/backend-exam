import { CircleAlert, Target } from 'lucide-react'
import {
  createTargetingRuleDraft,
  listVariationKeys,
} from '../utils/feature-flag'
import { toErrorMessages } from '../utils/form-error'
import { AddButton } from './ui/add-button'
import { CountBadge, Panel } from './ui/panel'
import { TargetingRule } from './targeting-rule'
import type { FeatureFlagFormApi } from '../hooks/use-feature-flag-form'

export function TargetingRules({ form }: { form: FeatureFlagFormApi }) {
  return (
    <form.Field name="targeting" mode="array">
      {(field) => {
        const rules = field.state.value
        const errors = toErrorMessages(field.state.meta.errors)

        return (
          <Panel
            title="Targeting rules"
            description="Rules are evaluated top to bottom — the first match wins."
            icon={<Target />}
            accent="sky"
            badge={<CountBadge count={rules.length} />}
            actions={
              <AddButton
                onClick={() => {
                  const [firstVariation = ''] = listVariationKeys(
                    form.state.values,
                  )
                  field.pushValue(createTargetingRuleDraft(firstVariation))
                }}
              >
                Add rule
              </AddButton>
            }
          >
            {rules.length === 0 ? (
              <p className="rounded-xl border border-dashed border-sky-500/30 bg-sky-500/[0.04] px-4 py-6 text-center text-sm text-muted-foreground">
                No targeting rules. Every user gets the default variation.
              </p>
            ) : (
              <div className="space-y-3">
                {rules.map((rule, index) => (
                  <TargetingRule
                    key={rule.id}
                    form={form}
                    index={index}
                    total={rules.length}
                    onRemove={() => field.removeValue(index)}
                    onMove={(direction) =>
                      field.moveValue(index, index + direction)
                    }
                  />
                ))}
              </div>
            )}

            {errors.map((error) => (
              <p
                key={error}
                className="mt-3 flex items-start gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-2.5 py-2 text-xs font-medium text-destructive"
              >
                <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
                {error}
              </p>
            ))}
          </Panel>
        )
      }}
    </form.Field>
  )
}
