// Management page - main component for managing slots, days off, sick leave, and vacation
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { ManagementTable } from '@/components/Management/ManagementTable'
import { ManagementWeekView } from '@/components/Management/ManagementWeekView'
import { MemberSelector } from '@/components/Management/MemberSelector'
import { SlotForm } from '@/components/Management/SlotForm'
import { DayStatusForm } from '@/components/Management/DayStatusForm'
import {
  Calendar,
  Table2,
  Clock,
  CalendarCheck,
  PlusCircle,
  Trash2,
  Users,
  Timer,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  UserX,
  ShieldX,
  Hourglass,
} from 'lucide-react'
import { TEAM_MEMBERS } from '@/types'
import { DeleteSlotsForm } from '@/components/Management/DeleteSlotsForm'
import { RestrictionForm } from '@/components/Management/RestrictionForm'
import { UserConflictsForm } from '@/components/Management/UserConflictsForm'
import { AccessBlocksForm } from '@/components/Management/AccessBlocksForm'
import { getWorkSlots, getDayStatuses } from '@/services/firestoreService'
import { getWeekDays, formatDate, getMoscowTime } from '@/utils/dateUtils'

type ViewMode = 'table' | 'week'
export type SlotFilter = 'all' | 'upcoming' | 'completed'

export const Management = () => {
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const [viewMode, setViewMode] = useState<ViewMode>('table') // Default to table
  const [slotFilter] = useState<SlotFilter>('all')
  const [showSlotForm, setShowSlotForm] = useState(false)
  const [showDeleteSlotsForm, setShowDeleteSlotsForm] = useState(false)
  const [showStatusForm, setShowStatusForm] = useState(false)
  const [showRestrictionForm, setShowRestrictionForm] = useState(false)
  const [showConflictsForm, setShowConflictsForm] = useState(false)
  const [showAccessBlocksForm, setShowAccessBlocksForm] = useState(false)
  const [statusType, setStatusType] = useState<'dayoff' | 'sick' | 'vacation' | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [editingSlot, setEditingSlot] = useState<any>(null)
  const [editingStatus, setEditingStatus] = useState<any>(null)
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
    const moscowTime = getMoscowTime()
    const today = new Date(moscowTime)
    today.setHours(0, 0, 0, 0)
    const slotDate = new Date(slot.date)
    slotDate.setHours(0, 0, 0, 0)

    // If slot date is in the future, it's upcoming
    if (slotDate > today) return true

    // If slot date is today, check if any slot time hasn't ended yet
    if (slotDate.getTime() === today.getTime()) {
      const now = getMoscowTime()
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

    // Check if slot has endDate in the future or ends today but time hasn't passed
    const now = getMoscowTime()
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const hasActiveEndDate = slot.slots.some((s: any) => {
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
      return false
    })

    return hasActiveEndDate
  }

  const nicknameMap: Record<string, string> = {
    '1': 'Dex',
    '2': 'Enowk',
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

  const handleAddAbsence = () => {
    setStatusType(null)
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

  const handleManageRestrictions = () => {
    setShowRestrictionForm(true)
  }

  const handleManageConflicts = () => {
    setShowConflictsForm(true)
  }

  const handleManageAccessBlocks = () => {
    setShowAccessBlocksForm(true)
  }

  const handleFormClose = () => {
    setShowSlotForm(false)
    setShowDeleteSlotsForm(false)
    setShowStatusForm(false)
    setShowRestrictionForm(false)
    setShowConflictsForm(false)
    setShowAccessBlocksForm(false)
    setStatusType(null)
    setEditingSlot(null)
    setEditingStatus(null)
    loadStats()
    setRefreshKey((key) => key + 1)
  }



  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  const statCards = [
    {
      label: 'Сколько ещё добавить слотов',
      value: `${Math.max(stats.recommendedDay, 0)} в день`,
      note: `Неделя: ${Math.max(stats.recommendedWeek, 0)} до цели 15`,
      icon: <ArrowUpRight className="w-5 h-5 text-emerald-400" />,
      tone: 'emerald',
      bgClass: 'bg-emerald-500/5',
      borderClass: 'border-emerald-500/20'
    },
    {
      label: 'Сколько осталось слотов',
      value: stats.remainingSlots,
      note: 'предстоящие',
      icon: <Hourglass className="w-5 h-5 text-blue-400" />,
      tone: 'blue',
      bgClass: 'bg-blue-500/5',
      borderClass: 'border-blue-500/20'
    },
    {
      label: 'Активные члены',
      value: stats.activeMembers,
      note: 'за неделю',
      icon: <Users className="w-5 h-5 text-purple-400" />,
      tone: 'purple',
      bgClass: 'bg-purple-500/5',
      borderClass: 'border-purple-500/20'
    },
    {
      label: 'Завершено слотов на неделе',
      value: stats.completedSlots,
      note: 'факт',
      icon: <CalendarCheck className="w-5 h-5 text-emerald-400" />,
      tone: 'emerald',
      bgClass: 'bg-emerald-500/5',
      borderClass: 'border-emerald-500/20'
    },
    {
      label: 'Таймер ближайшего слота',
      value: timerLabels.nextStart,
      note: 'до старта',
      icon: <Timer className="w-5 h-5 text-sky-400" />,
      tone: 'sky',
      bgClass: 'bg-sky-500/5',
      borderClass: 'border-sky-500/20'
    },
    {
      label: 'До окончания активного слота',
      value: timerLabels.activeRemaining,
      note: 'если слот идёт',
      icon: <Clock className="w-5 h-5 text-pink-400" />,
      tone: 'pink',
      bgClass: 'bg-pink-500/5',
      borderClass: 'border-pink-500/20'
    },
    {
      label: 'Самый активный член недели',
      value: stats.mostActive || 'Нет данных',
      note: 'по слотам',
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      tone: 'amber',
      bgClass: 'bg-amber-500/5',
      borderClass: 'border-amber-500/20'
    },
    {
      label: 'Самые неактивные члены недели',
      value: stats.leastActive.length ? stats.leastActive.join(', ') : 'Нет данных',
      note: 'минимум слотов',
      icon: <ArrowDownRight className="w-5 h-5 text-slate-400" />,
      tone: 'slate',
      bgClass: 'bg-slate-500/5',
      borderClass: 'border-slate-500/20'
    },
  ]


  return (
    <div className="space-y-6 relative">
      {/* Header & Stats */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <CalendarCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                AVF Schedule
              </h1>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Управление сменами и активностью ApeVault Frontier
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
                  // @ts-ignore
                  ? `${item.bgClass} ${item.borderClass} hover:border-opacity-50`
                  : 'bg-white border-gray-100 hover:border-emerald-500/20'
                  }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                  <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                    {item.icon}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {item.value}
                  </div>
                  <div className={`text-[11px] font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {item.note}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls Toolbar */}
      <div className={`sticky top-4 z-40 p-2 rounded-2xl border shadow-xl backdrop-blur-xl ${theme === 'dark'
        ? 'bg-[#0b1015]/80 border-white/10'
        : 'bg-white/80 border-gray-200'
        }`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-2">
          {/* Left: View Toggle */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-[#151a21] border-white/5' : 'bg-gray-50 border-gray-200'
            }`}>
            <button
              onClick={() => handleViewModeChange('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'table'
                ? 'bg-[#2A3441] text-white shadow-lg ring-1 ring-white/10'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              <Table2 className="w-4 h-4" />
              <span>Таблица</span>
            </button>
            <button
              onClick={() => handleViewModeChange('week')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'week'
                ? 'bg-[#4E6E49] text-white shadow-lg shadow-emerald-900/20'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Неделя</span>
            </button>
          </div>

          {/* Center: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddSlot}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Добавить слот</span>
            </button>
            <button
              onClick={handleAddAbsence}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all hover:scale-105 active:scale-95 ${theme === 'dark'
                ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
            >
              <UserX className="w-4 h-4" />
              <span className="hidden sm:inline">Отсутствие</span>
            </button>
            <button
              onClick={handleDeleteSlots}
              className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all"
              title="Очистить"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-72">
            <MemberSelector
              selectedUserId={selectedUserId}
              onSelect={setSelectedUserId}
            />
          </div>
          {/* Admin Actions Dropdown Trigger (Simplified for now) */}
          {isAdmin && (
            <div className="flex gap-1">
              {[
                { icon: <Shield className="w-4 h-4" />, action: handleManageRestrictions, title: "Ограничения" },
                { icon: <Shield className="w-4 h-4" />, action: handleManageConflicts, title: "Конфликты" },
                { icon: <ShieldX className="w-4 h-4" />, action: handleManageAccessBlocks, title: "Блокировки" }
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  title={btn.title}
                  className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5 text-gray-400 hover:text-white' : 'border-gray-200 text-gray-500'}`}
                >
                  {btn.icon}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`rounded-2xl border overflow-hidden ${theme === 'dark'
        ? 'bg-[#0b1015] border-white/5'
        : 'bg-white border-gray-200'
        }`}>
        <div className="p-0">
          {viewMode === 'table' ? (
            <ManagementTable
              selectedUserId={selectedUserId}
              slotFilter={slotFilter}
              refreshKey={refreshKey}
              onEditSlot={handleEditSlot}
              onEditStatus={handleEditStatus}
            />
          ) : (
            <ManagementWeekView
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
      {
        showSlotForm && (
          <SlotForm
            slot={editingSlot}
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )
      }

      {
        showDeleteSlotsForm && (
          <DeleteSlotsForm
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )
      }

      {
        showStatusForm && (
          <DayStatusForm
            type={statusType || undefined}
            status={editingStatus}
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )
      }

      {
        showRestrictionForm && (
          <RestrictionForm
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )
      }

      {
        showConflictsForm && (
          <UserConflictsForm onClose={() => setShowConflictsForm(false)} />
        )
      }

      {
        showAccessBlocksForm && (
          <AccessBlocksForm onClose={() => setShowAccessBlocksForm(false)} />
        )
      }
    </div>
  )
}

