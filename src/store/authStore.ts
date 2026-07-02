import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthResponse } from '@/types'

interface AuthState {
  token: string | null
  user: { id: number; nome: string; role: string } | null
  isAuthenticated: boolean
  setAuth: (data: AuthResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (data) => {
        localStorage.setItem('token', data.token)
        set({ token: data.token, user: { id: data.userId, nome: data.nome, role: data.role }, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('token')
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    { name: 'auth-storage', partialize: (s) => ({ token: s.token, user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
)
