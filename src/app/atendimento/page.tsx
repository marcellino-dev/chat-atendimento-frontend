'use client'
import { useEffect, useState, useRef } from 'react'
import { Inbox, RefreshCw, Send, CheckCircle2, X, User, Clock, Phone } from 'lucide-react'
import { TicketCard } from '@/components/tickets/TicketCard'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { useTicketStore } from '@/store/ticketStore'
import { useChatStore } from '@/store/chatStore'
import { ticketService } from '@/services/ticketService'
import { mensagemService } from '@/services/mensagemService'
import { useWebSocket } from '@/hooks/useWebSocket'
import { statusColor, formatTimeAgo } from '@/lib/utils'
import type { Ticket } from '@/types'
import toast from 'react-hot-toast'

export default function AtendimentoPage() {
  const { meusTickets, fila, setMeusTickets, setFila, ticketAtivo, setTicketAtivo } = useTicketStore()
  const { mensagens, setMensagens, addMensagem } = useChatStore()
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'meus' | 'fila'>('meus')
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  

  const msgs = ticketAtivo ? (mensagens[ticketAtivo.conversaId] || []) : []

  async function carregar() {
    setLoading(true)
    try {
      const [meus, filaData] = await Promise.all([
        ticketService.listarMeus(),
        ticketService.listarFila()
      ])
      setMeusTickets(meus)
      setFila(filaData)
    } catch { toast.error('Erro ao carregar tickets') }
    finally { setLoading(false) }
  }

  useEffect(() => { carregar() }, [])

  // Carrega mensagens quando abre um ticket
  useEffect(() => {
    if (!ticketAtivo) return
    mensagemService.listar(ticketAtivo.conversaId)
      .then(data => setMensagens(ticketAtivo.conversaId, data))
      .catch(() => {})
  }, [ticketAtivo?.id])

  // Auto scroll para última mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  async function assumir(ticket: Ticket) {
    try {
      const assumido = await ticketService.assumir(ticket.id)
      toast.success('Ticket assumido! O cliente foi notificado.')
      setTicketAtivo(assumido)
      setTab('meus')
      await carregar()
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Erro ao assumir ticket')
    }
  }

  async function fechar() {
    if (!ticketAtivo) return
    try {
      await ticketService.fechar(ticketAtivo.id)
      toast.success('Atendimento finalizado!')
      setTicketAtivo(null)
      await carregar()
    } catch { toast.error('Erro ao fechar ticket') }
  }

  async function enviarMensagem() {
    if (!input.trim() || !ticketAtivo || sending) return
    setSending(true)
    try {
      const msg = await mensagemService.enviar(ticketAtivo.conversaId, input.trim())
      addMensagem(ticketAtivo.conversaId, msg)
      setInput('')
    } catch { toast.error('Erro ao enviar mensagem') }
    finally { setSending(false) }
  }

  const lista = tab === 'meus' ? meusTickets : fila

  return (
    <div className="flex h-full">
      {/* Ticket list */}
      <div className="w-72 flex-shrink-0 border-r border-slate-800/60 flex flex-col bg-slate-900/20">
        <div className="px-4 py-3 border-b border-slate-800/60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-200">Tickets</h2>
            <Button variant="ghost" size="sm" onClick={carregar}>
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex bg-slate-800/60 rounded-lg p-0.5 gap-0.5">
            {(['meus', 'fila'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  tab === t ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'
                }`}>
                {t === 'meus' ? `Meus (${meusTickets.length})` : `Fila (${fila.length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {lista.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-slate-600">
              <Inbox className="w-8 h-8 mb-2" />
              <p className="text-xs">{tab === 'meus' ? 'Nenhum ticket ativo' : 'Fila vazia'}</p>
              {tab === 'fila' && (
                <p className="text-[10px] text-slate-700 mt-1 text-center px-4">
                  Novos tickets aparecem aqui automaticamente
                </p>
              )}
            </div>
          ) : (
            lista.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                active={ticketAtivo?.id === ticket.id}
                onClick={() => tab === 'fila' ? assumir(ticket) : setTicketAtivo(ticket)}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {ticketAtivo ? (
          <>
            {/* Header do chat */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60 bg-slate-900/60">
              <div className="flex items-center gap-3">
                <Avatar nome={ticketAtivo.clienteNome || 'Cliente'} size="md" />
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {ticketAtivo.clienteNome || 'Cliente'}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-500 font-mono">{ticketAtivo.protocolo}</span>
                    <Badge label={ticketAtivo.status.replace('_', ' ')}
                      className={`text-[10px] ${statusColor[ticketAtivo.status]}`} />
                    <Badge label={ticketAtivo.setor?.nome || ''} className="text-[10px] text-brand-400 bg-brand-400/10" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {ticketAtivo.clienteTel && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                    <Phone className="w-3 h-3" />
                    {ticketAtivo.clienteTel}
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={fechar}
                  className="text-emerald-400 hover:bg-emerald-400/10">
                  <CheckCircle2 className="w-4 h-4" /> Finalizar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setTicketAtivo(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {msgs.length === 0 ? (
                <div className="text-center text-slate-600 text-sm py-12">
                  <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>Nenhuma mensagem ainda</p>
                  <p className="text-xs mt-1">As mensagens do WhatsApp aparecem aqui em tempo real</p>
                </div>
              ) : (
                msgs.map((msg) => (
                  <MessageBubble key={msg.id} mensagem={msg} isOwn={msg.remetente === 'ATENDENTE'} />
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input de mensagem */}
            <div className="px-4 py-3 border-t border-slate-800/60 bg-slate-900/40">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      enviarMensagem()
                    }
                  }}
                  placeholder="Digite uma mensagem... (Enter para enviar, Shift+Enter para nova linha)"
                  rows={1}
                  className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 px-4 py-2.5 outline-none resize-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 max-h-32"
                  style={{ minHeight: '42px' }}
                />
                <Button
                  onClick={enviarMensagem}
                  loading={sending}
                  disabled={!input.trim()}
                  size="md"
                  className="flex-shrink-0 h-[42px] w-[42px] p-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-slate-600 mt-1.5 px-1">
                💬 Mensagens enviadas aqui chegam no WhatsApp do cliente
              </p>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center">
              <Inbox className="w-7 h-7" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">Nenhum atendimento selecionado</p>
              <p className="text-xs text-slate-600 mt-1">
                Selecione um ticket ou assuma da fila
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}