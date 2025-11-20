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
        const weeklyEarnings = weekEarnings.reduce((sum, e) => sum + e.amount, 0)

        const monthEarnings = await getEarnings(member.id, monthStart, monthEnd)
        const totalEarnings = monthEarnings.reduce((sum, e) => sum + e.amount, 0)
        const poolAmount = monthEarnings.reduce((sum, e) => sum + e.poolAmount, 0)

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
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const secondaryBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'

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
        <div className={`rounded-xl p-6 ${cardBg} shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>
                  <span className="text-2xl">🏆</span>
                </div>
                <h2 className={`text-3xl font-bold ${headingColor}`}>Рейтинг участников</h2>
              </div>
              <p className={`text-sm leading-relaxed ${subTextColor} ml-12`}>
                Рейтинг рассчитывается на основе <strong>7 параметров</strong>: выходные, больничные, отпуск (за месяц), 
                часы работы, заработок, рефералы и сообщения в группе (за неделю). Каждый параметр дает определенное 
                количество баллов. Максимальный рейтинг - <strong>100%</strong>. Рейтинг обновляется автоматически при изменении данных.
              </p>
            </div>
            <button
              onClick={handleAddReferral}
              className="w-full sm:w-auto px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
            >
              <span className="text-lg">➕</span>
              Добавить реферала
            </button>
          </div>
        </div>

        {/* Team KPD */}
        <div className={`rounded-xl p-6 ${cardBg} shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-600' : 'bg-green-500'} text-white`}>
              <span className="text-2xl">📊</span>
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-1 ${headingColor}`}>Средний КПД команды</h3>
              <p className={`text-sm ${subTextColor}`}>Средний рейтинг всех участников команды</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {teamKPD.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-10 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 flex items-center justify-center shadow-md"
                style={{ width: `${Math.min(teamKPD, 100)}%` }}
              >
                {teamKPD >= 10 && (
                  <span className="text-white text-sm font-bold">
                    {teamKPD.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Referral stats */}
        <div className={`rounded-xl p-6 ${cardBg} shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-pink-600' : 'bg-pink-500'} text-white`}>
              <span className="text-2xl">👥</span>
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-1 ${headingColor}`}>Рефералы за 30 дней</h3>
              <p className={`text-sm ${subTextColor}`}>
                Всего добавлено: <strong className={headingColor}>{referrals.length}</strong> рефералов
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {TEAM_MEMBERS.map((member) => {
              const memberRefs = referrals.filter((referral) => referral.ownerId === member.id)
              return (
                <div
                  key={member.id}
                  className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
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
                          className={`rounded-lg border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} flex flex-col gap-2 transition-all hover:shadow-md`}
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
                            <div className={`mt-2 pt-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
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

        {/* Rating cards */}
        {loading ? (
          <div className={`rounded-xl p-12 text-center ${cardBg} shadow-lg border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className={`text-lg ${subTextColor}`}>Загрузка рейтинга...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-sm font-semibold ${subTextColor}`}>
                Показано участников: {ratings.length}
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {ratings.map((rating, index) => (
                <div key={rating.userId} className="relative">
                  {index === 0 && ratings.length > 1 && (
                    <div className="absolute -top-3 -right-3 z-10 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      🥇 Лидер
                    </div>
                  )}
                  <RatingCard rating={rating} />
                </div>
              ))}
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
    </Layout>
  )
}

