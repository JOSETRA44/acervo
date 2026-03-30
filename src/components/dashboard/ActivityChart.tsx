import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useInternalDocuments } from '@/hooks/useDocuments'
import { format, parseISO, startOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'

export function ActivityChart() {
  const { data: docs } = useInternalDocuments()

  const chartData = useMemo(() => {
    if (!docs) return []
    const counts: Record<string, number> = {}
    docs.forEach((d) => {
      const key = format(startOfMonth(parseISO(d.created_at)), 'MMM yy', { locale: es })
      counts[key] = (counts[key] ?? 0) + 1
    })
    return Object.entries(counts)
      .map(([month, count]) => ({ month, count }))
      .slice(-6)
  }, [docs])

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-text mb-4">Actividad Documental (últimos 6 meses)</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--color-text)',
            }}
            cursor={{ fill: 'var(--color-surface-2)' }}
          />
          <Bar dataKey="count" name="Documentos" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
