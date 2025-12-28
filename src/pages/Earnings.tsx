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
      {/* Header */}
      <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${cardBg} shadow-xl border-2 ${theme === 'dark'
        ? 'border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]'
        : 'border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white'
        } relative overflow-hidden`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-700/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24" />

        <div className="relative z-10">
          <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6">
            <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0 ${theme === 'dark'
                    ? 'bg-gradient-to-br from-[#4E6E49] to-emerald-700'
                    : 'bg-gradient-to-br from-[#4E6E49] to-emerald-700'
                    } text-white transform transition-transform active:scale-95 sm:hover:scale-110`}
                >
                  <DollarSign className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1
                    className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white flex items-center gap-2 sm:gap-3 drop-shadow-lg"
                  >
                    <span>Заработок команды</span>
                    <Sparkles
                      className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-500'
                        } animate-pulse`}
                    />
                  </h1>
                </div>
              </div>
              <p className={`text-sm sm:text-base font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Отслеживайте доходы и вклад каждого участника в общий успех
              </p>

              {/* Quick nav */}
              <div className="flex flex-wrap gap-2">
                {[
                  { href: '#earn-stats', label: 'Обзор' },
                  { href: '#earn-history', label: 'История' },
                  { href: '#earn-insights', label: 'Инсайты' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${theme === 'dark'
                      ? 'border-white/10 bg-white/5 text-white hover:border-[#4E6E49]/50'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/50 hover:text-[#4E6E49]'
                      }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className={`w-full lg:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] hover:from-[#4E6E49] hover:to-[#4E6E49] text-white rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105 transform touch-manipulation`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="whitespace-nowrap">Добавить заработок</span>
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div id="earn-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-xl border-2 ${theme === 'dark'
            ? 'bg-blue-500/10 border-blue-500/30'
            : 'bg-blue-50 border-blue-200'
            }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                <TrendingUp className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Неделя (чистыми)</p>
            </div>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {stats.weekNet.toFixed(2)} ₽
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Гросс: {stats.weekTotal.toFixed(2)} ₽</p>
          </div>
          <div className={`p-4 rounded-xl border-2 ${theme === 'dark'
            ? 'bg-purple-500/10 border-purple-500/30'
            : 'bg-purple-50 border-purple-200'
            }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
                }`}>
                <PiggyBank className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Пул за неделю</p>
            </div>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
              {stats.weekPool.toFixed(2)} ₽
            </p>
          </div>
          <div className={`p-4 rounded-xl border-2 ${theme === 'dark'
            ? 'bg-[#4E6E49]/10 border-[#4E6E49]/30'
            : 'bg-green-50 border-green-200'
            }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#4E6E49]/20' : 'bg-green-100'
                }`}>
                <Wallet className={`w-5 h-5 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Месяц (чистыми)</p>
            </div>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>
              {stats.monthNet.toFixed(2)} ₽
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Гросс: {stats.monthTotal.toFixed(2)} ₽</p>
          </div>
          <div className={`p-4 rounded-xl border-2 ${theme === 'dark'
            ? 'bg-orange-500/10 border-orange-500/30'
            : 'bg-orange-50 border-orange-200'
            }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'
                }`}>
                <PiggyBank className={`w-5 h-5 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Пул за месяц</p>
            </div>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
              {stats.monthPool.toFixed(2)} ₽
            </p>
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

        <div className="hidden sm:flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-800/50 dark:border-gray-800">
          <h2 className={`text-base sm:text-lg md:text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Управление заработком</h2>
        </div>
      </div>

      {/* Earnings statistics */}
      {loading ? (
        <div className={`rounded-xl p-8 text-center border-2 ${theme === 'dark'
          ? 'bg-[#1a1a1a] border-gray-800'
          : 'bg-white border-gray-200'
          } shadow-md`}>
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4E6E49]"></div>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Загрузка данных...</p>
          </div>
        </div>
      ) : (
        <>
          <div id="earn-history" className="space-y-6">
            <EarningsTable earnings={earnings} />
            <EarningsList
              earnings={earnings}
              onEdit={handleEdit}
              onDelete={loadEarnings}
            />
          </div>

          {/* Insights */}
          <div id="earn-insights" className={`rounded-2xl p-6 ${cardBg} border ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} shadow-lg space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Инсайты</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Где мы зарабатываем больше всего</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  label: 'Топ категория',
                  value: topCategory ? `${EARNINGS_CATEGORY_META[topCategory.key].label} · ${topCategory.net.toFixed(0)} ₽` : 'Нет данных',
                  tone: 'bg-blue-500/10 text-blue-600 dark:text-blue-200'
                },
                {
                  label: 'Лидер команды',
                  value: topContributor ? `${topContributor.name} · ${topContributor.net.toFixed(0)} ₽` : 'Нет данных',
                  tone: 'bg-purple-500/10 text-purple-600 dark:text-purple-200'
                },
                {
                  label: 'Доля пула (мес.)',
                  value: stats.monthTotal ? `${Math.round((stats.monthPool / stats.monthTotal) * 100)}%` : '45%',
                  tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-200'
                },
                {
                  label: 'Средняя выплата',
                  value: earnings.length ? `${(earnings.reduce((sum, e) => sum + getNetValue(e), 0) / earnings.length).toFixed(0)} ₽` : '0 ₽',
                  tone: 'bg-orange-500/10 text-orange-600 dark:text-orange-200'
                },
              ].map((item) => (
                <div key={item.label} className={`p-3 rounded-xl ${item.tone} border ${theme === 'dark' ? 'border-white/10' : 'border-transparent'} shadow-sm`}>
                  <p className="text-[11px] uppercase tracking-wide opacity-70">{item.label}</p>
                  <p className="text-xl font-extrabold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Form */}
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

