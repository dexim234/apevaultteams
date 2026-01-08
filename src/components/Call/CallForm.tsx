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
import { Sparkles, Rocket, LineChart, Image, Coins, Shield, Target, Info, MapPin, TrendingUp, AlertTriangle, Settings, MessageSquare, Eye, X, Check, Globe2, Clock3, Link2, Activity, Gauge, Timer, ScrollText, Building2, CalendarClock, Percent, Octagon, Network as NetworkIcon, Copy } from 'lucide-react'

interface CallFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  callToEdit?: Call | null
  initialCategory?: CallCategory
  category?: CallCategory
  onCategoryChange?: (category: CallCategory) => void
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

const CATEGORY_META: Record<CallCategory, { label: string; gradient: string; gradientDark: string; icon: JSX.Element; pastelBg: string; pastelBorder: string; pastelText: string }> = {
  memecoins: { label: 'Мемкоины', gradient: 'from-emerald-400 via-teal-500 to-cyan-400', gradientDark: 'from-emerald-500 via-teal-600 to-cyan-500', icon: <Rocket className="w-5 h-5" />, pastelBg: 'bg-emerald-50', pastelBorder: 'border-emerald-200', pastelText: 'text-emerald-800' },
  futures: { label: 'Фьючерсы', gradient: 'from-sky-300 to-indigo-400', gradientDark: 'from-sky-600 to-indigo-500', icon: <LineChart className="w-5 h-5" />, pastelBg: 'bg-sky-50', pastelBorder: 'border-sky-100', pastelText: 'text-sky-800' },
  nft: { label: 'NFT', gradient: 'from-purple-300 to-pink-300', gradientDark: 'from-purple-600 to-pink-500', icon: <Image className="w-5 h-5" />, pastelBg: 'bg-purple-50', pastelBorder: 'border-purple-100', pastelText: 'text-purple-800' },
  spot: { label: 'Спот', gradient: 'from-amber-300 to-orange-300', gradientDark: 'from-amber-600 to-orange-500', icon: <Coins className="w-5 h-5" />, pastelBg: 'bg-amber-50', pastelBorder: 'border-amber-100', pastelText: 'text-amber-800' },
  polymarket: { label: 'Polymarket', gradient: 'from-rose-300 to-red-300', gradientDark: 'from-rose-600 to-red-500', icon: <Target className="w-5 h-5" />, pastelBg: 'bg-rose-50', pastelBorder: 'border-rose-100', pastelText: 'text-rose-800' },
  staking: { label: 'Стейкинг', gradient: 'from-emerald-300 to-green-400', gradientDark: 'from-emerald-600 to-green-500', icon: <Shield className="w-5 h-5" />, pastelBg: 'bg-emerald-50', pastelBorder: 'border-emerald-100', pastelText: 'text-emerald-800' },
  airdrop: { label: 'AirDrop', gradient: 'from-gray-300 to-gray-400', gradientDark: 'from-gray-500 to-gray-400', icon: <Sparkles className="w-5 h-5" />, pastelBg: 'bg-gray-50', pastelBorder: 'border-gray-100', pastelText: 'text-gray-800' },
}

// Helper to get appropriate gradient based on theme
const getCategoryGradient = (category: CallCategory, theme: string) => {
  return theme === 'dark' ? CATEGORY_META[category].gradientDark : CATEGORY_META[category].gradient
}

const riskBadges: Record<CallRiskLevel, string> = {
  low: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
  medium: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  high: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
  ultra: 'bg-red-500/10 text-red-600 border border-red-500/20',
}

const categoryTone: Record<CallCategory, { border: string; bg: string; text: string; chipBg: string }> = {
  memecoins: { border: 'border-emerald-400/40', bg: 'bg-emerald-500/10', text: 'text-emerald-400', chipBg: 'bg-emerald-400/30' },
  futures: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', text: 'text-blue-400', chipBg: 'bg-blue-500/20' },
  nft: { border: 'border-purple-500/30', bg: 'bg-purple-500/5', text: 'text-purple-400', chipBg: 'bg-purple-500/20' },
  spot: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400', chipBg: 'bg-amber-500/20' },
  polymarket: { border: 'border-rose-500/30', bg: 'bg-rose-500/5', text: 'text-rose-400', chipBg: 'bg-rose-500/20' },
  staking: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/5', text: 'text-cyan-400', chipBg: 'bg-cyan-500/20' },
  airdrop: { border: 'border-gray-500/30', bg: 'bg-gray-500/5', text: 'text-gray-400', chipBg: 'bg-gray-500/20' },
}

// Helper functions for preview
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
      return d.network ? String(d.network).toUpperCase() : ''
    case 'futures':
      return d.direction ? (d.direction === 'long' ? 'Long' : 'Short') : ''
    case 'nft':
      return d.collectionLink || ''
    case 'spot':
      return d.network ? String(d.network).toUpperCase() : ''
    case 'polymarket':
      return d.event || ''
    case 'staking':
      return d.platform || ''
    case 'airdrop':
      return d.projectName || ''
    default:
      return ''
  }
}

const getRiskLevel = (call: Call): CallRiskLevel => call.riskLevel || getDetails(call).riskLevel || getDetails(call).protocolRisk || 'medium'

const shortenValue = (value: string | undefined, maxLength: number): string => {
  if (!value) return ''
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value
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
    entry: { title: 'Зоны входа', icon: <MapPin className="w-4 h-4" />, description: 'Условия входа' },
    targets: { title: 'Цели и риски', icon: <TrendingUp className="w-4 h-4" />, description: 'План прибыли и стоп-лоссы' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Комментарии и детали' },
  },
  nft: {
    basic: { title: 'Основная информация', icon: <Info className="w-4 h-4" />, description: 'Данные о NFT' },
    entry: { title: 'Условия входа', icon: <MapPin className="w-4 h-4" />, description: 'Редкость и атрибуты' },
    targets: { title: 'Цели и риски', icon: <TrendingUp className="w-4 h-4" />, description: 'План продажи и оценка рисков' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Анализ и комментарии' },
  },
  spot: {
    basic: { title: 'Основная информация', icon: <Info className="w-4 h-4" />, description: 'Данные о монете' },
    entry: { title: 'Зона входа', icon: <MapPin className="w-4 h-4" />, description: 'Условия входа в позицию' },
    targets: { title: 'Цели и риски', icon: <TrendingUp className="w-4 h-4" />, description: 'План прибыли и стоп-лоссы' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Анализ и комментарии' },
  },
  polymarket: {
    basic: { title: 'Основная информация', icon: <Info className="w-4 h-4" />, description: 'Данные о событии' },
    entry: { title: 'Условия входа', icon: <MapPin className="w-4 h-4" />, description: 'Позиция и цена входа' },
    targets: { title: 'Цели и риски', icon: <TrendingUp className="w-4 h-4" />, description: 'План прибыли и риски' },
    additional: { title: 'Дополнительно', icon: <Settings className="w-4 h-4" />, description: 'Комментарии и детали' },
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
      key: 'holdPlan',
      label: 'Тип стратегии',
      type: 'select',
      options: [
        { value: 'flip', label: 'Флип' },
        { value: 'short', label: 'Краткосрок' },
        { value: 'medium', label: 'Среднесрок' },
        { value: 'long', label: 'Дальнесрок' },
      ],
      section: 'strategy',
    },
    { key: 'entryCap', label: 'Зона входа в капитализации', placeholder: '10M-15M', section: 'entry' },
    { key: 'targets', label: 'Цели', placeholder: '20M / 30M / 50M', section: 'targets' },
    { key: 'stopLoss', label: 'Стоп-лосс', placeholder: '5M или -25%', section: 'targets' },
    { key: 'trailingPercent', label: 'Процент трейлинга', placeholder: 'например: 5% или 10%', section: 'targets' },
    {
      key: 'riskLevel',
      label: 'Риск уровень',
      type: 'select',
      options: [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
        { value: 'ultra', label: 'Ультра-высокий' },
      ],
      section: 'targets',
    },
    { key: 'liquidityLocked', label: 'Отметка о ликвидности', type: 'checkbox', section: 'targets' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Доп. наблюдения, планы...', section: 'additional' },
  ],
  futures: [
    { key: 'pair', label: 'Пара', placeholder: 'BTC/USDT', section: 'basic', required: true },
    {
      key: 'direction',
      label: 'Направление',
      type: 'select',
      options: [
        { value: 'long', label: 'Long' },
        { value: 'short', label: 'Short' },
      ],
      section: 'basic',
      required: true,
    },
    { key: 'leverage', label: 'Рекомендованное плечо', placeholder: 'x3 - x10', section: 'basic', required: true },
    { key: 'entryZone', label: 'Зоны входа', placeholder: '69000 - 70000', section: 'entry', required: true },
    { key: 'targets', label: 'Цели', placeholder: '71000 / 72500 / 74000', section: 'targets', required: true },
    { key: 'stopLoss', label: 'Рекомендованный SL', placeholder: '68000', section: 'targets', required: true },
    {
      key: 'riskLevel',
      label: 'Риск уровень',
      type: 'select',
      options: [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
        { value: 'ultra', label: 'Ультра-высокий' },
      ],
      section: 'targets',
      required: true,
    },
    { key: 'reason', label: 'Причина входа', placeholder: 'Тренд, объемы, дивергенция...', type: 'textarea', section: 'additional' },
    { key: 'risks', label: 'Риски', placeholder: 'Резкий вброс, низкая волатильность', type: 'textarea', section: 'additional' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Доп. наблюдения, планы...', section: 'additional' },
  ],
  nft: [
    { key: 'nftLink', label: 'NFT (ссылка)', placeholder: 'https://.../item', section: 'basic', required: true },
    { key: 'network', label: 'Сеть', type: 'select', options: networkOptions, section: 'basic', required: true },
    { key: 'rarity', label: 'Редкость / атрибуты', placeholder: 'Rank < 5%', section: 'entry', required: true },
    { key: 'targets', label: 'Цели', placeholder: '2 ETH / 3 ETH / 5 ETH', section: 'targets', required: true },
    {
      key: 'riskLevel',
      label: 'Риск уровень',
      type: 'select',
      options: [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
        { value: 'ultra', label: 'Ультра-высокий' },
      ],
      section: 'targets',
      required: true,
    },
    { key: 'reason', label: 'Причина входа', placeholder: 'Минт, хайп, инсайд', type: 'textarea', section: 'additional' },
    { key: 'risks', label: 'Риски', placeholder: 'Падение спроса, фальшивый объём', type: 'textarea', section: 'additional' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Что смотрим, когда фиксируем', section: 'additional' },
  ],
  spot: [
    { key: 'coin', label: 'Монета', placeholder: 'BTC', section: 'basic', required: true },
    { key: 'entryZone', label: 'Зона входа', placeholder: '500M или 0.000012', section: 'entry', required: true },
    { key: 'targets', label: 'Цели', placeholder: '550M / 650M / 750M', section: 'targets', required: true },
    { key: 'stopLoss', label: 'Рекомендованный SL', placeholder: '-10% или 450M', section: 'targets', required: true },
    {
      key: 'holdingHorizon',
      label: 'Горизонт удержания',
      type: 'select',
      options: [
        { value: 'short', label: 'Краткосрок' },
        { value: 'medium', label: 'Среднесрок' },
        { value: 'long', label: 'Долгосрок' },
      ],
      section: 'targets',
      required: true,
    },
    {
      key: 'riskLevel',
      label: 'Риск-уровень',
      type: 'select',
      options: [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
        { value: 'ultra', label: 'Ультра-высокий' },
      ],
      section: 'targets',
      required: true,
    },
    { key: 'reason', label: 'Причина входа', placeholder: 'Фундаментал, хайп', type: 'textarea', section: 'additional' },
    { key: 'risks', label: 'Риски', placeholder: 'Регуляторика, конкуренты', type: 'textarea', section: 'additional' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Условия фиксации, обновления', section: 'additional' },
  ],
  polymarket: [
    { key: 'event', label: 'Событие', placeholder: 'Trump wins 2025', section: 'basic' },
    { key: 'eventDeadline', label: 'Срок исхода события', placeholder: '31.12.2025', section: 'basic' },
    {
      key: 'positionType',
      label: 'Тип позиции',
      type: 'select',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
      section: 'entry',
    },
    { key: 'entryPrice', label: 'Цена входа (%)', placeholder: '42%', section: 'entry' },
    { key: 'expectedProbability', label: 'Ожидаемая вероятность (%)', placeholder: '65%', section: 'entry' },
    { key: 'targetPlan', label: 'Цель', placeholder: 'Продажа до события или удержание', section: 'targets' },
    {
      key: 'riskLevel',
      label: 'Риск',
      type: 'select',
      options: [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
        { value: 'ultra', label: 'Ультра-высокий' },
      ],
      section: 'targets',
    },
    { key: 'risks', label: 'Риски', placeholder: 'Неопределённость новостей, низкая ликвидность', type: 'textarea', section: 'targets' },
    { key: 'reason', label: 'Причина входа', placeholder: 'Аналитика, инсайд', type: 'textarea', section: 'additional' },
  ],
  staking: [
    { key: 'coin', label: 'Монета', placeholder: 'SOL', section: 'basic' },
    { key: 'platform', label: 'Платформа', placeholder: 'Jito, Lido...', section: 'entry' },
    {
      key: 'term',
      label: 'Срок стейкинга',
      type: 'select',
      options: [
        { value: 'flexible', label: 'Гибкий' },
        { value: '30d', label: '30 дней' },
        { value: '90d', label: '90 дней' },
        { value: '180d', label: '180 дней' },
        { value: '365d', label: '365 дней' },
        { value: 'fixed', label: 'Фиксированный' },
      ],
      section: 'entry',
    },
    {
      key: 'fixedTermCustom',
      label: 'Срок фиксированного стейкинга',
      placeholder: 'Укажите срок (например, 45 дней)',
      section: 'entry',
    },
    { key: 'apy', label: 'APY', placeholder: '12-18%', section: 'entry' },
    { key: 'minDeposit', label: 'Минимальный депозит', placeholder: '100 USDT', section: 'entry' },
    {
      key: 'protocolRisk',
      label: 'Риски протокола',
      type: 'select',
      options: [
        { value: 'low', label: 'Низкие' },
        { value: 'medium', label: 'Средние' },
        { value: 'high', label: 'Высокие' },
        { value: 'ultra', label: 'Ультра' },
      ],
      section: 'targets',
    },
    { key: 'risks', label: 'Риски', placeholder: 'Смарт-контракт, ликвидность', type: 'textarea', section: 'targets' },
    { key: 'reason', label: 'Причина', placeholder: 'Рост доходности', type: 'textarea', section: 'additional' },
    { key: 'traderComment', label: 'Комментарий трейдера', type: 'textarea', placeholder: 'Тактика выхода, дополнительные условия', section: 'additional' },
  ],
  airdrop: [
    { key: 'projectName', label: 'Название проекта', placeholder: 'Project Name', section: 'basic', required: true },
    { key: 'network', label: 'Сеть', type: 'select', options: [...networkOptions, { value: 'other' as any, label: 'Другое' }], section: 'basic' },
    {
      key: 'rewardType',
      label: 'Тип награды',
      type: 'select',
      options: [
        { value: 'token', label: 'Токены' },
        { value: 'points', label: 'Поинты' },
        { value: 'nft', label: 'NFT' },
        { value: 'other', label: 'Другое' },
      ],
      section: 'details',
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
    entryZone: '',
    targets: '',
    stopLoss: '',
    riskLevel: 'medium',
    reason: '',
    risks: '',
    traderComment: '',
  },
  nft: {
    nftLink: '',
    network: 'ethereum',
    rarity: '',
    targets: '',
    riskLevel: 'medium',
    reason: '',
    risks: '',
    traderComment: '',
  },
  spot: {
    coin: '',
    entryZone: '',
    targets: '',
    stopLoss: '',
    holdingHorizon: 'medium',
    riskLevel: 'medium',
    reason: '',
    risks: '',
    traderComment: '',
  },
  polymarket: {
    event: '',
    positionType: 'yes',
    entryPrice: '',
    expectedProbability: '',
    reason: '',
    eventDeadline: '',
    riskLevel: 'medium',
    risks: '',
    targetPlan: '',
  },
  staking: {
    coin: '',
    platform: '',
    term: 'flexible',
    fixedTermCustom: '',
    apy: '',
    minDeposit: '',
    protocolRisk: 'medium',
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

export const CallForm = ({ onSuccess, onCancel, callToEdit, initialCategory, category: categoryProp, onCategoryChange }: CallFormProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const defaultDetails = mergeDetails(buildEmptyDetails(), callToEdit?.details)
  const [internalCategory, setInternalCategory] = useState<CallCategory>(callToEdit?.category || initialCategory || 'memecoins')
  const [details, setDetails] = useState<FormDetailsState>(defaultDetails)

  // Use controlled category if provided, otherwise use internal state
  const category = categoryProp ?? internalCategory
  const setCategory = (newCategory: CallCategory) => {
    setInternalCategory(newCategory)
    onCategoryChange?.(newCategory)
  }

  useEffect(() => {
    const merged = mergeDetails(buildEmptyDetails(), callToEdit?.details)
    setDetails(merged)
    if (!categoryProp) {
      const newCategory = callToEdit?.category || initialCategory || 'memecoins'
      setInternalCategory(newCategory)
      onCategoryChange?.(newCategory)
    }
  }, [callToEdit, initialCategory, categoryProp])

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
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
        addMetric('Зона входа', d.entryZone, <MapPin className="w-4 h-4" />)
        addMetric('Цели', d.targets, <Target className="w-4 h-4" />)
        addMetric('SL', d.stopLoss, <Octagon className="w-4 h-4" />)
        break
      case 'nft':
        addMetric('Ссылка', d.nftLink, <Link2 className="w-4 h-4" />)
        addMetric('Сеть', d.network ? String(d.network).toUpperCase() : '', <NetworkIcon className="w-4 h-4" />)
        addMetric('Редкость', d.rarity, <Sparkles className="w-4 h-4" />)
        addMetric('Цели', d.targets, <Target className="w-4 h-4" />)
        break
      case 'spot':
        addMetric('Монета', d.coin, <Coins className="w-4 h-4" />)
        addMetric('Зона входа', d.entryZone, <MapPin className="w-4 h-4" />)
        addMetric('Цели', d.targets, <Target className="w-4 h-4" />)
        addMetric('SL', d.stopLoss, <Octagon className="w-4 h-4" />)
        addMetric('Горизонт', d.holdingHorizon, <Clock3 className="w-4 h-4" />)
        break
      case 'polymarket':
        addMetric('Событие', d.event, <ScrollText className="w-4 h-4" />)
        addMetric('Тип', d.positionType ? d.positionType.toUpperCase() : '', <Shield className="w-4 h-4" />)
        addMetric('Вход %', d.entryPrice, <Percent className="w-4 h-4" />)
        addMetric('Ожидание %', d.expectedProbability, <Gauge className="w-4 h-4" />)
        addMetric('Цель', d.targetPlan, <Target className="w-4 h-4" />)
        break
      case 'staking':
        addMetric('Монета', d.coin, <Coins className="w-4 h-4" />)
        addMetric('Платформа', d.platform, <Building2 className="w-4 h-4" />)
        addMetric('Срок', d.term === 'fixed' && d.fixedTermCustom ? d.fixedTermCustom : (d.term === 'flexible' ? 'Гибкий' : d.term), <CalendarClock className="w-4 h-4" />)
        addMetric('APY', d.apy, <Percent className="w-4 h-4" />)
        addMetric('Мин. депозит', d.minDeposit, <Coins className="w-4 h-4" />)
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
    const common = `w-full px-4 py-2.5 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-gray-800/80' : 'bg-gray-50'} ${textColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49] transition-all`

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
      const cols = field.options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' :
        field.options.length <= 4 ? 'grid-cols-2 sm:grid-cols-4' :
          'grid-cols-2 sm:grid-cols-3'
      const catGradient = getCategoryGradient(category, theme)
      return (
        <div className={`grid ${cols} gap-2 sm:gap-3`}>
          {field.options.map((opt) => {
            const isSelected = value === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateField(field.key, opt.value)}
                className={`px-3 py-3 sm:py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-300 min-h-[44px] sm:min-h-[40px] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/30 ${isSelected
                  ? `bg-gradient-to-r ${catGradient} text-white shadow-md border-transparent`
                  : `${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-400'}`
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
        <label className="inline-flex items-center gap-3 cursor-pointer select-none p-3 sm:p-3 rounded-lg border transition-all duration-200 min-h-[48px] sm:min-h-[44px] hover:shadow-sm ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}">
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
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
            title="Скопировать контракт"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-red-900/30 border border-red-700/50 text-red-300' : 'bg-red-50 border border-red-200 text-red-800'} flex items-center gap-3 animate-in shake`}>
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Category Selection - Enhanced Design */}
      <div className={`relative rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-white'} p-5 overflow-hidden`}>
        {/* Gradient accent bar using category color */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryGradient(category, theme)}`} />
        
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${getCategoryGradient(category, theme)}`}>
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-lg font-bold ${textColor}`}>Тип сигнала</p>
            <p className={`text-xs ${subtle}`}>Выберите категорию для вашего сигнала</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {(Object.keys(CATEGORY_META) as CallCategory[]).map((cat) => {
            const meta = CATEGORY_META[cat]
            const catGradient = getCategoryGradient(cat, theme)
            const isSelected = category === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 group overflow-hidden ${isSelected
                  ? `border-transparent shadow-lg shadow-${catGradient.split(' ')[0].replace('from-', '').split('-')[0]}-500/20 scale-[1.02]`
                  : `border-gray-700 hover:border-gray-600 hover:shadow-lg hover:-translate-y-0.5 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'}`
                  }`}
              >
                {/* Gradient background for selected */}
                {isSelected && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${catGradient} opacity-30 rounded-xl`} />
                )}
                
                {/* Subtle gradient for non-selected in dark mode */}
                {!isSelected && theme === 'dark' && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${catGradient.replace('from-', 'from-').replace(' to-', ' to-')} opacity-5 rounded-xl`} />
                )}
                
                <div className="relative flex flex-col items-center gap-2.5 text-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isSelected 
                    ? `bg-gradient-to-br ${catGradient} text-white shadow-md` 
                    : `${theme === 'dark' ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'} group-hover:${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}`}>
                    <div className="w-5 h-5">
                      {meta.icon}
                    </div>
                  </div>
                  <div className="w-full">
                    <span className={`text-sm font-bold block transition-colors ${isSelected ? `bg-gradient-to-r ${catGradient} bg-clip-text text-transparent` : textColor}`}>
                      {meta.label}
                    </span>
                    {isSelected && (
                      <span className={`text-[10px] bg-gradient-to-r ${catGradient} bg-clip-text text-transparent font-medium`}>Выбрано</span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Signal Details - Enhanced Card */}
      <div className={`relative rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-900/60' : 'bg-white'} p-5 overflow-hidden`}>
        {/* Decorative gradient accent using category color */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryGradient(category, theme)}`} />
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${getCategoryGradient(category, theme).replace('from-', '').replace(' to-', '/10 to-')} to-transparent rounded-full blur-2xl opacity-30`} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${getCategoryGradient(category, theme)}`}>
              <ScrollText className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-lg font-bold ${textColor}`}>{CATEGORY_META[category].label}</p>
              <p className={`text-xs ${subtle}`}>Заполните детали сигнала</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(CATEGORY_SECTIONS[category]).map(([sectionKey, sectionConfig]) => {
            const sectionFields = CATEGORY_FIELDS[category].filter(field => field.section === sectionKey)
            if (sectionFields.length === 0) return null

            return (
              <div
                key={sectionKey}
                className="relative space-y-4"
              >
                {/* Section header with accent */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryGradient(category, theme)} text-white`}>
                    {sectionConfig.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-base font-bold ${textColor}`}>{sectionConfig.title}</h3>
                    {sectionConfig.description && (
                      <p className={`text-xs ${subtle}`}>{sectionConfig.description}</p>
                    )}
                  </div>
                  <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${getCategoryGradient(category, theme).replace('from-', 'via-')} to-transparent opacity-20`} />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {sectionFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      {field.type !== 'checkbox' && (
                        <label className={`text-sm font-semibold ${textColor} flex items-center gap-2`}>
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
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

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            type="button"
            onClick={handlePreview}
            className={`px-5 py-3.5 rounded-xl font-semibold border-2 transition-all duration-300 flex items-center justify-center gap-2 ${borderColor} ${theme === 'dark' 
              ? 'text-white hover:bg-gray-800 hover:border-gray-600' 
              : 'text-gray-700 hover:bg-gray-50 hover:border-gray-400'} hover:shadow-lg active:scale-[0.98]`}
          >
            <Eye className="w-4 h-4" />
            <span>Предпросмотр</span>
          </button>
          
          <button
            type="submit"
            disabled={loading || progress.percentage < 100}
            className={`flex-1 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 ${loading 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : progress.percentage === 100
                ? 'bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.98]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Сохранение...</span>
              </>
            ) : callToEdit ? (
              <>
                <Check className="w-4 h-4" />
                <span>Обновить сигнал</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Создать сигнал</span>
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`px-5 py-3.5 rounded-xl font-semibold border-2 transition-all duration-300 ${borderColor} ${theme === 'dark' 
                ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'} hover:shadow-lg active:scale-[0.98]`}
            >
              Отмена
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal - Enhanced Design */}
      {showPreview && (() => {
        const previewCall = generatePreviewCall()
        const meta = CATEGORY_META[category]
        const trader = TEAM_MEMBERS.find(t => t.id === previewCall.userId)

        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[80] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className={`relative ${bgColor} rounded-3xl shadow-2xl shadow-black/50 border ${borderColor} max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300`}>
              {/* Header gradient */}
              <div className={`h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500`} />
              
              <div className="p-6 flex items-center justify-between sticky top-0 z-10 ${bgColor} border-b ${borderColor}">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4E6E49] to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${textColor}`}>Предпросмотр</h2>
                    <p className={`text-xs ${subtle}`}>Проверьте сигнал перед публикацией</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-6 pb-6 pt-4 overflow-y-auto max-h-[calc(90vh-100px)]">
                {/* Preview Card */}
                <div className={`relative rounded-2xl border-2 overflow-hidden mb-6 ${categoryTone[category].border} ${categoryTone[category].bg}`}>
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-xl" />
                  
                  <div className={`relative px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-white/70 bg-white/70'}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${categoryTone[category].border} ${categoryTone[category].chipBg || ''} ${categoryTone[category].text}`}>
                        <div className="w-4 h-4">
                          {meta.icon}
                        </div>
                        {meta.label}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30`}>
                        Активен
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${riskBadges[previewCall.riskLevel || 'medium']}`}>
                        Риск: {previewCall.riskLevel || 'medium'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${theme === 'dark' ? 'bg-gray-800/70 text-gray-300 border border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        Только что
                      </span>
                      {trader && (
                        <div className="flex items-center gap-2 px-2 py-1 rounded-lg border border-white/10 bg-black/5 dark:bg-white/5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                            {trader.name[0]}
                          </div>
                          <span className={`text-xs font-medium ${subtleColor}`}>{trader.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative p-5 space-y-5">
                    {/* Title section */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className={`text-2xl font-bold ${textColor}`}>{getPrimaryTitle(previewCall)}</p>
                        <p className={`text-sm ${subtleColor}`}>{getSecondary(previewCall)}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                          {meta.icon}
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    {renderCategoryMetrics(previewCall)}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className={`flex-1 px-4 py-3.5 rounded-xl font-semibold border-2 transition-all duration-300 flex items-center justify-center gap-2 ${borderColor} ${theme === 'dark' 
                      ? 'text-white hover:bg-gray-800' 
                      : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <X className="w-4 h-4" />
                    Назад
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPreview(false)
                      const form = document.querySelector('form') as HTMLFormElement
                      form?.requestSubmit()
                    }}
                    disabled={progress.percentage < 100}
                    className={`flex-1 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${progress.percentage === 100
                      ? 'bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white hover:shadow-xl shadow-emerald-500/30'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <Check className="w-4 h-4" />
                    Опубликовать
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </form>
  )
}

// ... остальной код ...