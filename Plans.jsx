// src/Plans.jsx
import { useEffect, useState } from 'react'
import { api } from './api'

export default function Plans() {
  const [plans, setPlans] = useState([])
  const [busy, setBusy] = useState(false)

  useEffect(() => { api.plans().then(r => setPlans(r.data || [])) }, [])

  const choose = async (planId) => {
    setBusy(true)
    const r = await api.subscribe(planId, true)
    setBusy(false)
    if (r.error) return alert(r.error.message)
    alert('Subscribed!')
  }

  return (
    <section style={{maxWidth:900, margin:'24px auto'}}>
      <h2>Plans</h2>
      {plans.map(p => (
        <div key={p.id} style={{padding:12, border:'1px solid #eee', borderRadius:8, marginBottom:12}}>
          <div style={{fontWeight:600}}>{p.name}</div>
          <div>{p.speedMbps} Mbps • {p.quotaGb} GB • {p.price.display}</div>
          <button disabled={busy} onClick={() => choose(p.id)} style={{marginTop:8}}>
            {busy ? 'Please wait…' : 'Subscribe'}
          </button>
        </div>
      ))}
    </section>
  )
}
