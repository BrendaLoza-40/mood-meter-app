import React, { createContext, useContext, useState } from 'react'

const themes = {
  day: {
    name: 'day',
    bg: 'var(--theme-day-bg)',
    primary: 'var(--theme-day-primary)',
    secondary: 'var(--theme-day-secondary)',
    accent: 'var(--theme-day-accent)',
    text: 'var(--theme-day-text)'
  },
  dark: {
    name: 'dark',
    bg: 'var(--theme-dark-bg)',
    primary: 'var(--theme-dark-primary)',
    secondary: 'var(--theme-dark-secondary)',
    accent: 'var(--theme-dark-accent)',
    text: 'var(--theme-dark-text)'
  },
  lightblue: {
    name: 'lightblue',
    bg: 'var(--theme-lightblue-bg)',
    primary: 'var(--theme-lightblue-primary)',
    secondary: 'var(--theme-lightblue-secondary)',
    accent: 'var(--theme-lightblue-accent)',
    text: 'var(--theme-lightblue-text)'
  },
  yellow: {
    name: 'yellow',
    bg: 'var(--theme-yellow-bg)',
    primary: 'var(--theme-yellow-primary)',
    secondary: 'var(--theme-yellow-secondary)',
    accent: 'var(--theme-yellow-accent)',
    text: 'var(--theme-yellow-text)'
  }
}

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(themes.day)

  const value = {
    theme,
    setTheme: (name) => setTheme(themes[name] || themes.day),
    themes
  }

  return (
    <ThemeContext.Provider value={value}>
      <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)