import { RotateCcw, Save } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { FlagDetailsSection } from './flag-details-section'
import { StatusPill } from './ui/status-pill'
import { TargetingRules } from './targeting-rules'
import { ValidationSummary } from './validation-summary'
import { VariationList } from './variation-list'
import type { FeatureFlagFormApi } from '../hooks/use-feature-flag-form'

interface FeatureFlagFormProps {
  form: FeatureFlagFormApi
  onReset: () => void
}

export function FeatureFlagForm({ form, onReset }: FeatureFlagFormProps) {
  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FlagDetailsSection form={form} />
      <VariationList form={form} />
      <TargetingRules form={form} />
      <ValidationSummary form={form} />

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          isDirty: state.isDirty,
        })}
      >
        {({ isSubmitting, isDirty }) => (
          <div className="flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-border/80 bg-gradient-to-r from-indigo-500/[0.07] via-card to-card px-4 py-3 shadow-sm">
            <div className="mr-auto">
              <StatusPill tone={isDirty ? 'warning' : 'neutral'} dot>
                {isDirty ? 'Unsaved changes' : 'No changes'}
              </StatusPill>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="hover:border-indigo-400/50 hover:text-indigo-700 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
              onClick={() => {
                form.reset()
                onReset()
              }}
            >
              <RotateCcw />
              Reset
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-600/25 hover:from-indigo-400 hover:to-indigo-500 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/40 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-400 dark:hover:to-indigo-500"
            >
              <Save />
              {isSubmitting ? 'Saving…' : 'Save flag'}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}
