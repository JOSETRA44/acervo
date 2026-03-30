import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
  color?: string
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function Select({ value, onValueChange, options, placeholder = 'Seleccionar...', label, error, disabled, className }: SelectProps) {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && <label className="text-sm font-medium text-text">{label}</label>}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={cn(
            'flex items-center justify-between h-10 w-full rounded border border-border bg-surface px-3 text-sm text-text',
            'focus:outline-none focus:ring-2 focus:ring-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors',
            error && 'border-danger',
            !value && 'text-text-muted'
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon><ChevronDown className="h-4 w-4 text-text-muted" /></RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            className="z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-surface shadow-md"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex items-center gap-2 rounded px-8 py-2 text-sm text-text cursor-pointer hover:bg-surface-2 focus:bg-surface-2 focus:outline-none data-[disabled]:opacity-50"
                >
                  <RadixSelect.ItemIndicator className="absolute left-2">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </RadixSelect.ItemIndicator>
                  {opt.color && (
                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: opt.color }} />
                  )}
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
