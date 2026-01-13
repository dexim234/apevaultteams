import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { addEarnings, getWorkSlots, updateEarnings } from '@/services/firestoreService'
import { canAddEarnings, formatDate } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { EARNINGS_CATEGORY_META, Earnings, EarningsCategory, TEAM_MEMBERS } from '@/types'
import { X, Rocket, LineChart, Image, Coins, BarChart3, ShieldCheck, Sparkles, Gift } from 'lucide-react'
import { useScrollLock } from '@/hooks/useScrollLock'

interface EarningsFormProps {
  onClose: () => void
  onSave: () => void
  editingEarning?: Earnings | null
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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useScrollLock()

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
      case 'airdrop':
        return <Gift className={className} />
      default:
        return <Sparkles className={className} />
    }
  }

  const resolveParticipants = () => {
    if (isEditing && editingEarning) {
      return editingEarning.participants?.length ? editingEarning.participants : [editingEarning.userId]
    }
    if (multipleParticipants && selectedParticipants.length) {
      return selectedParticipants
    }
    return user?.id ? [user.id] : []
  }

  const calculatePerParticipant = () => {
    const participants = resolveParticipants()
    if (!participants.length) return 0
    const poolShare = parseFloat(amount) * POOL_RATE
    const extraWalletsTotal = parseFloat(extraWalletsCount || '0') * parseFloat(extraWalletsAmount || '0')
    return (poolShare - extraWalletsTotal) / participants.length
  }

  const canEdit = !isEditing || (isAdmin && editingEarning?.status === 'pending')

  const handleSave = async () => {
    const participants = resolveParticipants()
    
    if (!canAddEarnings(date)) {
      setError('Нельзя добавлять заработок за прошедшие дни')
      return
    }

    if (!selectedSlotId || !amount || participants.length === 0) {
      setError('Пожалуйста, заполните все обязательные поля')
      return
    }

    if (isAdmin && isEditing && editingEarning?.status === 'approved') {
      setError('Нельзя изменять одобренный заработок')
      return
    }

    setLoading(true)
    setError('')

    try {
      const earningsData = {
        date,
        slotId: selectedSlotId,
        amount: parseFloat(amount),
        extraWalletsCount: parseFloat(extraWalletsCount || '0'),
        extraWalletsAmount: parseFloat(extraWalletsAmount || '0'),
        category,
        participants,
        userId: user?.id || '',
        status: ((isAdmin && isEditing) ? 'approved' : 'pending') as 'pending' | 'approved' | 'rejected',
        perParticipant: calculatePerParticipant(),
        poolAmount: parseFloat(amount) * POOL_RATE
      }

      if (isEditing && editingEarning?.id) {
        await updateEarnings(editingEarning.id, earningsData)
      } else {
        await addEarnings(earningsData)
      }
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving earnings:', error)
      setError('Ошибка при сохранении. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  const handleMultipleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setMultipleParticipants(checked)
    if (!checked) {
      setSelectedParticipants([])
    }
  }

  useEffect(() => {
    const loadAvailableSlots = async () => {
      try {
        const slots = await getWorkSlots()
        const filteredSlots = slots
          .filter((slot: any) => slot.status === 'approved')
          .sort((a: any, b: any) => {
            const dateA = new Date(a.date.split('.').reverse().join('-'))
            const dateB = new Date(b.date.split('.').reverse().join('-'))
            return dateB.getTime() - dateA.getTime()
          })
        setAvailableSlots(filteredSlots)
      } catch (error) {
        console.error('Error loading slots:', error)
      }
    }

    loadAvailableSlots()
  }, [])

  const perParticipant = calculatePerParticipant()
  const poolShare = parseFloat(amount) * POOL_RATE
  const extraWalletsTotal = parseFloat(extraWalletsCount || '0') * parseFloat(extraWalletsAmount || '0')
  const userNickname = user?.id ? getUserNicknameSync(user.id) : ''

  const overlayBg = theme === 'dark' ? 'bg-black/60 backdrop-blur-sm' : 'bg-gray-900/50 backdrop-blur-sm'
  const modalBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const headerBg = theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
  const inputBg = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
  const inputBgPlaceholder = theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
  const buttonSecondaryBg = theme === 'dark' ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-300 text-gray-800 hover:bg-gray-100'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 touch-manipulation">
      <div className={`absolute inset-0 ${overlayBg}`} onClick={onClose} />
      
      <div className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${modalBg}`}>
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b backdrop-blur-md bg-opacity-90 ${headerBg}`}>
          <h2 className={`text-xl font-bold ${headingColor}`}>
            {isEditing ? 'Редактировать заработок' : 'Добавить заработок'}
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <label className={`block text-sm font-medium ${headingColor}`}>Дата</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={!canEdit}
              className={`w-full px-3 py-2.5 rounded-xl border ${inputBg} disabled:opacity-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
            />
          </div>

          <div className="space-y-3">
            <label className={`block text-sm font-medium ${headingColor}`}>Слот</label>
            <select
              value={selectedSlotId}
              onChange={(e) => setSelectedSlotId(e.target.value)}
              disabled={!canEdit}
              className={`w-full px-3 py-2.5 rounded-xl border ${inputBg} disabled:opacity-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
            >
              <option value="">Выберите слот</option>
              {availableSlots.map((slot: any) => (
                <option key={slot.id} value={slot.id}>
                  {slot.date} — {getUserNicknameSync(slot.userId)} ({slot.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className={`block text-sm font-medium ${headingColor}`}>Категория</label>
            <div className="grid grid-cols-4 gap-2">
              {(['memecoins', 'futures', 'nft', 'spot', 'polymarket', 'staking', 'airdrop'] as EarningsCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  disabled={!canEdit}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    category === cat 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : `border-transparent ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`
                  } disabled:opacity-50 touch-manipulation`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${EARNINGS_CATEGORY_META[cat]?.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white shadow-md`}>
                    {getCategoryIcon(cat, 'w-4 h-4')}
                  </div>
                  <span className={`text-[10px] font-medium truncate w-full text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {EARNINGS_CATEGORY_META[cat]?.shortName || cat}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className={`block text-sm font-medium ${headingColor}`}>Сумма ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!canEdit}
              placeholder="0.00"
              className={`w-full px-3 py-2.5 rounded-xl border ${inputBgPlaceholder} disabled:opacity-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${headingColor}`}>Кол-во кошельков</label>
              <input
                type="number"
                value={extraWalletsCount}
                onChange={(e) => setExtraWalletsCount(e.target.value)}
                disabled={!canEdit}
                placeholder="0"
                className={`w-full px-3 py-2.5 rounded-xl border ${inputBgPlaceholder} disabled:opacity-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
              />
            </div>
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${headingColor}`}>Заработок ($)</label>
              <input
                type="number"
                value={extraWalletsAmount}
                onChange={(e) => setExtraWalletsAmount(e.target.value)}
                disabled={!canEdit}
                placeholder="0.00"
                className={`w-full px-3 py-2.5 rounded-xl border ${inputBgPlaceholder} disabled:opacity-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all`}
              />
            </div>
          </div>

          <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <div className="flex justify-between text-sm">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Доля пула (45%):</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>${poolShare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Доп. кошельки:</span>
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>${extraWalletsTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t border-current border-opacity-10">
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}>На участника:</span>
              <span className="text-emerald-500">${perParticipant.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <input
              type="checkbox"
              id="multipleParticipants"
              checked={multipleParticipants}
              onChange={handleMultipleParticipantsChange}
              disabled={!canEdit}
              className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500/20"
            />
            <label htmlFor="multipleParticipants" className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Несколько участников
            </label>
          </div>

          {multipleParticipants && (
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${headingColor}`}>Участники</label>
              <div className="grid grid-cols-2 gap-2">
                {TEAM_MEMBERS.filter(member => member.id !== user?.id).map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      if (!canEdit) return
                      setSelectedParticipants(prev => 
                        prev.includes(member.id) 
                          ? prev.filter(id => id !== member.id)
                          : [...prev, member.id]
                      )
                    }}
                    disabled={!canEdit}
                    className={`p-2 rounded-lg text-left text-sm transition-all ${
                      selectedParticipants.includes(member.id)
                        ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                        : theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    } disabled:opacity-50`}
                  >
                    <span className="font-medium">{member.nickname}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Вы: <span className="font-medium text-emerald-500">{userNickname}</span>
            </span>
            {multipleParticipants && selectedParticipants.length > 0 && (
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                + {selectedParticipants.length} участн.
              </span>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-2.5 sm:py-2 bg-[#4E6E49] hover:bg-[#4E6E49] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-medium touch-manipulation active:scale-95 disabled:active:scale-100 relative overflow-hidden"
            >
              <span className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'invisible' : ''}`}>
                {isEditing ? 'Сохранить' : 'Сохранить все'}
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
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-xl border text-sm sm:text-base font-medium transition-colors touch-manipulation active:scale-95 ${buttonSecondaryBg}`}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
