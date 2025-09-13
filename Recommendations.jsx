// src/Recommendations.jsx
import { useEffect, useState } from 'react'
import { api } from './api'

export default function Recommendations() {
  const [recs, setRecs] = useState([])
  const [plansById, setPlansById] = useState({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    (async () => {
      const [r, p] = await Promise.all([api.recommendations(), api.plans()])
      setRecs(r.data || [])
      setPlansById(Object.fromEntries((p.data || []).map(pl => [pl.id, pl])))
    })()
  }, [])

  const subscribe = async (planId) => {
    setBusy(true)
    const r = await api.subscribe(planId, true)
    setBusy(false)
    if (r.error) return alert(r.error.message)
    alert('Subscribed!')
  }

  if (!recs.length) return null
  return (
    <section style={{maxWidth:900, margin:'24px auto'}}>
      <h2>Recommended</h2>
      {recs.map(r => {
        const p = plansById[r.planId]
        return (
          <div key={r.planId} style={{marginBottom:8}}>
            <b>{p?.name || r.planId}</b> — {p?.price?.display || ''} — <i>{r.explanation}</i>
            <button disabled={busy} onClick={()=>subscribe(r.planId)} style={{marginLeft:8}}>Choose</button>
          </div>
        )
      })}
    </section>
  )
}
