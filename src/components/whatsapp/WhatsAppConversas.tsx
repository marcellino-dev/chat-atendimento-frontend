'use client'
import { useChatStore } from '@/store/chatStore'
import { Avatar } from '@/components/ui/Avatar'

interface Props {
  onSelectConversa: (telefone: string, nome: string) => void
  selectedTelefone?: string
}

export function WhatsAppConversas({ onSelectConversa, selectedTelefone }: Props) {
  const conversas = useChatStore((state) => state.conversasWhatsApp)
  const marcarComoLida = useChatStore((state) => state.marcarComoLida)

  const handleSelect = (telefone: string, nome: string) => {
    marcarComoLida(telefone)
    onSelectConversa(telefone, nome)
  }

  if (!conversas || conversas.length === 0) {
    return (
      <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">WhatsApp</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 text-sm">Nenhuma conversa</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-white font-semibold">WhatsApp</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversas.map((conv) => (
          <button
            key={conv.telefone}
            onClick={() => handleSelect(conv.telefone, conv.nome)}
            className={`w-full flex items-center gap-3 p-3 hover:bg-slate-800 border-b border-slate-800/50 ${
              selectedTelefone === conv.telefone ? 'bg-slate-800' : ''
            }`}
          >
            <Avatar nome={conv.nome} size="md" />
            <div className="flex-1 text-left">
              <p className="text-white font-medium">{conv.nome}</p>
              <p className="text-slate-400 text-sm truncate">{conv.ultimaMensagem}</p>
            </div>
            {conv.naoLidas > 0 && (
              <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {conv.naoLidas}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}