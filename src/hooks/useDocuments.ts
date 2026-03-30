import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { InternalDocument, ExternalDocument, DocumentThread, DocumentType, SequenceGap, PendingResponse } from '@/types'

// ─── Document Types ───
export function useDocumentTypes() {
  return useQuery({
    queryKey: ['doc_types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('document_types').select('*').order('code')
      if (error) throw error
      return data as DocumentType[]
    },
    staleTime: Infinity,
  })
}

// ─── Internal Documents ───
export function useInternalDocuments(filters?: { projectId?: string; year?: number; typeId?: string }) {
  return useQuery({
    queryKey: ['internal_docs', filters],
    queryFn: async () => {
      let q = supabase
        .from('internal_documents')
        .select('*, document_type:document_types(*), project:projects(id,cui,name), issuer:profiles(id,full_name)')
        .eq('status', 'active')
        .order('year', { ascending: false })
        .order('sequence_number', { ascending: false })
      if (filters?.projectId) q = q.eq('project_id', filters.projectId)
      if (filters?.year) q = q.eq('year', filters.year)
      if (filters?.typeId) q = q.eq('document_type_id', filters.typeId)
      const { data, error } = await q
      if (error) throw error
      return data as InternalDocument[]
    },
  })
}

export function useNextSequence(docTypeId: string, year: number) {
  return useQuery({
    queryKey: ['next_seq', docTypeId, year],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_next_sequence', {
        p_doc_type_id: docTypeId,
        p_year: year,
      })
      if (error) throw error
      return data as number
    },
    enabled: !!docTypeId,
  })
}

export function useCreateInternalDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<InternalDocument>) => {
      const { data, error } = await supabase.from('internal_documents').insert(payload).select().single()
      if (error) throw error
      return data as InternalDocument
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['internal_docs'] })
      qc.invalidateQueries({ queryKey: ['next_seq'] })
      qc.invalidateQueries({ queryKey: ['seq_gaps'] })
    },
  })
}

export function useSoftDeleteInternalDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason, userId }: { id: string; reason: string; userId: string }) => {
      const { error } = await supabase.from('internal_documents').update({
        status: 'deleted',
        deletion_reason: reason,
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
      }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['internal_docs'] }),
  })
}

// ─── External Documents ───
export function useExternalDocuments(filters?: { projectId?: string; year?: number }) {
  return useQuery({
    queryKey: ['external_docs', filters],
    queryFn: async () => {
      let q = supabase
        .from('external_documents')
        .select('*, project:projects(id,cui,name), receiver:profiles(id,full_name)')
        .eq('status', 'active')
        .order('year', { ascending: false })
        .order('reception_number', { ascending: false })
      if (filters?.projectId) q = q.eq('project_id', filters.projectId)
      if (filters?.year) q = q.eq('year', filters.year)
      const { data, error } = await q
      if (error) throw error
      return data as ExternalDocument[]
    },
  })
}

export function useNextReceptionNumber(year: number) {
  return useQuery({
    queryKey: ['next_reception', year],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_next_reception_number', { p_year: year })
      if (error) throw error
      return data as number
    },
  })
}

export function useCreateExternalDocument() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<ExternalDocument>) => {
      const { data, error } = await supabase.from('external_documents').insert(payload).select().single()
      if (error) throw error
      return data as ExternalDocument
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['external_docs'] })
      qc.invalidateQueries({ queryKey: ['next_reception'] })
      qc.invalidateQueries({ queryKey: ['pending_responses'] })
    },
  })
}

// ─── Threads ───
export function useDocumentThreads(externalDocId?: string) {
  return useQuery({
    queryKey: ['threads', externalDocId],
    queryFn: async () => {
      let q = supabase
        .from('document_threads')
        .select('*, external_document:external_documents(*), internal_document:internal_documents(*, document_type:document_types(*)), linker:profiles(id,full_name)')
        .order('created_at', { ascending: false })
      if (externalDocId) q = q.eq('external_document_id', externalDocId)
      const { data, error } = await q
      if (error) throw error
      return data as DocumentThread[]
    },
    enabled: externalDocId !== undefined ? !!externalDocId : true,
  })
}

export function useCreateThread() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { external_document_id: string; internal_document_id: string; linked_by: string; notes?: string }) => {
      const { data, error } = await supabase.from('document_threads').insert(payload).select().single()
      if (error) throw error
      return data as DocumentThread
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['threads'] })
      qc.invalidateQueries({ queryKey: ['pending_responses'] })
    },
  })
}

// ─── Analytics ───
export function useSequenceGaps() {
  return useQuery({
    queryKey: ['seq_gaps'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_sequence_gaps').select('*')
      if (error) throw error
      return data as SequenceGap[]
    },
  })
}

export function usePendingResponses() {
  return useQuery({
    queryKey: ['pending_responses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_pending_responses').select('*').order('days_waiting', { ascending: false })
      if (error) throw error
      return data as PendingResponse[]
    },
  })
}

// ─── File Upload ───
export async function uploadDocument(file: File, path: string) {
  const { data, error } = await supabase.storage.from('documents').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return data.path
}

export async function getDocumentUrl(path: string) {
  const { data } = await supabase.storage.from('documents').createSignedUrl(path, 3600)
  return data?.signedUrl ?? null
}
