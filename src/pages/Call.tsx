// Call page for team - Trading signals management
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { CallForm } from '@/components/Call/CallForm'
import { getCalls, deleteCall } from '@/services/firestoreService'
import type { Call } from '@/types'
import { Plus, X, Edit, Trash2, Copy, Check, Clock, Target, AlertCircle, FileText, Sparkles, Hash, Zap, Search } from 'lucide-react'

export const CallPage = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteCallId, setDeleteCallId] = useState<string | null>(null)
  const [editingCall, setEditingCall] = useState<Call | null>(null)
  const [copiedTicker, setCopiedTicker] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user?.id) {
      loadCalls()
    }
  }, [user?.id])

  const loadCalls = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const fetchedCalls = await getCalls({ userId: user.id })
      setCalls(fetchedCalls)
      console.log('Loaded calls:', fetchedCalls.length)
    } catch (error) {
      console.error('Error loading calls:', error)
      setCalls([])
    } finally {
      setLoading(false)
    }
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

  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200'

  const networkColors: Record<string, { bg: string; text: string; icon: string }> = {
    solana: { bg: 'bg-purple-500/10', text: 'text-purple-400', icon: 'bg-purple-500' },
    bsc: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', icon: 'bg-yellow-500' },
    ethereum: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: 'bg-blue-500' },
    base: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', icon: 'bg-indigo-500' },
    ton: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', icon: 'bg-cyan-500' },
    tron: { bg: 'bg-red-500/10', text: 'text-red-400', icon: 'bg-red-500' },
    sui: { bg: 'bg-green-500/10', text: 'text-green-400', icon: 'bg-green-500' },
    cex: { bg: 'bg-orange-500/10', text: 'text-orange-400', icon: 'bg-orange-500' }
  }

  const strategyLabels: Record<string, { label: string; icon: string; color: string }> = {
    flip: { label: 'Флип', icon: '🔄', color: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' },
    medium: { label: 'Среднесрок', icon: '📊', color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30' },
    long: { label: 'Долгосрок', icon: '⏰', color: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30' }
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: 'Активен', color: 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30' },
    completed: { label: 'Завершен', color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30' },
    cancelled: { label: 'Отменен', color: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30' },
    reviewed: { label: 'На рассмотрении', color: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30' }
  }

  const filteredCalls = calls.filter((call: Call) => 
    call.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
    call.network.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`${bgColor} rounded-2xl p-6 shadow-xl border ${borderColor} backdrop-blur-sm`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-4xl font-bold ${textColor} mb-2 flex items-center gap-3`}>
                <span className="bg-gradient-to-r from-green-500 via-green-400 to-green-600 text-transparent bg-clip-text">
                  Trading Signals
                </span>
              </h1>
              <p className={`${subtleColor} text-sm`}>Управление торговыми сигналами для команды</p>
            </div>
            <button
              onClick={() => {
                setEditingCall(null)
                setShowForm(true)
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
              }`}
            >
              <Plus className="w-5 h-5" />
              Создать сигнал
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
              className={`w-full pl-12 pr-4 py-3 rounded-xl border ${borderColor} ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
              } ${textColor} focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all`}
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className={`${bgColor} rounded-2xl p-8 shadow-2xl border ${borderColor} max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300`}>
              <div className="flex items-center justify-between mb-6">
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
              <CallForm callToEdit={editingCall} onSuccess={handleSuccess} onCancel={handleCancel} />
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className={`${bgColor} rounded-2xl p-8 shadow-2xl border ${borderColor} max-w-md w-full animate-in slide-in-from-bottom-4 duration-300`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-full bg-red-500/10">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${textColor}`}>Удалить сигнал?</h3>
                  <p className={subtleColor}>Это действие нельзя отменить</p>
                </div>
              </div>
              <div className="flex gap-4">
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
        )}

        {/* Calls List */}
        {!showForm && (
          <>
            {loading ? (
              <div className={`${bgColor} rounded-2xl p-12 text-center ${borderColor} border shadow-xl`}>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                <p className={`${subtleColor} text-lg`}>Загрузка сигналов...</p>
              </div>
            ) : calls.length === 0 ? (
              <div className={`${bgColor} rounded-2xl p-12 text-center ${borderColor} border shadow-xl`}>
                <Sparkles className={`w-20 h-20 mx-auto mb-6 ${subtleColor}`} />
                <h3 className={`text-2xl font-bold ${textColor} mb-2`}>
                  Нет сигналов
                </h3>
                <p className={subtleColor}>
                  Создайте первый торговый сигнал для команды
                </p>
                <p className={`${subtleColor} text-xs mt-2`}>
                  User ID: {user?.id || 'не загружен'}
                </p>
              </div>
            ) : filteredCalls.length === 0 ? (
              <div className={`${bgColor} rounded-2xl p-12 text-center ${borderColor} border shadow-xl`}>
                <Sparkles className={`w-20 h-20 mx-auto mb-6 ${subtleColor}`} />
                <h3 className={`text-2xl font-bold ${textColor} mb-2`}>
                  Ничего не найдено
                </h3>
                <p className={subtleColor}>
                  Попробуйте изменить запрос
                </p>
                <p className={`${subtleColor} text-xs mt-2`}>
                  Найдено сигналов: {calls.length}, отфильтровано: {filteredCalls.length}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredCalls.map((call: Call) => {
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
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-600 ${call.status === 'active' ? 'opacity-100' : 'opacity-50'}`}></div>

                      {/* Header Section */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          {/* Network Badge */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`${network.bg} ${network.text} px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border ${borderColor}`}>
                              <div className={`w-2 h-2 rounded-full ${network.icon}`}></div>
                              {call.network.toUpperCase()}
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
                              {status.label}
                            </span>
                          </div>

                          {/* Token Pair - Main Info */}
                          <div className="mb-3">
                            <h2 className={`text-3xl font-bold ${textColor} mb-1`}>{call.pair}</h2>
                            <p className={`text-xs ${subtleColor} uppercase tracking-wider`}>Торговая пара</p>
                          </div>

                          {/* Ticker ID - Less Prominent */}
                          <div className="flex items-center gap-2 mb-4">
                            <Hash className={`w-4 h-4 ${subtleColor}`} />
                            <span className={`font-mono text-sm ${subtleColor} bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded`}>
                              {call.ticker}
                            </span>
                            <button
                              onClick={() => copyTicker(call.ticker)}
                              className={`p-1.5 rounded-lg transition-all ${
                                theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                              title="Скопировать тикер"
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4 text-green-500" />
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

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Entry Point */}
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-green-50/50'} border ${borderColor}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                            <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor}`}>Вход</p>
                          </div>
                          <p className={`${textColor} font-medium`}>{call.entryPoint}</p>
                        </div>

                        {/* Target */}
                        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-blue-50/50'} border ${borderColor}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                            <p className={`text-xs font-semibold uppercase tracking-wider ${subtleColor}`}>Цели</p>
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
