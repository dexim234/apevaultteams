// Kanban board component with drag & drop
import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { updateTask, addTaskNotification } from '@/services/firestoreService'
import { Task, TaskStatus, TASK_STATUSES, TEAM_MEMBERS } from '@/types'
import { MoreVertical, CheckSquare } from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'

interface TaskKanbanProps {
  tasks: Task[]
  onUpdate: () => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  getUnreadNotifications: (taskId: string) => number
}

export const TaskKanban = ({ tasks, onUpdate, onEdit, onDelete, getUnreadNotifications }: TaskKanbanProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [mobileMenuTask, setMobileMenuTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300'

  const statuses: TaskStatus[] = ['pending', 'in_progress', 'completed', 'closed']

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault()
    if (!draggedTask || draggedTask.status === targetStatus) {
      setDraggedTask(null)
      return
    }

    setLoading(draggedTask.id)
    try {
      const now = new Date().toISOString()
      const updates: Partial<Task> = {
        status: targetStatus,
        updatedAt: now,
      }

      if (targetStatus === 'completed') {
        updates.completedAt = now
        updates.completedBy = user?.id || 'admin'
      } else if (targetStatus === 'closed') {
        updates.closedAt = now
      } else if (targetStatus === 'in_progress' && draggedTask.status === 'pending') {
        // Only move to in_progress if all approvals are done
        const allApproved = draggedTask.approvals.every(a => a.status === 'approved')
        if (!allApproved) {
          setLoading(null)
          setDraggedTask(null)
          return
        }
      }

      await updateTask(draggedTask.id, updates)

      // Create notifications for status changes
      const hasMultipleParticipants = draggedTask.assignedTo.length > 1
      if (hasMultipleParticipants && targetStatus !== draggedTask.status) {
        const movedBy = user?.name || 'Администратор'
        for (const userId of draggedTask.assignedTo) {
          if (userId !== user?.id) {
            let message = ''
            if (targetStatus === 'in_progress') {
              message = `Задача "${draggedTask.title}" перемещена в работу пользователем ${movedBy}`
            } else if (targetStatus === 'completed') {
              message = `Задача "${draggedTask.title}" выполнена. Подтвердите выполнение.`
            } else if (targetStatus === 'closed') {
              message = `Задача "${draggedTask.title}" закрыта пользователем ${movedBy}`
            }

            if (message) {
              await addTaskNotification({
                userId,
                taskId: draggedTask.id,
                type: targetStatus === 'completed' ? 'task_completion_request' : 'task_moved',
                message,
                read: false,
                createdAt: now,
                movedBy,
              })
            }
          }
        }
      }

      onUpdate()
    } catch (error) {
      console.error('Error updating task status:', error)
    } finally {
      setLoading(null)
      setDraggedTask(null)
    }
  }

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) {
      setMobileMenuTask(null)
      return
    }

    setLoading(task.id)
    try {
      const now = new Date().toISOString()
      const updates: Partial<Task> = {
        status: newStatus,
        updatedAt: now,
      }

      if (newStatus === 'completed') {
        updates.completedAt = now
        updates.completedBy = user?.id || 'admin'
      } else if (newStatus === 'closed') {
        updates.closedAt = now
      } else if (newStatus === 'in_progress' && task.status === 'pending') {
        const allApproved = task.approvals.every(a => a.status === 'approved')
        if (!allApproved) {
          setLoading(null)
          setMobileMenuTask(null)
          return
        }
      }

      await updateTask(task.id, updates)

      const hasMultipleParticipants = task.assignedTo.length > 1
      if (hasMultipleParticipants && newStatus !== task.status) {
        const movedBy = user?.name || 'Администратор'
        for (const userId of task.assignedTo) {
          if (userId !== user?.id) {
            let message = ''
            if (newStatus === 'in_progress') {
              message = `Задача "${task.title}" перемещена в работу пользователем ${movedBy}`
            } else if (newStatus === 'completed') {
              message = `Задача "${task.title}" выполнена. Подтвердите выполнение.`
            } else if (newStatus === 'closed') {
              message = `Задача "${task.title}" закрыта пользователем ${movedBy}`
            }

            if (message) {
              await addTaskNotification({
                userId,
                taskId: task.id,
                type: newStatus === 'completed' ? 'task_completion_request' : 'task_moved',
                message,
                read: false,
                createdAt: now,
                movedBy,
              })
            }
          }
        }
      }

      onUpdate()
    } catch (error) {
      console.error('Error updating task status:', error)
    } finally {
      setLoading(null)
      setMobileMenuTask(null)
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    const colorMap: Record<TaskStatus, string> = {
      pending: theme === 'dark' ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-yellow-50 border-yellow-200',
      in_progress: theme === 'dark' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-blue-50 border-blue-200',
      completed: theme === 'dark' ? 'bg-green-500/20 border-green-500/50' : 'bg-green-50 border-green-200',
      closed: theme === 'dark' ? 'bg-gray-500/20 border-gray-500/50' : 'bg-gray-50 border-gray-200',
    }
    return colorMap[status]
  }

  const getStatusTextColor = (status: TaskStatus) => {
    const colorMap: Record<TaskStatus, string> = {
      pending: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
      in_progress: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
      completed: theme === 'dark' ? 'text-green-400' : 'text-green-700',
      closed: theme === 'dark' ? 'text-gray-400' : 'text-gray-700',
    }
    return colorMap[status]
  }

  const isOverdue = (task: Task) => {
    const now = new Date()
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`)
    return dueDateTime < now && task.status !== 'completed' && task.status !== 'closed'
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {statuses.map((status) => {
          const statusTasks = getTasksByStatus(status)
          const statusInfo = TASK_STATUSES[status]
          
          return (
            <div
              key={status}
              className={`flex-shrink-0 w-80 ${cardBg} rounded-xl border-2 ${borderColor} p-4`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column Header */}
              <div className={`mb-4 pb-3 border-b ${borderColor}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold ${getStatusTextColor(status)}`}>
                    {statusInfo.label}
                  </h3>
                  <span className={`px-2 py-1 rounded-lg text-sm font-medium ${getStatusColor(status)} ${getStatusTextColor(status)}`}>
                    {statusTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                {statusTasks.map((task) => {
                  const unreadCount = getUnreadNotifications(task.id)
                  const overdue = isOverdue(task)
                  const canEdit = isAdmin || user?.id === task.createdBy
                  
                  return (
                    <div
                      key={task.id}
                      draggable={!loading}
                      onDragStart={(e) => handleDragStart(e, task)}
                      className={`${cardBg} rounded-lg border-2 ${borderColor} p-3 cursor-move hover:shadow-lg transition-all ${
                        draggedTask?.id === task.id ? 'opacity-50' : ''
                      } ${overdue ? 'border-red-500' : ''} ${loading === task.id ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className={`font-semibold text-sm ${headingColor} flex-1`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {unreadCount > 0 && (
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                          )}
                          {/* Mobile Menu */}
                          <div className="relative lg:hidden">
                            <button
                              onClick={() => setMobileMenuTask(mobileMenuTask?.id === task.id ? null : task)}
                              className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {mobileMenuTask?.id === task.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setMobileMenuTask(null)}
                                />
                                <div className={`absolute right-0 top-8 z-50 ${cardBg} rounded-lg shadow-xl border-2 ${borderColor} min-w-[200px]`}>
                                  <div className="p-2">
                                    <div className={`text-xs font-medium mb-2 px-2 py-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Изменить статус:
                                    </div>
                                    {statuses.map((s) => (
                                      <button
                                        key={s}
                                        onClick={() => handleStatusChange(task, s)}
                                        disabled={task.status === s || loading === task.id}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                                          task.status === s
                                            ? getStatusColor(s)
                                            : theme === 'dark'
                                            ? 'hover:bg-gray-700'
                                            : 'hover:bg-gray-100'
                                        } ${task.status === s ? getStatusTextColor(s) : headingColor} disabled:opacity-50`}
                                      >
                                        {TASK_STATUSES[s].label}
                                      </button>
                                    ))}
                                    {canEdit && (
                                      <>
                                        <div className={`border-t ${borderColor} my-2`} />
                                        <button
                                          onClick={() => {
                                            setMobileMenuTask(null)
                                            onEdit(task)
                                          }}
                                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                                            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                          } ${headingColor}`}
                                        >
                                          Редактировать
                                        </button>
                                        <button
                                          onClick={() => {
                                            setMobileMenuTask(null)
                                            onDelete(task.id)
                                          }}
                                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                            theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'
                                          }`}
                                        >
                                          Удалить
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Task Info */}
                      <div className="space-y-1 text-xs">
                        <div className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span>📅 {formatDate(new Date(task.dueDate), 'dd.MM.yyyy')}</span>
                          <span>🕐 {task.dueTime}</span>
                          {overdue && (
                            <span className="text-red-500 font-semibold ml-1">⚠️ Просрочено</span>
                          )}
                        </div>
                        {task.description && (
                          <p className={`line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(status)} ${getStatusTextColor(status)}`}>
                            {task.category === 'trading' ? '📈' : task.category === 'learning' ? '📚' : task.category === 'technical' ? '⚙️' : task.category === 'stream' ? '📺' : task.category === 'research' ? '🔬' : '📋'}
                          </span>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            👥 {task.assignedTo.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {statusTasks.length === 0 && (
                  <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Нет задач</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

