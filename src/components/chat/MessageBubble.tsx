import { cn, formatTime } from '@/lib/utils'
import type { Mensagem } from '@/types'

interface Props { mensagem: Mensagem; isOwn: boolean }

export function MessageBubble({ mensagem, isOwn }: Props) {
  return (
    <div className={cn('flex flex-col gap-1 max-w-[75%]', isOwn ? 'ml-auto items-end' : 'items-start')}>
      {!isOwn && (
        <span className="text-[10px] text-slate-500 px-1">
          {mensagem.remetente === 'BOT' ? '🤖 Bot' : 'Cliente'}
        </span>
      )}
      <div className={cn(
        'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
        isOwn
          ? 'bg-brand-600 text-white rounded-br-sm'
          : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700/50'
      )}>
        {mensagem.conteudo}
      </div>
      <span className="text-[10px] text-slate-600 px-1">{formatTime(mensagem.createdAt)}</span>
    </div>
  )
}
