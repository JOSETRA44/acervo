import { Search, Moon, Sun, Bell, LogOut, User } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { useSignOut } from '@/hooks/useAuth'
import { usePendingResponses } from '@/hooks/useDocuments'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface TopBarProps {
  onSpotlight: () => void
}

export function TopBar({ onSpotlight }: TopBarProps) {
  const { theme, toggle } = useThemeStore()
  const profile = useAuthStore((s) => s.profile)
  const signOut = useSignOut()
  const { data: pending } = usePendingResponses()
  const urgentCount = pending?.filter((p) => p.urgency !== 'normal').length ?? 0

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center px-4 gap-3 shrink-0">
      {/* Search trigger */}
      <button
        onClick={onSpotlight}
        className={cn(
          'flex items-center gap-2 h-8 px-3 rounded border border-border bg-bg',
          'text-sm text-text-muted hover:text-text hover:border-text-muted transition-colors',
          'flex-1 max-w-xs'
        )}
      >
        <Search className="h-3.5 w-3.5" />
        <span>Buscar... </span>
        <kbd className="ml-auto text-xs bg-surface-2 rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
      </button>

      <div className="flex-1" />

      {/* Theme toggle */}
      <Button variant="ghost" size="icon" onClick={toggle} aria-label="Cambiar tema">
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative" aria-label="Alertas">
        <Bell className="h-4 w-4" />
        {urgentCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
        )}
      </Button>

      {/* User menu */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-surface-2 transition-colors">
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
              {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-text leading-tight">{profile?.full_name}</p>
              <p className="text-xs text-text-muted leading-tight capitalize">{profile?.role}</p>
            </div>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="z-50 min-w-[160px] rounded-lg border border-border bg-surface shadow-md p-1"
          >
            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-surface-2 cursor-pointer text-text">
              <User className="h-4 w-4 text-text-muted" /> Perfil
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-border" />
            <DropdownMenu.Item
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-surface-2 cursor-pointer text-danger"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  )
}
