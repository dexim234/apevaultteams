// Earnings statistics table
import { useThemeStore } from '@/store/themeStore'
import { formatDate, getWeekRange } from '@/utils/dateUtils'
import { Earnings } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import { TrendingUp } from 'lucide-react'

interface EarningsTableProps {
  earnings: Earnings[]
}

export const EarningsTable = ({ earnings }: EarningsTableProps) => {
  const { theme } = useThemeStore()

  const weekRange = getWeekRange()
  const weekStart = formatDate(weekRange.start, 'yyyy-MM-dd')
  const weekEnd = formatDate(weekRange.end, 'yyyy-MM-dd')

  const monthStart = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')
  const monthEnd = formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd')

  // Calculate statistics
  const getStats = (userId: string, startDate: string, endDate: string) => {
    const userEarnings = earnings.filter((e) => {
      // Проверяем, является ли пользователь участником (в userId или в participants)
      const allParticipants = e.participants && e.participants.length > 0 
        ? [...e.participants, e.userId] 
        : [e.userId]
      return allParticipants.includes(userId) && e.date >= startDate && e.date <= endDate
    })

    // Если у записи несколько участников, сумма делится поровну между ними
    const totalEarnings = userEarnings.reduce((sum, e) => {
      const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
      return sum + (e.amount / participantCount)
    }, 0)
    const totalPool = userEarnings.reduce((sum, e) => {
      const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
      return sum + (e.poolAmount / participantCount)
    }, 0)

    return { totalEarnings, totalPool, count: userEarnings.length }
  }

  // Calculate team totals
  const teamWeekEarnings = TEAM_MEMBERS.reduce((sum, member) => {
    const stats = getStats(member.id, weekStart, weekEnd)
    return sum + stats.totalEarnings
  }, 0)

  const teamWeekPool = TEAM_MEMBERS.reduce((sum, member) => {
    const stats = getStats(member.id, weekStart, weekEnd)
    return sum + stats.totalPool
  }, 0)

  const teamMonthEarnings = TEAM_MEMBERS.reduce((sum, member) => {
    const stats = getStats(member.id, monthStart, monthEnd)
    return sum + stats.totalEarnings
  }, 0)

  const teamMonthPool = TEAM_MEMBERS.reduce((sum, member) => {
    const stats = getStats(member.id, monthStart, monthEnd)
    return sum + stats.totalPool
  }, 0)

  return (
    <div className={`rounded-2xl ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} shadow-lg border-2 ${
      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
    } overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
          }`}>
            <TrendingUp className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Статистика заработка</h3>
        </div>

        {/* Weekly stats */}
        <div className="mb-6">
          <h4 className={`text-lg font-semibold mb-4 px-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>За неделю</h4>
          <div className="overflow-x-auto rounded-xl border-2 border-gray-800/50 dark:border-gray-800">
            <table className="w-full">
              <thead>
                <tr className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Участник</th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Заработок</th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Пул</th>
                </tr>
              </thead>
              <tbody>
                {TEAM_MEMBERS.map((member) => {
                  const stats = getStats(member.id, weekStart, weekEnd)
                  return (
                    <tr 
                      key={member.id} 
                      className={`border-b border-gray-800/30 dark:border-gray-800 transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{member.name}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>{stats.totalEarnings.toFixed(2)} ₽</td>
                      <td className={`px-4 py-3 text-right font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{stats.totalPool.toFixed(2)} ₽</td>
                    </tr>
                  )
                })}
                <tr className={`${theme === 'dark' ? 'bg-gray-700/70' : 'bg-gray-100'} font-bold border-t-2 border-gray-800/50 dark:border-gray-800`}>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Итого команды</td>
                  <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>{teamWeekEarnings.toFixed(2)} ₽</td>
                  <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{teamWeekPool.toFixed(2)} ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly stats */}
        <div>
          <h4 className={`text-lg font-semibold mb-4 px-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>За месяц</h4>
          <div className="overflow-x-auto rounded-xl border-2 border-gray-800/50 dark:border-gray-800">
            <table className="w-full">
              <thead>
                <tr className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Участник</th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Заработок</th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Пул</th>
                </tr>
              </thead>
              <tbody>
                {TEAM_MEMBERS.map((member) => {
                  const stats = getStats(member.id, monthStart, monthEnd)
                  return (
                    <tr 
                      key={member.id} 
                      className={`border-b border-gray-800/30 dark:border-gray-800 transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className={`px-4 py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{member.name}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>{stats.totalEarnings.toFixed(2)} ₽</td>
                      <td className={`px-4 py-3 text-right font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{stats.totalPool.toFixed(2)} ₽</td>
                    </tr>
                  )
                })}
                <tr className={`${theme === 'dark' ? 'bg-gray-700/70' : 'bg-gray-100'} font-bold border-t-2 border-gray-800/50 dark:border-gray-800`}>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Итого команды</td>
                  <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>{teamMonthEarnings.toFixed(2)} ₽</td>
                  <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{teamMonthPool.toFixed(2)} ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

