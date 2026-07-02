'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useChatStore } from '@/store/chatStore'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useAuthStore } from '@/store/authStore'

interface Props {
  telefone: string
  nome: string
  onBack?: () => void
}

export function WhatsAppChat({ telefone, nome, onBack }: Props) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  
  const mensagens = useChatStore((state) => state.mensagensWhatsApp?.[telefone] || [])
  const { user } = useAuthStore()
  const { sendWhatsAppReply } = useWebSocket()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    sendWhatsAppReply(telefone, input.trim(), user?.nome || 'Atendente')
    setInput('')
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-800/60 bg-slate-900/60">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <p className="text-sm font-medium text-slate-200">{nome}</p>
          <p className="text-xs text-slate-500">{telefone}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {mensagens.length === 0 ? (
          <div className="text-center text-slate-600 text-sm py-12">
            Nenhuma mensagem ainda
          </div>
        ) : (
          mensagens.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 max-w-[75%] ${
                msg.remetente === 'ATENDENTE' ? 'ml-auto items-end' : 'items-start'
              }`}
            >
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm ${
                  msg.remetente === 'ATENDENTE'
                    ? 'bg-emerald-600 text-white rounded-br-sm'
                    : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                }`}
              >
                {msg.mensagem}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-slate-800/60 bg-slate-900/40">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma mensagem... (Enter para enviar)"
            rows={1}
            className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-slate-100 px-4 py-2.5 outline-none resize-none"
          />
          <Button onClick={handleSend} disabled={!input.trim()} size="md">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}