import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Initialize theme on page load to prevent FOUC
if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem("dashboardTheme") as Theme | null
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light")
  document.documentElement.classList.add(initialTheme)
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem("dashboardTheme") as Theme
    if (savedTheme) {
      return savedTheme
    }
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }
    return "light"
  }

  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    
    // Save to localStorage
    localStorage.setItem("dashboardTheme", theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

