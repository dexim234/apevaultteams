// Management page - main component for managing slots, days off, sick leave, and vacation
import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { ManagementTable } from '@/components/Management/ManagementTable'
import { ManagementWeekView } from '@/components/Management/ManagementWeekView'
import { SlotForm } from '@/components/Management/SlotForm'
import { DayStatusForm } from '@/components/Management/DayStatusForm'
import {
  Calendar,
  Table2,
  Clock,
  CalendarCheck,
  PlusCircle,
  Trash2,
  Moon,
  HeartPulse,
  Plane,
  Users,
  Timer,
  Hourglass,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { TEAM_MEMBERS } from '@/types'
import { DeleteSlotsForm } from '@/components/Management/DeleteSlotsForm'
import { getWorkSlots, getDayStatuses } from '@/services/firestoreService'
import { getWeekDays, formatDate } from '@/utils/dateUtils'

type ViewMode = 'table' | 'week'
export type SlotFilter = 'all' | 'upcoming' | 'completed'
type ActionType = 'add-slot' | 'delete-slots' | 'dayoff' | 'sick' | 'vacation'

export const Management = () => {
  const { theme } = useThemeStore()
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [slotFilter, setSlotFilter] = useState<SlotFilter>('all')
  const [showSlotForm, setShowSlotForm] = useState(false)
  const [showDeleteSlotsForm, setShowDeleteSlotsForm] = useState(false)
  const [showStatusForm, setShowStatusForm] = useState(false)
  const [statusType, setStatusType] = useState<'dayoff' | 'sick' | 'vacation' | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [editingSlot, setEditingSlot] = useState<any>(null)
  const [editingStatus, setEditingStatus] = useState<any>(null)
  const [actionType, setActionType] = useState<ActionType>('add-slot')
  const [refreshKey, setRefreshKey] = useState(0)
  const [stats, setStats] = useState({
    slotsThisWeek: 0,
    activeMembers: 0,
    upcomingSlots: 0,
    completedSlots: 0,
    recommendedWeek: 0,
    recommendedDay: 0,
    mostActive: '',
    leastActive: [] as string[],
    remainingSlots: 0,
    todaySlots: 0,
  })

  const [timeAnchors, setTimeAnchors] = useState<{ nextStart: Date | null; activeEnd: Date | null }>({
    nextStart: null,
    activeEnd: null,
  })
  const [timerLabels, setTimerLabels] = useState<{ nextStart: string; activeRemaining: string }>({
    nextStart: '—',
    activeRemaining: '—',
  })

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    const buildLabel = (target: Date | null, isCountdownToEnd: boolean) => {
      if (!target) return '—'
      const diffMs = target.getTime() - Date.now()
      if (diffMs <= 0) return isCountdownToEnd ? 'Слот завершён' : 'Уже начался'

      const totalMinutes = Math.floor(diffMs / 60000)
      const days = Math.floor(totalMinutes / (60 * 24))
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
      const minutes = totalMinutes % 60

      if (days > 0) return `${days}д ${hours}ч`
      if (hours > 0) return `${hours}ч ${minutes}м`
      return `${Math.max(minutes, 1)}м`
    }

    const updateTimers = () => {
      setTimerLabels({
        nextStart: buildLabel(timeAnchors.nextStart, false),
        activeRemaining: buildLabel(timeAnchors.activeEnd, true),
      })
    }

    updateTimers()
    const intervalId = setInterval(updateTimers, 60_000)
    return () => clearInterval(intervalId)
  }, [timeAnchors])

  const isSlotUpcoming = (slot: any): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const slotDate = new Date(slot.date)
    slotDate.setHours(0, 0, 0, 0)
    
    // If slot date is in the future, it's upcoming
    if (slotDate > today) return true
    
    // If slot date is today, check if any slot time hasn't ended yet
    if (slotDate.getTime() === today.getTime()) {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes() // minutes since midnight
      
      // Check if any slot hasn't ended yet
      return slot.slots.some((s: any) => {
        // If slot crosses midnight (has endDate), check endDate instead
        if (s.endDate) {
          const endDate = new Date(s.endDate)
          endDate.setHours(0, 0, 0, 0)
          
          // If endDate is in the future, slot is upcoming
          if (endDate > today) return true
          
          // If endDate is today, check if end time hasn't passed
          if (endDate.getTime() === today.getTime()) {
            const [endHour, endMin] = s.end.split(':').map(Number)
            const endTime = endHour * 60 + endMin
            return endTime > currentTime
          }
          
          return false
        }
        
        // Regular same-day slot
        const [endHour, endMin] = s.end.split(':').map(Number)
        const endTime = endHour * 60 + endMin
        return endTime > currentTime
      })
    }
    
    // Check if slot has endDate in the future
    const hasFutureEndDate = slot.slots.some((s: any) => {
      if (s.endDate) {
        const endDate = new Date(s.endDate)
        endDate.setHours(0, 0, 0, 0)
        return endDate >= today
      }
      return false
    })
    
    return hasFutureEndDate
  }

  const nicknameMap: Record<string, string> = {
    '1': 'Dex',
    '2': 'Merc',
    '3': 'Xenia',
    '4': 'Olenka',
    '5': 'Sydney',
  }

  const legacyIdMap: Record<string, string> = {
    artyom: '1',
    adel: '2',
    kseniya: '3',
    olga: '4',
    anastasia: '5',
  }

  const getMemberName = (userId: string) => {
    const member = TEAM_MEMBERS.find((m) => m.id === userId) || TEAM_MEMBERS.find((m) => legacyIdMap[userId] === m.id)
    return nicknameMap[member?.id || userId] || member?.name || userId
  }

  const loadStats = async () => {
    try {
      const now = new Date()
      const weekDays = getWeekDays(now)
      const weekStart = formatDate(weekDays[0], 'yyyy-MM-dd')
      const weekEnd = formatDate(weekDays[6], 'yyyy-MM-dd')
      const todayStr = formatDate(now, 'yyyy-MM-dd')

      const [allSlots, allStatuses] = await Promise.all([getWorkSlots(), getDayStatuses()])

      const weekSlots = allSlots.filter((s) => s.date >= weekStart && s.date <= weekEnd)
      const todaySlots = allSlots.filter((s) => s.date === todayStr)
      const uniqueMembers = new Set([
        ...weekSlots.flatMap((s) => [s.userId, ...(s.participants || [])]),
        ...allStatuses.map((s) => s.userId),
      ])

      const upcomingSlots = weekSlots.filter(isSlotUpcoming).length
      const completedSlots = weekSlots.length - upcomingSlots

      const recommendedWeek = Math.max(0, 15 - weekSlots.length)
      const recommendedDay = Math.max(0, 3 - todaySlots.length)

      const memberCounts: Record<string, number> = {}
      TEAM_MEMBERS.forEach((m) => {
        memberCounts[m.id] = 0
      })
      weekSlots.forEach((s) => {
        const involved = new Set([s.userId, ...(s.participants || [])])
        involved.forEach((id) => {
          if (memberCounts[id] !== undefined) {
            memberCounts[id] = (memberCounts[id] || 0) + 1
          }
        })
      })

      const sortedMembers = Object.entries(memberCounts).sort((a, b) => b[1] - a[1])
      const mostActive = sortedMembers[0]?.[1] ? getMemberName(sortedMembers[0][0]) : 'Нет данных'
      const minCount = Math.min(...Object.values(memberCounts))
      const leastActive = Object.entries(memberCounts)
        .filter(([, count]) => count === minCount)
        .map(([id]) => getMemberName(id))
        .slice(0, 3)

      const intervals = allSlots.flatMap((slot) => {
        const slotDate = slot.date
        return (slot.slots || []).map((s: any) => {
          const start = new Date(`${slotDate}T${s.start}`)
          let end = s.endDate ? new Date(`${s.endDate}T${s.end}`) : new Date(`${slotDate}T${s.end}`)

          if (!s.endDate && end.getTime() <= start.getTime()) {
            const nextDay = new Date(slotDate)
            nextDay.setDate(nextDay.getDate() + 1)
            end = new Date(`${formatDate(nextDay, 'yyyy-MM-dd')}T${s.end}`)
          }

          return { start, end }
        })
      })

      const activeIntervals = intervals.filter((i) => now >= i.start && now <= i.end)
      const activeEnd = activeIntervals.length
        ? new Date(Math.min(...activeIntervals.map((i) => i.end.getTime())))
        : null

      const upcomingIntervals = intervals
        .filter((i) => i.start > now)
        .sort((a, b) => a.start.getTime() - b.start.getTime())
      const nextStart = upcomingIntervals[0]?.start || null

      setStats({
        slotsThisWeek: weekSlots.length,
        activeMembers: uniqueMembers.size,
        upcomingSlots,
        completedSlots,
        recommendedWeek,
        recommendedDay,
        mostActive,
        leastActive,
        remainingSlots: upcomingSlots,
        todaySlots: todaySlots.length,
      })
      setTimeAnchors({ nextStart, activeEnd })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleAddSlot = () => {
    setEditingSlot(null)
    setShowSlotForm(true)
  }

  const handleEditSlot = (slot: any) => {
    setEditingSlot(slot)
    setShowSlotForm(true)
  }

  const handleAddStatus = (type: 'dayoff' | 'sick' | 'vacation') => {
    setStatusType(type)
    setEditingStatus(null)
    setShowStatusForm(true)
  }

  const handleEditStatus = (status: any) => {
    setEditingStatus(status)
    setStatusType(status.type)
    setShowStatusForm(true)
  }

  const handleDeleteSlots = () => {
    setShowDeleteSlotsForm(true)
  }

  const handleFormClose = () => {
    setShowSlotForm(false)
    setShowDeleteSlotsForm(false)
    setShowStatusForm(false)
    setStatusType(null)
    setEditingSlot(null)
    setEditingStatus(null)
    loadStats()
    setRefreshKey((key) => key + 1)
  }

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const cardBg = theme === 'dark'
    ? 'border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]'
    : 'border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white'
  const sectionCardClass = `rounded-2xl p-4 sm:p-6 md:p-8 border-2 ${cardBg}`
  const surfaceCardClass = `rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`
  const softTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const contentCardClass = `rounded-2xl p-4 sm:p-5 border-2 ${cardBg}`
  const statToneMap: Record<string, { bg: string; text: string; border: string }> = {
    emerald: {
      bg: theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50',
      text: theme === 'dark' ? 'text-emerald-100' : 'text-emerald-800',
      border: theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-200',
    },
    purple: {
      bg: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50',
      text: theme === 'dark' ? 'text-purple-100' : 'text-purple-800',
      border: theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200',
    },
    amber: {
      bg: theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50',
      text: theme === 'dark' ? 'text-amber-100' : 'text-amber-800',
      border: theme === 'dark' ? 'border-amber-500/30' : 'border-amber-200',
    },
    slate: {
      bg: theme === 'dark' ? 'bg-gray-500/10' : 'bg-gray-50',
      text: theme === 'dark' ? 'text-gray-100' : 'text-gray-800',
      border: theme === 'dark' ? 'border-gray-500/30' : 'border-gray-200',
    },
    blue: {
      bg: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50',
      text: theme === 'dark' ? 'text-blue-100' : 'text-blue-800',
      border: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-200',
    },
    green: {
      bg: theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
      text: theme === 'dark' ? 'text-green-100' : 'text-green-800',
      border: theme === 'dark' ? 'border-green-500/30' : 'border-green-200',
    },
    sky: {
      bg: theme === 'dark' ? 'bg-sky-500/10' : 'bg-sky-50',
      text: theme === 'dark' ? 'text-sky-100' : 'text-sky-800',
      border: theme === 'dark' ? 'border-sky-500/30' : 'border-sky-200',
    },
    pink: {
      bg: theme === 'dark' ? 'bg-pink-500/10' : 'bg-pink-50',
      text: theme === 'dark' ? 'text-pink-100' : 'text-pink-800',
      border: theme === 'dark' ? 'border-pink-500/30' : 'border-pink-200',
    },
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  const statCards = [
    {
      label: 'Сколько ещё добавить слотов',
      value: `${Math.max(stats.recommendedDay, 0)} в день`,
      note: `Неделя: ${Math.max(stats.recommendedWeek, 0)} до цели 15`,
      icon: <ArrowUpRight className="w-4 h-4" />,
      tone: 'emerald',
    },
    {
      label: 'Активные члены',
      value: stats.activeMembers,
      note: 'за неделю',
      icon: <Users className="w-4 h-4" />,
      tone: 'purple',
    },
    {
      label: 'Самый активный член недели',
      value: stats.mostActive || 'Нет данных',
      note: 'по слотам',
      icon: <Activity className="w-4 h-4" />,
      tone: 'amber',
    },
    {
      label: 'Самые неактивные члены недели',
      value: stats.leastActive.length ? stats.leastActive.join(', ') : 'Нет данных',
      note: 'минимум слотов',
      icon: <ArrowDownRight className="w-4 h-4" />,
      tone: 'slate',
    },
    {
      label: 'Осталось слотов на неделе',
      value: stats.remainingSlots,
      note: 'предстоящие',
      icon: <Hourglass className="w-4 h-4" />,
      tone: 'blue',
    },
    {
      label: 'Завершено слотов на неделе',
      value: stats.completedSlots,
      note: 'факт',
      icon: <CalendarCheck className="w-4 h-4" />,
      tone: 'green',
    },
    {
      label: 'Таймер ближайшего слота',
      value: timerLabels.nextStart,
      note: 'до старта',
      icon: <Timer className="w-4 h-4" />,
      tone: 'sky',
    },
    {
      label: 'До окончания активного слота',
      value: timerLabels.activeRemaining,
      note: 'если слот идёт',
      icon: <Clock className="w-4 h-4" />,
      tone: 'pink',
    },
  ]


  return (
    <Layout>
      <div className="space-y-5 sm:space-y-7">
        {/* Hero */}
        <div
          id="schedule-overview"
          className={`relative overflow-hidden ${sectionCardClass} p-5 sm:p-6 md:p-8 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#0e1b2c] via-[#0c1827] to-[#0a1420]'
              : 'bg-gradient-to-br from-white via-emerald-50/40 to-sky-50'
          }`}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -left-16 w-80 h-80 bg-gradient-to-br from-[#4E6E49]/18 via-sky-500/8 to-transparent blur-3xl" />
            <div className="absolute top-0 right-0 w-[26rem] h-[26rem] bg-gradient-to-bl from-sky-400/14 via-emerald-400/12 to-transparent blur-3xl" />
            <div className="absolute bottom-[-140px] left-14 w-80 h-80 bg-gradient-to-tr from-sky-300/12 via-[#4E6E49]/12 to-transparent blur-3xl" />
          </div>
          <div className="relative z-10 grid grid-cols-1 gap-5">
            <div className={`${surfaceCardClass} backdrop-blur p-4 sm:p-5 space-y-4`}>
              <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg">
                    <CalendarCheck className="w-6 h-6 text-[#4E6E49]" />
                  </div>
                  <div className="flex items-center">
                    <h1 className={`text-xl sm:text-3xl font-extrabold leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <span className="sm:inline hidden">Расписание команды</span>
                      <span className="sm:hidden inline">Расписание</span>
                    </h1>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {statCards.map((item) => {
                  const tone = statToneMap[item.tone]
                  return (
                    <div
                      key={item.label}
                      className={`p-4 rounded-xl border-2 ${tone.border} ${tone.bg} shadow-sm space-y-2`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wide ${tone.text}`}>
                          {item.label}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border ${tone.border} ${tone.text} ${
                            theme === 'dark' ? 'bg-white/5' : 'bg-white/80'
                          }`}
                        >
                          {item.icon}
                        </span>
                      </div>
                      <p className={`text-lg sm:text-2xl font-extrabold ${headingColor}`}>
                        {item.value}
                      </p>
                      <p className={`text-xs ${softTextColor}`}>{item.note}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          id="schedule-actions"
          className={`${sectionCardClass} p-4 sm:p-5 space-y-5`}
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 lg:justify-between">
              <div className={`flex items-center gap-2 rounded-xl border ${theme === 'dark' ? 'border-gray-800 bg-gray-900/70' : 'border-gray-200 bg-gray-50'} px-1.5 py-1 shrink-0`}>
                <button
                  onClick={() => handleViewModeChange('table')}
                  className={`px-3 sm:px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all rounded-lg ${
                    viewMode === 'table'
                      ? 'bg-[#4E6E49] text-white shadow-lg'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  <Table2 className="w-4 h-4" />
                  Таблица
                </button>
                <button
                  onClick={() => handleViewModeChange('week')}
                  className={`px-3 sm:px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all rounded-lg ${
                    viewMode === 'week'
                      ? 'bg-[#4E6E49] text-white shadow-lg'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Неделя
                </button>
              </div>

              <div className="flex flex-wrap gap-2 shrink">
                {[
                  { key: 'all', label: 'Все', icon: <Calendar className="w-4 h-4" /> },
                  { key: 'upcoming', label: 'Предстоящие', icon: <Clock className="w-4 h-4" /> },
                  { key: 'completed', label: 'Завершённые', icon: <CalendarCheck className="w-4 h-4" /> },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setSlotFilter(f.key as SlotFilter)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border ${
                      slotFilter === f.key
                        ? 'bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white border-transparent shadow-lg'
                        : theme === 'dark'
                          ? 'border-gray-800 bg-gray-900/70 text-gray-200 hover:border-[#4E6E49]/40'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-[#4E6E49]/40'
                    }`}
                  >
                    {f.icon}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions block */}
          <div className={`${surfaceCardClass} p-3 sm:p-4 space-y-3`}>
            <div className="flex items-center justify-between">
              <p className={`text-sm font-semibold ${headingColor}`}>Действие</p>
              <span className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">выбор задачи</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { key: 'add-slot', label: 'Добавить слот', desc: 'Разовое или серия', icon: <PlusCircle className="w-5 h-5" />, tone: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800', action: handleAddSlot },
                { key: 'delete-slots', label: 'Удалить слоты', desc: 'Очистить интервалы', icon: <Trash2 className="w-5 h-5" />, tone: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-100 dark:border-rose-800', action: handleDeleteSlots },
                { key: 'dayoff', label: 'Выходной', desc: 'Отметить отдых', icon: <Moon className="w-5 h-5" />, tone: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-100 dark:border-teal-800', action: () => handleAddStatus('dayoff') },
                { key: 'sick', label: 'Больничный', desc: 'Подтвердить отсутствие', icon: <HeartPulse className="w-5 h-5" />, tone: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-700', action: () => handleAddStatus('sick') },
                { key: 'vacation', label: 'Отпуск', desc: 'Запланировать отпуск', icon: <Plane className="w-5 h-5" />, tone: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-100 dark:border-sky-800', action: () => handleAddStatus('vacation') },
              ].map((action) => (
                <button
                  key={action.key}
                  onClick={() => {
                    setActionType(action.key as ActionType)
                    action.action()
                  }}
                  className={`text-left rounded-xl border px-3 py-3 transition-all shadow-sm flex items-start gap-3 h-full ${
                    actionType === action.key
                      ? `${action.tone} ring-2 ring-[#4E6E49]/50 shadow-lg`
                      : `${theme === 'dark' ? 'border-gray-800 bg-gray-950/60 text-gray-100' : 'border-gray-200 bg-white text-gray-900'} hover:-translate-y-0.5 hover:shadow-md`
                  }`}
                >
                  <span className={`p-2 rounded-lg ${actionType === action.key ? 'bg-white/30' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {action.icon}
                  </span>
                  <span className="flex flex-col whitespace-normal leading-snug gap-0.5 w-full">
                    <span className="text-[13px] sm:text-sm font-semibold break-words leading-tight">{action.label}</span>
                    <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 break-words leading-tight">
                      {action.desc}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={`${surfaceCardClass} p-3 sm:p-4 space-y-2`}>
            <p className={`text-sm font-semibold ${headingColor}`}>Members</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedUserId(null)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition ${
                  selectedUserId === null
                    ? 'bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white border-transparent shadow-lg'
                    : theme === 'dark'
                    ? 'bg-gray-900/70 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#4E6E49]/40'
                }`}
              >
                Все Members
              </button>
              {TEAM_MEMBERS.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedUserId(member.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition flex items-center gap-2 ${
                    selectedUserId === member.id
                      ? 'bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white border-transparent shadow-lg'
                      : theme === 'dark'
                      ? 'bg-gray-900/70 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#4E6E49]/40'
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#4E6E49]/30 to-blue-500/30 text-xs font-bold">
                    {(nicknameMap[member.id] || member.name).charAt(0)}
                  </span>
                  {nicknameMap[member.id] || member.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content view */}
        <div id="schedule-view" className={contentCardClass}>
          <div className={`${surfaceCardClass} p-4 sm:p-5 flex flex-col gap-4`}>
            <div className="flex items-center justify-between flex-wrap gap-2 text-left">
              <div className="text-left">
                <p className={`text-sm sm:text-base font-semibold ${headingColor}`}>Расписание</p>
                <p className={`text-xs sm:text-sm ${labelColor}`}>Слоты и статусы за выбранную неделю</p>
              </div>
            </div>

            {viewMode === 'table' ? (
              <ManagementWeekView
                selectedUserId={selectedUserId}
                slotFilter={slotFilter}
                refreshKey={refreshKey}
                onEditSlot={handleEditSlot}
                onEditStatus={handleEditStatus}
              />
            ) : (
              <ManagementTable
                selectedUserId={selectedUserId}
                slotFilter={slotFilter}
                refreshKey={refreshKey}
                onEditSlot={handleEditSlot}
                onEditStatus={handleEditStatus}
              />
            )}
          </div>
        </div>

        {/* Forms */}
        {showSlotForm && (
          <SlotForm
            slot={editingSlot}
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )}

        {showDeleteSlotsForm && (
          <DeleteSlotsForm
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )}

        {showStatusForm && statusType && (
          <DayStatusForm
            type={statusType}
            status={editingStatus}
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )}
      </div>
    </Layout>
  )
}

