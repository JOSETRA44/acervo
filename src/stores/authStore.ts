import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/types'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      profile: null,
      loading: true,
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setProfile: (profile) => set({ profile }),
      setLoading: (loading) => set({ loading }),
      clear: () => set({ user: null, session: null, profile: null, loading: false }),
    }),
    {
      name: 'acervo-auth',
      // Solo persiste profile — loading NUNCA se persiste para evitar
      // que una rehidratación del store deje loading:true indefinidamente
      partialize: (state) => ({ profile: state.profile }),
      onRehydrateStorage: () => (state) => {
        // Después de rehidratar desde localStorage, loading sigue true.
        // No lo tocamos aquí: useAuthInit lo pondrá en false al verificar sesión.
        // Esto evita que el spinner aparezca en navegaciones normales.
        if (state) {
          // Solo resetear loading si NO hay sesión activa que verificar
          // (lo maneja useAuthInit con getSession fallback)
        }
      },
    }
  )
)
