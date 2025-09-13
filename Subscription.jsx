// src/Subscription.jsx
import { useEffect, useState } from 'react'
import { api } from './api'

export default function Subscription() {
  const [active, setActive] = useState(null)
  const [plans, setPlans] = useState([])
  const [target, setTarget] = useState('')
  const [busy, setBusy] = useState(false)
  const [usage, setUsage] = useState(null)

  const load = async () => {
    const [a, p, u] = await Promise.all([api.activeSub(), api.plans(), api.usageCurrent()])
    setActive(a.data || null)
    const list = p.data || []
    setPlans(list)
    if (a.data?.plan?.id) {
      const firstOther = list.find(pl => pl.id !== a.data.plan.id)
      setTarget(firstOther?.id || '')
    }
    setUsage(u.data || null)
  }

  useEffect(() => { load() }, [])

  const act = async (action) => {
    if (!active) return
    setBusy(true)
    const r = await api.changeSub(
      active.id,
      action,
      (action === 'upgrade' || action === 'downgrade') ? target : undefined
    )
    setBusy(false)
    if (r.error) return alert(r.error.message)
    await load()
  }

  const pct = (() => {
    if (!usage || !active?.plan?.quotaGb) return 0
    return Math.min(100, Math.round((usage.usedGb / active.plan.quotaGb) * 100))
  })()

  return (
    <section style={{maxWidth:900, margin:'24px auto', display:'grid', gap:16}}>
      <h2>My Subscription</h2>

      {!active ? <p>No active subscription</p> : (
        <>
          <div>
            <b>Plan:</b> {active.plan.name}
            <span style={{opacity:.7}}> — {active.plan.price.display}</span>
          </div>

          <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
            <select value={target} onChange={e=>setTarget(e.target.value)}>
              {plans.filter(pl => pl.id !== active.plan.id).map(pl =>
                <option key={pl.id} value={pl.id}>{pl.name} — {pl.price.display}</option>
              )}
            </select>
            <button disabled={busy} onClick={()=>act('upgrade')}>Upgrade</button>
            <button disabled={busy} onClick={()=>act('downgrade')}>Downgrade</button>
            <button disabled={busy} onClick={()=>act('cancel')}>Cancel</button>
            <button disabled={busy} onClick={()=>act('renew')}>Renew</button>
          </div>

          <div>
            <h3 style={{marginBottom:8}}>Usage</h3>
            <div style={{width:320, height:12, background:'#eee', borderRadius:6, overflow:'hidden', marginBottom:4}}>
              <div style={{width:`${pct}%`, height:'100%', background:'#7aa8ff'}} />
            </div>
            <small>
              {usage ? `${usage.usedGb} GB used of ${active.plan.quotaGb} GB (${pct}%)`
                     : 'No usage data'}
            </small>
          </div>
        </>
      )}
    </section>
  )
}
