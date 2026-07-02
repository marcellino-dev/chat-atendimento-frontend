'use client'
import { useState, useEffect } from 'react'
import { WhatsAppConversas } from '@/components/whatsapp/WhatsAppConversas'
import { WhatsAppChat } from '@/components/whatsapp/WhatsAppChat'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export default function WhatsAppPage() {
  const [selected, setSelected] = useState<{ telefone: string; nome: string } | null>(null)
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const handleSelectConversa = (telefone: string, nome: string) => {
    setSelected({ telefone, nome })
  }

  return (
    <div className="h-screen flex">
      <div className="w-80 hidden lg:block">
        <WhatsAppConversas 
          onSelectConversa={handleSelectConversa}
          selectedTelefone={selected?.telefone}
        />
      </div>
      <div className="flex-1">
        {selected ? (
          <WhatsAppChat 
            telefone={selected.telefone} 
            nome={selected.nome}
            onBack={() => setSelected(null)}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-slate-950">
            <p className="text-slate-500">Selecione uma conversa</p>
          </div>
        )}
      </div>
    </div>
  )
}