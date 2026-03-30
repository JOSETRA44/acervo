export type UserRole = 'admin' | 'formulador' | 'viewer'
export type DocStatus = 'active' | 'archived' | 'deleted'
export type ProjectStage = 'pre_inversion' | 'inversion' | 'post_inversion' | 'cerrado'
export type DocDirection = 'internal' | 'external'
export type Urgency = 'normal' | 'urgent' | 'overdue'

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  area: string | null
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  cui: string
  name: string
  description: string | null
  investment_cost: number
  stage: ProjectStage
  responsible_id: string | null
  municipality: string
  is_active: boolean
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // joined
  responsible?: Profile
}

export interface DocumentType {
  id: string
  code: string
  name: string
  direction: DocDirection
  requires_sequence: boolean
  color: string
  description: string | null
}

export interface InternalDocument {
  id: string
  document_type_id: string
  sequence_number: number
  year: number
  subject: string
  project_id: string | null
  issuer_id: string
  issue_date: string
  recipient: string | null
  file_path: string | null
  file_name: string | null
  file_size: number | null
  token: string
  status: DocStatus
  deletion_reason: string | null
  deleted_at: string | null
  deleted_by: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // joined
  document_type?: DocumentType
  project?: Project
  issuer?: Profile
}

export interface ExternalDocument {
  id: string
  reception_number: number
  year: number
  external_number: string | null
  sender_entity: string
  sender_name: string | null
  subject: string
  received_date: string
  project_id: string | null
  received_by: string
  requires_response: boolean
  response_deadline: string | null
  file_path: string | null
  file_name: string | null
  file_size: number | null
  token: string
  status: DocStatus
  deletion_reason: string | null
  deleted_at: string | null
  deleted_by: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  // joined
  project?: Project
  receiver?: Profile
}

export interface DocumentThread {
  id: string
  external_document_id: string
  internal_document_id: string
  linked_by: string
  notes: string | null
  created_at: string
  // joined
  external_document?: ExternalDocument
  internal_document?: InternalDocument
  linker?: Profile
}

export interface SequenceGap {
  doc_type_code: string
  type_name: string
  year: number
  missing_number: number
}

export interface PendingResponse {
  id: string
  reception_number: number
  year: number
  external_number: string | null
  sender_entity: string
  subject: string
  received_date: string
  response_deadline: string | null
  project_name: string | null
  project_cui: string | null
  received_by_name: string | null
  days_waiting: number
  urgency: Urgency
}

export interface ProjectDocumentSummary {
  project_id: string
  cui: string
  project_name: string
  stage: ProjectStage
  investment_cost: number
  is_active: boolean
  internal_doc_count: number
  external_doc_count: number
  linked_thread_count: number
  last_internal_doc_date: string | null
  last_external_doc_date: string | null
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  table_name: string
  record_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  created_at: string
}

// UI helpers
export interface Nomenclature {
  code: string      // e.g. "2026_INF_001_CUI2642054"
  filename: string  // e.g. "2026_INF_001_CUI2642054.pdf"
}

export interface SearchResult {
  type: 'project' | 'internal_doc' | 'external_doc'
  id: string
  title: string
  subtitle: string
  path: string
}
