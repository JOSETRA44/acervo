import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export function Dialog({ open, onClose, title, description, children, size = 'md' }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <AnimatePresence>
        {open && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 spotlight-overlay"
              />
            </RadixDialog.Overlay>
            <RadixDialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
                  'w-full bg-surface rounded-xl shadow-lg border border-border p-6',
                  'focus:outline-none',
                  sizeMap[size]
                )}
              >
                {(title || description) && (
                  <div className="mb-4">
                    {title && (
                      <RadixDialog.Title className="text-lg font-semibold text-text">
                        {title}
                      </RadixDialog.Title>
                    )}
                    {description && (
                      <RadixDialog.Description className="text-sm text-text-muted mt-1">
                        {description}
                      </RadixDialog.Description>
                    )}
                  </div>
                )}
                {children}
                <RadixDialog.Close
                  className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors rounded focus-visible:ring-2 focus-visible:ring-primary p-1"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </RadixDialog.Close>
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  )
}
