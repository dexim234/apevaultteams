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
  const [sortMode, setSortMode] = useState<'rating' | 'name'>('rating')

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
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-[#111]' : 'bg-white'
  const calmBorder = theme === 'dark' ? 'border-white/10' : 'border-gray-200'

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
    const arr = [...ratings]
    if (sortMode === 'name') {
      return arr.sort((a, b) => a.userId.localeCompare(b.userId))
    }
    return arr.sort((a, b) => b.rating - a.rating)
  }, [ratings, sortMode])

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
        <div
          className={`rounded-2xl p-6 sm:p-8 ${cardBg} shadow-xl border ${calmBorder} relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-60 pointer-events-none">
            <div className="absolute -right-24 -top-24 h-72 w-72 bg-gradient-to-br from-emerald-400/10 via-blue-300/10 to-purple-300/10 blur-3xl" />
            <div className="absolute -left-24 -bottom-24 h-64 w-64 bg-gradient-to-tr from-emerald-500/10 to-yellow-300/10 blur-3xl" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Рейтинг команды
                </div>
                <h1 className={`text-3xl sm:text-4xl font-extrabold ${headingColor}`}>
                  Обзор эффективности команды ApeVault Black OPS
                </h1>
                <p className={`text-sm sm:text-base leading-relaxed ${subTextColor}`}>
                  7 ключевых метрик отражают вовлеченность, стабильность и вклад каждого. 
                  Все показатели обновляются автоматически, кроме добавления и удаления рефералов.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                {[
                  { label: 'Топ-1', value: `${ratingOverview.top.toFixed(1)}%`, note: 'лидер недели' },
                  { label: 'Медиана', value: `${ratingOverview.median.toFixed(1)}%`, note: 'ровный темп' },
                  { label: '80%+', value: ratingOverview.high, note: 'устойчивые лидеры' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-xl border ${calmBorder} ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} p-3 flex flex-col gap-1`}
                  >
                    <span className={`text-[11px] uppercase tracking-wide ${subTextColor}`}>{item.label}</span>
                    <span className={`text-2xl font-extrabold ${headingColor}`}>{item.value}</span>
                    <span className={`text-xs ${subTextColor}`}>{item.note}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {sectionLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-full text-sm font-semibold border ${calmBorder} transition flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-white/5 hover:bg-white/10 text-white'
                      : 'bg-white hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
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

            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className={`flex flex-wrap gap-2 text-xs ${subTextColor}`}>
                {['Выходные','Больничные','Отпуск','Часы','Заработок','Рефералы','Сообщения'].map((item) => (
                  <span
                    key={item}
                    className={`px-3 py-1 rounded-full border ${calmBorder} ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <button
                onClick={handleAddReferral}
                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md w-full md:w-auto"
              >
                <span className="text-xl">➕</span>
                <span>Добавить реферала</span>
              </button>
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
                Плавный прогресс-бар показывает динамику без лишнего визуального шума.
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
            <div className="flex gap-2">
              <span className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-800 text-sm font-semibold dark:bg-emerald-500/20 dark:text-emerald-100">
                Тихий градиент, четкие цифры
              </span>
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
              <p className={`text-sm ${subTextColor}`}>Спокойные карточки с раскрываемыми метриками и аккуратными акцентами.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortMode('rating')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold border ${calmBorder} ${
                  sortMode === 'rating'
                    ? 'bg-emerald-600 text-white'
                    : theme === 'dark'
                    ? 'bg-white/5 text-white hover:bg-white/10'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                По рейтингу
              </button>
              <button
                onClick={() => setSortMode('name')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold border ${calmBorder} ${
                  sortMode === 'name'
                    ? 'bg-emerald-600 text-white'
                    : theme === 'dark'
                    ? 'bg-white/5 text-white hover:bg-white/10'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                По имени
              </button>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {sortedRatings.map((rating, index) => (
                  <div key={rating.userId} className="relative">
                    {index <= 2 && (
                      <div className="absolute -top-3 -right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${calmBorder} ${
                            index === 0
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-100'
                              : index === 1
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-100'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-100'
                          }`}
                        >
                          {index === 0 ? '1 место' : index === 1 ? '2 место' : '3 место'}
                        </span>
                      </div>
                    )}
                    <RatingCard rating={rating} />
                  </div>
                ))}
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

