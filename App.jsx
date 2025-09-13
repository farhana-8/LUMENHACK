import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Plans from './Plans.jsx'
import Subscription from './Subscription.jsx'
import Recommendations from './Recommendations.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{display:'flex', gap:12, padding:10, borderBottom:'1px solid #eee'}}>
        <Link to="/plans">Plans</Link>
        <Link to="/me">My Subscription</Link>
        <Link to="/recommendations">Recommendations</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Plans />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/me" element={<Subscription />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </BrowserRouter>
  )
}
