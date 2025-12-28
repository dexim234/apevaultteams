// Earnings statistics table
import { useThemeStore } from '@/store/themeStore'
import { formatDate, getWeekRange } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { Earnings } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import { TrendingUp } from 'lucide-react'

interface EarningsTableProps {
  earnings: Earnings[]
}

export const EarningsTable = ({ earnings }: EarningsTableProps) => {
  const { theme } = useThemeStore()
  const POOL_RATE = 0.45

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

    // Если у записи несколько участников, чистая сумма (после пула) делится поровну между ними
    const totalEarnings = userEarnings.reduce((sum, e) => {
      const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
      const pool = e.poolAmount || e.amount * POOL_RATE
      const net = Math.max(e.amount - pool, 0)
      return sum + (net / participantCount)
    }, 0)
    const totalPool = userEarnings.reduce((sum, e) => {
      const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
      const pool = e.poolAmount || e.amount * POOL_RATE
      return sum + (pool / participantCount)
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
    <div className={`rounded-3xl overflow-hidden border shadow-2xl ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'
      }`}>
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-xl">
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Аналитика выплат
        </h3>
      </div>

      <div className="p-6 space-y-8">
        {/* Weekly stats */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 px-2">Еженедельный отчет</h4>
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">Участник</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500 text-right">Чистыми</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500 text-right">Пул 45%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {TEAM_MEMBERS.map((member) => {
                  const stats = getStats(member.id, weekStart, weekEnd)
                  return (
                    <tr
                      key={member.id}
                      className={`group transition-colors ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{getUserNicknameSync(member.id)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-emerald-500">{stats.totalEarnings.toFixed(0)} ₽</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-purple-400 opacity-60 group-hover:opacity-100 transition-opacity">{stats.totalPool.toFixed(0)} ₽</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className={theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}>
                  <td className="px-6 py-4 text-sm font-black text-white">Итого</td>
                  <td className="px-6 py-4 text-right text-sm font-black text-emerald-500">{teamWeekEarnings.toFixed(0)} ₽</td>
                  <td className="px-6 py-4 text-right text-sm font-black text-purple-400">{teamWeekPool.toFixed(0)} ₽</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Monthly stats */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 px-2">Ежемесячный отчет</h4>
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">Участник</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500 text-right">Чистыми</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500 text-right">Пул 45%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {TEAM_MEMBERS.map((member) => {
                  const stats = getStats(member.id, monthStart, monthEnd)
                  return (
                    <tr
                      key={member.id}
                      className={`group transition-colors ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{getUserNicknameSync(member.id)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-emerald-500">{stats.totalEarnings.toFixed(0)} ₽</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-purple-400 opacity-60 group-hover:opacity-100 transition-opacity">{stats.totalPool.toFixed(0)} ₽</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className={theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}>
                  <td className="px-6 py-4 text-sm font-black text-white">Итого</td>
                  <td className="px-6 py-4 text-right text-sm font-black text-emerald-500">{teamMonthEarnings.toFixed(0)} ₽</td>
                  <td className="px-6 py-4 text-right text-sm font-black text-purple-400">{teamMonthPool.toFixed(0)} ₽</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

