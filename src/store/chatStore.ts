import { create } from 'zustand'

export interface WhatsAppMensagem {
  id: string
  telefone: string
  nome: string
  mensagem: string
  remetente: 'CLIENTE' | 'ATENDENTE' | 'BOT'
  timestamp: number
  lida: boolean
}

export interface WhatsAppConversa {
  telefone: string
  nome: string
  ultimaMensagem: string
  ultimoTimestamp: number
  naoLidas: number
}

interface ChatStore {
  mensagens: Record<number, any[]>
  conversasWhatsApp: WhatsAppConversa[]
  mensagensWhatsApp: Record<string, WhatsAppMensagem[]>
  
  addMensagem: (conversaId: number, mensagem: any) => void
  setMensagens: (conversaId: number, mensagens: any[]) => void
  
  addMensagemWhatsApp: (mensagem: WhatsAppMensagem) => void
  addConversaWhatsApp: (telefone: string, nome: string, mensagem: string, timestamp: number) => void
  marcarComoLida: (telefone: string) => void
  getConversasOrdenadas: () => WhatsAppConversa[]
  getMensagensPorTelefone: (telefone: string) => WhatsAppMensagem[]
}

export const useChatStore = create<ChatStore>((set, get) => ({
  mensagens: {},
  conversasWhatsApp: [],
  mensagensWhatsApp: {},
  
  addMensagem: (conversaId, mensagem) =>
    set((state) => ({
      mensagens: {
        ...state.mensagens,
        [conversaId]: [...(state.mensagens[conversaId] || []), mensagem],
      },
    })),
    
  setMensagens: (conversaId, mensagens) =>
    set((state) => ({
      mensagens: { ...state.mensagens, [conversaId]: mensagens },
    })),
    
  addMensagemWhatsApp: (mensagem) =>
    set((state) => {
      const conversaExiste = state.conversasWhatsApp.find(c => c.telefone === mensagem.telefone)
      const mensagensAtuais = state.mensagensWhatsApp[mensagem.telefone] || []
      
      return {
        mensagensWhatsApp: {
          ...state.mensagensWhatsApp,
          [mensagem.telefone]: [...mensagensAtuais, mensagem],
        },
        conversasWhatsApp: conversaExiste
          ? state.conversasWhatsApp.map(c =>
              c.telefone === mensagem.telefone
                ? {
                    ...c,
                    ultimaMensagem: mensagem.mensagem,
                    ultimoTimestamp: mensagem.timestamp,
                    naoLidas: mensagem.remetente === 'CLIENTE' && !mensagem.lida
                      ? c.naoLidas + 1
                      : c.naoLidas
                  }
                : c
            )
          : [
              {
                telefone: mensagem.telefone,
                nome: mensagem.nome,
                ultimaMensagem: mensagem.mensagem,
                ultimoTimestamp: mensagem.timestamp,
                naoLidas: mensagem.remetente === 'CLIENTE' ? 1 : 0,
              },
              ...state.conversasWhatsApp
            ].sort((a, b) => b.ultimoTimestamp - a.ultimoTimestamp),
      }
    }),
    
  addConversaWhatsApp: (telefone, nome, mensagem, timestamp) =>
    set((state) => {
      const existe = state.conversasWhatsApp.find(c => c.telefone === telefone)
      if (existe) return state
      
      return {
        conversasWhatsApp: [
          {
            telefone,
            nome,
            ultimaMensagem: mensagem,
            ultimoTimestamp: timestamp,
            naoLidas: 1,
          },
          ...state.conversasWhatsApp
        ].sort((a, b) => b.ultimoTimestamp - a.ultimoTimestamp),
      }
    }),
    
  marcarComoLida: (telefone) =>
    set((state) => ({
      conversasWhatsApp: state.conversasWhatsApp.map(c =>
        c.telefone === telefone ? { ...c, naoLidas: 0 } : c
      ),
      mensagensWhatsApp: {
        ...state.mensagensWhatsApp,
        [telefone]: (state.mensagensWhatsApp[telefone] || []).map(m =>
          m.remetente === 'CLIENTE' ? { ...m, lida: true } : m
        ),
      },
    })),
    
  getConversasOrdenadas: () => {
    return [...get().conversasWhatsApp].sort((a, b) => b.ultimoTimestamp - a.ultimoTimestamp)
  },
  
  getMensagensPorTelefone: (telefone) => {
    return get().mensagensWhatsApp[telefone] || []
  },
}))