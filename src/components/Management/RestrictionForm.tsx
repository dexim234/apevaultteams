// Form for adding/editing restrictions for admin
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { addRestriction, updateRestriction, getRestrictions } from '@/services/firestoreService'
import { formatDate } from '@/utils/dateUtils'
import { X, Shield } from 'lucide-react'
import { Restriction, RestrictionType } from '@/types'
import { useScrollLock } from '@/hooks/useScrollLock'

interface RestrictionFormProps {
  restriction?: Restriction | null
  onClose: () => void
  onSave: () => void
}

export const RestrictionForm = ({ restriction, onClose, onSave }: RestrictionFormProps) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

  const initialDate = restriction?.startDate || formatDate(new Date(), 'yyyy-MM-dd')
  const [type, setType] = useState<RestrictionType>(restriction?.type || 'all')
  const [startDate, setStartDate] = useState(initialDate)
  const [endDate, setEndDate] = useState(restriction?.endDate || initialDate)
  const [isRange, setIsRange] = useState(!!restriction?.endDate)
  const [startTime, setStartTime] = useState(restriction?.startTime || '')
  const [hasTimeRestriction, setHasTimeRestriction] = useState(!!restriction?.startTime)
  const [comment, setComment] = useState(restriction?.comment || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(restriction?.isActive ?? true)

  useScrollLock()

  useEffect(() => {
    if (!isRange) {
      setEndDate(startDate)
    }
  }, [isRange, startDate])

  const restrictionTypeLabels: Record<RestrictionType, string> = {
    slots: 'Слоты',
    dayoff: 'Выходные',
    sick: 'Больничные',
    vacation: 'Отпуска',
    all: 'Всё',
  }

  const handleSave = async () => {
    if (!isAdmin || !user) {
      setError('Только администратор может управлять ограничениями')
      return
    }

    if (!startDate) {
      setError('Выберите дату начала ограничения')
      return
    }

    if (isRange && endDate && startDate > endDate) {
      setError('Дата окончания должна быть позже даты начала')
      return
    }

    // Check for overlapping restrictions
    try {
      const existingRestrictions = await getRestrictions(true)
      const currentId = restriction?.id

      const hasOverlap = existingRestrictions.some(r => {
        if (r.id === currentId) return false

        const rStart = new Date(r.startDate)
        const rEnd = r.endDate ? new Date(r.endDate) : rStart
        const newStart = new Date(startDate)
        const newEnd = isRange && endDate ? new Date(endDate) : newStart

        // Check if date ranges overlap
        const datesOverlap = !(newEnd < rStart || newStart > rEnd)

        // Check if types conflict (same type or 'all')
        const typesConflict = r.type === type || r.type === 'all' || type === 'all'

        return datesOverlap && typesConflict
      })

      if (hasOverlap) {
        setError('Уже существует пересекающееся ограничение для этого типа/периода')
        return
      }
    } catch (err) {
      console.error('Error checking restrictions:', err)
    }

    setError('')
    setLoading(true)

    try {
      const restrictionData: Omit<Restriction, 'id'> = {
        type,
        startDate,
        ...(isRange && endDate !== startDate && { endDate }),
        ...(hasTimeRestriction && startTime && { startTime }),
        ...(comment && { comment }),
        createdBy: user.id,
        createdAt: restriction?.createdAt || new Date().toISOString(),
        isActive,
      }

      if (restriction) {
        await updateRestriction(restriction.id, restrictionData)
      } else {
        await addRestriction(restrictionData)
      }

      onSave()
    } catch (err: any) {
      console.error('Error saving restriction:', err)
      setError(err.message || 'Ошибка при сохранении ограничения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 sm:p-6 touch-manipulation overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${theme === 'dark' ? 'bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10' : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200'} max-h-[90vh] overflow-y-auto`}>
        <div className="p-4 sm:p-6 lg:p-7 flex flex-col h-full min-h-0 overflow-y-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 tracking-tight">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/30">
                  <Shield className="w-3 h-3" />
                  {restriction ? 'Редактирование ограничения' : 'Создание ограничения'}
                </span>
              </div>
              <h3 className={`text-2xl sm:text-3xl font-bold ${headingColor}`}>
                {restriction ? 'Редактировать ограничение' : 'Создать ограничение'}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Запретить участникам создавать определённые записи в указанный период
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-2 rounded-xl border text-xs sm:text-sm ${theme === 'dark' ? 'border-white/10 bg-white/5 text-gray-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                Админ · {restriction ? 'Редактирование' : 'Создание'}
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

          <div className="mt-5 space-y-6 flex-1 min-h-0">
            {/* Restriction Type */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Что запретить
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(restrictionTypeLabels).map(([key, label]) => (
                  <label
                    key={key}
                    className={`relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      type === key
                        ? 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-100 dark:border-orange-800 ring-2 ring-orange-500/50 shadow-lg'
                        : theme === 'dark'
                        ? 'border-white/10 bg-white/5 text-gray-200 hover:border-white/30'
                        : 'border-slate-200 bg-white text-gray-800 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={key}
                      checked={type === key}
                      onChange={(e) => setType(e.target.value as RestrictionType)}
                      className="hidden"
                    />
                    <span className={`text-sm font-semibold ${type === key ? 'text-orange-700 dark:text-orange-200' : ''}`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Период ограничения
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      checked={!isRange}
                      onChange={() => setIsRange(false)}
                      className={`w-4 h-4 rounded border-2 ${
                        theme === 'dark'
                          ? 'border-gray-800 bg-gray-700 checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                          : 'border-gray-300 bg-white checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                      } focus:ring-2 focus:ring-[#4E6E49] cursor-pointer touch-manipulation`}
                    />
                    <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Один день</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      checked={isRange}
                      onChange={() => setIsRange(true)}
                      className={`w-4 h-4 rounded border-2 ${
                        theme === 'dark'
                          ? 'border-gray-800 bg-gray-700 checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                          : 'border-gray-300 bg-white checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                      } focus:ring-2 focus:ring-[#4E6E49] cursor-pointer touch-manipulation`}
                    />
                    <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Диапазон дат</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Дата начала
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                    />
                  </div>
                  {isRange && (
                    <div>
                      <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Дата окончания
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-800 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Time Restriction */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Временное ограничение
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasTimeRestriction}
                    onChange={(e) => setHasTimeRestriction(e.target.checked)}
                    className={`w-4 h-4 rounded border-2 ${
                      theme === 'dark'
                        ? 'border-gray-800 bg-gray-700 checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                        : 'border-gray-300 bg-white checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                    } focus:ring-2 focus:ring-[#4E6E49] cursor-pointer touch-manipulation`}
                  />
                  <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                    Запретить начиная с определённого времени
                  </span>
                </label>
                {hasTimeRestriction && (
                  <div className="ml-6">
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Время начала ограничения
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={`w-full max-w-xs px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                    />
                  </div>
                )}
              </div>
            </div>

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
                placeholder="Причина ограничения (необязательно)"
              />
            </div>

            {/* Active Status */}
            {restriction && (
              <div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className={`w-4 h-4 rounded border-2 ${
                      theme === 'dark'
                        ? 'border-gray-800 bg-gray-700 checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                        : 'border-gray-300 bg-white checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                    } focus:ring-2 focus:ring-[#4E6E49] cursor-pointer touch-manipulation`}
                  />
                  <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                    Ограничение активно
                  </span>
                </label>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500 text-white rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2.5 sm:py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100"
              >
                {loading ? 'Сохранение...' : (restriction ? 'Сохранить изменения' : 'Создать ограничение')}
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