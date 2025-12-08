// Signals HUB page redesigned for multi-domain signals
import { useState, useEffect, useMemo, type JSX } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { Layout } from '@/components/Layout'
import { CallForm } from '@/components/Call/CallForm'
import { getCalls, deleteCall } from '@/services/firestoreService'
import type { Call, CallCategory, CallRiskLevel } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import {
  X,
  Edit,
  Trash2,
  Copy,
  Check,
  Search,
  Zap,
  Sparkles,
  Filter,
  Shield,
  Rocket,
  LineChart,
  Image,
  Coins,
  Target,
  AlertTriangle,
} from 'lucide-react'
import { useScrollLock } from '@/hooks/useScrollLock'

type StatusFilter = 'all' | 'active' | 'completed' | 'cancelled' | 'reviewed'
type RiskFilter = 'all' | CallRiskLevel

const CATEGORY_META: Record<CallCategory, { label: string; gradient: string; chip: string; icon: JSX.Element }> = {
  memecoins: { label: 'Мемкоины', gradient: 'from-emerald-400 to-teal-500', chip: 'bg-emerald-500/10 text-emerald-600', icon: <Rocket className="w-4 h-4" /> },
  futures: { label: 'Фьючерсы', gradient: 'from-blue-400 to-indigo-500', chip: 'bg-blue-500/10 text-blue-600', icon: <LineChart className="w-4 h-4" /> },
  nft: { label: 'NFT', gradient: 'from-purple-400 to-pink-500', chip: 'bg-purple-500/10 text-purple-600', icon: <Image className="w-4 h-4" /> },
  spot: { label: 'Спот', gradient: 'from-amber-400 to-orange-500', chip: 'bg-amber-500/10 text-amber-600', icon: <Coins className="w-4 h-4" /> },
  polymarket: { label: 'Polymarket', gradient: 'from-rose-400 to-red-500', chip: 'bg-rose-500/10 text-rose-600', icon: <Target className="w-4 h-4" /> },
  staking: { label: 'Стейкинг', gradient: 'from-cyan-400 to-blue-500', chip: 'bg-cyan-500/10 text-cyan-600', icon: <Shield className="w-4 h-4" /> },
}

const statusLabels: Record<StatusFilter, { label: string; className: string }> = {
  all: { label: 'Все', className: '' },
  active: { label: 'Активен', className: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20' },
  completed: { label: 'Завершен', className: 'bg-blue-500/15 text-blue-500 border border-blue-500/20' },
  cancelled: { label: 'Отменен', className: 'bg-red-500/15 text-red-500 border border-red-500/20' },
  reviewed: { label: 'На рассмотрении', className: 'bg-gray-500/15 text-gray-500 border border-gray-500/20' },
}

const riskBadges: Record<CallRiskLevel, string> = {
  low: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
  medium: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  high: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
  ultra: 'bg-red-500/10 text-red-600 border border-red-500/20',
}

export const CallPage = () => {
  const { theme } = useThemeStore()
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteCallId, setDeleteCallId] = useState<string | null>(null)
  const [editingCall, setEditingCall] = useState<Call | null>(null)
  const [formCategory, setFormCategory] = useState<CallCategory>('memecoins')
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | CallCategory>('all')
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all')
  const [traderFilter, setTraderFilter] = useState<'all' | string>('all')

  useScrollLock(showForm || showDeleteModal)

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

  const bgColor = theme === 'dark' ? 'bg-[#121212]' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const categoryTone: Record<CallCategory, { bg: string; text: string; border: string; chipBg: string }> = {
    memecoins: {
      bg: theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50',
      text: theme === 'dark' ? 'text-emerald-100' : 'text-emerald-800',
      border: theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-200',
      chipBg: theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-500/10',
    },
    futures: {
      bg: theme === 'dark' ? 'bg-sky-500/10' : 'bg-sky-50',
      text: theme === 'dark' ? 'text-sky-100' : 'text-sky-800',
      border: theme === 'dark' ? 'border-sky-500/30' : 'border-sky-200',
      chipBg: theme === 'dark' ? 'bg-sky-500/20' : 'bg-sky-500/10',
    },
    nft: {
      bg: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50',
      text: theme === 'dark' ? 'text-purple-100' : 'text-purple-800',
      border: theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200',
      chipBg: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10',
    },
    spot: {
      bg: theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50',
      text: theme === 'dark' ? 'text-amber-100' : 'text-amber-800',
      border: theme === 'dark' ? 'border-amber-500/30' : 'border-amber-200',
      chipBg: theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-500/10',
    },
    polymarket: {
      bg: theme === 'dark' ? 'bg-rose-500/10' : 'bg-rose-50',
      text: theme === 'dark' ? 'text-rose-100' : 'text-rose-800',
      border: theme === 'dark' ? 'border-rose-500/30' : 'border-rose-200',
      chipBg: theme === 'dark' ? 'bg-rose-500/20' : 'bg-rose-500/10',
    },
    staking: {
      bg: theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50',
      text: theme === 'dark' ? 'text-cyan-100' : 'text-cyan-800',
      border: theme === 'dark' ? 'border-cyan-500/30' : 'border-cyan-200',
      chipBg: theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-500/10',
    },
  }

  const handleSuccess = () => {
    setShowForm(false)
    setEditingCall(null)
    loadCalls()
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCall(null)
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

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedValue(value)
      setTimeout(() => setCopiedValue(null), 1800)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const getDetails = (call: Call) => (call.details as any)?.[call.category] || {}

  const getPrimaryTitle = (call: Call) => {
    const d = getDetails(call)
    switch (call.category) {
      case 'memecoins':
        return d.coinName || d.ticker || 'Мемкоин'
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
      default:
        return 'Сигнал'
    }
  }

  const getSecondary = (call: Call) => {
    const d = getDetails(call)
    switch (call.category) {
      case 'memecoins':
        return `${d.ticker || ''} ${d.network ? `• ${String(d.network).toUpperCase()}` : ''}`.trim()
      case 'futures':
        return `${d.direction === 'long' ? 'Long' : 'Short'} • ${d.timeframe || ''}`
      case 'nft':
        return `${d.marketplace || ''}${d.network ? ` • ${String(d.network).toUpperCase()}` : ''}`
      case 'spot':
        return d.holdingHorizon ? `Горизонт: ${d.holdingHorizon}` : ''
      case 'polymarket':
        return `${d.positionType === 'yes' ? 'YES' : 'NO'} • ${d.entryPrice || ''}`
      case 'staking':
        return `${d.platform || ''}${d.term ? ` • ${d.term}` : ''}`
      default:
        return ''
    }
  }

  const getRiskLevel = (call: Call): CallRiskLevel => call.riskLevel || getDetails(call).riskLevel || getDetails(call).protocolRisk || 'medium'

  const composeSearchString = (call: Call) => {
    const d = getDetails(call)
    const base = [
      call.category,
      call.status,
      call.comment,
      d.coinName,
      d.ticker,
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

  const filteredCalls = calls
    .filter((call) => {
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
      polymarket: { total: 0, active: 0 },
      staking: { total: 0, active: 0 },
    })
  }, [calls])

  const totals = useMemo(() => ({
    total: calls.length,
    active: calls.filter((c) => c.status === 'active').length,
    completed: calls.filter((c) => c.status === 'completed').length,
    highRisk: calls.filter((c) => getRiskLevel(c) === 'high' || getRiskLevel(c) === 'ultra').length,
  }), [calls])

  const pillInactive = theme === 'dark' ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-700 border border-gray-200'
  const pillActive = 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-300/30'

  const renderQuickStat = (label: string, value: string | number, accent: string) => (
    <div className={`p-4 rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-gray-50'}`}>
      <p className={`text-xs uppercase tracking-wider ${subtleColor}`}>{label}</p>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  )

  const renderFieldsGrid = (call: Call) => {
    const d = getDetails(call)
    const blocks: { label: string; value?: string; icon?: JSX.Element }[] = []

    switch (call.category) {
      case 'memecoins':
        blocks.push(
          { label: 'Тип', value: d.signalType?.toUpperCase() },
          { label: 'Сеть', value: d.network ? String(d.network).toUpperCase() : '' },
          { label: 'Вход (кап.)', value: d.entryCap },
          { label: 'Цели', value: d.targets },
          { label: 'SL', value: d.stopLoss },
          { label: 'План', value: d.holdPlan },
          { label: 'Ликвидность', value: d.liquidityLocked ? 'Залочена' : '—' },
        )
        break
      case 'futures':
        blocks.push(
          { label: 'Направление', value: d.direction ? d.direction.toUpperCase() : '' },
          { label: 'Плечо', value: d.leverage },
          { label: 'Вход', value: d.entryZone || d.entryPrice },
          { label: 'Цели', value: d.targets },
          { label: 'SL', value: d.stopLoss },
          { label: 'Стиль', value: d.signalStyle },
          { label: 'Размер позиции', value: d.positionSize },
        )
        break
      case 'nft':
        blocks.push(
          { label: 'Маркетплейс', value: d.marketplace },
          { label: 'Сеть', value: d.network ? String(d.network).toUpperCase() : '' },
          { label: 'Вход', value: d.entryPrice },
          { label: 'Рарность', value: d.rarity },
          { label: 'Ликвидность', value: d.minLiquidity },
          { label: 'Target', value: d.targetPrice },
          { label: 'Тип', value: d.signalType },
        )
        break
      case 'spot':
        blocks.push(
          { label: 'Вход (кап.)', value: d.entryCap },
          { label: 'Цели', value: d.targets },
          { label: 'SL', value: d.stopLoss },
          { label: 'Горизонт', value: d.holdingHorizon },
          { label: 'Размер', value: d.positionSize },
        )
        break
      case 'polymarket':
        blocks.push(
          { label: 'Позиция', value: d.positionType === 'yes' ? 'YES' : 'NO' },
          { label: 'Вход %', value: d.entryPrice },
          { label: 'Ожидание %', value: d.expectedProbability },
          { label: 'Срок', value: d.eventDeadline },
          { label: 'Макс ставка', value: d.maxStake },
          { label: 'Цель', value: d.targetPlan },
        )
        break
      case 'staking':
        blocks.push(
          { label: 'Платформа', value: d.platform },
          { label: 'Срок', value: d.term },
          { label: 'APY', value: d.apy },
          { label: 'Мин. депозит', value: d.minDeposit },
          { label: 'Тип', value: d.action },
          { label: 'Риск протокола', value: d.protocolRisk },
        )
        break
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {blocks.filter(b => b.value).map((block) => (
          <div key={block.label} className={`p-3 rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
            <p className={`text-[11px] uppercase tracking-wider ${subtleColor}`}>{block.label}</p>
            <p className={`${textColor} font-semibold truncate`}>{block.value}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderNarrative = (title: string, value?: string) => {
    if (!value) return null
    return (
      <div className={`p-4 rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
        <p className={`text-xs uppercase tracking-wider ${subtleColor} mb-1`}>{title}</p>
        <p className={`${textColor} leading-relaxed text-sm whitespace-pre-line`}>{value}</p>
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Hero */}
        <div className={`relative overflow-hidden rounded-2xl p-6 sm:p-7 md:p-8 border-2 shadow-2xl ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#151c2a] via-[#0f1623] to-[#0a101b] border-[#4E6E49]/35'
            : 'bg-gradient-to-br from-white via-emerald-50/25 to-white border-emerald-200'
        }`}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-16 w-64 h-64 bg-gradient-to-br from-[#4E6E49]/18 via-transparent to-transparent blur-3xl" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-sky-400/14 via-emerald-400/12 to-transparent blur-3xl" />
            <div className="absolute bottom-[-120px] left-12 w-64 h-64 bg-gradient-to-tr from-amber-300/14 via-[#4E6E49]/12 to-transparent blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#4E6E49] via-emerald-500 to-sky-500 text-white shadow-lg shadow-emerald-500/30">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-lg leading-tight">
                    Signals HUB
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3" />
          </div>
        </div>

        {/* Category mini-cards (aligned with Tasks style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {(Object.keys(CATEGORY_META) as CallCategory[]).map((cat) => {
            const meta = CATEGORY_META[cat]
            const stats = categoryStats[cat]
            const tone = categoryTone[cat]
            return (
              <button
                key={cat}
                onClick={() => { setFormCategory(cat); setEditingCall(null); setShowForm(true) }}
                className={`p-4 rounded-xl border ${tone.border} ${tone.bg} text-left shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 space-y-2`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold border border-transparent ${tone.text}`}>
                    {meta.icon}
                    <span>{meta.label}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${tone.border} ${tone.text} ${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'}`}>
                    Добавить
                  </span>
                </div>
                <div>
                  <p className={`text-2xl font-extrabold ${textColor}`}>{stats?.total || 0}</p>
                  <p className={`text-xs ${subtleColor}`}>Всего сигналов • Активных {stats?.active || 0}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Filters + analytics */}
        <div className={`rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-900/70' : 'bg-white'} p-5 space-y-4`}>
          <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Filter className={`w-4 h-4 ${subtleColor}`} />
                <span className={textColor}>Фильтры</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(statusLabels) as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                      statusFilter === status ? pillActive : pillInactive
                    }`}
                  >
                    {statusLabels[status].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={`text-xs uppercase tracking-wider ${subtleColor} flex items-center gap-2`}>
                <Search className="w-4 h-4" />
                Поиск по всем сферам <span className="text-[11px] text-gray-500 dark:text-gray-400">{filteredCalls.length}/{calls.length}</span>
              </label>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="тикер, событие, сеть, причина..."
                className={`w-full px-3 py-2 rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/60`}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs ${subtleColor} uppercase tracking-wider`}>Сфера:</span>
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${categoryFilter === 'all' ? pillActive : pillInactive}`}
              >
                Все
              </button>
              {(Object.keys(CATEGORY_META) as CallCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${categoryFilter === cat ? pillActive : pillInactive}`}
                >
                  {CATEGORY_META[cat].label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs ${subtleColor} uppercase tracking-wider`}>Риск:</span>
              {(['all', 'low', 'medium', 'high', 'ultra'] as RiskFilter[]).map((risk) => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${riskFilter === risk ? pillActive : pillInactive}`}
                >
                  {risk === 'all' ? 'Все' : risk}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs ${subtleColor} uppercase tracking-wider`}>Трейдер:</span>
              <select
                value={traderFilter}
                onChange={(e) => setTraderFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
              >
                <option value="all">Все трейдеры</option>
                {TEAM_MEMBERS.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {renderQuickStat('Всего сигналов', totals.total, textColor)}
              {renderQuickStat('Активных', totals.active, 'text-emerald-500')}
              {renderQuickStat('Завершено', totals.completed, 'text-blue-500')}
              {renderQuickStat('High risk', totals.highRisk, 'text-amber-500')}
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
            <div className={`${bgColor} rounded-2xl shadow-2xl border ${borderColor} max-w-3xl w-full max-h-[90vh] overflow-hidden`}>
              <div className="flex flex-col h-full">
                <div className={`p-6 flex items-center justify-between sticky top-0 z-20 ${bgColor} border-b ${borderColor} shadow-sm`}>
                  <h2 className={`text-2xl font-bold ${textColor}`}>{editingCall ? 'Редактировать сигнал' : 'Создать сигнал'}</h2>
                  <button
                    onClick={handleCancel}
                    className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <X className={`w-5 h-5 ${subtleColor}`} />
                  </button>
                </div>
                <div className="px-6 pb-6 pt-2 overflow-y-auto flex-1 max-h-[75vh]">
                  <CallForm
                    callToEdit={editingCall}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                    initialCategory={formCategory}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto overscroll-contain">
            <div className={`${bgColor} rounded-2xl shadow-2xl border ${borderColor} max-w-md w-full`}>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className={`text-xl font-bold ${textColor}`}>Удалить сигнал?</h3>
                    <p className={subtleColor}>Это действие нельзя отменить</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowDeleteModal(false); setDeleteCallId(null) }}
                    className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calls List */}
        {!showForm && (
          <>
            {loading ? (
              <div className={`${bgColor} rounded-2xl p-12 text-center ${borderColor} border shadow-xl`}>
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#4E6E49] border-t-transparent mx-auto mb-4"></div>
                <p className={`${subtleColor} text-lg`}>Загрузка сигналов...</p>
              </div>
            ) : calls.length === 0 ? (
              <div className={`${bgColor} rounded-2xl p-12 text-center ${borderColor} border shadow-xl`}>
                <Sparkles className={`w-16 h-16 mx-auto mb-4 ${subtleColor}`} />
                <p className={`text-xl font-bold ${textColor}`}>Пока пусто</p>
                <p className={subtleColor}>Создайте первый сигнал в новой структуре</p>
              </div>
            ) : filteredCalls.length === 0 ? (
              <div className={`${bgColor} rounded-2xl p-12 text-center ${borderColor} border shadow-xl`}>
                <Sparkles className={`w-16 h-16 mx-auto mb-4 ${subtleColor}`} />
                <p className={`text-xl font-bold ${textColor}`}>Нет совпадений</p>
                <p className={subtleColor}>Сигналы есть ({calls.length}), но фильтр ничего не нашел.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredCalls.map((call) => {
                  const meta = CATEGORY_META[call.category]
                  const statusMeta = statusLabels[call.status as StatusFilter] || statusLabels.active
                  const riskLevel = getRiskLevel(call)
                  const details = getDetails(call)
                  const trader = TEAM_MEMBERS.find(t => t.id === call.userId)
                  const keyCopyValue = details.ticker || details.pair || details.coin || getPrimaryTitle(call)
                  const createdDate = new Date(call.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

                  return (
                    <div key={call.id} className={`${bgColor} rounded-2xl border ${borderColor} shadow-lg overflow-hidden`}>
                      <div className="border-b border-gray-800/30 flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ${meta.chip}`}>
                            {meta.icon}
                            {meta.label}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusMeta.className}`}>{statusMeta.label}</span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${riskBadges[riskLevel]}`}>Риск: {riskLevel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {trader && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                                {trader.name[0]}
                              </div>
                              <span className={`text-xs ${subtleColor}`}>{trader.name}</span>
                            </div>
                          )}
                          <span className={`text-xs ${subtleColor}`}>{createdDate}</span>
                          <button
                            onClick={() => handleEdit(call)}
                            className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(call.id)}
                            className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className={`text-2xl font-bold ${textColor}`}>{getPrimaryTitle(call)}</p>
                            <p className={`text-sm ${subtleColor}`}>{getSecondary(call)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => copyValue(keyCopyValue)}
                              className={`px-3 py-2 rounded-xl border ${borderColor} ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} text-sm font-semibold flex items-center gap-2`}
                            >
                              {copiedValue === keyCopyValue ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                              {copiedValue === keyCopyValue ? 'Скопировано' : 'Скопировать'}
                            </button>
                          </div>
                        </div>

                        {renderFieldsGrid(call)}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {renderNarrative('Причина входа', details.reason)}
                          {renderNarrative('Комментарий трейдера', details.traderComment || call.comment)}
                          {renderNarrative('Риски', details.risks)}
                          {call.currentPnL !== undefined && (
                            <div className={`p-4 rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
                              <p className={`text-xs uppercase tracking-wider ${subtleColor} mb-1`}>Текущий PNL</p>
                              <p className={`text-xl font-bold ${call.currentPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{call.currentPnL >= 0 ? '+' : ''}{call.currentPnL.toFixed(2)}%</p>
                            </div>
                          )}
                          {call.maxProfit !== undefined && (
                            <div className={`p-4 rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-50'}`}>
                              <p className={`text-xs uppercase tracking-wider ${subtleColor} mb-1`}>MAX прибыль</p>
                              <p className="text-xl font-bold text-emerald-500">+{call.maxProfit.toFixed(2)}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
