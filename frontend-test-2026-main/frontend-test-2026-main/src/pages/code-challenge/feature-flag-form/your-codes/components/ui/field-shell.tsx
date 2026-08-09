import { CircleAlert } from 'lucide-react'
import { cn } from '#/lib/utils'

const CONTROL_ACCENT_CLASSES = [
  '[&_input:hover]:border-indigo-400/60',
  '[&_select:hover]:border-indigo-400/60',
  '[&_textarea:hover]:border-indigo-400/60',
  '[&_input:focus-visible]:border-indigo-500 [&_input:focus-visible]:ring-2 [&_input:focus-visible]:ring-indigo-500/30',
  '[&_select:focus-visible]:border-indigo-500 [&_select:focus-visible]:ring-2 [&_select:focus-visible]:ring-indigo-500/30',
  '[&_textarea:focus-visible]:border-indigo-500 [&_textarea:focus-visible]:ring-2 [&_textarea:focus-visible]:ring-indigo-500/30',
].join(' ')

const CONTROL_INVALID_CLASSES = [
  '[&_input[aria-invalid=true]]:ring-2',
  '[&_select[aria-invalid=true]]:ring-2',
  '[&_textarea[aria-invalid=true]]:ring-2',
  '[&_input:hover]:border-destructive',
  '[&_select:hover]:border-destructive',
  '[&_textarea:hover]:border-destructive',
  '[&_input:focus-visible]:border-destructive [&_input:focus-visible]:ring-2 [&_input:focus-visible]:ring-destructive/40',
  '[&_select:focus-visible]:border-destructive [&_select:focus-visible]:ring-2 [&_select:focus-visible]:ring-destructive/40',
  '[&_textarea:focus-visible]:border-destructive [&_textarea:focus-visible]:ring-2 [&_textarea:focus-visible]:ring-destructive/40',
].join(' ')

interface FieldShellProps {
  label: string
  htmlFor: string
  hint?: string
  errors: Array<string>
  className?: string
  children: React.ReactNode
}

export function FieldShell({
  label,
  htmlFor,
  hint,
  errors,
  className,
  children,
}: FieldShellProps) {
  const invalid = errors.length > 0

  return (
    <div
      className={cn(
        'min-w-0 space-y-1.5',
        invalid ? CONTROL_INVALID_CLASSES : CONTROL_ACCENT_CLASSES,
        className,
      )}
    >
      <label
        htmlFor={htmlFor}
        className={cn(
          'block text-[11px] font-semibold tracking-wider uppercase transition-colors',
          invalid ? 'text-destructive' : 'text-muted-foreground',
        )}
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground/90">{hint}</p>}
      {errors.map((error) => (
        <p
          key={error}
          className="flex items-start gap-1.5 text-xs font-medium text-destructive"
        >
          <CircleAlert aria-hidden className="mt-px size-3.5 shrink-0" />
          {error}
        </p>
      ))}
    </div>
  )
}
