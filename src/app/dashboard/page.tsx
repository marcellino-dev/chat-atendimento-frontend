'use client'
import { useEffect, useState } from 'react'
import { MessageSquare, Users, Clock, CheckCircle, TrendingUp, Zap } from 'lucide-react'
import { setorService } from '@/services/setorService'
import type { Setor } from '@/types'

interface StatCard { label: string; value: string | number; icon: React.ReactNode; color: string; sub?: string }

function StatCard({ label, value, icon, color, sub }: StatCard) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5 flex items-start gap-4 hover:border-slate-700/60 transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-emerald-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [setores, setSetores] = useState<Setor[]>([])

  useEffect(() => {
    setorService.listar().then(setSetores).catch(() => {})
  }, [])

  const stats: StatCard[] = [
    { label: 'Em atendimento', value: 0, icon: <MessageSquare className="w-5 h-5 text-brand-400" />, color: 'bg-brand-500/15', sub: '↑ tempo real' },
    { label: 'Aguardando na fila', value: 0, icon: <Clock className="w-5 h-5 text-amber-400" />, color: 'bg-amber-500/15' },
    { label: 'Atendentes online', value: 0, icon: <Users className="w-5 h-5 text-emerald-400" />, color: 'bg-emerald-500/15' },
    { label: 'Finalizados hoje', value: 0, icon: <CheckCircle className="w-5 h-5 text-slate-400" />, color: 'bg-slate-500/15' },
  ]

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-100">Visão Geral</h1>
        <p className="text-sm text-slate-500 mt-0.5">Acompanhe os atendimentos em tempo real</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Setores */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-400" /> Setores ativos
          </h2>
          <span className="text-xs text-slate-500">{setores.length} setores</span>
        </div>
        {setores.length === 0 ? (
          <p className="text-sm text-slate-600 text-center py-6">Nenhum setor cadastrado ainda</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {setores.map((s) => (
              <div key={s.id} className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-800/40 rounded-lg border border-slate-700/40">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-slate-300">{s.nome}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
