// Form for adding/editing day statuses (dayoff, sick, vacation)
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { addDayStatus, updateDayStatus, getDayStatuses } from '@/services/firestoreService'
import { formatDate, isSameDate, getDatesInRange, normalizeDatesList } from '@/utils/dateUtils'
import { X } from 'lucide-react'
import { DayStatus, TEAM_MEMBERS } from '@/types'

interface DayStatusFormProps {
  type: 'dayoff' | 'sick' | 'vacation'
  status?: DayStatus | null
  onClose: () => void
  onSave: () => void
}

export const DayStatusForm = ({ type, status, onClose, onSave }: DayStatusFormProps) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const initialDate = status?.date || formatDate(new Date(), 'yyyy-MM-dd')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    status?.userId ? [status.userId] : user?.id ? [user.id] : []
  )
  const [date, setDate] = useState(initialDate)
  const [endDate, setEndDate] = useState(status?.endDate || initialDate)
  const [isMultiDay, setIsMultiDay] = useState(!!status?.endDate)
  const [comment, setComment] = useState(status?.comment || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dateMode, setDateMode] = useState<'single' | 'range' | 'multiple'>('single')
  const [rangeStart, setRangeStart] = useState(initialDate)
  const [rangeEnd, setRangeEnd] = useState(initialDate)
  const [multiDateInput, setMultiDateInput] = useState(initialDate)
  const [multipleDates, setMultipleDates] = useState<string[]>([])

  const adminBulkMode = isAdmin && !status

  useEffect(() => {
    if (!isMultiDay) {
      setEndDate(date)
    }
  }, [isMultiDay, date])

  useEffect(() => {
    if (adminBulkMode && dateMode !== 'single') {
      setIsMultiDay(false)
    }
  }, [adminBulkMode, dateMode])

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      }
      return [...prev, userId]
    })
  }

  const handleSelectAllUsers = () => {
    if (selectedUserIds.length === TEAM_MEMBERS.length) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(TEAM_MEMBERS.map((member) => member.id))
    }
  }

  const handleAddMultiDate = () => {
    if (!multiDateInput) return
    const updated = normalizeDatesList([...multipleDates, multiDateInput])
    setMultipleDates(updated)
    setMultiDateInput('')
  }

  const handleRemoveMultiDate = (dateToRemove: string) => {
    setMultipleDates((prev) => prev.filter((d) => d !== dateToRemove))
  }

  const getTargetUsers = (): string[] => {
    if (status) {
      return [status.userId]
    }
    if (adminBulkMode) {
      return selectedUserIds
    }
    // Allow admin to work without user (they can select users via adminBulkMode)
    if (isAdmin && !user) {
      return selectedUserIds.length > 0 ? selectedUserIds : []
    }
    return user?.id ? [user.id] : []
  }

  const getMemberName = (userId: string) => TEAM_MEMBERS.find((member) => member.id === userId)?.name || userId

  const getDatePayloads = (): { date: string; endDate?: string }[] => {
    if (adminBulkMode) {
      if (dateMode === 'range') {
        if (type === 'dayoff') {
          return getDatesInRange(rangeStart, rangeEnd).map((d) => ({ date: d }))
        }
        if (rangeStart && rangeEnd) {
          return [{ date: rangeStart, endDate: rangeEnd }]
        }
        return []
      }
      if (dateMode === 'multiple') {
        if (type === 'dayoff') {
          return multipleDates.map((d) => ({ date: d }))
        }
        return multipleDates.map((d) => ({ date: d, endDate: d }))
      }
    }

    const payload: { date: string; endDate?: string } = { date }
    if (type !== 'dayoff' && (isMultiDay || status?.endDate)) {
      payload.endDate = endDate
    }
    return [payload]
  }

  const validateStatus = async (targetUserId: string, startDate: string, endDateValue?: string): Promise<string | null> => {
    // Allow admin to validate without user
    if (!isAdmin && !user) return 'Пользователь не найден'

    const today = new Date()
    const selectedDate = new Date(startDate)
    const selectedEndDate = new Date(endDateValue || startDate)

    // Check if date is in the past for dayoff
    if (type === 'dayoff') {
      if (isSameDate(selectedDate, today)) {
        return 'Нельзя установить выходной на сегодня. Выберите смену или возьмите больничный.'
      }
    }

    // Check sick leave restrictions
    if (type === 'sick') {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const maxDate = new Date(todayStart)
      maxDate.setDate(maxDate.getDate() + 2)
      const selectedDateObj = new Date(startDate)
      selectedDateObj.setHours(0, 0, 0, 0)
      
      if (selectedDateObj < todayStart || selectedDateObj > maxDate) {
        return 'Больничный можно взять только на актуальную дату и + 2 суток. Нельзя выбрать заранее.'
      }

      const daysDiff = Math.ceil(
        (selectedEndDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1

      if (daysDiff < 1) {
        return 'Больничный должен быть минимум на 1 день'
      }

      if (daysDiff > 14) {
        return 'Больничный может длиться не более 14 календарных дней в месяце'
      }

      const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
      const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
      const existingStatuses = await getDayStatuses(targetUserId)
      const monthSickDays = existingStatuses.filter(
        (s) => s.type === 'sick' && s.date >= formatDate(monthStart, 'yyyy-MM-dd') && s.date <= formatDate(monthEnd, 'yyyy-MM-dd')
      )

      if (monthSickDays.length + daysDiff > 14) {
        return 'Больничный ограничен 14 днями в месяц'
      }
    }

    if (type === 'vacation') {
      const daysDiff = Math.ceil(
        (selectedEndDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1

      if (daysDiff > 14) {
        return 'Отпуск не может быть больше 14 дней в месяце'
      }

      const yearStart = new Date(selectedDate.getFullYear(), 0, 1)
      const yearEnd = new Date(selectedDate.getFullYear(), 11, 31)
      const existingStatuses = await getDayStatuses(targetUserId)
      const yearVacations = existingStatuses.filter(
        (s) => s.type === 'vacation' && s.date >= formatDate(yearStart, 'yyyy-MM-dd') && s.date <= formatDate(yearEnd, 'yyyy-MM-dd')
      )

      if (yearVacations.length >= 6) {
        return 'Не более 6 отпусков в год'
      }
    }

    if (type === 'dayoff') {
      const weekStart = new Date(selectedDate)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const existingStatuses = await getDayStatuses(targetUserId)
      let weekDayoffs = existingStatuses.filter(
        (s) => s.type === 'dayoff' && s.date >= formatDate(weekStart, 'yyyy-MM-dd') && s.date <= formatDate(weekEnd, 'yyyy-MM-dd')
      )

      if (status) {
        weekDayoffs = weekDayoffs.filter(s => s.id !== status.id)
      }

      if (weekDayoffs.length >= 2) {
        return 'Выходные на неделе ограничены максимум 2 днями'
      }

      const allStatuses = await getDayStatuses()
      const dateDayoffs = allStatuses.filter(
        (s) => s.type === 'dayoff' && s.date === startDate
      )
      const uniqueUsers = new Set(dateDayoffs.map(s => s.userId))
      
      if (status && status.type === 'dayoff' && status.date === startDate) {
        uniqueUsers.delete(status.userId)
      }
      
      if (uniqueUsers.size >= 3) {
        return 'На этот день уже установлено максимальное количество выходных (3 человека). Выберите другую дату.'
      }
    }

    return null
  }

  const handleSave = async () => {
    console.log('handleSave called (DayStatusForm)')
    // Allow admin to save statuses even without user
    if (!isAdmin && !user) {
      console.log('No user found')
      setError('Пользователь не найден')
      return
    }

    if (status && !isAdmin && user && status.userId !== user.id) {
      setError('Вы можете редактировать только свои статусы')
      setLoading(false)
      return
    }

    const targetUsers = getTargetUsers()
    if (targetUsers.length === 0) {
      setError('Выберите хотя бы одного участника')
      return
    }

    const datePayloads = getDatePayloads()
    if (datePayloads.length === 0) {
      setError('Выберите даты')
      return
    }

    const saveStatusFor = async (targetUserId: string, payload: { date: string; endDate?: string }) => {
      const validationError = await validateStatus(targetUserId, payload.date, payload.endDate)
      if (validationError) {
        throw new Error(`[${getMemberName(targetUserId)} • ${formatDate(payload.date, 'dd.MM.yyyy')}] ${validationError}`)
      }

      const statusData: Omit<DayStatus, 'id'> = {
        userId: targetUserId,
        date: payload.date,
        type,
        ...(payload.endDate && { endDate: payload.endDate }),
        ...(comment && { comment }),
      }

      if (status) {
        await updateDayStatus(status.id, statusData)
      } else {
        await addDayStatus(statusData)
      }
    }

    console.log('Starting save process...')
    setError('')
    setLoading(true)

    try {
      if (status) {
        const payload: { date: string; endDate?: string } = { date }
        if (type !== 'dayoff' && (isMultiDay || status.endDate)) {
          payload.endDate = endDate
        }
        await saveStatusFor(status.userId, payload)
        onSave()
        return
      }

      for (const targetUserId of targetUsers) {
        for (const payload of datePayloads) {
          await saveStatusFor(targetUserId, payload)
        }
      }

      onSave()
    } catch (err: any) {
      console.error('Error saving day status:', err)
      const errorMessage = err.message || err.code || 'Ошибка при сохранении'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const typeLabels = {
    dayoff: 'Выходной',
    sick: 'Больничный',
    vacation: 'Отпуск',
  }

  const typeColors = {
    dayoff: 'bg-yellow-500',
    sick: 'bg-purple-500',
    vacation: 'bg-orange-500',
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto touch-manipulation">
      <div className={`w-full max-w-md rounded-lg sm:rounded-xl shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] overflow-y-auto my-4 sm:my-8`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className={`text-lg sm:text-xl font-bold ${headingColor} pr-2`}>
              {status ? 'Редактировать' : 'Добавить'} {typeLabels[type]}
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* User selection for admin when adding new status */}
            {adminBulkMode && (
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Участники
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {TEAM_MEMBERS.map((member) => (
                      <label
                        key={member.id}
                        className={`px-3 py-1.5 rounded-full border cursor-pointer text-sm flex items-center gap-2 ${
                          selectedUserIds.includes(member.id)
                            ? 'bg-green-500 border-green-500 text-white'
                            : theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-gray-200'
                            : 'bg-gray-100 border-gray-300 text-gray-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(member.id)}
                          onChange={() => toggleUserSelection(member.id)}
                          className="hidden"
                        />
                        {member.name}
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAllUsers}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    {selectedUserIds.length === TEAM_MEMBERS.length ? 'Снять выделение' : 'Выбрать всех'}
                  </button>
                </div>
              </div>
            )}

            {adminBulkMode && (
              <div>
                <p className={`text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Формат выбора дат
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: 'single', label: 'Один день' },
                    { value: 'range', label: type === 'dayoff' ? 'Диапазон (каждый день)' : 'Диапазон дат' },
                    { value: 'multiple', label: 'Конкретные даты' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        value={option.value}
                        checked={dateMode === option.value}
                        onChange={(e) => setDateMode(e.target.value as typeof dateMode)}
                      />
                      <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Date */}
            {(!adminBulkMode || dateMode === 'single') && (
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Дата начала
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
              </div>
            )}

            {adminBulkMode && dateMode === 'range' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Начало
                  </label>
                  <input
                    type="date"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Конец
                  </label>
                  <input
                    type="date"
                    value={rangeEnd}
                    min={rangeStart}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                  />
                </div>
              </div>
            )}

            {adminBulkMode && dateMode === 'multiple' && (
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Выбранные даты
                </label>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="date"
                      value={multiDateInput}
                      onChange={(e) => setMultiDateInput(e.target.value)}
                      className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-green-500`}
                    />
                    <button
                      type="button"
                      onClick={handleAddMultiDate}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Добавить
                    </button>
                  </div>
                  {multipleDates.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {multipleDates.map((d) => (
                        <span
                          key={d}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm"
                        >
                          {formatDate(d, 'dd.MM.yyyy')}
                          <button
                            type="button"
                            onClick={() => handleRemoveMultiDate(d)}
                            className="text-red-500 hover:text-red-600"
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Пока не выбрано ни одной даты</p>
                  )}
                </div>
              </div>
            )}

            {/* Multi-day toggle */}
            {(type === 'sick' || type === 'vacation') && (!adminBulkMode || dateMode === 'single') && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isMultiDay}
                  onChange={(e) => setIsMultiDay(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Несколько дней
                </span>
              </label>
            )}

            {/* End date */}
            {isMultiDay && (
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Дата окончания
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={date}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
              </div>
            )}

            {/* Comment */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Комментарий
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation resize-y ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Добавьте комментарий (необязательно)"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500 text-white rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className={`flex-1 px-4 py-2.5 sm:py-2 ${typeColors[type]} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100`}
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                onClick={onClose}
                className={`px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400'
                }`}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

