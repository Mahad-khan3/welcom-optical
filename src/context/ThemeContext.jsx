import { createContext, useContext, useEffect, useState } from 'react'
import { safeGet, safeSet } from '../utils/storage'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = safeGet('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    safeSet('theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
