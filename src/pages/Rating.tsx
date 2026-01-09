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
import { RatingData, Referral, TEAM_MEMBERS, UserActivity } from '@/types'

export const Rating = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
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

      for (const member of TEAM_MEMBERS) {
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
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = 'bg-[#10141c]'
  const calmBorder = 'border-[#48a35e]/60'
  const cardShadow = 'shadow-[0_24px_80px_rgba(0,0,0,0.45)]'
  const heroLabelColor = theme === 'dark' ? 'text-white/70' : 'text-slate-600'
  const heroValueColor = theme === 'dark' ? 'text-white' : 'text-slate-900'

  const ratingBands = [
    { label: '80-100%', title: 'Эталон', desc: 'Стабильный вклад, примеры для команды', tone: 'text-emerald-700 dark:text-emerald-100', bg: 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200/60 dark:border-emerald-700/60' },
    { label: '60-79%', title: 'Уверенно', desc: 'Держат темп, есть потенциал роста', tone: 'text-blue-700 dark:text-blue-100', bg: 'bg-blue-50 dark:bg-blue-900/40 border-blue-200/60 dark:border-blue-700/60' },
    { label: '40-59%', title: 'В пути', desc: 'Нужна точечная поддержка и фокус', tone: 'text-amber-700 dark:text-amber-100', bg: 'bg-amber-50 dark:bg-amber-900/40 border-amber-200/60 dark:border-amber-700/60' },
    { label: '0-39%', title: 'Зона роста', desc: 'Запускаем план восстановления', tone: 'text-rose-700 dark:text-rose-100', bg: 'bg-rose-50 dark:bg-rose-900/40 border-rose-200/60 dark:border-rose-700/60' },
  ]

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

  type HeroTone = 'emerald' | 'amber' | 'blue' | 'slate' | 'purple' | 'pink' | 'indigo'

  const heroCards: { label: string; value: string; meta: string; tone: HeroTone }[] = [
    { label: 'Средний рейтинг', value: `${teamKPD.toFixed(1)}%`, meta: 'по команде за неделю', tone: 'emerald' },
    { label: 'Лидер недели', value: topMemberName, meta: topMember ? `${topMember.rating.toFixed(1)}%` : '—', tone: 'amber' },
    { label: '80%+ участников', value: `${ratingOverview.high}`, meta: 'стабильно высоко', tone: 'blue' },
    { label: 'Всего участников', value: `${ratings.length}`, meta: 'в рейтинге', tone: 'slate' },
    { label: 'Медиана', value: `${ratingOverview.median.toFixed(1)}%`, meta: 'ровный темп', tone: 'purple' },
    { label: 'Рефералы 30д', value: `${referrals.length}`, meta: 'активность команды', tone: 'pink' },
    { label: 'Обновление', value: todayLabel, meta: 'автообновление данных', tone: 'indigo' },
    { label: 'КПД недели', value: `${teamKPD.toFixed(1)}%`, meta: 'ключевой ориентир', tone: 'emerald' },
  ]

  const heroToneClass = (tone: HeroTone) => {
    if (tone === 'emerald') {
      return theme === 'dark'
        ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-50'
        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
    }
    if (tone === 'amber') {
      return theme === 'dark'
        ? 'bg-amber-500/15 border-amber-400/30 text-amber-50'
        : 'bg-amber-50 border-amber-200 text-amber-900'
    }
    if (tone === 'blue') {
      return theme === 'dark'
        ? 'bg-sky-500/15 border-sky-400/30 text-sky-50'
        : 'bg-sky-50 border-sky-200 text-sky-900'
    }
    if (tone === 'purple') {
      return theme === 'dark'
        ? 'bg-indigo-500/15 border-indigo-400/30 text-indigo-50'
        : 'bg-indigo-50 border-indigo-200 text-indigo-900'
    }
    if (tone === 'pink') {
      return theme === 'dark'
        ? 'bg-rose-500/15 border-rose-400/30 text-rose-50'
        : 'bg-rose-50 border-rose-200 text-rose-900'
    }
    if (tone === 'indigo') {
      return theme === 'dark'
        ? 'bg-indigo-500/15 border-indigo-400/30 text-indigo-50'
        : 'bg-indigo-50 border-indigo-200 text-indigo-900'
    }
    return theme === 'dark'
      ? 'bg-white/5 border-white/15 text-white'
      : 'bg-gray-50 border-gray-200 text-gray-900'
  }

  const getMemberNameById = (id: string) => {
    // Use sync version for immediate display, will be updated when cache is populated
    return getUserNicknameSync(id) || '—'
  }

  // Load custom nicknames on mount
  useEffect(() => {
    const loadCustomNicknames = async () => {
      clearAllNicknameCache()
      for (const member of TEAM_MEMBERS) {
        await getUserNicknameAsync(member.id)
      }
    }
    loadCustomNicknames()
  }, [])

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
        for (const member of TEAM_MEMBERS) {
          await getUserNicknameAsync(member.id)
        }
        setRatings(prev => [...prev])
      }
    }

    window.addEventListener('nicknameUpdated', handleNicknameUpdate)
    return () => {
      window.removeEventListener('nicknameUpdated', handleNicknameUpdate)
    }
  }, [])

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[#48a35e]/60 shadow-[0_24px_80px_rgba(0,0,0,0.45)] bg-[#10141c]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-16 -bottom-10 w-80 h-80 bg-emerald-500/18 blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_45%)]"></div>
        </div>

        <div className="relative p-6 sm:p-8 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white shadow-inner">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-emerald-300">
                    <path d="M4 13.5V20h4v-6.5H4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 10v10h4V10h-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 4v16h4V4h-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 16.5 9.5 11l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">Рейтинг команды</h1>
                  <p className="text-sm text-white/70">
                    Данные за текущую неделю + последние 30 дней. В фокусе KPI команды, динамика и реферальная активность — как на дашборде задач.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['КПД недели', 'Рейтинг 30д', 'Рефералы', 'Сообщения'].map((chip, idx) => (
                      <span
                        key={chip}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${idx === 0
                          ? 'bg-emerald-500 text-white border-emerald-300/60 shadow-md'
                          : 'bg-white/10 text-white border-white/20'
                          }`}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-2 text-white"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {heroCards.map((card) => (
              <div
                key={card.label}
                className={`relative overflow-hidden rounded-2xl border ${heroToneClass(card.tone)} p-4 backdrop-blur-sm`}
              >
                <div className="absolute right-3 top-3 text-xl opacity-20">•</div>
                <div className={`text-xs uppercase tracking-[0.1em] font-semibold ${heroLabelColor}`}>{card.label}</div>
                <div className={`mt-2 text-2xl font-bold ${heroValueColor}`}>{card.value}</div>
                <div className={`text-sm ${heroLabelColor}`}>{card.meta}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Как строим эффективность */}
      <div className={`rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
        <div className="flex flex-col gap-2 mb-4">
          <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Методика</p>
          <h3 className={`text-2xl font-bold ${headingColor}`}>Как мы строим эффективность команды?</h3>
          <p className={`text-sm ${subTextColor}`}>Четыре зоны, которые показывают, где сейчас участник и что делать дальше.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {ratingBands.map((band) => (
            <div
              key={band.label}
              className={`rounded-xl border ${band.bg} p-3 transition`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${subTextColor}`}>{band.label}</span>
                <span className="text-lg">•</span>
              </div>
              <p className={`text-base font-semibold ${band.tone}`}>{band.title}</p>
              <p className={`text-sm ${subTextColor}`}>{band.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Рекомендации по участникам */}
      <div className={`rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
        <div className="flex flex-col gap-2 mb-4">
          <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Рекомендации</p>
          <h3 className={`text-2xl font-bold ${headingColor}`}>Что улучшить каждому</h3>
          <p className={`text-sm ${subTextColor}`}>Динамические подсказки на основе текущих метрик рейтинга.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
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
              <div key={r.userId} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>{bandText}</p>
                    <h4 className={`text-lg font-bold ${headingColor} truncate`}>{userName}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{r.rating.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                  <div
                    className={`h-full ${bandClass}`}
                    style={{ width: `${Math.min(r.rating, 100)}%` }}
                  />
                </div>
                <ul className="space-y-1 text-sm text-white/80">
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

      {/* Последняя активность на сайте */}
      <div className={`rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}>
        <div className="flex flex-col gap-2 mb-4">
          <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Активность</p>
          <h3 className={`text-2xl font-bold ${headingColor}`}>Последняя активность на сайте</h3>
          <p className={`text-sm ${subTextColor}`}>Информация о последнем посещении каждого участника.</p>
        </div>
        {userActivities.length > 0 ? (
          <div className="overflow-auto rounded-xl border border-white/10 bg-white/5">
            <table className="min-w-[800px] w-full text-sm text-white/90">
              <thead className="bg-white/5 text-white/70 text-left">
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
                {TEAM_MEMBERS.map((member) => {
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
                      className="border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">{getUserNicknameSync(member.id)}</td>
                      <td className="py-3 px-4 text-white/80 whitespace-nowrap">
                        {activity ? formatDateTime(activity.loginAt) : '—'}
                      </td>
                      <td className="py-3 px-4 text-white/80 whitespace-nowrap">
                        {activity?.browser || '—'}
                      </td>
                      <td className="py-3 px-4 text-white/80 whitespace-nowrap">
                        {activity ? formatSessionDuration(activity.sessionDuration) : '—'}
                      </td>
                      <td className="py-3 px-4 text-white/80 whitespace-nowrap">
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
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/70">
            Данные об активности пока отсутствуют.
          </div>
        )}

        {/* Статистика за последние 24 часа */}
        <div className="mt-6">
          <div className="flex flex-col gap-2 mb-4">
            <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Статистика</p>
            <h4 className={`text-xl font-bold ${headingColor}`}>Активность за последние 24 часа</h4>
            <p className={`text-sm ${subTextColor}`}>Сводная информация о посещениях за сутки.</p>
          </div>
          {activities24h.length > 0 ? (
            <div className="overflow-auto rounded-xl border border-white/10 bg-white/5">
              <table className="min-w-[700px] w-full text-sm text-white/90">
                <thead className="bg-white/5 text-white/70 text-left">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Участник</th>
                    <th className="py-3 px-4 font-semibold">Входов</th>
                    <th className="py-3 px-4 font-semibold">Общее время</th>
                    <th className="py-3 px-4 font-semibold">Среднее время сессии</th>
                    <th className="py-3 px-4 font-semibold">Последний вход</th>
                  </tr>
                </thead>
                <tbody>
                  {TEAM_MEMBERS.map((member) => {
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
                        className="border-t border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">{getUserNicknameSync(member.id)}</td>
                        <td className="py-3 px-4 text-white/80 whitespace-nowrap text-center">
                          {totalSessions > 0 ? totalSessions : '—'}
                        </td>
                        <td className="py-3 px-4 text-white/80 whitespace-nowrap">
                          {totalDuration > 0 ? formatSessionDuration(totalDuration) : '—'}
                        </td>
                        <td className="py-3 px-4 text-white/80 whitespace-nowrap">
                          {avgDuration > 0 ? formatSessionDuration(avgDuration) : '—'}
                        </td>
                        <td className="py-3 px-4 text-white/80 whitespace-nowrap">
                          {latestActivity ? formatDateTime(latestActivity.loginAt) : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/70">
              За последние 24 часа активности не зафиксировано.
            </div>
          )}
        </div>

      </div>

      {/* Referral stats */}
      <div
        id="rating-ref"
        className={`rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="space-y-1">
            <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Рефералы · 30 дней</p>
            <h3 className={`text-2xl font-bold ${headingColor}`}>Привлеченные участники</h3>
            <p className={`text-sm ${subTextColor}`}>Всего добавлено: <span className="font-semibold">{referrals.length}</span></p>
          </div>
          <button
            onClick={handleAddReferral}
            className="px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md w-full sm:w-auto border border-indigo-200/70 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 dark:bg-indigo-500/15 dark:border-indigo-400/30 dark:text-indigo-50"
          >
            <span className="text-xl">➕</span>
            <span>Добавить реферала</span>
          </button>
        </div>

        {referrals.length ? (
          <div className="overflow-auto rounded-xl border border-white/10 bg-white/5">
            <table className="min-w-[820px] w-full text-sm text-white/90">
              <thead className="bg-white/5 text-white/70 text-left">
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
                      className="border-t border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">{ownerName}</td>
                      <td className="py-3 px-4 text-white/80 whitespace-nowrap">{referral.referralId}</td>
                      <td className="py-3 px-4 text-white/80">{referral.name}</td>
                      <td className="py-3 px-4 text-white/70">{referral.comment || '—'}</td>
                      <td className="py-3 px-4 text-right whitespace-nowrap flex items-center justify-end gap-2">
                        <button
                          onClick={() => canManage && handleEditReferral(referral)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/20 bg-white/10 text-white transition ${!canManage ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/20'}`}
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
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/70">
            Пока нет рефералов.
          </div>
        )}
      </div>

      {/* Rating cards section */}
      <div
        id="rating-method"
        className={`rounded-2xl p-6 sm:p-7 ${cardBg} ${cardShadow} border ${calmBorder}`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="space-y-1">
            <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Карточки участников</p>
            <h3 className={`text-2xl font-bold ${headingColor}`}>Детальная статистика</h3>

          </div>

        </div>

        {loading ? (
          <div className={`rounded-xl p-12 text-center ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} border ${calmBorder}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
            <p className={`text-lg font-semibold ${headingColor}`}>Загрузка рейтинга...</p>
            <p className={`text-sm ${subTextColor} mt-2`}>Подождите, собираем статистику</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Топ-1', value: sortedRatings[0]?.rating ? `${sortedRatings[0].rating.toFixed(1)}%` : '—' },
                { label: 'Средний рейтинг', value: `${teamKPD.toFixed(1)}%` },
                { label: 'Медиана', value: `${ratingOverview.median.toFixed(1)}%` },
                { label: 'Участников', value: sortedRatings.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl border ${calmBorder} ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} px-4 py-3`}
                >
                  <p className={`text-[11px] uppercase tracking-wide ${subTextColor}`}>{item.label}</p>
                  <p className={`text-2xl font-extrabold ${headingColor}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
              {sortedRatings.map((rating, index) => {
                return (
                  <div key={rating.userId}>
                    <RatingCard rating={rating} place={{ rank: index + 1 }} />
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

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

