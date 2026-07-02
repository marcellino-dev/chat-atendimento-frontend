import api from './api'
import type { Mensagem } from '@/types'

export const whatsappService = {
  // Envia mensagem WhatsApp via backend
  async enviarWhatsApp(telefone: string, mensagem: string): Promise<void> {
    await api.post('/whatsapp/enviar', { telefone, mensagem })
  },

  // Testa envio manual
  async testarEnvio(telefone: string, mensagem: string): Promise<void> {
    await api.post('/whatsapp/testar', { telefone, mensagem })
  },

  // Obtém QR Code da instância
  async getQRCode(): Promise<string> {
    const { data } = await api.get('/whatsapp/qrcode')
    return data
  },

  // Verifica status da instância
  async getStatus(): Promise<any> {
    const { data } = await api.get('/whatsapp/status')
    return data
  },

  // Webhook (chamado pela Evolution API)
  async webhook(payload: any): Promise<void> {
    await api.post('/whatsapp/webhook', payload)
  }
}