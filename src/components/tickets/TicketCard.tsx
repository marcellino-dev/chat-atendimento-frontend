'use client'
import { Clock, User } from 'lucide-react'
import { cn, prioridadeColor, statusColor, formatTimeAgo } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import type { Ticket } from '@/types'

interface Props { ticket: Ticket; active?: boolean; onClick: () => void }

export function TicketCard({ ticket, active, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'px-4 py-3.5 border-b border-slate-800/50 cursor-pointer transition-all duration-150',
        active ? 'bg-brand-600/10 border-l-2 border-l-brand-500' : 'hover:bg-slate-800/40'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar nome={ticket.clienteNome || 'Cliente'} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{ticket.clienteNome || 'Cliente'}</p>
            <p className="text-[10px] text-slate-500 font-mono">{ticket.protocolo}</p>
          </div>
        </div>
        <Badge label={ticket.prioridade} className={prioridadeColor[ticket.prioridade]} />
      </div>

      <div className="flex items-center justify-between">
        <Badge label={ticket.status.replace('_', ' ')} className={cn('text-[10px]', statusColor[ticket.status])} />
        <div className="flex items-center gap-1 text-[10px] text-slate-600">
          <Clock className="w-3 h-3" />
          {formatTimeAgo(ticket.createdAt)}
        </div>
      </div>

      {ticket.setor && (
        <p className="text-[10px] text-slate-600 mt-1.5 flex items-center gap-1">
          <User className="w-2.5 h-2.5" /> {ticket.setor.nome}
        </p>
      )}
    </div>
  )
}
