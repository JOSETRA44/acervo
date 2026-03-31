import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FolderOpen, FileText, Inbox, ArrowRight } from 'lucide-react'
import Fuse from 'fuse.js'
import { useProjects } from '@/hooks/useProjects'
import { useInternalDocuments, useExternalDocuments } from '@/hooks/useDocuments'
import type { SearchResult } from '@/types'
import { cn } from '@/lib/utils'

interface SpotlightProps {
  open: boolean
  onClose: () => void
}

export function Spotlight({ open, onClose }: SpotlightProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const { data: projects } = useProjects(true, { enabled: open })
  const { data: internalDocs } = useInternalDocuments(undefined, { enabled: open })
  const { data: externalDocs } = useExternalDocuments(undefined, { enabled: open })

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const items: SearchResult[] = useMemo(() => {
    const results: SearchResult[] = []
    projects?.forEach((p) => results.push({
      type: 'project', id: p.id,
      title: p.name, subtitle: `CUI: ${p.cui}`,
      path: `/proyectos/${p.id}`,
    }))
    internalDocs?.forEach((d) => results.push({
      type: 'internal_doc', id: d.id,
      title: d.subject,
      subtitle: `${d.document_type?.code} ${String(d.sequence_number).padStart(3,'0')}-${d.year}`,
      path: `/documentos/internos/${d.id}`,
    }))
    externalDocs?.forEach((d) => results.push({
      type: 'external_doc', id: d.id,
      title: d.subject,
      subtitle: `${d.sender_entity} — Rec. ${String(d.reception_number).padStart(3,'0')}-${d.year}`,
      path: `/documentos/externos/${d.id}`,
    }))
    return results
  }, [projects, internalDocs, externalDocs])

  const fuse = useMemo(() => new Fuse(items, {
    keys: ['title', 'subtitle'],
    threshold: 0.35,
    includeScore: true,
  }), [items])

  const results = useMemo(() => {
    if (!query.trim()) return items.slice(0, 8)
    return fuse.search(query).slice(0, 8).map((r) => r.item)
  }, [query, items, fuse])

  const icons: Record<SearchResult['type'], React.ReactNode> = {
    project: <FolderOpen className="h-4 w-4 text-accent" />,
    internal_doc: <FileText className="h-4 w-4 text-info" />,
    external_doc: <Inbox className="h-4 w-4 text-danger" />,
  }

  function handleSelect(item: SearchResult) {
    navigate(item.path)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 spotlight-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.16 }}
            className="fixed left-1/2 top-[15%] z-50 -translate-x-1/2 w-full max-w-xl"
          >
            <div className="bg-surface rounded-xl shadow-lg border border-border overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="h-4 w-4 text-text-muted shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar proyectos, documentos, CUI..."
                  className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
                  onKeyDown={(e) => e.key === 'Escape' && onClose()}
                />
                <kbd className="text-xs bg-surface-2 rounded px-1.5 py-0.5 font-mono text-text-muted">Esc</kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {results.length === 0 ? (
                  <p className="text-center text-sm text-text-muted py-8">Sin resultados</p>
                ) : (
                  results.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left',
                        'hover:bg-surface-2 transition-colors group'
                      )}
                    >
                      {icons[item.type]}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{item.title}</p>
                        <p className="text-xs text-text-muted truncate">{item.subtitle}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-xs text-text-muted">
                <span><kbd className="font-mono bg-surface-2 rounded px-1">↵</kbd> Abrir</span>
                <span><kbd className="font-mono bg-surface-2 rounded px-1">Esc</kbd> Cerrar</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
