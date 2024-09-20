'use client'

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'

interface AuthContextType {
  token: string | null
  isAdmin: boolean
  login: (token: string, isAdmin: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

 

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedIsAdmin = localStorage.getItem('isAdmin')
    console.log(localStorage)
    if (storedToken) {
      setToken(storedToken)
      console.log(storedToken)
      setIsAdmin(storedIsAdmin === 'true')
    }
  }, [])

  const login = useCallback((newToken: string, adminStatus: boolean) => {
    setToken(newToken)
    setIsAdmin(adminStatus)
    localStorage.setItem('token', newToken)
    localStorage.setItem('isAdmin', adminStatus.toString())
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setIsAdmin(false)
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
  }, [])

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
