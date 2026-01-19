import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useAdminStore } from './store/adminStore'
import { useThemeStore } from './store/themeStore'
import { useEffect } from 'react'
import { Login } from './pages/Login'
import { CallPage } from './pages/Call'
import { Management } from './pages/Management'
import { Earnings } from './pages/Earnings'
import { Rating } from './pages/Rating'
import { Tasks } from './pages/Tasks'
import { Admin } from './pages/Admin'
import { Profile } from './pages/Profile'
import { About } from './pages/About'
import { Rules } from './pages/Rules'
import { Approvals } from './pages/Approvals'
import { Strategies } from './pages/Strategies'
import { EventsPage } from './pages/Events'
import { Referrals } from './pages/Referrals'

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
                <Rating />
              </ProtectedRoute>
            }
          />
          <Route
            path="/referrals"
            element={
              <ProtectedRoute>
                <Referrals />
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
            path="/strategies"
            element={
              <ProtectedRoute>
                <Strategies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
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
