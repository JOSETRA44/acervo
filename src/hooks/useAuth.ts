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
  const store = useAuthStore

  useEffect(() => {
    const { setUser, setSession, setLoading, clear } = store.getState()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          clear()
          return
        }

        const { setUser: su, setSession: ss, setProfile: sp, setLoading: sl } = store.getState()
        ss(session)
        su(session?.user ?? null)

        // Resolve loading immediately so the spinner disappears while profile loads in bg
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          sl(false)
        }

        // Skip profile re-fetch on token refresh — profile hasn't changed
        if (session?.user && event !== 'TOKEN_REFRESHED') {
          try {
            const profile = await fetchProfile(session.user.id)
            sp(profile)
          } catch {
            sp(null)
          }
        }
      }
    )

    // Fallback: si onAuthStateChange no dispara INITIAL_SESSION (edge case)
    supabase.auth.getSession().then(({ data: { session } }) => {
      const { loading } = store.getState()
      if (loading) {
        setUser(session?.user ?? null)
        setSession(session)
        setLoading(false)
      }
    }).catch(() => {
      const { loading } = store.getState()
      if (loading) setLoading(false)
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
