import React, { useState, useCallback } from 'react'
import ScaleRoot from './components/ScaleRoot'
import SplashPage from './pages/SplashPage'
import NavPage from './pages/NavPage'
import DashboardPage from './pages/DashboardPage'
import CostDriversPage from './pages/CostDriversPage'
import StrategicPage from './pages/StrategicPage'

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [dashId, setDashId] = useState(null)

  const goToNav  = useCallback(() => setScreen('nav'), [])
  const goToDash = useCallback((id) => { setDashId(id); setScreen('dashboard') }, [])
  const goBack   = useCallback(() => setScreen('nav'), [])

  return (
    <ScaleRoot>
      {screen === 'splash'    && <SplashPage onEnter={goToNav} />}
      {screen === 'nav'       && <NavPage onSelectDash={goToDash} />}
      {screen === 'dashboard' && dashId === 'portfolio'  && <DashboardPage onBack={goBack} />}
      {screen === 'dashboard' && dashId === 'drivers'    && <CostDriversPage onBack={goBack} />}
      {screen === 'dashboard' && dashId === 'strategic'  && <StrategicPage onBack={goBack} />}
    </ScaleRoot>
  )
}
