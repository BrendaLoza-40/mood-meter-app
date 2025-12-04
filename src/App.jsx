import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import StartPage from './pages/StartPage'
import MoodSelect from './pages/MoodSelect'
import ThankYou from './pages/ThankYou'
import Dashboard from './pages/Dashboard'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'

function Header() {
  const { theme, setTheme, themes } = useTheme()
  
  return (
    <header className="app-header" style={{ background: theme.bg, borderBottom: `1px solid ${theme.accent}` }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ color: theme.text, margin: 0 }}>Mood Meter</h1>
        <nav style={{ marginLeft: 24 }}>
          <Link to="/" style={{ color: theme.primary }}>Tracker</Link>
          <Link to="/dashboard" style={{ color: theme.primary, marginLeft: 16 }}>Dashboard</Link>
        </nav>
      </div>
      <div>
        <select 
          value={theme.name}
          onChange={e => setTheme(e.target.value)}
          style={{ padding: '4px 8px', borderRadius: 4, border: `1px solid ${theme.accent}` }}
        >
          {Object.keys(themes).map(name => (
            <option key={name} value={name}>
              {name.charAt(0).toUpperCase() + name.slice(1)} theme
            </option>
          ))}
        </select>
      </div>
    </header>
  )
}

export default function App(){
  return (
    <ThemeProvider>
      <div className="app-root">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<StartPage/>} />
            <Route path="/select" element={<MoodSelect/>} />
            <Route path="/thankyou" element={<ThankYou/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}
