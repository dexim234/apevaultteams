import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useViewedUserStore, getEffectiveUserId } from '@/store/viewedUserStore'

export const useEffectiveUserId = () => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { viewedUserId } = useViewedUserStore()
  
  return getEffectiveUserId(user?.id, isAdmin, viewedUserId)
}

export const useIsViewingOtherUser = () => {
  const { isAdmin } = useAdminStore()
  const { isViewingOtherUser } = useViewedUserStore()
  
  // Only admins can view other users
  return isAdmin && isViewingOtherUser()
}
