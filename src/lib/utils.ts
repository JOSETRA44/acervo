import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Nomenclature, ProjectStage, DocStatus, UserRole } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | null | undefined, pattern = 'dd/MM/yyyy') {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return format(d, pattern, { locale: es })
  } catch {
    return '—'
  }
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function buildNomenclature(
  year: number,
  docTypeCode: string,
  sequenceNumber: number,
  cui?: string | null
): Nomenclature {
  const seq = String(sequenceNumber).padStart(3, '0')
  const cuiPart = cui ? `_CUI${cui}` : ''
  const code = `${year}_${docTypeCode}_${seq}${cuiPart}`
  return { code, filename: `${code}.pdf` }
}

export const STAGE_LABELS: Record<ProjectStage, string> = {
  pre_inversion: 'Pre-Inversión',
  inversion: 'Inversión',
  post_inversion: 'Post-Inversión',
  cerrado: 'Cerrado',
}

export const STAGE_COLORS: Record<ProjectStage, string> = {
  pre_inversion: '#F59E0B',
  inversion: '#3B82F6',
  post_inversion: '#10B981',
  cerrado: '#64748B',
}

export const STATUS_LABELS: Record<DocStatus, string> = {
  active: 'Activo',
  archived: 'Archivado',
  deleted: 'Eliminado',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  formulador: 'Formulador',
  viewer: 'Visualizador',
}

export function truncate(text: string, maxLength: number) {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}…`
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
