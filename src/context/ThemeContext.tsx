import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme    : Theme
  toggle   : () => void
  isDark   : boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  theme  : 'dark',
  toggle : () => {},
  isDark : true,
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Read from localStorage on first render (the inline script in index.html
  // already set data-theme on <html>, so the page never flashes)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    return (localStorage.getItem('theme') as Theme) ?? 'dark'
  })

  // Keep data-theme attribute + localStorage in sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}
