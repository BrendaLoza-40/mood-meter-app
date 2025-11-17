import React from 'react'
import { Link } from 'react-router-dom'

export default function ThankYou(){
  return (
    <div className="container">
      <h2>Thank you!</h2>
      <p>Your mood has been recorded. If you need support, visit the FLC Wellness Center.</p>
      <div style={{marginTop:12}}>
        <Link to="/">Record another mood</Link>
        <span style={{marginLeft:12}}>
          <Link to="/dashboard">Go to Dashboard</Link>
        </span>
      </div>

      <section style={{marginTop:16}}>
        <h4>FLC Wellness Center</h4>
        <p className="small">Contact: wellness@flc.edu — Phone: (555) 555-5555</p>
      </section>
    </div>
  )
}
