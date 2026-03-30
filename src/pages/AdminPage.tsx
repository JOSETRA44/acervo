import { useState } from 'react'
import { ShieldCheck, Users, Database } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/Badge'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { formatDate, ROLE_LABELS } from '@/lib/utils'
import type { Profile, AuditLog } from '@/types'

export function AdminPage() {
  const [tab, setTab] = useState<'users' | 'audit'>('users')

  const { data: profiles, isLoading: loadingProfiles } = useQuery({
    queryKey: ['admin_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at')
      if (error) throw error
      return data as Profile[]
    },
  })

  const { data: auditLogs, isLoading: loadingAudit } = useQuery({
    queryKey: ['audit_logs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(100)
      if (error) throw error
      return data as AuditLog[]
    },
    enabled: tab === 'audit',
  })

  const roleColors: Record<string, string> = {
    admin: '#EF4444',
    formulador: '#3B82F6',
    viewer: '#64748B',
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-text">Administración</h1>
          <p className="text-sm text-text-muted mt-0.5">Gestión de usuarios y auditoría</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 rounded-lg p-1 w-fit">
        {[
          { id: 'users', icon: Users, label: 'Usuarios' },
          { id: 'audit', icon: Database, label: 'Auditoría' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id as typeof tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === id
                ? 'bg-surface text-text shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Users */}
      {tab === 'users' && (
        <div className="card overflow-hidden p-0">
          <div className="grid grid-cols-[1fr_120px_160px_120px] gap-4 px-4 py-3 border-b border-border bg-surface-2 text-xs font-semibold text-text-muted uppercase tracking-wide">
            <span>Usuario</span>
            <span>Rol</span>
            <span>Área</span>
            <span>Registrado</span>
          </div>
          {loadingProfiles
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            : profiles?.map((p) => (
              <div key={p.id} className="grid grid-cols-[1fr_120px_160px_120px] gap-4 px-4 py-3 border-b border-border hover:bg-surface-2 transition-colors items-center">
                <div>
                  <p className="text-sm font-medium text-text">{p.full_name}</p>
                </div>
                <Badge label={ROLE_LABELS[p.role]} color={roleColors[p.role]} />
                <span className="text-xs text-text-muted">{p.area ?? '—'}</span>
                <span className="text-xs text-text-muted">{formatDate(p.created_at)}</span>
              </div>
            ))
          }
        </div>
      )}

      {/* Audit */}
      {tab === 'audit' && (
        <div className="card overflow-hidden p-0">
          <div className="grid grid-cols-[80px_120px_1fr_120px] gap-4 px-4 py-3 border-b border-border bg-surface-2 text-xs font-semibold text-text-muted uppercase tracking-wide">
            <span>Acción</span>
            <span>Tabla</span>
            <span>Registro</span>
            <span>Fecha</span>
          </div>
          {loadingAudit
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : auditLogs?.map((log) => (
              <div key={log.id} className="grid grid-cols-[80px_120px_1fr_120px] gap-4 px-4 py-3 border-b border-border hover:bg-surface-2 transition-colors items-center text-xs">
                <Badge
                  label={log.action}
                  color={log.action === 'DELETE' ? '#EF4444' : log.action === 'INSERT' ? '#10B981' : '#3B82F6'}
                />
                <span className="font-mono text-text-muted">{log.table_name}</span>
                <span className="font-mono text-text-muted truncate">{log.record_id ?? '—'}</span>
                <span className="text-text-muted">{formatDate(log.created_at, 'dd/MM HH:mm')}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}
