// Form for bulk deleting slots and statuses
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { getWorkSlots, deleteWorkSlot, getDayStatuses, deleteDayStatus, addApprovalRequest } from '@/services/firestoreService'
import { formatDate } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { X, Trash2 } from 'lucide-react'
import { TEAM_MEMBERS, DayStatus } from '@/types'
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

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(isAdmin ? [] : user?.id ? [user.id] : [])
  const [deleteType, setDeleteType] = useState<'slots' | 'dayoff' | 'sick' | 'vacation' | 'absence'>('slots')

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
  const selectionInfo = deleteByWeekDay
    ? (selectedWeekDays.length > 0 ? selectedWeekDays.map((d) => weekDays[d]).join(', ') : 'Дни недели')
    : deleteByDates
    ? (selectedDates[0] ? `${formatDate(selectedDates[0], 'dd.MM')} +${Math.max(selectedDates.length - 1, 0)}` : 'Добавьте даты')
    : deleteByDateRange
    ? (dateRangeStart && dateRangeEnd ? `${formatDate(dateRangeStart, 'dd.MM')}–${formatDate(dateRangeEnd, 'dd.MM')}` : 'Укажите диапазон')
    : 'Выберите режим'
  const selectedNames = selectedUserIds.map((id) => getUserNicknameSync(id)).join(', ')

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleMode = (setter: (v: boolean) => void, value: boolean, blockers: boolean[]) => {
    if (value && blockers.some(Boolean)) {
      setError('Снимите галочку с другой функции, чтобы активировать эту')
      return
    }
    setter(value)
    if (!value) setError('')
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

  const removeDate = (date: string) => setSelectedDates(selectedDates.filter((d) => d !== date))

  const handleDelete = async () => {
    if (!isAdmin && !user) {
      setError('Пользователь не найден')
      return
    }

    const targetUserIds = isAdmin ? selectedUserIds : user ? [user.id] : []
    if (targetUserIds.length === 0) {
      setError('Выберите хотя бы одного участника')
      return
    }
    if (!deleteByWeekDay && !deleteByDates && !deleteByDateRange) {
      setError('Выберите способ удаления')
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
      const allSlotsArrays = await Promise.all(targetUserIds.map((u) => getWorkSlots(u)))
      const allStatusesArrays = await Promise.all(targetUserIds.map((u) => getDayStatuses(u)))
      const allSlots = allSlotsArrays.flat()
      const allStatuses = allStatusesArrays.flat()

      const overlapsRange = (date: string, end?: string) => {
        if (!dateRangeStart || !dateRangeEnd) return false
        const endVal = end || date
        return !(endVal < dateRangeStart || date > dateRangeEnd)
      }
      const matchesDateList = (date: string, end?: string) => {
        if (selectedDates.length === 0) return false
        if (!end) return selectedDates.includes(date)
        return selectedDates.some((d) => d >= date && d <= (end || date))
      }
      const matchesWeekDays = (date: string, end?: string) => {
        if (selectedWeekDays.length === 0) return false
        const dates: string[] = []
        const start = new Date(date + 'T00:00:00')
        const endDate = end ? new Date(end + 'T00:00:00') : new Date(date + 'T00:00:00')
        let cursor = start
        while (cursor <= endDate) {
          dates.push(formatDate(cursor, 'yyyy-MM-dd'))
          cursor.setDate(cursor.getDate() + 1)
        }
        return dates.some((dStr) => {
          const d = new Date(dStr + 'T00:00:00')
          const dow = d.getDay() === 0 ? 6 : d.getDay() - 1
          return selectedWeekDays.includes(dow)
        })
      }

      let idsToDelete: string[] = []
      if (deleteType === 'slots') {
        idsToDelete = allSlots
          .filter((slot) => {
            if (deleteByWeekDay && matchesWeekDays(slot.date)) return true
            if (deleteByDates && selectedDates.includes(slot.date)) return true
            if (deleteByDateRange && overlapsRange(slot.date)) return true
            return false
          })
          .map((slot) => slot.id)
      } else {
        idsToDelete = allStatuses
          .filter((s: DayStatus) => {
            if (s.type !== deleteType) return false
            if (deleteByWeekDay && matchesWeekDays(s.date, s.endDate)) return true
            if (deleteByDates && matchesDateList(s.date, s.endDate)) return true
            if (deleteByDateRange && overlapsRange(s.date, s.endDate)) return true
            return false
          })
          .map((s) => s.id)
      }

      if (idsToDelete.length === 0) {
        setError('Ничего не найдено под выбранные условия')
        setLoading(false)
        return
      }

      const usersText =
        targetUserIds.length > 1
          ? `${targetUserIds.length} участников`
          : getUserNicknameSync(targetUserIds[0]) || 'участника'
      const weekDaysText = selectedWeekDays.map((d) => weekDays[d]).join(', ')
      const typeText =
        deleteType === 'slots'
          ? 'слоты'
          : deleteType === 'dayoff'
          ? 'выходные'
          : deleteType === 'sick'
          ? 'больничные'
          : deleteType === 'vacation'
          ? 'отпуска'
          : 'прогулы'
      const scopeText = deleteByWeekDay
        ? `по дням недели (${weekDaysText})`
        : deleteByDates
        ? `по датам: ${selectedDates.map((d) => formatDate(d, 'dd.MM')).join(', ')}`
        : `по диапазону ${formatDate(dateRangeStart, 'dd.MM')} — ${formatDate(dateRangeEnd, 'dd.MM')}`

      if (!confirm(`Удалить ${typeText} (${idsToDelete.length}) ${scopeText} для ${usersText}?`)) {
        setLoading(false)
        return
      }

      if (isAdmin) {
        // Админ удаляет напрямую
        if (deleteType === 'slots') {
          for (const id of idsToDelete) await deleteWorkSlot(id)
        } else {
          for (const id of idsToDelete) await deleteDayStatus(id)
        }
      } else {
        // Не-админ отправляет запросы на согласование
        if (deleteType === 'slots') {
          for (const id of idsToDelete) {
            const slot = allSlots.find(s => s.id === id)
            if (slot) {
              await addApprovalRequest({
                entity: 'slot',
                action: 'delete',
                authorId: user?.id || '',
                targetUserId: slot.userId,
                before: slot,
                after: null,
                comment: `Удаление слота ${formatDate(slot.date, 'dd.MM.yyyy')}`,
              })
            }
          }
        } else {
          for (const id of idsToDelete) {
            const status = allStatuses.find(s => s.id === id)
            if (status) {
              await addApprovalRequest({
                entity: 'status',
                action: 'delete',
                authorId: user?.id || '',
                targetUserId: status.userId,
                before: status,
                after: null,
                comment: `Удаление ${deleteType === 'dayoff' ? 'выходного' : deleteType === 'sick' ? 'больничного' : deleteType === 'vacation' ? 'отпуска' : 'прогула'} ${formatDate(status.date, 'dd.MM.yyyy')}`,
              })
            }
          }
        }
      }

      onSave()
      onClose()
    } catch (err) {
      console.error('Error deleting items:', err)
      setError('Ошибка при удалении')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 sm:p-6 overflow-y-auto overscroll-contain modal-scroll">
      <div className={`w-full max-w-5xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${theme === 'dark' ? 'bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10' : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200'} max-h-[85dvh] sm:max-h-[calc(100dvh-96px)] overflow-y-auto`}>
        <div className="p-5 sm:p-6 lg:p-7 flex flex-col h-full min-h-0 overflow-y-auto modal-scroll">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#4E6E49] tracking-tight">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/30">
                  Очистить расписание
                </span>
              </div>
              <h3 className={`text-2xl sm:text-3xl font-bold ${headingColor}`}>
                Удаление слотов и отсутствий
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-2.5 rounded-full border ${theme === 'dark' ? 'border-white/10 text-gray-200 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 grid lg:grid-cols-[0.95fr_1.45fr] gap-4 lg:gap-6 flex-1 overflow-hidden">
            {/* Summary */}
            <aside className={`rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'} p-4 sm:p-5 space-y-4 sticky top-0 self-start max-h-full overflow-y-auto`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Навигация</p>
                <span className="text-[11px] uppercase tracking-wide text-[#4E6E49] font-semibold">3 шага</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Участники', detail: selectedNames || 'Не выбрано', done: selectedUserIds.length > 0 || !isAdmin },
                  { label: 'Тип удаления', detail: deleteType === 'slots' ? 'Слоты' : deleteType === 'dayoff' ? 'Выходные' : deleteType === 'sick' ? 'Больничные' : deleteType === 'vacation' ? 'Отпуска' : 'Прогулы', done: true },
                  { label: 'Режим', detail: selectionInfo, done: selectionInfo !== 'Выберите режим' },
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
                  Один режим за раз: дни недели, конкретные даты или диапазон.
                </p>
              </div>
            </aside>

            <div className="space-y-4 overflow-y-auto overscroll-contain pr-1 pb-6 flex-1 min-h-0">
              {/* Type selection */}
              <div className="space-y-2">
                <p className={`text-sm font-semibold ${headingColor}`}>Что удаляем</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'slots', label: 'Слоты' },
                    { key: 'dayoff', label: 'Выходные' },
                    { key: 'sick', label: 'Больничные' },
                    { key: 'vacation', label: 'Отпуска' },
                    ...(isAdmin ? [{ key: 'absence', label: 'Прогулы' }] : []),
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setDeleteType(item.key as typeof deleteType)}
                      className={`px-3 py-1.5 rounded-lg border text-sm ${
                        deleteType === item.key
                          ? 'bg-red-500 text-white border-red-500'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-200 border-gray-700 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users (admin) */}
              {isAdmin && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold ${headingColor}`}>Участники</p>
                    <button
                      onClick={() =>
                        setSelectedUserIds((prev) =>
                          prev.length === TEAM_MEMBERS.length ? [] : TEAM_MEMBERS.map((m) => m.id)
                        )
                      }
                      className="text-xs text-[#4E6E49] font-semibold"
                    >
                      {selectedUserIds.length === TEAM_MEMBERS.length ? 'Снять выделение' : 'Выбрать всех'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TEAM_MEMBERS.map((member) => {
                      const isSelected = selectedUserIds.includes(member.id)
                      return (
                        <button
                          key={member.id}
                          onClick={() => handleUserToggle(member.id)}
                          className={`px-3 py-1.5 rounded-lg transition-colors text-sm ${
                            isSelected
                              ? 'bg-red-500 text-white'
                              : theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {getUserNicknameSync(member.id)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* By weekday */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={deleteByWeekDay}
                  onChange={(e) => toggleMode(setDeleteByWeekDay, e.target.checked, [deleteByDates, deleteByDateRange])}
                  className="w-4 h-4"
                />
                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Удалить по дню недели</span>
              </label>
              {deleteByWeekDay && (
                <div className="ml-6">
                  <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Выберите дни недели:</p>
                  <div className="flex gap-2 flex-wrap">
                    {weekDays.map((day, idx) => {
                      const active = selectedWeekDays.includes(idx)
                      return (
                        <button
                          key={day}
                          onClick={() =>
                            setSelectedWeekDays((prev) => (active ? prev.filter((d) => d !== idx) : [...prev, idx]))
                          }
                          className={`px-3 py-1 rounded-lg transition-colors ${
                            active
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

              {/* By dates */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={deleteByDates}
                  onChange={(e) => toggleMode(setDeleteByDates, e.target.checked, [deleteByWeekDay, deleteByDateRange])}
                  className="w-4 h-4"
                />
                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Удалить по конкретным датам</span>
              </label>
              {deleteByDates && (
                <div className="ml-6 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={currentDate}
                      onChange={(e) => setCurrentDate(e.target.value)}
                      className={`flex-1 px-4 py-2 rounded-lg border ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-red-500`}
                    />
                    <button
                      onClick={addDate}
                      className="px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors"
                    >
                      Добавить
                    </button>
                  </div>
                  {selectedDates.length > 0 && (
                    <div className="space-y-2">
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Выбранные даты ({selectedDates.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDates.map((d) => (
                          <div
                            key={d}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
                          >
                            <span className={headingColor}>{formatDate(d, 'dd.MM.yyyy')}</span>
                            <button
                              onClick={() => removeDate(d)}
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

              {/* By range */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={deleteByDateRange}
                  onChange={(e) => toggleMode(setDeleteByDateRange, e.target.checked, [deleteByWeekDay, deleteByDates])}
                  className="w-4 h-4"
                />
                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Удалить по диапазону дат</span>
              </label>
              {deleteByDateRange && (
                <div className="ml-6 space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Начальная дата</label>
                      <input
                        type="date"
                        value={dateRangeStart}
                        onChange={(e) => setDateRangeStart(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark' ? 'bg-gray-700 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-red-500`}
                      />
                    </div>
                    <div className="flex-1">
                      <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Конечная дата</label>
                      <input
                        type="date"
                        value={dateRangeEnd}
                        onChange={(e) => setDateRangeEnd(e.target.value)}
                        min={dateRangeStart}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          theme === 'dark' ? 'bg-gray-700 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'
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

              {error && <div className="p-3 bg-red-500 text-white rounded-lg text-sm">{error}</div>}

              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading || (!deleteByWeekDay && !deleteByDates && !deleteByDateRange)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {loading ? (isAdmin ? 'Удаление...' : 'Отправка на согласование...') : (isAdmin ? 'Очистить расписание' : 'Отправить на согласование')}
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