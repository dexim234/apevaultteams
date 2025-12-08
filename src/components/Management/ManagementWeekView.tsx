// Week view for management
import { useState, useEffect, useMemo } from 'react'
import { parseISO } from 'date-fns'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getWorkSlots, getDayStatuses, deleteWorkSlot, deleteDayStatus } from '@/services/firestoreService'
import { formatDate, getWeekDays } from '@/utils/dateUtils'
import { WorkSlot, DayStatus } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import { Edit, Trash2, Info, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react'

type SlotFilter = 'all' | 'upcoming' | 'completed'
type StatusRange = {
  id: string
  userId: string
  type: DayStatus['type']
  start: string
  end: string
  comment?: string
  originalIds: string[]
  primary: DayStatus
}

const isAdjacentOrOverlap = (prevEnd: string, nextStart: string) => {
  const prevEndDate = parseISO(prevEnd)
  const nextStartDate = parseISO(nextStart)
  const diffDays = Math.round((nextStartDate.getTime() - prevEndDate.getTime()) / (1000 * 60 * 60 * 24))
  return diffDays <= 1
}

interface ManagementWeekViewProps {
  selectedUserId: string | null
  slotFilter: SlotFilter
  onEditSlot: (slot: WorkSlot) => void
  onEditStatus: (status: DayStatus) => void
}

export const ManagementWeekView = ({ selectedUserId, slotFilter, onEditSlot, onEditStatus }: ManagementWeekViewProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const [slots, setSlots] = useState<WorkSlot[]>([])
  const [statuses, setStatuses] = useState<DayStatus[]>([])
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [loading, setLoading] = useState(true)

  const weekDays = getWeekDays(selectedWeek)
  const statusRanges = useMemo<StatusRange[]>(() => {
    const sorted = [...statuses].sort((a, b) => {
      if (a.userId !== b.userId) return a.userId.localeCompare(b.userId)
      if (a.type !== b.type) return a.type.localeCompare(b.type)
      return a.date.localeCompare(b.date)
    })

    const ranges: StatusRange[] = []
    for (const s of sorted) {
      const start = s.date
      const end = s.endDate || s.date
      const last = ranges[ranges.length - 1]
      const commentsEqual = (last?.comment || '') === (s.comment || '')

      // Проверяем, можно ли объединить с предыдущим диапазоном
      const canMerge = last &&
        last.userId === s.userId &&
        last.type === s.type &&
        commentsEqual &&
        isAdjacentOrOverlap(last.end, start)

      if (canMerge) {
        // Расширяем диапазон до конца текущего статуса
        if (end > last.end) {
          last.end = end
        }
        last.originalIds.push(s.id)
        // Обновляем primary, если текущий статус раньше
        if (start < last.start) {
          last.start = start
          last.primary = s
        }
      } else {
        // Создаем новый диапазон
        ranges.push({
          id: `${s.id}-range`,
          userId: s.userId,
          type: s.type,
          start,
          end,
          comment: s.comment,
          originalIds: [s.id],
          primary: s,
        })
      }
    }
    
    // Отладочная информация
    if (ranges.some(r => r.originalIds.length > 1)) {
      console.log('Объединенные диапазоны:', ranges.filter(r => r.originalIds.length > 1).map(r => ({
        type: r.type,
        start: r.start,
        end: r.end,
        count: r.originalIds.length,
        ids: r.originalIds
      })))
    }
    
    return ranges
  }, [statuses])

  useEffect(() => {
    loadData()
  }, [selectedUserId, selectedWeek])

  // Reload when window gets focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      loadData()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Format dates to ensure correct timezone handling
      const weekStartDate = new Date(weekDays[0])
      weekStartDate.setHours(0, 0, 0, 0)
      const weekEndDate = new Date(weekDays[6])
      weekEndDate.setHours(23, 59, 59, 999)
      
      const weekStart = formatDate(weekStartDate, 'yyyy-MM-dd')
      const weekEnd = formatDate(weekEndDate, 'yyyy-MM-dd')

      // Load all slots and statuses for the week, not filtered by user
      const [allSlots, allStatuses] = await Promise.all([
        getWorkSlots(),
        getDayStatuses()
      ])

      // Filter by week range
      const weekSlots = allSlots.filter((s) => s.date >= weekStart && s.date <= weekEnd)
      // For statuses, check if any day in the status range overlaps with the week
      const weekStatuses = allStatuses.filter((s) => {
        const statusStart = s.date
        const statusEnd = s.endDate || s.date
        // Status overlaps with week if statusStart <= weekEnd AND statusEnd >= weekStart
        return statusStart <= weekEnd && statusEnd >= weekStart
      })

      // If user filter is selected, filter by user
      const filteredSlots = selectedUserId 
        ? weekSlots.filter((s) => s.userId === selectedUserId)
        : weekSlots
      const filteredStatuses = selectedUserId
        ? weekStatuses.filter((s) => s.userId === selectedUserId)
        : weekStatuses

      console.log('Loaded slots (week view):', {
        weekStart,
        weekEnd,
        allSlotsCount: allSlots.length,
        weekSlotsCount: weekSlots.length,
        filteredSlotsCount: filteredSlots.length,
        selectedUserId
      })

      setSlots(filteredSlots)
      setStatuses(filteredStatuses)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSlot = async (id: string) => {
    if (!isAdmin && user?.id !== slots.find((s) => s.id === id)?.userId) {
      alert('Только администратор может удалять чужие слоты')
      return
    }

    if (confirm('Удалить слот?')) {
      await deleteWorkSlot(id)
      loadData()
    }
  }

  const handleDeleteStatus = async (id: string) => {
    if (!isAdmin && user?.id !== statuses.find((s) => s.id === id)?.userId) {
      alert('Только администратор может удалять чужие статусы')
      return
    }

    if (confirm('Удалить статус?')) {
      await deleteDayStatus(id)
      loadData()
    }
  }

  const isSlotUpcoming = (slot: WorkSlot): boolean => {
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
    
    // Check if slot has endDate in the future
    const hasFutureEndDate = slot.slots.some((s) => {
      if (s.endDate) {
        const endDate = new Date(s.endDate)
        endDate.setHours(0, 0, 0, 0)
        return endDate >= today
      }
      return false
    })
    
    return hasFutureEndDate
  }

  const getSlotsForDay = (date: string): WorkSlot[] => {
    let daySlots = slots.filter((s) => s.date === date)
    
    // Apply filter
    if (slotFilter !== 'all') {
      daySlots = daySlots.filter(slot => {
        const isUpcoming = isSlotUpcoming(slot)
        if (slotFilter === 'upcoming') return isUpcoming
        if (slotFilter === 'completed') return !isUpcoming
        return true
      })
    }
    
    return daySlots
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

  if (loading) {
    return (
      <div className={`rounded-lg p-8 text-center ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Загрузка...</p>
      </div>
    )
  }

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const statusTone = {
    dayoff: 'bg-amber-50 text-amber-900 border border-amber-200 shadow-inner dark:bg-amber-900/25 dark:text-amber-50 dark:border-amber-700',
    sick: 'bg-orange-50 text-orange-900 border border-orange-200 shadow-inner dark:bg-orange-900/25 dark:text-orange-50 dark:border-orange-700',
    vacation: 'bg-sky-50 text-sky-900 border border-sky-200 shadow-inner dark:bg-sky-900/25 dark:text-sky-50 dark:border-sky-700',
  } as const

  return (
    <div className={`rounded-lg ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} shadow-md overflow-hidden`}>
      {/* Week navigation */}
      <div
        className={`p-3 sm:p-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-between`}
      >
        <button
          onClick={() => navigateWeek('prev')}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors touch-manipulation active:scale-95"
        >
          ← Предыдущая неделя
        </button>
        <span className={`${headingColor} font-semibold text-center text-xs sm:text-sm md:text-base whitespace-nowrap`}>
          {formatDate(weekDays[0], 'dd.MM.yyyy')} - {formatDate(weekDays[6], 'dd.MM.yyyy')}
        </span>
        <button
          onClick={() => navigateWeek('next')}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors touch-manipulation active:scale-95"
        >
          Следующая неделя →
        </button>
      </div>

      {/* Week grid */}
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {weekDays.map((day) => {
          const dateStr = formatDate(day, 'yyyy-MM-dd')
          const daySlots = getSlotsForDay(dateStr)
          const weekStartStr = formatDate(weekDays[0], 'yyyy-MM-dd')
          const dayStatusRanges = statusRanges.filter((range) => range.start <= dateStr && range.end >= dateStr)

          return (
            <div
              key={dateStr}
              className={`rounded-xl p-4 sm:p-5 border ${theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
            >
              <h3 className={`text-lg font-semibold mb-3 ${headingColor}`}>
                {formatDate(day, 'dd.MM.yyyy')}
              </h3>

              <div className="space-y-3 sm:space-y-4">
                {/* Statuses */}
                {dayStatusRanges
                  .map((range) => {
                    const statusUser = TEAM_MEMBERS.find((u) => u.id === range.userId)
                    // Fallback: try to find by old ID format if not found
                    const statusUserFallback = statusUser || TEAM_MEMBERS.find((u) => {
                      const oldIdMap: Record<string, string> = {
                        'artyom': '1',
                        'adel': '2',
                        'kseniya': '3',
                        'olga': '4',
                        'anastasia': '5'
                      }
                      return oldIdMap[range.userId] === u.id
                    })
                    const displayName = statusUserFallback?.name || range.userId
                    const weekStartDate = parseISO(weekStartStr)
                    const rangeStartDate = parseISO(range.start)
                    
                    // Определяем первый видимый день диапазона в рамках недели
                    const firstVisibleDate = rangeStartDate < weekStartDate ? weekStartDate : rangeStartDate
                    const firstVisibleDateStr = formatDate(firstVisibleDate, 'yyyy-MM-dd')

                    // Показываем карточку диапазонного статуса только один раз — в первый видимый день диапазона
                    const isMultiDay = range.start !== range.end
                    const isMerged = range.originalIds.length > 1
                    
                    // Если это объединенный диапазон (несколько статусов объединены), показываем только в первый день
                    if (isMerged) {
                      if (dateStr !== firstVisibleDateStr) {
                        return null
                      }
                    }
                    
                    // Если это диапазон из нескольких дней, показываем только в первый день
                    if (isMultiDay && dateStr !== firstVisibleDateStr) {
                      return null
                    }

                    const dateRangeLabel =
                      range.start !== range.end
                        ? `${formatDate(parseISO(range.start), 'dd.MM')}–${formatDate(parseISO(range.end), 'dd.MM')}`
                        : formatDate(parseISO(range.start), 'dd.MM')
                    return (
                      <div
                        key={range.id}
                        className={`relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl backdrop-blur text-center sm:text-left ring-1 ring-inset ring-black/5 dark:ring-white/5 ${
                          statusTone[range.type]
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center text-center w-full">
                          <span className="font-semibold text-base sm:text-lg">{displayName}</span>
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 text-xs sm:text-sm font-semibold">
                            {range.type === 'dayoff' ? 'Выходной' : range.type === 'sick' ? 'Больничный' : 'Отпуск'}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-current">{dateRangeLabel}</span>
                          {range.comment && (
                            <div className="relative group/status-comment self-center sm:self-auto">
                              <Info className="w-4 h-4 text-current cursor-help" />
                              <div className="pointer-events-none absolute bottom-full left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 mb-2 p-2 bg-[#0A0A0A] text-white text-xs rounded-lg opacity-0 group-hover/status-comment:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                {range.comment}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 justify-center sm:justify-end w-full">
                          {(isAdmin || user?.id === range.userId) ? (
                            <>
                              <button
                                onClick={() => onEditStatus(range.primary)}
                                className={`p-1 rounded transition-colors ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                              >
                                <Edit className="w-4 h-4 text-current" />
                              </button>
                              <button
                                onClick={() => handleDeleteStatus(range.primary.id)}
                                className={`p-1 rounded transition-colors ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                              >
                                <Trash2 className="w-4 h-4 text-current" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                disabled
                                className={`p-1 cursor-not-allowed rounded ${theme === 'dark' ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
                                title="Вы можете редактировать только свои статусы"
                              >
                                <Edit className="w-4 h-4 text-current opacity-60" />
                              </button>
                              <button
                                disabled
                                className={`p-1 cursor-not-allowed rounded ${theme === 'dark' ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
                                title="Вы можете удалять только свои статусы"
                              >
                                <Trash2 className="w-4 h-4 text-current opacity-60" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}

                {/* Slots */}
                {daySlots.map((slot) => {
                  const slotUser = TEAM_MEMBERS.find((u) => u.id === slot.userId)
                  // Fallback: try to find by old ID format if not found
                  const slotUserFallback = slotUser || TEAM_MEMBERS.find((u) => {
                    const oldIdMap: Record<string, string> = {
                      'artyom': '1',
                      'adel': '2',
                      'kseniya': '3',
                      'olga': '4',
                      'anastasia': '5'
                    }
                    return oldIdMap[slot.userId] === u.id
                  })
                  const displayName = slotUserFallback?.name || slot.userId
                  const isUpcoming = isSlotUpcoming(slot)
                  const slotBg = isUpcoming 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-300/40' 
                    : 'bg-gradient-to-r from-slate-500 to-slate-700 border-slate-300/40'
                  const SlotIcon = isUpcoming ? CalendarIcon : CheckCircle2
                  
                  return (
                    <div
                      key={slot.id}
                      className={`group relative space-y-2 sm:space-y-3 p-3 sm:p-4 ${slotBg} rounded-lg sm:rounded-xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl active:scale-[0.98] sm:hover:scale-[1.03] mb-2 sm:mb-3 ${
                        isUpcoming 
                          ? 'hover:border-emerald-200/80 ring-2 ring-emerald-200/40 hover:ring-4 hover:ring-emerald-200/60' 
                          : 'hover:border-slate-200/80 ring-2 ring-slate-200/40 hover:ring-4 hover:ring-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-white/20 pb-2 sm:pb-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="relative flex-shrink-0 group/avatar">
                            {slotUserFallback?.avatar ? (
                              <img 
                                src={slotUserFallback.avatar} 
                                alt={displayName}
                                className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full object-cover border-2 shadow-xl transition-all duration-300 group-hover/avatar:scale-110 group-hover/avatar:shadow-2xl ${
                                  isUpcoming 
                                    ? 'border-white/50 ring-2 ring-white/40 ring-offset-2 ring-offset-emerald-400/30 group-hover/avatar:ring-4 group-hover/avatar:ring-white/60' 
                                    : 'border-white/40 ring-2 ring-white/30 ring-offset-2 ring-offset-slate-400/30 group-hover/avatar:ring-4 group-hover/avatar:ring-white/50'
                                }`}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  const fallback = target.nextElementSibling as HTMLElement
                                  if (fallback) fallback.style.display = 'flex'
                                }}
                              />
                            ) : null}
                            <div 
                              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-xl group-hover/avatar:scale-110 group-hover/avatar:shadow-2xl ${
                                isUpcoming 
                                  ? 'bg-white/25 backdrop-blur-md border-2 border-white/40 ring-2 ring-white/30 group-hover/avatar:ring-4 group-hover/avatar:ring-white/60' 
                                  : 'bg-white/15 backdrop-blur-md border-2 border-white/30 ring-2 ring-white/20 group-hover/avatar:ring-4 group-hover/avatar:ring-white/50'
                              } ${slotUserFallback?.avatar ? 'absolute inset-0 hidden' : ''}`}
                            >
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full border border-white sm:border-2 shadow-lg animate-pulse opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 ${
                              isUpcoming ? 'bg-emerald-300' : 'bg-slate-400'
                            }`}></div>
                          </div>
                          <span className="text-white font-bold text-sm sm:text-base group-hover:scale-105 transition-transform duration-300 truncate">{displayName}</span>
                        </div>
                        <div className="flex gap-2">
                          {(isAdmin || user?.id === slot.userId) ? (
                            <>
                              <button
                                onClick={() => onEditSlot(slot)}
                                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4 text-white" />
                              </button>
                              <button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                disabled
                                className="p-1.5 bg-white/10 cursor-not-allowed rounded-lg"
                                title="Вы можете редактировать только свои слоты"
                              >
                                <Edit className="w-4 h-4 text-white/50" />
                              </button>
                              <button
                                disabled
                                className="p-1.5 bg-white/10 cursor-not-allowed rounded-lg"
                                title="Вы можете удалять только свои слоты"
                              >
                                <Trash2 className="w-4 h-4 text-white/50" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {slot.slots.map((s, slotIdx) => (
                          <div key={slotIdx} className="space-y-1.5">
                            {/* Main slot time */}
                            <div className={`bg-white/25 backdrop-blur-md rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                              isUpcoming 
                                ? 'border-white/40 ring-2 ring-white/20 hover:border-white/60 hover:ring-4 hover:ring-white/40' 
                                : 'border-white/30 ring-2 ring-white/10 hover:border-white/50 hover:ring-4 hover:ring-white/30'
                            }`}>
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                <SlotIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0 ${isUpcoming ? 'animate-pulse' : ''}`} />
                                <span className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">{s.start} - {s.end}</span>
                                {s.endDate && (
                                  <span className="text-white/80 font-medium text-[10px] sm:text-xs whitespace-nowrap">
                                    (до {formatDate(new Date(s.endDate), 'dd.MM')})
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Breaks */}
                            {s.breaks && s.breaks.length > 0 && (
                              <div className="space-y-1 w-full">
                                <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium text-center sm:text-left`}>Перерывы:</div>
                                {s.breaks.map((breakItem, breakIdx) => (
                                  <div key={breakIdx} className={`${theme === 'dark' ? 'bg-gray-700/95' : 'bg-white'} ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} border-2 ${theme === 'dark' ? 'border-orange-500/60' : 'border-orange-300'} rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                                    theme === 'dark' 
                                      ? 'hover:border-orange-400/80 hover:shadow-orange-500/30 ring-2 ring-orange-500/20 hover:ring-4 hover:ring-orange-400/40' 
                                      : 'hover:border-orange-400 hover:shadow-orange-400/30 ring-2 ring-orange-300/20 hover:ring-4 hover:ring-orange-300/40'
                                  } w-full`}>
                                    <span className="flex items-center gap-1 sm:gap-1.5 justify-center flex-wrap w-full">
                                      <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${theme === 'dark' ? 'bg-orange-400' : 'bg-orange-500'} animate-pulse flex-shrink-0`}></span>
                                      <span className="whitespace-nowrap">{breakItem.start} - {breakItem.end}</span>
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        {slot.comment && (
                          <div className="relative group/slot-comment flex items-center gap-2 pt-2">
                            <Info className="w-4 h-4 text-white cursor-help" />
                            <div className="pointer-events-none absolute bottom-full left-0 mb-2 p-2 bg-[#0A0A0A] text-white text-xs rounded-lg opacity-0 group-hover/slot-comment:opacity-100 transition-opacity z-10 whitespace-nowrap">
                              {slot.comment}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {daySlots.length === 0 && dayStatusRanges.length === 0 && (
                  <p className={`text-sm ${subtleColor}`}>
                    Нет данных
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

