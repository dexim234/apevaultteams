// New multi-domain Call form
import { useState, useEffect, type JSX } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { addCall, updateCall } from '@/services/firestoreService'
import type {
  Call,
  CallCategory,
  CallDetails,
  CallRiskLevel,
  CallSentiment,
  Network,
} from '@/types'
import { Sparkles, Wand2, Rocket, LineChart, Image, Coins, Shield, Target } from 'lucide-react'

interface CallFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  callToEdit?: Call | null
  initialCategory?: CallCategory
}

type FieldType = 'text' | 'textarea' | 'select' | 'checkbox'

interface FieldConfig {
  key: string
  label: string
  placeholder?: string
  helper?: string
  type?: FieldType
  options?: { value: string; label: string }[]
}

type FormDetailsState = Required<CallDetails>

const networkOptions: { value: Network; label: string }[] = [
  { value: 'solana', label: 'Solana' },
  { value: 'ethereum', label: 'ETH' },
  { value: 'bsc', label: 'BSC' },
  { value: 'ton', label: 'TON' },
  { value: 'base', label: 'Base' },
  { value: 'sui', label: 'SUI' },
  { value: 'monad', label: 'Monad' },
  { value: 'polygon', label: 'Polygon' },
]

const CATEGORY_META: Record<CallCategory, { label: string; gradient: string; icon: JSX.Element }> = {
  memecoins: { label: 'Мемкоины', gradient: 'from-emerald-400 to-teal-500', icon: <Rocket className="w-5 h-5" /> },
  futures: { label: 'Фьючерсы', gradient: 'from-blue-400 to-indigo-500', icon: <LineChart className="w-5 h-5" /> },
  nft: { label: 'NFT', gradient: 'from-purple-400 to-pink-500', icon: <Image className="w-5 h-5" /> },
  spot: { label: 'Спот', gradient: 'from-amber-400 to-orange-500', icon: <Coins className="w-5 h-5" /> },
  polymarket: { label: 'Polymarket', gradient: 'from-rose-400 to-red-500', icon: <Target className="w-5 h-5" /> },
  staking: { label: 'Стейкинг', gradient: 'from-cyan-400 to-blue-500', icon: <Shield className="w-5 h-5" /> },
}

const CATEGORY_FIELDS: Record<CallCategory, FieldConfig[]> = {
  memecoins: [
    { key: 'coinName', label: 'Название монеты', placeholder: 'PEPE' },
    { key: 'ticker', label: 'Тикер', placeholder: 'PEPE' },
    { key: 'network', label: 'Сеть', type: 'select', options: networkOptions },
    { key: 'contract', label: 'Контракт', placeholder: '0x...' },
    { key: 'signalType', label: 'Тип сигнала', type: 'select', options: [
      { value: 'buy', label: 'Buy' },
      { value: 'sell', label: 'Sell' },
      { value: 'hold', label: 'Hold' },
      { value: 'alert', label: 'Alert' },
    ] },
    { key: 'reason', label: 'Причина входа', placeholder: 'Хайп, крупные покупки...' },
    { key: 'entryCap', label: 'Зона входа в капитализации', placeholder: '10M-15M' },
    { key: 'targets', label: 'Цели (TP1/TP2/TP3)', placeholder: '20M / 30M / 50M' },
    { key: 'stopLoss', label: 'Стоп-лосс (если применим)', placeholder: '5M или 15%' },
    { key: 'riskLevel', label: 'Риск-уровень', type: 'select', options: [
      { value: 'low', label: 'Низкий' },
      { value: 'medium', label: 'Средний' },
      { value: 'high', label: 'Высокий' },
      { value: 'ultra', label: 'Ультра-высокий' },
    ] },
    { key: 'risks', label: 'Риски', placeholder: 'Разворот тренда, низкая ликвидность', type: 'textarea' },
    { key: 'holdPlan', label: 'План удержания', type: 'select', options: [
      { value: 'flip', label: 'Флип' },
      { value: 'short', label: 'Краткосрок' },
      { value: 'medium', label: 'Среднесрок' },
      { value: 'long', label: 'Дальнесрок' },
    ] },
    { key: 'liquidityLocked', label: 'Залочена ли ликвидность', type: 'checkbox' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Доп. наблюдения, планы' },
  ],
  futures: [
    { key: 'pair', label: 'Пара', placeholder: 'BTC/USDT' },
    { key: 'direction', label: 'Направление', type: 'select', options: [
      { value: 'long', label: 'Long' },
      { value: 'short', label: 'Short' },
    ] },
    { key: 'leverage', label: 'Рекомендованное плечо', placeholder: 'x3 - x10' },
    { key: 'entryPrice', label: 'Цена входа', placeholder: '69500' },
    { key: 'entryZone', label: 'Зоны входа (min-max)', placeholder: '69000 - 70000' },
    { key: 'targets', label: 'Цели (TP1/TP2/TP3)', placeholder: '71000 / 72500 / 74000' },
    { key: 'stopLoss', label: 'SL уровень', placeholder: '68000' },
    { key: 'signalStyle', label: 'Тип сигнала', type: 'select', options: [
      { value: 'breakout', label: 'Breakout' },
      { value: 'retest', label: 'Retest' },
      { value: 'range', label: 'Range' },
      { value: 'scalping', label: 'Scalping' },
      { value: 'swing', label: 'Swing' },
    ] },
    { key: 'positionSize', label: 'Размер позиции (% от депо)', placeholder: '2-5%' },
    { key: 'reason', label: 'Причина входа (анализ)', placeholder: 'Тренд, объемы, дивергенция...', type: 'textarea' },
    { key: 'timeframe', label: 'Таймфрейм анализа', type: 'select', options: [
      { value: '1m', label: '1m' },
      { value: '5m', label: '5m' },
      { value: '15m', label: '15m' },
      { value: '1h', label: '1h' },
      { value: '4h', label: '4h' },
    ] },
    { key: 'risks', label: 'Риски', placeholder: 'Резкий вброс, низкая волатильность', type: 'textarea' },
    { key: 'riskLevel', label: 'Риск-уровень', type: 'select', options: [
      { value: 'low', label: 'Низкий' },
      { value: 'medium', label: 'Средний' },
      { value: 'high', label: 'Высокий' },
      { value: 'ultra', label: 'Ультра-высокий' },
    ] },
  ],
  nft: [
    { key: 'collectionLink', label: 'Коллекция (ссылка)', placeholder: 'https://...' },
    { key: 'nftLink', label: 'NFT (ссылка)', placeholder: 'https://.../item' },
    { key: 'marketplace', label: 'Маркетплейс', placeholder: 'OpenSea / Magic Eden' },
    { key: 'network', label: 'Сеть', type: 'select', options: networkOptions },
    { key: 'entryPrice', label: 'Рекомендованная цена входа', placeholder: '1.2 ETH' },
    { key: 'rarity', label: 'Редкость / атрибуты', placeholder: 'Rank < 5% или редкий фон' },
    { key: 'signalType', label: 'Тип сигнала', type: 'select', options: [
      { value: 'buy', label: 'Buy' },
      { value: 'sell', label: 'Sell' },
      { value: 'mint', label: 'Mint' },
    ] },
    { key: 'reason', label: 'Причина входа', placeholder: 'Новый минт, хайп, инсайд', type: 'textarea' },
    { key: 'holdingHorizon', label: 'Срок удержания', type: 'select', options: [
      { value: 'flip', label: 'Скоростной флип' },
      { value: 'short', label: 'Краткосрок' },
      { value: 'medium', label: 'Среднесрок' },
      { value: 'long', label: 'Долгосрок' },
    ] },
    { key: 'minLiquidity', label: 'Минимальная ликвидность (floor + объём)', placeholder: 'Floor 2 ETH, объём 120 ETH' },
    { key: 'targetPrice', label: 'Цель продажи / Target price', placeholder: '3 ETH' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Что смотрим, когда фиксируем' },
    { key: 'risks', label: 'Риски', type: 'textarea', placeholder: 'Падение спроса, фальшивый объём' },
  ],
  spot: [
    { key: 'coin', label: 'Монета', placeholder: 'BTC' },
    { key: 'entryCap', label: 'Капитализация входа', placeholder: '500M' },
    { key: 'targets', label: 'Цели (TP1/TP2/TP3)', placeholder: '550M / 650M / 750M' },
    { key: 'stopLoss', label: 'SL', placeholder: '-10%' },
    { key: 'holdingHorizon', label: 'Горизонт удержания', type: 'select', options: [
      { value: 'short', label: 'Краткосрок' },
      { value: 'medium', label: 'Среднесрок' },
      { value: 'long', label: 'Долгосрок' },
    ] },
    { key: 'reason', label: 'Причина входа', placeholder: 'Фундаментал, хайп, запуск', type: 'textarea' },
    { key: 'positionSize', label: 'Размер позиции', placeholder: '5-10% портфеля' },
    { key: 'risks', label: 'Риски', placeholder: 'Регуляторика, конкуренты', type: 'textarea' },
    { key: 'traderComment', label: 'Комментарий', type: 'textarea', placeholder: 'Условия фиксации, обновления' },
    { key: 'riskLevel', label: 'Риск-уровень', type: 'select', options: [
      { value: 'low', label: 'Низкий' },
      { value: 'medium', label: 'Средний' },
      { value: 'high', label: 'Высокий' },
      { value: 'ultra', label: 'Ультра-высокий' },
    ] },
  ],
  polymarket: [
    { key: 'event', label: 'Событие', placeholder: 'Trump wins 2025' },
    { key: 'positionType', label: 'Тип позиции', type: 'select', options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ] },
    { key: 'entryPrice', label: 'Цена входа (%)', placeholder: '42%' },
    { key: 'expectedProbability', label: 'Ожидаемая вероятность (%)', placeholder: '65%' },
    { key: 'reason', label: 'Причина входа', placeholder: 'Аналитика, инсайд, тренд новостей', type: 'textarea' },
    { key: 'eventDeadline', label: 'Срок исхода события', placeholder: '31.12.2025' },
    { key: 'riskLevel', label: 'Риск', type: 'select', options: [
      { value: 'low', label: 'Низкий' },
      { value: 'medium', label: 'Средний' },
      { value: 'high', label: 'Высокий' },
      { value: 'ultra', label: 'Ультра-высокий' },
    ] },
    { key: 'maxStake', label: 'Максимальный объём ставки', placeholder: 'до $5k' },
    { key: 'risks', label: 'Риски', placeholder: 'Неопределённость новостей, низкая ликвидность', type: 'textarea' },
    { key: 'targetPlan', label: 'Цель', placeholder: 'Продажа до события или удержание' },
  ],
  staking: [
    { key: 'coin', label: 'Монета', placeholder: 'SOL' },
    { key: 'platform', label: 'Платформа', placeholder: 'Jito, Lido...' },
    { key: 'term', label: 'Срок стейкинга', type: 'select', options: [
      { value: 'flexible', label: 'Гибкий' },
      { value: '30d', label: '30 дней' },
      { value: '90d', label: '90 дней' },
      { value: 'fixed', label: 'Фиксированный' },
    ] },
    { key: 'apy', label: 'APY', placeholder: '12-18%' },
    { key: 'minDeposit', label: 'Минимальный депозит', placeholder: '100 USDT' },
    { key: 'protocolRisk', label: 'Риски протокола', type: 'select', options: [
      { value: 'low', label: 'Низкие' },
      { value: 'medium', label: 'Средние' },
      { value: 'high', label: 'Высокие' },
      { value: 'ultra', label: 'Ультра' },
    ] },
    { key: 'action', label: 'Тип сигнала', type: 'select', options: [
      { value: 'enter', label: 'Вход' },
      { value: 'exit', label: 'Выход' },
      { value: 'rebalance', label: 'Перераспределение' },
    ] },
    { key: 'reason', label: 'Причина', placeholder: 'Рост доходности, снижение рисков...', type: 'textarea' },
    { key: 'risks', label: 'Риски', placeholder: 'Смарт-контракт, ликвидность', type: 'textarea' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Тактика выхода, дополнительные условия' },
  ],
}

const buildEmptyDetails = (): FormDetailsState => ({
  memecoins: {
    coinName: '',
    ticker: '',
    network: 'solana',
    contract: '',
    signalType: 'buy',
    reason: '',
    entryCap: '',
    targets: '',
    stopLoss: '',
    riskLevel: 'medium',
    risks: '',
    holdPlan: 'short',
    liquidityLocked: false,
    traderComment: '',
  },
  futures: {
    pair: '',
    direction: 'long',
    leverage: '',
    entryPrice: '',
    entryZone: '',
    targets: '',
    stopLoss: '',
    signalStyle: 'breakout',
    positionSize: '',
    reason: '',
    timeframe: '1h',
    risks: '',
    riskLevel: 'medium',
  },
  nft: {
    collectionLink: '',
    nftLink: '',
    marketplace: '',
    network: 'ethereum',
    entryPrice: '',
    rarity: '',
    signalType: 'buy',
    reason: '',
    holdingHorizon: 'short',
    minLiquidity: '',
    targetPrice: '',
    traderComment: '',
    risks: '',
  },
  spot: {
    coin: '',
    entryCap: '',
    targets: '',
    stopLoss: '',
    holdingHorizon: 'medium',
    reason: '',
    positionSize: '',
    risks: '',
    traderComment: '',
    riskLevel: 'medium',
  },
  polymarket: {
    event: '',
    positionType: 'yes',
    entryPrice: '',
    expectedProbability: '',
    reason: '',
    eventDeadline: '',
    riskLevel: 'medium',
    maxStake: '',
    risks: '',
    targetPlan: '',
  },
  staking: {
    coin: '',
    platform: '',
    term: 'flexible',
    apy: '',
    minDeposit: '',
    protocolRisk: 'medium',
    action: 'enter',
    reason: '',
    risks: '',
    traderComment: '',
  },
})

const mergeDetails = (base: FormDetailsState, incoming?: CallDetails): FormDetailsState => ({
  memecoins: { ...base.memecoins, ...(incoming?.memecoins || {}) },
  futures: { ...base.futures, ...(incoming?.futures || {}) },
  nft: { ...base.nft, ...(incoming?.nft || {}) },
  spot: { ...base.spot, ...(incoming?.spot || {}) },
  polymarket: { ...base.polymarket, ...(incoming?.polymarket || {}) },
  staking: { ...base.staking, ...(incoming?.staking || {}) },
})

export const CallForm = ({ onSuccess, onCancel, callToEdit, initialCategory }: CallFormProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const defaultDetails = mergeDetails(buildEmptyDetails(), callToEdit?.details)
  const [category, setCategory] = useState<CallCategory>(callToEdit?.category || initialCategory || 'memecoins')
  const [comment, setComment] = useState(callToEdit?.comment || '')
  const [details, setDetails] = useState<FormDetailsState>(defaultDetails)

  useEffect(() => {
    const merged = mergeDetails(buildEmptyDetails(), callToEdit?.details)
    setDetails(merged)
    setCategory(callToEdit?.category || initialCategory || 'memecoins')
    setComment(callToEdit?.comment || '')
  }, [callToEdit, initialCategory])

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
  const inputBg = theme === 'dark' ? 'bg-gray-700/60' : 'bg-gray-50'
  const subtle = theme === 'dark' ? 'text-gray-400' : 'text-gray-500'

  const updateField = (key: string, value: any) => {
    setDetails((prev) => ({
      ...prev,
      [category]: {
        ...(prev as any)[category],
        [key]: value,
      },
    }))
  }

  const deriveRiskLevel = (payload: any): CallRiskLevel | undefined => {
    return payload?.riskLevel || payload?.protocolRisk || undefined
  }

  const deriveSentiment = (payload: any): CallSentiment | undefined => {
    if (payload?.signalType) return payload.signalType
    if (payload?.direction === 'long') return 'buy'
    if (payload?.direction === 'short') return 'sell'
    return undefined
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    setLoading(true)
    try {
      const activePayload = (details as any)[category]
      const payloadDetails: CallDetails = {
        ...callToEdit?.details,
        [category]: activePayload,
      }

      const baseData: Omit<Call, 'id'> = {
        userId: callToEdit?.userId || user?.id || '',
        category,
        details: payloadDetails,
        createdAt: callToEdit?.createdAt || new Date().toISOString(),
        status: callToEdit?.status || 'active',
        comment: comment?.trim() ? comment.trim() : undefined,
        sentiment: deriveSentiment(activePayload),
        riskLevel: deriveRiskLevel(activePayload),
        tags: callToEdit?.tags || [],
        maxProfit: callToEdit?.maxProfit,
        currentPnL: callToEdit?.currentPnL,
        currentMarketCap: callToEdit?.currentMarketCap,
        signalMarketCap: callToEdit?.signalMarketCap,
        currentPrice: callToEdit?.currentPrice,
        entryPrice: callToEdit?.entryPrice,
      }

      if (callToEdit) {
        await updateCall(callToEdit.id, baseData)
      } else {
        await addCall(baseData)
      }
      onSuccess?.()
    } catch (err) {
      console.error('Error creating call:', err)
      setError('Ошибка при сохранении сигнала. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: FieldConfig) => {
    const activePayload = (details as any)[category] || {}
    const value = activePayload[field.key]
    const common = `w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value || ''}
          onChange={(e) => updateField(field.key, e.target.value)}
          className={`${common} min-h-[100px] resize-y`}
          placeholder={field.placeholder}
        />
      )
    }

    if (field.type === 'select' && field.options) {
      return (
        <select
          value={value || field.options[0]?.value || ''}
          onChange={(e) => updateField(field.key, e.target.value)}
          className={`${common} appearance-none`}
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )
    }

    if (field.type === 'checkbox') {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => updateField(field.key, e.target.checked)}
            className="accent-[#4E6E49] w-4 h-4"
          />
          <span className={textColor}>{field.label}</span>
        </label>
      )
    }

    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => updateField(field.key, e.target.value)}
        className={common}
        placeholder={field.placeholder}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {error}
        </div>
      )}

      {/* Category selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#4E6E49]" />
          <p className={`text-sm font-semibold ${textColor}`}>Выберите сферу сигнала</p>
          <span className={`text-xs ${subtle}`}>каждая сфера имеет свой набор полей</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(CATEGORY_META) as CallCategory[]).map((key) => {
            const meta = CATEGORY_META[key]
            const active = category === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`relative overflow-hidden rounded-xl px-3 py-3 border ${active ? 'border-transparent shadow-lg shadow-emerald-500/30' : borderColor} transition-all ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white'}`}
              >
                <div className={`absolute inset-0 opacity-90 ${active ? `bg-gradient-to-r ${meta.gradient}` : 'bg-gray-900/5 dark:bg-white/5'}`} />
                <div className="relative flex items-center gap-3 text-left">
                  <span className={`p-2 rounded-lg ${active ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
                    {meta.icon}
                  </span>
                  <div>
                    <p className={`font-semibold ${active ? 'text-white' : textColor}`}>{meta.label}</p>
                  </div>
                  {active && <Wand2 className="w-4 h-4 text-white ml-auto" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Fields */}
      <div className={`rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white'} p-4 sm:p-6 space-y-4`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #4E6E49, #3b8d5a)' }}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-lg font-bold ${textColor}`}>{CATEGORY_META[category].label}</p>
            <p className={`text-xs ${subtle}`}>Добавьте любые детали по этому типу сигнала</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {CATEGORY_FIELDS[category].map((field) => (
            <div key={field.key} className="space-y-2">
              {field.type !== 'checkbox' && (
                <div className="flex items-center justify-between gap-2">
                  <label className={`text-sm font-semibold ${textColor}`}>{field.label}</label>
                  {field.helper && <span className={`text-[11px] ${subtle}`}>{field.helper}</span>}
                </div>
              )}
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>

      {/* General comment */}
      <div>
        <label className={`block text-sm font-medium ${textColor} mb-2`}>
          Общий комментарий или доп. заметки
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] min-h-[90px] resize-y`}
          placeholder="Здесь можно оставить чеклист для апдейтов, условия выхода, алерты."
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all shadow-md ${theme === 'dark'
            ? 'bg-gradient-to-r from-[#4E6E49] to-emerald-700 text-white hover:scale-[1.01] disabled:bg-gray-700'
            : 'bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-600'
          }`}
        >
          {loading ? 'Сохраняем...' : callToEdit ? 'Обновить сигнал' : 'Создать сигнал'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-lg font-semibold border ${borderColor} ${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  )
}

