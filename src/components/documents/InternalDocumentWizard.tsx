import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { FileUploader } from './FileUploader'
import { useDocumentTypes, useNextSequence, useCreateInternalDocument, uploadDocument } from '@/hooks/useDocuments'
import { useProjects } from '@/hooks/useProjects'
import { useAuthStore } from '@/stores/authStore'
import { buildNomenclature } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'
import { Tag, Copy, CheckCircle2 } from 'lucide-react'

const schema = z.object({
  document_type_id: z.string().min(1, 'Selecciona el tipo'),
  subject: z.string().min(5, 'Mínimo 5 caracteres'),
  issue_date: z.string().min(1, 'Requerido'),
  project_id: z.string().optional(),
  recipient: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
}

export function InternalDocumentWizard({ open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [tokenCopied, setTokenCopied] = useState(false)

  const profile = useAuthStore((s) => s.profile)
  const { data: docTypes } = useDocumentTypes()
  const { data: projects } = useProjects(true, { enabled: open })
  const createDoc = useCreateInternalDocument()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { issue_date: new Date().toISOString().split('T')[0] },
  })

  const currentYear = new Date().getFullYear()
  const docTypeId = watch('document_type_id')
  const projectId = watch('project_id')

  const { data: nextSeq } = useNextSequence(docTypeId ?? '', currentYear, { enabled: open })
  const selectedProject = projects?.find((p) => p.id === projectId)
  const selectedType = docTypes?.find((t) => t.id === docTypeId)

  const nomenclature = selectedType && nextSeq
    ? buildNomenclature(currentYear, selectedType.code, nextSeq, selectedProject?.cui)
    : null

  async function onSubmit(values: FormValues) {
    if (!profile) return
    setUploading(true)
    try {
      let filePath: string | null = null
      if (file && nomenclature) {
        const storagePath = `internal/${currentYear}/${nomenclature.filename}`
        filePath = await uploadDocument(file, storagePath)
      }
      await createDoc.mutateAsync({
        ...values,
        project_id: values.project_id || null,
        sequence_number: nextSeq ?? 1,
        year: currentYear,
        issuer_id: profile.id,
        file_path: filePath,
        file_name: nomenclature?.filename ?? null,
        file_size: file?.size ?? null,
        metadata: { nomenclature: nomenclature?.code ?? null },
      })
      toast.success('Documento registrado correctamente')
      reset()
      setFile(null)
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al registrar')
    } finally {
      setUploading(false)
    }
  }

  function copyNomenclature() {
    if (!nomenclature) return
    navigator.clipboard.writeText(nomenclature.code)
    setTokenCopied(true)
    setTimeout(() => setTokenCopied(false), 2000)
  }

  const internalTypes = docTypes?.filter((t) => t.direction === 'internal') ?? []

  return (
    <Dialog open={open} onClose={onClose} title="Nuevo Documento Interno" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo de documento *"
            options={internalTypes.map((t) => ({ value: t.id, label: t.name, color: t.color }))}
            onValueChange={(v) => {
              const el = document.querySelector(`[name="document_type_id"]`) as HTMLInputElement | null
              if (el) el.value = v
            }}
            error={errors.document_type_id?.message}
          />
          <input type="hidden" {...register('document_type_id')} />

          <Input
            label="Fecha de emisión *"
            type="date"
            error={errors.issue_date?.message}
            {...register('issue_date')}
          />
        </div>

        <Input
          label="Asunto *"
          placeholder="Descripción del documento..."
          error={errors.subject?.message}
          {...register('subject')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Proyecto (CUI)"
            options={[
              { value: '', label: 'Sin proyecto' },
              ...(projects?.map((p) => ({ value: p.id, label: `${p.cui} — ${p.name}` })) ?? []),
            ]}
            onValueChange={(v) => {
              const el = document.querySelector(`[name="project_id"]`) as HTMLInputElement | null
              if (el) el.value = v
            }}
          />
          <input type="hidden" {...register('project_id')} />

          <Input label="Destinatario" placeholder="Nombre o entidad" {...register('recipient')} />
        </div>

        {/* Nomenclature preview */}
        {nomenclature && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Tag className="h-4 w-4 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-text-muted">Nomenclatura automática</p>
              <p className="text-sm font-mono font-medium text-primary">{nomenclature.code}</p>
            </div>
            <button type="button" onClick={copyNomenclature} className="text-primary hover:opacity-70 transition-opacity">
              {tokenCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        )}

        {/* Sequence indicator */}
        {nextSeq && selectedType && (
          <div className="text-xs text-text-muted">
            Número de secuencia asignado: <span className="font-mono font-semibold text-text">
              {selectedType.code}-{String(nextSeq).padStart(3, '0')}-{currentYear}
            </span>
          </div>
        )}

        <FileUploader file={file} onFile={setFile} />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={uploading || createDoc.isPending}>
            Registrar documento
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
