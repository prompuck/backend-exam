import { listVariationKeys } from '../utils/feature-flag'
import { Select } from './ui/select'
import type { FeatureFlagFormApi } from '../hooks/use-feature-flag-form'

interface VariationSelectProps {
  id: string
  form: FeatureFlagFormApi
  value: string
  invalid: boolean
  required?: boolean
  onValueChange: (value: string) => void
  onBlur: () => void
}

export function VariationSelect({
  id,
  form,
  value,
  invalid,
  required = false,
  onValueChange,
  onBlur,
}: VariationSelectProps) {
  return (
    <form.Subscribe selector={(state) => listVariationKeys(state.values)}>
      {(variationKeys) => (
        <Select
          id={id}
          value={value}
          aria-required={required}
          aria-invalid={invalid}
          onBlur={onBlur}
          onChange={(event) => onValueChange(event.target.value)}
        >
          <option value="">Select a variation…</option>
          {value !== '' && !variationKeys.includes(value) && (
            <option value={value}>{value} (unknown)</option>
          )}
          {variationKeys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </Select>
      )}
    </form.Subscribe>
  )
}
