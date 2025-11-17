import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function StartPage(){
  const nav = useNavigate()
  return (
    <div className="container">
      <h2>Welcome</h2>
      <p>Click below to get started with the Mood Tracker.</p>
      <div style={{display:'flex',gap:12}}>
        <button className="button" onClick={()=>nav('/select')}>Click to Get started</button>
        <a className="small" href="https://moodmeterapp.herokuapp.com/">Link to Moodmeter chart</a>
      </div>
      <p className="small">No login required. Student selects their mood. Time to select is tracked. After selection, a thank-you page is shown.</p>
    </div>
  )
}
