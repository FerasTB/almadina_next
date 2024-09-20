// hooks/useBookings.ts
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/components/AuthContext'

const fetchBookings = async (tripId: number, token: string) => {
  const response = await fetch(
    `https://madinaback.flaamingo.com/api/admin/trips/${tripId}/seats`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch bookings')
  }

  const data = await response.json()
  return data // Assuming data is an array of bookings
}

export const useBookings = (tripId: number) => {
  const { token } = useAuth()

  return useQuery(['bookings', tripId], () => fetchBookings(tripId, token!), {
    enabled: !!token,
  })
}
