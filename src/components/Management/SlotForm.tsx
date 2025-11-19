// Form for adding/editing work slots
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { addWorkSlot, updateWorkSlot, getWorkSlots } from '@/services/firestoreService'
import { calculateHours, timeOverlaps, formatDate } from '@/utils/dateUtils'
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
  const [date, setDate] = useState(slot?.date || formatDate(new Date(), 'yyyy-MM-dd'))
  const [selectedUserId, setSelectedUserId] = useState(slot?.userId || user?.id || '')
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
  const [currentBreakStart, setCurrentBreakStart] = useState('')
  const [currentBreakEnd, setCurrentBreakEnd] = useState('')
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null)
  const [editBreakSlotIndex, setEditBreakSlotIndex] = useState<number | null>(null)
  const [editBreakIndex, setEditBreakIndex] = useState<number | null>(null)
  const [comment, setComment] = useState(slot?.comment || '')
  const [repeatMonth, setRepeatMonth] = useState(false)
  const [repeatDays, setRepeatDays] = useState<number[]>([])
  const [repeatAllDays, setRepeatAllDays] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

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

  const addTimeSlot = () => {
    if (!currentStart || !currentEnd) {
      setError('Заполните время начала и окончания')
      return
    }

    if (currentStart >= currentEnd) {
      setError('Время окончания должно быть позже времени начала')
      return
    }

    // Add slot without breaks initially (breaks can be added separately)
    const newSlot: TimeSlot = {
      start: currentStart,
      end: currentEnd,
      breaks: []
    }

    setSlots([...slots, newSlot])
    setCurrentStart('')
    setCurrentEnd('')
    setCurrentBreakStart('')
    setCurrentBreakEnd('')
    setCurrentSlotIndex(null)
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

    if (currentBreakStart < slot.start || currentBreakEnd > slot.end) {
      setError('Перерыв должен быть в пределах времени слота')
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

  const validateSlot = async (slotDate: string, timeSlots: TimeSlot[]): Promise<string | null> => {
    // Check max 3 people per slot
    const existingSlots = await getWorkSlots(undefined, slotDate)
    for (const timeSlot of timeSlots) {
      for (const existingSlot of existingSlots) {
        if (existingSlot.id === slot?.id) continue
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
    if (!user) {
      console.log('No user found')
      return
    }

    // Check if user can edit this slot
    if (slot && !isAdmin && slot.userId !== user.id) {
      setError('Вы можете редактировать только свои слоты')
      setLoading(false)
      return
    }

    // Validate selected user for admin mode
    const targetUserId = isAdmin && !slot ? selectedUserId : (slot?.userId || user.id)
    if (!targetUserId) {
      setError('Выберите участника')
      setLoading(false)
      return
    }

    console.log('Starting save process...')
    setError('')
    setLoading(true)

    try {
      if (repeatMonth && repeatDays.length > 0) {
        // Repeat for month ahead on specific days
        const dateObj = new Date(date)
        const month = dateObj.getMonth()
        const year = dateObj.getFullYear()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        for (let day = 1; day <= daysInMonth; day++) {
          const checkDate = new Date(year, month, day)
          const dayOfWeek = checkDate.getDay() === 0 ? 6 : checkDate.getDay() - 1
          if (repeatDays.includes(dayOfWeek)) {
            const dateStr = formatDate(checkDate, 'yyyy-MM-dd')
            const validationError = await validateSlot(dateStr, slots)
            if (validationError) {
              setError(validationError)
              setLoading(false)
              return
            }

            const slotData: Omit<WorkSlot, 'id'> = {
              userId: targetUserId,
              date: dateStr,
              slots,
              ...(comment && { comment }),
              participants: [targetUserId],
            }

            if (slot) {
              await updateWorkSlot(slot.id, slotData)
            } else {
              await addWorkSlot(slotData)
            }
          }
        }
      } else if (repeatAllDays && selectedDays.length > 0 && slots.length > 0) {
        // Repeat for selected days
        const dateObj = new Date(date)
        const month = dateObj.getMonth()
        const year = dateObj.getFullYear()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        for (let day = 1; day <= daysInMonth; day++) {
          const checkDate = new Date(year, month, day)
          const dayOfWeek = checkDate.getDay() === 0 ? 6 : checkDate.getDay() - 1
          if (selectedDays.includes(dayOfWeek)) {
            const dateStr = formatDate(checkDate, 'yyyy-MM-dd')
            const validationError = await validateSlot(dateStr, slots)
            if (validationError) {
              setError(validationError)
              setLoading(false)
              return
            }

            const slotData: Omit<WorkSlot, 'id'> = {
              userId: targetUserId,
              date: dateStr,
              slots,
              ...(comment && { comment }),
              participants: [targetUserId],
            }

            await addWorkSlot(slotData)
          }
        }
      } else {
        // Single date
        const validationError = await validateSlot(date, slots)
        if (validationError) {
          setError(validationError)
          setLoading(false)
          return
        }

        const slotData: Omit<WorkSlot, 'id'> = {
          userId: targetUserId,
          date,
          slots,
          ...(comment && { comment }),
          participants: slot?.participants || [targetUserId],
        }

        if (slot) {
          await updateWorkSlot(slot.id, slotData)
        } else {
          await addWorkSlot(slotData)
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 sm:py-0 overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${headingColor}`}>
              {slot ? 'Редактировать слот' : 'Добавить слот'}
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* User selection for admin when adding new slot */}
            {isAdmin && !slot && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Участник
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  {TEAM_MEMBERS.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Date */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Дата
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
            </div>

            {/* Time slots */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Временные слоты
              </label>
              <div className="space-y-2 mb-2">
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={currentStart}
                    onChange={(e) => setCurrentStart(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="Начало"
                  />
                  <input
                    type="time"
                    value={currentEnd}
                    onChange={(e) => setCurrentEnd(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="Окончание"
                  />
                </div>
                <button
                  onClick={addTimeSlot}
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Добавить слот
                </button>
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
                    <div className="flex items-center justify-between">
                      <span className={headingColor}>
                        {s.start} - {s.end}
                      </span>
                      <button
                        onClick={() => removeTimeSlot(index)}
                        className="p-1 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                        title="Удалить слот"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
                              } focus:outline-none focus:ring-2 focus:ring-green-500`}
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
                              } focus:outline-none focus:ring-2 focus:ring-green-500`}
                              placeholder="Конец"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => addBreakToSlot(index)}
                              className="flex-1 px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
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
                            ? 'bg-green-500 text-white'
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
                            ? 'bg-green-500 text-white'
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

            {/* Comment */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Комментарий
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border ${
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

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  console.log('Save button clicked!', { loading, slotsCount: slots.length, disabled: loading || slots.length === 0 })
                  e.preventDefault()
                  handleSave()
                }}
                disabled={loading || slots.length === 0}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {loading ? 'Сохранение...' : 'Сохранить'}
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
  )
}

