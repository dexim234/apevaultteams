import React, { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore, ADMIN_PASSWORD } from '@/store/adminStore'
import { useViewedUserStore } from '@/store/viewedUserStore'
import { useEffectiveUserId } from '@/hooks/useEffectiveUserId'
import {
  getTasks,
  getRatingData,
  getEarnings,
  getDayStatuses,
  getReferrals,
  getWorkSlots,
  getUserNotes,
  addNote,
  updateNote,
  deleteNote,
  getUserNickname,
  addApprovalRequest,
} from '@/services/firestoreService'
import {
  getWeekRange,
  getLastNDaysRange,
  formatDate,
  calculateHours,
  countDaysInPeriod
} from '@/utils/dateUtils'
import { calculateRating, getRatingBreakdown } from '@/utils/ratingUtils'
import { Task, RatingData, Note, Earnings, DayStatus } from '@/types'
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
  DollarSign,
  StickyNote,
  Edit3,
  Trash2,
  BookOpen,
  Zap,
  Wallet,
  PiggyBank,
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { TEAM_MEMBERS } from '@/types'
import { useUserNickname } from '@/utils/userUtils'
import { UserNickname } from '@/components/UserNickname'

export const Profile = () => {
  const { theme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const { isAdmin, deactivateAdmin } = useAdminStore()
  const { isViewingOtherUser } = useViewedUserStore()
  const effectiveUserId = useEffectiveUserId()
  const navigate = useNavigate()

  // Use effective user ID (viewed user or current user)
  const targetUserId = effectiveUserId || user?.id || 'admin'

  const [showPassword, setShowPassword] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [rating, setRating] = useState<RatingData | null>(null)
  const [ratingBreakdown, setRatingBreakdown] = useState<ReturnType<typeof getRatingBreakdown> | null>(null)
  const [earningsSummary, setEarningsSummary] = useState<{
    total: number
    pool: number
    net: number
    weekly: { gross: number; pool: number; net: number }
  } | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [noteDraft, setNoteDraft] = useState<Note>({
    id: '',
    userId: '',
    title: '',
    text: '',
    priority: 'medium',
    createdAt: '',
    updatedAt: '',
  })
  const [loading, setLoading] = useState(true)
  const [loginCopied, setLoginCopied] = useState(false)
  const [newNickname, setNewNickname] = useState('')
  const [isEditingNickname, setIsEditingNickname] = useState(false)
  const [nicknameRequestPending, setNicknameRequestPending] = useState(false)
  const nickname = useUserNickname(targetUserId || '')

  // Get viewed user info if viewing other user
  const viewedUserMember = effectiveUserId ? TEAM_MEMBERS.find(m => m.id === effectiveUserId) : null

  const userData = user || (isAdmin ? { name: 'Администратор', login: 'admin', password: ADMIN_PASSWORD } : null)
  const profileAvatar = effectiveUserId ? TEAM_MEMBERS.find((m) => m.id === effectiveUserId)?.avatar : undefined
  const profileInitial = userData?.name ? userData.name.charAt(0).toUpperCase() : 'A'

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
      // Use effective user ID (viewed user or current user)
      const targetUserId = effectiveUserId || user?.id || 'admin'

      const userTasks = await getTasks({ assignedTo: targetUserId })
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

        const ninetyDayRange = getLastNDaysRange(90)
        const ninetyDayStart = formatDate(ninetyDayRange.start, 'yyyy-MM-dd')
        const ninetyDayEnd = formatDate(ninetyDayRange.end, 'yyyy-MM-dd')

        const weekEarnings = await getEarnings(targetUserId, weekStart, weekEnd)
        const weeklyEarnings = weekEarnings.reduce((sum: number, e: Earnings) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.amount / participantCount)
        }, 0)
        const weeklyPool = weekEarnings.reduce((sum: number, e: Earnings) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.poolAmount / participantCount)
        }, 0)

        const monthEarnings = await getEarnings(targetUserId, monthStart, monthEnd)
        const totalEarnings = monthEarnings.reduce((sum: number, e: Earnings) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.amount / participantCount)
        }, 0)
        const poolAmount = monthEarnings.reduce((sum: number, e: Earnings) => {
          const participantCount = e.participants && e.participants.length > 0 ? e.participants.length : 1
          return sum + (e.poolAmount / participantCount)
        }, 0)

        const statuses = await getDayStatuses(targetUserId)
        const monthStatuses = statuses.filter((s: DayStatus) => {
          const statusStart = s.date
          const statusEnd = s.endDate || s.date
          return statusStart <= monthEnd && statusEnd >= monthStart
        })

        const daysOff = monthStatuses
          .filter((s: any) => s.type === 'dayoff')
          .reduce((sum: number, s: any) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const sickDays = monthStatuses
          .filter((s: any) => s.type === 'sick')
          .reduce((sum: number, s: any) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const vacationDays = monthStatuses
          .filter((s: any) => s.type === 'vacation')
          .reduce((sum: number, s: any) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const absenceDays = monthStatuses
          .filter((s: any) => s.type === 'absence')
          .reduce((sum: number, s: any) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const truancyDays = monthStatuses
          .filter((s: any) => s.type === 'truancy')
          .reduce((sum: number, s: any) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)
        const internshipDays = monthStatuses
          .filter((s: any) => s.type === 'internship')
          .reduce((sum: number, s: any) => sum + countDaysInPeriod(s.date, s.endDate, monthStart, monthEnd), 0)

        // Недельные выходные и больничные
        const weekStatuses = statuses.filter((s: any) => {
          const statusStart = s.date
          const statusEnd = s.endDate || s.date
          return statusStart <= weekEnd && statusEnd >= weekStart
        })

        const weeklyDaysOff = weekStatuses
          .filter((s: any) => s.type === 'dayoff')
          .reduce((sum: number, s: any) => sum + countDaysInPeriod(s.date, s.endDate, weekStart, weekEnd), 0)
        const weeklySickDays = weekStatuses
          .filter((s: any) => s.type === 'sick')
          .reduce((sum: number, s: any) => sum + countDaysInPeriod(s.date, s.endDate, weekStart, weekEnd), 0)

        // Отпуск за 90 дней
        const ninetyDayStatuses = statuses.filter((s: any) => {
          const statusStart = s.date
          const statusEnd = s.endDate || s.date
          return statusStart <= ninetyDayEnd && statusEnd >= ninetyDayStart
        })

        const ninetyDayVacationDays = ninetyDayStatuses
          .filter((s: any) => s.type === 'vacation')
          .reduce((sum: number, s: any) => sum + countDaysInPeriod(s.date, s.endDate, ninetyDayStart, ninetyDayEnd), 0)

        const slots = await getWorkSlots(targetUserId)
        const weekSlots = slots.filter((s: any) => s.date >= weekStart && s.date <= weekEnd)
        const weeklyHours = weekSlots.reduce((sum: number, slot: any) => sum + calculateHours(slot.slots), 0)

        const existingRatings = await getRatingData(targetUserId)
        const ratingData = existingRatings[0] || {
          userId: targetUserId,
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

        const currentReferrals = await getReferrals(undefined, monthIsoStart, monthIsoEnd)
        const userReferrals = currentReferrals.filter((referral: any) => referral.ownerId === targetUserId).length

        const updatedData: Omit<RatingData, 'rating'> = {
          userId: targetUserId,
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

        console.log('Profile.tsx calculateRating call for user:', targetUserId, {
          weeklyHours,
          weeklyEarnings,
          weeklyDaysOff,
          weeklySickDays,
          ninetyDayVacationDays,
          updatedData
        })

        const calculatedRating = calculateRating(
          updatedData,
          weeklyHours,
          weeklyEarnings,
          weeklyDaysOff,
          weeklySickDays,
          ninetyDayVacationDays
        )

        const breakdown = getRatingBreakdown(
          updatedData,
          weeklyHours,
          weeklyEarnings,
          weeklyDaysOff,
          weeklySickDays,
          ninetyDayVacationDays
        )

        setRating({ ...updatedData, rating: calculatedRating })
        setRatingBreakdown(breakdown)

        setEarningsSummary({
          total: totalEarnings,
          pool: poolAmount,
          net: Math.max(0, totalEarnings - poolAmount),
          weekly: {
            gross: weeklyEarnings,
            pool: weeklyPool,
            net: Math.max(0, weeklyEarnings - weeklyPool),
          },
        })

        const notesCacheKey = targetUserId ? `notes-cache-${targetUserId}` : null
        const saveLocalNotes = (list: Note[]) => {
          if (notesCacheKey) {
            try {
              localStorage.setItem(notesCacheKey, JSON.stringify(list))
            } catch (err) {
              console.error('Error caching notes locally', err)
            }
          }
        }

        try {
          if (targetUserId) {
            const userNotes = await getUserNotes(targetUserId, isAdmin)
            setNotes(userNotes)
            saveLocalNotes(userNotes)

            // Nickname is now handled by useUserNickname hook at the top level
          } else if (isAdmin) {
            const allNotes = await getUserNotes(undefined, true)
            setNotes(allNotes)
            saveLocalNotes(allNotes)
          }
        } catch (err) {
          console.error('Error loading notes', err)
          if (notesCacheKey) {
            try {
              const cached = localStorage.getItem(notesCacheKey)
              if (cached) {
                const parsed = JSON.parse(cached) as Note[]
                setNotes(parsed)
              }
            } catch (cacheErr) {
              console.error('Error loading cached notes', cacheErr)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveNote = async () => {
    if (!targetUserId) return
    if (!noteDraft.title.trim() && !noteDraft.text.trim()) return

    const notesCacheKey = targetUserId ? `notes-cache-${targetUserId}` : null
    const saveLocalNotes = (list: Note[]) => {
      if (notesCacheKey) {
        try {
          localStorage.setItem(notesCacheKey, JSON.stringify(list))
        } catch (err) {
          console.error('Error caching notes locally', err)
        }
      }
    }

    try {
      if (noteDraft.id) {
        await updateNote(noteDraft.id, {
          title: noteDraft.title,
          text: noteDraft.text,
          priority: noteDraft.priority,
        })
        const next = notes.map((n: Note) =>
          n.id === noteDraft.id
            ? { ...n, title: noteDraft.title, text: noteDraft.text, priority: noteDraft.priority, updatedAt: new Date().toISOString() }
            : n
        )
        setNotes(next)
        saveLocalNotes(next)
      } else {
        const newId = await addNote({
          userId: targetUserId,
          title: noteDraft.title,
          text: noteDraft.text,
          priority: noteDraft.priority,
        })
        const now = new Date().toISOString()
        const next = [
          {
            id: newId,
            userId: targetUserId,
            title: noteDraft.title,
            text: noteDraft.text,
            priority: noteDraft.priority,
            createdAt: now,
            updatedAt: now,
          },
          ...notes,
        ]
        setNotes(next)
        saveLocalNotes(next)
      }
    } catch (err) {
      console.error('Error saving note', err)
    } finally {
      setNoteDraft({ id: '', userId: '', title: '', text: '', priority: 'medium', createdAt: '', updatedAt: '' })
    }
  }

  const handleEditNote = (id: string) => {
    const found = notes.find((n: Note) => n.id === id)
    if (found) setNoteDraft(found)
  }

  const handleDeleteNote = async (id: string) => {
    const notesCacheKey = user?.id ? `notes-cache-${user.id}` : null
    const saveLocalNotes = (list: Note[]) => {
      if (notesCacheKey) {
        try {
          localStorage.setItem(notesCacheKey, JSON.stringify(list))
        } catch (err) {
          console.error('Error caching notes locally', err)
        }
      }
    }

    try {
      await deleteNote(id)
      const next = notes.filter((n: Note) => n.id !== id)
      setNotes(next)
      saveLocalNotes(next)
      if (noteDraft.id === id) {
        setNoteDraft({ id: '', userId: '', title: '', text: '', priority: 'medium', createdAt: '', updatedAt: '' })
      }
    } catch (err) {
      console.error('Error deleting note', err)
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
    const loginToCopy = userData?.login
    if (loginToCopy) {
      navigator.clipboard.writeText(loginToCopy)
      setLoginCopied(true)
      setTimeout(() => setLoginCopied(false), 2000)
    }
  }

  const handleRequestNicknameChange = async () => {
    if (!targetUserId || !newNickname.trim()) return

    const trimmedNickname = newNickname.trim()
    const currentNickname = nickname || ''

    // Check if nickname is different
    if (trimmedNickname === currentNickname) {
      setIsEditingNickname(false)
      setNewNickname('')
      return
    }

    setNicknameRequestPending(true)
    try {
      const currentUserNickname = await getUserNickname(targetUserId)

      await addApprovalRequest({
        entity: 'login',
        action: 'update',
        authorId: targetUserId,
        targetUserId: targetUserId,
        before: currentUserNickname || { id: '', userId: targetUserId, nickname: currentNickname, createdAt: '', updatedAt: '' },
        after: { id: '', userId: targetUserId, nickname: trimmedNickname, createdAt: '', updatedAt: '' },
        comment: `Запрос на изменение ника с "${currentNickname}" на "${trimmedNickname}"`,
      })

      setIsEditingNickname(false)
      setNewNickname('')
      alert('Запрос на изменение ника отправлен на согласование администратору')
    } catch (error) {
      console.error('Error requesting nickname change:', error)
      alert('Ошибка при отправке запроса на изменение ника')
    } finally {
      setNicknameRequestPending(false)
    }
  }

  const inProgressTasks = tasks.filter((t: Task) => t.status === 'in_progress').length
  const completedTasks = tasks.filter((t: Task) => t.status === 'completed').length
  const closedTasks = tasks.filter((t: Task) => t.status === 'closed').length
  const taskStatusMeta: Record<Task['status'], { label: string; classes: string }> = {
    in_progress: {
      label: 'В работе',
      classes: theme === 'dark' ? 'bg-blue-500/15 text-blue-100 border-blue-500/30' : 'bg-blue-50 text-blue-900 border-blue-200',
    },
    completed: {
      label: 'Выполнена',
      classes: theme === 'dark' ? 'bg-emerald-500/15 text-emerald-50 border-emerald-500/30' : 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
    closed: {
      label: 'Закрыта',
      classes: theme === 'dark' ? 'bg-gray-600/20 text-gray-100 border-gray-500/40' : 'bg-gray-50 text-gray-800 border-gray-200',
    },
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <p className={headingColor}>Необходима авторизация</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* New Header */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#4E6E49]/10 rounded-2xl border border-[#4E6E49]/20 shadow-lg shadow-[#4E6E49]/5 flex items-center justify-center min-w-[80px] min-h-[80px]">
              {profileAvatar ? (
                <img
                  src={profileAvatar}
                  alt={userData?.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4E6E49] to-emerald-600 flex items-center justify-center text-2xl font-black text-white">
                  {profileInitial}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>
                  Личный кабинет
                </span>
                {isViewingOtherUser() && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[9px] font-black tracking-widest uppercase border border-amber-500/20">
                    Просмотр
                  </span>
                )}
              </div>
              <h1 className={`text-2xl md:text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isViewingOtherUser() ? viewedUserMember?.name || 'Пользователь' : userData.name}
              </h1>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Закрытый контур. Ваши данные и показатели.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/rules"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all font-bold text-sm ${theme === 'dark'
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-900 shadow-sm'
                }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Правила</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-all shadow-lg shadow-rose-500/20 hover:scale-105 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Выйти</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Рейтинг (КПД)',
              value: rating ? `${rating.rating.toFixed(1)}%` : '—',
              note: rating?.rating && rating.rating >= 70 ? 'Высокая эффективность' : 'Требуется рост',
              icon: <Zap className="w-5 h-5 text-amber-400" />,
              bgClass: 'bg-amber-500/5',
              borderClass: 'border-amber-500/10'
            },
            {
              label: 'Задачи в работе',
              value: inProgressTasks,
              note: `${tasks.length} всего задач`,
              icon: <CheckSquare className="w-5 h-5 text-blue-400" />,
              bgClass: 'bg-blue-500/5',
              borderClass: 'border-blue-500/10'
            },
            {
              label: 'Недельный доход',
              value: earningsSummary ? `${Math.round(earningsSummary.weekly.net).toLocaleString()} ₽` : '0 ₽',
              note: earningsSummary?.weekly.net && earningsSummary.weekly.net >= 10000 ? 'Доступно к выводу' : 'Ниже порога',
              icon: <Wallet className="w-5 h-5 text-emerald-400" />,
              bgClass: 'bg-emerald-500/5',
              borderClass: 'border-emerald-500/10'
            },
            {
              label: 'Статус аккаунта',
              value: isAdmin ? 'Admin' : 'Member',
              note: 'Постоянный доступ',
              icon: <Shield className="w-5 h-5 text-purple-400" />,
              bgClass: 'bg-purple-500/5',
              borderClass: 'border-purple-500/10'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl group ${theme === 'dark'
                ? `${item.bgClass} ${item.borderClass} hover:border-white/20`
                : 'bg-white border-gray-100 hover:border-[#4E6E49]/20 shadow-sm'
                }`}
            >
              <div className="flex justify-between items-start mb-6">
                <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                  {item.icon}
                </div>
              </div>
              <div className="space-y-1">
                <div className={`text-2xl md:text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {item.value}
                </div>
                <div className={`text-[11px] font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  {item.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={`rounded-xl p-8 text-center ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-white text-gray-800'} shadow`}>Загрузка...</div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4 items-stretch">
            <div className="space-y-4 flex flex-col">
              <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/5 bg-[#1a1a1a]' : 'border-gray-200 bg-white'} shadow flex-1`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 text-[#4E6E49]' : 'bg-[#4E6E49]/5 text-[#4E6E49]'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Профиль</h2>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Доступ и учетные данные</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-gray-50'} shadow-sm`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Имя</p>
                    <p className={`mt-1 text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{userData.name}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-gray-50'} shadow-sm`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Ник</p>
                      {!isEditingNickname && user && !isAdmin && (
                        <button
                          onClick={async () => {
                            setIsEditingNickname(true)
                            setNewNickname(nickname || '')
                          }}
                          className={`text-[10px] px-2 py-1 rounded-lg border transition-all font-black uppercase tracking-wider ${theme === 'dark' ? 'border-white/5 bg-white/5 hover:border-white/10 text-white' : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'}`}
                        >
                          <Edit3 className="w-3 h-3 inline mr-1" />
                          Изменить
                        </button>
                      )}
                    </div>
                    {isEditingNickname ? (
                      <div className="space-y-2 mt-1">
                        <input
                          type="text"
                          value={newNickname}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNickname(e.target.value)}
                          placeholder="Введите новый ник"
                          className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-white text-gray-900'} text-sm`}
                          disabled={nicknameRequestPending}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleRequestNicknameChange}
                            disabled={nicknameRequestPending || !newNickname.trim()}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${nicknameRequestPending || !newNickname.trim()
                              ? 'opacity-50 cursor-not-allowed'
                              : 'bg-[#4E6E49] text-white hover:bg-[#3d5639]'
                              }`}
                          >
                            {nicknameRequestPending ? 'Отправка...' : 'Отправить на согласование'}
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingNickname(false)
                              setNewNickname('')
                            }}
                            disabled={nicknameRequestPending}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:border-white/30 text-white' : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                              }`}
                          >
                            Отмена
                          </button>
                        </div>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Изменение ника требует согласования администратора
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <p className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {user?.id ? <UserNickname userId={user.id} /> : '—'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-gray-50'} shadow-sm`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Логин</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{userData.login}</p>
                      <button
                        onClick={handleCopyLogin}
                        className={`p-2 rounded-lg border transition-all ${loginCopied ? 'bg-[#4E6E49] text-white border-[#4E6E49]' : theme === 'dark' ? 'border-white/5 bg-white/5 hover:border-white/10' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        title="Скопировать логин"
                      >
                        {loginCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} block`}>Пароль</label>
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 px-4 py-3 rounded-xl border ${theme === 'dark' ? 'border-white/5 bg-black/20 text-white' : 'border-gray-200 bg-white text-gray-900'} font-mono text-sm`}>
                      {showPassword ? userData.password : '•'.repeat(userData.password.length)}
                    </div>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className={`p-3 rounded-xl border ${theme === 'dark' ? 'border-white/5 bg-white/5 hover:border-white/10' : 'border-gray-200 bg-white hover:border-gray-300'} transition-all`}
                      title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleCopyPassword}
                      className={`p-3 rounded-xl border transition-all ${passwordCopied ? 'bg-[#4E6E49] text-white border-[#4E6E49]' : theme === 'dark' ? 'border-white/5 bg-white/5 hover:border-white/10' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                      title="Скопировать пароль"
                    >
                      {passwordCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-1">
                  <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} shadow-sm`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Учебная панель (преподаватель)</p>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-semibold">Имя: </span>
                        <span className="font-medium">в разработке</span>
                      </div>
                      <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-semibold">Логин: </span>
                        <span className="font-medium">в разработке</span>
                      </div>
                      <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-semibold">Пароль: </span>
                        <span className="font-medium">в разработке</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/5 bg-[#1a1a1a]' : 'border-gray-200 bg-white'} shadow flex-1`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 text-[#4E6E49]' : 'bg-[#4E6E49]/5 text-[#4E6E49]'}`}>
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Мои задачи</h2>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Сводка по статусам</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[{ label: 'В работе', value: inProgressTasks, classes: theme === 'dark' ? 'bg-blue-500/5 border-blue-500/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600' },
                  { label: 'Выполнено', value: completedTasks, classes: theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600' },
                  { label: 'Закрыто', value: closedTasks, classes: theme === 'dark' ? 'bg-gray-500/5 border-gray-500/10 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-600' },
                  { label: 'Всего', value: tasks.length, classes: theme === 'dark' ? 'bg-purple-500/5 border-purple-500/10 text-purple-400' : 'bg-purple-50 border-purple-100 text-purple-600' }].map(({ label, value, classes }) => (
                    <div key={label} className={`p-4 rounded-xl border shadow-sm transition-all hover:translate-y-[-2px] ${classes}`}>
                      <div className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-70">{label}</div>
                      <div className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</div>
                    </div>
                  ))}
                </div>
                {tasks.length > 0 && (
                  <div className="space-y-3 mb-6">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Активные задачи
                    </p>
                    <div className="space-y-2">
                      {tasks.slice(0, 3).map((task: Task) => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} shadow-sm`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className={`text-sm font-semibold ${headingColor} truncate`}>{task.title}</p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Дедлайн: {task.dueDate ? formatDate(new Date(task.dueDate), 'dd.MM.yyyy') : '—'} {task.dueTime || ''}
                              </p>
                            </div>
                            <span className={`text-[11px] px-2 py-1 rounded-full border ${taskStatusMeta[task.status].classes}`}>
                              {taskStatusMeta[task.status].label}
                            </span>
                          </div>
                          {task.description && (
                            <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4 text-[#4E6E49]" />
                    <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Мои заметки</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      value={noteDraft.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoteDraft({ ...noteDraft, title: e.target.value })}
                      placeholder="Заголовок"
                      className={`px-3 py-2 rounded-lg border ${theme === 'dark' ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-white text-gray-900'} text-sm`}
                    />
                    <div className="flex gap-2">
                      {(['low', 'medium', 'high'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setNoteDraft({ ...noteDraft, priority: p })}
                          className={`px-3 py-2 rounded-lg border text-sm flex-1 ${noteDraft.priority === p
                            ? 'border-[#4E6E49] bg-[#4E6E49]/10 text-[#4E6E49]'
                            : theme === 'dark'
                              ? 'border-white/10 bg-white/5 text-white'
                              : 'border-gray-200 bg-white text-gray-800'
                            }`}
                        >
                          {p === 'low' ? 'Низкий' : p === 'medium' ? 'Средний' : 'Высокий'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={noteDraft.text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteDraft({ ...noteDraft, text: e.target.value })}
                    rows={3}
                    placeholder="Текст заметки"
                    className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-white text-gray-900'} text-sm`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveNote}
                      className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${!user?.id
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : theme === 'dark'
                          ? 'bg-[#4E6E49]/20 text-[#4E6E49] border border-[#4E6E49]/40'
                          : 'bg-gradient-to-r from-[#4E6E49] to-emerald-500 text-white'
                        }`}
                      disabled={!user?.id}
                    >
                      <Edit3 className="w-4 h-4" />
                      {noteDraft.id ? 'Сохранить' : 'Добавить'}
                    </button>
                    {noteDraft.id && (
                      <button
                        onClick={() =>
                          setNoteDraft({
                            id: '',
                            userId: '',
                            title: '',
                            text: '',
                            priority: 'medium',
                            createdAt: '',
                            updatedAt: '',
                          })
                        }
                        className={`px-4 py-2 rounded-lg font-semibold border ${theme === 'dark' ? 'border-white/15 text-gray-200' : 'border-gray-200 text-gray-700'}`}
                      >
                        Отмена
                      </button>
                    )}
                  </div>
                  {notes.length > 0 && (
                    <div className="space-y-2">
                      {notes.map((n: Note) => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} flex flex-col gap-1`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className={`text-sm font-semibold ${headingColor} truncate`}>{n.title || 'Без названия'}</p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} whitespace-pre-line`}>{n.text}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-[11px] px-2 py-1 rounded-full border ${n.priority === 'high'
                                  ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-50'
                                  : n.priority === 'medium'
                                    ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-50'
                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-50'
                                  }`}
                              >
                                {n.priority === 'high' ? 'Высокий' : n.priority === 'medium' ? 'Средний' : 'Низкий'}
                              </span>
                              <button
                                onClick={() => handleEditNote(n.id)}
                                className={`p-1 rounded border ${theme === 'dark' ? 'border-white/10 text-gray-200' : 'border-gray-200 text-gray-700'}`}
                                title="Редактировать"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(n.id)}
                                className={`p-1 rounded border ${theme === 'dark' ? 'border-white/10 text-red-200' : 'border-gray-200 text-red-600'}`}
                                title="Удалить"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate('/tasks')}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'bg-gradient-to-r from-[#4E6E49]/20 to-emerald-700/20 text-[#4E6E49] border border-[#4E6E49]/40' : 'bg-gradient-to-r from-green-50 to-emerald-50 text-[#4E6E49] border border-green-200'}`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    Перейти к задачам
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col">
              {earningsSummary && (
                <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/5 bg-[#1a1a1a]' : 'border-gray-200 bg-white'} shadow flex-1`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Мой заработок</h2>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Суммы с учётом долей</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${earningsSummary.weekly.net >= 10000 ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' : 'border-amber-500/20 bg-amber-500/5 text-amber-500'}`}>
                      {earningsSummary.weekly.net >= 10000 ? 'Вывод доступен' : 'Ожидание порога'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Всего заработано', value: earningsSummary.total, icon: <TrendingUp className="w-3 h-3" /> },
                      { label: 'Отправлено в пул', value: earningsSummary.pool, icon: <PiggyBank className="w-3 h-3" /> },
                      { label: 'Чистыми', value: earningsSummary.net, icon: <Wallet className="w-3 h-3" /> },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`p-4 rounded-xl border shadow-sm ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-2 mb-2 opacity-70">
                          {item.icon}
                          <p className="text-[9px] font-black uppercase tracking-widest">{item.label}</p>
                        </div>
                        <p className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{Math.round(item.value).toLocaleString('ru-RU')} ₽</p>
                      </div>
                    ))}
                  </div>

                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'border-white/5 bg-emerald-500/5' : 'border-emerald-100 bg-emerald-50/50'} flex flex-col gap-4`}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <p className={`text-xs font-black uppercase tracking-wider ${theme === 'dark' ? 'text-emerald-500/80' : 'text-emerald-700'}`}>Активная неделя</p>
                        <p className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Пн, Ср, Пт, Сб — дни вывода</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${earningsSummary.weekly.net >= 10000 ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500' : 'border-amber-500/20 bg-amber-500/10 text-amber-500'}`}>
                        {earningsSummary.weekly.net >= 10000 ? 'Доступно к выводу' : 'Перенос суммы'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Заработано', value: earningsSummary.weekly.gross },
                        { label: 'В пул', value: earningsSummary.weekly.pool },
                        { label: 'Чистыми', value: earningsSummary.weekly.net },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-white/80 bg-white/80'} shadow-sm`}
                        >
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-70">{item.label}</p>
                          <p className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{Math.round(item.value).toLocaleString('ru-RU')} ₽</p>
                        </div>
                      ))}
                    </div>
                    {earningsSummary.weekly.net < 10000 && (
                      <p className={`text-[10px] font-medium ${theme === 'dark' ? 'text-amber-500/80' : 'text-amber-700'}`}>
                        Менее 10 000 ₽ чистыми — вывод недоступен, сумма переносится.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {rating && ratingBreakdown && (
                <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/5 bg-[#1a1a1a]' : 'border-gray-200 bg-white'} shadow flex-1`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className={`text-sm font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Рейтинг</h2>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Еженедельная оценка</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/20 bg-purple-500/5 text-purple-500`}>
                      {rating.rating.toFixed(1)}%
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-gray-50'} mb-6`}>
                    <div className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{rating.rating.toFixed(1)}%</div>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                      {rating.rating >= 70 ? 'Отличный результат' : rating.rating >= 50 ? 'Хороший темп' : 'Требуется усиление показателей'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[{ label: 'Выходные', value: `${ratingBreakdown.daysOff} дн`, pts: ratingBreakdown.daysOffPoints, classes: theme === 'dark' ? 'bg-slate-500/5 border-slate-500/10 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600' },
                    { label: 'Больничные', value: `${rating.sickDays} дн`, pts: ratingBreakdown.sickDaysPoints, classes: theme === 'dark' ? 'bg-amber-500/5 border-amber-500/10 text-amber-500' : 'bg-amber-50 border-amber-100 text-amber-600' },
                    { label: 'Отпуск', value: `${rating.vacationDays} дн`, pts: ratingBreakdown.vacationDaysPoints, classes: theme === 'dark' ? 'bg-orange-500/5 border-orange-500/10 text-orange-500' : 'bg-orange-50 border-orange-100 text-orange-600' },
                    { label: 'Часы', value: `${ratingBreakdown.weeklyHours.toFixed(1)} ч`, pts: ratingBreakdown.weeklyHoursPoints, classes: theme === 'dark' ? 'bg-blue-500/5 border-blue-500/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600' },
                    { label: 'Заработок', value: `${(ratingBreakdown.weeklyEarnings / 1000).toFixed(1)}k ₽`, pts: ratingBreakdown.weeklyEarningsPoints, classes: theme === 'dark' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600' },
                    { label: 'Рефералы', value: `${rating.referrals}`, pts: ratingBreakdown.referralsPoints, classes: theme === 'dark' ? 'bg-purple-500/5 border-purple-500/10 text-purple-400' : 'bg-purple-50 border-purple-100 text-purple-600' }].map(item => (
                      <div key={item.label} className={`p-3 rounded-xl border shadow-sm transition-all hover:scale-[1.02] ${item.classes}`}>
                        <div className="text-[8px] font-black uppercase tracking-widest opacity-80 mb-1">{item.label}</div>
                        <div className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.value}</div>
                        <div className={`text-[10px] font-black mt-1`}>{item.pts.toFixed(1)}%</div>
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

          <div className={`rounded-2xl p-6 border ${theme === 'dark' ? 'border-white/5 bg-[#1a1a1a]' : 'border-gray-200 bg-white'} shadow`}>
            <button
              onClick={handleLogout}
              className={`w-full px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${theme === 'dark'
                ? 'bg-rose-500/5 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white'
                : 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white'
                }`}
            >
              <LogOut className="w-5 h-5" />
              <span>Выйти из аккаунта</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
