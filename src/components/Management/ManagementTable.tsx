// Table view for management
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getWorkSlots, getDayStatuses, deleteWorkSlot, deleteDayStatus } from '@/services/firestoreService'
import { formatDate, calculateHours, getWeekDays } from '@/utils/dateUtils'
import { WorkSlot, DayStatus } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import { Edit, Trash2, Info, Clock, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react'

type SlotFilter = 'all' | 'upcoming' | 'completed'

interface ManagementTableProps {
  selectedUserId: string | null
  slotFilter: SlotFilter
  onEditSlot: (slot: WorkSlot) => void
  onEditStatus: (status: DayStatus) => void
}

export const ManagementTable = ({ selectedUserId, slotFilter, onEditSlot, onEditStatus }: ManagementTableProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const [slots, setSlots] = useState<WorkSlot[]>([])
  const [statuses, setStatuses] = useState<DayStatus[]>([])
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [loading, setLoading] = useState(true)

  const weekDays = getWeekDays(selectedWeek)
  const displayUsers = selectedUserId ? TEAM_MEMBERS.filter((u) => u.id === selectedUserId) : TEAM_MEMBERS

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

  const getSlotForDay = (userId: string, date: string): WorkSlot | null => {
    return slots.find((s) => s.userId === userId && s.date === date) || null
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
      <div className={`rounded-lg p-8 text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Загрузка...</p>
      </div>
    )
  }

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'

  return (
    <div className={`rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md overflow-hidden`}>
      {/* Week navigation */}
      <div
        className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
      >
        <button
          onClick={() => navigateWeek('prev')}
          className="w-full sm:w-auto px-3 py-2 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          ← Предыдущая неделя
        </button>
        <span className={`${headingColor} font-semibold text-center text-sm sm:text-base`}>
          {formatDate(weekDays[0], 'dd.MM.yyyy')} - {formatDate(weekDays[6], 'dd.MM.yyyy')}
        </span>
        <button
          onClick={() => navigateWeek('next')}
          className="w-full sm:w-auto px-3 py-2 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          Следующая неделя →
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <th className={`px-4 py-3 text-left text-sm font-semibold ${headingColor}`}>Участник</th>
              {weekDays.map((day) => (
                <th key={day.toISOString()} className={`px-4 py-3 text-center text-sm font-semibold ${headingColor}`}>
                  {formatDate(day, 'dd.MM')}
                </th>
              ))}
              <th className={`px-4 py-3 text-center text-sm font-semibold ${headingColor}`}>Статистика</th>
            </tr>
          </thead>
          <tbody>
            {displayUsers.map((user) => {
              const stats = getUserStats(user.id)
              return (
                <tr key={user.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className={`px-4 py-3 font-medium ${headingColor}`}>{user.name}</td>
                  {weekDays.map((day) => {
                    const dateStr = formatDate(day, 'yyyy-MM-dd')
                    const slot = getSlotForDay(user.id, dateStr)
                    const status = getStatusForDay(user.id, dateStr)

                    return (
                      <td key={dateStr} className="px-2 py-3 text-center">
                        {slot ? (
                          <div className="space-y-2">
                            {(() => {
                              const isUpcoming = isSlotUpcoming(slot)
                              const slotBg = isUpcoming 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                                : 'bg-gradient-to-r from-gray-500 to-gray-600'
                              const slotIcon = isUpcoming ? CalendarIcon : CheckCircle2
                              const SlotIcon = slotIcon
                              
                              return slot.slots.map((s, slotIdx) => (
                                <div key={slotIdx} className="space-y-1">
                                  {/* Main slot time */}
                                  <div className={`${slotBg} text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm`}>
                                    <div className="flex items-center justify-center gap-1">
                                      <SlotIcon className="w-3 h-3" />
                                      <span>{s.start} - {s.end}</span>
                                    </div>
                                  </div>
                                  {/* Breaks */}
                                  {s.breaks && s.breaks.length > 0 && (
                                    <div className="space-y-1">
                                      <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Перерывы:</div>
                                      {s.breaks.map((breakItem, breakIdx) => (
                                        <div key={breakIdx} className="bg-orange-400 dark:bg-orange-500 text-white rounded px-2 py-1 text-[10px] font-medium shadow-sm">
                                          {breakItem.start} - {breakItem.end}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))
                            })()}
                            {slot.comment && (
                              <div className="flex items-center justify-center group relative">
                                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
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
                                    onClick={() => handleDeleteSlot(slot.id)}
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
                              className={`text-white rounded px-2 py-1 text-xs ${
                                status.type === 'dayoff'
                                  ? 'bg-yellow-500'
                                  : status.type === 'sick'
                                  ? 'bg-purple-500'
                                  : 'bg-orange-500'
                              }`}
                            >
                              {status.type === 'dayoff' ? 'Выходной' : status.type === 'sick' ? 'Больничный' : 'Отпуск'}
                            </div>
                            {status.comment && (
                              <div className="flex items-center justify-center group relative">
                                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
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
                                    onClick={() => handleDeleteStatus(status.id)}
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
                  <td className={`px-4 py-3 text-sm ${headingColor}`}>
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
  )
}

