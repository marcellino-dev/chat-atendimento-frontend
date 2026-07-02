'use client'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

export function useAuth() {
  const router = useRouter()
  const { setAuth, logout, user, isAuthenticated } = useAuthStore()

  async function login(email: string, senha: string) {
    try {
      const data = await authService.login(email, senha)
      setAuth(data)
      toast.success(`Bem-vindo, ${data.nome}!`)
      router.push('/dashboard')
    } catch {
      toast.error('Email ou senha inválidos')
    }
  }

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return { login, logout: handleLogout, user, isAuthenticated }
}
