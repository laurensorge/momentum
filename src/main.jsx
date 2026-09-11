import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PlanMockup from './PlanMockup.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {new URLSearchParams(window.location.search).get('preview') === 'manage-plan' ? <PlanMockup /> : <App />}
  </React.StrictMode>,
)
