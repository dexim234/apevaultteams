// Task filters component
import { useThemeStore } from '@/store/themeStore'
import { TaskCategory, TaskStatus, TEAM_MEMBERS, TASK_CATEGORIES, TASK_STATUSES } from '@/types'
import {
  Archive,
  CheckCircle2,
  CircleDot,
  Clock3,
  Filter,
  Gauge,
  Layers,
  Palette,
  SlidersHorizontal,
  Sparkles,
  Users as UsersIcon,
  X,
  XCircle,
} from 'lucide-react'
import { CATEGORY_ICONS } from './categoryIcons'

interface TaskFiltersProps {
  selectedCategory: TaskCategory | 'all'
  selectedStatus: TaskStatus | 'all'
  selectedUsers: string[]
  onCategoryChange: (category: TaskCategory | 'all') => void
  onStatusChange: (status: TaskStatus | 'all') => void
  onUsersChange: (userIds: string[]) => void
  onClear: () => void
}

export const TaskFilters = ({
  selectedCategory,
  selectedStatus,
  selectedUsers,
  onCategoryChange,
  onStatusChange,
  onUsersChange,
  onClear,
}: TaskFiltersProps) => {
  const { theme } = useThemeStore()
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-300'

  const hasActiveFilters = selectedCategory !== 'all' || selectedStatus !== 'all' || selectedUsers.length > 0
  const selectedUserNames = TEAM_MEMBERS.filter((m) => selectedUsers.includes(m.id)).map((m) => m.name)
  const filterNav = [
    { href: '#filter-status', label: 'Статусы' },
    { href: '#filter-category', label: 'Категории' },
    { href: '#filter-people', label: 'Исполнители' },
  ]

  const statusIcons: Record<TaskStatus, JSX.Element> = {
    pending: <CircleDot className="w-4 h-4" />,
    in_progress: <Clock3 className="w-4 h-4" />,
    approval: <Gauge className="w-4 h-4" />,
    completed: <CheckCircle2 className="w-4 h-4" />,
    closed: <Archive className="w-4 h-4" />,
    rejected: <XCircle className="w-4 h-4" />,
  }

  return (
    <div className={`${cardBg} rounded-xl border-2 ${borderColor} p-4 sm:p-6 shadow-lg sticky top-4 space-y-4`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#4E6E49]/20' : 'bg-green-50'}`}>
            <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${headingColor}`}>Фильтры</h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Быстрая навигация по статусам, категориям и участникам
            </p>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50'
                : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
            }`}
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Сбросить всё</span>
          </button>
        )}
      </div>

      {/* Navigation pills */}
      <div className="flex flex-wrap gap-2">
        {filterNav.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-2 ${
              theme === 'dark'
                ? 'border-white/10 bg-white/5 text-gray-100 hover:border-[#4E6E49]/50'
                : 'border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/50 hover:text-[#4E6E49]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {link.label}
          </a>
        ))}
      </div>

      {/* Active filter summary */}
      <div className={`rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-[#1f1f1f]' : 'bg-gray-50'} p-3 space-y-2`}>
        <div className="flex items-center gap-2">
          <Palette className={`w-4 h-4 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
          <p className={`text-sm font-semibold ${headingColor}`}>Текущая подборка</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasActiveFilters ? (
            <>
              {selectedCategory !== 'all' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border border-emerald-500/30">
                  {TASK_CATEGORIES[selectedCategory].label}
                </span>
              )}
              {selectedStatus !== 'all' && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-200 border border-sky-500/30">
                  {TASK_STATUSES[selectedStatus].label}
                </span>
              )}
              {selectedUsers.length > 0 && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-200 border border-purple-500/30">
                  {selectedUserNames.join(', ')}
                </span>
              )}
            </>
          ) : (
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Фильтры не заданы</span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Status Filter */}
        <div id="filter-status" className="space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-yellow-500" />
            <label className={`block text-sm font-semibold ${headingColor}`}>Статусы</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onStatusChange('all')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                selectedStatus === 'all'
                  ? theme === 'dark'
                    ? 'bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]'
                    : 'bg-green-50 border-[#4E6E49] text-[#4E6E49]'
                  : `${theme === 'dark' ? 'bg-gray-800 border-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40'}`
              } flex items-center gap-2 justify-start text-left w-full`}
            >
              <Gauge className="w-4 h-4" />
              Целиком
            </button>
            {Object.entries(TASK_STATUSES).map(([key, { label, color }]) => {
              const colorStyles: Record<string, string> = {
                yellow: theme === 'dark' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-300' : 'bg-yellow-50 border-yellow-500/40 text-yellow-700',
                blue: theme === 'dark' ? 'bg-blue-500/10 border-blue-500/50 text-blue-300' : 'bg-blue-50 border-blue-500/40 text-blue-700',
                purple: theme === 'dark' ? 'bg-purple-500/10 border-purple-500/50 text-purple-200' : 'bg-purple-50 border-purple-500/40 text-purple-700',
                green: theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200' : 'bg-emerald-50 border-emerald-500/40 text-emerald-700',
                gray: theme === 'dark' ? 'bg-gray-500/10 border-gray-500/50 text-gray-300' : 'bg-gray-50 border-gray-400/60 text-gray-700',
                red: theme === 'dark' ? 'bg-red-500/10 border-red-500/50 text-red-300' : 'bg-red-50 border-red-500/40 text-red-700',
              }
              const palette = colorStyles[color] || colorStyles.gray
              const StatusIcon = statusIcons[key as TaskStatus]

              return (
                <button
                  key={key}
                  onClick={() => onStatusChange(key as TaskStatus)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border-2 flex items-center justify-start gap-3 text-left ${
                    selectedStatus === key
                      ? palette
                      : theme === 'dark'
                        ? 'bg-gray-900 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {StatusIcon}
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div id="filter-category" className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <label className={`block text-sm font-semibold ${headingColor}`}>Категории</label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-3 py-3 rounded-lg text-sm font-semibold transition-all border-2 flex items-center gap-2 justify-start text-left w-full ${
                selectedCategory === 'all'
                  ? theme === 'dark'
                    ? 'bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]'
                    : 'bg-green-50 border-[#4E6E49] text-[#4E6E49]'
                  : `${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40' : 'bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40'}`
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Всё
            </button>
            {Object.entries(TASK_CATEGORIES).map(([key, { label }]) => {
              const Icon = CATEGORY_ICONS[key as TaskCategory]
              const isActive = selectedCategory === key

              return (
                <button
                  key={key}
                  onClick={() => onCategoryChange(key as TaskCategory)}
                  className={`px-3 py-3 rounded-lg text-sm font-semibold transition-all border-2 flex flex-col items-start gap-2 text-left leading-tight whitespace-normal ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]'
                        : 'bg-green-50 border-[#4E6E49] text-[#4E6E49]'
                      : `${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40' : 'bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40'}`
                  }`}
                >
                  <span className="flex items-center gap-2 justify-start">
                    <Icon className="w-4 h-4" />
                    <span className="break-words">{label}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* User Filter */}
        <div id="filter-people" className="space-y-3">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-sky-500" />
            <label className={`block text-sm font-semibold ${headingColor}`}>Исполнители</label>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onUsersChange([])}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                selectedUsers.length === 0
                  ? theme === 'dark'
                    ? 'bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]'
                    : 'bg-green-50 border-[#4E6E49] text-[#4E6E49]'
                  : `${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40' : 'bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40'}`
              }`}
            >
              Все
            </button>
            {TEAM_MEMBERS.map((member) => {
              const isSelected = selectedUsers.includes(member.id)
              return (
                <button
                  key={member.id}
                  onClick={() => {
                    if (isSelected) {
                      onUsersChange(selectedUsers.filter((id) => id !== member.id))
                    } else {
                      onUsersChange([...selectedUsers, member.id])
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border-2 flex items-center gap-2 ${
                    isSelected
                      ? theme === 'dark'
                        ? 'bg-[#4E6E49]/20 border-[#4E6E49] text-[#4E6E49]'
                        : 'bg-green-50 border-[#4E6E49] text-[#4E6E49]'
                      : `${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40' : 'bg-white border-gray-200 text-gray-700 hover:border-[#4E6E49]/40'}`
                  }`}
                >
                  <CircleDot className={`w-3 h-3 ${isSelected ? 'text-[#4E6E49]' : 'text-gray-400'}`} />
                  {member.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
