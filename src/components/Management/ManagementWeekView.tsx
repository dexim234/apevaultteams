// Week view for management
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getWorkSlots, getDayStatuses, deleteWorkSlot, deleteDayStatus } from '@/services/firestoreService'
import { formatDate, getWeekDays } from '@/utils/dateUtils'
import { WorkSlot, DayStatus } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import { Edit, Trash2, Info, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react'

type SlotFilter = 'all' | 'upcoming' | 'completed'

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

  const getStatusesForDay = (date: string): DayStatus[] => {
    return statuses.filter((s) => {
      // If status has endDate, check if date falls within the range
      if (s.endDate) {
        return s.date <= date && s.endDate >= date
      }
      // Otherwise, check exact match
      return s.date === date
    })
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
          const dayStatuses = getStatusesForDay(dateStr)

          return (
            <div
              key={dateStr}
              className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <h3 className={`text-lg font-semibold mb-3 ${headingColor}`}>
                {formatDate(day, 'dd.MM.yyyy')}
              </h3>

              <div className="space-y-2">
                {/* Statuses */}
                {dayStatuses.map((status) => {
                  const statusUser = TEAM_MEMBERS.find((u) => u.id === status.userId)
                  // Fallback: try to find by old ID format if not found
                  const statusUserFallback = statusUser || TEAM_MEMBERS.find((u) => {
                    const oldIdMap: Record<string, string> = {
                      'artyom': '1',
                      'adel': '2',
                      'kseniya': '3',
                      'olga': '4',
                      'anastasia': '5'
                    }
                    return oldIdMap[status.userId] === u.id
                  })
                  const displayName = statusUserFallback?.name || status.userId
                  return (
                    <div
                      key={status.id}
                      className={`group relative flex items-center justify-between p-4 rounded-xl shadow-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                        status.type === 'dayoff'
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400/40 ring-2 ring-yellow-500/20 hover:ring-4 hover:ring-yellow-400/30'
                          : status.type === 'sick'
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400/40 ring-2 ring-purple-500/20 hover:ring-4 hover:ring-purple-400/30'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-400/40 ring-2 ring-orange-500/20 hover:ring-4 hover:ring-orange-400/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{displayName}</span>
                        <span className="text-white text-sm">
                          {status.type === 'dayoff' ? 'Выходной' : status.type === 'sick' ? 'Больничный' : 'Отпуск'}
                        </span>
                        {status.comment && (
                          <div className="relative group">
                            <Info className="w-4 h-4 text-white cursor-help" />
                            <div className="absolute bottom-full left-0 mb-2 p-2 bg-[#0A0A0A] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                              {status.comment}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {(isAdmin || user?.id === status.userId) ? (
                          <>
                            <button
                              onClick={() => onEditStatus(status)}
                              className="p-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => handleDeleteStatus(status.id)}
                              className="p-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              disabled
                              className="p-1 bg-white bg-opacity-10 cursor-not-allowed rounded"
                              title="Вы можете редактировать только свои статусы"
                            >
                              <Edit className="w-4 h-4 text-white opacity-50" />
                            </button>
                            <button
                              disabled
                              className="p-1 bg-white bg-opacity-10 cursor-not-allowed rounded"
                              title="Вы можете удалять только свои статусы"
                            >
                              <Trash2 className="w-4 h-4 text-white opacity-50" />
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
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400/30' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400/30'
                  const SlotIcon = isUpcoming ? CalendarIcon : CheckCircle2
                  
                  return (
                    <div
                      key={slot.id}
                      className={`group relative space-y-2 sm:space-y-3 p-3 sm:p-4 ${slotBg} rounded-lg sm:rounded-xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl active:scale-[0.98] sm:hover:scale-[1.03] mb-2 sm:mb-3 ${
                        isUpcoming 
                          ? 'border-blue-400/40 hover:border-blue-300/60 ring-2 ring-blue-500/20 hover:ring-4 hover:ring-blue-400/30' 
                          : 'border-gray-400/30 hover:border-gray-300/50 ring-2 ring-gray-500/10 hover:ring-4 hover:ring-gray-400/20'
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
                                    ? 'border-white/50 ring-2 ring-white/40 ring-offset-2 ring-offset-blue-500/20 group-hover/avatar:ring-4 group-hover/avatar:ring-white/60' 
                                    : 'border-white/40 ring-2 ring-white/30 ring-offset-2 ring-offset-gray-500/20 group-hover/avatar:ring-4 group-hover/avatar:ring-white/50'
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
                              isUpcoming ? 'bg-blue-400' : 'bg-gray-400'
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
                              <div className="space-y-1 ml-6">
                                <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium`}>Перерывы:</div>
                                {s.breaks.map((breakItem, breakIdx) => (
                                  <div key={breakIdx} className={`${theme === 'dark' ? 'bg-gray-700/95' : 'bg-white'} ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} border-2 ${theme === 'dark' ? 'border-orange-500/60' : 'border-orange-300'} rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                                    theme === 'dark' 
                                      ? 'hover:border-orange-400/80 hover:shadow-orange-500/30 ring-2 ring-orange-500/20 hover:ring-4 hover:ring-orange-400/40' 
                                      : 'hover:border-orange-400 hover:shadow-orange-400/30 ring-2 ring-orange-300/20 hover:ring-4 hover:ring-orange-300/40'
                                  }`}>
                                    <span className="flex items-center gap-1 sm:gap-1.5 justify-center flex-wrap">
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
                          <div className="relative group flex items-center gap-2 pt-2">
                            <Info className="w-4 h-4 text-white cursor-help" />
                            <div className="absolute bottom-full left-0 mb-2 p-2 bg-[#0A0A0A] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                              {slot.comment}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {daySlots.length === 0 && dayStatuses.length === 0 && (
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

