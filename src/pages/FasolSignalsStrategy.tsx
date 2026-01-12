import { useState, useEffect } from 'react'
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ChevronRight,
  Zap,
  Search,
  ArrowUpDown
} from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'

// Simple cn utility inline
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

interface Strategy {
  id: string
  name: string
  provider?: string
  pnl: number
  winRate: number
  profitFactor: number
  avgTrade: number
  trades: number
  lastTrade?: string
  createdAt?: string
}

interface SortField {
  field: 'name' | 'pnl' | 'winRate' | 'profitFactor' | 'avgTrade' | 'trades' | 'lastTrade' | 'createdAt'
  order: 'asc' | 'desc'
}

// Format utilities
const formatNumber = (value: number): string => {
  if (value >= 1000000) return (value / 1000000).toFixed(2) + 'M'
  if (value >= 1000) return (value / 1000).toFixed(1) + 'K'
  return value.toFixed(2)
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

// Mock strategies for demo
const mockStrategies: Strategy[] = [
  { id: '1', name: 'Fasol Major', provider: 'Fasol', pnl: 45.2, winRate: 72.5, profitFactor: 2.3, avgTrade: 125.50, trades: 156, lastTrade: '2024-01-10', createdAt: '2023-06-15' },
  { id: '2', name: 'Fasol Crypto', provider: 'Fasol', pnl: -12.3, winRate: 45.2, profitFactor: 0.85, avgTrade: -45.20, trades: 89, lastTrade: '2024-01-09', createdAt: '2023-08-20' },
  { id: '3', name: 'Fasol Swing', provider: 'Fasol', pnl: 28.7, winRate: 68.9, profitFactor: 1.95, avgTrade: 89.30, trades: 45, lastTrade: '2024-01-08', createdAt: '2023-10-01' },
  { id: '4', name: 'Fasol Scalp', provider: 'Fasol', pnl: 15.4, winRate: 55.8, profitFactor: 1.42, avgTrade: 12.80, trades: 324, lastTrade: '2024-01-10', createdAt: '2023-09-15' },
  { id: '5', name: 'Fasol Momentum', provider: 'Fasol', pnl: 62.1, winRate: 78.3, profitFactor: 3.1, avgTrade: 210.40, trades: 67, lastTrade: '2024-01-07', createdAt: '2023-05-20' },
]

export const FasolSignalsStrategy = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<SortField>({ field: 'pnl', order: 'desc' })
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [strategies, setStrategies] = useState<Strategy[]>([])

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 500))
      setStrategies(mockStrategies)
      setLoading(false)
    }
    init()
  }, [])

  const handleSort = (field: SortField['field']) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
    }))
  }

  const sortedStrategies = [...strategies].sort((a, b) => {
    const { field, order } = sortConfig
    const modifier = order === 'asc' ? 1 : -1
    
    if (field === 'name') {
      return a.name.localeCompare(b.name) * modifier
    }
    
    const aVal = a[field] ?? (field === 'trades' ? 0 : -Infinity)
    const bVal = b[field] ?? (field === 'trades' ? 0 : -Infinity)
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return (aVal - bVal) * modifier
    }
    
    return 0
  })

  const filteredStrategies = sortedStrategies.filter(strategy =>
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E6E49]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#4E6E49] dark:text-white uppercase tracking-wider">Fasol Signals</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Стратегии сигналов Fasol</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setStrategies(mockStrategies)}
            className={cn(
              "px-4 py-2 rounded-xl font-bold text-sm transition-all",
              "bg-[#4E6E49]/10 text-[#4E6E49] hover:bg-[#4E6E49]/20",
              "border border-[#4E6E49]/20"
            )}
          >
            Обновить
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск стратегий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-11 pr-4 py-3 rounded-xl font-medium text-sm",
              "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10",
              "placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50"
            )}
          />
        </div>
      </div>

      <div className="grid gap-4">
        <div className={cn(
          "grid grid-cols-12 gap-4 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider",
          "bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400"
        )}>
          <div className="col-span-4" onClick={() => handleSort('name')}>
            <button className="flex items-center gap-1 hover:text-[#4E6E49] transition-colors">
              Стратегия
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
          <div className="col-span-2 text-right" onClick={() => handleSort('pnl')}>
            <button className="flex items-center justify-end gap-1 ml-auto hover:text-[#4E6E49] transition-colors">
              PNL
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
          <div className="col-span-2 text-right" onClick={() => handleSort('winRate')}>
            <button className="flex items-center justify-end gap-1 ml-auto hover:text-[#4E6E49] transition-colors">
              Win Rate
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
          <div className="col-span-2 text-right" onClick={() => handleSort('trades')}>
            <button className="flex items-center justify-end gap-1 ml-auto hover:text-[#4E6E49] transition-colors">
              Трейды
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
          <div className="col-span-2 text-right">
            Действия
          </div>
        </div>

        <div className="space-y-3">
          {filteredStrategies.map((strategy) => (
            <StrategyCard 
              key={strategy.id}
              strategy={strategy}
              isSelected={selectedStrategy === strategy.id}
              onSelect={() => setSelectedStrategy(selectedStrategy === strategy.id ? null : strategy.id)}
            />
          ))}

          {filteredStrategies.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg font-bold text-gray-500 dark:text-gray-400">Стратегии не найдены</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const StrategyCard = ({ 
  strategy, 
  isSelected, 
  onSelect 
}: { 
  strategy: Strategy
  isSelected: boolean
  onSelect: () => void
}) => {
  const isPositive = strategy.pnl >= 0
  
  return (
    <div 
      onClick={onSelect}
      className={cn(
        "grid grid-cols-12 gap-4 px-4 py-4 rounded-xl transition-all cursor-pointer",
        "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10",
        "hover:border-[#4E6E49]/30 dark:hover:border-[#4E6E49]/30",
        isSelected && "ring-2 ring-[#4E6E49]/50 border-[#4E6E49]/30 dark:border-[#4E6E49]/30"
      )}
    >
      <div className="col-span-4 flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
          isPositive ? "bg-emerald-500/10" : "bg-red-500/10"
        )}>
          {isPositive ? (
            <TrendingUpIcon className="w-5 h-5 text-emerald-500" />
          ) : (
            <TrendingDownIcon className="w-5 h-5 text-red-500" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold truncate dark:text-white">{strategy.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {strategy.provider || 'Fasol'}
          </p>
        </div>
      </div>
      
      <div className="col-span-2 flex items-center justify-end">
        <span className={cn(
          "font-bold",
          isPositive ? "text-emerald-500" : "text-red-500"
        )}>
          {formatNumber(strategy.pnl)}%
        </span>
      </div>
      
      <div className="col-span-2 flex items-center justify-end">
        <span className="font-bold text-gray-700 dark:text-gray-200">
          {formatNumber(strategy.winRate)}%
        </span>
      </div>
      
      <div className="col-span-2 flex items-center justify-end">
        <span className="font-bold text-gray-700 dark:text-gray-200">
          {strategy.trades}
        </span>
      </div>
      
      <div className="col-span-2 flex items-center justify-end gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
          }}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-[#4E6E49]/10 text-[#4E6E49]"
          )}
        >
          <Zap className="w-4 h-4" />
        </button>
        <ChevronRight className={cn(
          "w-5 h-5 text-gray-400 transition-transform",
          isSelected && "rotate-90"
        )} />
      </div>

      {isSelected && (
        <div className="col-span-12 pt-4 mt-2 border-t border-gray-100 dark:border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard 
              label="Profit Factor" 
              value={formatNumber(strategy.profitFactor)}
            />
            <StatCard 
              label="Avg Trade" 
              value={formatCurrency(strategy.avgTrade)}
            />
            <StatCard 
              label="Last Trade" 
              value={strategy.lastTrade ? formatDate(strategy.lastTrade) : '-'}
            />
            <StatCard 
              label="Created" 
              value={strategy.createdAt ? formatDate(strategy.createdAt) : '-'}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/5">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="font-bold dark:text-white">{value}</p>
  </div>
)
