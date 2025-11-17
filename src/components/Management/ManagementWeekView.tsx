// Week view for management
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getWorkSlots, getDayStatuses, deleteWorkSlot, deleteDayStatus } from '@/services/firestoreService'
import { formatDate, getWeekDays } from '@/utils/dateUtils'
import { WorkSlot, DayStatus } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import { Edit, Trash2, Info } from 'lucide-react'

interface ManagementWeekViewProps {
  selectedUserId: string | null
  onEditSlot: (slot: WorkSlot) => void
  onEditStatus: (status: DayStatus) => void
}

export const ManagementWeekView = ({ selectedUserId, onEditSlot, onEditStatus }: ManagementWeekViewProps) => {
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
      const weekStatuses = allStatuses.filter((s) => s.date >= weekStart && s.date <= weekEnd)

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

  const getSlotsForDay = (date: string): WorkSlot[] => {
    return slots.filter((s) => s.date === date)
  }

  const getStatusesForDay = (date: string): DayStatus[] => {
    return statuses.filter((s) => s.date === date)
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
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'

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

      {/* Week grid */}
      <div className="p-4 space-y-4">
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
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        status.type === 'dayoff'
                          ? 'bg-yellow-500'
                          : status.type === 'sick'
                          ? 'bg-purple-500'
                          : 'bg-orange-500'
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
                            <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                              {status.comment}
                            </div>
                          </div>
                        )}
                      </div>
                      {(isAdmin || user?.id === status.userId) && (
                        <div className="flex gap-2">
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
                        </div>
                      )}
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
                  return (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 bg-green-500 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{displayName}</span>
                        <span className="text-white text-sm">
                          {slot.slots.map((s) => `${s.start}-${s.end}`).join(', ')}
                        </span>
                        {slot.comment && (
                          <div className="relative group">
                            <Info className="w-4 h-4 text-white cursor-help" />
                            <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                              {slot.comment}
                            </div>
                          </div>
                        )}
                      </div>
                      {(isAdmin || user?.id === slot.userId) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEditSlot(slot)}
                            className="p-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="p-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      )}
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

