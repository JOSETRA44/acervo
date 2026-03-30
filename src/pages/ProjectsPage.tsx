import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Dialog } from '@/components/ui/Dialog'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useProjectSummaries, useCreateProject } from '@/hooks/useProjects'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/components/ui/Toast'
import type { ProjectStage } from '@/types'

const schema = z.object({
  cui: z.string().min(4, 'CUI inválido').max(20),
  name: z.string().min(5, 'Mínimo 5 caracteres'),
  description: z.string().optional(),
  investment_cost: z.coerce.number().min(0),
  stage: z.enum(['pre_inversion', 'inversion', 'post_inversion', 'cerrado']),
})
type FormValues = z.infer<typeof schema>

const stageOptions = [
  { value: 'pre_inversion', label: 'Pre-Inversión', color: '#F59E0B' },
  { value: 'inversion', label: 'Inversión', color: '#3B82F6' },
  { value: 'post_inversion', label: 'Post-Inversión', color: '#10B981' },
  { value: 'cerrado', label: 'Cerrado', color: '#64748B' },
]

export function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const profile = useAuthStore((s) => s.profile)
  const { data: summaries, isLoading } = useProjectSummaries()
  const createProject = useCreateProject()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { stage: 'pre_inversion', investment_cost: 0 },
  })

  const filtered = summaries?.filter((s) =>
    s.project_name.toLowerCase().includes(search.toLowerCase()) ||
    s.cui.includes(search)
  ) ?? []

  async function onSubmit(values: FormValues) {
    try {
      await createProject.mutateAsync({
        ...values,
        responsible_id: profile?.id,
      })
      toast.success('Proyecto creado correctamente')
      reset()
      setModalOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear el proyecto')
    }
  }

  const canCreate = profile?.role !== 'viewer'

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-text">Proyectos (CUI)</h1>
          <p className="text-sm text-text-muted mt-1">Hub de inversión pública de Challhuahuacho</p>
        </div>
        {canCreate && (
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> Nuevo proyecto
          </Button>
        )}
      </div>

      {/* Search */}
      <Input
        placeholder="Buscar por nombre o CUI..."
        icon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg font-medium">Sin proyectos</p>
          <p className="text-sm mt-1">{canCreate ? 'Crea el primer proyecto con el CUI.' : 'Contacta al administrador.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => <ProjectCard key={s.project_id} summary={s} index={i} />)}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo Proyecto" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="CUI *" placeholder="Ej: 2642054" error={errors.cui?.message} {...register('cui')} />
            <div>
              <Select
                label="Etapa *"
                options={stageOptions}
                onValueChange={(v) => setValue('stage', v as ProjectStage)}
              />
              <input type="hidden" {...register('stage')} />
            </div>
          </div>
          <Input label="Nombre del proyecto *" placeholder="Nombre completo del proyecto" error={errors.name?.message} {...register('name')} />
          <Input label="Costo de inversión (S/.)" type="number" step="0.01" error={errors.investment_cost?.message} {...register('investment_cost')} />
          <textarea
            placeholder="Descripción del proyecto (opcional)..."
            className="w-full h-20 rounded border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            {...register('description')}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={createProject.isPending}>Crear proyecto</Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}
