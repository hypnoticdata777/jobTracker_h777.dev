import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@shared/schemas'
import type { LoginInput } from '@shared/schemas'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    try {
      await api.post('/api/auth/login', data)
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input {...register('email')} className="mt-1 block w-full" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" {...register('password')} className="mt-1 block w-full" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Sign in</button>
      </form>
    </div>
  )
}
