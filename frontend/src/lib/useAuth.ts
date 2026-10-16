import { useQuery } from '@tanstack/react-query'
import api from './api'

export default function useAuth() {
  const { data, isLoading } = useQuery(['me'], async () => {
    const res = await api.get('/api/auth/me')
    return res.data
  }, { retry: false })

  return { user: data, isLoading }
}
