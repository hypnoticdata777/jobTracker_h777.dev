export interface User {
  id: number
  email: string
  name: string | null
  createdAt: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface LoginRequest {
  email: string
  password: string
}
