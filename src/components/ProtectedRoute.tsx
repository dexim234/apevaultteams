// Protected route component - requires authentication and access permissions
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { checkUserAccess } from '@/services/firestoreService'
import { ShieldX, Clock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()
  const location = useLocation()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [accessReason, setAccessReason] = useState<string>('')
  const [accessExpiresAt, setAccessExpiresAt] = useState<string | undefined>()

  // Allow access if user is authenticated OR if admin mode is active
  if (!isAuthenticated && !isAdmin) {
    return <Navigate to="/login" replace />
  }

  // Determine feature based on current path
  const getFeatureFromPath = (path: string): string => {
    if (path === '/admin') return 'admin'
    if (path === '/management') return 'slots'
    if (path === '/earnings') return 'earnings'
    if (path === '/tasks') return 'tasks'
    if (path === '/rating') return 'rating'
    if (path === '/profile') return 'profile'
    if (path === '/approvals') return 'admin'
    if (path === '/call') return 'slots'
    if (path === '/meme-evaluation') return 'tools_meme_evaluation'
    if (path === '/ai-ao-alerts') return 'tools_ai_ao_alerts'
    if (path === '/signals-trigger-bot') return 'tools_signals_trigger_bot'
    if (path.startsWith('/tools')) return 'tools'
    return 'login'
  }

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || isAdmin) {
        setHasAccess(true)
        return
      }

      const feature = getFeatureFromPath(location.pathname)
      try {
        const accessResult = await checkUserAccess(user.id, feature)
        setHasAccess(accessResult.hasAccess)
        setAccessReason(accessResult.reason || 'Доступ запрещен')
        setAccessExpiresAt(accessResult.expiresAt)
      } catch (error) {
        console.error('Error checking access:', error)
        setHasAccess(true) // Default to allow on error
      }
    }

    checkAccess()
  }, [user, isAdmin, location.pathname])

  // Show loading while checking access
  if (hasAccess === null) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#4E6E49] border-t-transparent"></div>
      </div>
    )
  }

  // Block access if not authorized
  if (!hasAccess) {
    const formatExpirationDate = (expiresAt?: string) => {
      if (!expiresAt) return 'навсегда'
      const date = new Date(expiresAt)
      const now = new Date()
      if (date <= now) return 'навсегда'
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const bgColor = theme === 'dark' ? 'bg-slate-950' : 'bg-gray-100'
    const cardBg = theme === 'dark' ? 'bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10' : 'bg-white border-slate-200'
    const titleColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const textColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    const iconBg = theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
    const iconColor = theme === 'dark' ? 'text-red-400' : 'text-red-600'
    const sectionBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'

    return (
      <div className={`flex items-center justify-center min-h-screen p-4 ${bgColor}`}>
        <div className={`max-w-md w-full ${cardBg} rounded-2xl shadow-2xl border p-8 text-center`}>
          <div className="mb-6">
            <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <ShieldX className={`w-8 h-8 ${iconColor}`} />
            </div>
            <h2 className={`text-xl font-bold ${titleColor} mb-2`}>Доступ запрещен</h2>
            <p className={`${textColor}`}>{accessReason}</p>
          </div>

          {accessExpiresAt && (
            <div className={`${sectionBg} rounded-lg p-4 mb-4`}>
              <div className={`flex items-center justify-center gap-2 text-sm ${textColor}`}>
                <Clock className="w-4 h-4" />
                <span>Блокировка до: {formatExpirationDate(accessExpiresAt)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}



