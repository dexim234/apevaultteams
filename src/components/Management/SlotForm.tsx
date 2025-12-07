// Form for adding/editing work slots
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { addWorkSlot, updateWorkSlot, getWorkSlots } from '@/services/firestoreService'
import { calculateHours, timeOverlaps, formatDate, getDatesInRange, normalizeDatesList, parseTime } from '@/utils/dateUtils'
import { X, Plus, Trash2, Edit } from 'lucide-react'
import { WorkSlot, TimeSlot, TEAM_MEMBERS } from '@/types'

interface SlotFormProps {
  slot?: WorkSlot | null
  onClose: () => void
  onSave: () => void
}

export const SlotForm = ({ slot, onClose, onSave }: SlotFormProps) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const initialDate = slot?.date || formatDate(new Date(), 'yyyy-MM-dd')
  const [date, setDate] = useState(initialDate)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    slot?.userId ? [slot.userId] : user?.id ? [user.id] : []
  )
  const [slots, setSlots] = useState<TimeSlot[]>(
    slot?.slots?.map(s => {
      // Convert old format (break) to new format (breaks array) for backward compatibility
      const oldSlot = s as any
      if (oldSlot.break && !oldSlot.breaks) {
        return { ...s, breaks: [oldSlot.break] }
      }
      return s
    }) || []
  )
  const [currentStart, setCurrentStart] = useState('')
  const [currentEnd, setCurrentEnd] = useState('')
  const [crossesMidnight, setCrossesMidnight] = useState(false)
  const [currentEndDate, setCurrentEndDate] = useState('')
  const [currentBreakStart, setCurrentBreakStart] = useState('')
  const [currentBreakEnd, setCurrentBreakEnd] = useState('')
  const [editingTimeSlotIndex, setEditingTimeSlotIndex] = useState<number | null>(null)
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null)
  const [editBreakSlotIndex, setEditBreakSlotIndex] = useState<number | null>(null)
  const [editBreakIndex, setEditBreakIndex] = useState<number | null>(null)
  const [comment, setComment] = useState(slot?.comment || '')
  const [repeatMonth, setRepeatMonth] = useState(false)
  const [repeatDays, setRepeatDays] = useState<number[]>([])
  const [repeatAllDays, setRepeatAllDays] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [dateMode, setDateMode] = useState<'single' | 'range' | 'multiple'>('single')
  const [rangeStart, setRangeStart] = useState(initialDate)
  const [rangeEnd, setRangeEnd] = useState(initialDate)
  const [multiDateInput, setMultiDateInput] = useState(initialDate)
  const [multipleDates, setMultipleDates] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // Lock background scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const adminBulkMode = isAdmin && !slot

  useEffect(() => {
    console.log('SlotForm mounted, user:', user?.name, 'slots count:', slots.length)
  }, [])

  useEffect(() => {
    if (repeatMonth && date) {
      const dateObj = new Date(date)
      const dayOfWeek = dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1
      setRepeatDays([dayOfWeek])
    }
  }, [repeatMonth, date])

  useEffect(() => {
    if (dateMode !== 'single') {
      setRepeatMonth(false)
      setRepeatAllDays(false)
      setRepeatDays([])
      setSelectedDays([])
    }
  }, [dateMode])

  useEffect(() => {
    // Auto-calculate end date if crossing midnight
    if (crossesMidnight && date && currentStart && currentEnd) {
      if (currentStart >= currentEnd) {
        // Slot crosses midnight - end date is next day
        const startDate = new Date(date)
        startDate.setDate(startDate.getDate() + 1)
        setCurrentEndDate(formatDate(startDate, 'yyyy-MM-dd'))
      } else {
        // Same day slot
        setCurrentEndDate('')
      }
    } else {
      setCurrentEndDate('')
    }
  }, [crossesMidnight, date, currentStart, currentEnd])

  const addOrUpdateTimeSlot = () => {
    if (!currentStart || !currentEnd) {
      setError('Заполните время начала и окончания')
      return
    }

    // Check if slot crosses midnight
    const slotCrossesMidnight = crossesMidnight && currentStart >= currentEnd

    if (!slotCrossesMidnight && currentStart >= currentEnd) {
      setError('Время окончания должно быть позже времени начала. Включите "Переходит через полночь" для слотов, переходящих на следующий день.')
      return
    }

    // Calculate end date if crossing midnight
    let endDate: string | undefined = undefined
    if (slotCrossesMidnight && date) {
      if (currentEndDate) {
        endDate = currentEndDate
      } else {
        // Auto-calculate: next day
        const startDate = new Date(date)
        startDate.setDate(startDate.getDate() + 1)
        endDate = formatDate(startDate, 'yyyy-MM-dd')
      }
    }

    // Add slot without breaks initially (breaks can be added separately)
    const baseBreaks = editingTimeSlotIndex !== null ? (slots[editingTimeSlotIndex]?.breaks || []) : []
    const newSlot: TimeSlot = {
      start: currentStart,
      end: currentEnd,
      ...(endDate && { endDate }),
      breaks: baseBreaks
    }

    if (editingTimeSlotIndex !== null) {
      const updated = [...slots]
      updated[editingTimeSlotIndex] = newSlot
      setSlots(updated)
    } else {
      setSlots([...slots, newSlot])
    }

    setCurrentStart('')
    setCurrentEnd('')
    setCrossesMidnight(false)
    setCurrentEndDate('')
    setCurrentBreakStart('')
    setCurrentBreakEnd('')
    setEditingTimeSlotIndex(null)
    setCurrentSlotIndex(null)
    setError('')
  }

  const startEditTimeSlot = (index: number) => {
    const slotToEdit = slots[index]
    if (!slotToEdit) return

    const slotCrossesMidnight = !!slotToEdit.endDate || parseTime(slotToEdit.end) <= parseTime(slotToEdit.start)

    setCurrentStart(slotToEdit.start)
    setCurrentEnd(slotToEdit.end)
    setCrossesMidnight(slotCrossesMidnight)
    setCurrentEndDate(slotToEdit.endDate || '')
    setEditingTimeSlotIndex(index)
    // Сброс редактирования перерывов, чтобы не конфликтовать с редактированием времени
    setCurrentSlotIndex(null)
    setEditBreakSlotIndex(null)
    setEditBreakIndex(null)
    setCurrentBreakStart('')
    setCurrentBreakEnd('')
    setError('')
  }

  const cancelEditTimeSlot = () => {
    setEditingTimeSlotIndex(null)
    setCurrentStart('')
    setCurrentEnd('')
    setCrossesMidnight(false)
    setCurrentEndDate('')
    setError('')
  }

  const addBreakToSlot = (slotIndex: number) => {
    if (!currentBreakStart || !currentBreakEnd) {
      setError('Заполните время начала и окончания перерыва')
      return
    }

    const slot = slots[slotIndex]
    if (!slot) return

    if (currentBreakStart >= currentBreakEnd) {
      setError('Время окончания перерыва должно быть позже времени начала')
      return
    }

    // Check if break is within slot time
    // Convert times to minutes for proper comparison
    const breakStartMin = parseTime(currentBreakStart)
    const breakEndMin = parseTime(currentBreakEnd)
    const slotStartMin = parseTime(slot.start)
    const slotEndMin = parseTime(slot.end)
    
    // Handle slots that cross midnight (endDate exists or end < start in minutes)
    const slotCrossesMidnight = slot.endDate || slotEndMin <= slotStartMin
    
    let breakWithinSlot = false
    
    if (slotCrossesMidnight) {
      // Slot crosses midnight (e.g., 20:00-02:00)
      // Break can be:
      // 1. Entirely in first part: from slot.start to 23:59
      // 2. Entirely in second part: from 00:00 to slot.end
      // 3. Spans across midnight: starts before midnight, ends after midnight
      
      const minutesInDay = 24 * 60 // 1440 minutes
      
      // Case 1: Break entirely in first part (same day)
      const breakInFirstPart = breakStartMin >= slotStartMin && breakStartMin < minutesInDay &&
                                breakEndMin > breakStartMin && breakEndMin <= minutesInDay &&
                                breakEndMin > breakStartMin
      
      // Case 2: Break entirely in second part (next day)
      const breakInSecondPart = breakStartMin >= 0 && breakStartMin <= slotEndMin &&
                                 breakEndMin > breakStartMin && breakEndMin <= slotEndMin
      
      // Case 3: Break spans across midnight (starts in first part, ends in second part)
      const breakSpansMidnight = breakStartMin >= slotStartMin && breakStartMin < minutesInDay &&
                                  breakEndMin > 0 && breakEndMin <= slotEndMin &&
                                  breakStartMin > breakEndMin // Start is later in day than end
      
      breakWithinSlot = breakInFirstPart || breakInSecondPart || breakSpansMidnight
    } else {
      // Regular slot (same day) - break must be between slot.start and slot.end
      // Break start must be >= slot start and break end must be <= slot end
      breakWithinSlot = breakStartMin >= slotStartMin && breakEndMin <= slotEndMin && 
                        breakEndMin > breakStartMin
    }
    
    if (!breakWithinSlot) {
      setError(`Перерыв должен быть в пределах времени слота (${slot.start} - ${slot.end})`)
      return
    }

    // Check for overlapping breaks (exclude the break being edited)
    const existingBreaks = slot.breaks || []
    for (let i = 0; i < existingBreaks.length; i++) {
      if (editBreakSlotIndex === slotIndex && editBreakIndex === i) {
        continue // Skip the break being edited
      }
      const existingBreak = existingBreaks[i]
      if (
        (currentBreakStart >= existingBreak.start && currentBreakStart < existingBreak.end) ||
        (currentBreakEnd > existingBreak.start && currentBreakEnd <= existingBreak.end) ||
        (currentBreakStart <= existingBreak.start && currentBreakEnd >= existingBreak.end)
      ) {
        setError('Перерывы не должны пересекаться')
        return
      }
    }

    let newBreaks: { start: string; end: string }[]
    if (editBreakSlotIndex === slotIndex && editBreakIndex !== null) {
      // Edit existing break
      newBreaks = [...existingBreaks]
      newBreaks[editBreakIndex] = { start: currentBreakStart, end: currentBreakEnd }
      newBreaks.sort((a, b) => a.start.localeCompare(b.start))
    } else {
      // Add new break
      newBreaks = [...existingBreaks, { start: currentBreakStart, end: currentBreakEnd }]
        .sort((a, b) => a.start.localeCompare(b.start))
    }

    const updatedSlots = [...slots]
    updatedSlots[slotIndex] = {
      ...slot,
      breaks: newBreaks
    }

    setSlots(updatedSlots)
    setCurrentBreakStart('')
    setCurrentBreakEnd('')
    setCurrentSlotIndex(null)
    setEditBreakSlotIndex(null)
    setEditBreakIndex(null)
    setError('')
  }

  const startEditBreak = (slotIndex: number, breakIndex: number) => {
    const slot = slots[slotIndex]
    if (!slot || !slot.breaks || !slot.breaks[breakIndex]) return
    
    const breakTime = slot.breaks[breakIndex]
    setEditBreakSlotIndex(slotIndex)
    setEditBreakIndex(breakIndex)
    setCurrentSlotIndex(slotIndex)
    setCurrentBreakStart(breakTime.start)
    setCurrentBreakEnd(breakTime.end)
    setError('')
  }

  const cancelEditBreak = () => {
    setCurrentBreakStart('')
    setCurrentBreakEnd('')
    setCurrentSlotIndex(null)
    setEditBreakSlotIndex(null)
    setEditBreakIndex(null)
    setError('')
  }

  const removeBreakFromSlot = (slotIndex: number, breakIndex: number) => {
    const slot = slots[slotIndex]
    if (!slot || !slot.breaks) return

    const updatedBreaks = slot.breaks.filter((_, i) => i !== breakIndex)
    const updatedSlots = [...slots]
    updatedSlots[slotIndex] = {
      ...slot,
      breaks: updatedBreaks.length > 0 ? updatedBreaks : undefined
    }

    setSlots(updatedSlots)
  }

  const removeTimeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index))
    if (editingTimeSlotIndex === index) {
      cancelEditTimeSlot()
    }
  }

  const handleDayToggle = (dayIndex: number) => {
    if (repeatDays.includes(dayIndex)) {
      setRepeatDays(repeatDays.filter((d) => d !== dayIndex))
    } else {
      setRepeatDays([...repeatDays, dayIndex])
    }
  }

  const handleSelectedDaysToggle = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayIndex))
    } else {
      setSelectedDays([...selectedDays, dayIndex])
    }
  }

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

  const getTargetDates = (): string[] => {
    if (adminBulkMode) {
      if (dateMode === 'range') {
        return getDatesInRange(rangeStart, rangeEnd)
      }
      if (dateMode === 'multiple') {
        return multipleDates
      }
    }
    return [date]
  }

  const getTargetUsers = (): string[] => {
    if (slot) {
      return [slot.userId]
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

  const getMemberName = (userId: string): string => {
    return TEAM_MEMBERS.find((member) => member.id === userId)?.name || userId
  }

  const validateSlot = async (slotDate: string, timeSlots: TimeSlot[]): Promise<string | null> => {
    // Get all existing slots on this date (excluding the current slot if editing)
    const allExistingSlots = await getWorkSlots(undefined, slotDate)
    const existingSlots = allExistingSlots.filter(s => s.id !== slot?.id)
    
    // Check max 3 people per slot (for overlapping times)
    for (const timeSlot of timeSlots) {
      for (const existingSlot of existingSlots) {
        if (timeOverlaps(timeSlot, existingSlot.slots[0])) {
          const overlappingCount = existingSlot.participants.length
          if (overlappingCount >= 3) {
            return `Слот ${timeSlot.start}-${timeSlot.end} уже занят максимальным количеством участников (3)`
          }
        }
      }
    }

    return null
  }

  const handleSave = async () => {
    console.log('handleSave called')
    // Allow admin to save slots even without user
    if (!isAdmin && !user) {
      console.log('No user found')
      setError('Пользователь не найден')
      return
    }

    if (slots.length === 0) {
      setError('Добавьте хотя бы один временной интервал')
      return
    }

    // Check if user can edit this slot
    if (slot && !isAdmin && user && slot.userId !== user.id) {
      setError('Вы можете редактировать только свои слоты')
      setLoading(false)
      return
    }

    const targetUsers = getTargetUsers()
    if (targetUsers.length === 0) {
      setError('Выберите хотя бы одного участника')
      return
    }

    const targetDates = getTargetDates()
    if (targetDates.length === 0) {
      setError('Выберите даты')
      return
    }

    const createSlotForUserDate = async (targetUserId: string, dateStr: string, participants: string[] = [targetUserId]) => {
      const validationError = await validateSlot(dateStr, slots)
      if (validationError) {
        throw new Error(`[${getMemberName(targetUserId)} • ${formatDate(new Date(dateStr), 'dd.MM.yyyy')}] ${validationError}`)
      }

      const slotData: Omit<WorkSlot, 'id'> = {
        userId: targetUserId,
        date: dateStr,
        slots,
        ...(comment && { comment }),
        participants,
      }

      if (slot) {
        await updateWorkSlot(slot.id, slotData)
      } else {
        await addWorkSlot(slotData)
      }
    }

    console.log('Starting save process...')
    setError('')
    setLoading(true)

    try {
      if (slot) {
        await createSlotForUserDate(slot.userId, date, slot.participants || [slot.userId])
        onSave()
        return
      }

      if (repeatMonth && repeatDays.length > 0) {
        const dateObj = new Date(date)
        const month = dateObj.getMonth()
        const year = dateObj.getFullYear()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        for (let day = 1; day <= daysInMonth; day++) {
          const checkDate = new Date(year, month, day)
          const dayOfWeek = checkDate.getDay() === 0 ? 6 : checkDate.getDay() - 1
          if (repeatDays.includes(dayOfWeek)) {
            const dateStr = formatDate(checkDate, 'yyyy-MM-dd')
            for (const targetUserId of targetUsers) {
              await createSlotForUserDate(targetUserId, dateStr)
            }
          }
        }
      } else if (repeatAllDays && selectedDays.length > 0) {
        const dateObj = new Date(date)
        const month = dateObj.getMonth()
        const year = dateObj.getFullYear()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        for (let day = 1; day <= daysInMonth; day++) {
          const checkDate = new Date(year, month, day)
          const dayOfWeek = checkDate.getDay() === 0 ? 6 : checkDate.getDay() - 1
          if (selectedDays.includes(dayOfWeek)) {
            const dateStr = formatDate(checkDate, 'yyyy-MM-dd')
            for (const targetUserId of targetUsers) {
              await createSlotForUserDate(targetUserId, dateStr)
            }
          }
        }
      } else if (adminBulkMode && dateMode !== 'single') {
        for (const dateStr of targetDates) {
          for (const targetUserId of targetUsers) {
            await createSlotForUserDate(targetUserId, dateStr)
          }
        }
      } else {
        for (const targetUserId of targetUsers) {
          await createSlotForUserDate(targetUserId, date)
        }
      }

      onSave()
    } catch (err: any) {
      console.error('Error saving slot:', err)
      const errorMessage = err.message || err.code || 'Ошибка при сохранении'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const targetDatesPreview = adminBulkMode ? getTargetDates() : [date]
  const selectedNames = selectedUserIds.map((id) => getMemberName(id)).join(', ')
  const timeSummary = slots.map((s) => `${s.start}–${s.end}${s.endDate ? ' (+1)' : ''}`)

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-center justify-center z-50 p-4 sm:p-6 touch-manipulation overflow-y-auto overscroll-contain">
      <div className={`w-full max-w-5xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${theme === 'dark' ? 'bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10' : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200'} max-h-[90vh] overflow-y-auto`}>
        <div className="p-4 sm:p-6 lg:p-7 flex flex-col h-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#4E6E49] font-semibold">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4E6E49]/10 text-[#4E6E49] border border-[#4E6E49]/30">
                  {slot ? 'Редактирование' : 'Создание'} слота
                </span>
                <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  расписание
                </span>
              </div>
              <h3 className={`text-2xl sm:text-3xl font-bold ${headingColor}`}>
                {slot ? 'Редактировать слот' : 'Добавить слот'}
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                Новая оболочка с акцентом на шаги: участники → даты → время → заметки.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-2 rounded-xl border text-xs sm:text-sm ${theme === 'dark' ? 'border-white/10 bg-white/5 text-gray-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                {slot ? 'Редактирование' : 'Создание'} · {slots.length || 0} интервал(ов)
              </div>
              <button
                onClick={onClose}
                className={`p-2.5 rounded-full border ${theme === 'dark' ? 'border-white/10 text-gray-200 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'} transition-colors touch-manipulation`}
                aria-label="Закрыть"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="mt-5 grid lg:grid-cols-[0.9fr_1.6fr] gap-4 lg:gap-6 flex-1 overflow-hidden">
            {/* Navigation / summary column */}
            <aside className={`rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'} p-4 sm:p-5 space-y-4 sticky top-0 self-start max-h-full overflow-y-auto`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Навигация</p>
                <span className="text-[11px] uppercase tracking-wide text-[#4E6E49] font-semibold">4 шага</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Участники', detail: selectedNames || 'Не выбрано', done: selectedUserIds.length > 0 || !!slot },
                  { label: 'Даты', detail: targetDatesPreview.slice(0, 2).map((d) => formatDate(d, 'dd.MM')).join(', ') || 'Выберите дату', done: targetDatesPreview.length > 0 },
                  { label: 'Время', detail: timeSummary.slice(0, 2).join(' · ') || 'Добавьте интервал', done: slots.length > 0 },
                  { label: 'Комментарий', detail: comment ? 'Заполнен' : 'Необязателен', done: !!comment },
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`rounded-xl border px-3 py-3 space-y-2 ${theme === 'dark' ? 'border-emerald-900/50 bg-emerald-900/20' : 'border-emerald-100 bg-emerald-50'}`}>
                <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">Подсказка</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-200">
                  Формы теперь разбиты на блоки: вы свободно переключаетесь между шагами, не теряя данных.
                </p>
              </div>
            </aside>

            {/* Form column */}
            <div className="space-y-4 overflow-y-auto pr-1 pb-4">
              {/* User selection for admin when adding new slot */}
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
                            ? 'bg-[#4E6E49] border-[#4E6E49] text-white'
                            : theme === 'dark'
                            ? 'bg-gray-700 border-gray-800 text-gray-200'
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
                    className="text-sm text-[#4E6E49] hover:text-[#4E6E49]"
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
                    { value: 'range', label: 'Диапазон дат' },
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
                  Дата
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                    theme === 'dark'
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
                  Начало диапазона
                </label>
                  <input
                    type="date"
                    value={rangeStart}
                    onChange={(e) => setRangeStart(e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-800 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Конец диапазона
                  </label>
                  <input
                    type="date"
                    value={rangeEnd}
                    min={rangeStart}
                    onChange={(e) => setRangeEnd(e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                      theme === 'dark'
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
                      className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                        theme === 'dark'
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

            {/* Time slots */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Временные слоты
              </label>
              <div className="space-y-2 mb-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-2 flex-1">
                    <input
                      type="time"
                      value={currentStart}
                      onChange={(e) => setCurrentStart(e.target.value)}
                      className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                      placeholder="Начало"
                    />
                    <span className="mx-1 sm:mx-2 text-gray-500 text-sm sm:text-base flex items-center">—</span>
                    <input
                      type="time"
                      value={currentEnd}
                      onChange={(e) => setCurrentEnd(e.target.value)}
                      className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                      placeholder="Окончание"
                    />
                  </div>
                </div>
                
                {/* Cross midnight option */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="crossMidnight"
                    checked={crossesMidnight}
                    onChange={(e) => {
                      setCrossesMidnight(e.target.checked)
                      if (!e.target.checked) {
                        setCurrentEndDate('')
                      }
                    }}
                    className={`w-4 h-4 rounded border-2 ${
                      theme === 'dark'
                        ? 'border-gray-800 bg-gray-700 checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                        : 'border-gray-300 bg-white checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                    } focus:ring-2 focus:ring-[#4E6E49] cursor-pointer touch-manipulation`}
                  />
                  <label
                    htmlFor="crossMidnight"
                    className={`text-xs sm:text-sm font-medium cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Переходит через полночь (на следующий день)
                  </label>
                </div>

                {/* End date input (if crossing midnight) */}
                {crossesMidnight && (
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Дата окончания (автоматически: следующий день после начала)
                    </label>
                    <input
                      type="date"
                      value={currentEndDate}
                      onChange={(e) => setCurrentEndDate(e.target.value)}
                      min={date}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                    />
                    {currentEndDate && (
                      <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Слот: {date} {currentStart} → {currentEndDate} {currentEnd}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={addOrUpdateTimeSlot}
                    className="w-full px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {editingTimeSlotIndex !== null ? (
                      <>
                        <Edit className="w-4 h-4" />
                        Сохранить слот
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Добавить слот
                      </>
                    )}
                  </button>
                  {editingTimeSlotIndex !== null && (
                    <button
                      onClick={cancelEditTimeSlot}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-gray-700 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-800 hover:bg-gray-100'}`}
                    >
                      Отмена
                    </button>
                  )}
                </div>
              </div>

              {/* Added slots */}
              <div className="space-y-3">
                {slots.map((s, index) => (
                  <div
                    key={index}
                    className={`flex flex-col gap-2 p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={headingColor}>
                          {s.start} - {s.end}
                        </span>
                        {s.endDate && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            theme === 'dark'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-blue-100 text-blue-700 border border-blue-300'
                          }`}>
                            до {formatDate(new Date(s.endDate), 'dd.MM.yyyy')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditTimeSlot(index)}
                          className="p-1 text-blue-500 hover:bg-blue-500 hover:text-white rounded transition-colors flex-shrink-0"
                          title="Редактировать слот"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeTimeSlot(index)}
                          className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors flex-shrink-0"
                          title="Удалить слот"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Breaks for this slot */}
                    {s.breaks && s.breaks.length > 0 && (
                      <div className="ml-4 space-y-1">
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Перерывы:
                        </span>
                        {s.breaks.map((breakTime, breakIndex) => {
                          const isEditing = editBreakSlotIndex === index && editBreakIndex === breakIndex
                          if (isEditing) {
                            return null // Don't show break while editing, the edit form is below
                          }
                          return (
                            <div key={breakIndex} className="flex items-center justify-between gap-2">
                              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {breakTime.start} - {breakTime.end}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => startEditBreak(index, breakIndex)}
                                  className="p-1 text-blue-400 hover:bg-blue-400 hover:text-white rounded transition-colors"
                                  title="Редактировать перерыв"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => removeBreakFromSlot(index, breakIndex)}
                                  className="p-1 text-red-400 hover:bg-red-400 hover:text-white rounded transition-colors"
                                  title="Удалить перерыв"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Add/Edit break to this slot */}
                    <div className="ml-4 space-y-2 border-t pt-2 border-gray-500 border-opacity-30">
                      {currentSlotIndex === index ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="time"
                              value={currentBreakStart}
                              onChange={(e) => setCurrentBreakStart(e.target.value)}
                              className={`flex-1 px-3 py-1.5 text-sm rounded-lg border ${
                                theme === 'dark'
                                  ? 'bg-gray-600 border-gray-500 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                              placeholder="Начало"
                            />
                            <input
                              type="time"
                              value={currentBreakEnd}
                              onChange={(e) => setCurrentBreakEnd(e.target.value)}
                              className={`flex-1 px-3 py-1.5 text-sm rounded-lg border ${
                                theme === 'dark'
                                  ? 'bg-gray-600 border-gray-500 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                              placeholder="Конец"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => addBreakToSlot(index)}
                              className="flex-1 px-3 py-1.5 text-sm bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors"
                            >
                              {editBreakSlotIndex === index && editBreakIndex !== null ? 'Сохранить' : 'Добавить перерыв'}
                            </button>
                            <button
                              onClick={cancelEditBreak}
                              className="px-3 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setCurrentSlotIndex(index)
                            setCurrentBreakStart('')
                            setCurrentBreakEnd('')
                            setEditBreakSlotIndex(null)
                            setEditBreakIndex(null)
                            setError('')
                          }}
                          className="w-full px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Добавить перерыв
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {slots.length > 0 && (
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Всего часов: {calculateHours(slots).toFixed(1)}
                </p>
              )}
            </div>

            {/* Repeat options */}
            {(!adminBulkMode || dateMode === 'single') && (
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={repeatMonth}
                  onChange={(e) => {
                    if (e.target.checked && repeatAllDays) {
                      setError('Снимите галочку с другой функции')
                      return
                    }
                    setRepeatMonth(e.target.checked)
                    setError('')
                  }}
                  className="w-4 h-4"
                />
                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Добавить аналогичные слоты на месяц вперед
                </span>
              </label>

              {repeatMonth && (
                <div className="ml-6">
                  <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Выберите день недели:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {weekDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleDayToggle(index)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          repeatDays.includes(index)
                            ? 'bg-[#4E6E49] text-white'
                            : theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={repeatAllDays}
                  onChange={(e) => {
                    if (e.target.checked && repeatMonth) {
                      setError('Снимите галочку с другой функции')
                      return
                    }
                    setRepeatAllDays(e.target.checked)
                    setError('')
                  }}
                  className="w-4 h-4"
                />
                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Установить время работы на все выбранные дни
                </span>
              </label>

              {repeatAllDays && (
                <div className="ml-6">
                  <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Выберите дни недели:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {weekDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectedDaysToggle(index)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          selectedDays.includes(index)
                            ? 'bg-[#4E6E49] text-white'
                            : theme === 'dark'
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                onClick={(e) => {
                  console.log('Save button clicked!', { loading, slotsCount: slots.length, disabled: loading || slots.length === 0 })
                  e.preventDefault()
                  handleSave()
                }}
                disabled={loading || slots.length === 0}
                className="flex-1 px-4 py-2.5 sm:py-2 bg-[#4E6E49] hover:bg-[#4E6E49] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100"
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
  </div>
  )
}

