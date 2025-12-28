// Table view for management
import React, { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getWorkSlots, getDayStatuses, addApprovalRequest, deleteWorkSlot, updateDayStatus, addDayStatus, deleteDayStatus } from '@/services/firestoreService'
import { formatDate, calculateHours, getWeekDays, getMoscowTime } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { UserNickname } from '@/components/UserNickname'
import { WorkSlot, DayStatus } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import { Edit, Trash2, CheckCircle2, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react'

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

  const getUserStats = (userId: string) => {
    const userSlots = slots.filter((s: any) => s.userId === userId)
    const totalHours = userSlots.reduce((sum, slot) => sum + calculateHours(slot.slots), 0)

    const userStatuses = statuses.filter((s) => s.userId === userId)
    const daysOff = userStatuses.filter((s) => s.type === 'dayoff').length
    const sickDays = userStatuses.filter((s) => s.type === 'sick').length
    const vacationDays = userStatuses.filter((s) => s.type === 'vacation').length
    const absenceDays = userStatuses.filter((s) => s.type === 'absence').length

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
                <th className={`p-4 text-left text-xs font-bold uppercase tracking-wider ${subTextColor} sticky left-0 z-30 ${theme === 'dark' ? 'bg-[#0b1015]' : 'bg-white'
                  }`}>Участник</th>
                {weekDays.map((day) => {
                  const isToday = formatDate(day, 'yyyy-MM-dd') === todayStr
                  return (
                    <th key={day.toISOString()} className="p-2 min-w-[120px]">
                      <div className={`mx-auto w-full p-2 rounded-xl border transition-colors ${isToday
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                          : theme === 'dark' ? 'bg-[#151a21] border-white/5 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-500'
                        }`}>
                        <div className="text-[10px] uppercase font-bold opacity-70 mb-0.5">{formatDate(day, 'EEE')}</div>
                        <div className="text-sm font-black">{formatDate(day, 'dd.MM')}</div>
                      </div>
                    </th>
                  )
                })}
                <th className={`p-4 text-center text-xs font-bold uppercase tracking-wider ${subTextColor}`}>Итоги</th>
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
                    <td className={`p-4 sticky left-0 z-20 ${rowBg} group-hover:bg-[#1a2029] transition-colors`}>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={getDisplayName(user.id)}
                              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/20"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const fallback = target.nextElementSibling as HTMLElement
                                if (fallback) fallback.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${theme === 'dark'
                                ? 'bg-[#1f2937] text-gray-300'
                                : 'bg-gray-200 text-gray-600'
                              } ${user.avatar ? 'absolute inset-0 hidden' : ''}`}
                          >
                            <UserNickname userId={user.id} formatter={(n: string) => n.charAt(0).toUpperCase()} />
                          </div>
                          {/* Online status indicator placeholder */}
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0b1015]"></div>
                        </div>
                        <div>
                          <div className={`font-bold text-sm ${headingColor}`}>
                            <UserNickname userId={user.id} />
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
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
                        <td key={dateStr} className="p-2 align-top">
                          {slot ? (
                            <div className="flex flex-col gap-1">
                              {(() => {
                                const isUpcoming = isSlotUpcoming(slot)
                                const slotStyle = isUpcoming
                                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                  : 'bg-slate-700 text-slate-200 opacity-60'

                                return slot.slots.map((s, slotIdx) => (
                                  <div key={slotIdx} className={`rounded-lg p-2 text-xs font-bold transition-transform hover:scale-105 cursor-default relative overflow-hidden group/slot ${slotStyle}`}>
                                    <div className="flex items-center justify-center gap-1">
                                      <span className="whitespace-nowrap">{s.start}-{s.end}</span>
                                    </div>
                                    {/* Edit/Delete overlay */}
                                    {(isAdmin || user?.id === slot.userId) && (
                                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover/slot:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                        <button onClick={() => onEditSlot(slot)} className="p-1 hover:text-emerald-300"><Edit className="w-3 h-3" /></button>
                                        <button onClick={() => handleDeleteSlot(slot)} className="p-1 hover:text-rose-300"><Trash2 className="w-3 h-3" /></button>
                                      </div>
                                    )}
                                  </div>
                                ))
                              })()}
                            </div>
                          ) : status ? (
                            <div className={`rounded-lg p-2 text-[10px] font-bold text-center border ${statusTone[status.type]} relative group/status`}>
                              {status.type === 'dayoff' ? 'ВЫХ' : status.type === 'sick' ? 'БОЛН' : status.type === 'vacation' ? 'ОТП' : 'Н/Б'}
                              {/* Edit/Delete overlay */}
                              {(isAdmin || (status.type !== 'absence' && user?.id === status.userId)) && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover/status:opacity-100 transition-opacity flex items-center justify-center gap-1 rounded-lg">
                                  <button onClick={() => onEditStatus(status)} className="p-1 text-white hover:text-blue-300"><Edit className="w-3 h-3" /></button>
                                  <button onClick={() => handleDeleteStatus(status, dateStr)} className="p-1 text-white hover:text-rose-300"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-8 w-full rounded-lg border border-dashed border-gray-700/20 dark:border-white/5 opacity-50"></div>
                          )}
                        </td>
                      )
                    })}
                    <td className="p-4 align-top">
                      <div className={`rounded-xl p-3 border ${theme === 'dark' ? 'bg-[#151a21] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-[10px] uppercase font-bold ${subTextColor}`}>Total</span>
                          <span className={`text-sm font-black ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            {stats.totalHours.toFixed(0)}ч
                          </span>
                        </div>
                        <div className="space-y-1">
                          {stats.daysOff > 0 && (
                            <div className="flex justify-between text-[10px]">
                              <span className="text-amber-500">Выходных</span>
                              <span className={`font-bold ${headingColor}`}>{stats.daysOff}</span>
                            </div>
                          )}
                          {stats.absenceDays > 0 && (
                            <div className="flex justify-between text-[10px]">
                              <span className="text-rose-500">Прогулов</span>
                              <span className={`font-bold ${headingColor}`}>{stats.absenceDays}</span>
                            </div>
                          )}
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
    </div>
  )
}

