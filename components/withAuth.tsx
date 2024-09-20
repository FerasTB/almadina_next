'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuth(props: P) {
    const { token, isAdmin } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true) // State to control render

    useEffect(() => {
      if (!token) {
        router.push('/sign-in')
      } else if (isAdmin) {
        router.push('/admin')
      } else {
        setLoading(false) // Only allow render when checks are done
      }
    }, [token, isAdmin, router])

    if (loading) {
      return <div>Loading...</div>
    }

    return <WrappedComponent {...props} />
  }
}
