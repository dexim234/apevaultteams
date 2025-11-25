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
import { Plus, CheckSquare, Sparkles, List, LayoutGrid } from 'lucide-react'

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
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'

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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark' 
            ? 'border-green-500/30 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900' 
            : 'border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white'
        } relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-tr from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl -ml-12 sm:-ml-24 -mb-12 sm:-mb-24" />
          
          <div className="relative z-10">
            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <CheckSquare className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${headingColor} flex items-center gap-2`}>
                    Задачи
                    <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </h1>
                </div>
                <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Управление задачами и заданиями команды
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className={`text-xs sm:text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'
                }`}>
                  На согласовании
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${headingColor}`}>
                  {stats.pending}
                </div>
              </div>
              <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className={`text-xs sm:text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                }`}>
                  В работе
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${headingColor}`}>
                  {stats.inProgress}
                </div>
              </div>
              <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className={`text-xs sm:text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-700'
                }`}>
                  Выполнена
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${headingColor}`}>
                  {stats.completed}
                </div>
              </div>
              <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                theme === 'dark'
                  ? 'bg-gray-500/10 border-gray-500/30'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className={`text-xs sm:text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  Закрыта
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${headingColor}`}>
                  {stats.closed}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
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
                <div className={`flex rounded-lg border-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} overflow-hidden`}>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`px-3 py-2 transition-colors ${
                      viewMode === 'kanban'
                        ? 'bg-green-500 text-white'
                        : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    title="Kanban доска"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 transition-colors ${
                      viewMode === 'list'
                        ? 'bg-green-500 text-white'
                        : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    title="Список"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
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
              <div className={`${cardBg} rounded-xl p-8 text-center border-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
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

