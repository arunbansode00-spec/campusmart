import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../utils/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: false,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),

      login: async (email, password) => {
        set({ loading: true })
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { set({ loading: false }); throw error }
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        set({ user: data.user, profile, loading: false })
        return profile
      },

      register: async (email, password, fullName, whatsapp) => {
        if (!email.endsWith('@learner.manipal.edu') && !email.endsWith('@manipal.edu')) {
          throw new Error('Only MIT Manipal email addresses are allowed (@learner.manipal.edu or @manipal.edu)')
        }
        set({ loading: true })
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) { set({ loading: false }); throw error }
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          email,
          whatsapp,
          role: 'student',
        })
        if (profileError) { set({ loading: false }); throw profileError }
        set({ loading: false })
        return data.user
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, profile: null })
      },

      fetchProfile: async (userId) => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        set({ profile: data })
        return data
      },

      isAdmin: () => {
        const { profile } = get()
        return profile?.role === 'admin' || profile?.role === 'super_admin'
      },

      isSeller: () => {
        const { profile } = get()
        return profile?.role === 'seller' || profile?.role === 'admin' || profile?.role === 'super_admin'
      },
    }),
    { name: 'campusmart-auth', partialize: (s) => ({ user: s.user, profile: s.profile }) }
  )
)
