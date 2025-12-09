"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { iamAPI, clearCache } from "@/lib/api-client"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (phone: string, password: string, organizationId?: string, isDefault?: boolean) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  switchOrganization: (organizationId: string, password: string, isDefault: boolean) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
      if (!token) {
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      const result = await iamAPI.getCurrentUser()
      if (result.data) {
        setUser(result.data)
        setIsAuthenticated(true)
      }
      
       else {
        // Token is invalid, clear it
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token")
          localStorage.removeItem("refresh_token")
        }
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("refresh_token")
      }
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (phone: string, password: string, organizationId?: string, isDefault?: boolean): Promise<boolean> => {
    try {
      const result = await iamAPI.login({ phone, password, organization_id: organizationId, is_default: isDefault })
      if (result.data) {
        await checkAuth()
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const switchOrganization = async (organizationId: string, password: string, isDefault: boolean): Promise<boolean> => {
    if (!user || !password) return false
    
    try {
      // Clear all caches before switching organization
      clearCache()
      
      const result = await iamAPI.login({ 
        phone: user.phone, 
        password,
        organization_id: organizationId,
        is_default: isDefault
      })
      if (result.data) {
        await checkAuth()
        return true
      }
      return false
    } catch (error) {
      console.error("Switch organization failed:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await iamAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("refresh_token")
      }
      router.push("/login")
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Check auth on window focus (to detect token expiration)
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        checkAuth()
      }
    }

    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [isAuthenticated])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, checkAuth, switchOrganization }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

