'use client'
import { useEffect, useRef, useCallback } from 'react'
import { Client, type IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'
import { useTicketStore } from '@/store/ticketStore'

export function useWebSocket() {
  const clientRef = useRef<Client | null>(null)
  const { token } = useAuthStore()
  const { addConversaWhatsApp, addMensagemWhatsApp } = useChatStore()
  const { addTicketFila } = useTicketStore()

  const connect = useCallback(() => {
    if (!token || clientRef.current?.connected) return

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/api/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket conectado')
        
        client.subscribe('/topic/fila', (msg: IMessage) => {
          const ticket = JSON.parse(msg.body)
          console.log('Ticket na fila:', ticket)
          addTicketFila(ticket)
        })
        
        client.subscribe('/topic/whatsapp-mensagens', (msg: IMessage) => {
          const data = JSON.parse(msg.body)
          console.log('Mensagem WhatsApp:', data)
          
          addMensagemWhatsApp({
            id: Date.now().toString(),
            telefone: data.telefone,
            nome: data.nome,
            mensagem: data.mensagem,
            remetente: data.remetente,
            timestamp: data.timestamp,
            lida: false
          })
          
          addConversaWhatsApp(data.telefone, data.nome, data.mensagem, data.timestamp)
        })
      },
      onDisconnect: () => console.log('WebSocket desconectado'),
    })

    client.activate()
    clientRef.current = client
  }, [token, addTicketFila, addMensagemWhatsApp, addConversaWhatsApp])

  const sendWhatsAppReply = useCallback((telefone: string, mensagem: string, atendenteNome: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: '/app/whatsapp.responder',
        body: JSON.stringify({ telefone, mensagem, atendenteNome }),
      })
    }
  }, [])

  useEffect(() => {
    connect()
    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.deactivate()
      }
    }
  }, [connect])

  return { sendWhatsAppReply, connected: clientRef.current?.connected ?? false }
}