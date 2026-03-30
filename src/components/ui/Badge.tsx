import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  color?: string
  variant?: 'solid' | 'soft'
  className?: string
}

export function Badge({ label, color = '#64748B', variant = 'soft', className }: BadgeProps) {
  const style =
    variant === 'solid'
      ? { backgroundColor: color, color: '#fff' }
      : { backgroundColor: `${color}22`, color: color }

  return (
    <span
      className={cn('badge text-xs font-medium px-2 py-0.5 rounded', className)}
      style={style}
    >
      {label}
    </span>
  )
}
