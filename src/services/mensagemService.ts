import api from './api'
import type { Mensagem } from '@/types'

export const mensagemService = {
  async listar(conversaId: number): Promise<Mensagem[]> {
    const { data } = await api.get<Mensagem[]>(`/conversas/${conversaId}/mensagens`)
    return data
  },
  async enviar(conversaId: number, conteudo: string): Promise<Mensagem> {
    const { data } = await api.post<Mensagem>(`/conversas/${conversaId}/mensagens`, { conteudo, tipo: 'TEXTO' })
    return data
  },
}
