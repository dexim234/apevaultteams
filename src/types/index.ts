export interface User {
  id: string
  name: string
  login: string
  password: string
  avatar?: string // Путь к изображению аватара
  role?: string
  nickname?: string
  recoveryCode?: string
  phone?: string
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

export type SlotCategory = 'memecoins' | 'futures' | 'nft' | 'spot' | 'airdrop' | 'polymarket' | 'staking'

export const SLOT_CATEGORY_META: Record<SlotCategory, { label: string; accent: string; icon: string }> = {
  memecoins: { label: 'Мемкоины', accent: 'emerald', icon: 'rocket' },
  futures: { label: 'Фьючерсы', accent: 'blue', icon: 'trending' },
  nft: { label: 'NFT', accent: 'purple', icon: 'image' },
  spot: { label: 'Спот', accent: 'amber', icon: 'coins' },
  airdrop: { label: 'AirDrop', accent: 'cyan', icon: 'gift' },
  polymarket: { label: 'Polymarket', accent: 'pink', icon: 'barchart' },
  staking: { label: 'Стейкинг', accent: 'indigo', icon: 'shield' },
}

export interface WorkSlot {
  id: string
  userId: string
  date: string // YYYY-MM-DD format
  slots: TimeSlot[]
  comment?: string
  participants: string[] // user IDs
  category?: SlotCategory // optional for backward compatibility with old slots
}

// Day status types
export type DayStatusType = 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship' | 'working' | 'weekend'

export interface DayStatus {
  id: string
  userId: string
  date: string
  type: DayStatusType
  status?: 'pending' | 'approved' | 'rejected'
  comment?: string
  endDate?: string // for multi-day statuses
}

// Restriction types
export type RestrictionType = 'slots' | 'dayoff' | 'sick' | 'vacation' | 'absence' | 'truancy' | 'internship' | 'all'

export interface Restriction {
  id: string
  type: RestrictionType // what to restrict
  startDate: string // YYYY-MM-DD format
  endDate?: string // YYYY-MM-DD format for ranges, optional for single dates
  startTime?: string // HH:mm format, optional - if set, restriction starts from this time
  blockFutureDates?: boolean // if true, after restriction time blocks creating records only on the next day after restriction date
  comment?: string
  createdBy: string // admin user ID
  createdAt: string
  isActive: boolean
}

export type ApprovalEntity = 'slot' | 'status' | 'earning' | 'referral' | 'login'
export type ApprovalAction = 'create' | 'update' | 'delete'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface ApprovalRequest {
  id: string
  entity: ApprovalEntity
  action: ApprovalAction
  status: ApprovalStatus
  authorId: string
  targetUserId: string
  before?: WorkSlot | DayStatus | Earnings | Referral | UserNickname | null
  after?: WorkSlot | DayStatus | Earnings | Referral | UserNickname | null
  comment?: string // note from author
  adminComment?: string // decision note
  reviewedBy?: string
  createdAt: string
  updatedAt: string
  processedAt?: string // время когда админ обработал заявку
}

// Earnings types
export type EarningsCategory = 'memecoins' | 'futures' | 'nft' | 'spot' | 'airdrop' | 'polymarket' | 'staking' | 'other'

export const EARNINGS_CATEGORY_META: Record<EarningsCategory, { label: string; accent: string; icon: 'rocket' | 'line' | 'image' | 'coins' | 'gift' | 'barchart' | 'shield' | 'sparkles'; gradient: string; shortName: string }> = {
  memecoins: { label: 'Мемкоины', accent: 'emerald', icon: 'rocket', gradient: 'from-emerald-500 to-teal-600', shortName: 'Мемы' },
  futures: { label: 'Фьючерсы', accent: 'blue', icon: 'line', gradient: 'from-blue-500 to-indigo-600', shortName: 'Фьюч' },
  nft: { label: 'NFT', accent: 'purple', icon: 'image', gradient: 'from-purple-500 to-pink-600', shortName: 'NFT' },
  spot: { label: 'Спот', accent: 'amber', icon: 'coins', gradient: 'from-amber-500 to-orange-600', shortName: 'Спот' },
  airdrop: { label: 'AirDrop', accent: 'cyan', icon: 'gift', gradient: 'from-cyan-500 to-blue-600', shortName: 'Airdrop' },
  polymarket: { label: 'PolyMarket', accent: 'pink', icon: 'barchart', gradient: 'from-pink-500 to-rose-600', shortName: 'Poly' },
  staking: { label: 'Стейкинг', accent: 'indigo', icon: 'shield', gradient: 'from-indigo-500 to-violet-600', shortName: 'Stake' },
  other: { label: 'Другое', accent: 'gray', icon: 'sparkles', gradient: 'from-gray-500 to-gray-600', shortName: 'Другое' },
}

export interface Earnings {
  id: string
  userId: string
  date: string
  amount: number
  poolAmount: number
  slotId?: string
  category: EarningsCategory
  walletType?: 'general' | 'personal' | 'pool'
  isDeving?: boolean
  status?: 'pending' | 'approved' | 'rejected'
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
  absenceDays: number
  truancyDays: number
  internshipDays: number
  poolAmount: number
  rating: number
  lastUpdated: string
}

export interface TeamRatingHistory {
  date: string
  averageRating: number
  ratings: {
    userId: string
    rating: number
    earnings: number
    poolAmount: number
  }[]
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
  phone?: string
  tgAccount?: string
  source?: string
  status?: 'active' | 'inactive' | 'deleted'
}

// Call (Trading Signal) types
export type Network = 'solana' | 'ethereum' | 'bsc' | 'ton' | 'base' | 'sui' | 'monad' | 'polygon'
export type CallCategory = 'memecoins' | 'futures' | 'nft' | 'spot' | 'airdrop' | 'polymarket' | 'staking'
export type CallStatus = 'active' | 'completed' | 'cancelled' | 'reviewed'
export type CallRiskLevel = 'low' | 'medium' | 'high' | 'ultra'
export type CallSentiment = 'buy' | 'sell' | 'hold' | 'alert'

export type FuturesDirection = 'long' | 'short'
export type FuturesSignalType = 'breakout' | 'retest' | 'range' | 'scalping' | 'swing'
export type NftSignalType = 'buy' | 'sell' | 'mint'
export type StakingAction = 'enter' | 'exit' | 'rebalance'

export interface MemecoinSignalFields {
  network: Network
  contract?: string
  holdPlan: 'flip' | 'short' | 'medium' | 'long'
  entryCap: string
  targets: string
  stopLoss?: string
  trailingPercent?: string
  riskLevel: CallRiskLevel
  liquidityLocked?: boolean
  traderComment?: string
}

export interface FuturesSignalFields {
  pair: string
  direction: FuturesDirection
  leverage: string
  entryZone: string
  targets: string
  stopLoss: string
  riskLevel: CallRiskLevel
  reason?: string
  risks?: string
  traderComment?: string
}

export interface NftSignalFields {
  nftLink: string
  network: Network
  rarity: string
  targets: string
  riskLevel: CallRiskLevel
  reason?: string
  risks?: string
  traderComment?: string
}

export interface SpotSignalFields {
  coin: string
  entryZone: string
  targets: string
  stopLoss: string
  holdingHorizon: 'short' | 'medium' | 'long'
  riskLevel: CallRiskLevel
  reason?: string
  risks?: string
  traderComment?: string
}

export interface PolymarketSignalFields {
  event: string
  positionType: 'yes' | 'no'
  entryPrice: string // in %
  expectedProbability: string
  reason: string
  eventDeadline: string
  riskLevel: CallRiskLevel
  risks: string
  targetPlan: string
}

export interface StakingSignalFields {
  coin: string
  platform: string
  term: 'flexible' | '30d' | '90d' | '180d' | '365d' | 'fixed'
  fixedTermCustom?: string
  apy: string
  minDeposit: string
  protocolRisk: CallRiskLevel
  reason: string
  risks: string
  traderComment?: string
}

export interface AirdropSignalFields {
  projectName: string
  network: Network | 'other'
  rewardType: 'token' | 'points' | 'nft' | 'other'
  expectedValue?: string
  tasks: string
  deadline?: string
  link: string
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
  airdrop?: AirdropSignalFields
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
  { id: '1', name: 'Артём', login: 'dexim03@apevault.io', password: '095deximadmpro.03', recoveryCode: '20035009', avatar: '/avatars/artyom.jpg', phone: '79778730513' },
  { id: '2', name: 'Адель', login: 'enowk05@apevault.io', password: '101enowk.05', recoveryCode: '2005100', avatar: '/avatars/adel.jpg', phone: '79172480769' },
  { id: '3', name: 'Ксения', login: 'ksen03@apevault.io', password: '03ksen.03-@!', recoveryCode: '20037958', avatar: '/avatars/kseniya.jpg', phone: '79378159355' },
  { id: '4', name: 'Ольга', login: 'lelik-304@apevault.io', password: '040lelik.04', recoveryCode: '200423', avatar: '/avatars/olga.jpg', phone: '79393035770' },
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

// User Activity tracking types
export interface UserActivity {
  id: string
  userId: string
  loginAt: string
  logoutAt?: string
  browser: string
  userAgent: string
  sessionDuration?: number
  isActive: boolean
  pageViews: string[]
}

// User Nickname types
export interface UserNickname {
  id: string
  userId: string
  nickname: string
  createdAt: string
  updatedAt: string
}

// Conflict restrictions types
export interface UserConflict {
  id: string
  userId: string // user who cannot work with restrictedUserId
  restrictedUserId: string // user they cannot work with
  reason?: string
  createdBy: string
  createdAt: string
  isActive: boolean
}

// Access block types
export interface AccessBlock {
  id: string
  userId?: string // specific user ID
  userIds?: string[] // array of user IDs
  targetType: 'all' | 'single' | 'subset'
  reason: string
  createdBy: string
  createdAt: string
  expiresAt?: string // optional expiration date
  isActive: boolean
  blockFeatures: AccessFeature[] // which features to block
}

export type AccessFeature =
  | 'all' // block entire site
  // Sections
  | 'tools' // block access to Tools section
  | 'avf_hub' // block AVF HUB section
  | 'avf_schedule' // block AVF Schedule (former slots)
  | 'avf_tasks' // block AVF Tasks (former tasks)
  | 'avf_profit' // block AVF Profit (former earnings)
  | 'avf_rating' // block AVF Score (former rating)
  | 'avf_referrals' // block AVF Referrals
  | 'avf_info' // block AVF INFO (former about)
  // Tools Sub-features
  | 'tools_events' // block Events section in Tools
  | 'tools_kontur' // block AVF Kontur in Tools
  | 'tools_kontur_memecoins'
  | 'tools_kontur_polymarket'
  | 'tools_kontur_nft'
  | 'tools_kontur_staking'
  | 'tools_kontur_spot'
  | 'tools_kontur_futures'
  | 'tools_kontur_airdrop'
  | 'tools_strategies_view' // block viewing strategies
  | 'tools_items_view' // block viewing tool items
  // HUB Sub-features
  | 'hub_signals_add'
  | 'hub_signals_view'
  | 'hub_signals_cat_memecoins'
  | 'hub_signals_cat_polymarket'
  | 'hub_signals_cat_nft'
  | 'hub_signals_cat_spot'
  | 'hub_signals_cat_futures'
  | 'hub_signals_cat_staking'
  | 'hub_signals_cat_airdrop'
  // Schedule Sub-features
  | 'schedule_stats_view'
  | 'schedule_view'
  | 'schedule_add_slot'
  | 'schedule_status_edit'
  | 'schedule_slot_delete'
  // Tasks Sub-features
  | 'tasks_add'
  | 'tasks_view'
  // Profit Sub-features
  | 'profit_add'
  | 'profit_stats_view'
  | 'profit_leaders_view'
  | 'profit_history_view'
  | 'profit_insights_view'
  | 'profit_cat_memecoins'
  | 'profit_cat_futures'
  | 'profit_cat_nft'
  | 'profit_cat_spot'
  | 'profit_cat_airdrop'
  | 'profit_cat_polymarket'
  | 'profit_cat_staking'
  | 'profit_cat_other'
  | 'profit_wallet_general'
  | 'profit_wallet_personal'
  | 'profit_wallet_pool'
  // Rating Sub-features
  | 'rating_others_view'
  | 'rating_self_view'
  | 'rating_specific_view'
  | 'profile' // block profile access
  // Legacy aliases
  | 'slots'
  | 'earnings'
  | 'tasks'
  | 'rating'
  | 'about'
  | 'tools_meme_evaluation'
  | 'tools_ai_ao_alerts'
  | 'tools_signals_trigger_bot'

// AI - AO Alerts types
export interface AiAlert {
  id: string
  signalDate: string // YYYY-MM-DD
  signalTime: string // HH:mm
  marketCap?: string // string to allow "300,77" format
  address: string
  strategies?: AiAoStrategy[] // Trading strategies
  maxDrop?: string // e.g. "-16"
  maxDropFromLevel07?: string // Drop after level 0.7, e.g. "-5"
  maxProfit?: string // e.g. "+28" or "X3"
  comment?: string // "Постепенное снижение" etc.
  screenshot?: string // URL to screenshot
  isScam?: boolean
  createdAt: string
  createdBy: string
}

// AI-AO Alerts types
export type AiAoStrategy = 'Фиба' | 'Market Entry'

export interface AiAoProfit {
  strategy: AiAoStrategy
  value: string // e.g. "+28" or "X3"
}

// Signals Trigger Bot types (independent from AiAlert)
export type TriggerStrategy = AiAoStrategy

export interface TriggerProfit {
  strategy: TriggerStrategy
  value: string // e.g. "+28" or "X3"
}

export interface TriggerAlert {
  id: string
  signalDate: string // YYYY-MM-DD
  signalTime: string // HH:mm
  marketCap?: string
  address: string
  strategies: TriggerStrategy[] // Multiple strategies
  maxDropFromSignal?: string // e.g. "-16"
  maxDropFromLevel07?: string // e.g. "-5"
  maxProfit?: string // e.g. "+28" or "X3"
  profits?: TriggerProfit[] // Multiple profits (one per strategy)
  comment?: string
  screenshot?: string // URL to screenshot
  isScam?: boolean // Mark signal as scam
  createdAt: string
  createdBy: string
}

// Fasol Signals Strategy types
export interface FasolTriggerAlert {
  id: string
  signalDate: string // YYYY-MM-DD
  signalTime: string // HH:mm
  marketCap?: string
  liq?: string
  hold?: string
  top10?: string
  address: string
  strategies?: TriggerStrategy[]
  maxDropFromSignal?: string
  maxDropFromLevel07?: string
  maxProfit?: string
  profits?: TriggerProfit[]
  comment?: string
  screenshot?: string
  isScam?: boolean
  setup?: 'One' | 'Two' | 'Three' | 'Four' | 'Five'
  createdAt: string
  createdBy: string
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  details?: string
  createdAt: string
}

// Learning Platform types
export type LessonTopic = 'memecoins' | 'polymarket' | 'nft' | 'staking' | 'spot' | 'futures' | 'airdrop'

export interface LessonResource {
  id: string
  title: string
  url: string
  description: string
}

export interface LessonFile {
  url: string
  name: string
}

export interface Lesson {
  id: string
  topicId: LessonTopic
  lessonNumber: number
  title: string
  videoUrl?: string // legacy
  videoFileName?: string // legacy
  youtubeUrl?: string // legacy
  fileUrl?: string // legacy
  fileName?: string // legacy
  videos?: LessonFile[] // Multiple videos
  files?: LessonFile[] // Multiple files
  youtubeUrls?: string[] // Multiple YouTube links
  comment?: string
  resources: LessonResource[]
  createdAt: string
  updatedAt: string
  createdBy?: string // user ID who created the lesson
}

// Event types
export type EventCategory = 'memecoins' | 'polymarket' | 'nft' | 'staking' | 'spot' | 'futures' | 'airdrop'

export const EVENT_CATEGORY_META: Record<EventCategory, { label: string; gradient: string; gradientDark: string; icon: string; cardGradient: string }> = {
  memecoins: {
    label: 'Мемкоины',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-400',
    gradientDark: 'from-emerald-500 via-teal-600 to-cyan-500',
    icon: 'rocket',
    cardGradient: 'from-emerald-500/20 via-teal-400/10 to-cyan-500/5'
  },
  polymarket: {
    label: 'Polymarket',
    gradient: 'from-rose-400 to-red-500',
    gradientDark: 'from-rose-600 to-red-500',
    icon: 'barchart',
    cardGradient: 'from-rose-500/20 via-red-500/10 to-transparent'
  },
  nft: {
    label: 'NFT',
    gradient: 'from-purple-400 to-pink-500',
    gradientDark: 'from-purple-600 to-pink-500',
    icon: 'image',
    cardGradient: 'from-purple-500/20 via-pink-500/10 to-transparent'
  },
  staking: {
    label: 'Стейкинг',
    gradient: 'from-emerald-400 to-green-500',
    gradientDark: 'from-emerald-600 to-green-500',
    icon: 'shield',
    cardGradient: 'from-emerald-500/20 via-green-500/10 to-transparent'
  },
  spot: {
    label: 'Спот',
    gradient: 'from-amber-400 to-orange-500',
    gradientDark: 'from-amber-600 to-orange-500',
    icon: 'coins',
    cardGradient: 'from-amber-500/20 via-orange-500/10 to-transparent'
  },
  futures: {
    label: 'Фьючерсы',
    gradient: 'from-blue-400 to-indigo-500',
    gradientDark: 'from-blue-600 to-indigo-500',
    icon: 'trending',
    cardGradient: 'from-blue-500/20 via-indigo-500/10 to-transparent'
  },
  airdrop: {
    label: 'Airdrop',
    gradient: 'from-gray-300 to-gray-400',
    gradientDark: 'from-gray-400 to-gray-300',
    icon: 'gift',
    cardGradient: 'from-gray-500/20 via-gray-400/10 to-transparent'
  },
}

export interface EventLink {
  url: string
  name: string
}

export interface EventFile {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  dates: string[] // Array of dates YYYY-MM-DD
  time: string // HH:mm format
  endTime?: string // HH:mm format
  recurrence?: {
    type: 'none' | 'daily' | 'weekly' | 'range' | 'until'
    startDate: string
    endDate?: string
  }
  links: EventLink[] // Array of named URLs
  requiredParticipants: string[] // User IDs
  recommendedParticipants: string[] // User IDs
  going: string[] // User IDs
  notGoing: string[] // User IDs
  files: EventFile[]
  isHidden?: boolean
  isActualForce?: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}