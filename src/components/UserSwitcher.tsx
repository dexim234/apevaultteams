import { useState } from 'react'
import { Users, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { TEAM_MEMBERS } from '@/types'
import { useViewedUserStore, getViewedUser } from '@/store/viewedUserStore'
import { useAuthStore } from '@/store/authStore'
import { useUserNickname } from '@/utils/userUtils'

export const UserSwitcher = () => {
  const { user: authUser } = useAuthStore()
  const { viewedUserId, setViewedUser, resetViewedUser } = useViewedUserStore()
  const [isOpen, setIsOpen] = useState(false)

  // Check if current user is Artyom (only Artyom can use this feature)
  const isArtyom = authUser?.id === '1'

  if (!isArtyom) return null

  const viewedUser = getViewedUser(viewedUserId)
  const viewedUserNickname = useUserNickname(viewedUserId || '')

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
          viewedUserId
            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <Users className="w-4 h-4" />
        <span className="text-xs font-bold">
          {viewedUserId ? `Просмотр: ${viewedUserNickname}` : 'Переключить'}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-72 glass-panel rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl z-50 overflow-hidden animate-fade-in">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">Просмотр данных от лица:</span>
              {viewedUserId && (
                <button
                  onClick={() => {
                    resetViewedUser()
                    setIsOpen(false)
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400"
                >
                  <EyeOff className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
              {/* Current user (Artyom) */}
              <button
                onClick={() => {
                  resetViewedUser()
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  !viewedUserId
                    ? 'bg-[#4E6E49]/10 text-[#4E6E49]'
                    : 'hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#4E6E49]/20 flex items-center justify-center text-xs font-bold text-[#4E6E49]">
                  {authUser?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold">{authUser?.name}</p>
                  <p className="text-xs text-gray-400">Свой профиль</p>
                </div>
                {!viewedUserId && <div className="w-2 h-2 rounded-full bg-[#4E6E49]" />}
              </button>

              {/* Team members */}
              {TEAM_MEMBERS.filter(m => m.id !== '1').map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    setViewedUser(member.id)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    viewedUserId === member.id
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold">{member.name}</p>
                    <p className="text-xs text-gray-400">@{member.login}</p>
                  </div>
                  {viewedUserId === member.id && (
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              ))}
            </div>

            {viewedUser && (
              <div className="p-3 border-t border-white/10 bg-amber-500/5">
                <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                  <Eye className="w-3 h-3 inline mr-1" />
                  Вы просматриваете данные {viewedUser.name}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
