// Form for bulk deleting work slots
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { getWorkSlots, deleteWorkSlot } from '@/services/firestoreService'
import { formatDate } from '@/utils/dateUtils'
import { X, Trash2 } from 'lucide-react'
import { TEAM_MEMBERS } from '@/types'
import { useScrollLock } from '@/hooks/useScrollLock'

interface DeleteSlotsFormProps {
  onClose: () => void
  onSave: () => void
}

export const DeleteSlotsForm = ({ onClose, onSave }: DeleteSlotsFormProps) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(isAdmin ? [] : (user?.id ? [user.id] : []))
  const [deleteByWeekDay, setDeleteByWeekDay] = useState(false)
  const [deleteByDates, setDeleteByDates] = useState(false)
  const [deleteByDateRange, setDeleteByDateRange] = useState(false)
  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([])
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [currentDate, setCurrentDate] = useState('')
  const [dateRangeStart, setDateRangeStart] = useState('')
  const [dateRangeEnd, setDateRangeEnd] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useScrollLock()

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const activeMode = deleteByWeekDay ? 'По дню недели' : deleteByDates ? 'По датам' : deleteByDateRange ? 'Диапазон' : 'Не выбран'
  const selectionInfo = deleteByWeekDay
    ? (selectedWeekDays.length > 0 ? selectedWeekDays.map((d) => weekDays[d]).join(', ') : 'Дни недели')
    : deleteByDates
    ? (selectedDates[0] ? `${formatDate(selectedDates[0], 'dd.MM')} +${Math.max(selectedDates.length - 1, 0)}` : 'Добавьте даты')
    : deleteByDateRange
    ? (dateRangeStart && dateRangeEnd ? `${formatDate(dateRangeStart, 'dd.MM')}–${formatDate(dateRangeEnd, 'dd.MM')}` : 'Укажите диапазон')
    : 'Выберите режим'
  const selectedNames = selectedUserIds.map((id) => TEAM_MEMBERS.find((m) => m.id === id)?.name || id).join(', ')

  const handleWeekDayToggle = (checked: boolean) => {
    if (checked) {
      if (deleteByDates || deleteByDateRange) {
        setError('Снимите галочку с другой функции, чтобы активировать эту')
        return
      }
      setDeleteByWeekDay(true)
      setError('')
    } else {
      setDeleteByWeekDay(false)
      setSelectedWeekDays([])
    }
  }

  const handleDatesToggle = (checked: boolean) => {
    if (checked) {
      if (deleteByWeekDay || deleteByDateRange) {
        setError('Снимите галочку с другой функции, чтобы активировать эту')
        return
      }
      setDeleteByDates(true)
      setError('')
    } else {
      setDeleteByDates(false)
      setSelectedDates([])
      setCurrentDate('')
    }
  }

  const handleDateRangeToggle = (checked: boolean) => {
    if (checked) {
      if (deleteByWeekDay || deleteByDates) {
        setError('Снимите галочку с другой функции, чтобы активировать эту')
        return
      }
      setDeleteByDateRange(true)
      setError('')
    } else {
      setDeleteByDateRange(false)
      setDateRangeStart('')
      setDateRangeEnd('')
    }
  }

  const handleUserToggle = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId))
    } else {
      setSelectedUserIds([...selectedUserIds, userId])
    }
  }

  const addDate = () => {
    if (!currentDate) {
      setError('Выберите дату')
      return
    }
    if (selectedDates.includes(currentDate)) {
      setError('Эта дата уже добавлена')
      return
    }
    setSelectedDates([...selectedDates, currentDate].sort())
    setCurrentDate('')
    setError('')
  }

  const removeDate = (date: string) => {
    setSelectedDates(selectedDates.filter((d) => d !== date))
  }

  const handleDelete = async () => {
    // Allow admin to delete slots even without user
    if (!isAdmin && !user) {
      setError('Пользователь не найден')
      return
    }

    const targetUserIds = isAdmin ? selectedUserIds : (user ? [user.id] : [])
    if (targetUserIds.length === 0) {
      setError('Выберите хотя бы одного участника')
      return
    }

    if (!deleteByWeekDay && !deleteByDates && !deleteByDateRange) {
      setError('Выберите способ удаления слотов')
      return
    }

    if (deleteByWeekDay && selectedWeekDays.length === 0) {
      setError('Выберите день недели')
      return
    }

    if (deleteByDates && selectedDates.length === 0) {
      setError('Добавьте хотя бы одну дату')
      return
    }

    if (deleteByDateRange) {
      if (!dateRangeStart || !dateRangeEnd) {
        setError('Укажите начальную и конечную дату диапазона')
        return
      }
      if (dateRangeStart > dateRangeEnd) {
        setError('Начальная дата должна быть раньше конечной')
        return
      }
    }

    setError('')
    setLoading(true)

    try {
      // Get all slots for all selected users
      const allSlotsPromises = targetUserIds.map(userId => getWorkSlots(userId))
      const allSlotsArrays = await Promise.all(allSlotsPromises)
      const allSlots = allSlotsArrays.flat()
      
      let slotsToDelete: string[] = []

      if (deleteByWeekDay) {
        // Filter slots by day of week
        slotsToDelete = allSlots
          .filter((slot) => {
            const dateObj = new Date(slot.date + 'T00:00:00')
            const dayOfWeek = dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1
            return selectedWeekDays.includes(dayOfWeek)
          })
          .map((slot) => slot.id)
      } else if (deleteByDates) {
        // Filter slots by selected dates
        slotsToDelete = allSlots
          .filter((slot) => selectedDates.includes(slot.date))
          .map((slot) => slot.id)
      } else if (deleteByDateRange) {
        // Filter slots by date range
        slotsToDelete = allSlots
          .filter((slot) => slot.date >= dateRangeStart && slot.date <= dateRangeEnd)
          .map((slot) => slot.id)
      }

      if (slotsToDelete.length === 0) {
        setError('Слоты для удаления не найдены')
        setLoading(false)
        return
      }

      // Confirm deletion
      const usersText = targetUserIds.length > 1 
        ? `${targetUserIds.length} участников`
        : TEAM_MEMBERS.find(m => m.id === targetUserIds[0])?.name || 'участника'

      const weekDaysText = selectedWeekDays.map((d) => weekDays[d]).join(', ')
      const confirmMessage = deleteByWeekDay
        ? `Удалить все слоты ${usersText} на ${weekDaysText}? (${slotsToDelete.length} слотов)`
        : deleteByDateRange
        ? `Удалить все слоты ${usersText} с ${formatDate(dateRangeStart, 'dd.MM.yyyy')} по ${formatDate(dateRangeEnd, 'dd.MM.yyyy')}? (${slotsToDelete.length} слотов)`
        : `Удалить слоты ${usersText} на выбранные даты? (${slotsToDelete.length} слотов)`

      if (!confirm(confirmMessage)) {
        setLoading(false)
        return
      }

      // Delete all slots
      await Promise.all(slotsToDelete.map((id) => deleteWorkSlot(id)))

      onSave()
    } catch (err: any) {
      console.error('Error deleting slots:', err)
      const errorMessage = err.message || err.code || 'Ошибка при удалении слотов'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 sm:p-6 overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll">
      <div className={`w-full max-w-5xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${theme === 'dark' ? 'bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10' : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200'} max-h-[85dvh] sm:max-h-[calc(100dvh-96px)] flex flex-col overflow-hidden`}>
        <div className="flex-shrink-0 p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#4E6E49] font-semibold">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/30">
                  Очистка
                </span>
                <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>расписание</span>
              </div>
              <h3 className={`text-2xl sm:text-3xl font-bold ${headingColor}`}>
                Удаление слотов
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                Новый обзор: режим удаления, выбранные люди и диапазон видны сразу.
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2.5 rounded-full border flex-shrink-0 ${theme === 'dark' ? 'border-white/10 text-gray-200 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll px-5 sm:px-6 lg:px-7">
          <div className="mt-5 grid lg:grid-cols-[0.95fr_1.45fr] gap-4 lg:gap-6 min-w-0">
            {/* Navigation / summary */}
            <aside className={`rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'} p-4 sm:p-5 space-y-4 self-start`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Навигация</p>
                <span className="text-[11px] uppercase tracking-wide text-[#4E6E49] font-semibold">3 шага</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Участники', detail: selectedNames || 'Не выбрано', done: selectedUserIds.length > 0 || !isAdmin },
                  { label: 'Режим', detail: activeMode, done: activeMode !== 'Не выбран' },
                  { label: 'Параметры', detail: selectionInfo, done: selectionInfo !== 'Выберите режим' },
                ].map((step, index) => (
                  <div
                    key={step.label}
                    className={`flex items-start gap-3 rounded-xl border px-3 py-3 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}
                  >
                    <span className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step.done ? 'bg-[#4E6E49] text-white' : (theme === 'dark' ? 'bg-slate-800 text-gray-300' : 'bg-slate-200 text-slate-700')}`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{step.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{step.detail || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`rounded-xl border px-3 py-3 space-y-2 ${theme === 'dark' ? 'border-emerald-900/50 bg-emerald-900/20' : 'border-emerald-100 bg-emerald-50'}`}>
                <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">Подсказка</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-200">
                  Выберите только один способ удаления: по дню, по списку дат или по диапазону.
                </p>
              </div>
            </aside>

            <div className="space-y-4 overflow-y-auto overscroll-contain pr-1 pb-6 flex-1 min-h-0">
              {/* User selection for admin */}
            {isAdmin && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Участники {selectedUserIds.length > 0 && `(${selectedUserIds.length} выбрано)`}
                </label>
                <div className="flex flex-wrap gap-2">
                  {TEAM_MEMBERS.map((member) => {
                    const isSelected = selectedUserIds.includes(member.id)
                    return (
                      <button
                        key={member.id}
                        onClick={() => handleUserToggle(member.id)}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-red-500 text-white'
                            : theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {member.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Delete by week day option */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={deleteByWeekDay}
                onChange={(e) => handleWeekDayToggle(e.target.checked)}
                className="w-4 h-4"
              />
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Удалить по дню недели
              </span>
            </label>

            {deleteByWeekDay && (
              <div className="ml-6">
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Выберите дни недели:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {weekDays.map((day, index) => {
                    const isSelected = selectedWeekDays.includes(index)
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedWeekDays((prev) =>
                            prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index]
                          )
                        }}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-red-500 text-white'
                            : theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Delete by dates option */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={deleteByDates}
                onChange={(e) => handleDatesToggle(e.target.checked)}
                className="w-4 h-4"
              />
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Удалить по конкретным датам
              </span>
            </label>

            {deleteByDates && (
              <div className="ml-6 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-800 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  <button
                    onClick={addDate}
                    className="px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors"
                  >
                    Добавить
                  </button>
                </div>

                {/* Selected dates */}
                {selectedDates.length > 0 && (
                  <div className="space-y-2">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Выбранные даты ({selectedDates.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDates.map((date) => (
                        <div
                          key={date}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <span className={headingColor}>{formatDate(date, 'dd.MM.yyyy')}</span>
                          <button
                            onClick={() => removeDate(date)}
                            className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delete by date range option */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={deleteByDateRange}
                onChange={(e) => handleDateRangeToggle(e.target.checked)}
                className="w-4 h-4"
              />
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Удалить по диапазону дат
              </span>
            </label>

            {deleteByDateRange && (
              <div className="ml-6 space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Начальная дата
                    </label>
                    <input
                      type="date"
                      value={dateRangeStart}
                      onChange={(e) => setDateRangeStart(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    />
                  </div>
                  <div className="flex-1">
                    <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Конечная дата
                    </label>
                    <input
                      type="date"
                      value={dateRangeEnd}
                      onChange={(e) => setDateRangeEnd(e.target.value)}
                      min={dateRangeStart}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    />
                  </div>
                </div>
                {dateRangeStart && dateRangeEnd && (
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Будет удалено: с {formatDate(dateRangeStart, 'dd.MM.yyyy')} по {formatDate(dateRangeEnd, 'dd.MM.yyyy')}
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500 text-white rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading || (!deleteByWeekDay && !deleteByDates && !deleteByDateRange)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {loading ? 'Удаление...' : 'Удалить слоты'}
              </button>
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Отмена
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

