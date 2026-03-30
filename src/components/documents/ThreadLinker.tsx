import { useState } from 'react'
import { GitBranch, Link2, Plus } from 'lucide-react'
import { useDocumentThreads, useCreateThread, useInternalDocuments } from '@/hooks/useDocuments'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { toast } from '@/components/ui/Toast'
import { formatDate } from '@/lib/utils'
import type { ExternalDocument } from '@/types'

interface Props {
  externalDoc: ExternalDocument
}

export function ThreadLinker({ externalDoc }: Props) {
  const [linking, setLinking] = useState(false)
  const [selectedInternalId, setSelectedInternalId] = useState('')
  const [notes, setNotes] = useState('')

  const profile = useAuthStore((s) => s.profile)
  const { data: threads, isLoading } = useDocumentThreads(externalDoc.id)
  const { data: internalDocs } = useInternalDocuments()
  const createThread = useCreateThread()

  async function handleLink() {
    if (!selectedInternalId || !profile) return
    try {
      await createThread.mutateAsync({
        external_document_id: externalDoc.id,
        internal_document_id: selectedInternalId,
        linked_by: profile.id,
        notes: notes || undefined,
      })
      toast.success('Hilo vinculado correctamente')
      setSelectedInternalId('')
      setNotes('')
      setLinking(false)
    } catch {
      toast.error('Error al vincular documentos')
    }
  }

  const linkedIds = new Set(threads?.map((t) => t.internal_document_id))
  const available = internalDocs?.filter((d) => !linkedIds.has(d.id)) ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-text-muted" />
        <h4 className="text-sm font-semibold text-text">Hilos vinculados</h4>
        {threads && <Badge label={String(threads.length)} color="#3B82F6" />}
      </div>

      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-surface-2" />
          ))}
        </div>
      ) : threads?.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-3">Sin respuestas vinculadas</p>
      ) : (
        <div className="space-y-2">
          {threads?.map((t) => (
            <div key={t.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface-2">
              <Link2 className="h-4 w-4 text-success mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">
                  {t.internal_document?.subject}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    label={`${t.internal_document?.document_type?.code} ${String(t.internal_document?.sequence_number).padStart(3,'0')}-${t.internal_document?.year}`}
                    color={t.internal_document?.document_type?.color}
                  />
                  <span className="text-xs text-text-muted">
                    Vinculado {formatDate(t.created_at)}
                  </span>
                </div>
                {t.notes && <p className="text-xs text-text-muted mt-1 italic">{t.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link form */}
      {!linking ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLinking(true)}
          className="w-full"
        >
          <Plus className="h-3.5 w-3.5" /> Vincular respuesta
        </Button>
      ) : (
        <div className="space-y-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
          <Select
            label="Documento de respuesta"
            options={available.map((d) => ({
              value: d.id,
              label: `${d.document_type?.code} ${String(d.sequence_number).padStart(3,'0')}-${d.year} — ${d.subject}`,
              color: d.document_type?.color,
            }))}
            value={selectedInternalId}
            onValueChange={setSelectedInternalId}
            placeholder="Selecciona el documento de respuesta..."
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notas (opcional)..."
            className="w-full h-16 rounded border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleLink} loading={createThread.isPending} disabled={!selectedInternalId}>
              Vincular
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setLinking(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
