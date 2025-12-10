// Table view for management
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getWorkSlots, getDayStatuses, addApprovalRequest, getApprovalRequests } from '@/services/firestoreService'
import { formatDate, calculateHours, getWeekDays } from '@/utils/dateUtils'
import { WorkSlot, DayStatus, ApprovalRequest } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import { Edit, Trash2, Info, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react'

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
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([])
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [loading, setLoading] = useState(true)

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

  const getDisplayName = (userId: string) => {
    const member = TEAM_MEMBERS.find((u) => u.id === userId) || TEAM_MEMBERS.find((u) => legacyIdMap[userId] === u.id)
    return nicknameMap[member?.id || userId] || member?.name || userId
  }

  const weekDays = getWeekDays(selectedWeek)
  const displayUsers = selectedUserId ? TEAM_MEMBERS.filter((u) => u.id === selectedUserId) : TEAM_MEMBERS

  useEffect(() => {
    loadData()
  }, [selectedUserId, selectedWeek, refreshKey])

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

      // Load all slots, statuses and approval requests for the week, not filtered by user
      const [allSlots, allStatuses, allApprovals] = await Promise.all([
        getWorkSlots(),
        getDayStatuses(),
        getApprovalRequests()
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

      const weekApprovals = allApprovals.filter((a) => {
        const afterDate = (a.after as any)?.date || (a.after as any)?.endDate
        const beforeDate = (a.before as any)?.date || (a.before as any)?.endDate
        const dateToCheck = afterDate || beforeDate
        if (!dateToCheck) return false
        return dateToCheck >= weekStart && dateToCheck <= weekEnd
      })

      const scopedApprovals = weekApprovals.filter((a) => {
        if (a.status === 'approved') return false
        if (selectedUserId) {
          return a.targetUserId === selectedUserId || a.authorId === selectedUserId
        }
        if (isAdmin) return true
        const currentUserId = user?.id
        if (!currentUserId) return false
        return a.authorId === currentUserId || a.targetUserId === currentUserId
      })

      console.log('Loaded slots:', {
        weekStart,
        weekEnd,
        allSlotsCount: allSlots.length,
        weekSlotsCount: weekSlots.length,
        filteredSlotsCount: filteredSlots.length,
        selectedUserId
      })

      setSlots(filteredSlots)
      setStatuses(filteredStatuses)
      setApprovals(scopedApprovals)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSlot = async (slot: WorkSlot) => {
    if (!isAdmin && user?.id !== slot.userId) {
      alert('Только администратор может удалять чужие слоты')
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
        if (confirm('Отправить на согласование удаление первого дня диапазона?')) {
          const newStart = new Date(statusStart)
          newStart.setDate(newStart.getDate() + 1)
          const newStartStr = formatDate(newStart, 'yyyy-MM-dd')

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
          loadData()
        }
        return
      }

      // Если удаляется последний день диапазона, обновляем дату окончания
      if (dateStr === statusEnd) {
        if (confirm('Отправить на согласование удаление последнего дня диапазона?')) {
          const newEnd = new Date(statusEnd)
          newEnd.setDate(newEnd.getDate() - 1)
          const newEndStr = formatDate(newEnd, 'yyyy-MM-dd')

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
          loadData()
        }
        return
      }

      // Если удаляется день из середины диапазона, разбиваем на два статуса
      if (dateStr > statusStart && dateStr < statusEnd) {
        if (confirm('Отправить на согласование удаление этого дня? Диапазон будет разбит на две части.')) {
          // Создаем первый статус (до удаляемого дня)
          const firstEnd = new Date(dateStr)
          firstEnd.setDate(firstEnd.getDate() - 1)
          const firstEndStr = formatDate(firstEnd, 'yyyy-MM-dd')

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

          // Создаем второй статус (после удаляемого дня)
          const secondStart = new Date(dateStr)
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

          loadData()
        }
        return
      }
    }

    // Если статус без endDate или удаляется весь диапазон, удаляем полностью
    if (confirm('Отправить на согласование удаление статуса?')) {
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

  const getApprovalsForDay = (userId: string, date: string): ApprovalRequest[] => {
    return approvals.filter((a) => {
      if (a.status === 'approved') return false
      if (a.targetUserId !== userId && a.authorId !== userId) return false
      const afterDate = (a.after as any)?.date || (a.after as any)?.endDate
      const beforeDate = (a.before as any)?.date || (a.before as any)?.endDate
      const dateToCheck = afterDate || beforeDate
      if (!dateToCheck) return false
      return dateToCheck === date
    })
  }

  const getUserStats = (userId: string) => {
    const userSlots = slots.filter((s) => s.userId === userId)
    const totalHours = userSlots.reduce((sum, slot) => sum + calculateHours(slot.slots), 0)

    const userStatuses = statuses.filter((s) => s.userId === userId)
    const daysOff = userStatuses.filter((s) => s.type === 'dayoff').length
    const sickDays = userStatuses.filter((s) => s.type === 'sick').length
    const vacationDays = userStatuses.filter((s) => s.type === 'vacation').length

    return { totalHours, daysOff, sickDays, vacationDays }
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
  const subtleColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  const statusTone = {
    dayoff: 'bg-amber-50 text-amber-900 border border-amber-200 shadow-inner dark:bg-amber-900/30 dark:text-amber-50 dark:border-amber-700',
    sick: 'bg-orange-50 text-orange-900 border border-orange-200 shadow-inner dark:bg-orange-900/30 dark:text-orange-50 dark:border-orange-700',
    vacation: 'bg-sky-50 text-sky-900 border border-sky-200 shadow-inner dark:bg-sky-900/30 dark:text-sky-50 dark:border-sky-700',
  } as const

  return (
    <div className={`rounded-lg ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} shadow-md overflow-hidden`}>
      {/* Week navigation */}
      <div
        className={`p-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
      >
        <button
          onClick={() => navigateWeek('prev')}
          className={`w-full sm:w-auto px-3 py-2 text-sm sm:text-base rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
            theme === 'dark'
              ? 'border border-gray-700 bg-gray-900/60 hover:border-[#4E6E49]/50 hover:bg-gray-900'
              : 'border border-gray-200 bg-white hover:border-[#4E6E49]/40 hover:bg-gray-50'
          }`}
        >
          <span>←</span>
          <span>Предыдущая неделя</span>
        </button>
        <span className={`${headingColor} font-semibold text-center text-sm sm:text-base whitespace-nowrap`}>
          {formatDate(weekDays[0], 'dd.MM.yyyy')} - {formatDate(weekDays[6], 'dd.MM.yyyy')}
        </span>
        <button
          onClick={() => navigateWeek('next')}
          className={`w-full sm:w-auto px-3 py-2 text-sm sm:text-base rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
            theme === 'dark'
              ? 'border border-gray-700 bg-gray-900/60 hover:border-[#4E6E49]/50 hover:bg-gray-900'
              : 'border border-gray-200 bg-white hover:border-[#4E6E49]/40 hover:bg-gray-50'
          }`}
        >
          <span>Следующая неделя</span>
          <span>→</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="min-w-full inline-block align-middle">
          <table className="w-full">
            <thead className="sticky top-0 z-30">
              <tr className={`${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'} shadow-sm`}>
                <th className={`px-2 sm:px-3 md:px-4 py-3 text-left text-xs sm:text-sm font-semibold ${headingColor} sticky left-0 z-30 ${
                  theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'
                }`}>Members</th>
                {weekDays.map((day) => (
                  <th key={day.toISOString()} className="px-1.5 sm:px-2 md:px-3 lg:px-4 py-3">
                    <div className={`mx-auto w-full max-w-[110px] rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5 text-white' : 'border-gray-200 bg-white text-gray-900'} shadow-sm text-center`}>
                      <div className="text-[10px] sm:text-xs opacity-70">{formatDate(day, 'EEE')}</div>
                      <div className="text-sm font-semibold">{formatDate(day, 'dd.MM')}</div>
                    </div>
                  </th>
                ))}
                <th className={`px-2 sm:px-3 md:px-4 py-3 text-center text-xs sm:text-sm font-bold ${headingColor} whitespace-nowrap`}>Итог</th>
              </tr>
            </thead>
            <tbody>
            {displayUsers.map((user, index) => {
              const stats = getUserStats(user.id)
              const isEven = index % 2 === 0
              return (
                <tr 
                  key={user.id} 
                  className={`
                    group border-b transition-all duration-300 relative
                    ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'}
                    ${isEven 
                      ? theme === 'dark' 
                        ? 'bg-gradient-to-r from-[#1a1a1a]/40 via-[#1a1a1a]/20 to-transparent hover:from-[#1a1a1a]/70 hover:via-[#1a1a1a]/50 hover:shadow-lg hover:shadow-#4E6E49/10' 
                        : 'bg-gradient-to-r from-gray-50/70 via-gray-50/40 to-transparent hover:from-gray-100/90 hover:via-gray-100/70 hover:shadow-lg hover:shadow-#4E6E49/5'
                      : theme === 'dark' 
                        ? 'bg-gradient-to-r from-[#1a1a1a]/10 via-[#1a1a1a]/5 to-transparent hover:from-[#1a1a1a]/50 hover:via-[#1a1a1a]/30 hover:shadow-lg hover:shadow-#4E6E49/10' 
                        : 'bg-gradient-to-r from-white via-gray-50/30 to-transparent hover:from-gray-50 hover:via-gray-50/60 hover:shadow-lg hover:shadow-#4E6E49/5'
                    }
                    hover:scale-[1.01] hover:-translate-y-0.5
                  `}
                >
                  <td className={`px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 font-semibold text-xs sm:text-sm ${headingColor} sticky left-0 z-10 transition-all duration-300 backdrop-blur-sm min-w-[120px] sm:min-w-[140px] ${
                    isEven 
                      ? theme === 'dark' 
                        ? 'bg-gradient-to-r from-[#1a1a1a]/40 via-[#1a1a1a]/20 to-transparent group-hover:from-[#1a1a1a]/70 group-hover:via-[#1a1a1a]/50' 
                        : 'bg-gradient-to-r from-gray-50/70 via-gray-50/40 to-transparent group-hover:from-gray-100/90 group-hover:via-gray-100/70'
                      : theme === 'dark' 
                        ? 'bg-gradient-to-r from-[#1a1a1a]/10 via-[#1a1a1a]/5 to-transparent group-hover:from-[#1a1a1a]/50 group-hover:via-[#1a1a1a]/30' 
                        : 'bg-gradient-to-r from-white via-gray-50/30 to-transparent group-hover:from-gray-50 group-hover:via-gray-50/60'
                  }`}>
                      <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative flex-shrink-0 group/avatar">
                            {user.avatar ? (
                          <img 
                            src={user.avatar} 
                                alt={getDisplayName(user.id)}
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover border-2 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-#4E6E49/30 ring-2 ring-transparent group-hover:ring-#4E6E49/50"
                            style={{
                              borderColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(34, 197, 94, 0.4)',
                            } as React.CSSProperties}
                            onError={(e) => {
                              // Fallback to letter if image fails to load
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const fallback = target.nextElementSibling as HTMLElement
                              if (fallback) fallback.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg ring-2 ring-transparent group-hover/avatar:scale-110 group-hover/avatar:shadow-xl group-hover/avatar:ring-#4E6E49/50 ${
                            theme === 'dark' 
                              ? 'bg-gradient-to-br from-[#4E6E49] via-[#4E6E49] to-blue-500 text-white group-hover/avatar:shadow-#4E6E49/40' 
                              : 'bg-gradient-to-br from-[#4E6E49] via-[#4E6E49] to-blue-400 text-white group-hover/avatar:shadow-#4E6E49/40'
                          } ${user.avatar ? 'absolute inset-0 hidden' : ''}`}
                        >
                          {getDisplayName(user.id).charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 bg-[#4E6E49] rounded-full border border-white sm:border-2 shadow-lg animate-pulse opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <span className="font-semibold group-hover:text-[#4E6E49] transition-colors duration-300 truncate hidden sm:inline">{getDisplayName(user.id)}</span>
                      <span className="font-semibold group-hover:text-[#4E6E49] transition-colors duration-300 sm:hidden">{(getDisplayName(user.id).split(' ')[0] || getDisplayName(user.id)).substring(0, 8)}</span>
                    </div>
                  </td>
                  {weekDays.map((day) => {
                    const dateStr = formatDate(day, 'yyyy-MM-dd')
                    const slot = getSlotForDay(user.id, dateStr)
                    const status = getStatusForDay(user.id, dateStr)
                    const dayApprovals = getApprovalsForDay(user.id, dateStr)

                      return (
                        <td key={dateStr} className="px-1 sm:px-2 py-2 sm:py-3 text-center border-l border-r border-transparent hover:border-blue-500/20 transition-colors min-w-[80px] sm:min-w-[100px]">
                        {dayApprovals.length > 0 && (
                          <div className="space-y-1 mb-1">
                            {dayApprovals.map((approval) => {
                              const isPending = approval.status === 'pending'
                              const entityLabel = approval.entity === 'slot' ? 'Слот' : 'Статус'
                              const actionLabel =
                                approval.action === 'create'
                                  ? 'Создание'
                                  : approval.action === 'update'
                                  ? 'Изменение'
                                  : 'Удаление'
                              const slotData = (approval.after as WorkSlot) || (approval.before as WorkSlot)
                              const statusData = (approval.after as DayStatus) || (approval.before as DayStatus)
                              const preview =
                                approval.entity === 'slot'
                                  ? slotData?.slots?.map((s) => `${s.start}-${s.end}`).join(', ')
                                  : statusData?.type === 'dayoff'
                                  ? 'Выходной'
                                  : statusData?.type === 'sick'
                                  ? 'Больничный'
                                  : 'Отпуск'

                              return (
                                <div
                                  key={approval.id}
                                  className={`rounded-md px-2 py-1 text-[11px] sm:text-xs font-medium ${
                                    isPending
                                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-50'
                                      : 'bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-50'
                                  }`}
                                >
                                  {entityLabel} · {actionLabel} · {isPending ? 'На согласовании' : 'Отклонено'} {preview ? `(${preview})` : ''}
                                </div>
                              )
                            })}
                          </div>
                        )}
                        {slot ? (
                          <div className="space-y-2">
                            {(() => {
                              const isUpcoming = isSlotUpcoming(slot)
                              const slotBg = isUpcoming 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                                : 'bg-gradient-to-r from-slate-500 to-slate-700'
                              const slotIcon = isUpcoming ? CalendarIcon : CheckCircle2
                              const SlotIcon = slotIcon
                              
                              return slot.slots.map((s, slotIdx) => (
                                <div key={slotIdx} className="space-y-1">
                                  {/* Main slot time */}
                                  <div className={`${slotBg} text-white rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                                    isUpcoming ? 'hover:shadow-emerald-500/40 ring-2 ring-emerald-400/40' : 'hover:shadow-slate-500/40 ring-2 ring-slate-400/40'
                                  }`}>
                                    <div className="flex items-center justify-center gap-0.5 sm:gap-1 flex-wrap">
                                      <SlotIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse flex-shrink-0" />
                                      <span className="whitespace-nowrap">{s.start} - {s.end}</span>
                                      {s.endDate && (
                                        <span className="text-[9px] sm:text-[10px] opacity-90 whitespace-nowrap">
                                          (до {formatDate(new Date(s.endDate), 'dd.MM')})
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {/* Breaks */}
                                  {s.breaks && s.breaks.length > 0 && (
                                    <div className="space-y-1">
                                      <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Перерывы:</div>
                                      {s.breaks.map((breakItem, breakIdx) => (
                                        <div key={breakIdx} className={`${theme === 'dark' ? 'bg-gray-700/90' : 'bg-white'} ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} border-2 ${theme === 'dark' ? 'border-orange-500/50' : 'border-orange-300'} rounded-md sm:rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-medium shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                                          theme === 'dark' ? 'hover:border-orange-400/70 hover:shadow-orange-500/20' : 'hover:border-orange-400 hover:shadow-orange-400/20'
                                        }`}>
                                          <span className="flex items-center gap-0.5 sm:gap-1 justify-center flex-wrap">
                                            <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-orange-500 flex-shrink-0"></span>
                                            <span className="whitespace-nowrap">{breakItem.start} - {breakItem.end}</span>
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))
                            })()}
                            {slot.comment && (
                              <div className="flex items-center justify-center group/slot-comment relative">
                                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                <div className="pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#0A0A0A] text-white text-xs rounded opacity-0 group-hover/slot-comment:opacity-100 transition-opacity whitespace-nowrap z-10">
                                  {slot.comment}
                                </div>
                              </div>
                            )}
                            <div className="flex gap-1 justify-center">
                              {(isAdmin || user?.id === slot.userId) ? (
                                <>
                                  <button
                                    onClick={() => onEditSlot(slot)}
                                    className="p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSlot(slot)}
                                    className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    disabled
                                    className="p-1 text-gray-400 cursor-not-allowed rounded"
                                    title="Вы можете редактировать только свои слоты"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    disabled
                                    className="p-1 text-gray-400 cursor-not-allowed rounded"
                                    title="Вы можете удалять только свои слоты"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ) : status ? (
                          <div className="space-y-1">
                            <div
                              className={`rounded-lg px-3 py-2 text-xs font-semibold ring-1 ring-inset ring-black/5 dark:ring-white/10 ${statusTone[status.type]}`}
                            >
                              {status.type === 'dayoff' ? 'Выходной' : status.type === 'sick' ? 'Больничный' : 'Отпуск'}
                            </div>
                            {status.comment && (
                              <div className="flex items-center justify-center group/status-comment relative">
                                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                <div className="pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#0A0A0A] text-white text-xs rounded opacity-0 group-hover/status-comment:opacity-100 transition-opacity whitespace-nowrap z-10">
                                  {status.comment}
                                </div>
                              </div>
                            )}
                            <div className="flex gap-1 justify-center">
                              {(isAdmin || user?.id === status.userId) ? (
                                <>
                                  <button
                                    onClick={() => onEditStatus(status)}
                                    className="p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteStatus(status, dateStr)}
                                    className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    disabled
                                    className="p-1 text-gray-400 cursor-not-allowed rounded"
                                    title="Вы можете редактировать только свои статусы"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    disabled
                                    className="p-1 text-gray-400 cursor-not-allowed rounded"
                                    title="Вы можете удалять только свои статусы"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className={`text-sm ${subtleColor}`}>—</span>
                        )}
                      </td>
                    )
                  })}
                  <td className={`px-4 py-3 text-sm ${headingColor} text-center`}>
                    <div className="space-y-1">
                      <div>Часов: {stats.totalHours.toFixed(1)}</div>
                      <div>Выходных: {stats.daysOff}</div>
                      <div>Больничных: {stats.sickDays}</div>
                      <div>Отпусков: {stats.vacationDays}</div>
                    </div>
                  </td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

