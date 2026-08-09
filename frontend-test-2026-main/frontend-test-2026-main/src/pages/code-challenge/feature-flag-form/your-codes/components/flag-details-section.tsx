import { Flag } from 'lucide-react'
import { Input } from '#/components/ui/input'
import { MAX_DESCRIPTION_LENGTH } from '../constants/feature-flag'
import { visibleFieldErrors } from '../utils/form-error'
import { FieldShell } from './ui/field-shell'
import { Panel } from './ui/panel'
import { StatusPill } from './ui/status-pill'
import { Textarea } from './ui/textarea'
import { ToggleSwitch } from './ui/toggle-switch'
import { VariationSelect } from './variation-select'
import type { FeatureFlagFormApi } from '../hooks/use-feature-flag-form'

export function FlagDetailsSection({ form }: { form: FeatureFlagFormApi }) {
  return (
    <Panel
      title="Flag details"
      description="Identity and default behaviour of this feature flag."
      icon={<Flag />}
      accent="indigo"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="key">
          {(field) => {
            const errors = visibleFieldErrors(field.state.meta)
            return (
              <FieldShell
                label="Flag key"
                htmlFor="flag-key"
                errors={errors}
                hint="Unique identifier used by the SDK."
              >
                <Input
                  id="flag-key"
                  className="font-mono"
                  placeholder="new-checkout"
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

        <form.Field name="enabled">
          {(field) => (
            <FieldShell label="Status" htmlFor="flag-enabled" errors={[]}>
              <div className="flex h-8 items-center gap-3">
                <ToggleSwitch
                  id="flag-enabled"
                  label="Flag enabled"
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onCheckedChange={field.handleChange}
                />
                <StatusPill
                  tone={field.state.value ? 'success' : 'neutral'}
                  dot
                >
                  {field.state.value ? 'Enabled' : 'Disabled'}
                </StatusPill>
              </div>
            </FieldShell>
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => {
            const errors = visibleFieldErrors(field.state.meta)
            return (
              <FieldShell
                label="Description"
                htmlFor="flag-description"
                errors={errors}
                hint={`Optional · ${field.state.value.length}/${MAX_DESCRIPTION_LENGTH}`}
                className="md:col-span-2"
              >
                <Textarea
                  id="flag-description"
                  rows={2}
                  placeholder="Enable new checkout flow"
                  value={field.state.value}
                  aria-invalid={errors.length > 0}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </FieldShell>
            )
          }}
        </form.Field>

        <form.Field name="defaultVariation">
          {(field) => {
            const errors = visibleFieldErrors(field.state.meta)
            return (
              <FieldShell
                label="Default variation"
                htmlFor="flag-default-variation"
                errors={errors}
                hint="Served when no targeting rule matches."
              >
                <VariationSelect
                  id="flag-default-variation"
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
    </Panel>
  )
}
