import { useForm } from '@tanstack/react-form'
import { INITIAL_FLAG_DRAFT } from '../constants/feature-flag'
import { featureFlagSchema } from '../schemas/feature-flag.schema'
import { serializeFeatureFlag } from '../utils/feature-flag'
import type {
  FeatureFlagDraft,
  SerializedFeatureFlag,
} from '../types/feature-flag'

interface UseFeatureFlagFormOptions {
  onValidSubmit: (flag: SerializedFeatureFlag) => Promise<void> | void
  onInvalidSubmit: () => void
}

export function useFeatureFlagForm({
  onValidSubmit,
  onInvalidSubmit,
}: UseFeatureFlagFormOptions) {
  return useForm({
    defaultValues: INITIAL_FLAG_DRAFT satisfies FeatureFlagDraft,
    validators: {
      onMount: featureFlagSchema,
      onChange: featureFlagSchema,
      onSubmit: featureFlagSchema,
    },
    onSubmit: async ({ value }) => {
      await onValidSubmit(serializeFeatureFlag(value))
    },
    onSubmitInvalid: onInvalidSubmit,
  })
}

export type FeatureFlagFormApi = ReturnType<typeof useFeatureFlagForm>
