// Rating page
import { useState, useEffect, useMemo } from 'react'
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { RatingCard } from '@/components/Rating/RatingCard'
import { ReferralForm } from '@/components/Rating/ReferralForm'
import { getRatingData, getEarnings, getDayStatuses, getReferrals, getWorkSlots, getWeeklyMessages } from '@/services/firestoreService'
import { getLastNDaysRange, getWeekRange, formatDate, calculateHours, countDaysInPeriod } from '@/utils/dateUtils'
import { calculateRating, getRatingBreakdown } from '@/utils/ratingUtils'
import { RatingData, Referral, TEAM_MEMBERS } from '@/types'

export const Rating = () => {
  const { theme } = useThemeStore()
  const [ratings, setRatings] = useState<RatingData[]>([])
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [showReferralForm, setShowReferralForm] = useState(false)
  const [activeReferral, setActiveReferral] = useState<Referral | null>(null)

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

        const slots = await getWorkSlots(member.id)
        const weekSlots = slots.filter(s => s.date >= weekStart && s.date <= weekEnd)
        const weeklyHours = weekSlots.reduce((sum, slot) => sum + calculateHours(slot.slots), 0)

        // Сообщения за неделю - из коллекции messages
        const weeklyMessages = await getWeeklyMessages(member.id, weekStart, weekEnd)
        
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
          poolAmount,
          lastUpdated: new Date().toISOString(),
        }

        const rating = calculateRating(updatedData, weeklyHours, weeklyEarnings, weeklyMessages)
        const breakdown = getRatingBreakdown(updatedData, weeklyHours, weeklyEarnings, weeklyMessages)

        allRatings.push({
          ...updatedData,
          rating,
          breakdown,
        })
      }

      // Sort by rating
      allRatings.sort((a, b) => b.rating - a.rating)
      setRatings(allRatings)
    } catch (error) {
      console.error('Error loading ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  const teamKPD = ratings.reduce((sum, r) => sum + r.rating, 0) / (ratings.length || 1)
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-[#151c2a]' : 'bg-white'
  const calmBorder = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const heroLabelColor = theme === 'dark' ? 'text-white/70' : 'text-slate-600'
  const heroValueColor = theme === 'dark' ? 'text-white' : 'text-slate-900'

  const sectionLinks = [
    { href: '#rating-team', label: 'Команда', icon: '🌿' },
    { href: '#rating-ref', label: 'Рефералы', icon: '🧲' },
    { href: '#rating-method', label: 'Карточки', icon: '📇' },
  ]

  const ratingBands = [
    { label: '80-100%', title: 'Эталон', desc: 'Стабильный вклад, примеры для команды', tone: 'text-emerald-700 dark:text-emerald-100', bg: 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200/60 dark:border-emerald-700/60' },
    { label: '60-79%', title: 'Уверенно', desc: 'Держат темп, есть потенциал роста', tone: 'text-blue-700 dark:text-blue-100', bg: 'bg-blue-50 dark:bg-blue-900/40 border-blue-200/60 dark:border-blue-700/60' },
    { label: '40-59%', title: 'В пути', desc: 'Нужна точечная поддержка и фокус', tone: 'text-amber-700 dark:text-amber-100', bg: 'bg-amber-50 dark:bg-amber-900/40 border-amber-200/60 dark:border-amber-700/60' },
    { label: '0-39%', title: 'Зона роста', desc: 'Запускаем план восстановления', tone: 'text-rose-700 dark:text-rose-100', bg: 'bg-rose-50 dark:bg-rose-900/40 border-rose-200/60 dark:border-rose-700/60' },
  ]

  const sortedRatings = useMemo(() => {
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
  const topMemberName = topMember ? TEAM_MEMBERS.find((m) => m.id === topMember.userId)?.name || '—' : '—'
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

  const handleAddReferral = () => {
    setActiveReferral(null)
    setShowReferralForm(true)
  }

  const handleEditReferral = (referral: Referral) => {
    setActiveReferral(referral)
    setShowReferralForm(true)
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] bg-gradient-to-br from-[#0b1428] via-[#0f1d34] to-[#09101f]">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-10 top-0 w-72 h-72 bg-emerald-500/20 blur-3xl"></div>
            <div className="absolute right-0 -bottom-16 w-80 h-80 bg-blue-500/20 blur-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%)]"></div>
          </div>

          <div className="relative p-6 sm:p-8 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold uppercase tracking-[0.14em]">
                  <span className="text-lg">✔️</span>
                  <span>Рейтинг</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/20 text-white shadow-inner">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">Командный рейтинг и эффективность</h1>
                    <p className="text-sm text-white/70">
                      Данные за текущую неделю + последние 30 дней. В фокусе KPI команды, динамика и реферальная активность — как на дашборде задач.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['КПД недели','Рейтинг 30д','Рефералы','Сообщения'].map((chip, idx) => (
                        <span
                          key={chip}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                            idx === 0
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
                <div className="flex flex-wrap gap-2">
                  {sectionLinks.map((item, idx) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition flex items-center gap-2 ${
                        idx === 0
                          ? 'bg-white text-slate-900 border-white shadow'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                      }`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-2 text-white">
                <span className="text-xs uppercase tracking-[0.12em] text-white/70">КПД команды (неделя)</span>
                <div className="text-5xl font-black leading-none drop-shadow-md">{teamKPD.toFixed(1)}%</div>
                <span className="text-xs text-white/60">Обновлено {todayLabel}</span>
                <button
                  onClick={handleAddReferral}
                  className="mt-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg w-full lg:w-auto"
                >
                  <span className="text-xl">➕</span>
                  <span>Добавить реферала</span>
                </button>
              </div>
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
        </div>

        {/* Team KPD */}
        <div
          id="rating-team"
          className={`rounded-2xl p-6 sm:p-7 ${cardBg} shadow-lg border ${calmBorder}`}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Команда</p>
              <h3 className={`text-2xl font-bold ${headingColor}`}>Средний КПД за неделю</h3>
              <p className={`text-sm ${subTextColor}`}>
                Плавный прогресс-бар показывает динамику всей команды.
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-extrabold text-emerald-600 dark:text-emerald-300">{teamKPD.toFixed(1)}%</div>
              <p className={`text-xs ${subTextColor}`}>из 100%</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-10 overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
              <div
                className={`h-full transition-all duration-500 flex items-center px-3 text-sm font-semibold text-white ${
                  teamKPD >= 80
                    ? 'bg-emerald-600'
                    : teamKPD >= 50
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(teamKPD, 100)}%` }}
              >
                {teamKPD >= 5 && <span>{teamKPD.toFixed(1)}%</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Referral stats */}
        <div
          id="rating-ref"
          className={`rounded-2xl p-6 sm:p-7 ${cardBg} shadow-lg border ${calmBorder}`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="space-y-1">
              <p className={`text-xs uppercase tracking-[0.12em] ${subTextColor}`}>Рефералы · 30 дней</p>
              <h3 className={`text-2xl font-bold ${headingColor}`}>Привлеченные участники</h3>
              <p className={`text-sm ${subTextColor}`}>Всего добавлено: <span className="font-semibold">{referrals.length}</span></p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {TEAM_MEMBERS.map((member) => {
              const memberRefs = referrals.filter((referral) => referral.ownerId === member.id)
              return (
                <div
                  key={member.id}
                  className={`p-4 rounded-xl border ${calmBorder} ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`${headingColor} font-semibold`}>{member.name}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        memberRefs.length > 0
                          ? theme === 'dark' ? 'bg-emerald-600/70 text-white' : 'bg-emerald-100 text-emerald-800'
                          : theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {memberRefs.length} {memberRefs.length === 1 ? 'реферал' : memberRefs.length < 5 ? 'реферала' : 'рефералов'}
                    </span>
                  </div>
                  {memberRefs.length > 0 && (
                    <div className="space-y-2">
                      {memberRefs.map((referral) => (
                        <div
                          key={referral.id}
                          className={`rounded-lg border ${calmBorder} ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'} p-3 flex flex-col gap-2 transition-all hover:shadow-sm`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold ${headingColor} truncate`}>{referral.name}</p>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} ${subTextColor}`}>
                                  ID: {referral.referralId}
                                </span>
                                {referral.age && (
                                  <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} ${subTextColor}`}>
                                    {referral.age} лет
                                  </span>
                                )}
                                <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'} ${subTextColor}`}>
                                  {new Date(referral.createdAt).toLocaleDateString('ru-RU')}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleEditReferral(referral)}
                              className="self-start sm:self-auto px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-semibold"
                            >
                              Редактировать
                            </button>
                          </div>
                          {referral.comment && (
                            <div className={`mt-1 pt-2 border-t ${calmBorder}`}>
                              <p className={`text-xs ${subTextColor} italic`}>💬 {referral.comment}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Rating cards section */}
        <div
          id="rating-method"
          className={`rounded-2xl p-6 sm:p-7 ${cardBg} shadow-lg border ${calmBorder}`}
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
                  type PlaceTone = 'emerald' | 'blue' | 'amber' | 'slate'
                  const place: { text: string; tone: PlaceTone; emoji: string } =
                    index === 0
                      ? { text: '1 место', tone: 'emerald', emoji: '🥇' }
                      : index === 1
                      ? { text: '2 место', tone: 'blue', emoji: '🥈' }
                      : index === 2
                      ? { text: '3 место', tone: 'amber', emoji: '🥉' }
                      : { text: `${index + 1} место`, tone: 'slate', emoji: '🎯' }

                  const tones: Record<PlaceTone, { chip: string; circle: string }> = {
                    emerald:
                      theme === 'dark'
                        ? { chip: 'bg-emerald-500/15 text-emerald-50 border-emerald-400/40', circle: 'bg-emerald-500/25 text-emerald-50 border-emerald-400/40' }
                        : { chip: 'bg-emerald-50 text-emerald-900 border-emerald-200', circle: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                    blue:
                      theme === 'dark'
                        ? { chip: 'bg-blue-500/15 text-blue-50 border-blue-400/40', circle: 'bg-blue-500/25 text-blue-50 border-blue-400/40' }
                        : { chip: 'bg-blue-50 text-blue-900 border-blue-200', circle: 'bg-blue-100 text-blue-800 border-blue-200' },
                    amber:
                      theme === 'dark'
                        ? { chip: 'bg-amber-500/15 text-amber-50 border-amber-400/40', circle: 'bg-amber-500/25 text-amber-50 border-amber-400/40' }
                        : { chip: 'bg-amber-50 text-amber-900 border-amber-200', circle: 'bg-amber-100 text-amber-800 border-amber-200' },
                    slate:
                      theme === 'dark'
                        ? { chip: 'bg-white/5 text-white border-white/10', circle: 'bg-white/10 text-white border-white/15' }
                        : { chip: 'bg-gray-50 text-gray-800 border-gray-200', circle: 'bg-gray-100 text-gray-800 border-gray-200' },
                  }

                  const tone = tones[place.tone]

                  return (
                    <div key={rating.userId} className="relative pt-7">
                      <div className="absolute -top-3 left-4 flex items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full border text-sm font-bold grid place-items-center shadow-sm ${tone.circle}`}
                        >
                          {index + 1}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-xl text-xs font-semibold border shadow-sm flex items-center gap-1 ${tone.chip}`}
                        >
                          <span>{place.emoji}</span>
                          <span>{place.text}</span>
                        </div>
                      </div>
                      <RatingCard rating={rating} />
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
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
    </Layout>
  )
}

