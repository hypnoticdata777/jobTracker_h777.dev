import api from '../lib/api'
import type { LoginRequest, RegisterRequest, User } from '../types/auth'

export async function registerUser(input: RegisterRequest): Promise<User> {
  const response = await api.post('/api/auth/register', input)
  return response.data
}

export async function loginUser(input: LoginRequest): Promise<User> {
  const response = await api.post('/api/auth/login', input)
  return response.data
}

export async function logoutUser(): Promise<{ message: string }> {
  const response = await api.post('/api/auth/logout')
  return response.data
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get('/api/auth/me')
  return response.data
}
