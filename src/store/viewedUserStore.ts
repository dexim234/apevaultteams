import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TEAM_MEMBERS } from '@/types'

interface ViewedUserState {
  viewedUserId: string | null
  setViewedUser: (userId: string | null) => void
  resetViewedUser: () => void
  isViewingOtherUser: () => boolean
}

export const useViewedUserStore = create<ViewedUserState>()(
  persist(
    (set, get) => ({
      viewedUserId: null,

      setViewedUser: (userId: string | null) => {
        set({ viewedUserId: userId })
      },

      resetViewedUser: () => {
        set({ viewedUserId: null })
      },

      isViewingOtherUser: () => {
        return get().viewedUserId !== null
      },
    }),
    {
      name: 'viewed-user-storage',
    }
  )
)

// Helper function to get the effective user for operations
export const getEffectiveUserId = (
  authUserId: string | undefined,
  isAdmin: boolean,
  viewedUserId: string | null
): string | undefined => {
  // If admin is viewing someone else, use viewed user ID
  // Otherwise use the authenticated user ID
  if (isAdmin && viewedUserId) {
    return viewedUserId
  }
  return authUserId
}

// Get viewed user data
export const getViewedUser = (viewedUserId: string | null) => {
  if (!viewedUserId) return null
  return TEAM_MEMBERS.find(m => m.id === viewedUserId) || null
}
