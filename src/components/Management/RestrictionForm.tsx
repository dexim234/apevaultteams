// Form for adding/editing restrictions for admin
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { addRestriction, updateRestriction, getRestrictions, deleteRestriction, checkRestriction } from '@/services/firestoreService'
import { formatDate } from '@/utils/dateUtils'
import { X, Shield, Edit, Trash2, Plus, Calendar, Clock, AlertTriangle } from 'lucide-react'
import { Restriction, RestrictionType } from '@/types'
import { useScrollLock } from '@/hooks/useScrollLock'

interface RestrictionFormProps {
  onClose: () => void
  onSave: () => void
}

export const RestrictionForm = ({ onClose, onSave }: RestrictionFormProps) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

  const [type, setType] = useState<RestrictionType>('all')
  const [startDate, setStartDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'))
  const [isRange, setIsRange] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [hasTimeRestriction, setHasTimeRestriction] = useState(false)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [blockFutureDates, setBlockFutureDates] = useState(false)

  // Состояние для списка ограничений
  const [restrictions, setRestrictions] = useState<Restriction[]>([])
  const [loadingRestrictions, setLoadingRestrictions] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingRestriction, setEditingRestriction] = useState<Restriction | null>(null)

  useScrollLock()

  useEffect(() => {
    if (!isRange) {
      setEndDate(startDate)
    }
  }, [isRange, startDate])

  // Загрузка списка ограничений
  useEffect(() => {
    loadRestrictions()
  }, [])

  const loadRestrictions = async () => {
    if (!isAdmin) return

    setLoadingRestrictions(true)
    try {
      const allRestrictions = await getRestrictions()
      setRestrictions(allRestrictions)
    } catch (err) {
      console.error('Error loading restrictions:', err)
    } finally {
      setLoadingRestrictions(false)
    }
  }

  const handleEditRestriction = (restriction: Restriction) => {
    setEditingRestriction(restriction)
    // Устанавливаем значения для редактирования
    setType(restriction.type)
    setStartDate(restriction.startDate)
    setEndDate(restriction.endDate || restriction.startDate)
    setIsRange(!!restriction.endDate)
    setStartTime(restriction.startTime || '')
    setHasTimeRestriction(!!restriction.startTime)
    setComment(restriction.comment || '')
    setIsActive(restriction.isActive)
    setBlockFutureDates(restriction.blockFutureDates || false)
    setShowCreateForm(true)
    setError('')
  }

  const handleDeleteRestriction = async (restrictionId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это ограничение?')) return

    try {
      await deleteRestriction(restrictionId)
      await loadRestrictions() // Перезагружаем список
      setError('')
    } catch (err: any) {
      console.error('Error deleting restriction:', err)
      setError(err.message || 'Ошибка при удалении ограничения')
    }
  }

  const handleCreateNew = () => {
    setEditingRestriction(null)
    setType('all')
    setStartDate(formatDate(new Date(), 'yyyy-MM-dd'))
    setEndDate(formatDate(new Date(), 'yyyy-MM-dd'))
    setIsRange(false)
    setStartTime('')
    setHasTimeRestriction(false)
    setComment('')
    setIsActive(true)
    setBlockFutureDates(false)
    setShowCreateForm(true)
    setError('')
  }

  const restrictionTypeLabels: Record<RestrictionType, string> = {
    slots: 'Слоты',
    dayoff: 'Выходные',
    sick: 'Больничные',
    vacation: 'Отпуска',
    absence: 'Прогулы',
    all: 'Всё',
  }

  const handleSave = async () => {
    console.log('handleSave called, isAdmin:', isAdmin, 'user:', user)
    if (!isAdmin) {
      setError('Только администратор может управлять ограничениями. Активируйте админ режим на странице входа.')
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
      const currentId = editingRestriction?.id

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
        ...(blockFutureDates && { blockFutureDates }),
        ...(comment && { comment }),
        createdBy: user?.id || 'admin',
        createdAt: editingRestriction?.createdAt || new Date().toISOString(),
        isActive,
      }

      if (editingRestriction) {
        await updateRestriction(editingRestriction.id, restrictionData)
      } else {
        await addRestriction(restrictionData)
      }

      await loadRestrictions()
      setShowCreateForm(false)
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
                  Управление ограничениями
                </span>
              </div>
              <h3 className={`text-2xl sm:text-3xl font-bold ${headingColor}`}>
                Ограничения для команды
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Запретить участникам создавать определённые записи в указанный период
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-2 rounded-xl border text-xs sm:text-sm ${theme === 'dark' ? 'border-white/10 bg-white/5 text-gray-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                Админ · Управление {isAdmin ? '(активен)' : '(не активен)'}
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
            {/* Existing Restrictions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className={`text-lg font-semibold ${headingColor}`}>Существующие ограничения</h4>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateNew}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      showCreateForm
                        ? 'bg-orange-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    {showCreateForm ? 'Создать новое' : 'Создать ограничение'}
                  </button>
                  <button
                    onClick={async () => {
                      // Test restriction checking
                      const testDate = formatDate(new Date(), 'yyyy-MM-dd')
                      const testResult = await checkRestriction('slots', testDate, '10:00')
                      alert(`Test result: ${testResult.restricted ? 'BLOCKED' : 'ALLOWED'}\n${testResult.reason || 'No restrictions'}`)
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Тест ограничений
                  </button>
                </div>
              </div>

              {loadingRestrictions ? (
                <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} text-center`}>
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Загрузка...</p>
                </div>
              ) : restrictions.length === 0 ? (
                <div className={`p-6 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'} text-center`}>
                  <AlertTriangle className={`w-8 h-8 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Нет активных ограничений</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {restrictions.map((restriction) => (
                    <div
                      key={restriction.id}
                      className={`p-4 rounded-xl border transition-all ${
                        restriction.isActive
                          ? theme === 'dark'
                            ? 'border-orange-500/30 bg-orange-500/5'
                            : 'border-orange-200 bg-orange-50'
                          : theme === 'dark'
                          ? 'border-gray-600 bg-gray-800/50'
                          : 'border-gray-300 bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              restriction.isActive
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {restriction.isActive ? <AlertTriangle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                              {restrictionTypeLabels[restriction.type]}
                            </span>
                            {!restriction.isActive && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">Неактивно</span>
                            )}
                          </div>

                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className={headingColor}>
                                {restriction.endDate
                                  ? `${formatDate(restriction.startDate, 'dd.MM.yyyy')} - ${formatDate(restriction.endDate, 'dd.MM.yyyy')}`
                                  : formatDate(restriction.startDate, 'dd.MM.yyyy')
                                }
                              </span>
                            </div>

                            {restriction.startTime && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                  С {restriction.startTime}
                                </span>
                              </div>
                            )}

                            {restriction.blockFutureDates && (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                <span className={`text-xs ${theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}`}>
                                  Блокировка следующего дня после наступления времени ограничения
                                </span>
                              </div>
                            )}

                            {restriction.comment && (
                              <div className="text-gray-600 dark:text-gray-400 italic">
                                {restriction.comment}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 ml-4">
                          <button
                            onClick={() => handleEditRestriction(restriction)}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Редактировать"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRestriction(restriction.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Create/Edit Form */}
            {showCreateForm && (
              <div className="border-t pt-6">
                <h4 className={`text-lg font-semibold mb-4 ${headingColor}`}>
                  {editingRestriction ? 'Редактировать ограничение' : 'Создать новое ограничение'}
                </h4>

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
            {editingRestriction && (
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

            {/* Block Past Dates */}
            <div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={blockFutureDates}
                  onChange={(e) => setBlockFutureDates(e.target.checked)}
                  className={`w-4 h-4 rounded border-2 ${
                    theme === 'dark'
                      ? 'border-gray-800 bg-gray-700 checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                      : 'border-gray-300 bg-white checked:bg-[#4E6E49] checked:border-[#4E6E49]'
                  } focus:ring-2 focus:ring-[#4E6E49] cursor-pointer touch-manipulation`}
                />
                <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                  После наступления даты/времени ограничения блокировать создание записей только на следующий день
                </span>
              </label>
              {blockFutureDates && (
                <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Пример: после 14.12 21:00 нельзя будет создавать слоты/отпуска только на 15.12 (следующий день)
                </p>
              )}
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
                className="flex-1 px-4 py-2.5 sm:py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100"
              >
                {loading ? 'Сохранение...' : (editingRestriction ? 'Сохранить изменения' : 'Создать ограничение')}
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}








