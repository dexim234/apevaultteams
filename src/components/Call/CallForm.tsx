// Call form component for creating trading signals
import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { addCall, updateCall } from '@/services/firestoreService'
import type { Network, Strategy, Call } from '@/types'

interface CallFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  callToEdit?: Call | null
}

export const CallForm = ({ onSuccess, onCancel, callToEdit }: CallFormProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<Omit<Call, 'id' | 'userId' | 'createdAt' | 'status'>>({
    network: callToEdit?.network || 'solana',
    ticker: callToEdit?.ticker || '',
    pair: callToEdit?.pair || '',
    entryPoint: callToEdit?.entryPoint || '',
    target: callToEdit?.target || '',
    strategy: callToEdit?.strategy || 'flip',
    risks: callToEdit?.risks || '',
    cancelConditions: callToEdit?.cancelConditions || '',
    comment: callToEdit?.comment || '',
  })

  const networks: Network[] = ['solana', 'bsc', 'ethereum', 'base', 'ton', 'tron', 'sui', 'cex']
  const strategies: { value: Strategy; label: string }[] = [
    { value: 'flip', label: '🔄 Флип' },
    { value: 'medium', label: '📊 Среднесрок' },
    { value: 'long', label: '⏰ Долгосрок' },
  ]

  const networkLabels: Record<Network, string> = {
    solana: 'Solana',
    bsc: 'BSC',
    ethereum: 'Ethereum',
    base: 'Base',
    ton: 'Ton',
    tron: 'Tron',
    sui: 'SUI',
    cex: 'CEX биржа'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.ticker.trim()) {
      setError('Укажите тикер токена')
      setLoading(false)
      return
    }
    if (!formData.pair.trim()) {
      setError('Укажите пару токена')
      setLoading(false)
      return
    }
    if (!formData.entryPoint.trim()) {
      setError('Укажите точку входа или диапазон')
      setLoading(false)
      return
    }
    if (!formData.target.trim()) {
      setError('Укажите цель/ориентиры по прибыли')
      setLoading(false)
      return
    }
    if (!formData.risks.trim()) {
      setError('Опишите риски')
      setLoading(false)
      return
    }

    try {
      // Allow admin to edit calls even without user, but creating requires user
      if (callToEdit) {
        // Update existing call - admin can edit any call
        const updates: Partial<Call> = {
          network: formData.network,
          ticker: formData.ticker,
          pair: formData.pair,
          entryPoint: formData.entryPoint,
          target: formData.target,
          strategy: formData.strategy,
          risks: formData.risks,
          cancelConditions: formData.cancelConditions || undefined,
          comment: formData.comment || undefined,
        }
        await updateCall(callToEdit.id, updates)
      } else {
        // Create new call - requires user
        if (!user) {
          setError('Вы не авторизованы. Для создания сигнала необходимо войти как участник.')
          setLoading(false)
          return
        }
        const callData: Omit<Call, 'id'> = {
          ...formData,
          userId: user.id,
          createdAt: new Date().toISOString(),
          status: 'active',
          cancelConditions: formData.cancelConditions || undefined,
          comment: formData.comment || undefined,
        }
        await addCall(callData)
      }
      onSuccess?.()
    } catch (error: any) {
      console.error('Error creating call:', error)
      setError('Ошибка при создании сигнала. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {error}
        </div>
      )}

      {/* Network */}
      <div>
        <label className={`block text-sm font-medium ${textColor} mb-2`}>
          Сеть *
        </label>
        <select
          value={formData.network}
          onChange={(e) => setFormData({ ...formData, network: e.target.value as Network })}
          className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
          required
        >
          {networks.map((network) => (
            <option key={network} value={network}>
              {networkLabels[network]}
            </option>
          ))}
        </select>
      </div>

      {/* Ticker */}
      <div>
        <label className={`block text-sm font-medium ${textColor} mb-2`}>
          Тикер токена *
        </label>
        <input
          type="text"
          value={formData.ticker}
          onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
          className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
          placeholder="тикер токена"
          required
        />
      </div>

      {/* Pair */}
      <div>
        <label className={`block text-sm font-medium ${textColor} mb-2`}>
          Пара токена *
        </label>
        <input
          type="text"
          value={formData.pair}
          onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
          placeholder="PEPE/USDT, DOGE/USDT..."
          required
        />
      </div>

      {/* Entry Point */}
      <div>
        <label className={`block text-sm font-medium ${textColor} mb-2`}>
          Точка входа или диапазон капитализации *
        </label>
        <input
          type="text"
          value={formData.entryPoint}
          onChange={(e) => setFormData({ ...formData, entryPoint: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
          placeholder="10M или 10M-15M (в миллионах долларов)"
          required
        />
      </div>

      {/* Target */}
      <div>
        <label className={`block text-sm font-medium ${textColor} mb-2`}>
          Цель/ориентиры по капитализации *
        </label>
        <input
          type="text"
          value={formData.target}
          onChange={(e) => setFormData({ ...formData, target: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
          placeholder="20M, 30M, 50M (в миллионах долларов)"
          required
        />
      </div>

      {/* Strategy */}
      <div>
        <label className={`block text-sm font-medium ${textColor} mb-2`}>
          Стратегия *
        </label>
        <select
          value={formData.strategy}
          onChange={(e) => setFormData({ ...formData, strategy: e.target.value as Strategy })}
          className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
          required
        >
          {strategies.map((strategy) => (
            <option key={strategy.value} value={strategy.value}>
              {strategy.label}
            </option>
          ))}
        </select>
      </div>

      {/* Risks */}
      <div>
        <label className={`block text-sm font-medium ${textColor} mb-2`}>
          Риски *
        </label>
        <textarea
          value={formData.risks}
          onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] min-h-[100px] resize-y`}
          placeholder="Опишите риски этого сигнала..."
          required
        />
      </div>

      {/* Cancel Conditions */}
      <div>
        <label className={`block text-sm font-medium ${textColor} mb-2`}>
          Условия отмены или пересмотра колла
        </label>
        <textarea
          value={formData.cancelConditions}
          onChange={(e) => setFormData({ ...formData, cancelConditions: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] min-h-[80px] resize-y`}
          placeholder="При каких условиях сигнал должен быть отменен или пересмотрен..."
        />
      </div>

      {/* Comment */}
      <div>
        <label className={`block text-sm font-medium ${textColor} mb-2`}>
          Комментарий по ситуации
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] min-h-[100px] resize-y`}
          placeholder="Дополнительные комментарии по ситуации..."
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            theme === 'dark'
              ? 'bg-[#4E6E49] hover:bg-[#4E6E49] text-white disabled:bg-gray-700 disabled:text-gray-400'
              : 'bg-[#4E6E49] hover:bg-[#4E6E49] text-white disabled:bg-gray-300 disabled:text-gray-500'
          }`}
        >
          {loading ? 'Создание...' : callToEdit ? 'Обновить сигнал' : 'Создать сигнал'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  )
}

