// Form for adding/editing day statuses (dayoff, sick, vacation)
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { addApprovalRequest, getDayStatuses, addDayStatus, updateDayStatus, checkRestriction } from '@/services/firestoreService'
import { formatDate, isSameDate, getDatesInRange, normalizeDatesList } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { X } from 'lucide-react'
import { DayStatus, TEAM_MEMBERS } from '@/types'
import { useScrollLock } from '@/hooks/useScrollLock'

interface DayStatusFormProps {
  type?: 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship'
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
  const [selectedType, setSelectedType] = useState<'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship' | null>(type || status?.type || null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [dateMode, setDateMode] = useState<'single' | 'range' | 'multiple'>('single')
  const [rangeStart, setRangeStart] = useState(initialDate)
  const [rangeEnd, setRangeEnd] = useState(initialDate)
  const [multiDateInput, setMultiDateInput] = useState(initialDate)
  const [multipleDates, setMultipleDates] = useState<string[]>([])

  // Повторы
  const [repeatWeek, setRepeatWeek] = useState(false)
  const [weekDaySelection, setWeekDaySelection] = useState<number[]>([])
  const [repeatMonth, setRepeatMonth] = useState(false)
  const [repeatDays, setRepeatDays] = useState<number[]>([])

  const adminBulkMode = isAdmin && !status
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  useScrollLock()

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

  useEffect(() => {
    if (!repeatWeek) setWeekDaySelection([])
  }, [repeatWeek])

  useEffect(() => {
    if (repeatMonth && date) {
      const d = new Date(date)
      const dow = d.getDay() === 0 ? 6 : d.getDay() - 1
      setRepeatDays([dow])
    }
  }, [repeatMonth, date])

  useEffect(() => {
    if (dateMode !== 'single') {
      setRepeatWeek(false)
      setWeekDaySelection([])
      setRepeatMonth(false)
      setRepeatDays([])
    }
  }, [dateMode])

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

  const getMemberName = (userId: string) => getUserNicknameSync(userId)

  const getDatePayloads = (currentType: 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship'): { date: string; endDate?: string }[] => {
    if (adminBulkMode) {
      if (dateMode === 'range') {
        if (rangeStart && rangeEnd) {
          if (currentType === 'dayoff') {
            return getDatesInRange(rangeStart, rangeEnd).map((d) => ({ date: d }))
          }
          return [{ date: rangeStart, endDate: rangeEnd }]
        }
        return []
      }
      if (dateMode === 'multiple') {
        if (currentType === 'dayoff') {
          return multipleDates.map((d) => ({ date: d }))
        }
        return multipleDates.map((d) => ({ date: d, endDate: d }))
      }
    }

    if (dateMode === 'single' && currentType === 'dayoff') {
      if (repeatMonth && repeatDays.length > 0) {
        const dates: string[] = []
        const startDate = new Date(date)
        const endDateMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
        const dowTarget = repeatDays[0]
        const cur = new Date(startDate)
        while (cur <= endDateMonth) {
          const dow = cur.getDay() === 0 ? 6 : cur.getDay() - 1
          if (dow === dowTarget) dates.push(formatDate(cur, 'yyyy-MM-dd'))
          cur.setDate(cur.getDate() + 1)
        }
        return dates.map((d) => ({ date: d }))
      }

      if (repeatWeek && weekDaySelection.length > 0) {
        const dates: string[] = []
        const startOfWeek = new Date(date)
        const currentDow = startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1
        startOfWeek.setDate(startOfWeek.getDate() - currentDow)
        for (let i = 0; i < 7; i++) {
          const d = new Date(startOfWeek)
          d.setDate(startOfWeek.getDate() + i)
          const dow = d.getDay() === 0 ? 6 : d.getDay() - 1
          if (weekDaySelection.includes(dow)) dates.push(formatDate(d, 'yyyy-MM-dd'))
        }
        return dates.map((d) => ({ date: d }))
      }
    }

    if (currentType === 'dayoff') {
      if (dateMode === 'range') {
        return getDatesInRange(rangeStart, rangeEnd).map((d) => ({ date: d }))
      }
      if (dateMode === 'multiple') {
        return multipleDates.map((d) => ({ date: d }))
      }
    }

    if (dateMode === 'range' && rangeStart && rangeEnd) {
      return [{ date: rangeStart, endDate: rangeEnd }]
    }
    if (dateMode === 'multiple') {
      return multipleDates.map((d) => ({ date: d, endDate: d }))
    }

    const payload: { date: string; endDate?: string } = { date }
    if (currentType !== 'dayoff' && (isMultiDay || status?.endDate)) {
      payload.endDate = endDate
    }
    return [payload]
  }

  const validateStatus = async (targetUserId: string, startDate: string, endDateValue: string | undefined, currentType: 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship'): Promise<string | null> => {
    // Админ может ставить любые даты без ограничений
    if (isAdmin) return null

    // Allow member validation only with user
    if (!user) return 'Пользователь не найден'

    const today = new Date()
    const selectedDate = new Date(startDate)
    const selectedEndDate = new Date(endDateValue || startDate)

    // Check if date is in the past for dayoff
    if (currentType === 'dayoff') {
      if (isSameDate(selectedDate, today)) {
        return 'Нельзя установить выходной на сегодня. Выберите смену или возьмите больничный.'
      }
    }

    // Check sick leave restrictions
    if (currentType === 'sick') {
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

    if (currentType === 'vacation') {
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

    if (currentType === 'dayoff') {
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

      if (weekDayoffs.length >= 4) {
        return 'Выходные на неделе ограничены максимум 4 днями'
      }
    }

    // Для статуса "Прогул" не нужны специальные ограничения, так как он устанавливается автоматически или админом

    return null
  }

  const handleSave = async () => {
    console.log('handleSave called (DayStatusForm)')
    if (!isAdmin && !user) {
      console.log('No user found')
      setError('Пользователь не найден')
      return
    }

    if (!selectedType) {
      setError('Выберите тип отсутствия')
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

    if (adminBulkMode && dateMode === 'range') {
      if (!rangeStart || !rangeEnd) {
        setError('Укажите даты начала и окончания')
        return
      }
      if (new Date(rangeEnd) < new Date(rangeStart)) {
        setError('Дата окончания не может быть раньше даты начала')
        return
      }
    }

    const datePayloads = getDatePayloads(selectedType)
    if (datePayloads.length === 0) {
      setError('Выберите даты')
      return
    }

    const saveStatusFor = async (targetUserId: string, payload: { date: string; endDate?: string }) => {
      if (!isAdmin) {
        // Check restrictions for status creation
        const restrictionCheck = await checkRestriction(selectedType, payload.date)
        if (restrictionCheck.restricted) {
          throw new Error(`[${getMemberName(targetUserId)} • ${formatDate(new Date(payload.date), 'dd.MM.yyyy')}] ${restrictionCheck.reason}`)
        }

        const validationError = await validateStatus(targetUserId, payload.date, payload.endDate, selectedType)
        if (validationError) {
          throw new Error(`[${getMemberName(targetUserId)} • ${formatDate(payload.date, 'dd.MM.yyyy')}] ${validationError}`)
        }
      }

      const statusData: DayStatus = {
        id: status?.id || '',
        userId: targetUserId,
        date: payload.date,
        type: selectedType,
        ...(payload.endDate && { endDate: payload.endDate }),
        ...(comment && { comment }),
      }

      if (isAdmin) {
        const { id: _id, ...payload } = statusData
        if (status) {
          await updateDayStatus(status.id, payload)
        } else {
          await addDayStatus(payload)
        }
      } else {
        await addApprovalRequest({
          entity: 'status',
          action: status ? 'update' : 'create',
          authorId: user?.id || targetUserId,
          targetUserId,
          before: status ? status : null,
          after: statusData,
          comment: comment || undefined,
        })
      }
    }

    console.log('Starting save process...')
    setError('')
    setLoading(true)

    try {
      if (status) {
        const payload: { date: string; endDate?: string } = { date }
        if (selectedType !== 'dayoff' && (isMultiDay || status.endDate)) {
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

  const typeColors = {
    dayoff: 'bg-orange-500',
    sick: 'bg-purple-500',
    vacation: 'bg-blue-500',
    absence: 'bg-yellow-500',
    truancy: 'bg-red-500',
    internship: 'bg-green-500',
  }


  const previewDates =
    adminBulkMode && dateMode === 'range'
      ? [`${formatDate(rangeStart, 'dd.MM')}–${formatDate(rangeEnd, 'dd.MM')}`]
      : adminBulkMode && dateMode === 'multiple'
        ? multipleDates.map((d) => formatDate(d, 'dd.MM'))
        : [formatDate(date, 'dd.MM')]
  const selectedNames = selectedUserIds.map((id) => getMemberName(id)).join(', ')

  const steps = [
    { label: 'Тип', detail: selectedType ? (selectedType === 'dayoff' ? 'Выходной' : selectedType === 'sick' ? 'Больничный' : selectedType === 'vacation' ? 'Отпуск' : selectedType === 'absence' ? 'Отсутствие' : selectedType === 'truancy' ? 'Прогул' : 'Стажировка') : 'Не выбран', done: !!selectedType, anchor: '#type' },
    { label: 'Members', detail: selectedNames || 'Не выбрано', done: selectedUserIds.length > 0 || !!status, anchor: '#members' },
    { label: 'Даты', detail: previewDates.slice(0, 2).join(' · '), done: previewDates.length > 0, anchor: '#dates' },
    { label: 'Комментарий', detail: comment ? 'Заполнен' : 'Необязателен', done: !!comment, anchor: '#notes' },
  ]
  const progress = Math.round((steps.filter((s) => s.done).length / steps.length) * 100)

  const dateModeOptions = [
    { value: 'single', label: 'Один день', hint: 'Быстрая отметка', icon: '•' },
    { value: 'range', label: selectedType === 'dayoff' ? 'Диапазон (каждый день)' : 'Диапазон дат', hint: 'Поток дней', icon: '⎯⎯' },
    { value: 'multiple', label: 'Конкретные даты', hint: 'Точечный выбор', icon: '◎' },
  ]

  const nounByType: Record<'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship', string> = {
    dayoff: 'выходной',
    sick: 'больничный',
    vacation: 'отпуск',
    absence: 'отсутствие',
    truancy: 'прогул',
    internship: 'стажировка',
  }

  const headingTitle = selectedType ? `${status ? 'Редактировать' : 'Добавить'} ${nounByType[selectedType]}` : 'Добавить отсутствие'

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 sm:p-6 touch-manipulation overflow-y-auto overscroll-contain modal-scroll">
      <div className={`w-full max-w-[52rem] rounded-3xl shadow-[0_28px_80px_rgba(0,0,0,0.55)] border ${theme === 'dark' ? 'bg-[#0b1222] border-white/10' : 'bg-white border-slate-200'} max-h-[85dvh] sm:max-h-[calc(100dvh-96px)] overflow-y-auto relative`}>
        <div className="relative p-4 sm:p-6 lg:p-7 flex flex-col h-full min-h-0 overflow-y-auto modal-scroll">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h3 className={`text-2xl sm:text-3xl font-bold ${headingColor}`}>
                {headingTitle}
              </h3>
              <div className="flex flex-wrap gap-2">
                {steps.map((step, idx) => (
                  <a
                    key={step.label}
                    href={step.anchor}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition ${step.done
                        ? 'bg-[#4E6E49] border-[#4E6E49] text-white shadow-sm'
                        : theme === 'dark'
                          ? 'border-white/15 bg-white/5 text-gray-200 hover:border-white/30'
                          : 'border-slate-200 bg-white text-gray-700 hover:border-slate-300'
                      }`}
                  >
                    <span className="font-semibold">{idx + 1}</span>
                    <span className="whitespace-nowrap">{step.label}</span>
                  </a>
                ))}
              </div>
              {type === 'dayoff' && (
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                  {['Один выходной', 'Диапазон дней', 'Несколько дат'].map((tip) => (
                    <span
                      key={tip}
                      className={`px-3 py-1.5 rounded-full border ${theme === 'dark' ? 'border-white/10 text-gray-200 bg-white/5' : 'border-slate-200 text-gray-700 bg-slate-50'
                        }`}
                    >
                      {tip}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className={`p-2.5 rounded-full border shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 ${theme === 'dark'
                  ? 'border-white/10 text-gray-200 hover:bg-white/5'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className={`mt-5 rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'} p-4 sm:p-5 shadow-inner`}>
            <div className="grid md:grid-cols-3 gap-3 md:gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 flex items-center justify-center text-emerald-600 dark:text-emerald-300 text-lg font-semibold border border-emerald-500/30">
                  👥
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{selectedNames || 'Не выбрано'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center text-blue-600 dark:text-blue-300 text-lg font-semibold border border-blue-500/30">
                  📅
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Даты</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {previewDates.length > 0 ? previewDates.join(' · ') : 'Не выбрано'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-amber-600 dark:text-amber-300 text-lg font-semibold border border-amber-500/30">
                  ✏️
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Комментарий</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{comment || 'Необязателен'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid lg:grid-cols-[0.9fr_1.4fr] gap-4 lg:gap-6 flex-1 overflow-hidden">
            {/* Navigation / summary */}
            <aside className={`rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'} p-4 sm:p-5 space-y-4 sticky top-2 self-start max-h-full overflow-y-auto`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Навигация</p>
                <span className="text-[11px] uppercase tracking-wide text-[#4E6E49] font-semibold">{steps.length} шага</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4E6E49] via-emerald-500 to-lime-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <a
                    key={step.label}
                    href={step.anchor}
                    className={`flex items-start gap-3 rounded-xl border px-3 py-3 transition ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:border-white/30' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                  >
                    <span className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step.done ? 'bg-[#4E6E49] text-white shadow-sm' : theme === 'dark' ? 'bg-slate-800 text-gray-300' : 'bg-slate-200 text-slate-700'
                      }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{step.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{step.detail || '—'}</p>
                    </div>
                    <span className="text-[11px] text-gray-400">{step.done ? '✓' : ''}</span>
                  </a>
                ))}
              </div>
            </aside>

            <div className="space-y-5 overflow-y-auto overscroll-contain pr-1 pb-6 flex-1 min-h-0">
              {/* Type selection */}
              {!status && !type && (
                <div id="type" className="scroll-mt-20 space-y-2">
                  <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Тип отсутствия
                  </p>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {[
                      { key: 'dayoff', label: 'Выходной', icon: '🌙' },
                      { key: 'sick', label: 'Больничный', icon: '🏥' },
                      { key: 'vacation', label: 'Отпуск', icon: '✈️' },
                      ...(isAdmin
                        ? [
                            { key: 'absence', label: 'Отсутствие', icon: '🚫' },
                            { key: 'truancy', label: 'Прогул', icon: '⚠️' },
                            { key: 'internship', label: 'Стажировка', icon: '🎓' },
                          ]
                        : []),
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setSelectedType(item.key as typeof selectedType)}
                        className={`px-4 py-3 rounded-xl border text-sm font-semibold transition ${selectedType === item.key
                            ? 'border-[#4E6E49] bg-[#4E6E49]/10 text-[#4E6E49] shadow-sm'
                            : theme === 'dark'
                              ? 'border-white/10 bg-white/5 text-gray-200 hover:border-white/30'
                              : 'border-slate-200 bg-white text-gray-800 hover:border-slate-300'
                          }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="block mt-1">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* User selection for admin when adding new status */}
              {adminBulkMode && (
                <div id="members" className="scroll-mt-20">
                  <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Members
                  </label>
                  <div className="space-y-3 rounded-2xl border border-dashed border-[#4E6E49]/30 p-3 sm:p-4 bg-[#4E6E49]/5 dark:bg-[#4E6E49]/10">
                    <div className="flex flex-wrap gap-2">
                      {TEAM_MEMBERS.map((member) => {
                        const active = selectedUserIds.includes(member.id)
                        return (
                          <label
                            key={member.id}
                            className={`px-3 py-1.5 rounded-full border cursor-pointer text-sm flex items-center gap-2 transition ${active
                                ? 'bg-[#4E6E49] border-[#4E6E49] text-white shadow-sm'
                                : theme === 'dark'
                                  ? 'bg-gray-800/60 border-gray-800 text-gray-200 hover:border-gray-600'
                                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => toggleUserSelection(member.id)}
                              className="hidden"
                            />
                            {getUserNicknameSync(member.id)}
                          </label>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Быстрый выбор</span>
                      <button
                        type="button"
                        onClick={handleSelectAllUsers}
                        className="text-sm text-[#4E6E49] hover:text-[#4E6E49] font-semibold"
                      >
                        {selectedUserIds.length === TEAM_MEMBERS.length ? 'Снять выделение' : 'Выбрать всех'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {adminBulkMode && (
                <div id="dates" className="scroll-mt-20">
                  <p className={`text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Формат выбора дат
                  </p>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {dateModeOptions.map((option) => {
                      const active = dateMode === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setDateMode(option.value as typeof dateMode)}
                          className={`w-full text-left px-3 py-3 rounded-xl border transition flex flex-col gap-1 ${active
                              ? 'border-[#4E6E49] bg-[#4E6E49]/10 text-[#4E6E49] shadow-sm'
                              : theme === 'dark'
                                ? 'border-white/10 bg-white/5 text-gray-200 hover:border-white/30'
                                : 'border-slate-200 bg-white text-gray-800 hover:border-slate-300'
                            }`}
                        >
                          <span className="text-lg leading-none">{option.icon}</span>
                          <span className="text-sm font-semibold">{option.label}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{option.hint}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {!adminBulkMode && type === 'dayoff' && (
                <div id="dates" className="scroll-mt-20">
                  <p className={`text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Формат выбора дат
                  </p>
                  <div className="grid sm:grid-cols-3 gap-2">
                    {dateModeOptions.map((option) => {
                      const active = dateMode === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setDateMode(option.value as typeof dateMode)}
                          className={`w-full text-left px-3 py-3 rounded-xl border transition flex flex-col gap-1 ${active
                              ? 'border-[#4E6E49] bg-[#4E6E49]/10 text-[#4E6E49] shadow-sm'
                              : theme === 'dark'
                                ? 'border-white/10 bg-white/5 text-gray-200 hover:border-white/30'
                                : 'border-slate-200 bg-white text-gray-800 hover:border-slate-300'
                            }`}
                        >
                          <span className="text-lg leading-none">{option.icon}</span>
                          <span className="text-sm font-semibold">{option.label}</span>
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{option.hint}</span>
                        </button>
                      )
                    })}
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
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-800 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
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
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
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
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                    />
                  </div>
                </div>
              )}

              {!adminBulkMode && type === 'dayoff' && dateMode === 'range' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Начало
                    </label>
                    <input
                      type="date"
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
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
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
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
                        className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-800 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
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

              {!adminBulkMode && type === 'dayoff' && dateMode === 'multiple' && (
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
                        className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-800 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                          } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
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

              {/* Повторы на неделю и месяц - только для выходного */}
              {dateMode === 'single' && !adminBulkMode && selectedType === 'dayoff' && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm sm:text-base font-semibold ${headingColor}`}>Повтор на неделю</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Выберите дни текущей недели</p>
                      </div>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={repeatWeek}
                          onChange={(e) => setRepeatWeek(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Активировать</span>
                      </label>
                    </div>
                    {repeatWeek && (
                      <div className="flex flex-wrap gap-2">
                        {weekDays.map((day, idx) => {
                          const active = weekDaySelection.includes(idx)
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() =>
                                setWeekDaySelection((prev) => (active ? prev.filter((d) => d !== idx) : [...prev, idx]))
                              }
                              className={`px-3 py-1 rounded-lg border text-sm ${active
                                  ? 'border-[#4E6E49] bg-[#4E6E49]/10 text-[#4E6E49]'
                                  : theme === 'dark'
                                    ? 'border-white/10 bg-white/5 text-gray-200'
                                    : 'border-gray-200 bg-white text-gray-800'
                                }`}
                            >
                              {day}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-3 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm sm:text-base font-semibold ${headingColor}`}>Повтор по месяцу</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>На тот же день недели до конца месяца</p>
                      </div>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={repeatMonth}
                          onChange={(e) => setRepeatMonth(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Активировать</span>
                      </label>
                    </div>
                    {repeatMonth && (
                      <div className="flex flex-wrap gap-2">
                        {weekDays.map((day, idx) => (
                          <span
                            key={day}
                            className={`px-3 py-1 rounded-lg border text-sm ${repeatDays.includes(idx)
                                ? 'border-[#4E6E49] bg-[#4E6E49]/10 text-[#4E6E49]'
                                : theme === 'dark'
                                  ? 'border-white/10 bg-white/5 text-gray-200'
                                  : 'border-gray-200 bg-white text-gray-800'
                              }`}
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Multi-day toggle */}
              {(selectedType === 'sick' || selectedType === 'vacation') && (!adminBulkMode || dateMode === 'single') && (
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
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-800 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
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
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation resize-y ${theme === 'dark'
                      ? 'bg-gray-700 border-gray-800 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
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
                  disabled={loading || !selectedType}
                  className={`flex-1 px-4 py-2.5 sm:py-2 ${selectedType ? typeColors[selectedType] : 'bg-gray-400'} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100`}
                >
                  {loading ? 'Отправка...' : isAdmin ? 'Сохранить' : 'Отправить на согласование'}
                </button>
                <button
                  onClick={onClose}
                  className={`px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400'
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

