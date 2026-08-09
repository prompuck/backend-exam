import { Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

interface AddButtonProps {
  size?: 'xs' | 'sm'
  className?: string
  onClick: () => void
  children: React.ReactNode
}

export function AddButton({
  size = 'sm',
  className,
  onClick,
  children,
}: AddButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={onClick}
      className={cn(
        'border-dashed border-indigo-500/40 bg-indigo-500/5 text-indigo-700',
        'hover:border-indigo-500/70 hover:bg-indigo-500/12 hover:text-indigo-800',
        'focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30',
        'dark:border-indigo-400/40 dark:bg-indigo-400/5 dark:text-indigo-300',
        'dark:hover:border-indigo-400/70 dark:hover:bg-indigo-400/12 dark:hover:text-indigo-200',
        className,
      )}
    >
      <Plus />
      {children}
    </Button>
  )
}
