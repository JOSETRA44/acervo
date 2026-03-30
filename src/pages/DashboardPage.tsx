import { FolderOpen, FileText, Inbox, GitBranch, AlertTriangle } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { GapAlerts } from '@/components/dashboard/GapAlerts'
import { PendingResponses } from '@/components/dashboard/PendingResponses'
import { ActivityChart } from '@/components/dashboard/ActivityChart'
import { useProjects } from '@/hooks/useProjects'
import { useInternalDocuments, useExternalDocuments, useDocumentThreads, useSequenceGaps } from '@/hooks/useDocuments'
import { useAuthStore } from '@/stores/authStore'

export function DashboardPage() {
  const profile = useAuthStore((s) => s.profile)
  const { data: projects } = useProjects()
  const { data: internalDocs } = useInternalDocuments()
  const { data: externalDocs } = useExternalDocuments()
  const { data: threads } = useDocumentThreads()
  const { data: gaps } = useSequenceGaps()

  const greet = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text">
          {greet()}, {profile?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Resumen del sistema documental — Challhuahuacho
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Proyectos Activos"
          value={projects?.length ?? 0}
          icon={<FolderOpen className="h-5 w-5" />}
          color="primary"
          index={0}
        />
        <StatsCard
          title="Docs. Internos"
          value={internalDocs?.length ?? 0}
          icon={<FileText className="h-5 w-5" />}
          color="info"
          index={1}
        />
        <StatsCard
          title="Docs. Externos"
          value={externalDocs?.length ?? 0}
          icon={<Inbox className="h-5 w-5" />}
          color="warning"
          index={2}
        />
        <StatsCard
          title="Brechas Detectadas"
          value={gaps?.length ?? 0}
          icon={<AlertTriangle className="h-5 w-5" />}
          color={gaps && gaps.length > 0 ? 'danger' : 'success'}
          subtitle={gaps && gaps.length > 0 ? 'Requieren atención' : 'Integridad OK'}
          index={3}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart />
        <div className="grid gap-4">
          <StatsCard
            title="Hilos vinculados"
            value={threads?.length ?? 0}
            icon={<GitBranch className="h-5 w-5" />}
            color="success"
            subtitle="Correspondencia trazada"
          />
        </div>
      </div>

      {/* Alerts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GapAlerts />
        <PendingResponses />
      </div>
    </div>
  )
}
