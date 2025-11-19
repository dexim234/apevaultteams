// Rating page
import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { RatingCard } from '@/components/Rating/RatingCard'
import { ReferralForm } from '@/components/Rating/ReferralForm'
import { getRatingData, getEarnings, getDayStatuses, getReferrals, getWorkSlots, getWeeklyMessages } from '@/services/firestoreService'
import { getLastNDaysRange, getWeekRange, formatDate, calculateHours } from '@/utils/dateUtils'
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
        const monthStatuses = statuses.filter(s => s.date >= monthStart && s.date <= monthEnd)
        const daysOff = monthStatuses.filter(s => s.type === 'dayoff').length
        const sickDays = monthStatuses.filter(s => s.type === 'sick').length
        const vacationDays = monthStatuses.filter(s => s.type === 'vacation').length

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
        <div className={`rounded-lg p-6 ${cardBg} shadow-md`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className={`text-2xl font-bold mb-1 ${headingColor}`}>Рейтинг</h2>
              <p className={`text-sm ${subTextColor}`}>
                Рейтинг рассчитывается на основе недельных параметров (часы, заработок, сообщения) и месячных (выходные, больничные, отпуск). Обновляется автоматически.
              </p>
            </div>
            <button
              onClick={handleAddReferral}
              className="w-full sm:w-auto px-3 py-2 text-sm sm:text-base bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Добавить реферала
            </button>
          </div>
        </div>

        {/* Team KPD */}
        <div className={`rounded-lg p-6 ${cardBg} shadow-md`}>
          <h3 className={`text-lg font-semibold mb-2 ${headingColor}`}>КПД команды</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300 flex items-center justify-center"
                style={{ width: `${Math.min(teamKPD, 100)}%` }}
              >
                <span className="text-white text-sm font-semibold">
                  {teamKPD.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Referral stats */}
        <div className={`rounded-lg p-6 ${cardBg} shadow-md`}>
          <div className="flex flex-col gap-1 mb-4">
            <h3 className={`text-lg font-semibold ${headingColor}`}>Рефералы за 30 дней</h3>
            <p className={`text-sm ${subTextColor}`}>
              Всего добавлено: {referrals.length}
            </p>
          </div>
          <div className="space-y-3">
            {TEAM_MEMBERS.map((member) => {
              const memberRefs = referrals.filter((referral) => referral.ownerId === member.id)
              return (
                <div
                  key={member.id}
                  className={`p-3 rounded-lg ${secondaryBg}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`${headingColor} font-medium`}>{member.name}</span>
                    <span className={`${headingColor} text-sm`}>
                      {memberRefs.length} {memberRefs.length === 1 ? 'контакт' : 'контактов'}
                    </span>
                  </div>
                  {memberRefs.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {memberRefs.map((referral) => (
                        <div
                          key={referral.id}
                          className={`rounded-lg border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} p-3 flex flex-col gap-1`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <p className={`text-sm font-semibold ${headingColor}`}>
                                {referral.name} <span className={subTextColor}>({referral.referralId})</span>
                              </p>
                              <p className={`text-xs ${subTextColor}`}>
                                Возраст: {referral.age} · Добавлен {new Date(referral.createdAt).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                            <button
                              onClick={() => handleEditReferral(referral)}
                              className="self-start sm:self-auto px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            >
                              Редактировать
                            </button>
                          </div>
                          {referral.comment && (
                            <p className={`text-sm ${subTextColor}`}>Комментарий: {referral.comment}</p>
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
          <div className={`rounded-lg p-8 text-center ${cardBg}`}>
            <p className={subTextColor}>Загрузка...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratings.map((rating) => (
              <RatingCard key={rating.userId} rating={rating} />
            ))}
          </div>
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

