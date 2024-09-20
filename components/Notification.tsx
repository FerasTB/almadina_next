import { useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'

interface NotificationProps {
  message: string | null
  type: 'success' | 'error' | null
}

export const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  useEffect(() => {
    if (message && type) {
      if (type === 'success') {
        toast.success(message)
      } else if (type === 'error') {
        toast.error(message)
      }
    }
  }, [message, type])

  return <Toaster position="top-center" />
}