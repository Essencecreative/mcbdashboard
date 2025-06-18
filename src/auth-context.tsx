import React, { createContext, useContext, useState, useEffect } from "react"
import {jwtDecode} from "jwt-decode"

type UserPayload = {
  username: string
  email?: string
  role?: string
  photo?: string
  id?: string
}

type AuthContextType = {
  isAuthenticated: boolean
  token: string | null
  user: UserPayload | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [user, setUser] = useState<UserPayload | null>(null)

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<UserPayload>(token)
        setUser(decoded)
      } catch {
        logout() // If decoding fails, logout and remove token
      }
    }
  }, [token])

  const login = (newToken: string) => {
    const decoded = jwtDecode<UserPayload>(newToken)
    setToken(newToken)
    setUser(decoded)
    localStorage.setItem("token", newToken)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
