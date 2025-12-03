// Protected route component - requires authentication
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore()
  const { isAdmin } = useAdminStore()

  // Allow access if user is authenticated OR if admin mode is active
  if (!isAuthenticated && !isAdmin) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}



