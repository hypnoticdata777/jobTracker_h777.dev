import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../lib/useAuth'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, user } = useAuth()

  if (isLoading) return <div>Cargando...</div>
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}

export default ProtectedRoute
