// Tasks page - task manager
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { TaskForm } from '@/components/Tasks/TaskForm'
import { TaskCard } from '@/components/Tasks/TaskCard'
import { TaskFilters } from '@/components/Tasks/TaskFilters'
import { TaskKanban } from '@/components/Tasks/TaskKanban'
import { getTasks, deleteTask } from '@/services/firestoreService'
import { Task, TaskCategory, TaskStatus, TEAM_MEMBERS, TASK_STATUSES } from '@/types'
import { CheckSquare, LayoutGrid, List, Plus, Sparkles } from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'

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
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    closed: tasks.filter(t => t.status === 'closed').length,
  }

  const now = new Date()
  const todayStr = formatDate(now, 'yyyy-MM-dd')
  const weekAgo = new Date(now)
  weekAgo.setDate(now.getDate() - 7)
  const monthAgo = new Date(now)
  monthAgo.setDate(now.getDate() - 30)

  const tasksThisWeek = tasks.filter((t) => new Date(t.createdAt) >= weekAgo).length
  const tasksThisMonth = tasks.filter((t) => new Date(t.createdAt) >= monthAgo).length
  const tasksDoneToday = tasks.filter((t) => t.completedAt && t.completedAt.startsWith(todayStr)).length

  const myRoleTasks = user
    ? tasks.filter(
      (t) =>
        t.mainExecutor === user.id ||
        t.leadExecutor === user.id ||
        (t.assignedTo || []).includes(user.id) ||
        (t.coExecutors || []).includes(user.id)
    )
    : []

  const myTasksCount = myRoleTasks.length
  const totalTasks = tasks.length
  const workRate = totalTasks ? Math.round((stats.inProgress / totalTasks) * 100) : 0

  const topExecutorId = (() => {
    const counter: Record<string, number> = {}
    tasks.forEach((task) => {
      const ids = [
        task.mainExecutor,
        task.leadExecutor,
        ...(task.assignedTo || []),
        ...(task.coExecutors || []),
      ].filter(Boolean) as string[]
      ids.forEach((id) => {
        counter[id] = (counter[id] || 0) + 1
      })
    })
    const sorted = Object.entries(counter).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] || ''
  })()
  const topExecutorName = topExecutorId ? TEAM_MEMBERS.find((m) => m.id === topExecutorId)?.name || topExecutorId : '—'

  const upcomingTask = tasks
    .filter((t) => t.status !== 'completed' && t.status !== 'closed')
    .sort((a, b) => new Date(`${a.dueDate}T${a.dueTime}`).getTime() - new Date(`${b.dueDate}T${b.dueTime}`).getTime())[0]

  const statCards = [
    { label: 'Всего задач на неделе', value: tasksThisWeek, sub: 'последние 7 дней', tone: 'sky' },
    { label: 'Всего задач на месяце', value: tasksThisMonth, sub: 'последние 30 дней', tone: 'emerald' },
    { label: 'Задач в работе', value: stats.inProgress, sub: `${workRate}% от всех`, tone: 'blue' },
    { label: 'Отмечено исполнителями', value: stats.completed, sub: 'ожидают проверки автора', tone: 'amber' },
    { label: 'Самый активный исполнитель', value: topExecutorName, sub: 'по числу назначений', tone: 'purple' },
    { label: 'Закрыто автором', value: stats.closed, sub: 'финально подтверждено', tone: 'slate' },
    { label: 'Ближайший дедлайн', value: upcomingTask ? upcomingTask.title : 'Нет активных', sub: upcomingTask ? `${formatDate(new Date(upcomingTask.dueDate), 'dd.MM.yyyy')} · ${upcomingTask.dueTime}` : 'Свободное окно', tone: 'pink' },
    { label: 'Сделано задач за сегодня', value: tasksDoneToday, sub: todayStr, tone: 'green' },
  ]

  const navItems = [
    { href: '#tasks-board', label: 'Все задачи' },
    { href: '#my-tasks', label: 'Мои задачи', action: () => user && setSelectedUsers([user.id]) },
    { href: '#tasks-stats', label: 'Статистика' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${cardBg} shadow-xl border-2 ${theme === 'dark'
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
                  Task Team
                  <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </h1>
              </div>
              <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Управление задачами и заданиями команды
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => item.action?.()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${theme === 'dark'
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
          <div id="tasks-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statCards.map((card) => {
              const toneMap: Record<string, { bg: string; text: string; border: string }> = {
                emerald: { bg: theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50', text: theme === 'dark' ? 'text-emerald-100' : 'text-emerald-800', border: theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-200' },
                sky: { bg: theme === 'dark' ? 'bg-sky-500/10' : 'bg-sky-50', text: theme === 'dark' ? 'text-sky-100' : 'text-sky-800', border: theme === 'dark' ? 'border-sky-500/30' : 'border-sky-200' },
                amber: { bg: theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50', text: theme === 'dark' ? 'text-amber-100' : 'text-amber-800', border: theme === 'dark' ? 'border-amber-500/30' : 'border-amber-200' },
                blue: { bg: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50', text: theme === 'dark' ? 'text-blue-100' : 'text-blue-800', border: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-200' },
                purple: { bg: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50', text: theme === 'dark' ? 'text-purple-100' : 'text-purple-800', border: theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200' },
                slate: { bg: theme === 'dark' ? 'bg-gray-500/10' : 'bg-gray-50', text: theme === 'dark' ? 'text-gray-100' : 'text-gray-800', border: theme === 'dark' ? 'border-gray-500/30' : 'border-gray-200' },
                pink: { bg: theme === 'dark' ? 'bg-pink-500/10' : 'bg-pink-50', text: theme === 'dark' ? 'text-pink-100' : 'text-pink-800', border: theme === 'dark' ? 'border-pink-500/30' : 'border-pink-200' },
                green: { bg: theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50', text: theme === 'dark' ? 'text-green-100' : 'text-green-800', border: theme === 'dark' ? 'border-green-500/30' : 'border-green-200' },
              }
              const tone = toneMap[card.tone]
              return (
                <div key={card.label} className={`p-4 rounded-xl border ${tone.border} ${tone.bg} shadow-sm space-y-1`}>
                  <p className={`text-xs font-semibold uppercase ${tone.text}`}>{card.label}</p>
                  <p className={`text-2xl font-extrabold ${headingColor} truncate`}>{card.value}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{card.sub}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* My tasks quick view */}
      {user && (
        <div
          id="my-tasks"
          className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${cardBg} border-2 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className={`text-xs uppercase font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Мои задачи
              </p>
              <p className={`text-xl font-bold ${headingColor}`}>{myTasksCount}</p>
            </div>
            <a
              href="#tasks-board"
              className={`px-3 py-2 rounded-lg text-xs font-semibold border ${theme === 'dark'
                ? 'border-white/10 bg-white/5 text-white hover:border-[#4E6E49]/50'
                : 'border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/50 hover:text-[#4E6E49]'
                }`}
            >
              Перейти на доску
            </a>
          </div>
          {myRoleTasks.length === 0 ? (
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Нет назначенных задач</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myRoleTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'}`}
                >
                  <p className={`text-sm font-semibold ${headingColor} truncate`}>{task.title}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatDate(new Date(task.dueDate), 'dd.MM.yyyy')} · {task.dueTime}
                  </p>
                  <p className="text-xs mt-1">
                    <span className={`px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                      {TASK_STATUSES[task.status].label}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                  className={`px-3 py-2 transition-colors ${viewMode === 'kanban'
                    ? 'bg-[#4E6E49] text-white'
                    : theme === 'dark' ? 'bg-[#1a1a1a] text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  title="Kanban доска"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-colors ${viewMode === 'list'
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
  )
}

