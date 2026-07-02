'use client'
import { useEffect, useState } from 'react'
import { Plus, Users, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { StatusDot } from '@/components/ui/StatusDot'
import api from '@/services/api'
import type { Atendente, Setor } from '@/types'
import toast from 'react-hot-toast'

export default function ConfigPage() {
  const [atendentes, setAtendentes] = useState<Atendente[]>([])
  const [setores, setSetores] = useState<Setor[]>([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nome: '', email: '', senha: '', setorId: '' })

  async function carregar() {
    try {
      const [a, s] = await Promise.all([api.get('/atendentes'), api.get('/setores')])
      setAtendentes(a.data); setSetores(s.data)
    } catch { toast.error('Erro ao carregar dados') }
  }

  useEffect(() => { carregar() }, [])

  async function criarAtendente() {
    if (!form.nome || !form.email || !form.senha) return toast.error('Preencha todos os campos obrigatórios')
    setSaving(true)
    try {
      await api.post('/atendentes', { ...form, setorId: form.setorId ? Number(form.setorId) : null })
      toast.success('Atendente criado!')
      setShowForm(false)
      setForm({ nome: '', email: '', senha: '', setorId: '' })
      carregar()
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Erro ao criar atendente')
    } finally { setSaving(false) }
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Configurações</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gerencie atendentes e configurações do sistema</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Novo Atendente
        </Button>
      </div>

      {/* Form novo atendente */}
      {showForm && (
        <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-5 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">Novo Atendente</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Nome completo *" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="João Silva" />
            <Input label="Email *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="joao@empresa.com" />
            <Input label="Senha inicial *" type="password" value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} placeholder="Mínimo 6 caracteres" />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Setor</label>
              <select
                value={form.setorId}
                onChange={e => setForm(f => ({ ...f, setorId: e.target.value }))}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-lg text-sm text-slate-100 px-3 py-2.5 outline-none focus:border-brand-500"
              >
                <option value="">Selecionar setor</option>
                {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button size="sm" loading={saving} onClick={criarAtendente}>
              <Check className="w-3.5 h-3.5" /> Criar Atendente
            </Button>
          </div>
        </div>
      )}

      {/* Lista de atendentes */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl">
        <div className="px-5 py-3.5 border-b border-slate-800/60 flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-300">Atendentes ({atendentes.length})</span>
        </div>
        {atendentes.length === 0 ? (
          <div className="text-center py-10 text-slate-600 text-sm">Nenhum atendente cadastrado</div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {atendentes.map(a => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-800/20 transition-colors">
                <div className="relative">
                  <Avatar nome={a.nome} size="md" />
                  <span className="absolute -bottom-0.5 -right-0.5">
                    <StatusDot status={a.status as any} />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{a.nome}</p>
                  <p className="text-xs text-slate-500">{a.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  {a.setor && <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{a.setor}</span>}
                  <StatusDot status={a.status as any} showLabel />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
