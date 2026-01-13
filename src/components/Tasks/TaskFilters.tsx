import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { TaskCategory, TaskStatus, TASK_CATEGORIES } from '@/types'
import { MemberSelector } from '@/components/Management/MemberSelector'
import { Filter, ChevronDown, X, Plus, Tag } from 'lucide-react'
import { CATEGORY_ICONS } from './categoryIcons'

interface TaskFiltersProps {
  selectedCategory: TaskCategory | 'all'
  selectedStatus: TaskStatus | 'all'
  selectedUsers: string[]
  onCategoryChange: (category: TaskCategory | 'all') => void
  onStatusChange: (status: TaskStatus | 'all') => void
  onUsersChange: (userIds: string[]) => void
  onAddTask?: () => void
}

export const TaskFilters = ({
  selectedCategory,
  selectedStatus,
  selectedUsers,
  onCategoryChange,
  onStatusChange,
  onUsersChange,
  onAddTask
}: TaskFiltersProps) => {
  const { theme } = useThemeStore()
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const cardBg = theme === 'dark' ? 'bg-[#151a21]/50' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-white/5' : 'border-gray-200'
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const inputBg = theme === 'dark' ? 'bg-[#0f1216]' : 'bg-gray-100'
  const dropdownBg = theme === 'dark' ? 'bg-[#1a1f26]' : 'bg-white'
  const hoverBg = theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'

  const statusOptions = [
    { value: 'all', label: 'Все' },
    { value: 'in_progress', label: 'В работе' },
    { value: 'completed', label: 'Выполнено' },
    { value: 'closed', label: 'Закрыто' }
  ]

  const categories = Object.entries(TASK_CATEGORIES).map(([key, { label }]) => ({
    key: key as TaskCategory,
    label
  }))

  const selectedCategoryLabel = selectedCategory === 'all' 
    ? 'Все' 
    : TASK_CATEGORIES[selectedCategory]?.label || 'Категория'

  const SelectedCategoryIcon = selectedCategory === 'all' ? Tag : CATEGORY_ICONS[selectedCategory]

  return (
    <div className="space-y-3">
      {/* Mobile: Filters toggle + Add button */}
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all flex-1 justify-center ${
            theme === 'dark' 
              ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
              : 'bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Фильтры</span>
          {showMobileFilters ? (
            <X className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        <button
          onClick={onAddTask}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all flex-1 justify-center ${
            theme === 'dark' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Новая</span>
        </button>
      </div>

      {/* Filters content */}
      <div className={`rounded-xl border ${borderColor} ${cardBg} shadow-lg transition-all duration-300 ${
        showMobileFilters ? 'block' : 'hidden lg:block'
      }`}>
        {/* Status Tabs */}
        <div className="p-2 sm:p-3">
          <div className={`flex p-1 rounded-lg ${inputBg} overflow-x-auto scrollbar-hide`}>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value as TaskStatus | 'all')}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedStatus === option.value
                    ? theme === 'dark' ? 'bg-[#2A3441] text-white shadow' : 'bg-white text-gray-900 shadow'
                    : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category & User filters row */}
        <div className="px-2 sm:px-3 pb-3 flex flex-col sm:flex-row gap-3">
          {/* Custom Category dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${borderColor} ${inputBg} ${headingColor} cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
            >
              <span className="flex items-center gap-2">
                <SelectedCategoryIcon className="w-4 h-4 text-emerald-400" />
                <span>{selectedCategoryLabel}</span>
              </span>
              <ChevronDown className={`w-4 h-4 ${mutedColor} transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown menu */}
            {showCategoryDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowCategoryDropdown(false)} 
                />
                <div className={`absolute top-full left-0 right-0 mt-1 ${dropdownBg} border ${borderColor} rounded-lg shadow-xl z-20 overflow-hidden`}>
                  <button
                    onClick={() => {
                      onCategoryChange('all')
                      setShowCategoryDropdown(false)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${hoverBg} ${selectedCategory === 'all' ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900' : mutedColor}`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>Все категории</span>
                  </button>
                  {categories.map(({ key, label }) => {
                    const Icon = CATEGORY_ICONS[key]
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onCategoryChange(key)
                          setShowCategoryDropdown(false)
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${hoverBg} ${selectedCategory === key ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900' : mutedColor}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Member selector */}
          <div className="w-full sm:w-48">
            <MemberSelector
              selectedUserId={selectedUsers[0] || null}
              onSelect={(userId) => onUsersChange(userId ? [userId] : [])}
            />
          </div>
        </div>
      </div>

      {/* Desktop Add Task button */}
      <div className="hidden lg:block">
        <button
          onClick={onAddTask}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-medium transition-all ${
            theme === 'dark' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Новая задача</span>
        </button>
      </div>
    </div>
  )
}
