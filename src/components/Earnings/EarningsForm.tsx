import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { addEarnings, getWorkSlots, updateEarnings, addApprovalRequest } from '@/services/firestoreService'
import { canAddEarnings, formatDate, getMoscowTime } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { EARNINGS_CATEGORY_META, Earnings, EarningsCategory, TEAM_MEMBERS } from '@/types'
import { X, Rocket, LineChart, Image, Coins, BarChart3, ShieldCheck, Sparkles, Trash2, PlusCircle, Gift } from 'lucide-react'
import { useScrollLock } from '@/hooks/useScrollLock'
import { SaveProgressIndicator } from '@/components/UI/SaveProgressIndicator'

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
      return editingEarning.participants?.length ? editingEarning.part