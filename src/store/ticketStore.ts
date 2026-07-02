import { create } from 'zustand'
import type { Ticket } from '@/types'

interface TicketState {
  meusTickets: Ticket[]
  fila: Ticket[]
  ticketAtivo: Ticket | null
  setMeusTickets: (t: Ticket[]) => void
  setFila: (t: Ticket[]) => void
  setTicketAtivo: (t: Ticket | null) => void
  addTicketFila: (t: Ticket) => void
  removeTicketFila: (id: number) => void
}

export const useTicketStore = create<TicketState>((set) => ({
  meusTickets: [],
  fila: [],
  ticketAtivo: null,
  setMeusTickets: (t) => set({ meusTickets: t }),
  setFila: (t) => set({ fila: t }),
  setTicketAtivo: (t) => set({ ticketAtivo: t }),
  addTicketFila: (t) => set((s) => ({ fila: [t, ...s.fila] })),
  removeTicketFila: (id) => set((s) => ({ fila: s.fila.filter((x) => x.id !== id) })),
}))
