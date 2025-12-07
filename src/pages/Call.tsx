// Call page for team - Trading signals management
import { useState, useEffect, useMemo } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { CallForm } from '@/components/Call/CallForm'
import { getCalls, deleteCall } from '@/services/firestoreService'
import type { Call } from '@/types'
import { TEAM_MEMBERS } from '@/types'
import { Plus, X, Edit, Trash2, Copy, Check, Clock, Target, AlertCircle, FileText, Sparkles, Zap, Search, BarChart3, TrendingUp, Users, Award, Activity } from 'lucide-react'

export const CallPage = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [deleteCallId, setDeleteCallId] = useState<string | null>(null)
  const [editingCall, setEditingCall] = useState<Call | null>(null)
  const [copiedTicker, setCopiedTicker] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'cancelled' | 'reviewed'>('all')

  // Prevent background scrolling when any modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    if (showForm || showDeleteModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [showForm, showDeleteModal])

  useEffect(() => {
    loadCalls()
  }, [])

  const loadCalls = async () => {
    setLoading(true)
    try {
      // Load all calls (not filtered by userId) to show team's signals
      const fetchedCalls = await getCalls()
      setCalls(fetchedCalls)
      console.log('Loaded calls:', fetchedCalls.length, 'User ID:', user?.id)
      if (fetchedCalls.length > 0) {
        console.log('First call userId:', fetchedCalls[0].userId)
      }
    } catch (error) {
      console.error('Error loading calls:', error)
      setCalls([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const traderStats: Record<string, {
      name: string
      totalCalls: number
      activeCalls: number
      completedCalls: number
      cancelledCalls: number
      avgPnL: number
      totalPnL: number
      maxProfit: number
    }> = {}

    calls.forEach((call) => {
      const trader = TEAM_MEMBERS.find(t => t.id === call.userId)
      const traderId = call.userId || 'unknown'
      const traderName = trader?.name || 'Неизвестный'

      if (!traderStats[traderId]) {
        traderStats[traderId] = {
          name: traderName,
          totalCalls: 0,
          activeCalls: 0,
          completedCalls: 0,
          cancelledCalls: 0,
          avgPnL: 0,
          totalPnL: 0,
          maxProfit: 0
        }
      }

      traderStats[traderId].totalCalls++
      if (call.status === 'active') traderStats[traderId].activeCalls++
      if (call.status === 'completed') traderStats[traderId].completedCalls++
      if (call.status === 'cancelled') traderStats[traderId].cancelledCalls++

      if (call.currentPnL !== undefined) {
        traderStats[traderId].totalPnL += call.currentPnL
      }
      if (call.maxProfit !== undefined && call.maxProfit > traderStats[traderId].maxProfit) {
        traderStats[traderId].maxProfit = call.maxProfit
      }
    })

    // Calculate average PnL
    Object.keys(traderStats).forEach((traderId) => {
      const stat = traderStats[traderId]
      if (stat.totalCalls > 0) {
        stat.avgPnL = stat.totalPnL / stat.totalCalls
      }
    })

    return Object.values(traderStats).sort((a, b) => b.totalCalls - a.totalCalls)
  }, [calls])

  const totalStats = useMemo(() => {
    const total = calls.length
    const active = calls.filter(c => c.status === 'active').length
    const completed = calls.filter(c => c.status === 'completed').length
    const cancelled = calls.filter(c => c.status === 'cancelled').length
    const avgPnL = calls.length > 0
      ? calls.reduce((sum, c) => sum + (c.currentPnL || 0), 0) / calls.length
      : 0
    const bestCall = calls.reduce((best, c) => {
      if (c.maxProfit !== undefined && (!best || (best.maxProfit || 0) < c.maxProfit)) {
        return c
      }
      return best
    }, null as Call | null)

    return { total, active, completed, cancelled, avgPnL, bestCall }
  }, [calls])

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

  const copyTicker = async (ticker: string) => {
    try {
      await navigator.clipboard.writeText(ticker)
      setCopiedTicker(ticker)
      setTimeout(() => setCopiedTicker(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const bgColor = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const pillInactive = theme === 'dark' ? 'bg-gray-800 text-gray-200 border border-gray-700' : 'bg-white text-gray-700 border border-gray-200'
  const pillActive = 'bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white shadow-lg shadow-emerald-500/30'

  const networkColors: Record<string, { bg: string; text: string; icon: string }> = {
    solana: { bg: 'bg-purple-500/10', text: 'text-purple-400', icon: 'bg-purple-500' },
    bsc: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', icon: 'bg-yellow-500' },
    ethereum: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: 'bg-blue-500' },
    base: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', icon: 'bg-indigo-500' },
    ton: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', icon: 'bg-cyan-500' },
    tron: { bg: 'bg-red-500/10', text: 'text-red-400', icon: 'bg-red-500' },
    sui: { bg: 'bg-[#4E6E49]/10', text: 'text-[#4E6E49]', icon: 'bg-[#4E6E49]' },
    cex: { bg: 'bg-orange-500/10', text: 'text-orange-400', icon: 'bg-orange-500' }
  }

  const strategyLabels: Record<string, { label: string; icon: string; color: string }> = {
    flip: { label: 'Флип', icon: '🔄', color: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' },
    medium: { label: 'Среднесрок', icon: '📊', color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30' },
    long: { label: 'Долгосрок', icon: '⏰', color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30' }
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: 'Активен', color: 'bg-[#4E6E49]/20 text-[#4E6E49] dark:text-[#4E6E49] border-[#4E6E49]/30' },
    completed: { label: 'Завершен', color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30' },
    cancelled: { label: 'Отменен', color: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30' },
    reviewed: { label: 'На рассмотрении', color: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30' }
  }

  const filteredCalls = calls
    .filter((call: Call) => 
      call.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.network.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((call: Call) => statusFilter === 'all' ? true : call.status === statusFilter)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`rounded-2xl p-8 ${bgColor} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]' 
            : 'border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white'
        } relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-700/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -ml-24 -mb-24" />
          
          <div className="relative z-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`p-4 rounded-2xl shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-br from-[#4E6E49] to-emerald-700' 
                      : 'bg-gradient-to-br from-[#4E6E49] to-emerald-700'
                  } text-white`}>
                    <Zap className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className={`text-4xl font-extrabold ${textColor} flex items-center gap-3`}>
                      <span className="bg-gradient-to-r from-[#4E6E49] via-emerald-600 to-blue-600 text-transparent bg-clip-text">
                        Trading Signals
                      </span>
                    </h1>
                    <p className={`text-sm font-medium ${subtleColor} flex items-center gap-2`}>
                      <span className="text-[#4E6E49]">●</span>
                      Управление торговыми сигналами для команды
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingCall(null)
                  setShowForm(true)
                }}
                className={`w-full lg:w-auto px-6 py-4 bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] hover:from-[#4E6E49] hover:to-[#4E6E49] text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform`}
              >
                <Plus className="w-5 h-5" />
                <span>Создать сигнал</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${subtleColor}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Поиск по тикеру, паре или сети..."
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${borderColor} ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                } ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">
                {filteredCalls.length}/{calls.length}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        {showStats && calls.length > 0 && (
          <div className={`${bgColor} rounded-2xl p-6 shadow-xl border ${borderColor}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <h2 className={`text-2xl font-bold ${textColor} flex items-center gap-2`}>
                <BarChart3 className="w-6 h-6 text-[#4E6E49]" />
                Аналитика
              </h2>
              <div className="flex flex-wrap gap-2">
                {(['all','active','completed','cancelled','reviewed'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      statusFilter === status ? pillActive : pillInactive
                    }`}
                  >
                    {status === 'all' && 'Все'}
                    {status === 'active' && 'Активные'}
                    {status === 'completed' && 'Завершенные'}
                    {status === 'cancelled' && 'Отмененные'}
                    {status === 'reviewed' && 'На рассмотрении'}
                  </button>
                ))}
                <button
                  onClick={() => setShowStats(!showStats)}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  title="Скрыть аналитику"
                >
                  <X className={`w-5 h-5 ${subtleColor}`} />
                </button>
              </div>
            </div>

            {/* Total Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor}`}>Всего сигналов</p>
                </div>
                <p className={`text-2xl font-bold ${textColor}`}>{totalStats.total}</p>
              </div>
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-[#4E6E49]" />
                  <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor}`}>Активных</p>
                </div>
                <p className={`text-2xl font-bold ${textColor}`}>{totalStats.active}</p>
              </div>
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-purple-500" />
                  <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor}`}>Завершено</p>
                </div>
                <p className={`text-2xl font-bold ${textColor}`}>{totalStats.completed}</p>
              </div>
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor}`}>Средний PNL</p>
                </div>
                <p className={`text-2xl font-bold ${totalStats.avgPnL >= 0 ? 'text-[#4E6E49]' : 'text-red-500'}`}>
                  {totalStats.avgPnL >= 0 ? '+' : ''}{totalStats.avgPnL.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Best Call */}
            {totalStats.bestCall && (
              <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-[#4E6E49]/10 to-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-[#4E6E49]" />
                  <p className={`text-sm font-semibold ${textColor}`}>Лучший сигнал</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold ${textColor}`}>{totalStats.bestCall.pair}</p>
                    <p className={`text-xs ${subtleColor}`}>Тикер: {totalStats.bestCall.ticker}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold text-[#4E6E49]`}>
                      +{totalStats.bestCall.maxProfit?.toFixed(2) || '0.00'}%
                    </p>
                    <p className={`text-xs ${subtleColor}`}>MAX прибыль</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trader Statistics */}
            <div>
              <h3 className={`text-lg font-bold ${textColor} mb-4 flex items-center gap-2`}>
                <Users className="w-5 h-5 text-[#4E6E49]" />
                Статистика по трейдерам
              </h3>
              <div className="space-y-3">
                {stats.map((stat) => (
                  <div
                    key={stat.name}
                    className={`p-4 rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] flex items-center justify-center text-white font-bold">
                          {stat.name[0]}
                        </div>
                        <div>
                          <p className={`font-bold ${textColor}`}>{stat.name}</p>
                          <p className={`text-xs ${subtleColor}`}>Всего сигналов: {stat.totalCalls}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${stat.avgPnL >= 0 ? 'text-[#4E6E49]' : 'text-red-500'}`}>
                          {stat.avgPnL >= 0 ? '+' : ''}{stat.avgPnL.toFixed(2)}%
                        </p>
                        <p className={`text-xs ${subtleColor}`}>Средний PNL</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className={`p-2 rounded-lg text-center ${theme === 'dark' ? 'bg-[#4E6E49]/10' : 'bg-green-50'}`}>
                        <p className={`text-sm font-bold ${textColor}`}>{stat.activeCalls}</p>
                        <p className={`text-xs ${subtleColor}`}>Активных</p>
                      </div>
                      <div className={`p-2 rounded-lg text-center ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                        <p className={`text-sm font-bold ${textColor}`}>{stat.completedCalls}</p>
                        <p className={`text-xs ${subtleColor}`}>Завершено</p>
                      </div>
                      <div className={`p-2 rounded-lg text-center ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'}`}>
                        <p className={`text-sm font-bold ${textColor}`}>{stat.cancelledCalls}</p>
                        <p className={`text-xs ${subtleColor}`}>Отменено</p>
                      </div>
                      <div className={`p-2 rounded-lg text-center ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                        <p className={`text-sm font-bold text-purple-500`}>+{stat.maxProfit.toFixed(1)}%</p>
                        <p className={`text-xs ${subtleColor}`}>MAX</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Toggle Stats Button */}
        {calls.length > 0 && !showStats && (
          <button
            onClick={() => setShowStats(true)}
            className={`w-full ${bgColor} rounded-xl p-4 shadow-lg border ${borderColor} hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
              theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-5 h-5 text-[#4E6E49]" />
            <span className={`font-semibold ${textColor}`}>Показать аналитику</span>
          </button>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-start sm:items-center justify-center p-4 animate-in fade-in duration-200">
            <div className={`${bgColor} rounded-2xl shadow-2xl border ${borderColor} max-w-2xl w-full max-h-[85dvh] sm:max-h-[calc(100dvh-96px)] animate-in slide-in-from-bottom-4 duration-300`}>
              <div className="flex flex-col h-full">
                <div className="p-8 pb-4 flex items-center justify-between shrink-0">
                  <h2 className={`text-3xl font-bold ${textColor}`}>
                    {editingCall ? 'Редактировать сигнал' : 'Создать новый сигнал'}
                  </h2>
                  <button
                    onClick={handleCancel}
                    className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    <X className={`w-6 h-6 ${subtleColor}`} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto overscroll-contain px-8 pb-8 min-h-0">
                  <CallForm callToEdit={editingCall} onSuccess={handleSuccess} onCancel={handleCancel} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-start sm:items-center justify-center p-4 animate-in fade-in duration-200">
            <div className={`${bgColor} rounded-2xl shadow-2xl border ${borderColor} max-w-md w-full max-h-[70dvh] sm:max-h-[calc(100dvh-96px)] animate-in slide-in-from-bottom-4 duration-300`}>
              <div className="flex flex-col h-full p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-full bg-red-500/10">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${textColor}`}>Удалить сигнал?</h3>
                    <p className={subtleColor}>Это действие нельзя отменить</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setDeleteCallId(null)
                    }}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }`}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors ${
                      theme === 'dark'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
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
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#4E6E49] border-t-transparent mx-auto mb-4"></div>
                <p className={`${subtleColor} text-lg`}>Загрузка сигналов...</p>
              </div>
            ) : calls.length === 0 ? (
              <div className={`${bgColor} rounded-2xl p-12 text-center ${borderColor} border shadow-xl`}>
                <Sparkles className={`w-20 h-20 mx-auto mb-6 ${subtleColor}`} />
                <h3 className={`text-2xl font-bold ${textColor} mb-2`}>Нет сигналов</h3>
                <p className={subtleColor}>Создайте первый торговый сигнал для команды</p>
              </div>
            ) : filteredCalls.length === 0 ? (
              <div className={`${bgColor} rounded-2xl p-12 text-center ${borderColor} border shadow-xl`}>
                <Sparkles className={`w-20 h-20 mx-auto mb-6 ${subtleColor}`} />
                <h3 className={`text-2xl font-bold ${textColor} mb-2`}>Ничего не найдено</h3>
                <p className={subtleColor}>Попробуйте изменить запрос</p>
                <p className={`${subtleColor} text-xs mt-2`}>
                  Найдено сигналов: {calls.length}, отфильтровано: {filteredCalls.length}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredCalls.map((call: Call) => {
                  const trader = TEAM_MEMBERS.find(t => t.id === call.userId)
                  const network = networkColors[call.network] || { bg: 'bg-gray-500/10', text: 'text-gray-400', icon: 'bg-gray-500' }
                  const strategy = strategyLabels[call.strategy] || strategyLabels.flip
                  const status = statusLabels[call.status] || statusLabels.active
                  const isCopied = copiedTicker === call.ticker
                  
                  return (
                    <div
                      key={call.id}
                      className={`${bgColor} rounded-2xl p-6 shadow-xl border ${borderColor} hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
                    >
                      {/* Gradient accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4E6E49] via-[#4E6E49] to-[#4E6E49] ${call.status === 'active' ? 'opacity-100' : 'opacity-50'}`}></div>

                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          {/* Network Badge & Trader */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`${network.bg} ${network.text} px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border ${borderColor}`}>
                              <div className={`w-2 h-2 rounded-full ${network.icon}`}></div>
                              {call.network.toUpperCase()}
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
                              {status.label}
                            </span>
                            {trader && (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] flex items-center justify-center text-white text-xs font-bold">
                                  {trader.name[0]}
                                </div>
                                <span className={`text-xs ${subtleColor}`}>{trader.name}</span>
                              </div>
                            )}
                          </div>

                          {/* Token Pair - Main Info */}
                          <div className="mb-3">
                            <h2 className={`text-3xl font-bold ${textColor} mb-1`}>{call.pair}</h2>
                            <p className={`text-xs ${subtleColor} uppercase tracking-wider`}>Торговая пара</p>
                          </div>

                          {/* Ticker ID - Less Prominent */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className={`font-mono text-sm ${subtleColor} bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded`}>
                              № {call.ticker}
                            </span>
                            <button
                              onClick={() => copyTicker(call.ticker)}
                              className={`p-1.5 rounded-lg transition-all ${
                                theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                              title="Скопировать тикер"
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4 text-[#4E6E49]" />
                              ) : (
                                <Copy className={`w-4 h-4 ${subtleColor}`} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(call)}
                            className={`p-3 rounded-xl transition-all duration-200 ${
                              theme === 'dark'
                                ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                            }`}
                            title="Редактировать"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(call.id)}
                            className={`p-3 rounded-xl transition-all duration-200 ${
                              theme === 'dark'
                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                                : 'bg-red-50 hover:bg-red-100 text-red-600'
                            }`}
                            title="Удалить"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      {(call.maxProfit !== undefined || call.currentPnL !== undefined) && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {call.maxProfit !== undefined && (
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-green-50 border border-green-200'}`}>
                              <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor} mb-1`}>MAX прибыль</p>
                              <p className={`text-xl font-bold text-[#4E6E49]`}>+{call.maxProfit.toFixed(2)}%</p>
                            </div>
                          )}
                          {call.currentPnL !== undefined && (
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? call.currentPnL >= 0 ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/20' : 'bg-red-500/10 border border-red-500/20' : call.currentPnL >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                              <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor} mb-1`}>Текущий PNL</p>
                              <p className={`text-xl font-bold ${call.currentPnL >= 0 ? 'text-[#4E6E49]' : 'text-red-500'}`}>
                                {call.currentPnL >= 0 ? '+' : ''}{call.currentPnL.toFixed(2)}%
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Entry Point */}
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-green-50/50'} border ${borderColor}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className={`w-4 h-4 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                            <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor}`}>Вход (капитализация)</p>
                          </div>
                          <p className={`${textColor} font-medium`}>{call.entryPoint}</p>
                        </div>

                        {/* Target */}
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-blue-50/50'} border ${borderColor}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                            <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor}`}>Цели (капитализация)</p>
                          </div>
                          <p className={`${textColor} font-medium`}>{call.target}</p>
                        </div>

                        {/* Strategy */}
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-purple-50/50'} border ${borderColor}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className={`w-4 h-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                            <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor}`}>Стратегия</p>
                          </div>
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${strategy.color}`}>
                            {strategy.icon} {strategy.label}
                          </span>
                        </div>

                        {/* Created Date */}
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/50'} border ${borderColor}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className={`w-4 h-4 ${subtleColor}`} />
                            <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor}`}>Создан</p>
                          </div>
                          <p className={`${textColor} text-sm`}>
                            {new Date(call.createdAt).toLocaleDateString('ru-RU', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Risks & Conditions */}
                      <div className="space-y-3 mb-4">
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50/50 border-red-200/50'} border`}>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                            <p className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Риски</p>
                          </div>
                          <p className={`${textColor} text-sm leading-relaxed`}>{call.risks}</p>
                        </div>

                        {call.cancelConditions && (
                          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50/50 border-orange-200/50'} border`}>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                              <p className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>Условия отмены</p>
                            </div>
                            <p className={`${textColor} text-sm leading-relaxed`}>{call.cancelConditions}</p>
                          </div>
                        )}

                        {call.comment && (
                          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50/50'} border ${borderColor}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className={`w-4 h-4 ${subtleColor}`} />
                              <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor}`}>Комментарий</p>
                            </div>
                            <p className={`${textColor} text-sm leading-relaxed`}>{call.comment}</p>
                          </div>
                        )}
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
