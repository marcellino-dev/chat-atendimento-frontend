export type StatusTicket = 'ABERTO' | 'EM_ATENDIMENTO' | 'TRANSFERIDO' | 'FECHADO'
export type Prioridade   = 'BAIXA' | 'NORMAL' | 'ALTA' | 'URGENTE'

export interface Setor {
  id: number
  nome: string
  descricao?: string
  ativo: boolean
}

export interface Atendente {
  id: number
  userId: number
  nome: string
  email: string
  status: 'ONLINE' | 'OFFLINE' | 'AUSENTE'
  setor?: string
  maxSimultaneous: number
}

export interface Ticket {
  id: number
  conversaId: number
  protocolo: string
  clienteNome?: string
  clienteTel?: string
  setor: Setor
  atendente?: Atendente
  prioridade: Prioridade
  status: StatusTicket
  canal: 'WHATSAPP' | 'WEB'
  createdAt: string
  assumidoAt?: string
  slaLimite?: string
}
