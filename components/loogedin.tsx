'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'

export function loogedin<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAdminAuth(props: P) {
    const { token, isAdmin } = useAuth()
    const router = useRouter()

    useEffect(() => {
if(token != null) {
        if(isAdmin){
            router.push('/admin')
        } else {
        router.push('/user')
        }
      }
    }, [token, isAdmin, router])

    if (token === null || !isAdmin) {
      return null // or a loading spinner
    }

    return <WrappedComponent {...props} />
  }
}