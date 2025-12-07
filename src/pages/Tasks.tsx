// Tasks page - task manager
import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { TaskForm } from '@/components/Tasks/TaskForm'
import { TaskCard } from '@/components/Tasks/TaskCard'
import { TaskFilters } from '@/components/Tasks/TaskFilters'
import { TaskKanban } from '@/components/Tasks/TaskKanban'
import { getTasks, deleteTask } from '@/services/firestoreService'
import { Task, TaskCategory, TaskStatus } from '@/types'
import { BarChart3, CheckSquare, LayoutGrid, List, PieChart, Plus, Sparkles } from 'lucide-react'
import { Link as RouterLink } from 'react-router-dom'

export const Tasks = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban')

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'

  useEffect(() => {
    loadTasks()
  }, [user])

  useEffect(() => {
    loadTasks()
  }, [selectedCategory, selectedStatus, selectedUsers])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const filters: any = {}
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory
      }
      if (selectedStatus !== 'all') {
        filters.status = selectedStatus
      }
      if (selectedUsers.length > 0) {
        filters.assignedTo = selectedUsers
      }
      
      const allTasks = await getTasks(filters)
      setTasks(allTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return
    
    try {
      await deleteTask(taskId)
      loadTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  const handleSave = () => {
    setShowForm(false)
    setEditingTask(null)
    loadTasks()
  }

  const handleClearFilters = () => {
    setSelectedCategory('all')
    setSelectedStatus('all')
    setSelectedUsers([])
  }

  const filteredTasks = tasks.filter(task => {
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false
    if (selectedStatus !== 'all' && task.status !== selectedStatus) return false
    if (selectedUsers.length > 0 && !selectedUsers.some((userId) => task.assignedTo.includes(userId))) return false
    return true
  })

  const stats = {
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    closed: tasks.filter(t => t.status === 'closed').length,
  }

  const myTasksCount = user ? tasks.filter(t => t.assignedTo?.includes(user.id)).length : 0
  const totalTasks = tasks.length
  const completionRate = totalTasks ? Math.round(((stats.completed + stats.closed) / totalTasks) * 100) : 0
  const workRate = totalTasks ? Math.round((stats.inProgress / totalTasks) * 100) : 0
  const pendingRate = totalTasks ? Math.round((stats.pending / totalTasks) * 100) : 0

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]' 
            : 'border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white'
        } relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-[#4E6E49]/10 to-emerald-700/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24" />
          
          <div className="relative z-10">
            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <CheckSquare className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                  <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${headingColor} flex items-center gap-2`}>
                    Задачи
                    <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </h1>
                </div>
                <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Управление задачами и заданиями команды
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { href: '#tasks-stats', label: 'Обзор' },
                    { href: '#tasks-board', label: 'Доска' },
                    { href: '#tasks-filters', label: 'Фильтры' },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        theme === 'dark'
                          ? 'border-white/10 bg-white/5 text-white hover:border-[#4E6E49]/50'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/50 hover:text-[#4E6E49]'
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div id="tasks-stats" className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 sm:gap-5">
              {/* Progress board */}
              <div className={`rounded-xl border-2 p-4 sm:p-5 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-green-100 bg-white/80'} backdrop-blur`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-xs uppercase tracking-wide font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Состояние пайплайна</p>
                    <p className={`text-2xl sm:text-3xl font-extrabold ${headingColor}`}>{completionRate}% завершено</p>
                  </div>
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-emerald-500/10 border border-emerald-500/40' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <PieChart className={`w-6 h-6 ${theme === 'dark' ? 'text-emerald-200' : 'text-emerald-700'}`} />
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Рассмотрение', value: stats.pending, rate: pendingRate, color: 'bg-amber-500', tint: 'bg-amber-500/15' },
                    { label: 'В работе', value: stats.inProgress, rate: workRate, color: 'bg-sky-500', tint: 'bg-sky-500/15' },
                    { label: 'Выполнена', value: stats.completed, rate: completionRate, color: 'bg-emerald-500', tint: 'bg-emerald-500/15' },
                  ].map((row) => (
                    <div key={row.label} className="space-y-1">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span className={headingColor}>{row.label}</span>
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {row.value} · {row.rate}%
                        </span>
                      </div>
                      <div className={`h-2 rounded-full ${row.tint}`}>
                        <div
                          className={`h-full rounded-full ${row.color}`}
                          style={{ width: `${Math.min(row.rate, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: 'Всего задач', value: totalTasks, icon: <BarChart3 className="w-5 h-5" />, tone: 'emerald' },
                  { label: 'В работе', value: stats.inProgress, icon: <List className="w-5 h-5" />, tone: 'sky' },
                  { label: 'Рассмотрение', value: stats.pending, icon: <Sparkles className="w-5 h-5" />, tone: 'amber' },
                  { label: 'Закрыта', value: stats.closed, icon: <CheckSquare className="w-5 h-5" />, tone: 'slate' },
                ].map((card) => {
                  const toneMap: Record<string, { bg: string; text: string; border: string }> = {
                    emerald: { bg: theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50', text: theme === 'dark' ? 'text-emerald-200' : 'text-emerald-700', border: theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-200' },
                    sky: { bg: theme === 'dark' ? 'bg-sky-500/10' : 'bg-sky-50', text: theme === 'dark' ? 'text-sky-200' : 'text-sky-700', border: theme === 'dark' ? 'border-sky-500/30' : 'border-sky-200' },
                    amber: { bg: theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50', text: theme === 'dark' ? 'text-amber-200' : 'text-amber-700', border: theme === 'dark' ? 'border-amber-500/30' : 'border-amber-200' },
                    slate: { bg: theme === 'dark' ? 'bg-gray-500/10' : 'bg-gray-50', text: theme === 'dark' ? 'text-gray-200' : 'text-gray-700', border: theme === 'dark' ? 'border-gray-500/30' : 'border-gray-200' },
                  }
                  const tone = toneMap[card.tone]
                  return (
                    <div key={card.label} className={`p-3 sm:p-4 rounded-xl border ${tone.border} ${tone.bg} space-y-2`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold uppercase ${tone.text}`}>{card.label}</span>
                        <span className={tone.text}>{card.icon}</span>
                      </div>
                      <p className={`text-2xl font-extrabold ${headingColor}`}>{card.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {user && (
              <div className="mt-4 flex flex-wrap gap-2">
                <div className={`px-3 py-2 rounded-lg text-xs font-semibold border ${theme === 'dark' ? 'border-white/10 text-white bg-white/5' : 'border-gray-200 text-gray-800 bg-white'}`}>
                  Мои задачи: {myTasksCount}
                </div>
                <RouterLink
                  to="/profile"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border ${theme === 'dark' ? 'border-white/10 text-white bg-white/5 hover:border-[#4E6E49]/50' : 'border-gray-200 text-gray-800 bg-white hover:border-[#4E6E49]/50 hover:text-[#4E6E49]'}`}
                >
                  Перейти в ЛК
                </RouterLink>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6" id="tasks-board">
          {/* Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <TaskFilters
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
              selectedUsers={selectedUsers}
              onCategoryChange={setSelectedCategory}
              onStatusChange={setSelectedStatus}
              onUsersChange={setSelectedUsers}
              onClear={handleClearFilters}
            />
          </div>

          {/* Tasks List/Kanban */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className={`text-xl font-bold ${headingColor}`}>
                Задачи ({filteredTasks.length})
              </h2>
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className={`flex rounded-lg border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'} overflow-hidden`}>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`px-3 py-2 transition-colors ${
                      viewMode === 'kanban'
                        ? 'bg-[#4E6E49] text-white'
                        : theme === 'dark' ? 'bg-[#1a1a1a] text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    title="Kanban доска"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-[#4E6E49] text-white'
                        : theme === 'dark' ? 'bg-[#1a1a1a] text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    title="Список"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#4E6E49] to-emerald-700 hover:from-[#4E6E49] hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Новая задача</span>
                  <span className="sm:hidden">Добавить</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className={`${cardBg} rounded-xl p-8 text-center ${headingColor}`}>
                <div className="animate-pulse">Загрузка...</div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className={`${cardBg} rounded-xl p-8 text-center border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'}`}>
                <CheckSquare className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`text-lg font-medium ${headingColor} mb-2`}>
                  Нет задач
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedCategory !== 'all' || selectedStatus !== 'all' || selectedUsers.length > 0
                    ? 'Попробуйте изменить фильтры'
                    : 'Создайте первую задачу'}
                </p>
              </div>
            ) : viewMode === 'kanban' ? (
              <TaskKanban
                tasks={filteredTasks}
                onUpdate={loadTasks}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onUpdate={loadTasks}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm
            onClose={handleCloseForm}
            onSave={handleSave}
            editingTask={editingTask}
          />
        )}
      </div>
    </Layout>
  )
}

