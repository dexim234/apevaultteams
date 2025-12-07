import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import {
  getTasks,
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
import { Task, RatingData } from '@/types'
import {
  User,
  LogOut,
  Eye,
  EyeOff,
  CheckSquare,
  TrendingUp,
  Shield,
  Copy,
  Check,
  Info,
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
  const [rating, setRating] = useState<RatingData | null>(null)
  const [ratingBreakdown, setRatingBreakdown] = useState<ReturnType<typeof getRatingBreakdown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginCopied, setLoginCopied] = useState(false)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

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

      const userTasks = await getTasks({ assignedTo: userId })
      setTasks(userTasks)

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
        const weeklyEarnings = weekEarnings.reduce((sum, e) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.amount / participantCount)
        }, 0)

        const monthEarnings = await getEarnings(userId, monthStart, monthEnd)
        const totalEarnings = monthEarnings.reduce((sum, e) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.amount / participantCount)
        }, 0)
        const poolAmount = monthEarnings.reduce((sum, e) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.poolAmount / participantCount)
        }, 0)

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

  const handleCopyLogin = () => {
    if (userData?.login) {
      navigator.clipboard.writeText(userData.login)
      setLoginCopied(true)
      setTimeout(() => setLoginCopied(false), 2000)
    }
  }

  const userData = user || (isAdmin ? { name: 'Администратор', login: 'admin', password: 'admin' } : null)
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
        <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} shadow-lg`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/20 text-[#4E6E49]' : 'bg-green-50 text-[#4E6E49]'}`}>
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-[0.14em] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>ApeVault Black Ops</p>
                <h1 className={`text-2xl sm:text-3xl font-extrabold ${headingColor}`}>Личный кабинет</h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Закрытый контур. Ваши данные и показатели.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="pill" data-active="true">
                <User className="w-4 h-4" />
                <span>{userData.name}</span>
              </div>
              {isAdmin && (
                <div className="pill" data-active="true">
                  <Shield className="w-4 h-4" />
                  <span>Администратор</span>
                </div>
              )}
              <div className="pill" data-active="false">
                <CheckSquare className="w-4 h-4" />
                <span>{tasks.length} задач</span>
              </div>
              {rating && (
                <div className="pill" data-active="false">
                  <TrendingUp className="w-4 h-4" />
                  <span>{rating.rating.toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className={`rounded-xl p-8 text-center ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-white text-gray-800'} shadow`}>Загрузка...</div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4 items-stretch">
              <div className="space-y-4 flex flex-col">
                <div className={`rounded-2xl p-5 border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} shadow flex-1`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-blue-500/15 text-blue-200' : 'bg-blue-50 text-blue-700'}`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-bold ${headingColor}`}>Профиль</h2>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Доступ и учетные данные</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} shadow-sm`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Имя</p>
                      <p className={`mt-1 text-lg font-bold ${headingColor}`}>{userData.name}</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} shadow-sm`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Логин</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className={`text-lg font-bold ${headingColor}`}>{userData.login}</p>
                      <button
                        onClick={handleCopyLogin}
                        className={`p-2 rounded-lg border transition ${loginCopied ? 'bg-[#4E6E49] text-white border-[#4E6E49]' : theme === 'dark' ? 'border-white/10 bg-white/5 hover:border-white/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        title="Скопировать логин"
                      >
                        {loginCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <label className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} block`}>Пароль</label>
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 px-4 py-3 rounded-lg border ${theme === 'dark' ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-white text-gray-900'} font-mono text-sm`}>
                        {showPassword ? userData.password : '•'.repeat(userData.password.length)}
                      </div>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:border-white/30' : 'border-gray-200 bg-white hover:border-gray-300'} transition`}
                        title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={handleCopyPassword}
                        className={`p-3 rounded-lg border transition ${passwordCopied ? 'bg-[#4E6E49] text-white border-[#4E6E49]' : theme === 'dark' ? 'border-white/10 bg-white/5 hover:border-white/30' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        title="Скопировать пароль"
                      >
                        {passwordCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl p-5 border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} shadow flex-1`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-green-500/15 text-green-200' : 'bg-green-50 text-[#4E6E49]'}`}>
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-bold ${headingColor}`}>Мои задачи</h2>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Сводка по статусам</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[{label:'Рассмотрение',value:pendingTasks,classes:theme==='dark'?'bg-amber-500/15 border-amber-500/30 text-amber-100':'bg-amber-50 border-amber-200 text-amber-900'},
                      {label:'В работе',value:inProgressTasks,classes:theme==='dark'?'bg-blue-500/15 border-blue-500/30 text-blue-100':'bg-blue-50 border-blue-200 text-blue-900'},
                      {label:'Выполнена',value:completedTasks,classes:theme==='dark'?'bg-emerald-500/15 border-emerald-500/30 text-emerald-50':'bg-emerald-50 border-emerald-200 text-emerald-900'},
                      {label:'Всего',value:tasks.length,classes:theme==='dark'?'bg-gray-600/20 border-gray-500/40 text-gray-100':'bg-gray-50 border-gray-200 text-gray-800'}].map(({label,value,classes})=>(
                      <div key={label} className={`p-4 rounded-xl border shadow-sm transition-all hover:translate-y-[-2px] ${classes}`}>
                        <div className="text-xs font-semibold mb-2 opacity-80">{label}</div>
                        <div className={`text-3xl font-extrabold ${headingColor}`}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/tasks')}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-gradient-to-r from-[#4E6E49]/20 to-emerald-700/20 text-[#4E6E49] border border-[#4E6E49]/40' : 'bg-gradient-to-r from-green-50 to-emerald-50 text-[#4E6E49] border border-green-200'}`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    Перейти к задачам
                  </button>
                </div>
              </div>

              <div className="space-y-4 flex flex-col">
                {rating && ratingBreakdown && (
                  <div className={`rounded-2xl p-5 border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} shadow flex-1`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-purple-500/20 text-purple-200' : 'bg-purple-50 text-purple-700'}`}>
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className={`text-lg font-bold ${headingColor}`}>Рейтинг</h2>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Еженедельная оценка</p>
                        </div>
                      </div>
                      <div className="pill" data-active="true">
                        <span className="font-bold">{rating.rating.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'} mb-4`}>
                      <div className={`text-4xl font-extrabold ${headingColor}`}>{rating.rating.toFixed(1)}%</div>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {rating.rating >= 70 ? 'Отличный результат' : rating.rating >= 50 ? 'Хороший темп' : 'Требуется усиление показателей'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[{label:'Выходные',value:`${rating.daysOff} дн`,pts:ratingBreakdown.daysOffPoints,classes:theme==='dark'?'bg-slate-700/40 border-slate-600/60':'bg-slate-50 border-slate-200'},
                        {label:'Больничные',value:`${rating.sickDays} дн`,pts:ratingBreakdown.sickDaysPoints,classes:theme==='dark'?'bg-amber-500/15 border-amber-500/30':'bg-amber-50 border-amber-200'},
                        {label:'Отпуск',value:`${rating.vacationDays} дн`,pts:ratingBreakdown.vacationDaysPoints,classes:theme==='dark'?'bg-orange-500/15 border-orange-500/30':'bg-orange-50 border-orange-200'},
                        {label:'Часы',value:`${ratingBreakdown.weeklyHours.toFixed(1)} ч/нед`,pts:ratingBreakdown.weeklyHoursPoints,classes:theme==='dark'?'bg-blue-500/15 border-blue-500/30':'bg-blue-50 border-blue-200'},
                        {label:'Заработок',value:`${ratingBreakdown.weeklyEarnings.toFixed(0)} ₽/нед`,pts:ratingBreakdown.weeklyEarningsPoints,classes:theme==='dark'?'bg-emerald-500/15 border-emerald-500/30':'bg-emerald-50 border-emerald-200'},
                        {label:'Рефералы',value:`${rating.referrals}`,pts:ratingBreakdown.referralsPoints,classes:theme==='dark'?'bg-purple-500/15 border-purple-500/30':'bg-purple-50 border-purple-200'},
                        {label:'Сообщения',value:`${ratingBreakdown.weeklyMessages} сообщ/нед`,pts:ratingBreakdown.weeklyMessagesPoints,classes:theme==='dark'?'bg-pink-500/15 border-pink-500/30':'bg-pink-50 border-pink-200'}].map(item => (
                        <div key={item.label} className={`p-3 rounded-xl border shadow-sm ${item.classes}`}>
                          <div className="text-xs font-semibold uppercase opacity-80">{item.label}</div>
                          <div className={`text-lg font-bold ${headingColor}`}>{item.value}</div>
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{item.pts.toFixed(1)}%</div>
                        </div>
                      ))}
                    </div>

                    <div className={`mt-4 p-4 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                      <h3 className={`text-sm font-bold ${headingColor} mb-2 flex items-center gap-2`}>
                        <Info className="w-4 h-4" />
                        Как считается рейтинг
                      </h3>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        7 параметров: выходные, больничные, отпуск (месяц), часы, доход, рефералы, сообщения (неделя). Максимум 100%.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-2xl p-5 border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} shadow`}> 
              <button
                onClick={handleLogout}
                className={`w-full px-6 py-3.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/50' : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200'}`}
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
