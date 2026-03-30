import { useState } from 'react'
import { Plus, Search, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { InternalDocumentWizard } from '@/components/documents/InternalDocumentWizard'
import { useInternalDocuments, useDocumentTypes, getDocumentUrl } from '@/hooks/useDocuments'
import { useAuthStore } from '@/stores/authStore'
import { formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

export function InternalDocsPage() {
  const [wizardOpen, setWizardOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterTypeId, setFilterTypeId] = useState('')
  const [filterYear, setFilterYear] = useState('')

  const profile = useAuthStore((s) => s.profile)
  const { data: docs, isLoading } = useInternalDocuments({
    typeId: filterTypeId || undefined,
    year: filterYear ? parseInt(filterYear) : undefined,
  })
  const { data: docTypes } = useDocumentTypes()
  const canCreate = profile?.role !== 'viewer'

  const internalTypes = docTypes?.filter((t) => t.direction === 'internal') ?? []

  const filtered = docs?.filter((d) =>
    d.subject.toLowerCase().includes(search.toLowerCase()) ||
    d.project?.cui?.includes(search) ||
    d.project?.name?.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-bold text-text">Documentos Internos</h1>
          <p className="text-sm text-text-muted mt-1">Informes, memorándums y oficios emitidos</p>
        </div>
        {canCreate && (
          <Button onClick={() => setWizardOpen(true)}>
            <Plus className="h-4 w-4" /> Nuevo documento
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <Input
          placeholder="Buscar por asunto, CUI o proyecto..."
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="w-44">
          <Select
            options={[{ value: '', label: 'Todos los tipos' }, ...internalTypes.map((t) => ({ value: t.id, label: t.name, color: t.color }))]}
            value={filterTypeId}
            onValueChange={setFilterTypeId}
          />
        </div>
        <div className="w-32">
          <Select
            options={[{ value: '', label: 'Todos los años' }, ...years.map((y) => ({ value: String(y), label: String(y) }))]}
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
        {/* Header */}
        <div className="grid grid-cols-[80px_100px_1fr_160px_120px_100px] gap-4 px-4 py-3 border-b border-border bg-surface-2 text-xs font-semibold text-text-muted uppercase tracking-wide">
          <span>Tipo</span>
          <span>N° / Año</span>
          <span>Asunto</span>
          <span>Proyecto</span>
          <span>Fecha</span>
          <span>Archivo</span>
        </div>

        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Sin documentos registrados</p>
          </div>
        ) : (
          filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="grid grid-cols-[80px_100px_1fr_160px_120px_100px] gap-4 px-4 py-3 border-b border-border hover:bg-surface-2 transition-colors items-center"
            >
              <Badge
                label={doc.document_type?.code ?? '—'}
                color={doc.document_type?.color}
              />
              <span className="text-xs font-mono text-text">
                {String(doc.sequence_number).padStart(3,'0')}-{doc.year}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-text truncate">{doc.subject}</p>
                {doc.recipient && <p className="text-xs text-text-muted">A: {doc.recipient}</p>}
              </div>
              <div className="min-w-0">
                {doc.project ? (
                  <div>
                    <p className="text-xs font-mono text-info">{doc.project.cui}</p>
                    <p className="text-xs text-text-muted truncate">{doc.project.name}</p>
                  </div>
                ) : (
                  <span className="text-xs text-text-muted">—</span>
                )}
              </div>
              <span className="text-xs text-text-muted">{formatDate(doc.issue_date)}</span>
              <div>
                {doc.file_path ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openFile(doc.file_path!)}
                    className="text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <span className="text-xs text-text-muted">Sin archivo</span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <InternalDocumentWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  )
}
