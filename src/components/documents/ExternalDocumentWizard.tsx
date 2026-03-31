import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { FileUploader } from './FileUploader'
import { useNextReceptionNumber, useCreateExternalDocument, uploadDocument } from '@/hooks/useDocuments'
import { useProjects } from '@/hooks/useProjects'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/components/ui/Toast'
import { Hash } from 'lucide-react'

const schema = z.object({
  sender_entity: z.string().min(2, 'Requerido'),
  sender_name: z.string().optional(),
  external_number: z.string().optional(),
  subject: z.string().min(5, 'Mínimo 5 caracteres'),
  received_date: z.string().min(1, 'Requerido'),
  project_id: z.string().optional(),
  requires_response: z.boolean(),
  response_deadline: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
}

export function ExternalDocumentWizard({ open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const profile = useAuthStore((s) => s.profile)
  const { data: projects } = useProjects(true, { enabled: open })
  const currentYear = new Date().getFullYear()
  const { data: nextReception } = useNextReceptionNumber(currentYear, { enabled: open })
  const createDoc = useCreateExternalDocument()

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      received_date: new Date().toISOString().split('T')[0],
      requires_response: false,
    },
  })

  const requiresResponse = watch('requires_response')

  async function onSubmit(values: FormValues) {
    if (!profile) return
    setUploading(true)
    try {
      let filePath: string | null = null
      if (file && nextReception) {
        const filename = `${currentYear}_REC_${String(nextReception).padStart(3,'0')}.pdf`
        filePath = await uploadDocument(file, `external/${currentYear}/${filename}`)
      }
      await createDoc.mutateAsync({
        ...values,
        project_id: values.project_id || null,
        sender_name: values.sender_name || null,
        external_number: values.external_number || null,
        response_deadline: values.response_deadline || null,
        reception_number: nextReception ?? 1,
        year: currentYear,
        received_by: profile.id,
        file_path: filePath,
        file_name: file?.name ?? null,
        file_size: file?.size ?? null,
      })
      toast.success('Documento externo registrado')
      reset()
      setFile(null)
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al registrar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Nuevo Documento Externo" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Reception ID */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 border border-border">
          <Hash className="h-4 w-4 text-text-muted" />
          <span className="text-xs text-text-muted">ID de Recepción:</span>
          <span className="text-sm font-mono font-semibold text-text">
            REC-{String(nextReception ?? 1).padStart(3,'0')}-{currentYear}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Entidad remitente *" placeholder="Ministerio, Gobierno Regional..." error={errors.sender_entity?.message} {...register('sender_entity')} />
          <Input label="Nombre del remitente" placeholder="Nombres y apellidos" {...register('sender_name')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Número externo" placeholder="Ej: Oficio N° 4550-2026" {...register('external_number')} />
          <Input label="Fecha de recepción *" type="date" error={errors.received_date?.message} {...register('received_date')} />
        </div>

        <Input label="Asunto *" placeholder="Descripción del documento recibido..." error={errors.subject?.message} {...register('subject')} />

        <Select
          label="Proyecto vinculado (CUI)"
          options={[
            { value: '', label: 'Sin proyecto' },
            ...(projects?.map((p) => ({ value: p.id, label: `${p.cui} — ${p.name}` })) ?? []),
          ]}
          onValueChange={() => {}}
        />
        <input type="hidden" {...register('project_id')} />

        <div className="flex items-center gap-3">
          <input type="checkbox" id="requires_response" {...register('requires_response')} className="h-4 w-4 rounded border-border accent-primary" />
          <label htmlFor="requires_response" className="text-sm text-text">Requiere respuesta</label>
        </div>

        {requiresResponse && (
          <Input label="Plazo de respuesta" type="date" {...register('response_deadline')} />
        )}

        <FileUploader file={file} onFile={setFile} />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={uploading || createDoc.isPending}>Registrar</Button>
        </div>
      </form>
    </Dialog>
  )
}
