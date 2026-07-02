import api from './api'
import type { Setor } from '@/types'

export const setorService = {
  async listar(): Promise<Setor[]> {
    const { data } = await api.get<Setor[]>('/setores')
    return data
  },
  async criar(nome: string, descricao?: string): Promise<Setor> {
    const { data } = await api.post<Setor>('/setores', { nome, descricao })
    return data
  },
  async atualizar(id: number, nome: string, descricao?: string): Promise<Setor> {
    const { data } = await api.put<Setor>(`/setores/${id}`, { nome, descricao })
    return data
  },
  async desativar(id: number): Promise<void> {
    await api.delete(`/setores/${id}`)
  },
}
