'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Phone, MoreVertical, CheckCircle2, X } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import { mensagemService } from '@/services/mensagemService'
import { ticketService } from '@/services/ticketService'
import { statusColor } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Ticket } from '@/types'

interface Props { ticket: Ticket; onClose?: () => void }

export function ChatWindow({ ticket, onClose }: Props) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { mensagens, addMensagem, setMensagens } = useChatStore()
  const { user } = useAuthStore()
  const msgs = mensagens[ticket.conversaId] || []

  useEffect(() => {
    mensagemService.listar(ticket.conversaId)
      .then((data) => setMensagens(ticket.conversaId, data))
      .catch(() => {})
  }, [ticket.conversaId, setMensagens])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  async function handleSend() {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      const msg = await mensagemService.enviar(ticket.conversaId, input.trim())
      addMensagem(ticket.conversaId, msg)
      setInput('')
    } catch {
      toast.error('Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  async function handleFechar() {
    try {
      await ticketService.fechar(ticket.id)
      toast.success('Atendimento finalizado')
      onClose?.()
    } catch {
      toast.error('Erro ao fechar ticket')
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <Avatar nome={ticket.clienteNome || 'Cliente'} size="md" />
          <div>
            <p className="text-sm font-medium text-slate-200">{ticket.clienteNome || 'Cliente'}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-500 font-mono">{ticket.protocolo}</span>
              <Badge label={ticket.status.replace('_', ' ')} className={`text-[10px] ${statusColor[ticket.status]}`} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleFechar} className="text-emerald-400 hover:bg-emerald-400/10">
            <CheckCircle2 className="w-4 h-4" /> Finalizar
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 chat-messages space-y-3">
        {msgs.length === 0 ? (
          <div className="text-center text-slate-600 text-sm py-12">
            Nenhuma mensagem ainda. Aguardando cliente...
          </div>
        ) : (
          msgs.map((msg) => (
            <MessageBubble key={msg.id} mensagem={msg} isOwn={msg.remetente === 'ATENDENTE'} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-800/60 bg-slate-900/40">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Digite uma mensagem... (Enter para enviar)"
            rows={1}
            className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 px-4 py-2.5 outline-none resize-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 max-h-32"
            style={{ minHeight: '42px' }}
          />
          <Button onClick={handleSend} loading={sending} disabled={!input.trim()} size="md" className="flex-shrink-0 h-[42px] w-[42px] p-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}