// Rating page
import { useState, useEffect, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { RatingCard } from '@/components/Rating/RatingCard'
import { ReferralForm } from '@/components/Rating/ReferralForm'
import { getRatingData, getEarnings, getDayStatuses, getReferrals, getWorkSlots, deleteReferral, addApprovalRequest, getLatestUserActivities, getUserActivitiesLast24Hours } from '@/services/firestoreService'
import { getLastNDaysRange, getWeekRange, formatDate, calculateHours, countDaysInPeriod } from '@/utils/dateUtils'
import { calculateRating, getRatingBreakdown } from '@/utils/ratingUtils'
import { getUserNicknameAsync, clearAllNicknameCache, getUserNicknameSync } from '@/utils/userUtils'
import { RatingData, Referral, UserActivity } from '@/types'
import { useUsers } from '@/hooks/useUsers'
import { TrendingUp, Users, Award, Target, Calendar, Activity, UserPlus, BarChart3 } from 'lucide-react'

export const Rating = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { users: allMembers, loading: usersLoading } = useUsers()
  type RatingWithBreakdown = RatingData & { breakdown?: ReturnType<typeof getRatingBreakdown> }
  const [ratings, setRatings] = useState<RatingWithBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [showReferralForm, setShowReferralForm] = useState(false)
  const [activeReferral, setActiveReferral] = useState<Referral | null>(null)
  const [userActivities, setUserActivities] = useState<UserActivity[]>([])
  const [activities24h, setActivities24h] = useState<UserActivity[]>([])

  useEffect(() => {
    loadRatings()
  }, [])

  const loadRatings = async () => {
    setLoading(true)
    try {
      // Для рейтинга считаем за неделю и за месяц
      const weekRange = getWeekRange()
      const weekStart = formatDate(weekRange.start, 'yyyy-MM-dd')
      const weekEnd = formatDate(weekRange.end, 'yyyy-MM-dd')

      const monthRange = getLastNDaysRange(30)
      const monthStart = formatDate(monthRange.start, 'yyyy-MM-dd')
      const monthEnd = formatDate(monthRange.end, 'yyyy-MM-dd')
      const monthIsoStart = monthRange.start.toISOString()
      const monthIsoEnd = monthRange.end.toISOString()

      const ninetyDayRange = getLastNDaysRange(90)
      const ninetyDayStart = formatDate(ninetyDayRange.start, 'yyyy-MM-dd')
      const ninetyDayEnd = formatDate(ninetyDayRange.end, 'yyyy-MM-dd')

      const currentReferrals = await getReferrals(undefined, monthIsoStart, monthIsoEnd)
      setReferrals(currentReferrals)
      const allRatings: (RatingData & { breakdown?: ReturnType<typeof getRatingBreakdown> })[] = []

      for (const member of allMembers) {
        // Данные для рейтинга
        const weekEarnings = await getEarnings(member.id, weekStart, weekEnd)
        // Если у записи несколько участников, сумма делится поровну между ними
        const weeklyEarnings = weekEarnings.reduce((sum, e) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.amount / participantCount)
        }, 0)

        const monthEarnings = await getEarnings(member.id, monthStart, monthEnd)
        // Если у записи несколько участников, сумма делится поровну между ними
        const totalEarnings = monthEarnings.reduce((sum, e) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.amount / participantCount)
        }, 0)
        const poolAmount = monthEarnings.reduce((sum, e) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.poolAmount / participantCount)
        }, 0)

        const statuses = await getDayStatuses(member.id)
        // Filter statuses that overlap with the month period
        const monthStatuses = statuses.filter(s => {
          const statusStart = s.date
          const statusEnd = s.endDate || s.date
          return statusStart <= monthEnd && statusEnd >= monthStart
        })
        // Count days, not just status count (for multi-day statuses)
        const daysOff = monthStatuses
          .filter(s => s.type === 'dayoff')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const sickDays = monthStatuses
          .filter(s => s.type === 'sick')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const vacationDays = monthStatuses
          .filter(s => s.type === 'vacation')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const absenceDays = monthStatuses
          .filter(s => s.type === 'absence')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const truancyDays = monthStatuses
          .filter(s => s.type === 'truancy')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const internshipDays = monthStatuses
          .filter(s => s.type === 'internship')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)

        // Недельные выходные и больничные
        const weekStatuses = statuses.filter(s => {
          const statusStart = s.date
          const statusEnd = s.endDate || s.date
          return statusStart <= weekEnd && statusEnd >= weekStart
        })

        const weeklyDaysOff = weekStatuses
          .filter(s => s.type === 'dayoff')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, weekStart, weekEnd), 0)
        const weeklySickDays = weekStatuses
          .filter(s => s.type === 'sick')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, weekStart, weekEnd), 0)

        // Отпуск за 90 дней
        const ninetyDayStatuses = statuses.filter(s => {
          const statusStart = s.date
          const statusEnd = s.endDate || s.date
          return statusStart <= ninetyDayEnd && statusEnd >= ninetyDayStart
        })

        const ninetyDayVacationDays = ninetyDayStatuses
          .filter(s => s.type === 'vacation')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, ninetyDayStart, ninetyDayEnd), 0)

        const slots = await getWorkSlots(member.id)
        const weekSlots = slots.filter(s => s.date >= weekStart && s.date <= weekEnd)
        const weeklyHours = weekSlots.reduce((sum, slot) => sum + calculateHours(slot.slots), 0)

        // Для статистики используем общее количество из ratings
        const existingRatings = await getRatingData(member.id)
        const ratingData = existingRatings[0] || {
          userId: member.id,
          earnings: 0,
          messages: 0,
          initiatives: 0,
          signals: 0,
          profitableSignals: 0,
          referrals: 0,
          daysOff: 0,
          sickDays: 0,
          vacationDays: 0,
          absenceDays: 0,
          internshipDays: 0,
          poolAmount: 0,
          rating: 0,
          lastUpdated: new Date().toISOString(),
        }

        const userReferrals = currentReferrals.filter((referral) => referral.ownerId === member.id).length

        const updatedData: Omit<RatingData, 'rating'> = {
          userId: member.id,
          earnings: totalEarnings,
          messages: ratingData.messages || 0,
          initiatives: ratingData.initiatives || 0,
          signals: ratingData.signals || 0,
          profitableSignals: ratingData.profitableSignals || 0,
          referrals: userReferrals,
          daysOff,
          sickDays,
          vacationDays,
          absenceDays,
          truancyDays,
          internshipDays,
          poolAmount,
          lastUpdated: new Date().toISOString(),
        }

        const rating = calculateRating(updatedData, weeklyHours, weeklyEarnings, weeklyDaysOff, weeklySickDays, ninetyDayVacationDays)
        const breakdown = getRatingBreakdown(updatedData, weeklyHours, weeklyEarnings, weeklyDaysOff, weeklySickDays, ninetyDayVacationDays)

        allRatings.push({
          ...updatedData,
          rating,
          breakdown,
        })
      }

      // Sort by rating
      allRatings.sort((a, b) => b.rating - a.rating)
      setRatings(allRatings)

      // Load user activities
      const activities = await getLatestUserActivities()
      setUserActivities(activities)

      // Load activities for last 24 hours
      const activitiesLast24h = await getUserActivitiesLast24Hours()
      setActivities24h(activitiesLast24h)
    } catch (error) {
      console.error('Error loading ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  const teamKPD = ratings.reduce((sum, r) => sum + r.rating, 0) / (ratings.length || 1)
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

  const getRecommendations = (r: typeof sortedRatings[number]) => {
    if (!r.breakdown) return ['Недостаточно данных — обновите статистику.']
    const tips: string[] = []
    if (r.breakdown.weeklyHoursPoints < 25) tips.push('Дотяни рабочие часы до 20+ в неделю (25%).')
    if (r.breakdown.weeklyEarningsPoints < 30) tips.push('Увеличь недельный доход до 6000+ ₽ (30%).')
    if (r.breakdown.referralsPoints < 30) tips.push('Добавь рефералов: до +30% (6 человек).')
    if (r.breakdown.daysOffPoints <= 0) tips.push('Выходные: <2 дней в неделю для +5%.')
    if (r.breakdown.sickDaysPoints <= 0) tips.push('Больничные: <3 дней в неделю И ≤9 дней в месяц для +5%.')
    if (r.breakdown.vacationDaysPoints <= 0) tips.push('Отпуск: <12 дней в месяц И ≤30 дней за 90 дней для +10%.')
    return tips.length ? tips : ['Отлично! Держи текущий темп.']
  }

  const sortedRatings = useMemo<RatingWithBreakdown[]>(() => {
    return [...ratings].sort((a, b) => b.rating - a.rating)
  }, [ratings])

  const ratingOverview = useMemo(() => {
    if (!ratings.length) {
      return { top: 0, median: 0, count: 0, high: 0 }
    }
    const sorted = [...ratings].sort((a, b) => b.rating - a.rating)
    const top = sorted[0]?.rating || 0
    const median = sorted[Math.floor((sorted.length - 1) / 2)]?.rating || top
    const high = sorted.filter((r) => r.rating >= 80).length
    return { top, median, count: sorted.length, high }
  }, [ratings])

  const topMember = sortedRatings[0]
  const topMemberName = topMember ? getUserNicknameSync(topMember.userId) : '—'
  const todayLabel = new Date().toLocaleDateString('ru-RU')

  const getMemberNameById = (id: string) => {
    // Use sync version for immediate display, will be updated when cache is populated
    return getUserNicknameSync(id) || '—'
  }

  // Load custom nicknames on mount
  useEffect(() => {
    const loadCustomNicknames = async () => {
      clearAllNicknameCache()
      for (const member of allMembers) {
        await getUserNicknameAsync(member.id)
      }
    }
    if (!usersLoading) {
      loadCustomNicknames()
    }
  }, [allMembers, usersLoading])

  // Listen for nickname updates and reload nicknames
  useEffect(() => {
    const handleNicknameUpdate = async (event: Event) => {
      const customEvent = event as CustomEvent<{ userId: string }>
      const { userId } = customEvent.detail || {}
      if (userId) {
        // Reload nickname for the updated user
        await getUserNicknameAsync(userId)
        // Force component re-render by updating state
        setRatings(prev => [...prev])
      } else {
        // Reload all nicknames if userId not specified
        clearAllNicknameCache()
        for (const member of allMembers) {
          await getUserNicknameAsync(member.id)
        }
        setRatings(prev => [...prev])
      }
    }

    window.addEventListener('nicknameUpdated', handleNicknameUpdate)
    return () => {
      window.removeEventListener('nicknameUpdated', handleNicknameUpdate)
    }
  }, [allMembers])

  const handleAddReferral = () => {
    setActiveReferral(null)
    setShowReferralForm(true)
  }

  const handleEditReferral = (referral: Referral) => {
    setActiveReferral(referral)
    setShowReferralForm(true)
  }

  const handleDeleteReferral = async (referral: Referral) => {
    const canManage = isAdmin || referral.ownerId === user?.id
    if (!canManage) return
    if (isAdmin) {
      await deleteReferral(referral.id)
    } else {
      await addApprovalRequest({
        entity: 'referral',
        action: 'delete',
        authorId: user?.id || referral.ownerId,
        targetUserId: referral.ownerId,
        before: referral,
        after: null,
      })
    }
    await loadRatings()
  }

  const statCards = [
    {
      label: 'Средний КПД команды',
      value: `${teamKPD.toFixed(1)}%`,
      note: 'за текущую неделю',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      bgClass: 'bg-emerald-500/5',
      borderClass: 'border-emerald-500/20'
    },
    {
      label: 'Лидер недели',
      value: topMemberName,
      note: topMember ? `${topMember.rating.toFixed(1)}%` : '—',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      bgClass: 'bg-amber-500/5',
      borderClass: 'border-amber-500/20'
    },
    {
      label: 'Участников 80%+',
      value: `${ratingOverview.high}`,
      note: 'высокий уровень',
      icon: <Target className="w-5 h-5 text-blue-400" />,
      bgClass: 'bg-blue-500/5',
      borderClass: 'border-blue-500/20'
    },
    {
      label: 'Всего участников',
      value: `${ratings.length}`,
      note: 'в рейтинге',
      icon: <Users className="w-5 h-5 text-purple-400" />,
      bgClass: 'bg-purple-500/5',
      borderClass: 'border-purple-500/20'
    },
    {
      label: 'Медиана рейтинга',
      value: `${ratingOverview.median.toFixed(1)}%`,
      note: 'средний показатель',
      icon: <BarChart3 className="w-5 h-5 text-indigo-400" />,
      bgClass: 'bg-indigo-500/5',
      borderClass: 'border-indigo-500/20'
    },
    {
      label: 'Рефералы за 30 дней',
      value: `${referrals.length}`,
      note: 'новые участники',
      icon: <UserPlus className="w-5 h-5 text-pink-400" />,
      bgClass: 'bg-pink-500/5',
      borderClass: 'border-pink-500/20'
    },
    {
      label: 'Обновление данных',
      value: todayLabel,
      note: 'автообновление',
      icon: <Calendar className="w-5 h-5 text-cyan-400" />,
      bgClass: 'bg-cyan-500/5',
      borderClass: 'border-cyan-500/20'
    },
    {
      label: 'Активность команды',
      value: `${activities24h.length}`,
      note: 'сессий за 24ч',
      icon: <Activity className="w-5 h-5 text-teal-400" />,
      bgClass: 'bg-teal-500/5',
      borderClass: 'border-teal-500/20'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${headingColor}`}>
                AVF Rating
              </h1>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Рейтинг эффективности команды ApeVault Frontier
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((item, idx) => (
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
                <div className={`text-2xl font-black tracking-tight ${headingColor}`}>
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

      {/* Recommendations Section */}
      <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} shadow-xl`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className={`text-lg font-black tracking-tight ${headingColor}`}>Рекомендации по улучшению</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Персональные советы для каждого участника</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedRatings.map((r) => {
            const recs = getRecommendations(r)
            const userName = getMemberNameById(r.userId)
            const bandClass =
              r.rating >= 80
                ? 'bg-emerald-500'
                : r.rating >= 60
                  ? 'bg-blue-500'
                  : r.rating >= 40
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
            const bandText =
              r.rating >= 80 ? 'Эталон' : r.rating >= 60 ? 'Уверенно' : r.rating >= 40 ? 'В пути' : 'Зона роста'

            return (
              <div key={r.userId} className={`rounded-xl border p-4 space-y-3 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-xs uppercase tracking-wider font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{bandText}</p>
                    <h4 className={`text-lg font-bold ${headingColor} truncate`}>{userName}</h4>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-black ${headingColor}`}>{r.rating.toFixed(1)}%</div>
                  </div>
                </div>
                <div className={`w-full rounded-full h-2 overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-200'}`}>
                  <div
                    className={`h-full ${bandClass}`}
                    style={{ width: `${Math.min(r.rating, 100)}%` }}
                  />
                </div>
                <ul className={`space-y-1 text-sm ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
                  {recs.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-xs mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity Section */}
      <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} shadow-xl`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className={`text-lg font-black tracking-tight ${headingColor}`}>Активность на сайте</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Последняя активность участников</p>
          </div>
        </div>
        {userActivities.length > 0 ? (
          <div className={`overflow-auto rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <table className={`min-w-[800px] w-full text-sm ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>
              <thead className={`text-left ${theme === 'dark' ? 'bg-white/5 text-white/70' : 'bg-gray-100 text-gray-600'}`}>
                <tr>
                  <th className="py-3 px-4 font-semibold">Участник</th>
                  <th className="py-3 px-4 font-semibold">Последний вход</th>
                  <th className="py-3 px-4 font-semibold">Браузер</th>
                  <th className="py-3 px-4 font-semibold">Время на сайте</th>
                  <th className="py-3 px-4 font-semibold">Выход</th>
                  <th className="py-3 px-4 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody>
                {allMembers.map((member) => {
                  const activity = userActivities.find((a) => a.userId === member.id)
                  const formatSessionDuration = (seconds?: number): string => {
                    if (!seconds) return '—'
                    const hours = Math.floor(seconds / 3600)
                    const minutes = Math.floor((seconds % 3600) / 60)
                    const secs = seconds % 60
                    if (hours > 0) {
                      return `${hours}ч ${minutes}м ${secs}с`
                    } else if (minutes > 0) {
                      return `${minutes}м ${secs}с`
                    } else {
                      return `${secs}с`
                    }
                  }
                  const formatDateTime = (isoString: string): string => {
                    try {
                      const date = new Date(isoString)
                      return formatDate(date, 'dd.MM.yyyy HH:mm')
                    } catch {
                      return isoString
                    }
                  }

                  return (
                    <tr
                      key={member.id}
                      className={`border-t transition-colors ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-100'}`}
                    >
                      <td className={`py-3 px-4 font-semibold whitespace-nowrap ${headingColor}`}>{getUserNicknameSync(member.id)}</td>
                      <td className={`py-3 px-4 whitespace-nowrap ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
                        {activity ? formatDateTime(activity.loginAt) : '—'}
                      </td>
                      <td className={`py-3 px-4 whitespace-nowrap ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
                        {activity?.browser || '—'}
                      </td>
                      <td className={`py-3 px-4 whitespace-nowrap ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
                        {activity ? formatSessionDuration(activity.sessionDuration) : '—'}
                      </td>
                      <td className={`py-3 px-4 whitespace-nowrap ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
                        {activity?.logoutAt ? formatDateTime(activity.logoutAt) : activity?.isActive ? 'Активен' : '—'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {activity?.isActive ? (
                          <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                            Онлайн
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-gray-500/20 text-gray-300 border border-gray-400/30">
                            Офлайн
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/70' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            Данные об активности пока отсутствуют.
          </div>
        )}

        {/* 24h Stats */}
        <div className="mt-6">
          <h4 className={`text-base font-bold ${headingColor} mb-4`}>Статистика за последние 24 часа</h4>
          {activities24h.length > 0 ? (
            <div className={`overflow-auto rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <table className={`min-w-[700px] w-full text-sm ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>
                <thead className={`text-left ${theme === 'dark' ? 'bg-white/5 text-white/70' : 'bg-gray-100 text-gray-600'}`}>
                  <tr>
                    <th className="py-3 px-4 font-semibold">Участник</th>
                    <th className="py-3 px-4 font-semibold">Входов</th>
                    <th className="py-3 px-4 font-semibold">Общее время</th>
                    <th className="py-3 px-4 font-semibold">Среднее время сессии</th>
                    <th className="py-3 px-4 font-semibold">Последний вход</th>
                  </tr>
                </thead>
                <tbody>
                  {allMembers.map((member) => {
                    const memberActivities = activities24h.filter((a) => a.userId === member.id)

                    const formatSessionDuration = (seconds?: number): string => {
                      if (!seconds) return '—'
                      const hours = Math.floor(seconds / 3600)
                      const minutes = Math.floor((seconds % 3600) / 60)
                      const secs = seconds % 60
                      if (hours > 0) {
                        return `${hours}ч ${minutes}м ${secs}с`
                      } else if (minutes > 0) {
                        return `${minutes}м ${secs}с`
                      } else {
                        return `${secs}с`
                      }
                    }

                    const formatDateTime = (isoString: string): string => {
                      try {
                        const date = new Date(isoString)
                        return formatDate(date, 'dd.MM.yyyy HH:mm')
                      } catch {
                        return isoString
                      }
                    }

                    // Calculate statistics
                    const totalSessions = memberActivities.length
                    const totalDuration = memberActivities.reduce((sum, a) => {
                      return sum + (a.sessionDuration || 0)
                    }, 0)
                    const avgDuration = totalSessions > 0 ? Math.floor(totalDuration / totalSessions) : 0

                    // Get latest activity
                    const latestActivity = memberActivities.length > 0
                      ? memberActivities.reduce((latest, current) => {
                        return new Date(current.loginAt) > new Date(latest.loginAt) ? current : latest
                      })
                      : null

                    return (
                      <tr
                        key={member.id}
                        className={`border-t transition-colors ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-100'}`}
                      >
                        <td className={`py-3 px-4 font-semibold whitespace-nowrap ${headingColor}`}>{getUserNicknameSync(member.id)}</td>
                        <td className={`py-3 px-4 whitespace-nowrap text-center ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
                          {totalSessions > 0 ? totalSessions : '—'}
                        </td>
                        <td className={`py-3 px-4 whitespace-nowrap ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
                          {totalDuration > 0 ? formatSessionDuration(totalDuration) : '—'}
                        </td>
                        <td className={`py-3 px-4 whitespace-nowrap ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
                          {avgDuration > 0 ? formatSessionDuration(avgDuration) : '—'}
                        </td>
                        <td className={`py-3 px-4 whitespace-nowrap ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>
                          {latestActivity ? formatDateTime(latestActivity.loginAt) : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/70' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
              За последние 24 часа активности не зафиксировано.
            </div>
          )}
        </div>
      </div>

      {/* Referrals Section */}
      <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} shadow-xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/10 rounded-xl">
              <UserPlus className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className={`text-lg font-black tracking-tight ${headingColor}`}>Рефералы</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Всего: {referrals.length}</p>
            </div>
          </div>
          <button
            onClick={handleAddReferral}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Добавить реферала</span>
          </button>
        </div>

        {referrals.length ? (
          <div className={`overflow-auto rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <table className={`min-w-[820px] w-full text-sm ${theme === 'dark' ? 'text-white/90' : 'text-gray-900'}`}>
              <thead className={`text-left ${theme === 'dark' ? 'bg-white/5 text-white/70' : 'bg-gray-100 text-gray-600'}`}>
                <tr>
                  <th className="py-3 px-4 font-semibold">Кто привел</th>
                  <th className="py-3 px-4 font-semibold">Код</th>
                  <th className="py-3 px-4 font-semibold">Имя</th>
                  <th className="py-3 px-4 font-semibold">Комментарий</th>
                  <th className="py-3 px-4 font-semibold text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => {
                  const ownerName = getMemberNameById(referral.ownerId)
                  const canManage = isAdmin || referral.ownerId === user?.id
                  return (
                    <tr
                      key={referral.id}
                      className={`border-t transition-colors ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-100'}`}
                    >
                      <td className={`py-3 px-4 font-semibold whitespace-nowrap ${headingColor}`}>{ownerName}</td>
                      <td className={`py-3 px-4 whitespace-nowrap ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>{referral.referralId}</td>
                      <td className={`py-3 px-4 ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>{referral.name}</td>
                      <td className={`py-3 px-4 ${theme === 'dark' ? 'text-white/70' : 'text-gray-500'}`}>{referral.comment || '—'}</td>
                      <td className="py-3 px-4 text-right whitespace-nowrap flex items-center justify-end gap-2">
                        <button
                          onClick={() => canManage && handleEditReferral(referral)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${!canManage
                              ? 'opacity-40 cursor-not-allowed'
                              : theme === 'dark'
                                ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                                : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                          disabled={!canManage}
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => canManage && handleDeleteReferral(referral)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-300/60 bg-rose-500/20 text-rose-50 transition ${!canManage ? 'opacity-40 cursor-not-allowed' : 'hover:bg-rose-500/30'}`}
                          disabled={!canManage}
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/70' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            Пока нет рефералов.
          </div>
        )}
      </div>

      {/* Rating Cards Section */}
      <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'bg-[#0b1015] border-white/5' : 'bg-white border-gray-100'} shadow-xl`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className={`text-lg font-black tracking-tight ${headingColor}`}>Детальная статистика</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Карточки участников с полными данными</p>
          </div>
        </div>

        {loading ? (
          <div className={`rounded-xl p-12 text-center border border-dashed ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Загрузка рейтинга...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Топ-1', value: sortedRatings[0]?.rating ? `${sortedRatings[0].rating.toFixed(1)}%` : '—' },
                { label: 'Средний рейтинг', value: `${teamKPD.toFixed(1)}%` },
                { label: 'Медиана', value: `${ratingOverview.median.toFixed(1)}%` },
                { label: 'Участников', value: sortedRatings.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl border px-4 py-3 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}
                >
                  <p className={`text-[11px] uppercase tracking-wide font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</p>
                  <p className={`text-2xl font-black ${headingColor}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
              {sortedRatings.map((rating, index) => {
                const memberName = getMemberNameById(rating.userId)
                return (
                  <RatingCard
                    key={rating.userId}
                    rating={rating}
                    memberName={memberName}
                    rank={index + 1}
                  />
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Form Overlay */}
      {showReferralForm && (
        <ReferralForm
          referral={activeReferral}
          onClose={() => {
            setShowReferralForm(false)
            setActiveReferral(null)
          }}
          onSave={() => {
            setShowReferralForm(false)
            setActiveReferral(null)
            loadRatings()
          }}
        />
      )}
    </div>
  )
}
