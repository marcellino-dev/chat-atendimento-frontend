import { cn } from '@/lib/utils'

interface AvatarProps { nome: string; size?: 'sm' | 'md' | 'lg'; className?: string }

export function Avatar({ nome, size = 'md', className }: AvatarProps) {
  const initials = nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' }
  const colors = ['bg-brand-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-violet-600']
  const color = colors[nome.charCodeAt(0) % colors.length]
  return (
    <div className={cn('rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0', sizes[size], color, className)}>
      {initials}
    </div>
  )
}
