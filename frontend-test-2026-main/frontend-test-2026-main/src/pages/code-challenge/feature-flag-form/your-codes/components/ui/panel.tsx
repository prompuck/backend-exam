import { cn } from '#/lib/utils'
import { StatusPill } from './status-pill'

export type PanelAccent = 'indigo' | 'violet' | 'sky'

const ACCENT_CLASSES: Record<PanelAccent, { wash: string; chip: string }> = {
  indigo: {
    wash: 'from-indigo-500/10 via-indigo-500/[0.03]',
    chip: 'border-indigo-500/25 bg-indigo-500/10 text-indigo-600 dark:border-indigo-400/25 dark:bg-indigo-400/10 dark:text-indigo-300',
  },
  violet: {
    wash: 'from-violet-500/10 via-violet-500/[0.03]',
    chip: 'border-violet-500/25 bg-violet-500/10 text-violet-600 dark:border-violet-400/25 dark:bg-violet-400/10 dark:text-violet-300',
  },
  sky: {
    wash: 'from-sky-500/10 via-sky-500/[0.03]',
    chip: 'border-sky-500/25 bg-sky-500/10 text-sky-600 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300',
  },
}

interface PanelProps {
  title: string
  description?: string
  icon?: React.ReactNode
  accent?: PanelAccent
  badge?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function Panel({
  title,
  description,
  icon,
  accent = 'indigo',
  badge,
  actions,
  className,
  children,
}: PanelProps) {
  const tone = ACCENT_CLASSES[accent]

  return (
    <section
      className={cn(
        'overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <header
        className={cn(
          'flex flex-wrap items-start justify-between gap-3 border-b border-border/70 bg-gradient-to-r to-transparent px-4 py-3.5',
          tone.wash,
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          {icon && (
            <span
              aria-hidden
              className={cn(
                'mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border [&_svg]:size-4',
                tone.chip,
              )}
            >
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
              {badge}
            </div>
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

export function CountBadge({ count }: { count: number }) {
  return (
    <StatusPill
      tone={count > 0 ? 'info' : 'neutral'}
      className="min-w-6 justify-center font-mono tabular-nums"
    >
      {count}
    </StatusPill>
  )
}
