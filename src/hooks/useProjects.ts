import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Project, ProjectDocumentSummary } from '@/types'

const QUERY_KEY = 'projects'

export function useProjects(onlyActive = true, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [QUERY_KEY, onlyActive],
    queryFn: async () => {
      let q = supabase
        .from('projects')
        .select('*, responsible:profiles(id,full_name,role)')
        .order('created_at', { ascending: false })
        .limit(200)
      if (onlyActive) q = q.eq('is_active', true)
      const { data, error } = await q
      if (error) throw error
      return data as Project[]
    },
    enabled: options?.enabled ?? true,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, responsible:profiles(id,full_name,role)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Project
    },
    enabled: !!id,
  })
}

export function useProjectSummaries() {
  return useQuery({
    queryKey: ['project_summaries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_project_document_summary')
        .select('*')
        .order('investment_cost', { ascending: false })
      if (error) throw error
      return data as ProjectDocumentSummary[]
    },
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Partial<Project>) => {
      const { data, error } = await supabase.from('projects').insert(payload).select().single()
      if (error) throw error
      return data as Project
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase.from('projects').update(payload).eq('id', id).select().single()
      if (error) throw error
      return data as Project
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}
