import { cn } from '#/lib/utils'

export type StatusTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral'

const TONE_CLASSES: Record<StatusTone, string> = {
  success:
    'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300',
  info: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-300',
  warning:
    'border-amber-500/30 bg-amber-500/12 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300',
  danger:
    'border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/15',
  neutral:
    'border-zinc-300 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
}

const DOT_CLASSES: Record<StatusTone, string> = {
  success: 'bg-emerald-500 shadow-[0_0_0_2px] shadow-emerald-500/20',
  info: 'bg-indigo-500 shadow-[0_0_0_2px] shadow-indigo-500/20',
  warning: 'bg-amber-500 shadow-[0_0_0_2px] shadow-amber-500/20',
  danger: 'bg-destructive shadow-[0_0_0_2px] shadow-destructive/20',
  neutral: 'bg-zinc-400 dark:bg-zinc-500',
}

interface StatusPillProps {
  tone?: StatusTone
  dot?: boolean
  className?: string
  children: React.ReactNode
}

export function StatusPill({
  tone = 'neutral',
  dot = false,
  className,
  children,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] leading-none font-medium',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {dot && (
        <span className={cn('size-1.5 rounded-full', DOT_CLASSES[tone])} />
      )}
      {children}
    </span>
  )
}
