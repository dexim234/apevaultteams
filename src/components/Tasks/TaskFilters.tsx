// Task filters component
import { useThemeStore } from '@/store/themeStore'
import { TaskCategory, TaskStatus, TEAM_MEMBERS, TASK_CATEGORIES, TASK_STATUSES } from '@/types'
import { Filter, X, Sparkles } from 'lucide-react'

interface TaskFiltersProps {
  selectedCategory: TaskCategory | 'all'
  selectedStatus: TaskStatus | 'all'
  selectedUser: string | 'all'
  onCategoryChange: (category: TaskCategory | 'all') => void
  onStatusChange: (status: TaskStatus | 'all') => void
  onUserChange: (userId: string | 'all') => void
  onClear: () => void
}

export const TaskFilters = ({
  selectedCategory,
  selectedStatus,
  selectedUser,
  onCategoryChange,
  onStatusChange,
  onUserChange,
  onClear,
}: TaskFiltersProps) => {
  const { theme } = useThemeStore()
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'

  const hasActiveFilters = selectedCategory !== 'all' || selectedStatus !== 'all' || selectedUser !== 'all'

  return (
    <div className={`${cardBg} rounded-xl border-2 ${borderColor} p-4 sm:p-6 shadow-lg sticky top-4`}>
      <div className="flex items-center gap-2 mb-5">
        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-50'}`}>
          <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
        </div>
        <h3 className={`text-lg font-bold ${headingColor} flex-1`}>Фильтры</h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
              theme === 'dark' 
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50' 
                : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
            }`}
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Сбросить</span>
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Category Filter */}
        <div>
          <label className={`block text-sm font-semibold mb-3 ${headingColor} flex items-center gap-2`}>
            <Sparkles className="w-4 h-4" />
            Категория
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                selectedCategory === 'all'
                  ? theme === 'dark'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-green-50 border-green-500 text-green-700'
                  : `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              Все
            </button>
            {Object.entries(TASK_CATEGORIES).map(([key, { label, icon }]) => (
              <button
                key={key}
                onClick={() => onCategoryChange(key as TaskCategory)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                  selectedCategory === key
                    ? theme === 'dark'
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-green-50 border-green-500 text-green-700'
                    : `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                <span className="mr-1.5">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className={`block text-sm font-semibold mb-3 ${headingColor} flex items-center gap-2`}>
            <Filter className="w-4 h-4" />
            Статус
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onStatusChange('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                selectedStatus === 'all'
                  ? theme === 'dark'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-green-50 border-green-500 text-green-700'
                  : `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              Все
            </button>
            {Object.entries(TASK_STATUSES).map(([key, { label, color }]) => {
              const statusColorMap: Record<string, { active: string; inactive: string }> = {
                yellow: {
                  active: theme === 'dark' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-yellow-50 border-yellow-500 text-yellow-700',
                  inactive: theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200',
                },
                blue: {
                  active: theme === 'dark' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-blue-50 border-blue-500 text-blue-700',
                  inactive: theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200',
                },
                green: {
                  active: theme === 'dark' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-green-50 border-green-500 text-green-700',
                  inactive: theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200',
                },
                gray: {
                  active: theme === 'dark' ? 'bg-gray-500/20 border-gray-500 text-gray-400' : 'bg-gray-50 border-gray-500 text-gray-700',
                  inactive: theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200',
                },
                red: {
                  active: theme === 'dark' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-red-50 border-red-500 text-red-700',
                  inactive: theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200',
                },
              }
              const colorStyles = statusColorMap[color] || statusColorMap.gray
              
              return (
                <button
                  key={key}
                  onClick={() => onStatusChange(key as TaskStatus)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                    selectedStatus === key ? colorStyles.active : colorStyles.inactive
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* User Filter */}
        <div>
          <label className={`block text-sm font-semibold mb-3 ${headingColor} flex items-center gap-2`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Участник
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onUserChange('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                selectedUser === 'all'
                  ? theme === 'dark'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-green-50 border-green-500 text-green-700'
                  : `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              Все
            </button>
            {TEAM_MEMBERS.map((member) => (
              <button
                key={member.id}
                onClick={() => onUserChange(member.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                  selectedUser === member.id
                    ? theme === 'dark'
                      ? 'bg-green-500/20 border-green-500 text-green-400'
                      : 'bg-green-50 border-green-500 text-green-700'
                    : `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`
                }`}
              >
                {member.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
