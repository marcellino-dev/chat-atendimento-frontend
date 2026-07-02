export interface AuthResponse {
  token: string
  userId: number
  nome: string
  role: 'ADMIN' | 'ATENDENTE' | 'BOT'
}

export interface User {
  id: number
  nome: string
  email: string
  role: string
}
