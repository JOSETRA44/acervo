import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { Profile } from '@/types'

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export function useAuthInit() {
  const { setUser, setSession, setProfile, setLoading, clear } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setProfile(profile)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setProfile(profile)
      } else if (event === 'SIGNED_OUT') {
        clear()
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setSession, setProfile, setLoading, clear])
}

export function useSignIn() {
  return async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }
}

export function useSignOut() {
  return async () => {
    await supabase.auth.signOut()
  }
}
