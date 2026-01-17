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
  Plus,
  Lock,
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              label: 'Рейтинг (КПД)',
              value: rating ? `${rating.rating.toFixed(1)}%` : '—',
              note: rating?.rating && rating.rating >= 70 ? 'High Perf' : 'Low Perf',
              icon: <Zap className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />,
              bgClass: 'bg-amber-500/5',
              borderClass: 'border-amber-500/10'
            },
            {
              label: 'Задачи',
              value: inProgressTasks,
              note: `${tasks.length} total`,
              icon: <CheckSquare className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />,
              bgClass: 'bg-blue-500/5',
              borderClass: 'border-blue-500/10'
            },
            {
              label: 'Weekly',
              value: earningsSummary ? `${Math.round(earningsSummary.weekly.net).toLocaleString()} ₽` : '0 ₽',
              note: earningsSummary?.weekly.net && earningsSummary.weekly.net >= 10000 ? 'Ready' : 'Pending',
              icon: <Wallet className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />,
              bgClass: 'bg-emerald-500/5',
              borderClass: 'border-emerald-500/10'
            },
            {
              label: 'Статус',
              value: isAdmin ? 'Admin' : 'Member',
              note: 'Verified',
              icon: <Shield className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />,
              bgClass: 'bg-purple-500/5',
              borderClass: 'border-purple-500/10'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-2xl p-4 md:p-5 border transition-all duration-300 hover:shadow-2xl group ${theme === 'dark'
                ? `backdrop-blur-xl ${item.bgClass} ${item.borderClass} hover:border-white/20`
                : 'bg-white border-gray-100 hover:border-[#4E6E49]/20 shadow-sm'
                }`}
            >
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                <div className={`p-1.5 md:p-2 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                  {item.icon}
                </div>
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <div className={`text-xl md:text-3xl font-black tracking-tighter font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {item.value}
                </div>
                <div className={`text-[9px] md:text-[11px] font-black uppercase tracking-tight ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
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
              <div className={`rounded-3xl p-6 md:p-8 border transition-all duration-500 ${theme === 'dark' ? 'border-white/5 bg-[#1a1a1a]/60 backdrop-blur-2xl shadow-2xl' : 'border-gray-200 bg-white'} shadow flex-1 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4E6E49]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#4E6E49]/10 transition-colors" />
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-[#4E6E49]/15 text-[#4E6E49] border border-[#4E6E49]/20' : 'bg-[#4E6E49]/5 text-[#4E6E49]'}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Identity</h2>
                    <p className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>User Protocol</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/10' : 'border-gray-100 bg-gray-50'}`}>
                      <p className={`text-[9px] font-black uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Legal Name</p>
                      <p className={`mt-1 text-base font-black tracking-tight ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{userData.name}</p>
                    </div>
                    <div className={`p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/10' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-[9px] font-black uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Alias</p>
                        {!isEditingNickname && user && !isAdmin && (
                          <button
                            onClick={async () => {
                              setIsEditingNickname(true)
                              setNewNickname(nickname || '')
                            }}
                            className={`text-[8px] px-2 py-0.5 rounded-md border transition-all font-black uppercase tracking-wider ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10 text-white' : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'}`}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      {isEditingNickname ? (
                        <div className="space-y-2 mt-1">
                          <input
                            type="text"
                            value={newNickname}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNickname(e.target.value)}
                            placeholder="New alias"
                            className={`w-full px-3 py-1.5 rounded-xl border font-mono ${theme === 'dark' ? 'border-white/10 bg-black/40 text-white' : 'border-gray-200 bg-white text-gray-900'} text-xs`}
                            disabled={nicknameRequestPending}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleRequestNicknameChange}
                              disabled={nicknameRequestPending || !newNickname.trim()}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${nicknameRequestPending || !newNickname.trim()
                                ? 'opacity-50 cursor-not-allowed'
                                : 'bg-[#4E6E49] text-white hover:bg-[#3d5639] shadow-lg shadow-[#4E6E49]/20'
                                }`}
                            >
                              Sync
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingNickname(false)
                                setNewNickname('')
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:border-white/10 text-white' : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'}`}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className={`mt-1 text-base font-black tracking-tight ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {user?.id ? <UserNickname userId={user.id} /> : '—'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/10' : 'border-gray-100 bg-gray-50'}`}>
                    <p className={`text-[9px] font-black uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Terminal Access (Login)</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className={`text-xl font-black font-mono tracking-tighter ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'}`}>{userData.login}</p>
                      <button
                        onClick={handleCopyLogin}
                        className={`p-2 rounded-xl border transition-all ${loginCopied ? 'bg-[#4E6E49] text-white border-[#4E6E49]' : theme === 'dark' ? 'border-white/10 bg-white/5 hover:border-white/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        title="Copy Login"
                      >
                        {loginCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-[9px] font-black uppercase tracking-[0.15em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} block px-1`}>Secure Hash (Password)</label>
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 px-4 py-3 rounded-2xl border font-mono text-sm tracking-widest ${theme === 'dark' ? 'border-white/5 bg-black/40 text-gray-400' : 'border-gray-200 bg-white text-gray-900'}`}>
                        {showPassword ? userData.password : '••••••••'}
                      </div>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className={`p-3 rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-black/40 hover:border-white/20' : 'border-gray-200 bg-white hover:border-gray-300'} transition-all`}
                        title={showPassword ? 'Hide' : 'Reveal'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={handleCopyPassword}
                        className={`p-3 rounded-2xl border transition-all ${passwordCopied ? 'bg-[#4E6E49] text-white border-[#4E6E49]' : theme === 'dark' ? 'border-white/10 bg-black/40 hover:border-white/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        title="Copy Password"
                      >
                        {passwordCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-3xl p-6 md:p-8 border transition-all duration-500 ${theme === 'dark' ? 'border-white/5 bg-[#1a1a1a]/60 backdrop-blur-2xl shadow-2xl' : 'border-gray-200 bg-white'} shadow flex-1 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'bg-blue-500/5 text-blue-600'}`}>
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Assignments</h2>
                    <p className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Task Matrix</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {[{ label: 'Active', value: inProgressTasks, color: 'text-blue-400' },
                  { label: 'Done', value: completedTasks, color: 'text-emerald-400' },
                  { label: 'Closed', value: closedTasks, color: 'text-gray-400' },
                  { label: 'Total', value: tasks.length, color: 'text-purple-400' }].map(({ label, value, color }) => (
                    <div key={label} className={`p-4 rounded-2xl border ${theme === 'dark' ? 'border-white/5 bg-black/40' : 'bg-gray-50 border-gray-100'} transition-all hover:scale-[1.05]`}>
                      <div className="text-[8px] font-black uppercase tracking-widest mb-2 opacity-50">{label}</div>
                      <div className={`text-xl font-black font-mono ${color}`}>{value}</div>
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
                <div className="mt-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10' : 'bg-[#4E6E49]/5'}`}>
                      <StickyNote className="w-4 h-4 text-[#4E6E49]" />
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Memo Buffer</p>
                  </div>
                  <div className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'border-white/5 bg-black/40' : 'border-gray-100 bg-gray-50'}`}>
                    <div className="grid gap-4 mb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                        <input
                          type="text"
                          value={noteDraft.title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoteDraft({ ...noteDraft, title: e.target.value })}
                          placeholder="Note Header..."
                          className={`px-4 py-2.5 rounded-xl border font-mono tracking-tight ${theme === 'dark' ? 'border-white/10 bg-black/60 text-white placeholder:text-gray-600' : 'border-gray-200 bg-white text-gray-900'} text-xs focus:border-[#4E6E49]/50 outline-none transition-all`}
                        />
                        <div className="flex gap-1.5 p-1 bg-black/20 rounded-xl border border-white/5">
                          {(['low', 'medium', 'high'] as const).map((p) => (
                            <button
                              key={p}
                              onClick={() => setNoteDraft({ ...noteDraft, priority: p })}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${noteDraft.priority === p
                                ? p === 'high' ? 'bg-red-500 text-white' : p === 'medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                                : theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <textarea
                          value={noteDraft.text}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNoteDraft({ ...noteDraft, text: e.target.value })}
                          placeholder="Encrypt message content here..."
                          className={`flex-1 px-4 py-3 rounded-xl border font-mono text-xs resize-none h-24 ${theme === 'dark' ? 'border-white/10 bg-black/60 text-white placeholder:text-gray-600' : 'border-gray-200 bg-white text-gray-900'} focus:border-[#4E6E49]/50 outline-none transition-all`}
                        />
                        <button
                          onClick={handleSaveNote}
                          className={`px-5 rounded-xl bg-[#4E6E49] text-white hover:bg-[#3d5639] transition-all flex items-center justify-center shadow-lg shadow-[#4E6E49]/20 active:scale-95`}
                          title="Commit Note"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      {notes.map((note: Note) => (
                        <div
                          key={note.id}
                          className={`p-4 rounded-2xl border flex flex-col gap-2 relative group overflow-hidden transition-all hover:border-white/20 ${theme === 'dark' ? 'border-white/5 bg-black/40' : 'border-gray-200 bg-white shadow-sm'}`}
                        >
                          <div className={`absolute top-0 left-0 w-1.5 h-full ${note.priority === 'high' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : note.priority === 'medium' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`} />
                          <div className="flex items-start justify-between gap-4">
                            <p className={`text-xs font-black uppercase tracking-wider truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{note.title}</p>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEditNote(note.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[#4E6E49]/10 text-[#4E6E49]"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10 text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className={`text-[11px] leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} line-clamp-3`}>{note.text}</p>
                          <div className="flex items-center justify-between mt-auto pt-2 opacity-30 group-hover:opacity-100 transition-opacity">
                            <p className="text-[9px] font-black font-mono uppercase tracking-widest text-gray-500 italic">
                              {formatDate(new Date(note.createdAt), 'dd.MM.yy HH:mm')}
                            </p>
                            <Lock className="w-3 h-3 text-gray-500" />
                          </div>
                        </div>
                      ))}
                    </div>
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
            </div>

            <div className="space-y-4 flex flex-col">
              {earningsSummary && (
                <div className={`rounded-3xl p-6 md:p-8 border transition-all duration-500 ${theme === 'dark' ? 'border-white/5 bg-[#1a1a1a]/60 backdrop-blur-2xl shadow-2xl' : 'border-gray-200 bg-white'} shadow flex-1 relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600'}`}>
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Revenue</h2>
                        <p className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Node Profits</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${earningsSummary.weekly.net >= 10000 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10' : 'border-amber-500/30 bg-amber-500/10 text-amber-500'}`}>
                      {earningsSummary.weekly.net >= 10000 ? 'Claimable' : 'Accumulating'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                      { label: 'Total Revenue', value: earningsSummary.total, icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
                      { label: 'Pool Shares', value: earningsSummary.pool, icon: <PiggyBank className="w-4 h-4 text-purple-400" /> },
                      { label: 'Net Profit', value: earningsSummary.net, icon: <Wallet className="w-4 h-4 text-blue-400" /> },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`p-5 rounded-2xl border transition-all ${theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/10' : 'border-gray-100 bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-2 mb-3 opacity-50">
                          {item.icon}
                          <p className="text-[9px] font-black uppercase tracking-widest">{item.label}</p>
                        </div>
                        <p className={`text-xl font-black font-mono tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{Math.round(item.value).toLocaleString('ru-RU')} <span className="text-xs opacity-50">₽</span></p>
                      </div>
                    ))}
                  </div>

                  <div className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500/10' : 'border-emerald-100 bg-emerald-50/50'} flex flex-col gap-5`}>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-emerald-500/80' : 'text-emerald-700'}`}>Active Epoch</p>
                        <p className={`text-[11px] font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Sync Schedule: Mon, Wed, Fri, Sat</p>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-sm ${earningsSummary.weekly.net >= 10000 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/30 bg-amber-500/10 text-amber-500'}`}>
                        {earningsSummary.weekly.net >= 10000 ? 'Ready to bridge' : 'Threshold pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'Epoch Gross', value: earningsSummary.weekly.gross },
                        { label: 'Epoch Pool', value: earningsSummary.weekly.pool },
                        { label: 'Epoch Net', value: earningsSummary.weekly.net },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`p-4 rounded-xl border transition-all ${theme === 'dark' ? 'border-white/5 bg-black/20 hover:border-white/10' : 'border-white/80 bg-white/80'}`}
                        >
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">{item.label}</p>
                          <p className={`text-base font-black font-mono tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{Math.round(item.value).toLocaleString('ru-RU')} ₽</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {rating && ratingBreakdown && (
                <div className={`rounded-3xl p-6 md:p-8 border transition-all duration-500 ${theme === 'dark' ? 'border-white/5 bg-[#1a1a1a]/60 backdrop-blur-2xl shadow-2xl' : 'border-gray-200 bg-white'} shadow flex-1 relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-purple-500/10 transition-colors" />
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' : 'bg-purple-50 text-purple-600'}`}>
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className={`text-xs font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Performance</h2>
                        <p className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Network Rating</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-500/30 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/10`}>
                      {rating.rating.toFixed(1)}%
                    </div>
                  </div>

                  <div className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/10' : 'border-gray-100 bg-gray-50'} mb-8 relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
                    <div className={`text-5xl font-black font-mono tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{rating.rating.toFixed(1)}<span className="text-xl opacity-30">%</span></div>
                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-black uppercase tracking-widest`}>
                      {rating.rating >= 70 ? 'Optimal Performance' : rating.rating >= 50 ? 'Stable Operation' : 'Critical Warning'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[{ label: 'Days Off', value: `${ratingBreakdown.daysOff} D`, pts: ratingBreakdown.daysOffPoints, color: 'text-slate-400', bg: 'bg-slate-500/10' },
                    { label: 'Sick Lvl', value: `${rating.sickDays} D`, pts: ratingBreakdown.sickDaysPoints, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Vacation', value: `${rating.vacationDays} D`, pts: ratingBreakdown.vacationDaysPoints, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    { label: 'Uptime', value: `${ratingBreakdown.weeklyHours.toFixed(1)} H`, pts: ratingBreakdown.weeklyHoursPoints, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Yield', value: `${(ratingBreakdown.weeklyEarnings / 1000).toFixed(1)}K`, pts: ratingBreakdown.weeklyEarningsPoints, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Referrals', value: `${rating.referrals}`, pts: ratingBreakdown.referralsPoints, color: 'text-purple-400', bg: 'bg-purple-500/10' }].map(item => (
                      <div key={item.label} className={`p-4 rounded-2xl border transition-all hover:scale-[1.05] ${theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/10' : 'bg-white border-gray-100'}`}>
                        <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">{item.label}</div>
                        <div className={`text-sm font-black font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.value}</div>
                        <div className={`text-[10px] font-black mt-2 ${item.color} flex items-center gap-1`}>
                          <div className={`w-1 h-3 rounded-full ${item.bg.replace('/10', '/30')}`} />
                          {item.pts.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-8 p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'border-white/5 bg-black/40 hover:border-white/10' : 'border-gray-100 bg-gray-50/50'}`}>
                    <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-3 flex items-center gap-2`}>
                      <Info className="w-4 h-4" />
                      Rating Algorithm
                    </h3>
                    <p className={`text-[11px] leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Calculation based on 7 node parameters: attendance, illness protocols, vacation logs, operational hours, yield metrics, referral network, and communications. Maximum efficiency: 100%.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
