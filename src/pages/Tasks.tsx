import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { TaskForm } from '@/components/Tasks/TaskForm'
import { TaskFilters } from '@/components/Tasks/TaskFilters'
import { TaskTable } from '@/components/Tasks/TaskTable'
import { getTasks, deleteTask } from '@/services/firestoreService'
import { Task, TaskCategory, TaskStatus } from '@/types'
import { CheckSquare, LayoutGrid, Calendar, Zap, Layers, CheckCircle2, Archive, Timer } from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'
import { useAccessControl } from '@/hooks/useAccessControl'
import { Lock } from 'lucide-react'

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

  const pageAccess = useAccessControl('avf_tasks')
  const addTaskAccess = useAccessControl('tasks_add')

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

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

  const filteredTasks = tasks.filter(task => {
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false
    if (selectedStatus !== 'all' && task.status !== selectedStatus) return false
    if (selectedUsers.length > 0 && !selectedUsers.some((userId) => task.assignedTo.includes(userId))) return false
    return true
  })

  // Stats derivation
  const now = new Date()
  const todayStr = formatDate(now, 'yyyy-MM-dd')
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const stats = {
    totalToday: tasks.filter(t => t.createdAt.startsWith(todayStr)).length,
    totalWeek: tasks.filter(t => new Date(t.createdAt) >= oneWeekAgo).length,
    totalMonth: tasks.filter(t => new Date(t.createdAt) >= oneMonthAgo).length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completedToday: tasks.filter(t => t.status === 'completed' && t.completedAt?.startsWith(todayStr)).length,
    completedWeek: tasks.filter(t => t.status === 'completed' && t.completedAt && new Date(t.completedAt) >= oneWeekAgo).length,
    closedMonth: tasks.filter(t => t.status === 'closed' && new Date(t.createdAt) >= oneMonthAgo).length // Using createdAt as proxy if closedAt missing
  }

  const upcomingTask = tasks
    .filter(t => t.status !== 'completed' && t.status !== 'closed' && t.dueDate)
    .sort((a, b) => new Date(`${a.dueDate}T${a.dueTime}`).getTime() - new Date(`${b.dueDate}T${b.dueTime}`).getTime())[0]

  if (pageAccess.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!pageAccess.hasAccess) {
    return (
      <div className="py-20 text-center space-y-4">
        <Lock className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
        <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Доступ к Tasks ограничен</h3>
        <p className="text-gray-500 max-w-md mx-auto">{pageAccess.reason || 'У вас нет доступа к управлению задачами.'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckSquare className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h1 className={`text-3xl font-black ${headingColor} flex items-center gap-3`}>
              AVF Tasks
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
              Управление задачами и заданиями команды ApeVault Frontier
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {/* User profile removed as requested */}
        </div>
      </div>

      {/* Stats Grid - Schedule Card Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Row 1 */}
        <div
          className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
            ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50'
            : 'bg-white border-gray-100 hover:border-emerald-500/20'
            }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Всего задач сегодня
            </span>
            <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-black tracking-tight ${headingColor}`}>{stats.totalToday}</div>
            <div className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 w-fit px-2 py-0.5 rounded-full border border-emerald-500/20">
              ↗ Активность ↑
            </div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
            ? 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/50'
            : 'bg-white border-gray-100 hover:border-blue-500/20'
            }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Всего на неделе
            </span>
            <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
              <LayoutGrid className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-black tracking-tight ${headingColor}`}>{stats.totalWeek}</div>
            <div className={`text-[11px] font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Общий объем
            </div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
            ? 'bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/50'
            : 'bg-white border-gray-100 hover:border-indigo-500/20'
            }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Всего в месяце
            </span>
            <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-black tracking-tight ${headingColor}`}>{stats.totalMonth}</div>
            <div className={`text-[11px] font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Накопительный итог
            </div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
            ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/50'
            : 'bg-white border-gray-100 hover:border-amber-500/20'
            }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Задач в работе
            </span>
            <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-black tracking-tight ${headingColor}`}>{stats.inProgress}</div>
            <div className="text-[11px] font-medium text-amber-400 bg-amber-500/10 w-fit px-2 py-0.5 rounded-full border border-amber-500/20">
              Требуют внимания
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div
          className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
            ? 'bg-teal-500/5 border-teal-500/20 hover:border-teal-500/50'
            : 'bg-white border-gray-100 hover:border-teal-500/20'
            }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Закрыто сегодня
            </span>
            <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div className="space-y-2">
            <div className={`text-2xl font-black tracking-tight ${headingColor}`}>{stats.completedToday}</div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
            ? 'bg-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/50'
            : 'bg-white border-gray-100 hover:border-cyan-500/20'
            }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Закрыто на неделе
            </span>
            <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="space-y-2">
            <div className={`text-2xl font-black tracking-tight ${headingColor}`}>{stats.completedWeek}</div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
            ? 'bg-sky-500/5 border-sky-500/20 hover:border-sky-500/50'
            : 'bg-white border-gray-100 hover:border-sky-500/20'
            }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Закрыто в месяце
            </span>
            <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
              <Archive className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div className="space-y-2">
            <div className={`text-2xl font-black tracking-tight ${headingColor}`}>{stats.closedMonth}</div>
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg group ${theme === 'dark'
            ? 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/50'
            : 'bg-white border-gray-100 hover:border-rose-500/20'
            }`}
        >
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Ближайший дедлайн
            </span>
            <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 group-hover:bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
              <Timer className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-black tracking-tight ${headingColor}`}>
              {upcomingTask ? (
                <>
                  {upcomingTask.dueDate === todayStr ? 'Сегодня' : formatDate(new Date(upcomingTask.dueDate), 'd MMM')}
                  {upcomingTask.dueTime && `, ${upcomingTask.dueTime}`}
                </>
              ) : 'Нет'}
            </div>
            <div className={`text-[11px] font-medium truncate ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {upcomingTask ? upcomingTask.title : 'Все сроки соблюдены'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className={`text-2xl font-black ${headingColor}`}>Мои задачи</h2>
          <span className="px-2.5 py-1 rounded-md bg-gray-800/80 text-gray-400 text-xs font-medium border border-white/5 shadow-sm">{stats.inProgress} активных</span>
        </div>

        <div className={`rounded-3xl border p-4 sm:p-6 ${theme === 'dark' ? 'bg-[#0f1216] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
          {/* Filters & Action Bar */}
          <div className="mb-6">
            <TaskFilters
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
              selectedUsers={selectedUsers}
              onCategoryChange={setSelectedCategory}
              onStatusChange={setSelectedStatus}
              onUsersChange={setSelectedUsers}
              onAddTask={addTaskAccess.hasAccess ? () => setShowForm(true) : undefined}
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-20 text-center text-gray-500 animate-pulse">Загрузка задач...</div>
          ) : (
            <TaskTable
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

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
