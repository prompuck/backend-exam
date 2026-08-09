import { cn } from '#/lib/utils'

interface ToggleSwitchProps {
  id?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onBlur?: () => void
  label: string
}

export function ToggleSwitch({
  id,
  checked,
  onCheckedChange,
  onBlur,
  label,
}: ToggleSwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onBlur={onBlur}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'inline-flex h-6 w-11 shrink-0 items-center rounded-full border bg-gradient-to-b transition-all outline-none focus-visible:ring-2',
        checked
          ? 'border-emerald-600/70 from-emerald-400 to-emerald-600 shadow-sm shadow-emerald-600/25 hover:brightness-110 focus-visible:ring-emerald-500/40 dark:border-emerald-400/70 dark:from-emerald-400 dark:to-emerald-500'
          : 'border-zinc-300 from-zinc-200 to-zinc-300 hover:brightness-95 focus-visible:ring-zinc-400/40 dark:border-zinc-600 dark:from-zinc-600 dark:to-zinc-700 dark:hover:brightness-110',
      )}
    >
      <span
        className={cn(
          'size-4 rounded-full bg-white shadow-md ring-1 ring-black/5 transition-transform duration-200 ease-out',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}
