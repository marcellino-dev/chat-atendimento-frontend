import api from './api'
import type { Ticket } from '@/types'

export const ticketService = {
  async listarMeus(): Promise<Ticket[]> {
    const { data } = await api.get<Ticket[]>('/tickets/meus')
    return data
  },
  async listarFila(setorId?: number): Promise<Ticket[]> {
    const url = setorId ? `/tickets/fila?setorId=${setorId}` : '/tickets/fila'
    const { data } = await api.get<Ticket[]>(url)
    return data
  },
  async assumir(ticketId: number): Promise<Ticket> {
    const { data } = await api.post<Ticket>(`/tickets/${ticketId}/assumir`)
    return data
  },
  async fechar(ticketId: number): Promise<void> {
    await api.post(`/tickets/${ticketId}/fechar`)
  },
}
