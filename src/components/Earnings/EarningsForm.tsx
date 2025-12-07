// Form for adding/editing earnings with batching and extra wallets
import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { addEarnings, getWorkSlots, updateEarnings } from '@/services/firestoreService'
import { canAddEarnings, formatDate, getMoscowTime } from '@/utils/dateUtils'
import { EARNINGS_CATEGORY_META, Earnings, EarningsCategory, TEAM_MEMBERS } from '@/types'
import { X, Rocket, LineChart, Image, Coins, BarChart3, ShieldCheck, Sparkles, Trash2, PlusCircle } from 'lucide-react'

interface EarningsFormProps {
  onClose: () => void
  onSave: () => void
  editingEarning?: Earnings | null
}

type DraftEntry = {
  id: string
  category: EarningsCategory
  amount: number
  extraWalletsCount: number
  extraWalletsAmount: number
  participants: string[]
}

const POOL_RATE = 0.45

export const EarningsForm = ({ onClose, onSave, editingEarning }: EarningsFormProps) => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const isEditing = !!editingEarning

  const [date, setDate] = useState(editingEarning?.date || formatDate(new Date(), 'yyyy-MM-dd'))
  const [selectedSlotId, setSelectedSlotId] = useState(editingEarning?.slotId || '')
  const [amount, setAmount] = useState(editingEarning?.amount.toString() || '')
  const [extraWalletsCount, setExtraWalletsCount] = useState(editingEarning?.extraWalletsCount?.toString() || '')
  const [extraWalletsAmount, setExtraWalletsAmount] = useState(editingEarning?.extraWalletsAmount?.toString() || '')
  const [category, setCategory] = useState<EarningsCategory>(editingEarning?.category || 'memecoins')
  const [multipleParticipants, setMultipleParticipants] = useState(editingEarning ? editingEarning.participants.length > 1 : false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(editingEarning ? editingEarning.participants.filter(id => id !== editingEarning.userId) : [])
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [draftEntries, setDraftEntries] = useState<DraftEntry[]>([])
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

  const getCategoryIcon = (key: EarningsCategory, className = 'w-4 h-4') => {
    switch (key) {
      case 'memecoins':
        return <Rocket className={className} />
      case 'futures':
        return <LineChart className={className} />
      case 'nft':
        return <Image className={className} />
      case 'spot':
        return <Coins className={className} />
      case 'polymarket':
        return <BarChart3 className={className} />
      case 'staking':
        return <ShieldCheck className={className} />
      default:
        return <Sparkles className={className} />
    }
  }

  const resolveParticipants = () => {
    if (isEditing && editingEarning) {
      return editingEarning.participants?.length ? editingEarning.participants : [editingEarning.userId]
    }

    if (isAdmin && !user) {
      return selectedParticipants
    }

    if (!user) return []

    if (multipleParticipants) {
      return Array.from(new Set([user.id, ...selectedParticipants]))
    }

    return [user.id]
  }

  const plannedParticipants = resolveParticipants()
  const participantDisplayCount = plannedParticipants.length
  const participantCount = participantDisplayCount || 1

  const parseNumber = (value: string) => {
    const num = parseFloat(value.replace(',', '.'))
    return Number.isFinite(num) ? num : 0
  }

  const currentTotals = useMemo(() => {
    const base = parseNumber(amount)
    const extra = parseNumber(extraWalletsAmount)
    const gross = Math.max(base + extra, 0)
    const pool = gross > 0 ? parseFloat((gross * POOL_RATE).toFixed(2)) : 0
    const net = Math.max(gross - pool, 0)
    const share = participantCount > 0 ? parseFloat((net / participantCount).toFixed(2)) : 0
    return { gross, pool, net, share }
  }, [amount, extraWalletsAmount, participantCount])

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

  const buildDraftFromInputs = (): DraftEntry | null => {
    const baseAmount = parseNumber(amount)
    const extraAmount = parseNumber(extraWalletsAmount)
    const walletsCountNum = parseInt(extraWalletsCount || '0', 10)

    if (!baseAmount && !extraAmount) {
      setError('Укажите сумму заработка (основную или по доп. кошелькам)')
      return null
    }

    if (baseAmount < 0 || extraAmount < 0) {
      setError('Суммы не могут быть отрицательными')
      return null
    }

    if (!category) {
      setError('Выберите сферу заработка')
      return null
    }

    const participants = resolveParticipants()
    if (participants.length === 0) {
      setError('Выберите хотя бы одного участника')
      return null
    }

    const gross = baseAmount + extraAmount

    return {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      category,
      amount: gross,
      extraWalletsAmount: extraAmount,
      extraWalletsCount: Number.isFinite(walletsCountNum) ? walletsCountNum : 0,
      participants,
    }
  }

  const handleAddDraft = () => {
    setError('')
    const draft = buildDraftFromInputs()
    if (!draft) return
    setDraftEntries([...draftEntries, draft])
    // reset amounts for next entry but keep date/slot
    setAmount('')
    setExtraWalletsAmount('')
    setExtraWalletsCount('')
    setSelectedParticipants([])
    setMultipleParticipants(false)
  }

  const handleRemoveDraft = (id: string) => {
    setDraftEntries((prev) => prev.filter((d) => d.id !== id))
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
      if (!selectedSlotId) {
        setError('Выберите слот')
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
        const draft = buildDraftFromInputs()
        if (!draft) {
          setLoading(false)
          return
        }
        await updateEarnings(editingEarning.id, {
          date,
          amount: draft.amount,
          poolAmount: parseFloat((draft.amount * POOL_RATE).toFixed(2)),
          slotId: selectedSlotId,
          category: draft.category,
          participants: draft.participants,
          extraWalletsAmount: draft.extraWalletsAmount,
          extraWalletsCount: draft.extraWalletsCount,
        })
      } else {
        let entriesToSave = draftEntries
        if (entriesToSave.length === 0) {
          const draft = buildDraftFromInputs()
          if (!draft) {
            setLoading(false)
            return
          }
          entriesToSave = [draft]
        }

        for (const entry of entriesToSave) {
          await addEarnings({
            userId: entry.participants[0],
            date,
            amount: entry.amount,
            poolAmount: parseFloat((entry.amount * POOL_RATE).toFixed(2)),
            slotId: selectedSlotId,
            category: entry.category,
            participants: entry.participants,
            extraWalletsAmount: entry.extraWalletsAmount,
            extraWalletsCount: entry.extraWalletsCount,
          })
        }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 touch-manipulation overflow-y-auto overscroll-contain">
      <div className={`w-full max-w-[540px] sm:max-w-3xl rounded-2xl sm:rounded-3xl shadow-xl ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} max-h-[calc(100dvh-72px)] overflow-y-auto`}>
        <div className="p-4 sm:p-6 flex flex-col h-full">
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

          <div className="space-y-3 sm:space-y-4 overflow-y-auto pr-1 pb-6">
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

            {/* Amounts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Кол-во доп. кошельков
                    </label>
                    <input
                      type="number"
                      value={extraWalletsCount}
                      onChange={(e) => setExtraWalletsCount(e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border touch-manipulation ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-800 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                      placeholder="0"
                      min="0"
                      step="1"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Доп. кошельки (руб.)
                    </label>
                    <input
                      type="number"
                      value={extraWalletsAmount}
                      onChange={(e) => setExtraWalletsAmount(e.target.value)}
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
                </div>
                <div className="space-y-1 text-[11px] text-gray-500">
                  <p>Общая сумма = основная + доп. кошельки. Пул 45% считается с общей суммы.</p>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Сфера заработка
                </label>
                <span className="text-[10px] sm:text-xs text-gray-400">Влияет на статистику</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(EARNINGS_CATEGORY_META).map(([key, meta]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key as EarningsCategory)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                      category === key
                        ? 'border-[#4E6E49] bg-[#4E6E49]/10 text-[#4E6E49]'
                        : theme === 'dark'
                          ? 'border-gray-800 bg-gray-800/60 text-gray-200 hover:border-[#4E6E49]/40'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/40'
                    }`}
                  >
                    <span className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800/80">
                      {getCategoryIcon(key as EarningsCategory, 'w-4 h-4')}
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-semibold">{meta.label}</span>
                      <span className="text-[11px] text-gray-500">45% пул / 55% чистыми</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Participants */}
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
                <div className="ml-0 sm:ml-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TEAM_MEMBERS.filter((u) => !user || u.id !== user.id).map((member) => (
                    <label key={member.id} className="flex items-center gap-2 rounded-lg px-2 py-1 border border-gray-200 dark:border-gray-800">
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

            {/* Auto calculation */}
            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-gray-800 bg-gray-900/60' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Авторасчет</p>
                  <p className="text-[11px] text-gray-500">Пул 45% + деление между участниками</p>
                </div>
                <span className="text-[11px] px-2 py-1 rounded-full bg-[#4E6E49]/10 text-[#4E6E49] font-semibold">
                  {participantDisplayCount || 0} участн.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white'}`}>
                  <p className="text-[11px] text-gray-500">Пул (45%)</p>
                  <p className="text-lg font-bold text-purple-500">{currentTotals.pool.toFixed(2)} ₽</p>
                </div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white'}`}>
                  <p className="text-[11px] text-gray-500">Чистыми после пула</p>
                  <p className="text-lg font-bold text-emerald-500">{currentTotals.net.toFixed(2)} ₽</p>
                </div>
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white'}`}>
                  <p className="text-[11px] text-gray-500">На каждого</p>
                  <p className="text-lg font-bold text-[#4E6E49]">{currentTotals.share.toFixed(2)} ₽</p>
                </div>
              </div>

              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                Отмеченные участники получат по {currentTotals.share.toFixed(2)} ₽
              </div>
              <div className="flex flex-wrap gap-2">
                {plannedParticipants.length === 0 ? (
                  <span className="text-xs text-gray-400">Нет выбранных участников</span>
                ) : (
                  plannedParticipants.map((pid) => (
                    <span
                      key={pid}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        theme === 'dark' ? 'border-gray-800 bg-gray-800/70 text-gray-100' : 'border-gray-200 bg-white text-gray-800'
                      }`}
                    >
                      {TEAM_MEMBERS.find((m) => m.id === pid)?.name || pid}
                    </span>
                  ))
                )}
              </div>
            </div>

            {!isEditing && draftEntries.length > 0 && (
              <div className={`rounded-xl border ${theme === 'dark' ? 'border-gray-800 bg-gray-900/70' : 'border-gray-200 bg-gray-50'} p-3 sm:p-4 space-y-3`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Добавленные записи</p>
                  <span className="text-xs text-gray-500">{draftEntries.length} шт.</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {draftEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border ${
                        theme === 'dark' ? 'border-gray-800 bg-gray-800/60' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900/70">
                          {getCategoryIcon(entry.category, 'w-4 h-4')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            {EARNINGS_CATEGORY_META[entry.category].label}
                            <span className="text-[11px] text-gray-500">({entry.participants.length} уч.)</span>
                          </p>
                          <p className="text-xs text-gray-500 whitespace-normal break-words">
                            Гросс {entry.amount.toFixed(0)} ₽ • Пул {(entry.amount * POOL_RATE).toFixed(0)} ₽ • Чистыми {(entry.amount - entry.amount * POOL_RATE).toFixed(0)} ₽
                          </p>
                          {entry.extraWalletsAmount > 0 && (
                            <p className="text-[11px] text-gray-500">Доп. кошельки: {entry.extraWalletsCount} на {entry.extraWalletsAmount.toFixed(0)} ₽</p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDraft(entry.id)}
                        className={`self-start sm:self-center p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}
                        aria-label="Удалить запись"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500 text-white rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleAddDraft}
                  disabled={loading}
                  className="flex-1 sm:flex-none sm:px-4 px-4 py-2.5 sm:py-2 border border-[#4E6E49] text-[#4E6E49] rounded-lg sm:rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#4E6E49]/10 active:scale-95 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Добавить в список
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 px-4 py-2.5 sm:py-2 bg-[#4E6E49] hover:bg-[#4E6E49] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100"
              >
                {loading ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Сохранить все'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl border text-sm sm:text-base font-medium transition-colors touch-manipulation active:scale-95 ${
                  theme === 'dark'
                    ? 'border-gray-700 text-gray-200 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-800 hover:bg-gray-100'
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



