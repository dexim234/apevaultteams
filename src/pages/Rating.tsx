// Rating page
import { useState, useEffect } from 'react'
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
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'

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
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-blue-500/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]' 
            : 'border-blue-200 bg-gradient-to-br from-white via-blue-50/30 to-white'
        } relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#4E6E49]/10 to-yellow-500/10 rounded-full blur-2xl -ml-24 -mb-24" />
          
          <div className="relative z-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                    } text-white transform transition-transform active:scale-95 sm:hover:scale-110`}
                  >
                    <span className="text-2xl sm:text-3xl md:text-4xl">🏆</span>
                  </div>
                  <div className="flex-1">
                    <h1
                      className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${headingColor} flex items-center gap-2 sm:gap-3`}
                    >
                      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                        Рейтинг участников
                      </span>
                      <span className="text-xl sm:text-2xl">⭐</span>
                    </h1>
                  </div>
                </div>
                <p className={`text-sm sm:text-base font-medium ${subTextColor}`}>
                  Система оценки эффективности команды на основе ключевых метрик
                </p>
                <div className={`p-5 rounded-xl border-2 ${
                  theme === 'dark' 
                    ? 'bg-[#1a1a1a]/50 border-blue-500/20' 
                    : 'bg-blue-50/50 border-blue-200'
                } mb-4`}>
                  <p className={`text-sm leading-relaxed ${subTextColor}`}>
                    Рейтинг рассчитывается на основе <strong className={headingColor}>7 параметров</strong>: 
                    выходные, больничные, отпуск (за месяц), часы работы, заработок, рефералы и сообщения в группе (за неделю). 
                    Каждый параметр дает определенное количество баллов. 
                    <strong className={headingColor}> Максимальный рейтинг - 100%</strong>. 
                    Рейтинг обновляется автоматически при изменении данных.
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddReferral}
                className={`w-full lg:w-auto px-6 py-4 bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] hover:from-[#4E6E49] hover:to-[#4E6E49] text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform`}
              >
                <span className="text-xl">➕</span>
                <span>Добавить реферала</span>
              </button>
            </div>
          </div>
        </div>

        {/* Team KPD */}
        <div className={`rounded-2xl p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]' 
            : 'border-green-200 bg-gradient-to-br from-white to-green-50/20'
        } relative overflow-hidden`}>
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-700/10 rounded-full blur-2xl -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
              <div className={`p-4 rounded-2xl shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-[#4E6E49] to-emerald-700' 
                  : 'bg-gradient-to-br from-[#4E6E49] to-emerald-700'
              } text-white flex-shrink-0`}>
                <span className="text-3xl">📊</span>
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-extrabold mb-2 ${headingColor} flex items-center gap-2`}>
                  <span className="bg-gradient-to-r from-[#4E6E49] to-emerald-700 text-transparent bg-clip-text">
                    Средний КПД команды
                  </span>
                </h3>
                <p className={`text-sm ${subTextColor} font-medium`}>
                  Средний рейтинг всех участников команды за текущий период
                </p>
              </div>
              <div className="text-center sm:text-right">
                <div className={`text-5xl font-extrabold mb-1 ${
                  theme === 'dark' 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#4E6E49] to-emerald-500' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-[#4E6E49] to-emerald-700'
                }`}>
                  {teamKPD.toFixed(1)}%
                </div>
                <p className={`text-xs ${subTextColor}`}>из 100%</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-12 overflow-hidden shadow-inner border-2 border-gray-300 dark:border-gray-800">
                <div
                  className={`h-full bg-gradient-to-r ${
                    teamKPD >= 80 
                      ? 'from-[#4E6E49] to-emerald-700' 
                      : teamKPD >= 50
                      ? 'from-yellow-500 to-orange-500'
                      : 'from-blue-500 to-purple-500'
                  } transition-all duration-500 flex items-center justify-center shadow-lg`}
                  style={{ width: `${Math.min(teamKPD, 100)}%` }}
                >
                  {teamKPD >= 10 && (
                    <span className="text-white text-sm font-bold px-3">
                      {teamKPD.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral stats */}
        <div className={`rounded-2xl p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-pink-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]' 
            : 'border-pink-200 bg-gradient-to-br from-white to-pink-50/20'
        } relative overflow-hidden`}>
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-2xl -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-pink-600 to-rose-600' 
                  : 'bg-gradient-to-br from-pink-500 to-rose-500'
              } text-white flex-shrink-0`}>
                <span className="text-3xl">👥</span>
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-extrabold mb-2 ${headingColor} flex items-center gap-2`}>
                  <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-transparent bg-clip-text">
                    Рефералы за 30 дней
                  </span>
                </h3>
                <p className={`text-sm ${subTextColor} font-medium`}>
                  Всего добавлено: <strong className={`text-lg ${headingColor}`}>{referrals.length}</strong> рефералов
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {TEAM_MEMBERS.map((member) => {
                const memberRefs = referrals.filter((referral) => referral.ownerId === member.id)
                return (
                  <div
                    key={member.id}
                    className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${headingColor} font-semibold`}>{member.name}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        memberRefs.length > 0 
                          ? theme === 'dark' ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700'
                          : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {memberRefs.length} {memberRefs.length === 1 ? 'реферал' : memberRefs.length < 5 ? 'реферала' : 'рефералов'}
                      </span>
                    </div>
                    {memberRefs.length > 0 && (
                      <div className="space-y-2">
                        {memberRefs.map((referral) => (
                          <div
                            key={referral.id}
                            className={`rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'} p-3 ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} flex flex-col gap-2 transition-all hover:shadow-md`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="flex-1">
                                <p className={`text-sm font-semibold ${headingColor} mb-1`}>
                                  {referral.name}
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${subTextColor}`}>
                                    ID: {referral.referralId}
                                  </span>
                                  {referral.age && (
                                    <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${subTextColor}`}>
                                      Возраст: {referral.age}
                                    </span>
                                  )}
                                  <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} ${subTextColor}`}>
                                    {new Date(referral.createdAt).toLocaleDateString('ru-RU')}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleEditReferral(referral)}
                                className="self-start sm:self-auto px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                              >
                                Редактировать
                              </button>
                            </div>
                            {referral.comment && (
                              <div className={`mt-2 pt-2 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                <p className={`text-xs ${subTextColor} italic`}>
                                  💬 {referral.comment}
                                </p>
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
        </div>

        {/* Rating cards section */}
        <div className={`rounded-2xl p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-purple-500/30 bg-gradient-to-br from-[#1a1a1a] to-[#0A0A0A]' 
            : 'border-purple-200 bg-gradient-to-br from-white to-purple-50/20'
        } relative overflow-hidden`}>
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-2xl -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
                  : 'bg-gradient-to-br from-purple-500 to-indigo-500'
              } text-white flex-shrink-0`}>
                <span className="text-3xl">⭐</span>
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-extrabold mb-2 ${headingColor} flex items-center gap-2`}>
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                    Рейтинг участников
                  </span>
                </h3>
                <p className={`text-sm ${subTextColor} font-medium`}>
                  Детальная статистика по каждому участнику команды
                </p>
              </div>
            </div>

            {loading ? (
              <div className={`rounded-xl p-12 text-center ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                <p className={`text-lg font-semibold ${headingColor}`}>Загрузка рейтинга...</p>
                <p className={`text-sm ${subTextColor} mt-2`}>Подождите, собираем статистику</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className={`px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'} border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                    <span className={`text-sm font-semibold ${headingColor}`}>
                      Показано участников: <span className="text-purple-500 dark:text-purple-400">{ratings.length}</span>
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {ratings.map((rating, index) => (
                    <div key={rating.userId} className="relative transform transition-all duration-300 hover:scale-105">
                      {index === 0 && ratings.length > 1 && (
                        <div className="absolute -top-4 -right-4 z-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-extrabold px-4 py-2 rounded-full shadow-xl animate-pulse border-2 border-yellow-300 flex items-center gap-1">
                          <span className="text-base">🥇</span>
                          <span>ЛИДЕР</span>
                        </div>
                      )}
                      {index === 1 && ratings.length > 2 && (
                        <div className="absolute -top-4 -right-4 z-20 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 text-xs font-extrabold px-4 py-2 rounded-full shadow-xl border-2 border-gray-200 flex items-center gap-1">
                          <span className="text-base">🥈</span>
                          <span>2-е место</span>
                        </div>
                      )}
                      {index === 2 && ratings.length > 3 && (
                        <div className="absolute -top-4 -right-4 z-20 bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900 text-xs font-extrabold px-4 py-2 rounded-full shadow-xl border-2 border-orange-200 flex items-center gap-1">
                          <span className="text-base">🥉</span>
                          <span>3-е место</span>
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

