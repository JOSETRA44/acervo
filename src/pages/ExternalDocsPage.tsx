import { useState } from 'react'
import { Plus, Search, Filter, Download, GitBranch } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { Dialog } from '@/components/ui/Dialog'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { ExternalDocumentWizard } from '@/components/documents/ExternalDocumentWizard'
import { ThreadLinker } from '@/components/documents/ThreadLinker'
import { useExternalDocuments, getDocumentUrl } from '@/hooks/useDocuments'
import { useAuthStore } from '@/stores/authStore'
import { formatDate } from '@/lib/utils'
import { Inbox } from 'lucide-react'
import type { ExternalDocument, Urgency } from '@/types'

const urgencyColor: Record<Urgency, string> = {
  normal: '#10B981',
  urgent: '#F59E0B',
  overdue: '#EF4444',
}

export function ExternalDocsPage() {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [threadDoc, setThreadDoc] = useState<ExternalDocument | null>(null)
  const [search, setSearch] = useState('')
  const [filterYear, setFilterYear] = useState('__all__')

  const profile = useAuthStore((s) => s.profile)
  const { data: docs, isLoading } = useExternalDocuments({
    year: filterYear !== '__all__' ? parseInt(filterYear) : undefined,
  })
  const canCreate = profile?.role !== 'viewer'

  const filtered = docs?.filter((d) =>
    d.subject.toLowerCase().includes(search.toLowerCase()) ||
    d.sender_entity.toLowerCase().includes(search.toLowerCase()) ||
    d.external_number?.toLowerCase().includes(search.toLowerCase()) ||
    d.project?.cui?.includes(search)
  ) ?? []

  const years = [...new Set(docs?.map((d) => d.year) ?? [])].sort((a, b) => b - a)

  async function openFile(path: string) {
    const url = await getDocumentUrl(path)
    if (url) window.open(url, '_blank')
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Documentos Externos</h1>
          <p className="text-sm text-text-muted mt-1">Correspondencia recibida de entidades externas</p>
        </div>
        {canCreate && (
          <Button onClick={() => setWizardOpen(true)}>
            <Plus className="h-4 w-4" /> Registrar recepción
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <Input
          placeholder="Buscar por asunto, entidad o N° externo..."
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="w-32">
          <Select
            options={[{ value: '__all__', label: 'Todos' }, ...years.map((y) => ({ value: String(y), label: String(y) }))]}
            value={filterYear}
            onValueChange={setFilterYear}
          />
        </div>
        <div className="flex items-center gap-1 text-sm text-text-muted">
          <Filter className="h-3.5 w-3.5" />
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="grid grid-cols-[100px_1fr_160px_120px_80px_80px] gap-4 px-4 py-3 border-b border-border bg-surface-2 text-xs font-semibold text-text-muted uppercase tracking-wide">
          <span>Recepción</span>
          <span>Asunto / Remitente</span>
          <span>N° Externo</span>
          <span>Fecha</span>
          <span>Resp.</span>
          <span>Acciones</span>
        </div>

        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <Inbox className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Sin documentos recibidos</p>
          </div>
        ) : (
          filtered.map((doc) => (
            <div
              key={doc.id}
              className="grid grid-cols-[100px_1fr_160px_120px_80px_80px] gap-4 px-4 py-3 border-b border-border hover:bg-surface-2 transition-colors items-center"
            >
              <span className="text-xs font-mono text-text">
                REC-{String(doc.reception_number).padStart(3,'0')}-{doc.year}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-text truncate">{doc.subject}</p>
                <p className="text-xs text-text-muted">{doc.sender_entity}</p>
                {doc.project?.cui && (
                  <p className="text-xs text-info font-mono">CUI: {doc.project.cui}</p>
                )}
              </div>
              <span className="text-xs text-text-muted font-mono">{doc.external_number ?? '—'}</span>
              <span className="text-xs text-text-muted">{formatDate(doc.received_date)}</span>
              <div>
                {doc.requires_response ? (
                  <Badge label="Sí" color={urgencyColor['normal']} />
                ) : (
                  <span className="text-xs text-text-muted">—</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setThreadDoc(doc)}
                  title="Vincular respuesta"
                >
                  <GitBranch className="h-3.5 w-3.5" />
                </Button>
                {doc.file_path && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openFile(doc.file_path!)}
                    title="Descargar"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <ExternalDocumentWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />

      <Dialog
        open={!!threadDoc}
        onClose={() => setThreadDoc(null)}
        title="Gestión de Hilos"
        description={threadDoc?.subject}
        size="lg"
      >
        {threadDoc && <ThreadLinker externalDoc={threadDoc} />}
      </Dialog>
    </div>
  )
}
