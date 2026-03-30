import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useSequenceGaps } from '@/hooks/useDocuments'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'

export function GapAlerts() {
  const { data: gaps, isLoading } = useSequenceGaps()

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h3 className="text-sm font-semibold text-text">Brechas de Secuencia</h3>
        {gaps && gaps.length > 0 && (
          <Badge label={String(gaps.length)} color="#EF4444" />
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}</div>
      ) : gaps?.length === 0 ? (
        <div className="flex items-center gap-2 py-4 text-success">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm">Todas las secuencias son íntegras</span>
        </div>
      ) : (
        <div className="space-y-1 max-h-56 overflow-y-auto">
          {gaps?.map((gap, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 px-3 rounded-md bg-danger/5 border border-danger/20"
            >
              <div className="flex items-center gap-3">
                <Badge label={gap.doc_type_code} color="#EF4444" />
                <span className="text-sm text-text">
                  #{String(gap.missing_number).padStart(3, '0')} faltante
                </span>
              </div>
              <span className="text-xs text-text-muted">{gap.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
