import { ChevronDown } from 'lucide-react'
import { cn } from '#/lib/utils'

export function Select({
  className,
  ...props
}: React.ComponentProps<'select'>) {
  return (
    <div className="relative w-full min-w-0">
      <select
        className={cn(
          'h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent pr-7 pl-2.5 text-sm outline-none transition-colors',
          'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25',
          'dark:bg-input/30',
          className,
        )}
        {...props}
      />
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}
