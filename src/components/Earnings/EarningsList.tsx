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
      <div className={`rounded-lg p-8 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Нет записей о заработке</p>
      </div>
    )
  }

  return (
    <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md overflow-hidden`}>
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Все записи о заработке
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
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
                    className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {formatDate(new Date(earning.date + 'T00:00:00'), 'dd.MM.yyyy')}
                    </td>
                    <td className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getUserName(earning.userId)}</td>
                    <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{earning.amount.toFixed(2)} ₽</td>
                    <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{earning.poolAmount.toFixed(2)} ₽</td>
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

