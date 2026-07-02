'use client'
import { useState } from 'react'
import { whatsappService } from '@/services/whatsappService'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export function WhatsAppTester() {
  const [telefone, setTelefone] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEnviar = async () => {
    if (!telefone || !mensagem) {
      toast.error('Preencha telefone e mensagem')
      return
    }
    setLoading(true)
    try {
      await whatsappService.enviarWhatsApp(telefone, mensagem)
      toast.success('Mensagem enviada!')
      setMensagem('')
    } catch (error) {
      toast.error('Erro ao enviar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <h3 className="text-white font-medium mb-3">Teste WhatsApp</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Telefone (ex: 5591991552191)"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
        />
        <textarea
          placeholder="Mensagem"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white resize-none"
        />
        <Button onClick={handleEnviar} loading={loading} className="w-full">
          Enviar WhatsApp
        </Button>
      </div>
    </div>
  )
}