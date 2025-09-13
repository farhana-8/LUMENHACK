const API_BASE = '/api'
const USER_EMAIL = 'user@sms.com'
const headers = () => ({ 'Content-Type': 'application/json', 'x-user-email': USER_EMAIL })

export const api = {
  plans: () => fetch(`${API_BASE}/v1/plans`).then(r => r.json()),
  mySubs: () => fetch(`${API_BASE}/v1/subscriptions`, { headers: headers() }).then(r => r.json()),
  activeSub: () => fetch(`${API_BASE}/v1/subscriptions/active`, { headers: headers() }).then(r => r.json()),
  recommendations: () => fetch(`${API_BASE}/v1/subscriptions/recommendations`, { headers: headers() }).then(r => r.json()),
  subscribe: (planId, autoRenew = true) =>
    fetch(`${API_BASE}/v1/subscriptions`, { method:'POST', headers: headers(), body: JSON.stringify({ planId, autoRenew })}).then(r => r.json()),
  changeSub: (id, action, toPlanId) =>
    fetch(`${API_BASE}/v1/subscriptions/${id}`, { method:'PATCH', headers: headers(), body: JSON.stringify({ action, toPlanId })}).then(r => r.json()),
  usageCurrent: () => fetch(`${API_BASE}/v1/usage/current`, { headers: headers() }).then(r => r.json())
}
