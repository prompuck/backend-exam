import { CircleAlert, Layers } from 'lucide-react'
import { createVariationDraft } from '../utils/feature-flag'
import { toErrorMessages } from '../utils/form-error'
import { AddButton } from './ui/add-button'
import { CountBadge, Panel } from './ui/panel'
import { VariationItem } from './variation-item'
import type { FeatureFlagFormApi } from '../hooks/use-feature-flag-form'

export function VariationList({ form }: { form: FeatureFlagFormApi }) {
  return (
    <form.Field name="variations" mode="array">
      {(field) => {
        const variations = field.state.value
        const errors = toErrorMessages(field.state.meta.errors)

        return (
          <Panel
            title="Variations"
            description="The possible values this flag can return."
            icon={<Layers />}
            accent="violet"
            badge={<CountBadge count={variations.length} />}
            actions={
              <AddButton
                onClick={() => field.pushValue(createVariationDraft())}
              >
                Add variation
              </AddButton>
            }
          >
            {variations.length === 0 ? (
              <p className="rounded-xl border border-dashed border-violet-500/30 bg-violet-500/[0.04] px-4 py-6 text-center text-sm text-muted-foreground">
                No variations yet. A flag needs at least one.
              </p>
            ) : (
              <div className="space-y-3">
                {variations.map((variation, index) => (
                  <VariationItem
                    key={variation.id}
                    form={form}
                    index={index}
                    onRemove={() => field.removeValue(index)}
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
