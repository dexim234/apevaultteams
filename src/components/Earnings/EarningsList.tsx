// List of all earnings with edit/delete buttons
import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { deleteEarnings } from '@/services/firestoreService'
import { Earnings, EARNINGS_CATEGORY_META, EarningsCategory, TEAM_MEMBERS } from '@/types'
import { formatDate } from '@/utils/dateUtils'
import { Edit2, Trash2, Rocket, LineChart, Image, Coins, BarChart3, ShieldCheck, Sparkles, Wallet2 } from 'lucide-react'

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
  const POOL_RATE = 0.45

  const getCategoryIcon = (key: EarningsCategory, className = 'w-4 h-4') => {
    switch (key) {
      case 'memecoins':
        return <Rocket className={className} />
      case 'futures':
        return <LineChart className={className} />
      case 'nft':
        return <Image className={className} />
      case 'spot':
        return <Coins className={className} />
      case 'polymarket':
        return <BarChart3 className={className} />
      case 'staking':
        return <ShieldCheck className={className} />
      default:
        return <Sparkles className={className} />
    }
  }

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

  const getParticipants = (earning: Earnings) => {
    return earning.participants && earning.participants.length > 0 ? earning.participants : [earning.userId]
  }

  const calcPool = (earning: Earnings) => earning.poolAmount || earning.amount * POOL_RATE
  const calcNet = (earning: Earnings) => Math.max(earning.amount - calcPool(earning), 0)
  const calcShare = (earning: Earnings) => {
    const participants = getParticipants(earning)
    return participants.length ? calcNet(earning) / participants.length : calcNet(earning)
  }

  const getCategoryMeta = (category: EarningsCategory) => {
    return EARNINGS_CATEGORY_META[category] || EARNINGS_CATEGORY_META.other
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
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Сфера</th>
                <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Участники</th>
                <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Чистыми</th>
                <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Пул 45%</th>
                <th className={`px-4 py-3 text-center text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {sortedEarnings.map((earning) => {
                const participants = getParticipants(earning)
                const categoryMeta = getCategoryMeta(earning.category)
                const netAmount = calcNet(earning)
                const shareAmount = calcShare(earning)
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
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'
                      }`}>
                        {getCategoryIcon(earning.category, 'w-4 h-4')}
                        {categoryMeta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {participants.map((pid) => (
                          <span
                            key={pid}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              theme === 'dark'
                                ? 'border-gray-800 bg-gray-800/70 text-gray-100'
                                : 'border-gray-200 bg-white text-gray-800'
                            }`}
                          >
                            {getUserName(pid)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>
                      <div>{netAmount.toFixed(2)} ₽</div>
                      <div className="text-xs text-gray-500">по {shareAmount.toFixed(2)} ₽</div>
                      {earning.extraWalletsAmount ? (
                        <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                          <Wallet2 className="w-3 h-3" />
                          {earning.extraWalletsCount || 0} / {earning.extraWalletsAmount.toFixed(0)} ₽
                        </div>
                      ) : null}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                      {calcPool(earning).toFixed(2)} ₽
                    </td>
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

