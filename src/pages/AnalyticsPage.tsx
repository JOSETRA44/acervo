import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { useProjectSummaries } from '@/hooks/useProjects'
import { useInternalDocuments, useExternalDocuments, useSequenceGaps } from '@/hooks/useDocuments'
import { STAGE_LABELS, STAGE_COLORS } from '@/lib/utils'
import { GapAlerts } from '@/components/dashboard/GapAlerts'
import { PendingResponses } from '@/components/dashboard/PendingResponses'
import { BarChart3, TrendingUp } from 'lucide-react'

const CHART_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899']

export function AnalyticsPage() {
  const { data: summaries } = useProjectSummaries()
  const { data: internalDocs } = useInternalDocuments()
  const { data: externalDocs } = useExternalDocuments()
  const { data: gaps } = useSequenceGaps()

  // Stage distribution
  const stageData = useMemo(() => {
    const counts: Record<string, number> = {}
    summaries?.forEach((s) => {
      const label = STAGE_LABELS[s.stage]
      counts[label] = (counts[label] ?? 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [summaries])

  // Doc type distribution
  const docTypeData = useMemo(() => {
    const counts: Record<string, number> = {}
    internalDocs?.forEach((d) => {
      const code = d.document_type?.name ?? 'Otro'
      counts[code] = (counts[code] ?? 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [internalDocs])

  // Top projects by doc volume
  const topProjects = useMemo(() => {
    return (summaries ?? [])
      .sort((a, b) => (b.internal_doc_count + b.external_doc_count) - (a.internal_doc_count + a.external_doc_count))
      .slice(0, 8)
      .map((s) => ({
        name: s.cui,
        internos: s.internal_doc_count,
        externos: s.external_doc_count,
        inversión: s.investment_cost / 1_000_000,
      }))
  }, [summaries])

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Analítica Documental
        </h1>
        <p className="text-sm text-text-muted mt-1">Inteligencia operativa del acervo</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total proyectos', value: summaries?.length ?? 0, color: '#3B82F6' },
          { label: 'Docs. internos', value: internalDocs?.length ?? 0, color: '#10B981' },
          { label: 'Docs. externos', value: externalDocs?.length ?? 0, color: '#F59E0B' },
          { label: 'Brechas activas', value: gaps?.length ?? 0, color: '#EF4444' },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage pie */}
        <div className="card">
          <h3 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Proyectos por Etapa
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }: { name: string; percent: number }) => `${name} (${(percent*100).toFixed(0)}%)`} labelLine={false} fontSize={11}>
                {stageData.map((_entry, i) => (
                  <Cell key={i} fill={Object.values(STAGE_COLORS)[i % 4]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Doc type bar */}
        <div className="card">
          <h3 className="text-sm font-semibold text-text mb-4">Tipos de Documentos Emitidos</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={docTypeData} margin={{ left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="value" name="Documentos" radius={[4,4,0,0]}>
                {docTypeData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top projects */}
      {topProjects.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-text mb-4">Top Proyectos por Volumen Documental</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProjects} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="internos" name="Internos" fill="#3B82F6" radius={[4,4,0,0]} stackId="a" />
              <Bar dataKey="externos" name="Externos" fill="#F59E0B" radius={[4,4,0,0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GapAlerts />
        <PendingResponses />
      </div>
    </div>
  )
}
