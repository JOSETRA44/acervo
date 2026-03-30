import { Clock, AlertCircle, XCircle } from 'lucide-react'
import { usePendingResponses } from '@/hooks/useDocuments'
import { Badge } from '@/components/ui/Badge'
import { SkeletonRow } from '@/components/ui/Skeleton'
import type { Urgency } from '@/types'
import { formatDate } from '@/lib/utils'

const urgencyConfig: Record<Urgency, { color: string; icon: React.ReactNode; label: string }> = {
  normal: { color: '#10B981', icon: <Clock className="h-3.5 w-3.5" />, label: 'Normal' },
  urgent: { color: '#F59E0B', icon: <AlertCircle className="h-3.5 w-3.5" />, label: 'Urgente' },
  overdue: { color: '#EF4444', icon: <XCircle className="h-3.5 w-3.5" />, label: 'Vencido' },
}

export function PendingResponses() {
  const { data: pending, isLoading } = usePendingResponses()

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-warning" />
        <h3 className="text-sm font-semibold text-text">Pendientes de Respuesta</h3>
        {pending && pending.length > 0 && (
          <Badge label={String(pending.length)} color="#F59E0B" />
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}</div>
      ) : pending?.length === 0 ? (
        <p className="text-sm text-text-muted py-4 text-center">Sin pendientes</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {pending?.map((item) => {
            const cfg = urgencyConfig[item.urgency]
            return (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-md border border-border hover:bg-surface-2 transition-colors">
                <span style={{ color: cfg.color }} className="mt-0.5">{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">{item.subject}</p>
                  <p className="text-xs text-text-muted">{item.sender_entity}</p>
                  {item.project_cui && (
                    <p className="text-xs text-info mt-0.5">CUI: {item.project_cui}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <Badge label={`${item.days_waiting}d`} color={cfg.color} />
                  <p className="text-xs text-text-muted mt-1">{formatDate(item.received_date)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
