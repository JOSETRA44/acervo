import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FolderOpen, TrendingUp, FileText, Inbox } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, STAGE_LABELS, STAGE_COLORS } from '@/lib/utils'
import type { ProjectDocumentSummary } from '@/types'

interface Props {
  summary: ProjectDocumentSummary
  index?: number
}

export function ProjectCard({ summary, index = 0 }: Props) {
  const navigate = useNavigate()

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      onClick={() => navigate(`/proyectos/${summary.project_id}`)}
      className="card w-full text-left hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <FolderOpen className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text truncate">{summary.project_name}</p>
            <p className="text-xs font-mono text-text-muted">CUI: {summary.cui}</p>
          </div>
        </div>
        <Badge
          label={STAGE_LABELS[summary.stage]}
          color={STAGE_COLORS[summary.stage]}
        />
      </div>

      <div className="flex items-center gap-1 mb-3 text-sm font-medium text-accent">
        <TrendingUp className="h-3.5 w-3.5" />
        {formatCurrency(summary.investment_cost)}
      </div>

      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <FileText className="h-3.5 w-3.5" />
          <span>{summary.internal_doc_count} internos</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <Inbox className="h-3.5 w-3.5" />
          <span>{summary.external_doc_count} externos</span>
        </div>
        <div className="ml-auto text-xs text-text-muted">
          {summary.linked_thread_count} hilos
        </div>
      </div>
    </motion.button>
  )
}
