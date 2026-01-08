import { useState, useEffect, useMemo, type JSX } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { CallForm } from '@/components/Call/CallForm'
import { CustomSelect } from '@/components/Call/CustomSelect'
import { getCalls, deleteCall, updateCall } from '@/services/firestoreService'
import type { Call, CallCategory, CallRiskLevel } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import {
  X,
  Edit,
  Trash2,
  Check,
  Search,
  Sparkles,
  Copy,
  Shield,
  Rocket,
  LineChart,
  Image,
  Coins,
  AlertTriangle,
  Activity,
  TrendingUp,
  Gauge,
  Plus,
  User,
  Zap,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  History
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useScrollLock } from '@/hooks/useScrollLock'

type StatusFilter = 'all' | 'active' | 'completed' | 'cancelled' | 'reviewed'
type RiskFilter = 'all' | CallRiskLevel

const CATEGORY_ORDER: CallCategory[] = ['memecoins', 'polymarket', 'nft', 'staking', 'spot', 'futures', 'airdrop']

// Updated CATEGORY_META with cardGradient
const CATEGORY_META: Record<CallCategory, { label: string; gradient: string; gradientDark: string; chip: string; icon: JSX.Element; cardGradient: string }> = {
  memecoins: { 
    label: 'Мемкоины', 
    gradient: 'from-emerald-400 via-teal-500 to-cyan-400',
    gradientDark: 'from-emerald-500 via-teal-600 to-cyan-500',
    chip: 'bg-emerald-500/10 text-emerald-400',
    icon: <Rocket className="w-5 h-5 text-white" />,
    cardGradient: 'from-emerald-500/20 via-teal-400/10 to-cyan-500/5'
  },
  futures: { 
    label: 'Фьючерсы', 
    gradient: 'from-blue-400 to-indigo-500', 
    gradientDark: 'from-blue-600 to-indigo-500',
    chip: 'bg-blue-500/10 text-blue-600', 
    icon: <LineChart className="w-5 h-5 text-white" />,
    cardGradient: 'from-blue-500/20 via-indigo-500/10 to-transparent'
  },
  nft: { 
    label: 'NFT', 
    gradient: 'from-purple-400 to-pink-500', 
    gradientDark: 'from-purple-600 to-pink-500',
    chip: 'bg-purple-500/10 text-purple-600', 
    icon: <Image className="w-5 h-5 text-white" />,
    cardGradient: 'from-purple-500/20 via-pink-500/10 to-transparent'
  },
  spot: { 
    label: 'Спот', 
    gradient: 'from-amber-400 to-orange-500', 
    gradientDark: 'from-amber-600 to-orange-500',
    chip: 'bg-amber-500/10 text-amber-600', 
    icon: <Coins className="w-5 h-5 text-white" />,
    cardGradient: 'from-amber-500/20 via-orange-500/10 to-transparent'
  },
  airdrop: { 
    label: 'AirDrop', 
    gradient: 'from-gray-300 to-gray-400', 
    gradientDark: 'from-gray-400 to-gray-300',
    chip: 'bg-gray-500/10 text-gray-600', 
    icon: <Sparkles className="w-5 h-5 text-white" />,
    cardGradient: 'from-gray-500/20 via-gray-400/10 to-transparent'
  },
  polymarket: { 
    label: 'Polymarket', 
    gradient: 'from-rose-400 to-red-500', 
    gradientDark: 'from-rose-600 to-red-500',
    chip: 'bg-rose-500/10 text-rose-600', 
    icon: <Gauge className="w-5 h-5 text-white" />,
    cardGradient: 'from-rose-500/20 via-red-500/10 to-transparent'
  },
  staking: { 
    label: 'Стейкинг', 
    gradient: 'from-emerald-400 to-green-500', 
    gradientDark: 'from-emerald-600 to-green-500',
    chip: 'bg-emerald-500/10 text-emerald-600', 
    icon: <Shield className="w-5 h-5 text-white" />,
    cardGradient: 'from-emerald-500/20 via-green-500/10 to-transparent'
  },
}

const riskBadges: Record<CallRiskLevel, string> = {
  low: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
  medium: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  high: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
  ultra: 'bg-red-500/10 text-red-600 border border-red-500/20',
}

const riskLabels: Record<CallRiskLevel, string> = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  ultra: 'Ultra Risk',
}

export const CallPage = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const isAdmin = user?.id === '1'
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteCallId, setDeleteCallId] = useState<string | null>(null)
  const [cancelCallId, setCancelCallId] = useState<string | null>(null)
  const [editingCall, setEditingCall] = useState<Call | null>(null)
  const [formCategory, setFormCategory] = useState<CallCategory>('memecoins')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | CallCategory>('all')
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all')
  const [traderFilter, setTraderFilter] = useState<'all' | string>('all')

  useScrollLock(showForm || showDeleteModal || !!cancelCallId)

  useEffect(() => {
    loadCalls()
  }, [])

  const loadCalls = async () => {
    setLoading(true)
    try {
      const fetchedCalls = await getCalls()
      setCalls(fetchedCalls)
    } catch (error) {
      console.error('Error loading calls:', error)
      setCalls([])
    } finally {
      setLoading(false)
    }
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const bgColor = theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-100'
  const cardBg = theme === 'dark' ? 'bg-white/5 backdrop-blur-md' : 'bg-white'

  const handleSuccess = () => {
    setShowForm(false)
    setEditingCall(null)
    loadCalls()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCall(null)
  }

  const handleUpdateStatus = async (callId: string, status: 'active' | 'completed' | 'cancelled') => {
    try {
      await updateCall(callId, { status })
      await loadCalls()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Ошибка при обновлении статуса')
    }
  }

  const handleEdit = (call: Call) => {
    setEditingCall(call)
    setFormCategory(call.category)
    setShowForm(true)
  }

  const handleDeleteClick = (callId: string) => {
    setDeleteCallId(callId)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteCallId) return
    try {
      await deleteCall(deleteCallId)
      setShowDeleteModal(false)
      setDeleteCallId(null)
      loadCalls()
    } catch (error) {
      console.error('Error deleting call:', error)
      alert('Ошибка при удалении сигнала')
    }
  }

  const handleCancelConfirm = async () => {
    if (!cancelCallId) return
    try {
      await updateCall(cancelCallId, { status: 'cancelled' })
      setCancelCallId(null)
      loadCalls()
    } catch (error) {
      console.error('Error cancelling call:', error)
      alert('Ошибка при отмене сигнала')
    }
  }

  const getDetails = (call: Call) => (call.details as any)?.[call.category] || {}

  const getPrimaryTitle = (call: Call) => {
    const d = getDetails(call)
    switch (call.category) {
      case 'memecoins':
        return d.contract ? `${d.contract.slice(0, 6)}...${d.contract.slice(-4)}` : 'Мемкоин'
      case 'futures':
        return d.pair || 'Фьючерс'
      case 'nft':
        return d.collectionLink || 'NFT коллекция'
      case 'spot':
        return d.coin || 'Спот'
      case 'polymarket':
        return d.event || 'Polymarket событие'
      case 'staking':
        return d.coin || 'Стейкинг'
      case 'airdrop':
        return d.projectName || 'AirDrop'
      default:
        return 'Сигнал'
    }
  }

  const getRiskLevel = (call: Call): CallRiskLevel => call.riskLevel || getDetails(call).riskLevel || getDetails(call).protocolRisk || 'medium'

  const composeSearchString = (call: Call) => {
    const d = getDetails(call)
    const base = [
      call.category,
      call.status,
      call.comment,
      d.contract,
      d.pair,
      d.reason,
      d.targets,
      d.event,
      d.marketplace,
      d.platform,
      d.entryCap,
      d.entryZone,
      d.network,
    ]
    return base.filter(Boolean).join(' ').toLowerCase()
  }

  const filteredCalls = calls.filter((call) => {
    if (statusFilter !== 'all' && call.status !== statusFilter) return false
    if (categoryFilter !== 'all' && call.category !== categoryFilter) return false
    if (riskFilter !== 'all' && getRiskLevel(call) !== riskFilter) return false
    if (traderFilter !== 'all' && call.userId !== traderFilter) return false
    if (searchQuery.trim()) {
      return composeSearchString(call).includes(searchQuery.toLowerCase())
    }
    return true
  })

  const categoryStats = useMemo(() => {
    return calls.reduce<Record<CallCategory, { total: number; active: number }>>((acc, call) => {
      if (!acc[call.category]) acc[call.category] = { total: 0, active: 0 }
      acc[call.category].total += 1
      if (call.status === 'active') acc[call.category].active += 1
      return acc
    }, {
      memecoins: { total: 0, active: 0 },
      futures: { total: 0, active: 0 },
      nft: { total: 0, active: 0 },
      spot: { total: 0, active: 0 },
      airdrop: { total: 0, active: 0 },
      polymarket: { total: 0, active: 0 },
      staking: { total: 0, active: 0 },
    })
  }, [calls])

  const totals = useMemo(() => ({
    total: calls.length,
    active: calls.filter((c) => c.status === 'active').length,
    completed: calls.filter((c) => c.status === 'completed').length,
    cancelled: calls.filter((c) => c.status === 'cancelled').length,
  }), [calls])

  // Prepare options for custom selectors
  const categoryOptions = [
    { value: 'all', label: 'Все сферы', icon: <Activity size={14} /> },
    ...CATEGORY_ORDER.map(cat => ({
      value: cat,
      label: CATEGORY_META[cat].label,
      icon: CATEGORY_META[cat].icon,
      chip: CATEGORY_META[cat].chip
    }))
  ]

  const riskOptions = [
    { value: 'all', label: 'Любой риск', icon: <ShieldAlert size={14} /> },
    { value: 'low', label: 'Low Risk', icon: <Shield size={14} />, chip: riskBadges['low'] },
    { value: 'medium', label: 'Medium Risk', icon: <Shield size={14} />, chip: riskBadges['medium'] },
    { value: 'high', label: 'High Risk', icon: <AlertTriangle size={14} />, chip: riskBadges['high'] },
    { value: 'ultra', label: 'Ultra Risk', icon: <Zap size={14} />, chip: riskBadges['ultra'] },
  ]

  const traderOptions = [
    { value: 'all', label: 'Все трейдеры', icon: <User size={16} /> },
    ...TEAM_MEMBERS.map(t => ({
      value: t.id,
      label: t.name,
      meta: t.login,
      icon: t.avatar ? <img src={t.avatar} className="w-full h-full object-cover rounded-full" /> : <User size={10} />,
    }))
  ]

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-500" />
            <h1 className={`text-3xl font-bold ${textColor}`}>AVF HUB</h1>
          </div>

          <button
            onClick={() => {
              setEditingCall(null)
              // Default to current filter if not 'all', else first category
              setFormCategory(categoryFilter !== 'all' ? categoryFilter : 'memecoins')
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 bg-emerald-500 hover:bg-emerald-600"
          >
            <Plus size={18} />
            <span>Call</span>
          </button>
        </div>
      </div>

      {/* Category Cards - Horizontal Scroll */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat]
            const stats = categoryStats[cat]
            const progress = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0
            const catGradient = theme === 'dark' ? meta.gradientDark : meta.gradient
            
            return (
              <button
                key={cat}
                onClick={() => {
                  setEditingCall(null)
                  setFormCategory(cat)
                  setShowForm(true)
                }}
                className="flex-shrink-0 w-[200px] h-[140px] transition-all relative group"
              >
                {/* Gradient border wrapper */}
                <div className={`absolute inset-0 rounded-2xl p-[1.5px] border-0 bg-gradient-to-br ${catGradient}`}>
                  {/* Transparent inner container with padding */}
                  <div className="w-full h-full rounded-[13px] bg-transparent p-4 flex flex-col items-center justify-between">
                    {/* Header: Icon & Label Centered */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${catGradient} text-white`}>
                        {meta.icon}
                      </div>
                      <span className={`text-sm font-bold ${textColor} text-center`}>{meta.label}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full">
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`text-[10px] font-bold ${textColor}`}>
                          {stats.active}/{stats.total}
                        </span>
                        <span className={`text-[10px] font-medium ${subtleColor}`}>
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${catGradient} rounded-full transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className={`relative rounded-xl border ${borderColor} ${cardBg} shadow-xl`}>
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${subtleColor}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по тикеру, событию, сети или причине..."
            className={`w-full pl-12 pr-4 py-3 bg-transparent ${textColor} placeholder:${subtleColor} focus:outline-none`}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Custom Selectors */}
          <div className="w-full sm:w-auto min-w-[200px]">
            <CustomSelect
              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val as any)}
              options={categoryOptions}
              placeholder="Все сферы"
              icon={<Activity size={16} />}
            />
          </div>

          <div className="w-full sm:w-auto min-w-[180px]">
            <CustomSelect
              value={riskFilter}
              onChange={(val) => setRiskFilter(val as any)}
              options={riskOptions}
              placeholder="Любой риск"
              icon={<ShieldAlert size={16} />}
            />
          </div>

          <div className="w-full sm:w-auto min-w-[220px]">
            <CustomSelect
              value={traderFilter}
              onChange={(val) => setTraderFilter(val)}
              options={traderOptions}
              placeholder="Все трейдеры"
              searchable={true}
              icon={<User size={16} />}
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Signals */}
          <div className={`p-4 rounded-xl border ${borderColor} ${cardBg} shadow-xl`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs uppercase tracking-wider ${subtleColor}`}>Всего сигналов</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className={`text-3xl font-bold ${textColor}`}>{totals.total}</p>
            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
              <Rocket size={12} />
              <span>Растем</span>
            </p>
          </div>

          {/* Active */}
          <div className={`p-4 rounded-xl border ${borderColor} ${cardBg} shadow-xl`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs uppercase tracking-wider ${subtleColor}`}>Активные</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <p className={`text-3xl font-bold ${textColor}`}>{totals.active}</p>
            <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${totals.total > 0 ? (totals.active / totals.total) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Completed */}
          <div className={`p-4 rounded-xl border ${borderColor} ${cardBg} shadow-xl`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs uppercase tracking-wider ${subtleColor}`}>Завершенные</span>
              <Check className="w-4 h-4 text-blue-500" />
            </div>
            <p className={`text-3xl font-bold ${textColor}`}>{totals.completed}</p>
          </div>

          {/* Cancelled */}
          <div className={`p-4 rounded-xl border ${borderColor} ${cardBg} shadow-xl`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs uppercase tracking-wider ${subtleColor}`}>Отмененные</span>
              <X className="w-4 h-4 text-red-500" />
            </div>
            <p className={`text-3xl font-bold ${textColor}`}>{totals.cancelled}</p>
          </div>
        </div>
      </div>

      {/* Signals Feed Header */}
      <div className="px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-bold ${textColor}`}>Лента сигналов</h2>
          <p className={`text-sm ${subtleColor}`}>
            Показано {filteredCalls.length} из {totals.active} активных
          </p>
        </div>
      </div>

      {/* Signals List */}
      <div className="px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
            <p className={subtleColor}>Загрузка сигналов...</p>
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className={`w-16 h-16 mx-auto mb-4 ${subtleColor}`} />
            <p className={`text-xl font-bold ${textColor} mb-2`}>Нет сигналов</p>
            <p className={subtleColor}>Попробуйте изменить фильтры</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCalls.map((call) => {
              const meta = CATEGORY_META[call.category]
              const details = getDetails(call)
              const risk = getRiskLevel(call)
              const trader = TEAM_MEMBERS.find(t => t.id === call.userId)

              return (
                <div
                  key={call.id}
                  className={`p-4 rounded-xl border ${borderColor} ${cardBg} shadow-lg hover:shadow-xl transition-all group`}
                >
                  <div className={`flex items-start justify-between gap-4 ${call.status !== 'active' ? 'opacity-60' : ''}`}>
                    {/* Left: Icon & Title */}
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${meta.gradient} bg-opacity-10 text-white shrink-0`}>
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className={`font-bold ${textColor} truncate`}>{getPrimaryTitle(call)}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${riskBadges[risk]}`}>
                            {riskLabels[risk]}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${borderColor} ${subtleColor}`}>
                            {meta.label}
                          </span>
                          {call.status === 'completed' && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              Завершен
                            </span>
                          )}
                          {call.status === 'cancelled' && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" />
                              Отменен
                            </span>
                          )}
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-6 mt-3 max-w-3xl">
                          {details.entryPrice && (
                            <div className="flex flex-col">
                              <span className={`text-[10px] uppercase font-bold tracking-wider ${subtleColor} mb-0.5`}>Вход</span>
                              <span className={`text-sm font-medium ${textColor}`}>{details.entryPrice}</span>
                            </div>
                          )}
                          {details.targets && (
                            <div className="flex flex-col">
                              <span className={`text-[10px] uppercase font-bold tracking-wider ${subtleColor} mb-0.5`}>Цель</span>
                              <span className="text-sm font-medium text-emerald-500">{details.targets}</span>
                            </div>
                          )}
                          {details.stopLoss && (
                            <div className="flex flex-col">
                              <span className={`text-[10px] uppercase font-bold tracking-wider ${subtleColor} mb-0.5`}>Стоп</span>
                              <span className="text-sm font-medium text-rose-500">{details.stopLoss}</span>
                            </div>
                          )}
                          {trader && (
                            <div className="flex flex-col">
                              <span className={`text-[10px] uppercase font-bold tracking-wider ${subtleColor} mb-0.5`}>Автор</span>
                              <div className="flex items-center gap-1.5">
                                {trader.avatar ? (
                                  <img src={trader.avatar} className="w-4 h-4 rounded-full object-cover" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-[8px] flex items-center justify-center text-white">{trader.name[0]}</div>
                                )}
                                <span className={`text-sm font-medium ${textColor}`}>{trader.name}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      {/* Copy Signal */}
                      <button
                        onClick={() => {
                          const text = `🚀 ${meta.label}: ${getPrimaryTitle(call)}\n` +
                            (details.entryPrice ? `📍 Вход: ${details.entryPrice}\n` : '') +
                            (details.targets ? `🎯 Цели: ${details.targets}\n` : '') +
                            (details.stopLoss ? `🛑 Стоп: ${details.stopLoss}\n` : '') +
                            (details.contract ? `📝 CA: ${details.contract}\n` : '') +
                            (details.link ? `🔗 Ссылка: ${details.link}\n` : '') +
                            `👤 Трейдер: ${trader?.name || 'Admin'}`
                          navigator.clipboard.writeText(text)
                        }}
                        className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300' : 'hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700'}`}
                        title="Копировать сигнал"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Status Actions (Author or Admin) */}
                      {(isAdmin || user?.id === call.userId) && call.status === 'active' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(call.id, 'completed')}
                            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-emerald-500/20 text-emerald-400' : 'hover:bg-emerald-50 text-emerald-600'}`}
                            title="Завершить (Цели достигнуты)"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(call.id, 'cancelled')}
                            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-50 text-rose-600'}`}
                            title="Отменить сигнал"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {/* Restore Action (Author or Admin) */}
                      {(isAdmin || user?.id === call.userId) && call.status !== 'active' && (
                        <button
                          onClick={() => handleUpdateStatus(call.id, 'active')}
                          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}
                          title="Вернуть в работу"
                        >
                          <History className="w-4 h-4" />
                        </button>
                      )}

                      {/* Edit (Author or Admin) */}
                      {(isAdmin || user?.id === call.userId) && (
                        <button
                          onClick={() => handleEdit(call)}
                          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete (Admin Only) */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteClick(call.id)}
                          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          {/* Decorative background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <div className={`relative ${bgColor} rounded-3xl shadow-2xl shadow-black/50 border ${borderColor} max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300`}>
            {/* Header gradient accent - dynamic based on category */}
            <div className={`h-1.5 transition-all duration-300 ${
              formCategory === 'memecoins' ? 'bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-400' :
              formCategory === 'polymarket' ? 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500' :
              formCategory === 'nft' ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500' :
              formCategory === 'futures' ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500' :
              formCategory === 'spot' ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500' :
              formCategory === 'staking' ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400' :
              formCategory === 'airdrop' ? 'bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200' :
              'bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200'
            }`} />

            <div className="flex flex-col h-full">
              <div className={`p-5 flex items-center justify-between sticky top-0 z-20 ${bgColor} border-b ${borderColor}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                    formCategory === 'memecoins' ? 'bg-gradient-to-br from-teal-400 to-emerald-500 shadow-teal-400/30' :
                    formCategory === 'polymarket' ? 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30' :
                    formCategory === 'nft' ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/30' :
                    formCategory === 'futures' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30' :
                    formCategory === 'spot' ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30' :
                    formCategory === 'staking' ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-emerald-500/30' :
                    formCategory === 'airdrop' ? 'bg-gradient-to-br from-gray-400 to-gray-300 shadow-gray-400/30' :
                    'bg-gradient-to-br from-gray-400 to-gray-300 shadow-gray-400/30'
                  }`}>
                    {CATEGORY_META[formCategory].icon}
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${textColor}`}>
                      {editingCall ? 'Редактировать сигнал' : 'Новый сигнал'}
                    </h2>
                    <p className={`text-xs ${subtleColor}`}>
                      {editingCall ? 'Измените данные сигнала' : `Создайте сигнал: ${CATEGORY_META[formCategory].label}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 pb-6 pt-4 overflow-y-auto flex-1 max-h-[calc(90vh-80px)]">
                <CallForm
                  callToEdit={editingCall}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                  initialCategory={formCategory}
                  category={formCategory}
                  onCategoryChange={setFormCategory}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto overscroll-contain">
          <div className={`${bgColor} rounded-2xl shadow-2xl border ${borderColor} max-w-md w-full animate-in zoom-in-95 duration-200`}>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-red-500/10 text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${textColor}`}>Удалить сигнал?</h3>
                  <p className={subtleColor}>Это действие нельзя отменить</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteCallId(null) }}
                  className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} font-medium ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-gray-800 hover:bg-gray-50'}`}
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-600/20"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelCallId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto overscroll-contain">
          <div className={`${bgColor} rounded-2xl shadow-2xl border ${borderColor} max-w-md w-full`}>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-amber-500/10 text-amber-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${textColor}`}>Отменить сигнал?</h3>
                  <p className={subtleColor}>Статус станет «Отменен», запись останется в списке.</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCancelCallId(null)}
                  className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} font-medium ${theme === 'dark' ? 'text-white hover:bg-white/5' : 'text-gray-800 hover:bg-gray-50'}`}
                >
                  Отмена
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-4 py-3 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 shadow-lg shadow-amber-500/20"
                >
                  Отменить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
