// Tasks page - task manager
// Tasks page - task manager
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { TaskForm } from '@/components/Tasks/TaskForm'
import { TaskFilters } from '@/components/Tasks/TaskFilters'
import { TaskTable } from '@/components/Tasks/TaskTable'
import { getTasks, deleteTask } from '@/services/firestoreService'
import { Task, TaskCategory, TaskStatus } from '@/types'
import { CheckSquare, LayoutGrid, Plus, Calendar, Zap, Layers, CheckCircle2, Archive, Timer } from 'lucide-react'
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

  const StatCard = ({ title, value, sub, icon: Icon, colorClass }: any) => (
    <div className={`relative overflow-hidden rounded-xl p-6 ${theme === 'dark' ? 'bg-[#151a21]/50 border-white/5' : 'bg-white border-gray-100'} border shadow-sm transition-all hover:-translate-y-1 duration-300`}>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-2">
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</span>
          {Icon && <Icon className={`w-5 h-5 ${colorClass}`} />}
        </div>
        <div>
          <div className={`text-3xl font-black tracking-tight ${headingColor}`}>{value}</div>
          {sub && <div className={`text-xs mt-1 font-medium ${colorClass}`}>{sub}</div>}
        </div>
      </div>
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-5 ${colorClass.replace('text-', 'bg-')}`} />
    </div>
  )

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-[#4E6E49]/20' : 'bg-green-100'}`}>
          <CheckSquare className="w-8 h-8 text-[#4E6E49]" />
        </div>
        <div>
          <h1 className={`text-3xl font-black ${headingColor} flex items-center gap-3`}>
            AVF Tasks <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-xs rounded-lg font-bold uppercase">Beta</span>
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            Управление задачами и заданиями команды ApeVault Frontier
          </p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {user && (
            <div className="text-right hidden sm:block">
              <div className={`text-sm font-bold ${headingColor}`}>{user.name}</div>
              <div className="text-xs text-[#4E6E49]">{user.role === 'admin' ? 'Admin User' : 'Team Member'}</div>
            </div>
          )}
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Всего задач сегодня"
          value={stats.totalToday}
          sub="↗ Активность ↑"
          icon={Calendar}
          colorClass="text-blue-400"
        />
        <StatCard
          title="Всего на неделе"
          value={stats.totalWeek}
          sub=""
          icon={LayoutGrid}
          colorClass="text-purple-400"
        />
        <StatCard
          title="Всего в месяце"
          value={stats.totalMonth}
          sub=""
          icon={Layers}
          colorClass="text-indigo-400"
        />
        <StatCard
          title="Задач в работе"
          value={stats.inProgress}
          sub="Требуют внимания"
          icon={Zap}
          colorClass="text-yellow-400"
        />

        {/* Second Row */}
        <StatCard
          title="Закрыто сегодня"
          value={stats.completedToday}
          sub="______"
          icon={CheckCircle2}
          colorClass="text-emerald-400"
        />
        <StatCard
          title="Закрыто на неделе"
          value={stats.completedWeek}
          sub=""
          icon={CheckCircle2}
          colorClass="text-emerald-500"
        />
        <StatCard
          title="Закрыто в месяце"
          value={stats.closedMonth}
          sub=""
          icon={Archive}
          colorClass="text-emerald-600"
        />
        <div className={`relative overflow-hidden rounded-xl p-6 border transition-all ${theme === 'dark' ? 'bg-[#1a1a1a] border-red-500/20' : 'bg-red-50 border-red-200'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-red-800'}`}>Ближайший дедлайн</span>
            <Timer className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className={`text-xl font-bold ${headingColor}`}>
              {upcomingTask ? (
                <>
                  {upcomingTask.dueDate === todayStr ? 'Сегодня' : formatDate(new Date(upcomingTask.dueDate), 'd MMM')}
                  {upcomingTask.dueTime && `, ${upcomingTask.dueTime}`}
                </>
              ) : 'Нет'}
            </div>
            <div className="text-xs mt-1 text-red-400 truncate max-w-full">
              {upcomingTask ? upcomingTask.title : 'Все сроки соблюдены'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-bold ${headingColor}`}>Мои задачи <span className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 text-xs ml-2">{stats.inProgress} активных</span></h2>
        </div>

        <div className={`rounded-2xl border ${theme === 'dark' ? 'bg-[#0f1216] border-white/5' : 'bg-gray-50 border-gray-200'} p-4 sm:p-6`}>
          {/* Action Bar */}
          <div className="mb-6">
            <TaskFilters
              selectedCategory={selectedCategory}
              selectedStatus={selectedStatus}
              selectedUsers={selectedUsers}
              onCategoryChange={setSelectedCategory}
              onStatusChange={setSelectedStatus}
              onUsersChange={setSelectedUsers}
            >
              <button
                onClick={() => setShowForm(true)}
                className="whitespace-nowrap flex items-center gap-2 px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl transition-transform active:scale-95 shadow-lg shadow-emerald-900/20 ml-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Новая задача</span>
              </button>
            </TaskFilters>
          </div>

          {/* Table */}
          {loading ? (
            <div className="py-20 text-center text-gray-500">Загрузка задач...</div>
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

