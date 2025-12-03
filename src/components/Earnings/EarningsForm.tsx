// Form for adding/editing earnings
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { addEarnings, updateEarnings, getWorkSlots } from '@/services/firestoreService'
import { formatDate, getMoscowTime, canAddEarnings } from '@/utils/dateUtils'
import { TEAM_MEMBERS, Earnings } from '@/types'
import { X } from 'lucide-react'

interface EarningsFormProps {
  onClose: () => void
  onSave: () => void
  editingEarning?: Earnings | null
}

export const EarningsForm = ({ onClose, onSave, editingEarning }: EarningsFormProps) => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const isEditing = !!editingEarning
  
  const [date, setDate] = useState(editingEarning?.date || formatDate(new Date(), 'yyyy-MM-dd'))
  const [selectedSlotId, setSelectedSlotId] = useState(editingEarning?.slotId || '')
  const [amount, setAmount] = useState(editingEarning?.amount.toString() || '')
  const [poolAmount, setPoolAmount] = useState(editingEarning?.poolAmount.toString() || '')
  const [multipleParticipants, setMultipleParticipants] = useState(editingEarning ? editingEarning.participants.length > 1 : false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(editingEarning ? editingEarning.participants.filter(id => id !== editingEarning.userId) : [])
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSlots()
  }, [date, user, isEditing])

  const loadSlots = async () => {
    // Allow admin to load slots even without user, or when editing
    if (!isAdmin && !user && !isEditing) return

    try {
      // When editing or admin, load all slots for the date (not filtered by user)
      // When creating, load slots for current user
      const slots = (isEditing || isAdmin) 
        ? await getWorkSlots(undefined, date)
        : await getWorkSlots(user!.id, date)
      
      const moscowTime = getMoscowTime()
      const currentDate = formatDate(moscowTime, 'yyyy-MM-dd')

      // Filter slots that are finished or after 21:00 (only for new earnings, not editing)
      const validSlots = isEditing 
        ? slots // When editing, show all slots
        : slots.filter((slot) => {
            if (date !== currentDate) {
              // Can only add earnings for today (unless admin)
              return isAdmin
            }

            // Check if slot is finished or it's after 21:00
            const lastSlot = slot.slots[slot.slots.length - 1]
            return canAddEarnings(lastSlot.end, moscowTime) || isAdmin
          })

      setAvailableSlots(validSlots)
    } catch (error) {
      console.error('Error loading slots:', error)
    }
  }

  const handleParticipantToggle = (userId: string) => {
    if (selectedParticipants.includes(userId)) {
      setSelectedParticipants(selectedParticipants.filter((id) => id !== userId))
    } else {
      setSelectedParticipants([...selectedParticipants, userId])
    }
  }

  const handleSave = async () => {
    // Allow admin to save earnings even without user, or when editing
    if (!isAdmin && !user && !isEditing) {
      setError('Пользователь не найден')
      return
    }

    setError('')
    setLoading(true)

    try {
      // Validation
      if (!selectedSlotId) {
        setError('Выберите слот')
        setLoading(false)
        return
      }

      if (!amount || !poolAmount) {
        setError('Заполните все поля')
        setLoading(false)
        return
      }

      const amountNum = parseFloat(amount)
      const poolNum = parseFloat(poolAmount)

      if (isNaN(amountNum) || isNaN(poolNum) || amountNum < 0 || poolNum < 0) {
        setError('Введите корректные суммы')
        setLoading(false)
        return
      }

      // Check if slot exists for this date
      const slot = availableSlots.find((s) => s.id === selectedSlotId)
      if (!slot && !isEditing) {
        setError('Выбранный слот не найден')
        setLoading(false)
        return
      }

      // Check time restrictions (unless admin) - only for new earnings
      if (!isAdmin && !isEditing) {
        const moscowTime = getMoscowTime()
        const currentDate = formatDate(moscowTime, 'yyyy-MM-dd')
        if (date !== currentDate) {
          setError('Можно добавить заработок только за сегодня')
          setLoading(false)
          return
        }

        if (slot) {
          const lastSlot = slot.slots[slot.slots.length - 1]
          if (!canAddEarnings(lastSlot.end, moscowTime)) {
            setError('Слот еще идет или еще не начат. Можно добавить заработок после 21:00 МСК или после окончания слота')
            setLoading(false)
            return
          }
        }
      }

      if (isEditing && editingEarning) {
        // Update existing earnings
        await updateEarnings(editingEarning.id, {
          date,
          amount: amountNum,
          poolAmount: poolNum,
          slotId: selectedSlotId,
        })
      } else {
        // Create new earnings for selected participants
        // For admin without user, use selectedParticipants only
        const participants = (isAdmin && !user)
          ? selectedParticipants.length > 0 
            ? selectedParticipants 
            : []
          : multipleParticipants && selectedParticipants.length > 0
            ? [...selectedParticipants, user!.id]
            : [user!.id]

        if (participants.length === 0) {
          setError('Выберите хотя бы одного участника')
          setLoading(false)
          return
        }

        // Create a single earnings record with all participants
        // The amount is the same for all participants (not summed)
        // Use the first participant as the primary userId for the record
        await addEarnings({
          userId: participants[0],
          date,
          amount: amountNum, // Единая сумма для всех участников
          poolAmount: poolNum, // Единая сумма пула для всех участников
          slotId: selectedSlotId,
          participants: participants, // Все участники в одной записи
        })
      }

      onSave()
    } catch (err: any) {
      console.error('Error saving earnings:', err)
      const errorMessage = err.message || err.code || 'Ошибка при сохранении'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto touch-manipulation">
      <div className={`w-full max-w-md rounded-lg sm:rounded-xl shadow-xl ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} max-h-[90vh] overflow-y-auto my-4 sm:my-8`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className={`text-lg sm:text-xl font-bold ${headingColor} pr-2`}>{isEditing ? 'Редактировать заработок' : 'Добавить заработок'}</h3>
            <button
              onClick={onClose}
              className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${theme === 'dark' ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200'} transition-colors touch-manipulation`}
              aria-label="Закрыть"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {/* Date */}
            <div>
              <label className={`flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm font-medium mb-2 gap-1 sm:gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <span>Дата</span>
                {!isAdmin && !isEditing && <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">Доступна только текущая дата</span>}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={!isAdmin && !isEditing}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-800 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-[#4E6E49] disabled:opacity-50 disabled:cursor-not-allowed`}
              />
              {isEditing && !isAdmin && (
                <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Только администратор может изменить дату
                </p>
              )}
            </div>

            {/* Slot selection */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Слот
              </label>
              <select
                value={selectedSlotId}
                onChange={(e) => setSelectedSlotId(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-800 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
              >
                <option value="">Выберите слот</option>
                {availableSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.slots.map((s: any) => `${s.start}-${s.end}`).join(', ')}
                  </option>
                ))}
                {isEditing && editingEarning && !availableSlots.find(s => s.id === editingEarning.slotId) && (
                  <option value={editingEarning.slotId} disabled>
                    [Текущий слот - не найден]
                  </option>
                )}
              </select>
              {isEditing && editingEarning && !availableSlots.find(s => s.id === editingEarning.slotId) && (
                <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Текущий слот не найден в списке. Выберите другой слот или оставьте текущий.
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Сумма заработка (руб.)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-800 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                placeholder="0"
                min="0"
                step="100"
              />
            </div>

            {/* Pool amount */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Сумма в пул (руб.)
              </label>
              <input
                type="number"
                value={poolAmount}
                onChange={(e) => setPoolAmount(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-800 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                placeholder="0"
                min="0"
                step="100"
              />
            </div>

            {/* Multiple participants - only for new earnings */}
            {!isEditing && (
              <>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={multipleParticipants}
                    onChange={(e) => setMultipleParticipants(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Отметить несколько участников
                  </span>
                </label>

                {(multipleParticipants || (isAdmin && !user)) && (
                  <div className="ml-6 space-y-2">
                    {TEAM_MEMBERS.filter((u) => !user || u.id !== user.id).map((member) => (
                      <label key={member.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedParticipants.includes(member.id)}
                          onChange={() => handleParticipantToggle(member.id)}
                          className="w-4 h-4"
                        />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {member.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </>
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
  )
}



