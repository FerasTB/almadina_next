// hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/components/AuthContext'

const fetchUsers = async (token: string) => {
  const response = await fetch('https://madinaback.flaamingo.com/api/admin/non-admin', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  const data = await response.json()
  return data // Assuming data is an array of users
}

export const useUsers = () => {
  const { token } = useAuth()

  return useQuery(['users'], () => fetchUsers(token!), {
    enabled: !!token,
  })
}
