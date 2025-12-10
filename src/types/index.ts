// User types
export interface User {
  id: string
  name: string
  login: string
  password: string
  avatar?: string // Путь к изображению аватара
}

// Slot types
export interface TimeSlot {
  start: string // HH:mm format
  end: string // HH:mm format
  endDate?: string // YYYY-MM-DD format - optional, only if slot crosses midnight
  breaks?: {
    start: string // HH:mm format
    end: string // HH:mm format
  }[]
}

export interface WorkSlot {
  id: string
  userId: string
  date: string // YYYY-MM-DD format
  slots: TimeSlot[]
  comment?: string
  participants: string[] // user IDs
}

// Day status types
export interface DayStatus {
  id: string
  userId: string
  date: string
  type: 'dayoff' | 'sick' | 'vacation'
  comment?: string
  endDate?: string // for multi-day statuses
}

export type ApprovalEntity = 'slot' | 'status'
export type ApprovalAction = 'create' | 'update' | 'delete'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface ApprovalRequest {
  id: string
  entity: ApprovalEntity
  action: ApprovalAction
  status: ApprovalStatus
  authorId: string
  targetUserId: string
  before?: WorkSlot | DayStatus | null
  after?: WorkSlot | DayStatus | null
  comment?: string // note from author
  adminComment?: string // decision note
  reviewedBy?: string
  createdAt: string
  updatedAt: string
}

// Earnings types
export type EarningsCategory = 'memecoins' | 'futures' | 'nft' | 'spot' | 'polymarket' | 'staking' | 'other'

export const EARNINGS_CATEGORY_META: Record<EarningsCategory, { label: string; accent: string; icon: 'rocket' | 'line' | 'image' | 'coins' | 'barchart' | 'shield' | 'sparkles' }> = {
  memecoins: { label: 'Мемкоины', accent: 'emerald', icon: 'rocket' },
  futures: { label: 'Фьючерсы', accent: 'blue', icon: 'line' },
  nft: { label: 'NFT', accent: 'purple', icon: 'image' },
  spot: { label: 'Спот', accent: 'amber', icon: 'coins' },
  polymarket: { label: 'PolyMarket', accent: 'pink', icon: 'barchart' },
  staking: { label: 'Стейкинг', accent: 'indigo', icon: 'shield' },
  other: { label: 'Другое', accent: 'gray', icon: 'sparkles' },
}

export interface Earnings {
  id: string
  userId: string
  date: string
  amount: number
  poolAmount: number
  slotId: string
  category: EarningsCategory
  // Доп. кошельки
  extraWalletsCount?: number
  extraWalletsAmount?: number
  participants: string[] // for shared earnings
}

// Rating types
export interface RatingData {
  userId: string
  earnings: number
  messages: number
  initiatives: number
  signals: number
  profitableSignals: number
  referrals: number
  daysOff: number
  sickDays: number
  vacationDays: number
  poolAmount: number
  rating: number
  lastUpdated: string
}

// Referral types
export interface Referral {
  id: string
  referralId: string
  ownerId: string
  name: string
  age: number
  createdAt: string
  comment?: string
}

// Call (Trading Signal) types
export type Network = 'solana' | 'ethereum' | 'bsc' | 'ton' | 'base' | 'sui' | 'monad' | 'polygon'
export type CallCategory = 'memecoins' | 'futures' | 'nft' | 'spot' | 'polymarket' | 'staking'
export type CallStatus = 'active' | 'completed' | 'cancelled' | 'reviewed'
export type CallRiskLevel = 'low' | 'medium' | 'high' | 'ultra'
export type CallSentiment = 'buy' | 'sell' | 'hold' | 'alert'

export type FuturesDirection = 'long' | 'short'
export type FuturesSignalType = 'breakout' | 'retest' | 'range' | 'scalping' | 'swing'
export type NftSignalType = 'buy' | 'sell' | 'mint'
export type StakingAction = 'enter' | 'exit' | 'rebalance'

export interface MemecoinSignalFields {
  coinName: string
  ticker: string
  network: Network
  contract?: string
  signalType: CallSentiment
  reason: string
  entryCap: string
  targets: string
  stopLoss?: string
  riskLevel: CallRiskLevel
  risks: string
  holdPlan: 'flip' | 'short' | 'medium' | 'long'
  liquidityLocked?: boolean
  traderComment?: string
}

export interface FuturesSignalFields {
  pair: string
  direction: FuturesDirection
  leverage: string
  entryPrice?: string
  entryZone: string
  targets: string
  stopLoss: string
  signalStyle: FuturesSignalType
  positionSize: string
  reason: string
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h'
  risks: string
  riskLevel?: CallRiskLevel
}

export interface NftSignalFields {
  collectionLink: string
  nftLink: string
  marketplace: string
  network: Network
  entryPrice: string
  rarity?: string
  signalType: NftSignalType
  reason: string
  holdingHorizon: 'flip' | 'short' | 'medium' | 'long'
  minLiquidity: string
  targetPrice: string
  traderComment?: string
  risks?: string
}

export interface SpotSignalFields {
  coin: string
  entryCap: string
  targets: string
  stopLoss?: string
  holdingHorizon: 'short' | 'medium' | 'long'
  reason: string
  positionSize: string
  risks: string
  traderComment?: string
  riskLevel?: CallRiskLevel
}

export interface PolymarketSignalFields {
  event: string
  positionType: 'yes' | 'no'
  entryPrice: string // in %
  expectedProbability: string
  reason: string
  eventDeadline: string
  riskLevel: CallRiskLevel
  maxStake: string
  risks: string
  targetPlan: string
}

export interface StakingSignalFields {
  coin: string
  platform: string
  term: 'flexible' | '30d' | '90d' | 'fixed'
  apy: string
  minDeposit: string
  protocolRisk: CallRiskLevel
  action: StakingAction
  reason: string
  risks: string
  traderComment?: string
}

export interface CallDetails {
  memecoins?: MemecoinSignalFields
  futures?: FuturesSignalFields
  nft?: NftSignalFields
  spot?: SpotSignalFields
  polymarket?: PolymarketSignalFields
  staking?: StakingSignalFields
}

export interface Call {
  id: string
  userId: string
  category: CallCategory
  status: CallStatus
  createdAt: string // ISO timestamp
  details: CallDetails
  sentiment?: CallSentiment
  riskLevel?: CallRiskLevel
  tags?: string[]
  comment?: string // Общий комментарий

  // Данные для отображения (заполняются из API)
  maxProfit?: number // MAX прибыль в %
  currentPnL?: number // Текущий PNL с момента сигнала в %
  currentMarketCap?: number // Текущая капитализация токена
  signalMarketCap?: number // Капитализация во время дачи сигнала
  currentPrice?: number // Текущая цена токена
  entryPrice?: number // Цена входа
}

// Task types
export type TaskCategory = 'trading' | 'learning' | 'technical' | 'stream' | 'research' | 'organization'
export type TaskStatus = 'in_progress' | 'completed' | 'closed'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface StageAssignee {
  userId: string
  priority: TaskPriority
  comment?: string
  instruction?: string
}
export interface TaskApproval {
  userId: string
  status: 'approved' | 'rejected' | 'pending'
  comment?: string
  updatedAt: string
  forAll?: boolean // пометка, что согласование выполнено за других
}

export interface TaskAssignee {
  userId: string
  priority: TaskPriority
  comment?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  category: TaskCategory
  status: TaskStatus
  createdBy: string // user ID
  assignedTo: string[] // user IDs (для быстрых фильтров)
  assignees?: TaskAssignee[]
  approvals: TaskApproval[] // Текущие согласования (этап по умолчанию)
  createdAt: string
  updatedAt: string
  completedAt?: string
  closedAt?: string
  completedBy?: string // user ID
  priority?: TaskPriority
  dueDate: string // YYYY-MM-DD format (обязательно)
  dueTime: string // HH:mm format (обязательно)
  startTime?: string // HH:mm format (необязательно)
  expectedResult?: string
  requiresApproval?: boolean
  // Роли
  mainExecutor?: string // главный исполнитель
  leadExecutor?: string // ведущий исполнитель
  deputies?: { userId: string; responsibility?: string }[]
  coExecutors?: string[] // соисполнители
  executors?: string[] // legacy
  curators?: string[]
  leads?: string[]
  // Этапы и комментарии
  stages?: TaskStage[]
  currentStageId?: string
  awaitingStageId?: string // этап, ожидающий подтверждение автора/ГИ
  comments?: TaskComment[]
}

export interface TaskStage {
  id: string
  name: string
  description?: string
  responsible: 'all' | string[] // 'all' = все исполнители/роли
  assignees?: StageAssignee[] // расширенные данные об ответственных
  stagePriority?: TaskPriority
  requiresApproval?: boolean
  approvals: TaskApproval[]
  comments?: TaskComment[]
  status: 'pending' | 'approved' | 'rejected'
}

export interface TaskComment {
  id: string
  userId: string
  text: string
  createdAt: string
  stageId?: string // если комментарий к конкретному этапу
}

export interface Note {
  id: string
  userId: string
  title: string
  text: string
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

// Team members
export const TEAM_MEMBERS: User[] = [
  { id: '1', name: 'Артём', login: 'artyom03', password: '248artdex', avatar: '/avatars/artyom.jpg' },
  { id: '2', name: 'Адель', login: 'adel05', password: '058adeldex', avatar: '/avatars/adel.jpg' },
  { id: '3', name: 'Ксения', login: 'ksen03', password: '907ksendex', avatar: '/avatars/kseniya.jpg' },
  { id: '4', name: 'Ольга', login: 'olga04', password: '638olgadex', avatar: '/avatars/olga.jpg' },
  { id: '5', name: 'Анастасия', login: 'anastasia05', password: '638anastadex', avatar: '/avatars/anastasia.jpg' },
]

export const TASK_CATEGORIES: Record<TaskCategory, { label: string; icon: string; color: string }> = {
  trading: { label: 'Торговля', icon: 'candles', color: 'green' },
  learning: { label: 'Обучение', icon: 'book', color: 'blue' },
  technical: { label: 'ТЧ', icon: 'cpu', color: 'purple' },
  stream: { label: 'Стрим', icon: 'broadcast', color: 'red' },
  research: { label: 'Изучение', icon: 'flask', color: 'yellow' },
  organization: { label: 'Ресёрч', icon: 'clipboard', color: 'indigo' },
}

export const TASK_STATUSES: Record<TaskStatus, { label: string; color: string }> = {
  in_progress: { label: 'В работе', color: 'blue' },
  completed: { label: 'Выполнено', color: 'green' },
  closed: { label: 'Закрыто', color: 'gray' },
}



