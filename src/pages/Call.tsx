// Call page for team - Trading signals management
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { Layout } from '@/components/Layout'
import { CallForm } from '@/components/Call/CallForm'
import { getCalls, deleteCall } from '@/services/firestoreService'
import type { Call } from '@/types'
import { Plus, X, Edit, Trash2, Copy, Check, Clock, Target, AlertCircle, FileText, Sparkles } from 'lucide-react'

export const CallPage = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCall, setEditingCall] = useState<Call | null>(null)
  const [copiedTicker, setCopiedTicker] = useState<string | null>(null)

  useEffect(() => {
    loadCalls()
  }, [])

  const loadCalls = async () => {
    setLoading(true)
    try {
      const fetchedCalls = await getCalls({ userId: user?.id })
      setCalls(fetchedCalls)
    } catch (error) {
      console.error('Error loading calls:', error)
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

  const handleDelete = async (callId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот сигнал?')) {
      return
    }
    try {
      await deleteCall(callId)
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

  const networkColors: Record<string, string> = {
    solana: 'bg-purple-500',
    bsc: 'bg-yellow-500',
    ethereum: 'bg-blue-500',
    base: 'bg-indigo-500',
    ton: 'bg-cyan-500',
    tron: 'bg-red-500',
    sui: 'bg-green-500',
    cex: 'bg-orange-500'
  }

  const strategyLabels: Record<string, string> = {
    flip: '🔄 Флип',
    medium: '📊 Среднесрок',
    long: '⏰ Долгосрок'
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`${bgColor} rounded-xl p-6 shadow-lg border ${borderColor}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${textColor} mb-2 flex items-center gap-3`}>
                <span className="bg-gradient-to-r from-green-500 to-green-600 text-transparent bg-clip-text">
                  Call
                </span>
                <span className="text-lg font-normal text-gray-500">- Торговые сигналы</span>
              </h1>
              <p className={subtleColor}>Создание и управление торговыми сигналами для команды</p>
            </div>
            <button
              onClick={() => {
                setEditingCall(null)
                setShowForm(true)
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Plus className="w-5 h-5" />
              Создать сигнал
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className={`${bgColor} rounded-xl p-6 shadow-lg border ${borderColor}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${textColor}`}>
                {editingCall ? 'Редактировать сигнал' : 'Создать новый сигнал'}
              </h2>
              <button
                onClick={handleCancel}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${subtleColor}`} />
              </button>
            </div>
            <CallForm callToEdit={editingCall} onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        )}

        {/* Calls List */}
        {!showForm && (
          <>
            {loading ? (
              <div className={`${bgColor} rounded-xl p-8 text-center ${borderColor} border`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className={`${subtleColor} mt-4`}>Загрузка сигналов...</p>
              </div>
            ) : calls.length === 0 ? (
              <div className={`${bgColor} rounded-xl p-8 text-center ${borderColor} border`}>
                <Sparkles className={`w-16 h-16 mx-auto mb-4 ${subtleColor}`} />
                <h3 className={`text-xl font-bold ${textColor} mb-2`}>Нет сигналов</h3>
                <p className={subtleColor}>Создайте первый торговый сигнал для команды</p>
              </div>
            ) : (
              <div className="space-y-4">
                {calls.map((call) => {
                  const networkColor = networkColors[call.network] || 'bg-gray-500'
                  const isCopied = copiedTicker === call.ticker
                  
                  return (
                    <div
                      key={call.id}
                      className={`${bgColor} rounded-xl p-6 shadow-lg border ${borderColor} hover:shadow-xl transition-shadow`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded-full ${networkColor} text-white text-sm font-medium`}>
                            {call.network.toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`text-2xl font-bold ${textColor}`}>{call.ticker}</h3>
                              <button
                                onClick={() => copyTicker(call.ticker)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
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
                            <p className={`${subtleColor} text-sm`}>{call.pair}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCall(call)
                              setShowForm(true)
                            }}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            title="Редактировать"
                          >
                            <Edit className={`w-4 h-4 ${subtleColor}`} />
                          </button>
                          <button
                            onClick={() => handleDelete(call.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark' ? 'bg-red-900/30 hover:bg-red-800/40' : 'bg-red-50 hover:bg-red-100'
                            }`}
                            title="Удалить"
                          >
                            <Trash2 className={`w-4 h-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-2">
                          <Target className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${textColor} mb-1`}>Вход</p>
                            <p className={subtleColor}>{call.entryPoint}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Target className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${textColor} mb-1`}>Цели</p>
                            <p className={subtleColor}>{call.target}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className={`w-5 h-5 mt-0.5 ${subtleColor}`} />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${textColor} mb-1`}>Стратегия</p>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              call.strategy === 'flip'
                                ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                : call.strategy === 'medium'
                                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                : 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                            }`}>
                              {strategyLabels[call.strategy]}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <AlertCircle className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${textColor} mb-1`}>Риски</p>
                            <p className={subtleColor}>{call.risks}</p>
                          </div>
                        </div>
                        {call.cancelConditions && (
                          <div className="flex items-start gap-2">
                            <AlertCircle className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${textColor} mb-1`}>Условия отмены</p>
                              <p className={subtleColor}>{call.cancelConditions}</p>
                            </div>
                          </div>
                        )}
                        {call.comment && (
                          <div className="flex items-start gap-2">
                            <FileText className={`w-5 h-5 mt-0.5 ${subtleColor}`} />
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${textColor} mb-1`}>Комментарий</p>
                              <p className={subtleColor}>{call.comment}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <Clock className={`w-4 h-4 ${subtleColor}`} />
                          <p className={`text-xs ${subtleColor}`}>
                            Создан: {new Date(call.createdAt).toLocaleString('ru-RU')}
                          </p>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            call.status === 'active'
                              ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                              : call.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                              : call.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                              : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                          }`}>
                            {call.status === 'active' ? 'Активен' : call.status === 'completed' ? 'Завершен' : call.status === 'cancelled' ? 'Отменен' : 'На рассмотрении'}
                          </span>
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
