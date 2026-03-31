import { GitBranch, Link2, ExternalLink } from 'lucide-react'
import { useDocumentThreads } from '@/hooks/useDocuments'
import { Badge } from '@/components/ui/Badge'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { formatDate } from '@/lib/utils'

export function ThreadsPage() {
  const { data: threads, isLoading } = useDocumentThreads()

  return (
    <div className="space-y-5 max-w-5xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text">Hilos Documentales</h1>
        <p className="text-sm text-text-muted mt-1">
          Trazabilidad entre documentos externos y sus respuestas internas
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : threads?.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <GitBranch className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Sin hilos registrados</p>
          <p className="text-sm mt-1">Vincula documentos externos con sus respuestas internas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {threads?.map((thread) => (
            <div
              key={thread.id}
              className="card"
            >
              {/* Thread header */}
              <div className="flex items-center gap-2 mb-4 text-xs text-text-muted">
                <GitBranch className="h-3.5 w-3.5" />
                <span>Vinculado {formatDate(thread.created_at)}</span>
                {thread.linker && <span>por {thread.linker.full_name}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] gap-4 items-center">
                {/* External doc */}
                <div className="p-3 rounded-lg border border-danger/30 bg-danger/5">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="h-3.5 w-3.5 text-danger" />
                    <span className="text-xs font-semibold text-danger uppercase tracking-wide">Documento Externo</span>
                  </div>
                  <p className="text-sm font-medium text-text">{thread.external_document?.subject}</p>
                  <p className="text-xs text-text-muted mt-1">{thread.external_document?.sender_entity}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      label={`REC-${String(thread.external_document?.reception_number).padStart(3,'0')}-${thread.external_document?.year}`}
                      color="#EF4444"
                    />
                    {thread.external_document?.received_date && (
                      <span className="text-xs text-text-muted">{formatDate(thread.external_document.received_date)}</span>
                    )}
                  </div>
                </div>

                {/* Connector */}
                <div className="flex justify-center">
                  <Link2 className="h-5 w-5 text-success" />
                </div>

                {/* Internal doc */}
                <div className="p-3 rounded-lg border border-success/30 bg-success/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 className="h-3.5 w-3.5 text-success" />
                    <span className="text-xs font-semibold text-success uppercase tracking-wide">Respuesta Interna</span>
                  </div>
                  <p className="text-sm font-medium text-text">{thread.internal_document?.subject}</p>
                  {thread.internal_document?.issuer && (
                    <p className="text-xs text-text-muted mt-1">Por: {thread.internal_document.issuer.full_name}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      label={`${thread.internal_document?.document_type?.code} ${String(thread.internal_document?.sequence_number).padStart(3,'0')}-${thread.internal_document?.year}`}
                      color={thread.internal_document?.document_type?.color}
                    />
                    {thread.internal_document?.issue_date && (
                      <span className="text-xs text-text-muted">{formatDate(thread.internal_document.issue_date)}</span>
                    )}
                  </div>
                </div>
              </div>

              {thread.notes && (
                <p className="mt-3 text-xs text-text-muted italic border-t border-border pt-3">{thread.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
