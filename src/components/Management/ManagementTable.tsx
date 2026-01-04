// Table view for management
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getWorkSlots, getDayStatuses, addApprovalRequest, deleteWorkSlot, updateDayStatus, addDayStatus, deleteDayStatus } from '@/services/firestoreService'
import { formatDate, calculateHours, getWeekDays, getMoscowTime, countDaysInPeriod, getWeekRange } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { UserNickname } from '@/components/UserNickname'
import { WorkSlot, DayStatus, SLOT_CATEGORY_META, SlotCategory } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import { Edit, Trash2, Clock, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react'

type SlotFilter = 'all' | 'upcoming' | 'completed'

interface ManagementTableProps {
  selectedUserId: string | null
  slotFilter: SlotFilter
  onEditSlot: (slot: WorkSlot) => void
  onEditStatus: (status: DayStatus) => void
  refreshKey: number
}

export const ManagementTable = ({ selectedUserId, slotFilter, onEditSlot, onEditStatus, refreshKey }: ManagementTableProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const [slots, setSlots] = useState<WorkSlot[]>([])
  const [statuses, setStatuses] = useState<DayStatus[]>([])
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [breaksExpanded, setBreaksExpanded] = useState<Record<string, boolean>>({})
  const todayStr = formatDate(new Date(), 'yyyy-MM-dd')

  const legacyIdMap: Record<string, string> = {
    artyom: '1',
    adel: '2',
    kseniya: '3',
    olga: '4',
    anastasia: '5',
  }

  const getDisplayName = (userId: string) => {
    const member = TEAM_MEMBERS.find((u) => u.id === userId) || TEAM_MEMBERS.find((u) => legacyIdMap[userId] === u.id)
    return getUserNicknameSync(member?.id || userId)
  }

  const weekDays = getWeekDays(selectedWeek)
  const displayUsers = selectedUserId ? TEAM_MEMBERS.filter((u) => u.id === selectedUserId) : TEAM_MEMBERS

  useEffect(() => {
    loadData()
  }, [selectedUserId, selectedWeek, refreshKey])

  // Reload when window gets focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      loadData(true)
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true)
    try {
      // Format dates to ensure correct timezone handling
      const weekStartDate = new Date(weekDays[0])
      weekStartDate.setHours(0, 0, 0, 0)
      const weekEndDate = new Date(weekDays[6])
      weekEndDate.setHours(23, 59, 59, 999)

      const weekStart = formatDate(weekStartDate, 'yyyy-MM-dd')
      const weekEnd = formatDate(weekEndDate, 'yyyy-MM-dd')

      // Load all slots, statuses and approval requests for the week, not filtered by user
      const [allSlots, allStatuses] = await Promise.all([
        getWorkSlots(),
        getDayStatuses()
      ])

      // Filter by week range
      const weekSlots = allSlots.filter((s: any) => s.date >= weekStart && s.date <= weekEnd)
      // For statuses, check if any day in the status range overlaps with the week
      const weekStatuses = allStatuses.filter((s: any) => {
        const statusStart = s.date
        const statusEnd = s.endDate || s.date
        // Status overlaps with week if statusStart <= weekEnd AND statusEnd >= weekStart
        return statusStart <= weekEnd && statusEnd >= weekStart
      })

      // If user filter is selected, filter by user
      const filteredSlots = selectedUserId
        ? weekSlots.filter((s: any) => s.userId === selectedUserId)
        : weekSlots
      const filteredStatuses = selectedUserId
        ? weekStatuses.filter((s: any) => s.userId === selectedUserId)
        : weekStatuses

      setSlots(filteredSlots)
      setStatuses(filteredStatuses)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      if (!isSilent) setLoading(false)
    }
  }

  const handleDeleteSlot = async (slot: WorkSlot) => {
    if (!isAdmin && user?.id !== slot.userId) {
      alert('Только администратор может удалять чужие слоты')
      return
    }

    if (isAdmin) {
      if (confirm('Удалить слот?')) {
        await deleteWorkSlot(slot.id)
        loadData()
      }
      return
    }

    if (confirm('Отправить на согласование удаление слота?')) {
      await addApprovalRequest({
        entity: 'slot',
        action: 'delete',
        authorId: user?.id || slot.userId,
        targetUserId: slot.userId,
        before: slot,
        after: null,
        comment: slot.comment,
      })
      loadData()
    }
  }

  const handleDeleteStatus = async (status: DayStatus, dateStr?: string) => {
    if (!isAdmin && user?.id !== status.userId) {
      alert('Только администратор может удалять чужие статусы')
      return
    }

    // Если статус имеет endDate и удаляется не весь диапазон, нужно обновить диапазон
    if (status.endDate && dateStr) {
      const statusStart = status.date
      const statusEnd = status.endDate

      // Если удаляется первый день диапазона, обновляем дату начала
      if (dateStr === statusStart) {
        if (isAdmin ? confirm('Удалить первый день диапазона?') : confirm('Отправить на согласование удаление первого дня диапазона?')) {
          const newStart = new Date(statusStart + 'T00:00:00')
          newStart.setDate(newStart.getDate() + 1)
          const newStartStr = formatDate(newStart, 'yyyy-MM-dd')

          if (isAdmin) {
            await updateDayStatus(status.id, { ...status, date: newStartStr })
          } else {
            await addApprovalRequest({
              entity: 'status',
              action: 'update',
              authorId: user?.id || status.userId,
              targetUserId: status.userId,
              before: status,
              after: {
                ...status,
                date: newStartStr,
              },
              comment: status.comment,
            })
          }
          loadData()
        }
        return
      }

      // Если удаляется последний день диапазона, обновляем дату окончания
      if (dateStr === statusEnd) {
        if (isAdmin ? confirm('Удалить последний день диапазона?') : confirm('Отправить на согласование удаление последнего дня диапазона?')) {
          const newEnd = new Date(statusEnd + 'T00:00:00')
          newEnd.setDate(newEnd.getDate() - 1)
          const newEndStr = formatDate(newEnd, 'yyyy-MM-dd')

          if (isAdmin) {
            await updateDayStatus(status.id, { ...status, endDate: newEndStr })
          } else {
            await addApprovalRequest({
              entity: 'status',
              action: 'update',
              authorId: user?.id || status.userId,
              targetUserId: status.userId,
              before: status,
              after: {
                ...status,
                endDate: newEndStr,
              },
              comment: status.comment,
            })
          }
          loadData()
        }
        return
      }

      // Если удаляется день из середины диапазона, разбиваем на два статуса
      if (dateStr > statusStart && dateStr < statusEnd) {
        if (isAdmin ? confirm('Удалить этот день? Диапазон будет разбит на две части.') : confirm('Отправить на согласование удаление этого дня? Диапазон будет разбит на две части.')) {
          // Создаем первый статус (до удаляемого дня)
          const firstEnd = new Date(dateStr + 'T00:00:00')
          firstEnd.setDate(firstEnd.getDate() - 1)
          const firstEndStr = formatDate(firstEnd, 'yyyy-MM-dd')

          if (isAdmin) {
            await updateDayStatus(status.id, { ...status, endDate: firstEndStr })
            const secondStart = new Date(dateStr + 'T00:00:00')
            secondStart.setDate(secondStart.getDate() + 1)
            const secondStartStr = formatDate(secondStart, 'yyyy-MM-dd')
            await addDayStatus({
              userId: status.userId,
              date: secondStartStr,
              endDate: statusEnd,
              type: status.type,
              comment: status.comment,
            })
          } else {
            await addApprovalRequest({
              entity: 'status',
              action: 'update',
              authorId: user?.id || status.userId,
              targetUserId: status.userId,
              before: status,
              after: {
                ...status,
                endDate: firstEndStr,
              },
              comment: status.comment,
            })

            const secondStart = new Date(dateStr + 'T00:00:00')
            secondStart.setDate(secondStart.getDate() + 1)
            const secondStartStr = formatDate(secondStart, 'yyyy-MM-dd')

            await addApprovalRequest({
              entity: 'status',
              action: 'create',
              authorId: user?.id || status.userId,
              targetUserId: status.userId,
              before: null,
              after: {
                id: '',
                userId: status.userId,
                date: secondStartStr,
                endDate: statusEnd,
                type: status.type,
                comment: status.comment,
              },
              comment: status.comment,
            })
          }

          loadData()
        }
        return
      }
    }

    // Если статус без endDate или удаляется весь диапазон, удаляем полностью
    if (isAdmin) {
      if (confirm('Удалить статус?')) {
        await deleteDayStatus(status.id)
        loadData()
      }
    } else if (confirm('Отправить на согласование удаление статуса?')) {
      await addApprovalRequest({
        entity: 'status',
        action: 'delete',
        authorId: user?.id || status.userId,
        targetUserId: status.userId,
        before: status,
        after: null,
        comment: status.comment,
      })
      loadData()
    }
  }

  const isSlotUpcoming = (slot: WorkSlot): boolean => {
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
      return slot.slots.some((s) => {
        // If slot crosses midnight (has endDate), check endDate instead
        if (s.endDate) {
          const endDate = new Date(s.endDate)
          endDate.setHours(0, 0, 0, 0)
          const todayEnd = new Date(today)
          todayEnd.setHours(23, 59, 59)

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

    const hasActiveEndDate = slot.slots.some((s) => {
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

  const getSlotForDay = (userId: string, date: string): WorkSlot | null => {
    const slot = slots.find((s) => s.userId === userId && s.date === date) || null

    // Apply filter
    if (slot && slotFilter !== 'all') {
      const isUpcoming = isSlotUpcoming(slot)
      if (slotFilter === 'upcoming' && !isUpcoming) return null
      if (slotFilter === 'completed' && isUpcoming) return null
    }

    return slot
  }

  const getStatusForDay = (userId: string, date: string): DayStatus | null => {
    return statuses.find((s) => {
      if (s.userId !== userId) return false
      // If status has endDate, check if date falls within the range
      if (s.endDate) {
        return s.date <= date && s.endDate >= date
      }
      // Otherwise, check exact match
      return s.date === date
    }) || null
  }

  /* import { formatDate, calculateHours, getWeekDays, getMoscowTime, countDaysInPeriod, getWeekRange } from '@/utils/dateUtils' */ // Assuming these are imported, if not I will add them in a separate chunk.

  const getUserStats = (userId: string) => {
    const { start: weekStart, end: weekEnd } = getWeekRange(selectedWeek)
    const weekStartStr = formatDate(weekStart, 'yyyy-MM-dd')
    const weekEndStr = formatDate(weekEnd, 'yyyy-MM-dd')

    const userSlots = slots.filter((s: any) => s.userId === userId)
    // Filter slots to current week only
    const weekSlots = userSlots.filter((s: any) => s.date >= weekStartStr && s.date <= weekEndStr)
    const totalHours = weekSlots.reduce((sum: number, slot: any) => sum + calculateHours(slot.slots), 0)

    const userStatuses = statuses.filter((s) => s.userId === userId)

    const countStatusDays = (type: string) => {
      return userStatuses
        .filter((s) => s.type === type)
        .reduce((sum, s) => {
          return sum + countDaysInPeriod(s.date, s.endDate, weekStartStr, weekEndStr)
        }, 0)
    }

    const daysOff = countStatusDays('dayoff')
    const sickDays = countStatusDays('sick')
    const vacationDays = countStatusDays('vacation')
    const absenceDays = countStatusDays('absence')

    return { totalHours, daysOff, sickDays, vacationDays, absenceDays }
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    setSelectedWeek(newDate)
  }

  const toggleBreaksVisibility = (slotId: string) => {
    setBreaksExpanded(prev => ({
      ...prev,
      [slotId]: !prev[slotId]
    }))
  }



  if (loading) {
    return (
      <div className={`rounded-lg p-8 text-center ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Загрузка...</p>
      </div>
    )
  }

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  const statusTone = {
    dayoff: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    sick: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    vacation: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
    absence: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
  } as const

  const SLOT_CATEGORY_COLORS: Record<SlotCategory, { bg: string; text: string; border: string }> = {
    memecoins: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700' },
    futures: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
    nft: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700' },
    spot: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700' },
    airdrop: { bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-300 dark:border-cyan-700' },
    polymarket: { bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-300 dark:border-pink-700' },
    staking: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-300 dark:border-indigo-700' },
  }

  return (
    <div className={`rounded-2xl ${theme === 'dark' ? 'bg-[#0b1015]' : 'bg-white'} overflow-visible`}>
      {/* Week navigation */}
      <div
        className={`p-4 border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
      >
        <button
          onClick={() => navigateWeek('prev')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 ${theme === 'dark'
            ? 'bg-[#151a21] text-gray-300 hover:text-white hover:bg-[#1f2937]'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
        >
          <ChevronDown className="w-4 h-4 rotate-90" />
          <span>Пред. неделя</span>
        </button>

        <div className="flex items-center gap-2">
          <CalendarIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'}`} />
          <span className={`${headingColor} font-black text-lg tracking-tight`}>
            {formatDate(weekDays[0], 'd MMMM')} — {formatDate(weekDays[6], 'd MMMM yyyy')}
          </span>
        </div>

        <button
          onClick={() => navigateWeek('next')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95 ${theme === 'dark'
            ? 'bg-[#151a21] text-gray-300 hover:text-white hover:bg-[#1f2937]'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
        >
          <span>След. неделя</span>
          <ChevronDown className="w-4 h-4 -rotate-90" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-30">
              <tr className={`${theme === 'dark' ? 'bg-[#0b1015]' : 'bg-white'}`}>
                <th className={`p-3 text-left text-[10px] font-bold uppercase tracking-wider ${subTextColor} sticky left-0 z-30 ${theme === 'dark' ? 'bg-[#0b1015]' : 'bg-white'
                  }`}>Участник</th>
                {weekDays.map((day) => {
                  const isToday = formatDate(day, 'yyyy-MM-dd') === todayStr
                  return (
                    <th key={day.toISOString()} className="p-1 min-w-[100px] lg:min-w-[120px]">
                      <div className={`mx-auto w-full p-1.5 rounded-xl border transition-colors ${isToday
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                        : theme === 'dark' ? 'bg-[#151a21] border-white/5 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-500'
                        }`}>
                        <div className="text-[9px] uppercase font-bold opacity-70 mb-0.5">{formatDate(day, 'EEE')}</div>
                        <div className="text-xs font-black">{formatDate(day, 'dd.MM')}</div>
                      </div>
                    </th>
                  )
                })}
                <th className={`p-3 text-center text-[10px] font-bold uppercase tracking-wider ${subTextColor} min-w-[110px]`}>Итоги</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-gray-100'}`}>
              {displayUsers.map((user, index) => {
                const stats = getUserStats(user.id)
                // Zebra striping
                const rowBg = index % 2 === 0
                  ? theme === 'dark' ? 'bg-[#0f141a]' : 'bg-gray-50/30'
                  : 'transparent'

                return (
                  <tr
                    key={user.id}
                    className={`${rowBg} hover:bg-emerald-500/5 transition-colors group`}
                  >
                    <td className={`p-2 sticky left-0 z-20 ${rowBg} group-hover:bg-[#1a2029] transition-colors align-middle`}>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={getDisplayName(user.id)}
                              className="w-8 h-8 rounded-full object-cover border border-emerald-500/20 shadow-sm"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const fallback = target.nextElementSibling as HTMLElement
                                if (fallback) fallback.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${theme === 'dark'
                              ? 'bg-[#1f2937] text-gray-300'
                              : 'bg-gray-200 text-gray-600'
                              } ${user.avatar ? 'absolute inset-0 hidden' : ''}`}
                          >
                            <UserNickname userId={user.id} formatter={(n: string) => n.charAt(0).toUpperCase()} />
                          </div>
                        </div>
                        <div>
                          <div className={`font-bold text-[13px] leading-tight ${headingColor}`}>
                            <UserNickname userId={user.id} />
                          </div>
                          <div className="text-[9px] text-gray-500 font-medium uppercase tracking-tight">
                            Member
                          </div>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((day: Date) => {
                      const dateStr = formatDate(day, 'yyyy-MM-dd')
                      const slot = getSlotForDay(user.id, dateStr)
                      const status = getStatusForDay(user.id, dateStr)

                      return (
                        <td key={dateStr} className="p-1.5 align-middle">
                          {slot ? (
                            <div className="flex flex-col items-center gap-1.5">
                              {slot.slots.map((s: any, slotIdx: number) => {
                                const slotId = `${slot.id}-${slotIdx}`
                                const isExpanded = breaksExpanded[slotId]

                                return (
                                  <div key={slotIdx} className="w-full flex flex-col items-center gap-1.5 group/timecard">
                                    <div className={`w-full max-w-[120px] rounded-xl p-2 text-[10px] font-bold transition-all relative overflow-hidden shadow-md ${theme === 'dark' ? 'bg-[#1a1f26] border border-white/5 text-gray-200' : 'bg-gray-100 text-gray-700'
                                      }`}>
                                      <div className="flex flex-col items-center gap-1.5 w-full">
                                        <div className="flex items-center gap-1 opacity-80 justify-center">
                                          <Clock className="w-3 h-3 flex-shrink-0" />
                                          <span className="whitespace-nowrap tracking-tight">{s.start} - {s.end}</span>
                                        </div>
                                        {slot.category && (
                                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium w-full text-center truncate ${SLOT_CATEGORY_COLORS[slot.category as SlotCategory]?.bg || 'bg-gray-100 dark:bg-gray-800'
                                            } ${SLOT_CATEGORY_COLORS[slot.category as SlotCategory]?.text || 'text-gray-700 dark:text-gray-300'} ${SLOT_CATEGORY_COLORS[slot.category as SlotCategory]?.border || 'border-gray-300 dark:border-gray-600'
                                            }`}>
                                            {SLOT_CATEGORY_META[slot.category as SlotCategory]?.label || slot.category}
                                          </span>
                                        )}
                                        {s.breaks && s.breaks.length > 0 && (
                                          <button
                                            onClick={() => toggleBreaksVisibility(slotId)}
                                            className="p-0.5 hover:bg-white/10 rounded-md transition-colors w-full flex justify-center"
                                          >
                                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                          </button>
                                        )}
                                      </div>

                                      {/* Breaks details if expanded */}
                                      {isExpanded && s.breaks && s.breaks.length > 0 && (
                                        <div className="mt-1.5 pt-1.5 border-t border-white/10 space-y-0.5 w-full text-center">
                                          {s.breaks.map((br: any, bIdx: number) => (
                                            <div key={bIdx} className="text-[9px] opacity-70 font-medium">
                                              {br.start} - {br.end}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* Action buttons below the pill */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover/timecard:opacity-100 transition-opacity duration-200">
                                      <button
                                        onClick={() => onEditSlot(slot)}
                                        className={`transition-all hover:scale-110 ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSlot(slot)}
                                        className={`transition-all hover:scale-110 ${theme === 'dark' ? 'text-rose-500 hover:text-rose-400' : 'text-rose-600 hover:text-rose-500'}`}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : status ? (
                            <div className="flex flex-col items-center gap-1.5 group/status">
                              <div className={`w-full max-w-[120px] rounded-lg p-2 text-[10px] font-black text-center border shadow-sm ${theme === 'dark' ? 'bg-[#2A3441]/40' : 'bg-white'} ${statusTone[status.type as keyof typeof statusTone]}`}>
                                {status.type === 'dayoff' ? 'Выходной' : status.type === 'sick' ? 'Больничный' : status.type === 'vacation' ? 'Отпуск' : 'Прогул'}
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover/status:opacity-100 transition-opacity duration-200">
                                <button
                                  onClick={() => onEditStatus(status)}
                                  className={`transition-all hover:scale-110 ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStatus(status, dateStr)}
                                  className={`transition-all hover:scale-110 ${theme === 'dark' ? 'text-rose-500 hover:text-rose-400' : 'text-rose-600 hover:text-rose-500'}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-8 w-full max-w-[120px] mx-auto rounded-lg border border-dashed border-gray-700/20 dark:border-white/5 opacity-20"></div>
                          )}
                        </td>
                      )
                    })}
                    <td className="p-2 align-middle">
                      <div className="space-y-1 py-1 min-w-[110px] text-center ml-2">
                        <div className={`text-[12px] font-medium leading-tight ${headingColor}`}>
                          Часов: {stats.totalHours.toFixed(1)}
                        </div>
                        <div className={`text-[12px] font-medium leading-tight ${headingColor}`}>
                          Выходных: {stats.daysOff}
                        </div>
                        <div className={`text-[12px] font-medium leading-tight ${headingColor}`}>
                          Больничных: {stats.sickDays}
                        </div>
                        <div className={`text-[12px] font-medium leading-tight ${headingColor}`}>
                          Отпусков: {stats.vacationDays}
                        </div>
                        <div className={`text-[12px] font-medium leading-tight ${headingColor}`}>
                          Прогулов: {stats.absenceDays}
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  )
}

