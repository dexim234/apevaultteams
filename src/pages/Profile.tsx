// Profile page - Personal Cabinet
import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { 
  getTasks, 
  getTaskNotifications,
  getRatingData,
  getEarnings,
  getDayStatuses,
  getReferrals,
  getWorkSlots,
  getWeeklyMessages
} from '@/services/firestoreService'
import { 
  getWeekRange, 
  getLastNDaysRange, 
  formatDate, 
  calculateHours, 
  countDaysInPeriod 
} from '@/utils/dateUtils'
import { calculateRating, getRatingBreakdown } from '@/utils/ratingUtils'
import { Task, TaskNotification, RatingData } from '@/types'
import { 
  User, 
  LogOut, 
  Eye, 
  EyeOff, 
  CheckSquare, 
  Bell, 
  TrendingUp, 
  Shield,
  Sparkles,
  Copy,
  Check,
  Info,
  Users,
  Target,
  Award,
  BookOpen,
  Mail
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const Profile = () => {
  const { theme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const { isAdmin, deactivateAdmin } = useAdminStore()
  const navigate = useNavigate()
  
  const [showPassword, setShowPassword] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [notifications, setNotifications] = useState<TaskNotification[]>([])
  const [rating, setRating] = useState<RatingData | null>(null)
  const [ratingBreakdown, setRatingBreakdown] = useState<ReturnType<typeof getRatingBreakdown> | null>(null)
  const [loading, setLoading] = useState(true)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300'

  useEffect(() => {
    if (user || isAdmin) {
      loadProfileData()
    }
  }, [user, isAdmin])

  const loadProfileData = async () => {
    if (!user && !isAdmin) return
    
    setLoading(true)
    try {
      const userId = user?.id || 'admin'
      
      // Load tasks
      const userTasks = await getTasks({ assignedTo: userId })
      setTasks(userTasks)

      // Load notifications
      if (user) {
        const userNotifications = await getTaskNotifications(user.id)
        setNotifications(userNotifications)
      }

      // Load rating data
      if (user) {
        const weekRange = getWeekRange()
        const weekStart = formatDate(weekRange.start, 'yyyy-MM-dd')
        const weekEnd = formatDate(weekRange.end, 'yyyy-MM-dd')

        const monthRange = getLastNDaysRange(30)
        const monthStart = formatDate(monthRange.start, 'yyyy-MM-dd')
        const monthEnd = formatDate(monthRange.end, 'yyyy-MM-dd')
        const monthIsoStart = monthRange.start.toISOString()
        const monthIsoEnd = monthRange.end.toISOString()

        const weekEarnings = await getEarnings(userId, weekStart, weekEnd)
        const weeklyEarnings = weekEarnings.reduce((sum, e) => sum + e.amount, 0)

        const monthEarnings = await getEarnings(userId, monthStart, monthEnd)
        const totalEarnings = monthEarnings.reduce((sum, e) => sum + e.amount, 0)
        const poolAmount = monthEarnings.reduce((sum, e) => sum + e.poolAmount, 0)

        const statuses = await getDayStatuses(userId)
        const monthStatuses = statuses.filter(s => {
          const statusStart = s.date
          const statusEnd = s.endDate || s.date
          return statusStart <= monthEnd && statusEnd >= monthStart
        })

        const daysOff = monthStatuses
          .filter(s => s.type === 'dayoff')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const sickDays = monthStatuses
          .filter(s => s.type === 'sick')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const vacationDays = monthStatuses
          .filter(s => s.type === 'vacation')
          .reduce((sum, s) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)

        const slots = await getWorkSlots(userId)
        const weekSlots = slots.filter(s => s.date >= weekStart && s.date <= weekEnd)
        const weeklyHours = weekSlots.reduce((sum, slot) => sum + calculateHours(slot.slots), 0)

        const weeklyMessages = await getWeeklyMessages(userId, weekStart, weekEnd)
        const existingRatings = await getRatingData(userId)
        const ratingData = existingRatings[0] || {
          userId,
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

        const currentReferrals = await getReferrals(undefined, monthIsoStart, monthIsoEnd)
        const userReferrals = currentReferrals.filter((referral) => referral.ownerId === userId).length

        const updatedData: Omit<RatingData, 'rating'> = {
          userId,
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

        const calculatedRating = calculateRating(
          updatedData,
          weeklyHours,
          weeklyEarnings,
          weeklyMessages
        )

        const breakdown = getRatingBreakdown(
          updatedData,
          weeklyHours,
          weeklyEarnings,
          weeklyMessages
        )

        setRating({ ...updatedData, rating: calculatedRating })
        setRatingBreakdown(breakdown)
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (isAdmin) {
      deactivateAdmin()
    }
    logout()
    navigate('/login')
  }

  const handleCopyPassword = () => {
    if (user?.password) {
      navigator.clipboard.writeText(user.password)
      setPasswordCopied(true)
      setTimeout(() => setPasswordCopied(false), 2000)
    }
  }

  const userData = user || (isAdmin ? { name: 'Администратор', login: 'admin', password: 'admin' } : null)
  const unreadNotifications = notifications.filter(n => !n.read).length
  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length
  const completedTasks = tasks.filter(t => t.status === 'completed').length

  if (!userData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className={headingColor}>Необходима авторизация</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-green-500/30 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900' 
            : 'border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white'
        } relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24" />
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-green-600 to-emerald-600'
                    : 'bg-gradient-to-br from-green-500 to-emerald-500'
                } text-white`}>
                  <User className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${headingColor} flex items-center gap-2`}>
                    Личный кабинет
                    <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </h1>
                  <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                    Управление профилем и данными
                  </p>
                </div>
              </div>
              {isAdmin && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Администратор</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className={`${cardBg} rounded-xl p-8 text-center ${headingColor}`}>
            <div className="animate-pulse">Загрузка...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Personal Information */}
            <div className={`${cardBg} rounded-xl border-2 ${borderColor} p-4 sm:p-6 shadow-lg`}>
              <h2 className={`text-xl font-bold ${headingColor} mb-4 flex items-center gap-2`}>
                <User className="w-5 h-5" />
                Личные данные
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
                    Имя
                  </label>
                  <div className={`px-4 py-2.5 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} ${headingColor}`}>
                    {userData.name}
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
                    Логин
                  </label>
                  <div className={`px-4 py-2.5 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} ${headingColor}`}>
                    {userData.login}
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} block mb-1`}>
                    Пароль
                  </label>
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 px-4 py-2.5 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} ${headingColor} font-mono`}>
                      {showPassword ? userData.password : '•'.repeat(userData.password.length)}
                    </div>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className={`p-2.5 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleCopyPassword}
                      className={`p-2.5 rounded-lg border ${borderColor} ${
                        passwordCopied
                          ? 'bg-green-500 text-white'
                          : theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                      } transition-colors`}
                      title="Скопировать пароль"
                    >
                      {passwordCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating - Enhanced */}
            {rating && ratingBreakdown && (
              <div className={`${cardBg} rounded-xl border-2 ${borderColor} p-4 sm:p-6 shadow-lg lg:col-span-2`}>
                <h2 className={`text-xl font-bold ${headingColor} mb-6 flex items-center gap-2`}>
                  <TrendingUp className="w-5 h-5" />
                  Рейтинг эффективности
                </h2>
                <div className="space-y-6">
                  {/* Main Rating Display */}
                  <div className={`p-6 sm:p-8 rounded-xl border-2 ${
                    rating.rating >= 70
                      ? theme === 'dark' ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                      : rating.rating >= 50
                      ? theme === 'dark' ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                      : theme === 'dark' ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/50' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                  } relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="relative z-10">
                      <div className="text-center">
                        <div className={`text-5xl sm:text-6xl md:text-7xl font-extrabold mb-2 ${
                          rating.rating >= 70
                            ? theme === 'dark' ? 'text-green-400' : 'text-green-700'
                            : rating.rating >= 50
                            ? theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                            : theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                        }`}>
                          {rating.rating.toFixed(1)}%
                        </div>
                        <div className={`text-lg sm:text-xl font-semibold ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Общая эффективность
                        </div>
                        <div className={`text-sm mt-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {rating.rating >= 70 ? 'Отличный результат! 🎉' : rating.rating >= 50 ? 'Хороший результат! 👍' : 'Есть над чем поработать 💪'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating Breakdown Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Выходные */}
                    <div className={`p-4 rounded-lg border-2 ${
                      theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Выходные
                        </span>
                        <span className="text-lg">📅</span>
                      </div>
                      <div className={`text-2xl font-bold ${headingColor}`}>
                        {ratingBreakdown.daysOffPoints.toFixed(1)}%
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {rating.daysOff} дней
                      </div>
                      <div className={`text-xs mt-2 pt-2 border-t ${theme === 'dark' ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'}`}>
                        {rating.daysOff === 0 || rating.daysOff <= 2 
                          ? '✅ 0-2 дня = 10%' 
                          : '❌ Более 2 дней = 0%'}
                      </div>
                    </div>

                    {/* Больничные */}
                    <div className={`p-4 rounded-lg border-2 ${
                      theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Больничные
                        </span>
                        <span className="text-lg">🏥</span>
                      </div>
                      <div className={`text-2xl font-bold ${headingColor}`}>
                        {ratingBreakdown.sickDaysPoints.toFixed(1)}%
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {rating.sickDays} дней
                      </div>
                      <div className={`text-xs mt-2 pt-2 border-t ${theme === 'dark' ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'}`}>
                        {rating.sickDays <= 7 
                          ? '✅ ≤7 дней = 10%' 
                          : '❌ Более 7 дней = 0%'}
                      </div>
                    </div>

                    {/* Отпуск */}
                    <div className={`p-4 rounded-lg border-2 ${
                      theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Отпуск
                        </span>
                        <span className="text-lg">🏖️</span>
                      </div>
                      <div className={`text-2xl font-bold ${headingColor}`}>
                        {ratingBreakdown.vacationDaysPoints.toFixed(1)}%
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {rating.vacationDays} дней
                      </div>
                      <div className={`text-xs mt-2 pt-2 border-t ${theme === 'dark' ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'}`}>
                        {rating.vacationDays <= 7 
                          ? '✅ ≤7 дней = 10%' 
                          : '❌ Более 7 дней = 0%'}
                      </div>
                    </div>

                    {/* Часы работы */}
                    <div className={`p-4 rounded-lg border-2 ${
                      theme === 'dark' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                          Часы работы
                        </span>
                        <span className="text-lg">⏰</span>
                      </div>
                      <div className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                      }`}>
                        {ratingBreakdown.weeklyHoursPoints.toFixed(1)}%
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-blue-400/70' : 'text-blue-600'}`}>
                        {ratingBreakdown.weeklyHours.toFixed(1)} ч/нед
                      </div>
                      <div className={`text-xs mt-2 pt-2 border-t ${theme === 'dark' ? 'border-blue-500/30 text-blue-300' : 'border-blue-200 text-blue-600'}`}>
                        {ratingBreakdown.weeklyHours >= 30 
                          ? '✅ ≥30 ч = 25%' 
                          : ratingBreakdown.weeklyHours >= 20 
                          ? '✅ ≥20 ч = 15%' 
                          : '❌ <20 ч = 0%'}
                      </div>
                    </div>

                    {/* Заработок */}
                    <div className={`p-4 rounded-lg border-2 ${
                      theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                          Заработок
                        </span>
                        <span className="text-lg">💰</span>
                      </div>
                      <div className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-700'
                      }`}>
                        {ratingBreakdown.weeklyEarningsPoints.toFixed(1)}%
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-green-400/70' : 'text-green-600'}`}>
                        {ratingBreakdown.weeklyEarnings.toFixed(0)} ₽/нед
                      </div>
                      <div className={`text-xs mt-2 pt-2 border-t ${theme === 'dark' ? 'border-green-500/30 text-green-300' : 'border-green-200 text-green-600'}`}>
                        {ratingBreakdown.weeklyEarnings >= 6000 
                          ? '✅ ≥6000₽ = 30%' 
                          : ratingBreakdown.weeklyEarnings >= 3000 
                          ? '✅ ≥3000₽ = 15%' 
                          : '❌ <3000₽ = 0%'}
                      </div>
                    </div>

                    {/* Рефералы */}
                    <div className={`p-4 rounded-lg border-2 ${
                      theme === 'dark' ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                          Рефералы
                        </span>
                        <span className="text-lg">👥</span>
                      </div>
                      <div className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
                      }`}>
                        {ratingBreakdown.referralsPoints.toFixed(1)}%
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-purple-400/70' : 'text-purple-600'}`}>
                        {rating.referrals} рефералов
                      </div>
                      <div className={`text-xs mt-2 pt-2 border-t ${theme === 'dark' ? 'border-purple-500/30 text-purple-300' : 'border-purple-200 text-purple-600'}`}>
                        {ratingBreakdown.referralsPoints >= 30 
                          ? '✅ Макс 6 рефералов = 30%' 
                          : `✅ ${rating.referrals} × 5% = ${ratingBreakdown.referralsPoints.toFixed(0)}%`}
                      </div>
                    </div>

                    {/* Сообщения */}
                    <div className={`p-4 rounded-lg border-2 ${
                      theme === 'dark' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>
                          Сообщения
                        </span>
                        <span className="text-lg">💬</span>
                      </div>
                      <div className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-orange-400' : 'text-orange-700'
                      }`}>
                        {ratingBreakdown.weeklyMessagesPoints.toFixed(1)}%
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-orange-400/70' : 'text-orange-600'}`}>
                        {ratingBreakdown.weeklyMessages} сообщ/нед
                      </div>
                      <div className={`text-xs mt-2 pt-2 border-t ${theme === 'dark' ? 'border-orange-500/30 text-orange-300' : 'border-orange-200 text-orange-600'}`}>
                        {ratingBreakdown.weeklyMessages > 50 
                          ? '✅ >50 сообщ = 15%' 
                          : '❌ ≤50 сообщ = 0%'}
                      </div>
                    </div>
                  </div>

                  {/* Rating Explanation */}
                  <div className={`p-4 rounded-lg border-2 ${
                    theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className={`text-sm font-bold ${headingColor} mb-3 flex items-center gap-2`}>
                      <Info className="w-4 h-4" />
                      Как рассчитывается рейтинг?
                    </h3>
                    <div className={`text-xs space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold">• Выходные:</span>
                        <span>0-2 дня в месяц = 10%, более 2 дней = 0%</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold">• Больничные:</span>
                        <span>≤7 дней в месяц = 10%, более 7 дней = 0%</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold">• Отпуск:</span>
                        <span>≤7 дней в месяц = 10%, более 7 дней = 0%</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold">• Часы работы:</span>
                        <span>≥30 ч/нед = 25%, ≥20 ч/нед = 15%, менее 20 ч/нед = 0%</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold">• Заработок:</span>
                        <span>≥6000₽/нед = 30%, ≥3000₽/нед = 15%, менее 3000₽/нед = 0%</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold">• Рефералы:</span>
                        <span>5% за каждого, максимум 30% (6 рефералов)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold">• Сообщения:</span>
                        <span>Более 50 сообщений/нед = 15%, менее = 0%</span>
                      </div>
                      <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                        <span className="font-semibold">Максимальный рейтинг: 100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks */}
            <div className={`${cardBg} rounded-xl border-2 ${borderColor} p-4 sm:p-6 shadow-lg`}>
              <h2 className={`text-xl font-bold ${headingColor} mb-4 flex items-center gap-2`}>
                <CheckSquare className="w-5 h-5" />
                Мои задачи
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3 rounded-lg border-2 ${
                  theme === 'dark' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className={`text-xs font-medium mb-1 ${
                    theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                  }`}>
                    На согласовании
                  </div>
                  <div className={`text-2xl font-bold ${headingColor}`}>
                    {pendingTasks}
                  </div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${
                  theme === 'dark' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className={`text-xs font-medium mb-1 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                  }`}>
                    В работе
                  </div>
                  <div className={`text-2xl font-bold ${headingColor}`}>
                    {inProgressTasks}
                  </div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${
                  theme === 'dark' ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'
                }`}>
                  <div className={`text-xs font-medium mb-1 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-700'
                  }`}>
                    Выполнена
                  </div>
                  <div className={`text-2xl font-bold ${headingColor}`}>
                    {completedTasks}
                  </div>
                </div>
                <div className={`p-3 rounded-lg border-2 ${
                  theme === 'dark' ? 'bg-gray-500/10 border-gray-500/30' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`text-xs font-medium mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    Всего
                  </div>
                  <div className={`text-2xl font-bold ${headingColor}`}>
                    {tasks.length}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/tasks')}
                className={`w-full mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50'
                    : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                }`}
              >
                Перейти к задачам
              </button>
            </div>

            {/* Notifications */}
            {user && (
              <div className={`${cardBg} rounded-xl border-2 ${borderColor} p-4 sm:p-6 shadow-lg`}>
                <h2 className={`text-xl font-bold ${headingColor} mb-4 flex items-center gap-2`}>
                  <Bell className="w-5 h-5" />
                  Уведомления
                </h2>
                <div className="space-y-3">
                  <div className={`p-4 rounded-lg border-2 ${
                    theme === 'dark' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-sm font-medium ${headingColor}`}>
                          Непрочитанных
                        </div>
                        <div className={`text-2xl font-bold mt-1 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                        }`}>
                          {unreadNotifications}
                        </div>
                      </div>
                      <Bell className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`} />
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg border-2 ${
                    theme === 'dark' ? 'bg-gray-500/10 border-gray-500/30' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-sm font-medium ${headingColor}`}>
                          Всего уведомлений
                        </div>
                        <div className={`text-2xl font-bold mt-1 ${headingColor}`}>
                          {notifications.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/notifications')}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                    }`}
                  >
                    Просмотреть все уведомления
                  </button>
                </div>
              </div>
            )}

            {/* About Community */}
            <div className={`lg:col-span-2 ${cardBg} rounded-xl border-2 ${borderColor} p-4 sm:p-6 shadow-lg`}>
              <h2 className={`text-xl font-bold ${headingColor} mb-4 flex items-center gap-2`}>
                <Info className="w-5 h-5" />
                О сообществе ApeVault
              </h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${
                  theme === 'dark' 
                    ? 'border-cyan-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
                    : 'border-cyan-200 bg-gradient-to-br from-white to-cyan-50/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-cyan-600 to-blue-600'
                        : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                    } text-white flex-shrink-0`}>
                      <Info className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 ${headingColor}`}>
                        Что такое ApeVault?
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        ApeVault — закрытое профессиональное сообщество трейдеров и коллеров. Мы объединяем экспертизу, строгие
                        регламенты и командную поддержку, чтобы ускорять результаты каждого участника и строить прозрачную культуру
                        трейдинга.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Участников', value: '50+', icon: Users },
                    { label: 'Уроков', value: '100+', icon: BookOpen },
                    { label: 'Сессий в неделю', value: '10+', icon: Target },
                    { label: 'Продуктов', value: '3', icon: Award }
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`p-3 rounded-lg border ${
                        theme === 'dark' ? 'border-cyan-500/20 bg-white/5' : 'border-cyan-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                        <p className={`text-xs uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.label}
                        </p>
                      </div>
                      <p className={`text-xl font-bold ${headingColor}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg border-2 ${
                    theme === 'dark' 
                      ? 'border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
                      : 'border-green-200 bg-gradient-to-br from-white to-green-50/20'
                  }`}>
                    <div className={`p-2 rounded-lg mb-2 inline-block ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-green-600 to-emerald-600' 
                        : 'bg-gradient-to-br from-green-500 to-emerald-500'
                    } text-white`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <h4 className={`text-sm font-bold mb-1 ${headingColor}`}>Командная работа</h4>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Слаженная работа команды профессионалов
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border-2 ${
                    theme === 'dark' 
                      ? 'border-purple-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
                      : 'border-purple-200 bg-gradient-to-br from-white to-purple-50/20'
                  }`}>
                    <div className={`p-2 rounded-lg mb-2 inline-block ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    } text-white`}>
                      <Target className="w-4 h-4" />
                    </div>
                    <h4 className={`text-sm font-bold mb-1 ${headingColor}`}>Профессионализм</h4>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Высокие стандарты работы и строгий регламент
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border-2 ${
                    theme === 'dark' 
                      ? 'border-yellow-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
                      : 'border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20'
                  }`}>
                    <div className={`p-2 rounded-lg mb-2 inline-block ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-yellow-600 to-orange-600' 
                        : 'bg-gradient-to-br from-yellow-500 to-orange-500'
                    } text-white`}>
                      <Award className="w-4 h-4" />
                    </div>
                    <h4 className={`text-sm font-bold mb-1 ${headingColor}`}>Рейтинг</h4>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Система рейтинга и мотивация к результатам
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  theme === 'dark' 
                    ? 'border-indigo-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
                    : 'border-indigo-200 bg-gradient-to-br from-white to-indigo-50/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600' 
                        : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                    } text-white flex-shrink-0`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-bold mb-2 ${headingColor}`}>Правила сообщества</h4>
                      <p className={`text-xs mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Подробный регламент торговых сессий и правила сообщества
                      </p>
                      <a
                        href="https://telegra.ph/Reglament-provedeniya-torgovyh-sessij-pravila-soobshchestva-ApeVault-dlya-trejderov-i-kollerov-11-20"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                          theme === 'dark'
                            ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50'
                            : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                        }`}
                      >
                        <BookOpen className="w-3 h-3" />
                        Ознакомиться с правилами
                      </a>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  theme === 'dark' 
                    ? 'border-pink-500/30 bg-gradient-to-br from-gray-800 to-gray-900' 
                    : 'border-pink-200 bg-gradient-to-br from-white to-pink-50/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-br from-pink-600 to-rose-600' 
                        : 'bg-gradient-to-br from-pink-500 to-rose-500'
                    } text-white flex-shrink-0`}>
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-bold mb-1 ${headingColor}`}>Контакты</h4>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        По вопросам работы системы обращайтесь к администратору:{' '}
                        <span className={`font-bold ${headingColor}`}>@artyommedoed</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className={`lg:col-span-2 ${cardBg} rounded-xl border-2 ${borderColor} p-4 sm:p-6 shadow-lg`}>
              <button
                onClick={handleLogout}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-2 border-red-500/50 hover:border-red-500'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-200 hover:border-red-300'
                }`}
              >
                <LogOut className="w-5 h-5" />
                Выйти из аккаунта
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

