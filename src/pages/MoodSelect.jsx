import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { L1_GROUPS, generateL2For } from '../utils/data'
import { saveEntry } from '../services/storage'

export default function MoodSelect(){
  const [selectedL1, setSelectedL1] = useState(null)
  const [l2List, setL2List] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const nav = useNavigate()
  const startRef = useRef(null)

  useEffect(()=>{
    if(selectedL1){
      const list = generateL2For(selectedL1.id)
      setL2List(list)
      const now = Date.now()
      setStartTime(now)
      startRef.current = now
    }
  },[selectedL1])

  function onL2Click(l2){
    if(disabled) return
    setDisabled(true)
    setTimeout(()=>setDisabled(false),2000) // protection against excess tapping

    const end = Date.now()
    const timeToSelect = startRef.current ? (end - startRef.current) : 0
    const entry = {
      id: `e_${Date.now()}`,
      timestamp: new Date().toISOString(),
      dateOnly: new Date().toISOString().slice(0,10),
      l1: selectedL1,
      l2,
      timeToSelectMs: timeToSelect
    }
    saveEntry(entry)
    nav('/thankyou')
  }

  return (
    <div className="container">
      <h2>Select your mood</h2>
      {!selectedL1 && (
        <div>
          <p>Choose a main group (L1)</p>
          <div className="l1-grid">
            {L1_GROUPS.map(g=> (
              <div key={g.id} className="l1-button" onClick={()=>setSelectedL1(g)}>
                <strong>{g.label}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedL1 && (
        <div>
          <button className="button" onClick={()=>setSelectedL1(null)}>Back to L1</button>
          <h3 style={{marginTop:12}}>Sub-emotions ({l2List.length}) for: {selectedL1.label}</h3>
          <div className="l2-grid">
            {l2List.map(l2=> (
              <div key={l2.id} className="l2-item" onClick={()=>onL2Click(l2)} aria-disabled={disabled}>
                {l2.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
