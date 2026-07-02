'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, MessageSquare, Users, Settings,
  LogOut, Headphones, Bell
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Avatar } from '@/components/ui/Avatar'
import { StatusDot } from '@/components/ui/StatusDot'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',      icon: LayoutDashboard, label: 'Visão Geral' },
  { href: '/atendimento',    icon: MessageSquare,   label: 'Atendimentos' },
  { href: '/dashboard/setores', icon: Users,        label: 'Setores' },
  { href: '/dashboard/config',  icon: Settings,     label: 'Configurações' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-slate-800/60 flex flex-col bg-slate-900/40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm">
              <Headphones className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">Chat Desk</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Atendimento</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group',
                  active
                    ? 'bg-brand-600/15 text-brand-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )}
              >
                <Icon className={cn('w-4 h-4', active ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300')} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="relative">
              <Avatar nome={user?.nome ?? 'U'} size="sm" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{user?.nome}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.role}</p>
            </div>
            <button onClick={() => { logout(); router.push('/login') }} className="text-slate-600 hover:text-red-400 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
