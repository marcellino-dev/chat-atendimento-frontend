'use client'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Layers } from 'lucide-react'
import { setorService } from '@/services/setorService'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Setor } from '@/types'
import toast from 'react-hot-toast'

export default function SetoresPage() {
  const [setores, setSetores] = useState<Setor[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Setor | null>(null)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [saving, setSaving] = useState(false)

  async function carregar() {
    setLoading(true)
    try { setSetores(await setorService.listar()) }
    catch { toast.error('Erro ao carregar setores') }
    finally { setLoading(false) }
  }

  useEffect(() => { carregar() }, [])

  function abrirForm(setor?: Setor) {
    setEditando(setor || null)
    setNome(setor?.nome || '')
    setDescricao(setor?.descricao || '')
    setShowForm(true)
  }

  function fecharForm() { setShowForm(false); setEditando(null); setNome(''); setDescricao('') }

  async function salvar() {
    if (!nome.trim()) return toast.error('Nome é obrigatório')
    setSaving(true)
    try {
      if (editando) {
        await setorService.atualizar(editando.id, nome, descricao)
        toast.success('Setor atualizado!')
      } else {
        await setorService.criar(nome, descricao)
        toast.success('Setor criado!')
      }
      fecharForm()
      carregar()
    } catch { toast.error('Erro ao salvar setor') }
    finally { setSaving(false) }
  }

  async function desativar(id: number) {
    if (!confirm('Desativar este setor?')) return
    try { await setorService.desativar(id); toast.success('Setor desativado'); carregar() }
    catch { toast.error('Erro ao desativar') }
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Setores</h1>
          <p className="text-sm text-slate-500 mt-0.5">Gerencie os setores de atendimento</p>
        </div>
        <Button onClick={() => abrirForm()}>
          <Plus className="w-4 h-4" /> Novo Setor
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-5 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">
              {editando ? 'Editar Setor' : 'Novo Setor'}
            </h2>
            <button onClick={fecharForm} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Suporte Técnico" />
            <Input label="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição do setor" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={fecharForm}>Cancelar</Button>
            <Button size="sm" loading={saving} onClick={salvar}>
              <Check className="w-3.5 h-3.5" /> Salvar
            </Button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="grid gap-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-800/40 rounded-xl animate-pulse" />
          ))
        ) : setores.length === 0 ? (
          <div className="text-center py-12 text-slate-600">
            <Layers className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Nenhum setor cadastrado</p>
          </div>
        ) : (
          setores.map(s => (
            <div key={s.id} className="flex items-center justify-between px-5 py-4 bg-slate-900/60 border border-slate-800/60 rounded-xl hover:border-slate-700/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">{s.nome}</p>
                  {s.descricao && <p className="text-xs text-slate-500 mt-0.5">{s.descricao}</p>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => abrirForm(s)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => desativar(s.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
