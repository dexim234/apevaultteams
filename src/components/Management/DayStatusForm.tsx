import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { addDayStatus, updateDayStatus } from '@/services/firestoreService'
import { formatDate } from '@/utils/dateUtils'
import { DayStatus } from '@/types'
import { X } from 'lucide-react'
import { useScrollLock } from '@/hooks/useScrollLock'

interface DayStatusFormProps {
  onClose: () => void
  onSave: () => void
  type?: 'working' | 'vacation' | 'sick' | 'weekend' | 'dayoff' | 'absence' | 'internship' | 'truancy' | null
  status?: DayStatus | null
  editingStatus?: DayStatus | null
}

const STATUS_TYPES = [
  { key: 'working' as const, label: 'Рабочий', icon: '💼', color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' },
  { key: 'vacation' as const, label: 'Отпуск', icon: '🏖️', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-500/10 border-blue-500/20 text-blue-600' },
  { key: 'sick' as const, label: 'Больничный', icon: '🤒', color: 'from-orange-500 to-red-600', bgColor: 'bg-orange-500/10 border-orange-500/20 text-orange-600' },
  { key: 'weekend' as const, label: 'Выходной', icon: '🎉', color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-500/10 border-purple-500/20 text-purple-600' },
  { key: 'dayoff' as const, label: 'День отдыха', icon: '🌴', color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-500/10 border-green-500/20 text-green-600' },
  { key: 'absence' as const, label: 'Отсутствие', icon: '❓', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-500/10 border-amber-500/20 text-amber-600' },
  { key: 'internship' as const, label: 'Стажировка', icon: '🎓', color: 'from-yellow-500 to-amber-600', bgColor: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600' },
  { key: 'truancy' as const, label: 'Прогул', icon: '🚫', color: 'from-red-500 to-rose-600', bgColor: 'bg-red-500/10 border-red-500/20 text-red-600' },
] as const

type FormStatusType = typeof STATUS_TYPES[number]['key']

export const DayStatusForm = ({ onClose, onSave, status: editingStatus, editingStatus: _editingStatus }: DayStatusFormProps) => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
  const typeBg = theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
  const isEditing = !!editingStatus

  const [date, setDate] = useState(editingStatus?.date || formatDate(new Date(), 'yyyy-MM-dd'))
  const [selectedType, setSelectedType] = useState<FormStatusType | null>((editingStatus?.type as FormStatusType) || null)
  const [note, setNote] = useState(editingStatus?.comment || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useScrollLock()

  const selectedTypeInfo = STATUS_TYPES.find(t => t.key === selectedType)

  const canEdit = !isEditing || (isAdmin && editingStatus?.status === 'pending')

  const handleSave = async () => {
    if (!selectedType) {
      setError('Пожалуйста, выберите тип статуса')
      return
    }

    if (isAdmin && isEditing && editingStatus?.status === 'approved') {
      setError('Нельзя изменять одобренный статус')
      return
    }

    setLoading(true)
    setError('')

    try {
      const statusData = {
        date,
        type: selectedType as FormStatusType,
        comment: note,
        userId: user?.id || '',
        status: ((isAdmin && isEditing) ? 'approved' : 'pending') as 'pending' | 'approved' | 'rejected'
      }

      if (isEditing && editingStatus?.id) {
        await updateDayStatus(editingStatus.id, statusData)
      } else {
        await addDayStatus(statusData)
      }
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving day status:', error)
      setError('Ошибка при сохранении. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 sm:p-6 touch-manipulation overflow-y-auto overscroll-contain modal-scroll">
        <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`flex items-center justify-between p-4 sm:p-5 border-b ${borderColor}`}>
            <h2 className={`text-lg sm:text-xl font-bold ${headingColor}`}>
              {isEditing ? 'Редактировать статус' : 'Добавить статус дня'}
            </h2>
            <button 
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className={`block text-sm font-medium ${headingColor}`}>Дата</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={!canEdit}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } disabled:opacity-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
              />
            </div>

            <div className="space-y-2">
              <label className={`block text-sm font-medium ${headingColor}`}>Тип статуса</label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {STATUS_TYPES.map((type) => (
                  <button
                    key={type.key}
                    onClick={() => canEdit && setSelectedType(type.key)}
                    disabled={!canEdit}
                    className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all touch-manipulation ${
                      selectedType === type.key
                        ? `${type.bgColor} border-current`
                        : `${typeBg} ${theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`
                    } disabled:opacity-50 active:scale-[0.98]`}
                  >
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{type.icon}</div>
                    <div className={`text-xs sm:text-sm font-semibold ${
                      selectedType === type.key ? 'currentColor' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedType && (
              <div className={`p-3 sm:p-4 rounded-xl border ${selectedTypeInfo?.bgColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg sm:text-xl">{selectedTypeInfo?.icon}</span>
                  <span className="font-semibold">Выбрано: {selectedTypeInfo?.label}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className={`block text-sm font-medium ${headingColor}`}>
                Комментарий <span className="text-gray-400 font-normal">(необязательно)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={!canEdit}
                placeholder="Добавить заметку..."
                rows={3}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border resize-none ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                } disabled:opacity-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
              />
            </div>

            <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${borderColor}`}>
              <button
                onClick={handleSave}
                disabled={loading || !selectedType}
                className={`flex-1 px-4 py-2.5 sm:py-2 ${selectedType ? `bg-gradient-to-r ${selectedTypeInfo?.color}` : 'bg-gray-400'} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100 relative overflow-hidden`}
              >
                <span className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'invisible' : ''}`}>
                  {loading ? '' : isAdmin ? 'Сохранить' : 'Отправить на согласование'}
                </span>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Сохранение...</span>
                    </div>
                  </div>
                )}
              </button>
              <button
                onClick={onClose}
                className={`px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 ${theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500' 
                  : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400'
                }`}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
