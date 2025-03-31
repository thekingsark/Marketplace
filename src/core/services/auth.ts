"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "firebase/auth"
import { AuthService } from "@/services/auth-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  logout: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  logout: async () => false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Initialize Firebase auth with error handling
        const initialized = await AuthService.initializeAuth()
        if (!initialized) {
          setError("Firebase authentication could not be initialized. Using default configuration for development.")
          setLoading(false)
          return
        }

        // Set up auth state listener
        await AuthService.getAuthUser((authUser) => {
          setUser(authUser)
          setLoading(false)
        })
      } catch (error) {
        console.error("Auth setup error:", error)
        setError("Authentication service error. Please check the console for details.")
        setLoading(false)
      }
    }

    setupAuth()

    return () => {
      AuthService.unsubAuthUser()
    }
  }, [])

  const logout = async () => {
    try {
      return await AuthService.logout()
    } catch (error) {
      console.error("Logout error:", error)
      return false
    }
  }

  return <AuthContext.Provider value={{ user, loading, error, logout }}>{children}</AuthContext.Provider>
}

