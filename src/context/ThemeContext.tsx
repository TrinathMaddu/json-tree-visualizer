import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme | null
    if (saved) return saved
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    return prefersDark ? "dark" : "light"
  })

  const setTheme = (t: Theme) => setThemeState(t)

  useEffect(() => {
    document.body.classList.remove("theme-light", "theme-dark")
    document.body.classList.add(`theme-${theme}`)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () =>
    setThemeState((t) => (t === "light" ? "dark" : "light"))

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
