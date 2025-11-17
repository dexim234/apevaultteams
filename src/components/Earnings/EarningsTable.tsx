// Earnings statistics table
import { useThemeStore } from '@/store/themeStore'
import { formatDate, getWeekRange } from '@/utils/dateUtils'
import { Earnings } from '@/types'
import { TEAM_MEMBERS } from '@/types'

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
    const userEarnings = earnings.filter(
      (e) => e.userId === userId && e.date >= startDate && e.date <= endDate
    )

    const totalEarnings = userEarnings.reduce((sum, e) => sum + e.amount, 0)
    const totalPool = userEarnings.reduce((sum, e) => sum + e.poolAmount, 0)

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
    <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md overflow-hidden`}>
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Статистика заработка</h3>

        {/* Weekly stats */}
        <div className="mb-6">
          <h4 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>За неделю</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Участник</th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Заработок</th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Пул</th>
                </tr>
              </thead>
              <tbody>
                {TEAM_MEMBERS.map((member) => {
                  const stats = getStats(member.id, weekStart, weekEnd)
                  return (
                    <tr key={member.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{member.name}</td>
                      <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalEarnings.toFixed(2)} ₽</td>
                      <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalPool.toFixed(2)} ₽</td>
                    </tr>
                  )
                })}
                <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} font-bold`}>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Итого команды</td>
                  <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{teamWeekEarnings.toFixed(2)} ₽</td>
                  <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{teamWeekPool.toFixed(2)} ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly stats */}
        <div>
          <h4 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>За месяц</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Участник</th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Заработок</th>
                  <th className={`px-4 py-3 text-right text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Пул</th>
                </tr>
              </thead>
              <tbody>
                {TEAM_MEMBERS.map((member) => {
                  const stats = getStats(member.id, monthStart, monthEnd)
                  return (
                    <tr key={member.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{member.name}</td>
                      <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalEarnings.toFixed(2)} ₽</td>
                      <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stats.totalPool.toFixed(2)} ₽</td>
                    </tr>
                  )
                })}
                <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} font-bold`}>
                  <td className={`px-4 py-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Итого команды</td>
                  <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{teamMonthEarnings.toFixed(2)} ₽</td>
                  <td className={`px-4 py-3 text-right ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{teamMonthPool.toFixed(2)} ₽</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

