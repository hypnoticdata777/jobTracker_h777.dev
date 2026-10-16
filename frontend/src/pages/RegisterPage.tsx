import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@shared/schemas'
import type { RegisterInput } from '@shared/schemas'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterInput) => {
    try {
      await api.post('/api/auth/register', data)
      // after register, redirect to login
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm">Name</label>
          <input {...register('name')} className="mt-1 block w-full" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input {...register('email')} className="mt-1 block w-full" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" {...register('password')} className="mt-1 block w-full" />
        </div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Register</button>
      </form>
    </div>
  )
}
