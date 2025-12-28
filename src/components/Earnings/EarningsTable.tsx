// Earnings statistics table
import { useThemeStore } from '@/store/themeStore'
import { formatDate, getWeekRange } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { Earnings, TEAM_MEMBERS } from '@/types'

interface EarningsTableProps {
  earnings: Earnings[]
}

export const EarningsTable = ({ earnings }: EarningsTableProps) => {
  const { theme } = useThemeStore()
  const POOL_RATE = 0.45

  const monthStart = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')
  const monthEnd = formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd')

  // Calculate statistics
  const getStats = (userId: string, startDate: string, endDate: string) => {
    const userEarnings = earnings.filter((e) => {
      const allParticipants = e.participants && e.participants.length > 0
        ? [...e.participants, e.userId]
        : [e.userId]
      return allParticipants.includes(userId) && e.date >= startDate && e.date <= endDate
    })

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

  const sortedMembers = TEAM_MEMBERS.map((member) => {
    const stats = getStats(member.id, monthStart, monthEnd)
    return { ...member, ...stats }
  }).sort((a, b) => b.totalEarnings - a.totalEarnings)

  const maxEarnings = Math.max(...sortedMembers.map((m) => m.totalEarnings), 1)

  return (
    <div className={`overflow-hidden rounded-3xl border shadow-2xl ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className={theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Ранг</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Участник</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Сумма пула</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Чистые средства</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">KPI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sortedMembers.map((member, index) => {
            const kpi = (member.totalEarnings / maxEarnings) * 100
            const rankColor = index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-500' : 'text-gray-600'
            const avatar = member.avatar

            return (
              <tr
                key={member.id}
                className={`group transition-all duration-300 ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}
              >
                <td className="px-6 py-5">
                  <span className={`text-sm font-black ${rankColor}`}>
                    #{index + 1}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {avatar ? (
                        <img src={avatar} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-white/5" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-black text-emerald-500">
                          {member.name[0]}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0b1015] rounded-full" />
                    </div>
                    <div>
                      <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getUserNicknameSync(member.id)}</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Frontier Team</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className={`text-sm font-black ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {member.totalPool.toLocaleString()} ₽
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-sm font-black text-emerald-500">
                    {member.totalEarnings.toLocaleString()} ₽
                  </span>
                </td>
                <td className="px-6 py-5 text-right w-48">
                  <div className="flex items-center justify-end gap-3">
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-purple-500' : 'bg-amber-500'}`}
                        style={{ width: `${kpi}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-gray-500">{kpi.toFixed(0)}%</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
