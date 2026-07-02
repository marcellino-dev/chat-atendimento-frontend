export type RemetenteTipo = 'CLIENTE' | 'ATENDENTE' | 'BOT'
export type TipoMensagem  = 'TEXTO' | 'IMAGEM' | 'AUDIO' | 'ARQUIVO'

export interface Mensagem {
  id: number
  conversaId: number
  remetente: RemetenteTipo
  conteudo: string
  tipo: TipoMensagem
  lida: boolean
  createdAt: string
}

export interface WsMessage {
  type: 'NOVA_MENSAGEM' | 'TICKET_ASSUMIDO' | 'TICKET_TRANSFERIDO' | 'STATUS_CHANGED'
  payload: unknown
}
