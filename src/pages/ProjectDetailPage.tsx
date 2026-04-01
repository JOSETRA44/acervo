import { useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Inbox, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useProject } from '@/hooks/useProjects'
import { useInternalDocuments, useExternalDocuments } from '@/hooks/useDocuments'
import { formatDate, formatCurrency, STAGE_LABELS, STAGE_COLORS } from '@/lib/utils'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading } = useProject(id!)
  const { data: internalDocs } = useInternalDocuments({ projectId: id })
  const { data: externalDocs } = useExternalDocuments({ projectId: id })

  if (isLoading) return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )

  if (!project) return (
    <div className="text-center py-16 text-text-muted">
      <p>Proyecto no encontrado</p>
      <Button variant="secondary" onClick={() => navigate('/proyectos')} className="mt-4">Volver</Button>
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/proyectos')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-text">{project.name}</h1>
            <Badge label={STAGE_LABELS[project.stage]} color={STAGE_COLORS[project.stage]} />
          </div>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <span className="text-sm font-mono text-text-muted">CUI: {project.cui}</span>
            <span className="text-sm text-accent flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              {formatCurrency(project.investment_cost)}
            </span>
          </div>
        </div>
      </div>

      {project.description && (
        <p className="text-sm text-text-muted bg-surface-2 rounded-lg p-4">{project.description}</p>
      )}

      {/* Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Internal docs */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-info" />
            <h3 className="text-sm font-semibold text-text">Documentos Internos</h3>
            <Badge label={String(internalDocs?.length ?? 0)} color="#3B82F6" />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {internalDocs?.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">Sin documentos internos</p>
            ) : (
              internalDocs?.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg border border-border hover:bg-surface-2 transition-colors"
                >
                  <Badge label={doc.document_type?.code ?? '—'} color={doc.document_type?.color} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text truncate">{doc.subject}</p>
                    <p className="text-xs text-text-muted">{formatDate(doc.issue_date)}</p>
                  </div>
                  <span className="text-xs font-mono text-text-muted">
                    {String(doc.sequence_number).padStart(3,'0')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* External docs */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Inbox className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-text">Documentos Externos</h3>
            <Badge label={String(externalDocs?.length ?? 0)} color="#F59E0B" />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {externalDocs?.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">Sin documentos externos</p>
            ) : (
              externalDocs?.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg border border-border hover:bg-surface-2 transition-colors"
                >
                  <Badge label="REC" color="#EF4444" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text truncate">{doc.subject}</p>
                    <p className="text-xs text-text-muted">{doc.sender_entity}</p>
                    <p className="text-xs text-text-muted">{formatDate(doc.received_date)}</p>
                  </div>
                  {doc.requires_response && (
                    <span className="text-xs text-warning font-medium">Resp.</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
