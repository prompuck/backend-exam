import { CheckCircle2 } from 'lucide-react'
import { StatusPill } from './ui/status-pill'
import type { SerializedFeatureFlag } from '../types/feature-flag'

export interface SavedFlag {
  flag: SerializedFeatureFlag
  savedAt: string
}

export function SavedFlagPanel({ saved }: { saved: SavedFlag }) {
  return (
    <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 shadow-sm dark:border-emerald-400/30">
      <div className="flex flex-wrap items-center gap-2 text-emerald-700 dark:text-emerald-300">
        <span
          aria-hidden
          className="grid size-7 shrink-0 place-items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 dark:border-emerald-400/30"
        >
          <CheckCircle2 className="size-4" />
        </span>
        <p className="text-sm font-semibold">
          Saved <span className="font-mono">{saved.flag.key}</span>
        </p>
        <StatusPill tone="success" className="ml-auto font-mono">
          {saved.savedAt}
        </StatusPill>
      </div>
      <pre className="mt-3 max-h-56 overflow-auto rounded-xl border border-emerald-500/20 bg-background/80 p-3 font-mono text-xs leading-relaxed dark:border-emerald-400/20 dark:bg-background/60">
        {JSON.stringify(saved.flag, null, 2)}
      </pre>
    </section>
  )
}
