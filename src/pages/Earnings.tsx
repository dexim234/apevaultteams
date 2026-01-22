// Earnings page
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { EarningsForm } from '@/components/Earnings/EarningsForm'
import { EarningsTable } from '@/components/Earnings/EarningsTable'
import { EarningsList } from '@/components/Earnings/EarningsList'
import { getEarnings } from '@/services/firestoreService'
import { Earnings as EarningsType, EARNINGS_CATEGORY_META, EarningsCategory } from '@/types'
import { Plus, DollarSign, TrendingUp, Sparkles, Wallet, PiggyBank, PieChart, Coins, BarChart3, Zap, ShieldCheck } from 'lucide-react'
import { getWeekRange, formatDate } from '@/utils/dateUtils'
import { getUserNicknameAsync } from '@/utils/userUtils'
import { useUsers } from '@/hooks/useUsers'
import { useAccessControl } from '@/hooks/useAccessControl'
import { Lock } from 'lucide-react'

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

  // Access Control Hooks
  const pageAccess = useAccessControl('avf_profit')
  const statsAccess = useAccessControl('profit_stats_view')
  const addAccess = useAccessControl('profit_add')
  const insightsAccess = useAccessControl('profit_insights_view')
  const leadersAccess = useAccessControl('profit_leaders_view')
  const historyAccess = useAccessControl('profit_history_view')

  // Category Access
  const memecoinsAccess = useAccessControl('profit_cat_memecoins')
  const polymarketAccess = useAccessControl('profit_cat_polymarket')
  const nftAccess = useAccessControl('profit_cat_nft')
  const spotAccess = useAccessControl('profit_cat_spot')
  const futuresAccess = useAccessControl('profit_cat_futures')
  const stakingAccess = useAccessControl('profit_cat_staking')
  const airdropAccess = useAccessControl('profit_cat_airdrop')
  const otherAccess = useAccessControl('profit_cat_other')

  const categoryAccess: Record<EarningsCategory, boolean> = {
    memecoins: memecoinsAccess.hasAccess,
    polymarket: polymarketAccess.hasAccess,
    nft: nftAccess.hasAccess,
    spot: spotAccess.hasAccess,
    futures: futuresAccess.hasAccess,
    staking: stakingAccess.hasAccess,
    airdrop: airdropAccess.hasAccess,
    other: otherAccess.hasAccess
  }

  const POOL_RATE = 0.45
  const categoryKeys = Object.keys(EARNINGS_CATEGORY_META) as EarningsCategory[]

  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const getPoolValue = (earning: EarningsType) => earning.poolAmount || earning.amount * POOL_RATE
  const getNetValue = (earning: EarningsType) => Math.max(earning.amount - getPoolValue(earning), 0)
  const getParticipants = (earning: EarningsType) => earning.participants?.length ? earning.participants : [earning.userId]

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

  // Get all users for rankings
  const { users: allMembers } = useUsers()

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
        for (const member of allMembers) {
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
  }, [allMembers])

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
  }).filter(cat => cat.key !== 'other')

  const totalNet = categoryBreakdown.reduce((sum, cat) => sum + cat.net, 0)
  const categoryWithShares = categoryBreakdown.map(cat => ({
    ...cat,
    share: totalNet > 0 ? (cat.net / totalNet) * 100 : 0
  })).sort((a, b) => b.share - a.share)

  const contributorRanking = allMembers.map((member) => {
    const related = earnings.filter((e) => getParticipants(e).includes(member.id))
    const net = related.reduce((sum, e) => {
      const share = getNetValue(e) / Math.max(getParticipants(e).length, 1)
      return sum + share
    }, 0)
    const poolShare = related.reduce((sum, e) => {
      const share = getPoolValue(e) / Math.max(getParticipants(e).length, 1)
      return sum + share
    }, 0)
    // Гросс вклад (суммарно сколько заработал мембер ДО вычета пула)
    const grossContribution = related.reduce((sum, e) => {
      const share = e.amount / Math.max(getParticipants(e).length, 1)
      return sum + share
    }, 0)

    return { ...member, net, poolShare, grossContribution }
  }).sort((a, b) => b.net - a.net)

  const topCategory = [...categoryBreakdown].sort((a, b) => b.net - a.net)[0]
  const topContributor = contributorRanking[0]

  if (pageAccess.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!pageAccess.hasAccess) {
    return (
      <div className="py-20 text-center space-y-4">
        <Lock className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
        <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Доступ к AVF Profit ограничен</h3>
        <p className="text-gray-500 max-w-md mx-auto">{pageAccess.reason || 'У вас нет доступа к мониторингу доходов.'}</p>
      </div>
    )
  }

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
                AVF Profit
              </h1>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Мониторинг доходов и распределение пула
              </p>
            </div>
          </div>
          {addAccess.hasAccess && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить заработок</span>
            </button>
          )}
        </div>

        {/* Stats Grid */}
        {statsAccess.hasAccess && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'НЕДЕЛЯ (ЧИСТЫМИ)',
                value: `${stats.weekNet.toLocaleString()} ₽`,
                badgeIcon: <Zap className="w-4 h-4 text-emerald-500" />,
                changeType: 'positive',
                icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
                bgClass: 'bg-emerald-500/5',
                borderClass: 'border-emerald-500/10'
              },
              {
                label: 'НЕДЕЛЯ (ПУЛ)',
                value: `${stats.weekPool.toLocaleString()} ₽`,
                badgeIcon: <ShieldCheck className="w-4 h-4 text-blue-400" />,
                icon: <PiggyBank className="w-5 h-5 text-blue-400" />,
                bgClass: 'bg-blue-500/5',
                borderClass: 'border-blue-500/10'
              },
              {
                label: 'МЕСЯЦ (ЧИСТЫМИ)',
                value: `${stats.monthNet.toLocaleString()} ₽`,
                isTrend: true,
                icon: <Wallet className="w-5 h-5 text-purple-400" />,
                bgClass: 'bg-purple-500/5',
                borderClass: 'border-purple-500/10'
              },
              {
                label: 'МЕСЯЦ (ПУЛ)',
                value: `${stats.monthPool.toLocaleString()} ₽`,
                isCoins: true,
                icon: <Coins className="w-5 h-5 text-orange-400" />,
                bgClass: 'bg-orange-500/5',
                borderClass: 'border-orange-500/10',
                change: undefined,
                badgeIcon: undefined
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl group ${theme === 'dark'
                  ? `${item.bgClass} ${item.borderClass} hover:border-white/20`
                  : 'bg-white border-gray-100 hover:border-emerald-500/20 shadow-sm'
                  }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                  {item.change && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black">
                      {item.change}
                    </span>
                  )}
                  {'badgeIcon' in item && item.badgeIcon && (
                    <div className="p-1 bg-emerald-500/10 rounded-lg">
                      {item.badgeIcon as React.ReactNode}
                    </div>
                  )}
                  {item.isTrend && <TrendingUp className="w-4 h-4 text-purple-500/40" />}
                  {item.isCoins && <PiggyBank className="w-4 h-4 text-orange-500/40" />}
                </div>
                <div className="flex items-end justify-between">
                  <div className={`text-2xl md:text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Split layout: Shares vs Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Shares */}
        <div className={`lg:col-span-3 rounded-2xl p-6 ${cardBg} border ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} shadow-xl`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#4E6E49]/10 rounded-lg">
              <PieChart className="w-5 h-5 text-[#4E6E49]" />
            </div>
            <h3 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Доли заработка</h3>
          </div>

          <div className="space-y-6">
            {categoryWithShares.filter(cat => categoryAccess[cat.key]).map((cat) => {
              const meta = EARNINGS_CATEGORY_META[cat.key]
              return (
                <div key={cat.key} className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${meta.accent === 'emerald' ? 'bg-emerald-500' :
                        meta.accent === 'blue' ? 'bg-blue-500' :
                          meta.accent === 'purple' ? 'bg-purple-500' :
                            meta.accent === 'amber' ? 'bg-amber-500' :
                              meta.accent === 'pink' ? 'bg-pink-500' :
                                meta.accent === 'indigo' ? 'bg-indigo-500' :
                                  meta.accent === 'cyan' ? 'bg-cyan-500' : 'bg-gray-500'
                        }`} />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{meta.label}</span>
                    </div>
                    <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{cat.share.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${meta.accent === 'emerald' ? 'bg-emerald-500' :
                        meta.accent === 'blue' ? 'bg-blue-500' :
                          meta.accent === 'purple' ? 'bg-purple-500' :
                            meta.accent === 'amber' ? 'bg-amber-500' :
                              meta.accent === 'pink' ? 'bg-pink-500' :
                                meta.accent === 'indigo' ? 'bg-indigo-500' :
                                  meta.accent === 'cyan' ? 'bg-cyan-500' : 'bg-gray-500'
                        }`}
                      style={{ width: `${cat.share}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Category Details Grid */}
        <div className={`lg:col-span-9 rounded-2xl p-6 ${cardBg} border ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} shadow-xl`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Детализация дохода по сферам</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryWithShares.filter(cat => categoryAccess[cat.key]).map((cat) => {
              const meta = EARNINGS_CATEGORY_META[cat.key]
              return (
                <div key={cat.key} className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-black/20 border-white/5 hover:border-white/10' : 'bg-gray-50 border-gray-200'} transition-all group`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-2 h-2 rounded-full ${meta.accent === 'emerald' ? 'bg-emerald-500' :
                      meta.accent === 'blue' ? 'bg-blue-500' :
                        meta.accent === 'purple' ? 'bg-purple-500' :
                          meta.accent === 'amber' ? 'bg-amber-500' :
                            meta.accent === 'pink' ? 'bg-pink-500' :
                              meta.accent === 'indigo' ? 'bg-indigo-500' :
                                meta.accent === 'cyan' ? 'bg-cyan-500' : 'bg-gray-500'
                      }`} />
                    <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{meta.label}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase mb-1">ЧИСТЫМИ</p>
                      <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{cat.net.toLocaleString()} ₽</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gray-500 uppercase mb-1">В ПУЛ</p>
                      <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{cat.pool.toLocaleString()} ₽</p>
                    </div>
                  </div>

                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${meta.accent === 'emerald' ? 'bg-emerald-500 focus:bg-emerald-400' :
                        meta.accent === 'blue' ? 'bg-blue-500 focus:bg-blue-400' :
                          meta.accent === 'purple' ? 'bg-purple-500 focus:bg-purple-400' :
                            meta.accent === 'amber' ? 'bg-amber-500 focus:bg-amber-400' :
                              meta.accent === 'pink' ? 'bg-pink-500 focus:bg-pink-400' :
                                meta.accent === 'indigo' ? 'bg-indigo-500 focus:bg-indigo-400' :
                                  meta.accent === 'cyan' ? 'bg-cyan-500 focus:bg-cyan-400' : 'bg-gray-500'
                        }`}
                      style={{ width: `${cat.share}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div id="earn-insights" className={`relative overflow-hidden rounded-3xl p-8 ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} border shadow-2xl ${!insightsAccess.hasAccess ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
        {!insightsAccess.hasAccess && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-3xl">
            <div className="flex flex-col items-center gap-2">
              <Lock className="w-8 h-8 text-white/50" />
              <p className="text-white/70 font-bold text-sm">Инсайты ограничены</p>
            </div>
          </div>
        )}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 space-y-8">
          <div>
            <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Инсайты Эффективности</h3>
            <p className="text-xs text-gray-500">Аналитика доходности по направлениям и участникам</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Топ категория',
                value: topCategory ? EARNINGS_CATEGORY_META[topCategory.key].label : '—',
                note: '+14% ROI',
                icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
              },
              {
                label: 'Лидер недели',
                value: topContributor ? topContributor.name : '—',
                note: topContributor ? `${topContributor.net.toLocaleString()} ₽ чистого` : 'Нет данных',
                icon: <Sparkles className="w-5 h-5 text-amber-500" />,
              },
              {
                label: 'Доля пула в работе',
                value: stats.monthTotal ? `${Math.round((stats.monthPool / stats.monthTotal) * 100)}%` : '68%',
                note: stats.monthTotal ? `Доступно ${stats.monthPool.toLocaleString()} ₽` : 'Доступно 0 ₽',
                icon: <PiggyBank className="w-5 h-5 text-blue-500" />,
              },
              {
                label: 'Средняя выплата',
                value: earnings.length ? `${(earnings.reduce((sum, e) => sum + getNetValue(e), 0) / earnings.length).toFixed(0)} ₽` : '0 ₽',
                note: '↑ 5%',
                icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
              },
            ].map((item, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</span>
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <p className={`text-lg font-black leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#4E6E49]">{item.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5">
        {loading ? (
          <div className={`rounded-2xl p-12 text-center border border-dashed ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Загрузка данных...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {leadersAccess.hasAccess && (
              <div id="earn-history" className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Лидеры по доходу</h3>
                  </div>
                </div>

                <EarningsTable earnings={earnings.filter(e => categoryAccess[e.category])} />

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl">
                      <PiggyBank className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Личные Накопления</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {contributorRanking.map((member) => (
                      <div
                        key={member.id}
                        className={`relative overflow-hidden rounded-2xl p-5 border shadow-xl ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative">
                            {member.avatar ? (
                              <img src={member.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-black text-emerald-500">
                                {member.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className={`text-sm font-black truncate max-w-[100px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{member.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{member.login}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Всего заработано</p>
                            <p className="text-base font-black text-emerald-500">{member.grossContribution.toLocaleString()} ₽</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">В ПУЛ</p>
                              <p className={`text-[11px] font-black ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{member.poolShare.toLocaleString()} ₽</p>
                            </div>
                            <div className="space-y-1 text-right">
                              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">ПОЛУЧЕНО</p>
                              <p className={`text-[11px] font-black ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{member.net.toLocaleString()} ₽</p>
                            </div>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${Math.min((member.net / member.grossContribution) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {historyAccess.hasAccess && (
              <div className="pt-8 border-t border-white/5">
                <EarningsList
                  earnings={earnings.filter(e => categoryAccess[e.category])}
                  onEdit={handleEdit}
                  onDelete={loadEarnings}
                />
              </div>
            )}
          </div>
        )}
      </div>

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

