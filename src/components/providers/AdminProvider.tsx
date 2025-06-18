'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@/payload-types'

interface AdminContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isBlogger: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

interface AdminProviderProps {
  children: React.ReactNode
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user
  const isAdmin = user?.role?.includes('admin') ?? false
  const isBlogger = user?.role?.includes('blogger') ?? false

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/users/me', {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const refreshUser = async (): Promise<void> => {
    await fetchUser()
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const value: AdminContextType = {
    user,
    isAuthenticated,
    isAdmin,
    isBlogger,
    loading,
    login,
    logout,
    refreshUser,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}