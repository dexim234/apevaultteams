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

// Earnings types
export interface Earnings {
  id: string
  userId: string
  date: string
  amount: number
  poolAmount: number
  slotId: string
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
export type Network = 'solana' | 'bsc' | 'ethereum' | 'base' | 'ton' | 'tron' | 'sui' | 'cex'
export type Strategy = 'flip' | 'medium' | 'long'
export type CallStatus = 'active' | 'completed' | 'cancelled' | 'reviewed'

export interface Call {
  id: string
  userId: string // ID трейдера
  network: Network
  ticker: string // Тикер токена (например, PEPE)
  pair: string // Пара токена (например, PEPE/USDT)
  entryPoint: string // Точка входа или диапазон (например, "0.001" или "0.001-0.002")
  target: string // Цель/ориентиры по прибыли (например, "0.002, 0.003, 0.005")
  strategy: Strategy // Флип, среднесрок, долгосрок
  risks: string // Риски
  cancelConditions?: string // Условия отмены или пересмотра колла
  comment?: string // Комментарий по ситуации
  createdAt: string // ISO timestamp
  status: CallStatus
  
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
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'closed' | 'rejected'
export interface TaskApproval {
  userId: string
  status: 'approved' | 'rejected' | 'pending'
  comment?: string
  updatedAt: string
}

export interface TaskAssignee {
  userId: string
  priority: 'low' | 'medium' | 'high'
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
  approvals: TaskApproval[] // Для статуса "pending"
  createdAt: string
  updatedAt: string
  completedAt?: string
  closedAt?: string
  completedBy?: string // user ID
  priority?: 'low' | 'medium' | 'high'
  dueDate: string // YYYY-MM-DD format (обязательно)
  dueTime: string // HH:mm format (обязательно)
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
  trading: { label: 'Торговля', icon: '📈', color: 'green' },
  learning: { label: 'Обучение', icon: '📚', color: 'blue' },
  technical: { label: 'Техническая часть', icon: '⚙️', color: 'purple' },
  stream: { label: 'Стрим', icon: '📺', color: 'red' },
  research: { label: 'Изучение нового', icon: '🔬', color: 'yellow' },
  organization: { label: 'Поиск и систематизация информации', icon: '📋', color: 'indigo' },
}

export const TASK_STATUSES: Record<TaskStatus, { label: string; color: string }> = {
  pending: { label: 'На согласовании', color: 'yellow' },
  in_progress: { label: 'В работе', color: 'blue' },
  completed: { label: 'Выполнена', color: 'green' },
  closed: { label: 'Закрыта', color: 'gray' },
  rejected: { label: 'Отклонена', color: 'red' },
}



