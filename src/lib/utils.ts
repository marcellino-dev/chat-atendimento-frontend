import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })
}

export function formatTime(date: string) {
  return format(new Date(date), 'HH:mm', { locale: ptBR })
}

export function formatDate(date: string) {
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export const prioridadeColor: Record<string, string> = {
  BAIXA:   'text-slate-400 bg-slate-400/10',
  NORMAL:  'text-blue-400 bg-blue-400/10',
  ALTA:    'text-amber-400 bg-amber-400/10',
  URGENTE: 'text-red-400 bg-red-400/10',
}

export const statusColor: Record<string, string> = {
  ABERTO:          'text-slate-300 bg-slate-500/20',
  EM_ATENDIMENTO:  'text-emerald-400 bg-emerald-400/10',
  TRANSFERIDO:     'text-amber-400 bg-amber-400/10',
  FECHADO:         'text-slate-500 bg-slate-500/10',
}
