// Authentication store using Zustand
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, TEAM_MEMBERS } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (login: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (login: string, password: string) => {
        const user = TEAM_MEMBERS.find(
          (u) => u.login === login && u.password === password
        )
        if (user) {
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'apevault-auth',
    }
  )
)



