import { useState } from 'react'
import { FeatureFlagForm } from './components/feature-flag-form'
import { JsonPreview } from './components/json-preview'
import { SavedFlagPanel } from './components/saved-flag-panel'
import { useFeatureFlagForm } from './hooks/use-feature-flag-form'
import type { SavedFlag } from './components/saved-flag-panel'
import type { SerializedFeatureFlag } from './types/feature-flag'

function mockSaveFeatureFlag(
  flag: SerializedFeatureFlag,
): Promise<SerializedFeatureFlag> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(flag), 400)
  })
}

export function FeatureFlagEditor() {
  const [saved, setSaved] = useState<SavedFlag | null>(null)

  const form = useFeatureFlagForm({
    onValidSubmit: async (flag) => {
      const persisted = await mockSaveFeatureFlag(flag)
      setSaved({ flag: persisted, savedAt: new Date().toLocaleTimeString() })
    },
    onInvalidSubmit: () => setSaved(null),
  })

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
      <FeatureFlagForm form={form} onReset={() => setSaved(null)} />

      <div className="space-y-4 xl:sticky xl:top-4">
        <JsonPreview form={form} />
        {saved && <SavedFlagPanel saved={saved} />}
      </div>
    </div>
  )
}
