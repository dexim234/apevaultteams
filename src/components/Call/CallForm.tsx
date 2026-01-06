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
import { TEAM_MEMBERS } from '@/types'
import { Sparkles, Rocket, LineChart, Image, Coins, Shield, Target, Info, MapPin, TrendingUp, AlertTriangle, Settings, MessageSquare, Eye, X, Check, Globe2, Wand2, Clock3, Link2, Activity, Gauge, Timer, ScrollText, Building2, CalendarClock, Percent, Octagon, Network as NetworkIcon, Copy } from 'lucide-react'

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
  type?: FieldType
  options?: { value: string; label: string }[]
  section?: string
  required?: boolean
}

interface SectionConfig {
  title: string
  icon: JSX.Element
  description?: string
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

const CATEGORY_META: Record<CallCategory, { label: string; gradient: string; icon: JSX.Element; pastelBg: string; pastelBorder: string; pastelText: string }> = {
  memecoins: { label: 'Мемкоины', gradient: 'from-emerald-300 to-teal-400', icon: <Rocket className="w-5 h-5" />, pastelBg: 'bg-emerald-50', pastelBorder: 'border-emerald-100', pastelText: 'text-emerald-800' },
  futures: { label: 'Фьючерсы', gradient: 'from-sky-300 to-indigo-400', icon: <LineChart className="w-5 h-5" />, pastelBg: 'bg-sky-50', pastelBorder: 'border-sky-100', pastelText: 'text-sky-800' },
  nft: { label: 'NFT', gradient: 'from-purple-300 to-pink-300', icon: <Image className="w-5 h-5" />, pastelBg: 'bg-purple-50', pastelBorder: 'border-purple-100', pastelText: 'text-purple-800' },
  spot: { label: 'Спот', gradient: 'from-amber-300 to-orange-300', icon: <Coins className="w-5 h-5" />, pastelBg: 'bg-amber-50', pastelBorder: 'border-amber-100', pastelText: 'text-amber-800' },
  polymarket: { label: 'Polymarket', gradient: 'from-rose-300 to-red-300', icon: <Target className="w-5 h-5" />, pastelBg: 'bg-rose-50', pastelBorder: 'border-rose-100', pastelText: 'text-rose-800' },
  staking: { label: 'Стейкинг', gradient: 'from-cyan-300 to-blue-300', icon: <Shield className="w-5 h-5" />, pastelBg: 'bg-cyan-50', pastelBorder: 'border-cyan-100', pastelText: 'text-cyan-800' },
  airdrop: { label: 'AirDrop', gradient: 'from-blue-300 to-indigo-400', icon: <Sparkles className="w-5 h-5" />, pastelBg: 'bg-blue-50', pastelBorder: 'border-blue-100', pastelText: 'text-blue-800' },
}

const CATEGORY_SECTIONS: Record<CallCategory, Record<string, SectionConfig>> = {
  memecoins: {
    basic: { title: 'Контракт и сеть', icon: <Link2 className="w-4 h-4" />, description: 'Адрес токена и блокчейн' },
    strategy: { title: 'Стратегия', icon: <TrendingUp className="w-4 h-4" />, description: 'Тип торговой стратегии' },
    entry: { title: 'Зона входа', icon: <MapPin className="w-4 h-4" />, description: 'Условия для входа в позицию' },
    targets: { title: 'Цели и риски', icon: <Target className="w-4 h-4" />, description: 'План прибыли и стоп-лосс' },
    additional: { title: 'Комментарий', icon: <MessageSquare className="w-4 h-4" />, description: 'Дополнительные заметки' },
  },
  futures: {
    basic: { title: 'Основная информация', icon: <Info className="w-4 h-4" />, description: 'Данные о паре и направлении' },
    entry: { title: 'Зоны входа', icon: <MapPin className="w-4 h-4" />, description: 'Условия входа и размер позиции' },
    targets: { title: 'Цели и риски', icon: <TrendingUp className="w-4 h-4" />, description: 'План прибыли и стоп-лоссы' },
    strategy: { title: 'Стратегия', icon: <Target className="w-4 h-4" />, description: 'Тип сигнала и анализ' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Комментарии и детали' },
  },
  nft: {
    basic: { title: 'Основная информация', icon: <Info className="w-4 h-4" />, description: 'Данные о NFT и коллекции' },
    entry: { title: 'Условия входа', icon: <MapPin className="w-4 h-4" />, description: 'Цена и условия покупки' },
    targets: { title: 'Цели и риски', icon: <TrendingUp className="w-4 h-4" />, description: 'План продажи и риски' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Анализ и комментарии' },
  },
  spot: {
    basic: { title: 'Основная информация', icon: <Info className="w-4 h-4" />, description: 'Данные о монете' },
    entry: { title: 'Зоны входа', icon: <MapPin className="w-4 h-4" />, description: 'Условия входа в позицию' },
    targets: { title: 'Цели и риски', icon: <TrendingUp className="w-4 h-4" />, description: 'План прибыли и стоп-лоссы' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Анализ и комментарии' },
  },
  polymarket: {
    basic: { title: 'Основная информация', icon: <Info className="w-4 h-4" />, description: 'Данные о событии' },
    entry: { title: 'Условия входа', icon: <MapPin className="w-4 h-4" />, description: 'Позиция и цена входа' },
    targets: { title: 'Цели и риски', icon: <TrendingUp className="w-4 h-4" />, description: 'План прибыли и риски' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Анализ и детали' },
  },
  staking: {
    basic: { title: 'Основная информация', icon: <Info className="w-4 h-4" />, description: 'Данные о стейкинге' },
    entry: { title: 'Условия входа', icon: <MapPin className="w-4 h-4" />, description: 'Платформа и условия' },
    targets: { title: 'Риски и анализ', icon: <AlertTriangle className="w-4 h-4" />, description: 'Оценка рисков' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Комментарии и детали' },
  },
  airdrop: {
    basic: { title: 'Проект', icon: <Info className="w-4 h-4" />, description: 'Информация о проекте' },
    details: { title: 'Детали дропа', icon: <Target className="w-4 h-4" />, description: 'Задачи и вознаграждения' },
    links: { title: 'Ссылки и сроки', icon: <Link2 className="w-4 h-4" />, description: 'Полезные ссылки' },
    analysis: { title: 'Анализ', icon: <Shield className="w-4 h-4" />, description: 'Почему заходим и риски' },
  },
}

const CATEGORY_FIELDS: Record<CallCategory, FieldConfig[]> = {
  memecoins: [
    { key: 'contract', label: 'Адрес (контракт)', placeholder: '0x... или адрес токена', section: 'basic' },
    { key: 'network', label: 'Сеть', type: 'select', options: networkOptions, section: 'basic' },
    {
      key: 'holdPlan', label: 'Тип стратегии', type: 'select', options: [
        { value: 'flip', label: 'Флип' },
        { value: 'short', label: 'Краткосрок' },
        { value: 'medium', label: 'Среднесрок' },
        { value: 'long', label: 'Дальнесрок' },
      ], section: 'strategy'
    },
    { key: 'entryCap', label: 'Зона входа в капитализации', placeholder: '10M-15M', section: 'entry' },
    { key: 'targets', label: 'Цели', placeholder: '20M / 30M / 50M', section: 'targets' },
    { key: 'stopLoss', label: 'Стоп-лосс', placeholder: '5M или -25%', section: 'targets' },
    { key: 'trailingPercent', label: 'Процент трейлинга', placeholder: 'например: 5% или 10%', section: 'targets' },
    {
      key: 'riskLevel', label: 'Риск уровень', type: 'select', options: [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
        { value: 'ultra', label: 'Ультра-высокий' },
      ], section: 'targets'
    },
    { key: 'liquidityLocked', label: 'Отметка о ликвидности', type: 'checkbox', section: 'targets' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Доп. наблюдения, планы...', section: 'additional' },
  ],
  futures: [
    { key: 'pair', label: 'Пара', placeholder: 'BTC/USDT', section: 'basic' },
    {
      key: 'direction', label: 'Направление', type: 'select', options: [
        { value: 'long', label: 'Long' },
        { value: 'short', label: 'Short' },
      ], section: 'basic'
    },
    { key: 'leverage', label: 'Рекомендованное плечо', placeholder: 'x3 - x10', section: 'entry' },
    { key: 'entryPrice', label: 'Цена входа', placeholder: '69500', section: 'entry' },
    { key: 'entryZone', label: 'Зоны входа (min-max)', placeholder: '69000 - 70000', section: 'entry' },
    { key: 'positionSize', label: 'Размер позиции (% от депо)', placeholder: '2-5%', section: 'entry' },
    { key: 'targets', label: 'Цели (TP1/TP2/TP3)', placeholder: '71000 / 72500 / 74000', section: 'targets' },
    { key: 'stopLoss', label: 'SL уровень', placeholder: '68000', section: 'targets' },
    {
      key: 'riskLevel', label: 'Риск-уровень', type: 'select', options: [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
        { value: 'ultra', label: 'Ультра-высокий' },
      ], section: 'targets'
    },
    {
      key: 'signalStyle', label: 'Тип сигнала', type: 'select', options: [
        { value: 'breakout', label: 'Breakout' },
        { value: 'retest', label: 'Retest' },
        { value: 'range', label: 'Range' },
        { value: 'scalping', label: 'Scalping' },
        { value: 'swing', label: 'Swing' },
      ], section: 'strategy'
    },
    {
      key: 'timeframe', label: 'Таймфрейм анализа', type: 'select', options: [
        { value: '1m', label: '1m' },
        { value: '5m', label: '5m' },
        { value: '15m', label: '15m' },
        { value: '1h', label: '1h' },
        { value: '4h', label: '4h' },
      ], section: 'strategy'
    },
    { key: 'reason', label: 'Причина входа (анализ)', placeholder: 'Тренд, объемы, дивергенция...', type: 'textarea', section: 'strategy' },
    { key: 'risks', label: 'Риски', placeholder: 'Резкий вброс, низкая волатильность', type: 'textarea', section: 'additional' },
  ],
  nft: [
    { key: 'collectionLink', label: 'Коллекция (ссылка)', placeholder: 'https://...', section: 'basic' },
    { key: 'nftLink', label: 'NFT (ссылка)', placeholder: 'https://.../item', section: 'basic' },
    { key: 'marketplace', label: 'Маркетплейс', placeholder: 'OpenSea / Magic Eden', section: 'basic' },
    { key: 'network', label: 'Сеть', type: 'select', options: networkOptions, section: 'basic' },
    { key: 'entryPrice', label: 'Рекомендованная цена входа', placeholder: '1.2 ETH', section: 'entry' },
    { key: 'rarity', label: 'Редкость / атрибуты', placeholder: 'Rank < 5%', section: 'entry' },
    { key: 'minLiquidity', label: 'Минимальная ликвидность', placeholder: 'Floor 2 ETH, объём 120 ETH', section: 'entry' },
    {
      key: 'signalType', label: 'Тип сигнала', type: 'select', options: [
        { value: 'buy', label: 'Buy' },
        { value: 'sell', label: 'Sell' },
        { value: 'mint', label: 'Mint' },
      ], section: 'entry'
    },
    {
      key: 'holdingHorizon', label: 'Срок удержания', type: 'select', options: [
        { value: 'flip', label: 'Скоростной флип' },
        { value: 'short', label: 'Краткосрок' },
        { value: 'medium', label: 'Среднесрок' },
        { value: 'long', label: 'Долгосрок' },
      ], section: 'targets'
    },
    { key: 'targetPrice', label: 'Цель продажи / Target price', placeholder: '3 ETH', section: 'targets' },
    { key: 'risks', label: 'Риски', placeholder: 'Падение спроса, фальшивый объём', type: 'textarea', section: 'targets' },
    { key: 'reason', label: 'Причина входа', placeholder: 'Минт, хайп, инсайд', type: 'textarea', section: 'additional' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Что смотрим, когда фиксируем', section: 'additional' },
  ],
  spot: [
    { key: 'coin', label: 'Монета', placeholder: 'BTC', section: 'basic' },
    { key: 'entryCap', label: 'Капитализация входа', placeholder: '500M', section: 'entry' },
    { key: 'positionSize', label: 'Размер позиции', placeholder: '5-10% портфеля', section: 'entry' },
    { key: 'targets', label: 'Цели (TP1/TP2/TP3)', placeholder: '550M / 650M / 750M', section: 'targets' },
    { key: 'stopLoss', label: 'SL', placeholder: '-10%', section: 'targets' },
    {
      key: 'holdingHorizon', label: 'Горизонт удержания', type: 'select', options: [
        { value: 'short', label: 'Краткосрок' },
        { value: 'medium', label: 'Среднесрок' },
        { value: 'long', label: 'Долгосрок' },
      ], section: 'targets'
    },
    {
      key: 'riskLevel', label: 'Риск-уровень', type: 'select', options: [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
        { value: 'ultra', label: 'Ультра-высокий' },
      ], section: 'targets'
    },
    { key: 'reason', label: 'Причина входа', placeholder: 'Фундаментал, хайп', type: 'textarea', section: 'additional' },
    { key: 'risks', label: 'Риски', placeholder: 'Регуляторика, конкуренты', type: 'textarea', section: 'additional' },
    { key: 'traderComment', label: 'Комментарий', type: 'textarea', placeholder: 'Условия фиксации, обновления', section: 'additional' },
  ],
  polymarket: [
    { key: 'event', label: 'Событие', placeholder: 'Trump wins 2025', section: 'basic' },
    { key: 'eventDeadline', label: 'Срок исхода события', placeholder: '31.12.2025', section: 'basic' },
    {
      key: 'positionType', label: 'Тип позиции', type: 'select', options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ], section: 'entry'
    },
    { key: 'entryPrice', label: 'Цена входа (%)', placeholder: '42%', section: 'entry' },
    { key: 'expectedProbability', label: 'Ожидаемая вероятность (%)', placeholder: '65%', section: 'entry' },
    { key: 'maxStake', label: 'Максимальный объём ставки', placeholder: 'до $5k', section: 'entry' },
    { key: 'targetPlan', label: 'Цель', placeholder: 'Продажа до события или удержание', section: 'targets' },
    {
      key: 'riskLevel', label: 'Риск', type: 'select', options: [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
        { value: 'ultra', label: 'Ультра-высокий' },
      ], section: 'targets'
    },
    { key: 'risks', label: 'Риски', placeholder: 'Неопределённость новостей, низкая ликвидность', type: 'textarea', section: 'targets' },
    { key: 'reason', label: 'Причина входа', placeholder: 'Аналитика, инсайд', type: 'textarea', section: 'additional' },
  ],
  staking: [
    { key: 'coin', label: 'Монета', placeholder: 'SOL', section: 'basic' },
    { key: 'platform', label: 'Платформа', placeholder: 'Jito, Lido...', section: 'entry' },
    {
      key: 'term', label: 'Срок стейкинга', type: 'select', options: [
        { value: 'flexible', label: 'Гибкий' },
        { value: '30d', label: '30 дней' },
        { value: '90d', label: '90 дней' },
        { value: 'fixed', label: 'Фиксированный' },
      ], section: 'entry'
    },
    { key: 'apy', label: 'APY', placeholder: '12-18%', section: 'entry' },
    { key: 'minDeposit', label: 'Минимальный депозит', placeholder: '100 USDT', section: 'entry' },
    {
      key: 'action', label: 'Тип сигнала', type: 'select', options: [
        { value: 'enter', label: 'Вход' },
        { value: 'exit', label: 'Выход' },
        { value: 'rebalance', label: 'Перераспределение' },
      ], section: 'entry'
    },
    {
      key: 'protocolRisk', label: 'Риски протокола', type: 'select', options: [
        { value: 'low', label: 'Низкие' },
        { value: 'medium', label: 'Средние' },
        { value: 'high', label: 'Высокие' },
        { value: 'ultra', label: 'Ультра' },
      ], section: 'targets'
    },
    { key: 'risks', label: 'Риски', placeholder: 'Смарт-контракт, ликвидность', type: 'textarea', section: 'targets' },
    { key: 'reason', label: 'Причина', placeholder: 'Рост доходности', type: 'textarea', section: 'additional' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Тактика выхода, дополнительные условия', section: 'additional' },
  ],
  airdrop: [
    { key: 'projectName', label: 'Название проекта', placeholder: 'Project Name', section: 'basic', required: true },
    { key: 'network', label: 'Сеть', type: 'select', options: [...networkOptions, { value: 'other' as any, label: 'Другое' }], section: 'basic' },
    {
      key: 'rewardType', label: 'Тип награды', type: 'select', options: [
        { value: 'token', label: 'Токены' },
        { value: 'points', label: 'Поинты' },
        { value: 'nft', label: 'NFT' },
        { value: 'other', label: 'Другое' },
      ], section: 'details'
    },
    { key: 'expectedValue', label: 'Ожидаемая стоимость', placeholder: '$100 - $1000', section: 'details' },
    { key: 'tasks', label: 'Список задач', placeholder: 'Свапы, бридж, подписка...', type: 'textarea', section: 'details', required: true },
    { key: 'link', label: 'Ссылка на активность', placeholder: 'https://...', section: 'links', required: true },
    { key: 'deadline', label: 'Дедлайн', placeholder: '31.12.2025', section: 'links' },
    { key: 'reason', label: 'Почему заходим (Lust)', placeholder: 'Большие инвестиции, проект от Binance...', type: 'textarea', section: 'analysis', required: true },
    { key: 'risks', label: 'Риски', placeholder: 'Скам, долгое ожидание, затраты на газ', type: 'textarea', section: 'analysis' },
    { key: 'traderComment', label: 'Комментарий', type: 'textarea', placeholder: 'Лайфхаки, как лучше делать', section: 'analysis' },
  ],
}

const buildEmptyDetails = (): FormDetailsState => ({
  memecoins: {
    network: 'solana',
    contract: '',
    holdPlan: 'short',
    entryCap: '',
    targets: '',
    stopLoss: '',
    trailingPercent: '',
    riskLevel: 'medium',
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
  airdrop: {
    projectName: '',
    network: 'solana',
    rewardType: 'token',
    expectedValue: '',
    tasks: '',
    deadline: '',
    link: '',
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
  airdrop: { ...base.airdrop, ...(incoming?.airdrop || {}) },
})

export const CallForm = ({ onSuccess, onCancel, callToEdit, initialCategory }: CallFormProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

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
  const subtleColor = subtle
  const bgColor = theme === 'dark' ? 'bg-[#121212]' : 'bg-white'

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

  // Calculate form completion progress
  const getFormProgress = () => {
    const categoryFields = CATEGORY_FIELDS[category]
    const requiredFields = categoryFields.filter(field => field.required)
    const activePayload = (details as any)[category] || {}

    let filledRequired = 0
    requiredFields.forEach(field => {
      const value = activePayload[field.key]
      if (value !== undefined && value !== null && value !== '') {
        filledRequired++
      }
    })

    return {
      filled: filledRequired,
      total: requiredFields.length,
      percentage: requiredFields.length > 0 ? Math.round((filledRequired / requiredFields.length) * 100) : 100
    }
  }

  const progress = getFormProgress()

  // Copy helper functions from Call.tsx
  const riskBadges: Record<CallRiskLevel, string> = {
    low: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    medium: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
    high: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    ultra: 'bg-red-500/10 text-red-600 border border-red-500/20',
  }

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
    airdrop: {
      bg: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50',
      text: theme === 'dark' ? 'text-blue-100' : 'text-blue-800',
      border: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-200',
      chipBg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/10',
    },
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
      case 'airdrop':
        return `${d.network ? String(d.network).toUpperCase() : ''} • ${d.rewardType || ''}`
      default:
        return ''
    }
  }

  const getRiskLevel = (call: Call): CallRiskLevel => call.riskLevel || getDetails(call).riskLevel || getDetails(call).protocolRisk || 'medium'

  // Function to shorten long values like contracts
  const shortenValue = (value?: string, max = 28) => {
    if (!value) return ''
    if (value.length <= max) return value
    const head = value.slice(0, Math.floor(max / 2))
    const tail = value.slice(-6)
    return `${head}...${tail}`
  }

  // Copy renderCategoryMetrics from Call.tsx
  const renderCategoryMetrics = (call: Call) => {
    const d = getDetails(call)
    const risk = getRiskLevel(call) as CallRiskLevel
    const tone = categoryTone[call.category]
    const metrics: { label: string; value?: string; icon: JSX.Element }[] = []

    const addMetric = (label: string, value: string | undefined, icon: JSX.Element) => {
      if (!value) return
      metrics.push({ label, value, icon })
    }

    switch (call.category) {
      case 'memecoins':
        addMetric('Контракт', shortenValue(d.contract, 20), <Link2 className="w-4 h-4" />)
        addMetric('Сеть', d.network ? String(d.network).toUpperCase() : '', <Globe2 className="w-4 h-4" />)
        addMetric('Стратегия', d.holdPlan === 'flip' ? 'Флип' : d.holdPlan === 'short' ? 'Краткосрок' : d.holdPlan === 'medium' ? 'Среднесрок' : 'Дальнесрок', <TrendingUp className="w-4 h-4" />)
        addMetric('Зона входа', d.entryCap, <MapPin className="w-4 h-4" />)
        addMetric('Цели', d.targets, <Target className="w-4 h-4" />)
        addMetric('Стоп-лосс', d.stopLoss, <Octagon className="w-4 h-4" />)
        addMetric('Трейлинг', d.trailingPercent, <Percent className="w-4 h-4" />)
        addMetric('Ликвидность', d.liquidityLocked ? 'Залочена' : 'Не залочена', <Shield className="w-4 h-4" />)
        break
      case 'futures':
        addMetric('Пара', d.pair, <Activity className="w-4 h-4" />)
        addMetric('Направление', d.direction ? d.direction.toUpperCase() : '', <TrendingUp className="w-4 h-4" />)
        addMetric('Плечо', d.leverage, <Gauge className="w-4 h-4" />)
        addMetric('Зона входа', d.entryZone || d.entryPrice, <MapPin className="w-4 h-4" />)
        addMetric('Цели', d.targets, <Target className="w-4 h-4" />)
        addMetric('SL', d.stopLoss, <Octagon className="w-4 h-4" />)
        addMetric('Стиль', d.signalStyle, <Wand2 className="w-4 h-4" />)
        addMetric('Размер позиции', d.positionSize, <Percent className="w-4 h-4" />)
        addMetric('Таймфрейм', d.timeframe, <Timer className="w-4 h-4" />)
        break
      case 'nft':
        addMetric('Коллекция', d.collectionLink, <Link2 className="w-4 h-4" />)
        addMetric('Маркетплейс', d.marketplace, <Building2 className="w-4 h-4" />)
        addMetric('Сеть', d.network ? String(d.network).toUpperCase() : '', <NetworkIcon className="w-4 h-4" />)
        addMetric('Вход', d.entryPrice, <MapPin className="w-4 h-4" />)
        addMetric('Редкость', d.rarity, <Sparkles className="w-4 h-4" />)
        addMetric('Тип сигнала', d.signalType ? d.signalType.toUpperCase() : '', <Wand2 className="w-4 h-4" />)
        addMetric('Срок удержания', d.holdingHorizon, <Clock3 className="w-4 h-4" />)
        addMetric('Мин. ликвидность', d.minLiquidity, <Gauge className="w-4 h-4" />)
        addMetric('Target', d.targetPrice, <Target className="w-4 h-4" />)
        break
      case 'spot':
        addMetric('Монета', d.coin, <Coins className="w-4 h-4" />)
        addMetric('Зона входа', d.entryCap, <MapPin className="w-4 h-4" />)
        addMetric('Цели', d.targets, <Target className="w-4 h-4" />)
        addMetric('SL', d.stopLoss, <Octagon className="w-4 h-4" />)
        addMetric('Горизонт', d.holdingHorizon, <Clock3 className="w-4 h-4" />)
        addMetric('Размер', d.positionSize, <Percent className="w-4 h-4" />)
        break
      case 'polymarket':
        addMetric('Событие', d.event, <ScrollText className="w-4 h-4" />)
        addMetric('Тип', d.positionType ? d.positionType.toUpperCase() : '', <Shield className="w-4 h-4" />)
        addMetric('Вход %', d.entryPrice, <Percent className="w-4 h-4" />)
        addMetric('Ожидание %', d.expectedProbability, <Gauge className="w-4 h-4" />)
        addMetric('Цель', d.targetPlan, <Target className="w-4 h-4" />)
        addMetric('Макс ставка', d.maxStake, <Coins className="w-4 h-4" />)
        break
      case 'staking':
        addMetric('Монета', d.coin, <Coins className="w-4 h-4" />)
        addMetric('Платформа', d.platform, <Building2 className="w-4 h-4" />)
        addMetric('Срок', d.term, <CalendarClock className="w-4 h-4" />)
        addMetric('APY', d.apy, <Percent className="w-4 h-4" />)
        addMetric('Мин. депозит', d.minDeposit, <Coins className="w-4 h-4" />)
        addMetric('Тип сигнала', d.action, <Shield className="w-4 h-4" />)
        break
      case 'airdrop':
        addMetric('Проект', d.projectName, <Building2 className="w-4 h-4" />)
        addMetric('Сеть', d.network ? String(d.network).toUpperCase() : '', <Globe2 className="w-4 h-4" />)
        addMetric('Награда', d.rewardType, <Target className="w-4 h-4" />)
        addMetric('Ценность', d.expectedValue, <Coins className="w-4 h-4" />)
        addMetric('Задачи', d.tasks, <ScrollText className="w-4 h-4" />)
        addMetric('Дедлайн', d.deadline, <Timer className="w-4 h-4" />)
        break
    }

    const visibleMetrics = metrics.filter((m) => m.value)
    if (!visibleMetrics.length) return null

    return (
      <div className={`rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-white'}`}>
        <div className={`flex items-center gap-2 px-4 py-3 border-b ${borderColor} ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
          <Sparkles className="w-4 h-4 text-amber-500" />
          <p className={`text-sm font-semibold ${textColor}`}>Ключевые метрики</p>
          <span className={`ml-auto text-[11px] font-semibold px-3 py-1 rounded-full ${riskBadges[risk]}`}>
            Риск: {risk}
          </span>
        </div>
        <div className="divide-y divide-gray-200/70 dark:divide-white/10">
          {visibleMetrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border ${tone.border} ${tone.bg} ${tone.text}`}>
                  {metric.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs uppercase tracking-wide ${subtleColor}`}>{metric.label}</p>
                  <p className={`${textColor} font-semibold whitespace-pre-wrap break-words`}>{metric.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Generate preview call object
  const generatePreviewCall = (): Call => {
    const activePayload = (details as any)[category]
    const payloadDetails: CallDetails = {
      [category]: activePayload,
    }

    const sentiment = deriveSentiment(activePayload)
    const riskLevel = deriveRiskLevel(activePayload)

    return {
      id: 'preview',
      userId: user?.id || 'unknown',
      category,
      details: payloadDetails,
      createdAt: new Date().toISOString(),
      status: 'active',
      tags: [],
      sentiment,
      riskLevel,
      comment,
    }
  }

  const handlePreview = () => {
    setShowPreview(true)
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

      const userId = callToEdit?.userId || user?.id || 'unknown'

      const baseData: Omit<Call, 'id'> = {
        userId,
        category,
        details: payloadDetails,
        createdAt: callToEdit?.createdAt || new Date().toISOString(),
        status: callToEdit?.status || 'active',
        tags: callToEdit?.tags || [],
      }

      const trimmedComment = comment?.trim()
      if (trimmedComment) baseData.comment = trimmedComment

      const sentiment = deriveSentiment(activePayload)
      if (sentiment) baseData.sentiment = sentiment

      const riskLevel = deriveRiskLevel(activePayload)
      if (riskLevel) baseData.riskLevel = riskLevel

      if (callToEdit?.maxProfit !== undefined) baseData.maxProfit = callToEdit.maxProfit
      if (callToEdit?.currentPnL !== undefined) baseData.currentPnL = callToEdit.currentPnL
      if (callToEdit?.currentMarketCap !== undefined) baseData.currentMarketCap = callToEdit.currentMarketCap
      if (callToEdit?.signalMarketCap !== undefined) baseData.signalMarketCap = callToEdit.signalMarketCap
      if (callToEdit?.currentPrice !== undefined) baseData.currentPrice = callToEdit.currentPrice
      if (callToEdit?.entryPrice !== undefined) baseData.entryPrice = callToEdit.entryPrice

      if (callToEdit) {
        await updateCall(callToEdit.id, baseData)
      } else {
        await addCall(baseData)
      }
      onSuccess?.()
    } catch (err) {
      console.error('Error creating call:', err)
      const message = (err as any)?.message || (err as any)?.code || 'Ошибка при сохранении сигнала'
      setError(message)
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
      // Replace select with beautiful button grid for better UX
      const cols = field.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' :
        field.options.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' :
          'grid-cols-2 sm:grid-cols-3'
      return (
        <div className={`grid ${cols} gap-2 sm:gap-3`}>
          {field.options.map((opt) => {
            const isSelected = value === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField(field.key, opt.value)}
                className={`px-3 py-3 sm:py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 min-h-[44px] sm:min-h-[40px] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/30 ${isSelected
                  ? 'border-[#4E6E49] bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white shadow-md shadow-emerald-300/30 scale-[1.02] ring-2 ring-[#4E6E49]/20'
                  : `border-gray-200 dark:border-gray-700 ${theme === 'dark' ? 'text-gray-300 hover:border-gray-600 hover:bg-gray-800' : 'text-gray-700 hover:border-gray-400 hover:bg-gray-50'} active:scale-95 hover:-translate-y-0.5`
                  }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )
    }

    if (field.type === 'checkbox') {
      return (
        <label className="inline-flex items-center gap-3 cursor-pointer select-none p-3 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 min-h-[48px] sm:min-h-[44px] hover:shadow-sm">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => updateField(field.key, e.target.checked)}
            className="accent-[#4E6E49] w-5 h-5 sm:w-4 sm:h-4"
          />
          <span className={`font-medium ${textColor} text-sm sm:text-base`}>{field.label}</span>
        </label>
      )
    }

    return (
      <div className="relative">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => updateField(field.key, e.target.value)}
          className={common}
          placeholder={field.placeholder}
        />
        {field.key === 'contract' && value && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(String(value))
            }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
            title="Скопировать контракт"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/30 border border-red-700 text-red-300' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {error}
        </div>
      )}

      {/* Category Selection */}
      <div className={`rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white'} p-4 sm:p-6`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #4E6E49, #3b8d5a)' }}>
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-lg font-bold ${textColor}`}>Выберите тип сигнала</p>
            <p className={`text-xs ${subtle}`}>Какая категория лучше всего описывает ваш сигнал?</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
          {(Object.keys(CATEGORY_META) as CallCategory[]).map((cat) => {
            const meta = CATEGORY_META[cat]
            const isSelected = category === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 ${isSelected
                  ? `border-[#4E6E49] bg-gradient-to-br from-[#4E6E49]/10 to-emerald-500/10 shadow-md shadow-emerald-300/20 scale-[1.02] ring-2 ring-[#4E6E49]/20`
                  : `border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg`
                  }`}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#4E6E49] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} transition-colors`}>
                    {meta.icon}
                  </div>
                  <span className={`text-sm font-semibold ${isSelected ? 'text-[#4E6E49]' : textColor}`}>
                    {meta.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Signal Details */}
      <div className={`rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-white'} p-4 sm:p-6 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex w-10 h-10 rounded-xl items-center justify-center text-white shadow-lg`} style={{ background: 'linear-gradient(135deg, #4E6E49, #3b8d5a)' }}>
              <div className="w-5 h-5">
                {CATEGORY_META[category].icon}
              </div>
            </div>
            <div className="hidden sm:block">
              <p className={`text-lg font-bold ${textColor}`}>{CATEGORY_META[category].label} - Детали сигнала</p>
              <p className={`text-xs ${subtle}`}>Заполните все необходимые поля</p>
            </div>
            <div className="sm:hidden">
              <p className={`text-sm font-bold ${textColor}`}>{CATEGORY_META[category].label}</p>
            </div>
          </div>
          {progress.percentage < 100 && (
            <div className="text-right">
              <div className={`w-16 h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} shadow-inner`}>
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-[#4E6E49] to-emerald-600"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className={`text-xs ${subtle} mt-1`}>{progress.filled}/{progress.total}</p>
            </div>
          )}
          {progress.percentage === 100 && (
            <div className="text-right">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {Object.entries(CATEGORY_SECTIONS[category]).map(([sectionKey, sectionConfig], index) => {
            const sectionFields = CATEGORY_FIELDS[category].filter(field => field.section === sectionKey)
            if (sectionFields.length === 0) return null

            return (
              <div
                key={sectionKey}
                className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className={`p-1.5 rounded-lg transition-colors duration-200 ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {sectionConfig.icon}
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${textColor}`}>{sectionConfig.title}</h3>
                    {sectionConfig.description && (
                      <p className={`text-xs ${subtle}`}>{sectionConfig.description}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {sectionFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      {field.type !== 'checkbox' && (
                        <label className={`text-sm font-semibold ${textColor}`}>
                          {field.label}
                        </label>
                      )}
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
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

      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handlePreview}
            className={`px-6 py-4 sm:py-3 rounded-lg font-semibold border ${borderColor} ${theme === 'dark' ? 'text-white hover:bg-gray-800 active:bg-gray-800' : 'text-gray-800 hover:bg-gray-100 active:bg-gray-200'} transition-colors min-h-[48px] sm:min-h-[44px]`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Предпросмотр
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-4 sm:py-3 rounded-lg font-semibold transition-all shadow-md min-h-[48px] sm:min-h-[44px] ${theme === 'dark'
              ? 'bg-gradient-to-r from-[#4E6E49] to-emerald-700 text-white hover:scale-[1.01] active:scale-[0.98] disabled:bg-gray-700'
              : 'bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white hover:shadow-lg active:shadow-md disabled:bg-gray-300 disabled:text-gray-600'
              }`}
          >
            {loading ? 'Сохраняем...' : callToEdit ? 'Обновить сигнал' : 'Создать сигнал'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`px-6 py-4 sm:py-3 rounded-lg font-semibold border ${borderColor} ${theme === 'dark' ? 'text-white hover:bg-gray-800 active:bg-gray-800' : 'text-gray-800 hover:bg-gray-100 active:bg-gray-200'} min-h-[48px] sm:min-h-[44px]`}
            >
              Отмена
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (() => {
        const previewCall = generatePreviewCall()
        const meta = CATEGORY_META[category]
        const trader = TEAM_MEMBERS.find(t => t.id === previewCall.userId)

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
            <div className={`${bgColor} rounded-2xl shadow-2xl border ${borderColor} max-w-4xl w-full max-h-[90vh] overflow-hidden`}>
              <div className="flex flex-col h-full">
                <div className={`p-6 flex items-center justify-between sticky top-0 z-20 ${bgColor} border-b ${borderColor} shadow-sm`}>
                  <h2 className={`text-2xl font-bold ${textColor} flex items-center gap-2`}>
                    <Eye className="w-5 h-5" />
                    Предпросмотр сигнала
                  </h2>
                  <button
                    onClick={() => setShowPreview(false)}
                    className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <X className={`w-5 h-5 ${subtleColor}`} />
                  </button>
                </div>
                <div className="px-6 pb-6 pt-2 overflow-y-auto flex-1 max-h-[75vh]">
                  {/* Preview Card */}
                  <div className={`rounded-3xl border-2 shadow-xl overflow-hidden mb-6 ${categoryTone[category].border} ${categoryTone[category].bg}`}>
                    <div className={`px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/70'}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${categoryTone[category].border} ${categoryTone[category].chipBg || ''} ${categoryTone[category].text}`}>
                          {meta.icon}
                          {meta.label}
                        </span>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/20`}>Активен</span>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${riskBadges[previewCall.riskLevel || 'medium']}`}>Риск: {previewCall.riskLevel || 'medium'}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${theme === 'dark' ? 'bg-gray-800/70 text-gray-200 border-white/10' : 'bg-white text-gray-700 border-gray-200'}`}>
                          Создано только что
                        </div>
                        {trader && (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-black/5 dark:bg-white/5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                              {trader.name[0]}
                            </div>
                            <span className={`text-xs ${subtleColor}`}>{trader.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 space-y-5">
                      <div className="grid md:grid-cols-[1.15fr_auto] gap-4 items-start">
                        <div className="space-y-1">
                          <p className={`text-2xl font-bold ${textColor}`}>{getPrimaryTitle(previewCall)}</p>
                          <p className={`text-sm ${subtleColor}`}>{getSecondary(previewCall)}</p>
                        </div>
                      </div>

                      {/* Render metrics using existing function */}
                      {renderCategoryMetrics(previewCall)}

                      {previewCall.comment && (
                        <div className={`rounded-xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-gray-50'} p-4`}>
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-amber-500" />
                            <p className={`text-sm font-semibold ${textColor}`}>Общий комментарий</p>
                          </div>
                          <p className={`${textColor} whitespace-pre-wrap`}>{previewCall.comment}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowPreview(false)}
                      className={`flex-1 px-4 py-3 rounded-xl border ${borderColor} ${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'} font-semibold`}
                    >
                      Вернуться к редактированию
                    </button>
                    <button
                      onClick={() => {
                        setShowPreview(false)
                        // Trigger form submission
                        const form = document.querySelector('form') as HTMLFormElement
                        form?.requestSubmit()
                      }}
                      className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${progress.percentage === 100
                        ? 'bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                    >
                      <Check className="w-4 h-4 inline mr-2" />
                      Создать сигнал
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </form>
  )
}

