import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../lib/errors'
import { registerUser } from '../services/authService'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await registerUser({ name, email, password })
      navigate('/login')
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo crear la cuenta'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="register-name" className="mb-1 block text-sm font-medium text-slate-700">Nombre</label>
          <input
            id="register-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-green-500"
          />
        </div>

        <div>
          <label htmlFor="register-email" className="mb-1 block text-sm font-medium text-slate-700">Correo electrónico</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="register-password" className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 outline-none transition focus:border-green-500"
            required
          />
        </div>

        {error && <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  )
}
