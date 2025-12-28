// Earnings page
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { EarningsForm } from '@/components/Earnings/EarningsForm'
import { EarningsTable } from '@/components/Earnings/EarningsTable'
import { EarningsList } from '@/components/Earnings/EarningsList'
import { getEarnings } from '@/services/firestoreService'
import { Earnings as EarningsType, EARNINGS_CATEGORY_META, EarningsCategory, TEAM_MEMBERS } from '@/types'
import { Plus, DollarSign, TrendingUp, Sparkles, Wallet, PiggyBank, PieChart, Rocket, LineChart, Image, Coins, BarChart3, ShieldCheck } from 'lucide-react'
import { getWeekRange, formatDate } from '@/utils/dateUtils'
import { getUserNicknameSync, getUserNicknameAsync } from '@/utils/userUtils'

export const Earnings = () => {
  const { theme } = useThemeStore()
  const [showForm, setShowForm] = useState(false)
  const [editingEarning, setEditingEarning] = useState<EarningsType | null>(null)
  const [earnings, setEarnings] = useState<EarningsType[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    weekTotal: 0,
    weekPool: 0,
    weekNet: 0,
    monthTotal: 0,
    monthPool: 0,
    monthNet: 0
  })
  const POOL_RATE = 0.45
  const categoryKeys = Object.keys(EARNINGS_CATEGORY_META) as EarningsCategory[]

  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const getPoolValue = (earning: EarningsType) => earning.poolAmount || earning.amount * POOL_RATE
  const getNetValue = (earning: EarningsType) => Math.max(earning.amount - getPoolValue(earning), 0)
  const getParticipants = (earning: EarningsType) => earning.participants?.length ? earning.participants : [earning.userId]
  const getUserName = (userId: string) => {
    return getUserNicknameSync(userId) || userId
  }
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

  const calculateStats = () => {
    const weekRange = getWeekRange()
    const weekStart = formatDate(weekRange.start, 'yyyy-MM-dd')
    const weekEnd = formatDate(weekRange.end, 'yyyy-MM-dd')

    const monthStart = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')
    const monthEnd = formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd')

    const weekEarnings = earnings.filter((e: EarningsType) => e.date >= weekStart && e.date <= weekEnd)
    const monthEarnings = earnings.filter((e: EarningsType) => e.date >= monthStart && e.date <= monthEnd)

    setStats({
      weekTotal: weekEarnings.reduce((sum: number, e: EarningsType) => sum + e.amount, 0),
      weekPool: weekEarnings.reduce((sum: number, e: EarningsType) => sum + getPoolValue(e), 0),
      weekNet: weekEarnings.reduce((sum: number, e: EarningsType) => sum + getNetValue(e), 0),
      monthTotal: monthEarnings.reduce((sum: number, e: EarningsType) => sum + e.amount, 0),
      monthPool: monthEarnings.reduce((sum: number, e: EarningsType) => sum + getPoolValue(e), 0),
      monthNet: monthEarnings.reduce((sum: number, e: EarningsType) => sum + getNetValue(e), 0)
    })
  }

  useEffect(() => {
    loadEarnings()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [earnings])

  // Listen for nickname updates and force re-render
  useEffect(() => {
    const handleNicknameUpdate = async (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>
      const { userId } = customEvent.detail || {}
      if (userId) {
        // Reload nickname for the updated user
        await getUserNicknameAsync(userId)
      } else {
        // Reload all nicknames if userId not specified
        for (const member of TEAM_MEMBERS) {
          await getUserNicknameAsync(member.id)
        }
      }
      // Force component re-render by updating earnings state
      setEarnings(prev => [...prev])
    }

    window.addEventListener('nicknameUpdated', handleNicknameUpdate)
    return () => {
      window.removeEventListener('nicknameUpdated', handleNicknameUpdate)
    }
  }, [])

  const loadEarnings = async () => {
    setLoading(true)
    try {
      const allEarnings = await getEarnings()
      setEarnings(allEarnings)
    } catch (error) {
      console.error('Error loading earnings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (earning: EarningsType) => {
    setEditingEarning(earning)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingEarning(null)
  }

  const handleSave = () => {
    setShowForm(false)
    setEditingEarning(null)
    loadEarnings()
  }

  const categoryBreakdown = categoryKeys.map((key) => {
    const items = earnings.filter((e) => e.category === key)
    const gross = items.reduce((sum, e) => sum + e.amount, 0)
    const pool = items.reduce((sum, e) => sum + getPoolValue(e), 0)
    const net = items.reduce((sum, e) => sum + getNetValue(e), 0)

    const participantMap = new Map<string, number>()
    items.forEach((e) => {
      const participants = getParticipants(e)
      const share = getNetValue(e) / Math.max(participants.length, 1)
      participants.forEach((pid) => {
        participantMap.set(pid, (participantMap.get(pid) || 0) + share)
      })
    })

    const topParticipants = Array.from(participantMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)

    return {
      key: key as EarningsCategory,
      gross,
      pool,
      net,
      count: items.length,
      topParticipants,
    }
  })

  const contributorRanking = TEAM_MEMBERS.map((member) => {
    const related = earnings.filter((e) => getParticipants(e).includes(member.id))
    const net = related.reduce((sum, e) => {
      const share = getNetValue(e) / Math.max(getParticipants(e).length, 1)
      return sum + share
    }, 0)
    const poolShare = related.reduce((sum, e) => {
      const share = getPoolValue(e) / Math.max(getParticipants(e).length, 1)
      return sum + share
    }, 0)

    return { ...member, net, poolShare }
  }).sort((a, b) => b.net - a.net)

  const topCategory = [...categoryBreakdown].sort((a, b) => b.net - a.net)[0]
  const topContributor = contributorRanking[0]

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Заработок Команды
              </h1>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Отслеживайте доходы и вклад каждого участника ApeVault Frontier
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить заработок</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Неделя (чистыми)',
              value: `${stats.weekNet.toFixed(2)} ₽`,
              note: `Гросс: ${stats.weekTotal.toFixed(2)} ₽`,
              icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
              bgClass: 'bg-blue-500/5',
              borderClass: 'border-blue-500/20'
            },
            {
              label: 'Пул за неделю',
              value: `${stats.weekPool.toFixed(2)} ₽`,
              note: 'на развитие',
              icon: <PiggyBank className="w-5 h-5 text-purple-400" />,
              bgClass: 'bg-purple-500/5',
              borderClass: 'border-purple-500/20'
            },
            {
              label: 'Месяц (чистыми)',
              value: `${stats.monthNet.toFixed(2)} ₽`,
              note: `Гросс: ${stats.monthTotal.toFixed(2)} ₽`,
              icon: <Wallet className="w-5 h-5 text-emerald-400" />,
              bgClass: 'bg-emerald-500/5',
              borderClass: 'border-emerald-500/20'
            },
            {
              label: 'Пул за месяц',
              value: `${stats.monthPool.toFixed(2)} ₽`,
              note: 'на развитие',
              icon: <PiggyBank className="w-5 h-5 text-orange-400" />,
              bgClass: 'bg-orange-500/5',
              borderClass: 'border-orange-500/20'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
                ? `${item.bgClass} ${item.borderClass} hover:border-opacity-50`
                : 'bg-white border-gray-100 hover:border-emerald-500/20'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                  {item.icon}
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {item.value}
                </div>
                <div className={`text-[11px] font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {item.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className={`lg:col-span-2 rounded-2xl p-5 ${cardBg} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#4E6E49]/20' : 'bg-green-100'}`}>
                <PieChart className={`w-5 h-5 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Сферы заработка</p>
                <p className="text-xs text-gray-500">Сколько приносит каждый поток</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryBreakdown.map((cat) => {
              const meta = EARNINGS_CATEGORY_META[cat.key]
              return (
                <div key={cat.key} className={`p-3 rounded-xl border ${theme === 'dark' ? 'border-gray-800 bg-gray-900/70' : 'border-gray-200 bg-white'} shadow-sm`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800/80 flex items-center justify-center">
                        {getCategoryIcon(cat.key, 'w-4 h-4')}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{meta.label}</p>
                        <p className="text-[11px] text-gray-500">{cat.count} записей</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#4E6E49]">{cat.net.toFixed(0)} ₽</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                    <div>Пул: {cat.pool.toFixed(0)} ₽</div>
                    <div>Гросс: {cat.gross.toFixed(0)} ₽</div>
                  </div>
                  <div className="mt-2">
                    <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Топ участники</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.topParticipants.length === 0 ? (
                        <span className="text-[11px] text-gray-500">Нет записей</span>
                      ) : (
                        cat.topParticipants.map(([pid, value]) => (
                          <span
                            key={pid}
                            className={`px-2 py-1 rounded-full text-[11px] font-semibold ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {getUserName(pid)} · {value.toFixed(0)} ₽
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={`rounded-2xl p-5 ${cardBg} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Лидеры по доходу</p>
              <p className="text-xs text-gray-500">Кто приносит больше всего чистыми</p>
            </div>
          </div>
          <div className="space-y-3">
            {contributorRanking.slice(0, 3).map((member, index) => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${theme === 'dark' ? 'border-gray-800 bg-gray-900/70' : 'border-gray-200 bg-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'
                    }`}>{index + 1}</span>
                  <div>
                    <p className="text-sm font-semibold">{member.name}</p>
                    <p className="text-[11px] text-gray-500">Пул: {member.poolShare.toFixed(0)} ₽</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-[#4E6E49]">{member.net.toFixed(0)} ₽</p>
                  <p className="text-[11px] text-gray-500">чистыми</p>
                </div>
              </div>
            ))}
            {contributorRanking.length === 0 && (
              <p className="text-sm text-gray-500">Нет данных по заработку</p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5">
        <h2 className={`text-xl font-black tracking-tight mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          История и Детали
        </h2>

        {loading ? (
          <div className={`rounded-2xl p-12 text-center border border-dashed ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'
            }`}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Загрузка данных...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div id="earn-history" className="space-y-6">
              <EarningsTable earnings={earnings} />
              <EarningsList
                earnings={earnings}
                onEdit={handleEdit}
                onDelete={loadEarnings}
              />
            </div>

            {/* Insights Island */}
            <div id="earn-insights" className={`relative overflow-hidden rounded-3xl p-8 ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} border shadow-2xl`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Инсайты Эффективности</h3>
                  <p className="text-xs text-gray-500">Аналитика доходности по направлениям и участникам</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Топ категория',
                      value: topCategory ? EARNINGS_CATEGORY_META[topCategory.key].label : '—',
                      note: topCategory ? `${topCategory.net.toFixed(0)} ₽` : 'Нет данных',
                      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
                      tone: 'blue'
                    },
                    {
                      label: 'Лидер команды',
                      value: topContributor ? topContributor.name : '—',
                      note: topContributor ? `${topContributor.net.toFixed(0)} ₽` : 'Нет данных',
                      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
                      tone: 'purple'
                    },
                    {
                      label: 'Доля пула',
                      value: stats.monthTotal ? `${Math.round((stats.monthPool / stats.monthTotal) * 100)}%` : '45%',
                      note: 'текущий месяц',
                      icon: <Rocket className="w-5 h-5 text-emerald-400" />,
                      tone: 'emerald'
                    },
                    {
                      label: 'Средняя выплата',
                      value: earnings.length ? `${(earnings.reduce((sum, e) => sum + getNetValue(e), 0) / earnings.length).toFixed(0)} ₽` : '0 ₽',
                      note: 'на транзакцию',
                      icon: <DollarSign className="w-5 h-5 text-orange-400" />,
                      tone: 'orange'
                    },
                  ].map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{item.label}</span>
                        {item.icon}
                      </div>
                      <div className="space-y-0.5">
                        <p className={`text-sm font-black truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                        <p className="text-[10px] font-medium text-gray-500">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Overlay */}
      {showForm && (
        <EarningsForm
          onClose={handleCloseForm}
          onSave={handleSave}
          editingEarning={editingEarning}
        />
      )}
    </div>
  )
}

