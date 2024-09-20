'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'

export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAdminAuth(props: P) {
    const { token, isAdmin } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true) // State to avoid rendering when checking auth

    useEffect(() => {
      if (!token) {
        router.push('/sign-in')
      } else if (!isAdmin) {
        router.push('/unauthorized')
      } else {
        setLoading(false) // Only allow render when checks are done
      }
    }, [token, isAdmin, router])

    if (loading) {
      return <div>Loading...</div> // or any loading spinner
    }

    return <WrappedComponent {...props} />
  }
}
