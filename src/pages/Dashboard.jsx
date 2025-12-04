import React, { useEffect, useMemo, useState } from 'react'
import { getEntries, clearEntries } from '../services/storage'
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, CartesianGrid 
} from 'recharts'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import { format, subDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns'
import { useTheme } from '../contexts/ThemeContext'
import { emotions } from '../data/emotions'

// Flatten all emotions into one array for the dropdown
const allEmotions = Object.values(emotions).flat()

function formatDateIso(d){
  return new Date(d).toISOString().slice(0,10)
}

const PRESET_RANGES = [
  { label: 'Last 7 days', getValue: () => formatDateIso(subDays(new Date(), 7)) },
  { label: 'Last 30 days', getValue: () => formatDateIso(subDays(new Date(), 30)) },
  { label: 'This week', getValue: () => formatDateIso(startOfWeek(new Date())) },
  { label: 'This month', getValue: () => formatDateIso(startOfMonth(new Date())) },
  { label: 'This year', getValue: () => formatDateIso(startOfYear(new Date())) }
]

export default function Dashboard(){
  const { theme } = useTheme()
  const [entries, setEntries] = useState([])
  const [dateSearch, setDateSearch] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [highlightMood, setHighlightMood] = useState('')
  const [compareMode, setCompareMode] = useState(false)
  const [mood1, setMood1] = useState('')
  const [mood2, setMood2] = useState('')

  useEffect(()=>{
    setEntries(getEntries())
  },[])

  function reload(){ setEntries(getEntries()) }

  const filtered = useMemo(()=>{
    let list = entries
    if(dateSearch) list = list.filter(e=>e.dateOnly===dateSearch)
    if(from) list = list.filter(e=>e.dateOnly>=from)
    if(to) list = list.filter(e=>e.dateOnly<=to)
    return list
  },[entries,dateSearch,from,to])

  // Build trend data aggregated by date and L2 label counts
  const trend = useMemo(()=>{
    const map = {}
    filtered.forEach(e=>{
      const d = e.dateOnly
      map[d] = map[d] || { date: d }
      const key = e.l2.label
      map[d][key] = (map[d][key] || 0) + 1
    })
    return Object.values(map).sort((a,b)=>a.date.localeCompare(b.date))
  },[filtered])

  // Build correlation data when two moods are selected
  const correlationData = useMemo(()=>{
    if(!mood1 || !mood2) return []
    const map = {}
    filtered.forEach(e=>{
      const d = e.dateOnly
      if(!map[d]) map[d] = { date: d, mood1Count: 0, mood2Count: 0 }
      if(e.l2.label === mood1) map[d].mood1Count++
      if(e.l2.label === mood2) map[d].mood2Count++
    })
    return Object.values(map)
  },[filtered, mood1, mood2])

  // Calculate correlation coefficient
  const correlation = useMemo(()=>{
    if(correlationData.length < 2) return null
    const x = correlationData.map(d => d.mood1Count)
    const y = correlationData.map(d => d.mood2Count)
    const n = x.length
    const sum_x = x.reduce((a,b) => a+b, 0)
    const sum_y = y.reduce((a,b) => a+b, 0)
    const sum_xy = x.reduce((sum,xi,i) => sum + xi*y[i], 0)
    const sum_xx = x.reduce((sum,xi) => sum + xi*xi, 0)
    const sum_yy = y.reduce((sum,yi) => sum + yi*yi, 0)
    
    const r = (n*sum_xy - sum_x*sum_y) / 
              Math.sqrt((n*sum_xx - sum_x*sum_x) * (n*sum_yy - sum_y*sum_y))
    return isNaN(r) ? 0 : r
  },[correlationData])

  function exportCSV(){
    const header = ['id','timestamp','date','l1','l2','timeToSelectMs']
    const rows = entries.map(e=>[e.id,e.timestamp,e.dateOnly,e.l1.label,e.l2.label,e.timeToSelectMs])
    const csv = [header.join(','), ...rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(','))].join('\n')
    const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'})
    saveAs(blob,'mood_entries.csv')
  }

  function exportPDF(){
    const doc = new jsPDF()
    doc.setFontSize(12)
    doc.text('Mood entries',14,20)
    const lines = entries.slice(-30).map((e,i)=>`${i+1}. ${e.dateOnly} ${e.l1.label} > ${e.l2.label} (${e.timeToSelectMs}ms)`)
    doc.text(lines,14,30)
    doc.save('mood_entries.pdf')
  }

  function clearAll(){
    if(window.confirm('Clear all saved entries?')){
      clearEntries()
      reload()
    }
  }

  function setPresetRange(getValue){
    setFrom(getValue())
    setTo(formatDateIso(new Date()))
  }

  return (
    <div className="container" style={{ background: theme.bg, borderRadius: 12, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, color: theme.text }}>Dashboard</h2>
        <div>
          <button 
            className="button"
            style={{ background: theme.primary, color: '#fff', marginRight: 8 }}
            onClick={()=>setCompareMode(!compareMode)}
          >
            {compareMode ? 'Show Trends' : 'Compare Moods'}
          </button>
          <button className="button" onClick={exportCSV}>Export CSV</button>
          <button className="button" onClick={exportPDF} style={{marginLeft:8}}>Export PDF</button>
        </div>
      </div>

      <div className="controls" style={{ background: theme.accent, padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label className="small">Quick ranges:</label>
          {PRESET_RANGES.map(range => (
            <button
              key={range.label}
              className="button"
              style={{ marginLeft: 8, background: theme.secondary }}
              onClick={() => setPresetRange(range.getValue)}
            >
              {range.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div>
            <label className="small">Search date:</label>
            <input
              type="date"
              value={dateSearch}
              onChange={e=>setDateSearch(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </div>
          <div>
            <label className="small">From:</label>
            <input
              type="date"
              value={from}
              onChange={e=>setFrom(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </div>
          <div>
            <label className="small">To:</label>
            <input
              type="date"
              value={to}
              onChange={e=>setTo(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </div>
          <button
            className="button"
            onClick={reload}
            style={{ background: theme.primary, color: '#fff' }}
          >
            Apply
          </button>
        </div>
      </div>

      {!compareMode ? (
        <div>
          <div style={{ marginBottom: 16 }}>
            <label className="small">Highlight mood:</label>
            <select
              value={highlightMood}
              onChange={e => setHighlightMood(e.target.value)}
              style={{ marginLeft: 8 }}
            >
              <option value="">None</option>
              {allEmotions.map(emotion => (
                <option key={emotion} value={emotion}>{emotion}</option>
              ))}
            </select>
          </div>

          <div style={{height: 320, background: '#fff', padding: 16, borderRadius: 8}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(trend[0] || {})
                  .filter(k => k !== 'date')
                  .map(key => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={key === highlightMood ? theme.primary : theme.secondary}
                      strokeWidth={key === highlightMood ? 4 : 1}
                      dot={key === highlightMood}
                    />
                  ))
                }
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="small">First mood:</label>
              <select value={mood1} onChange={e => setMood1(e.target.value)} style={{ marginLeft: 8 }}>
                <option value="">Select...</option>
                {allEmotions.map(emotion => (
                  <option key={emotion} value={emotion}>{emotion}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="small">Second mood:</label>
              <select value={mood2} onChange={e => setMood2(e.target.value)} style={{ marginLeft: 8 }}>
                <option value="">Select...</option>
                {allEmotions.map(emotion => (
                  <option key={emotion} value={emotion}>{emotion}</option>
                ))}
              </select>
            </div>
            {correlation !== null && (
              <div style={{ marginLeft: 'auto' }}>
                <span className="small">Correlation: </span>
                <strong>{correlation.toFixed(2)}</strong>
              </div>
            )}
          </div>

          <div style={{height: 320, background: '#fff', padding: 16, borderRadius: 8}}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="mood1Count"
                  name={mood1}
                  label={{ value: mood1, position: 'bottom' }}
                />
                <YAxis
                  dataKey="mood2Count"
                  name={mood2}
                  label={{ value: mood2, angle: -90, position: 'left' }}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  name="Mood Correlation"
                  data={correlationData}
                  fill={theme.primary}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <section style={{marginTop: 24}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Entries ({filtered.length})</h3>
          <button
            className="button"
            onClick={clearAll}
            style={{ background: 'var(--destructive)', color: '#fff' }}
          >
            Clear all
          </button>
        </div>
        <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>L1</th>
                <th>L2</th>
                <th>Time to select (ms)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e=> (
                <tr key={e.id}>
                  <td>{e.dateOnly}</td>
                  <td>{e.l1.label}</td>
                  <td>{e.l2.label}</td>
                  <td>{e.timeToSelectMs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
}
