import { cn } from '@/lib/utils'

interface StatusDotProps { status: 'ONLINE' | 'OFFLINE' | 'AUSENTE'; showLabel?: boolean }

const map = {
  ONLINE:  { dot: 'bg-emerald-400', label: 'Online' },
  OFFLINE: { dot: 'bg-slate-500',   label: 'Offline' },
  AUSENTE: { dot: 'bg-amber-400',   label: 'Ausente' },
}

export function StatusDot({ status, showLabel }: StatusDotProps) {
  const { dot, label } = map[status]
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('w-2 h-2 rounded-full flex-shrink-0', dot, status === 'ONLINE' && 'animate-pulse-dot')} />
      {showLabel && <span className="text-xs text-slate-400">{label}</span>}
    </span>
  )
}
