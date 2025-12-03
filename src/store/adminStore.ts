// Admin mode store using Zustand
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminState {
  isAdmin: boolean
  activateAdmin: (password: string) => boolean
  deactivateAdmin: () => void
}

const ADMIN_PASSWORD = '9119ApeVault'

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdmin: false,
      activateAdmin: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAdmin: true })
          return true
        }
        return false
      },
      deactivateAdmin: () => set({ isAdmin: false }),
    }),
    {
      name: 'apevault-admin',
    }
  )
)



