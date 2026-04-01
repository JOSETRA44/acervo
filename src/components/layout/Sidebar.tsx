import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FolderOpen, FileText, Inbox,
  GitBranch, BarChart3, Settings, ChevronLeft, Building2,
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/proyectos', icon: FolderOpen, label: 'Proyectos (CUI)' },
  { to: '/documentos/internos', icon: FileText, label: 'Docs. Internos' },
  { to: '/documentos/externos', icon: Inbox, label: 'Docs. Externos' },
  { to: '/hilos', icon: GitBranch, label: 'Hilos / Threads' },
  { to: '/analitica', icon: BarChart3, label: 'Analítica' },
]

const adminItems = [
  { to: '/admin', icon: ShieldCheck, label: 'Administración' },
  { to: '/ajustes', icon: Settings, label: 'Ajustes' },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const profile = useAuthStore((s) => s.profile)

  return (
    <aside
      className={cn(
        'relative flex flex-col h-full bg-surface border-r border-border overflow-hidden shrink-0 z-20 transition-[width] duration-200 ease-in-out',
        collapsed ? 'w-16' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <div className="flex items-center justify-center h-8 w-8 rounded bg-primary text-white shrink-0">
          <Building2 className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <p className="text-sm font-semibold text-text leading-tight">Acervo</p>
            <p className="text-xs text-text-muted leading-tight">Challhuahuacho</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <SidebarItem key={to} to={to} icon={Icon} label={label} collapsed={collapsed} />
        ))}

        {profile?.role === 'admin' && (
          <>
            <div className="my-2 mx-2 h-px bg-border" />
            {adminItems.map(({ to, icon: Icon, label }) => (
              <SidebarItem key={to} to={to} icon={Icon} label={label} collapsed={collapsed} />
            ))}
          </>
        )}
      </nav>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'absolute -right-3 top-16 h-6 w-6 rounded-full bg-surface border border-border',
          'flex items-center justify-center text-text-muted hover:text-text transition-colors',
          'shadow-sm z-30'
        )}
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      >
        <ChevronLeft className={cn('h-3.5 w-3.5 transition-transform', collapsed && 'rotate-180')} />
      </button>
    </aside>
  )
}

function SidebarItem({
  to, icon: Icon, label, collapsed,
}: { to: string; icon: React.ElementType; label: string; collapsed: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
          'hover:bg-surface-2',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-text-muted hover:text-text'
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <span className="overflow-hidden whitespace-nowrap">{label}</span>
      )}
    </NavLink>
  )
}
