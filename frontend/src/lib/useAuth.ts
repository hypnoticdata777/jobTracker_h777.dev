import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../services/authService'

export default function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    retry: false,
  })

  return { user: data, isLoading }
}
