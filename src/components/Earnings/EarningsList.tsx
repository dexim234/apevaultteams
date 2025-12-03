// List of all earnings with edit/delete buttons
import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { deleteEarnings } from '@/services/firestoreService'
import { Earnings } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import { formatDate } from '@/utils/dateUtils'
import { Edit2, Trash2 } from 'lucide-react'

interface EarningsListProps {
  earnings: Earnings[]
  onEdit: (earning: Earnings) => void
  onDelete: () => void
}

export const EarningsList = ({ earnings, onEdit, onDelete }: EarningsListProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись о заработке?')) {
      return
    }

    setDeletingId(id)
    try {
      await deleteEarnings(id)
      onDelete()
    } catch (error) {
      console.error('Error deleting earnings:', error)
      alert('Ошибка при удалении записи')
    } finally {
      setDeletingId(null)
    }
  }

  const getUserName = (userId: string) => {
    return TEAM_MEMBERS.find(m => m.id === userId)?.name || userId
  }

  const canEditOrDelete = (earning: Earnings) => {
    return isAdmin || earning.userId === user?.id
  }

  // Sort by date descending
  const sortedEarnings = [...earnings].sort((a, b) => b.date.localeCompare(a.date))

  if (sortedEarnings.length === 0) {
    return (
      <div className={`rounded-2xl p-8 text-center border-2 ${
        theme === 'dark' 
          ? 'bg-[#1a1a1a] border-gray-800' 
          : 'bg-white border-gray-200'
      } shadow-md`}>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
          Пока нет записей о заработке
        </p>
        <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} text-sm mt-2`}>
          Добавьте первую запись, чтобы начать отслеживать доходы команды
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} shadow-lg border-2 ${
      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
    } overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
          }`}>
            <Edit2 className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Все записи о заработке
          </h3>
        </div>
        <div className="overflow-x-auto rounded-xl border-2 border-gray-800/50 dark:border-gray-800">
          <table className="w-full">
            <thead>
              <tr className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Дата</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Участник</th>
                <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Заработок</th>
                <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Пул</th>
                <th className={`px-4 py-3 text-center text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {sortedEarnings.map((earning) => {
                const canEdit = canEditOrDelete(earning)
                return (
                  <tr
                    key={earning.id}
                    className={`border-b border-gray-800/30 dark:border-gray-800 transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {formatDate(new Date(earning.date + 'T00:00:00'), 'dd.MM.yyyy')}
                    </td>
                    <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getUserName(earning.userId)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>{earning.amount.toFixed(2)} ₽</td>
                    <td className={`px-4 py-3 text-right font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{earning.poolAmount.toFixed(2)} ₽</td>
                    <td className="px-4 py-3 text-center">
                      {canEdit ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEdit(earning)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-gray-600 text-blue-400'
                                : 'hover:bg-gray-200 text-blue-600'
                            }`}
                            title="Редактировать"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(earning.id)}
                            disabled={deletingId === earning.id}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-gray-600 text-red-400'
                                : 'hover:bg-gray-200 text-red-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

