import api from './api'
import type { AuthResponse } from '@/types'

export const authService = {
  async login(email: string, senha: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, senha })
    return data
  },
  async register(nome: string, email: string, senha: string, role = 'ATENDENTE') {
    const { data } = await api.post<AuthResponse>('/auth/register', { nome, email, senha, role })
    return data
  },
}
