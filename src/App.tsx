// Main App component with routing
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useAdminStore } from './store/adminStore'
import { useThemeStore } from './store/themeStore'
import { useEffect } from 'react'
import { Login } from './pages/Login'
import { CallPage } from './pages/Call'
import { Management } from './pages/Management'
import { Earnings } from './pages/Earnings'
import { RatingPage } from './pages/Rating'
import { Tasks } from './pages/Tasks'
import { Admin } from './pages/Admin'
import { Profile } from './pages/Profile'
import { About } from './pages/About'
import { Rules } from './pages/Rules'
import { Approvals } from './pages/Approvals'
import { MemeEvaluation } from './pages/MemeEvaluation'
import { AiAoAlerts } from './pages/AiAoAlerts'
import { SignalsTriggerBot } from './pages/SignalsTriggerBot'
import FasolSignalsStrategy from './pages/FasolSignalsStrategy'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AccessBlockScreen } from './components/AccessBlockScreen'
import { cleanupOldData } from './services/firestoreService'

import { AppLayout } from './components/AppLayout'

function App() {
  const { isAuthenticated } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    // Apply theme on mount
    document.body.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    cleanupOldData().catch((error) => console.error('Cleanup failed', error))
  }, [])

  return (
    <BrowserRouter>
      <AccessBlockScreen />
      <Routes>
        <Route
          path="/login"
          element={
            (!isAuthenticated && !isAdmin) ? (
              <Login />
            ) : (
              <Navigate to="/management" replace />
            )
          }
        />

        {/* Layout wrapper for all pages with navigation */}
        <Route element={<AppLayout />}>
          <Route
            path="/call"
            element={
              <ProtectedRoute>
                <CallPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/management"
            element={
              <ProtectedRoute>
                <Management />
              </ProtectedRoute>
            }
          />
          <Route
            path="/earnings"
            element={
              <ProtectedRoute>
                <Earnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rating"
            element={
              <ProtectedRoute>
                <RatingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rules"
            element={
              <ProtectedRoute>
                <Rules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <ProtectedRoute>
                <Approvals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meme-evaluation"
            element={
              <ProtectedRoute>
                <MemeEvaluation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-ao-alerts"
            element={
              <ProtectedRoute>
                <AiAoAlerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signals-trigger-bot"
            element={
              <ProtectedRoute>
                <SignalsTriggerBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fasol-signals-strategy"
            element={
              <ProtectedRoute>
                <FasolSignalsStrategy />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to={(isAuthenticated || isAdmin) ? "/management" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App



