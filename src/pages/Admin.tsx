import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { Lock, Users, AlertTriangle, Settings } from 'lucide-react'
import { UsersManagement } from '@/components/Management/UsersManagement'

export const Admin = () => {
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'

  if (!isAdmin) {
    return (
      <div className={`rounded-2xl p-8 ${cardBg} shadow-xl border-2 ${theme === 'dark'
        ? 'border-red-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]'
        : 'border-red-200 bg-gradient-to-br from-white to-red-50/20'
        } relative overflow-hidden`}>
        <div className="text-center">
          <div className={`inline-flex p-4 rounded-2xl mb-4 ${theme === 'dark'
            ? 'bg-red-500/20'
            : 'bg-red-100'
            }`}>
            <Lock className={`w-12 h-12 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${headingColor}`}>Доступ запрещен</h2>
          <p className={labelColor}>
            Эта страница доступна только администраторам. Для входа используйте режим "Админ" на странице входа.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Users Management Section */}
      <div className={`rounded-2xl p-6 ${cardBg} shadow-lg border-2 ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200'
        }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
            <Users className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <h2 className={`text-xl font-semibold ${headingColor}`}>Участники команды</h2>
        </div>
        <UsersManagement />
      </div>

      {/* Restrictions Management Section */}
      <div className={`rounded-2xl p-6 ${cardBg} shadow-lg border-2 ${theme === 'dark' ? 'border-orange-500/30' : 'border-orange-200'
        }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'
            }`}>
            <AlertTriangle className={`w-6 h-6 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
          </div>
          <h2 className={`text-xl font-semibold ${headingColor}`}>Ограничения</h2>
          <a
            href="/management?tab=restrictions"
            className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              theme === 'dark'
                ? 'bg-orange-600 hover:bg-orange-500 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            <Settings size={18} />
            Управление
          </a>
        </div>
        <p className={`text-sm ${labelColor} mb-4`}>
          Запретить участникам создавать определённые записи (слоты, выходные, больничные и т.д.) в указанный период
        </p>
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <p className={`text-sm ${labelColor}`}>
            Нажмите «Управление» для просмотра, создания и редактирования ограничений
          </p>
        </div>
      </div>
    </div>
  )
}
