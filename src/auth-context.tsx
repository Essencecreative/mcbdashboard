import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router"
import { toast } from "./hooks/use-toast"
import { setTokenExpiredCallback } from "./api/client"

type UserPayload = {
  username: string
  email?: string
  role?: string
  photo?: string
  id?: string
  exp?: number
  iat?: number
}

type AuthContextType = {
  isAuthenticated: boolean
  token: string | null
  user: UserPayload | null
  login: (token: string) => void
  logout: (showMessage?: boolean) => void
  checkTokenExpiration: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [user, setUser] = useState<UserPayload | null>(null)
  const expirationCheckInterval = useRef<NodeJS.Timeout | null>(null)
  const navigateRef = useRef<((path: string) => void) | null>(null)

  // Check if token is expired
  const isTokenExpired = useCallback((tokenToCheck: string): boolean => {
    try {
      const decoded = jwtDecode<UserPayload>(tokenToCheck)
      
      // Check if token has expiration claim
      if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000)
        return decoded.exp < currentTime
      }
      
      // If no expiration claim, consider it valid (for backward compatibility)
      return false
    } catch {
      // If decoding fails, consider it expired
      return true
    }
  }, [])

  // Internal logout function that doesn't depend on useCallback
  const performLogout = useCallback((showMessage: boolean = false) => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")

    // Clear expiration check interval
    if (expirationCheckInterval.current) {
      clearInterval(expirationCheckInterval.current)
      expirationCheckInterval.current = null
    }

    if (showMessage) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please login again.",
        variant: "destructive",
      })
      
      // Navigate to login page
      if (navigateRef.current) {
        navigateRef.current("/login")
      } else {
        // Fallback: use window location if navigate is not available
        window.location.href = "/login"
      }
    }
  }, [])

  // Check token expiration and logout if expired
  const checkTokenExpiration = useCallback((): boolean => {
    if (!token) return false
    
    if (isTokenExpired(token)) {
      performLogout(true)
      return true
    }
    
    return false
  }, [token, isTokenExpired, performLogout])

  // Setup automatic token expiration checking
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<UserPayload>(token)
        setUser(decoded)

        // Check expiration immediately
        if (isTokenExpired(token)) {
          performLogout(true)
          return
        }

        // Set up interval to check token expiration every minute
        expirationCheckInterval.current = setInterval(() => {
          const currentToken = localStorage.getItem("token")
          if (currentToken && isTokenExpired(currentToken)) {
            performLogout(true)
          }
        }, 60000) // Check every minute

      } catch (error) {
        // If decoding fails, logout
        performLogout(true)
      }
    } else {
      // Clear interval if no token
      if (expirationCheckInterval.current) {
        clearInterval(expirationCheckInterval.current)
        expirationCheckInterval.current = null
      }
      setUser(null)
    }

    // Cleanup interval on unmount
    return () => {
      if (expirationCheckInterval.current) {
        clearInterval(expirationCheckInterval.current)
      }
    }
  }, [token, isTokenExpired, performLogout])

  // Setup token expired callback for API client
  useEffect(() => {
    setTokenExpiredCallback(() => {
      performLogout(true)
    })
  }, [performLogout])

  const login = useCallback((newToken: string) => {
    try {
      // Validate token before setting
      if (isTokenExpired(newToken)) {
        toast({
          title: "Invalid Token",
          description: "The provided token has already expired. Please login again.",
          variant: "destructive",
        })
        return
      }

      const decoded = jwtDecode<UserPayload>(newToken)
      setToken(newToken)
      setUser(decoded)
      localStorage.setItem("token", newToken)

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Failed to process authentication token.",
        variant: "destructive",
      })
    }
  }, [isTokenExpired])

  const logout = useCallback((showMessage: boolean = false) => {
    performLogout(showMessage)
  }, [performLogout])

  const isAuthenticated = !!token && !checkTokenExpiration()

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, checkTokenExpiration }}>
      <AuthNavigator navigateRef={navigateRef} />
      {children}
    </AuthContext.Provider>
  )
}

// Helper component to get navigate function
const AuthNavigator = ({ navigateRef }: { navigateRef: React.MutableRefObject<((path: string) => void) | null> }) => {
  const navigate = useNavigate()
  
  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate, navigateRef])

  return null
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
