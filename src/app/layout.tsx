import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chat Atendimento',
  description: 'Sistema de atendimento ao cliente',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' },
            success: { iconTheme: { primary: '#34d399', secondary: '#0b1120' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#0b1120' } },
          }}
        />
      </body>
    </html>
  )
}
