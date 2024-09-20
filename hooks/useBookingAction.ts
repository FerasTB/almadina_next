// hooks/useBookingAction.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/components/AuthContext'

const performAction = async ({
  action,
  bookingIds,
  token,
  userId,
}: {
  action: 'approve' | 'reject'
  bookingIds: number[]
  token: string
  userId?: number
}) => {
  const response = await fetch(
    `https://madinaback.flaamingo.com/api/admin/bookings/${action}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ booking_ids: bookingIds, user_id: userId }),
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to ${action} bookings`)
  }

  const data = await response.json()
  return data
}

export const useBookingAction = () => {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation(
    ({ action, bookingIds, userId }: { action: 'approve' | 'reject'; bookingIds: number[]; userId?: number }) =>
      performAction({ action, bookingIds, token: token!, userId }),
    {
      onSuccess: () => {
        // Invalidate bookings query to refetch data
        queryClient.invalidateQueries(['bookings'])
      },
    }
  )
}
