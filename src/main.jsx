import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PlanMockup from './PlanMockup.jsx'
import OnboardingFlow from './onboarding/OnboardingFlow.jsx'
import ProgramLoading from './ProgramLoading.jsx'

const preview = new URLSearchParams(window.location.search).get('preview')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {preview === 'settings' ? <PlanMockup initialScreen="settings" onClose={() => window.location.assign('/')} /> : preview === 'loading' ? <ProgramLoading /> : ['onboarding', 'onboarding-focus'].includes(preview) ? <OnboardingFlow preview previewStartAtFocus={preview === 'onboarding-focus'} onComplete={() => window.location.assign('/')} /> : preview === 'manage-plan' ? <PlanMockup /> : <App />}
  </React.StrictMode>,
)
