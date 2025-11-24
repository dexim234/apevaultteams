// Kanban board component with drag & drop
import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { updateTask, addTaskNotification } from '@/services/firestoreService'
import { Task, TaskStatus, TASK_STATUSES } from '@/types'
import { MoreVertical, CheckSquare, Check, X, RotateCcw } from 'lucide-react'
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
  const [approvalDialog, setApprovalDialog] = useState<{ task: Task; action: 'approve' | 'reject' } | null>(null)
  const [approvalComment, setApprovalComment] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300'

  const statuses: TaskStatus[] = ['pending', 'in_progress', 'completed', 'closed', 'rejected']

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    if (loading) {
      e.preventDefault()
      return
    }
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
  }

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedTask || draggedTask.status === targetStatus || loading) {
      setDraggedTask(null)
      return
    }

    // Don't allow dropping rejected tasks directly
    if (draggedTask.status === 'rejected' && targetStatus !== 'pending') {
      setDraggedTask(null)
      return
    }

    // Don't allow moving to rejected via drag & drop
    if (targetStatus === 'rejected') {
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
        const allApproved = draggedTask.approvals.every(a => a.status === 'approved')
        if (!allApproved) {
          setLoading(null)
          setDraggedTask(null)
          return
        }
      } else if (targetStatus === 'pending' && draggedTask.status === 'rejected') {
        // Reset approvals when resubmitting rejected task
        updates.approvals = draggedTask.assignedTo.map((userId) => ({
          userId,
          status: 'pending' as const,
          updatedAt: now,
        }))
      }

      await updateTask(draggedTask.id, updates)

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
            } else if (targetStatus === 'pending' && draggedTask.status === 'rejected') {
              message = `Задача "${draggedTask.title}" отправлена на повторное согласование`
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
    if (task.status === newStatus || loading === task.id) {
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
      } else if (newStatus === 'pending' && task.status === 'rejected') {
        updates.approvals = task.assignedTo.map((userId) => ({
          userId,
          status: 'pending' as const,
          updatedAt: now,
        }))
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
            } else if (newStatus === 'pending' && task.status === 'rejected') {
              message = `Задача "${task.title}" отправлена на повторное согласование`
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
      setMobileMenuTask(null)
    } catch (error) {
      console.error('Error updating task status:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleApprove = async (task: Task, action: 'approve' | 'reject') => {
    if (!user) return
    
    setLoading(task.id)
    try {
      const now = new Date().toISOString()
      const newStatus: 'approved' | 'rejected' = action === 'approve' ? 'approved' : 'rejected'
      
      const updatedApprovals: Task['approvals'] = task.approvals.map(a => 
        a.userId === user.id 
          ? { ...a, status: newStatus, comment: approvalComment || undefined, updatedAt: now }
          : a
      )

      if (!task.approvals.find(a => a.userId === user.id)) {
        updatedApprovals.push({
          userId: user.id,
          status: newStatus,
          comment: approvalComment || undefined,
          updatedAt: now,
        })
      }

      const updates: Partial<Task> = {
        approvals: updatedApprovals,
        updatedAt: now,
      }

      // If rejected, change task status
      if (action === 'reject') {
        updates.status = 'rejected'
      } else {
        // If all approved, automatically move to in_progress
        const allNowApproved = updatedApprovals.every(a => a.status === 'approved')
        if (allNowApproved) {
          updates.status = 'in_progress'
        }
      }

      await updateTask(task.id, updates)

      // Create notifications
      if (action === 'reject' && task.assignedTo.length > 1) {
        const rejectedBy = user.name || 'Пользователь'
        for (const userId of task.assignedTo) {
          if (userId !== user.id && userId === task.createdBy) {
            await addTaskNotification({
              userId,
              taskId: task.id,
              type: 'task_moved',
              message: `Задача "${task.title}" отклонена пользователем ${rejectedBy}. ${approvalComment || ''}`,
              read: false,
              createdAt: now,
              movedBy: rejectedBy,
            })
          }
        }
      }

      onUpdate()
      setApprovalDialog(null)
      setApprovalComment('')
    } catch (error) {
      console.error('Error approving task:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleResubmit = async (task: Task) => {
    if (!user || task.createdBy !== user.id) return
    
    setLoading(task.id)
    try {
      const now = new Date().toISOString()
      await updateTask(task.id, {
        status: 'pending',
        approvals: task.assignedTo.map((userId) => ({
          userId,
          status: 'pending' as const,
          updatedAt: now,
        })),
        updatedAt: now,
      })

      // Notify assigned users
      for (const userId of task.assignedTo) {
        await addTaskNotification({
          userId,
          taskId: task.id,
          type: 'task_added',
          message: `Задача "${task.title}" отправлена на повторное согласование`,
          read: false,
          createdAt: now,
        })
      }

      onUpdate()
    } catch (error) {
      console.error('Error resubmitting task:', error)
    } finally {
      setLoading(null)
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    const colorMap: Record<TaskStatus, string> = {
      pending: theme === 'dark' ? 'bg-yellow-500/20 border-yellow-500/50' : 'bg-yellow-50 border-yellow-200',
      in_progress: theme === 'dark' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-blue-50 border-blue-200',
      completed: theme === 'dark' ? 'bg-green-500/20 border-green-500/50' : 'bg-green-50 border-green-200',
      closed: theme === 'dark' ? 'bg-gray-500/20 border-gray-500/50' : 'bg-gray-50 border-gray-200',
      rejected: theme === 'dark' ? 'bg-red-500/20 border-red-500/50' : 'bg-red-50 border-red-200',
    }
    return colorMap[status]
  }

  const getStatusTextColor = (status: TaskStatus) => {
    const colorMap: Record<TaskStatus, string> = {
      pending: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
      in_progress: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
      completed: theme === 'dark' ? 'text-green-400' : 'text-green-700',
      closed: theme === 'dark' ? 'text-gray-400' : 'text-gray-700',
      rejected: theme === 'dark' ? 'text-red-400' : 'text-red-700',
    }
    return colorMap[status]
  }

  const isOverdue = (task: Task) => {
    const now = new Date()
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`)
    return dueDateTime < now && task.status !== 'completed' && task.status !== 'closed' && task.status !== 'rejected'
  }

  const canApprove = (task: Task) => {
    if (task.status !== 'pending') return false
    if (!user) return false
    if (!task.assignedTo.includes(user.id)) return false
    const userApproval = task.approvals.find(a => a.userId === user.id)
    return !userApproval || userApproval.status === 'pending'
  }

  const canResubmit = (task: Task) => {
    if (task.status !== 'rejected') return false
    if (!user) return false
    return task.createdBy === user.id || isAdmin
  }

  return (
    <>
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-3 sm:gap-4 min-w-max">
          {statuses.map((status) => {
            const statusTasks = getTasksByStatus(status)
            const statusInfo = TASK_STATUSES[status]
            
            return (
              <div
                key={status}
                className={`flex-shrink-0 w-[280px] sm:w-80 ${cardBg} rounded-xl border-2 ${borderColor} p-3 sm:p-4`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                {/* Column Header */}
                <div className={`mb-3 sm:mb-4 pb-2 sm:pb-3 border-b ${borderColor}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base sm:text-lg font-bold ${getStatusTextColor(status)}`}>
                      {statusInfo.label}
                    </h3>
                    <span className={`px-2 py-1 rounded-lg text-xs sm:text-sm font-medium ${getStatusColor(status)} ${getStatusTextColor(status)}`}>
                      {statusTasks.length}
                    </span>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-2 sm:space-y-3 max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-300px)] overflow-y-auto">
                  {statusTasks.map((task) => {
                    const unreadCount = getUnreadNotifications(task.id)
                    const overdue = isOverdue(task)
                    const canEdit = isAdmin || user?.id === task.createdBy
                    const canApproveTask = canApprove(task)
                    const canResubmitTask = canResubmit(task)
                    const userApproval = task.approvals.find(a => a.userId === user?.id)
                    
                    return (
                      <div
                        key={task.id}
                        draggable={!loading && task.status !== 'rejected'}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className={`${cardBg} rounded-lg border-2 ${borderColor} p-2.5 sm:p-3 cursor-move hover:shadow-lg transition-all ${
                          draggedTask?.id === task.id ? 'opacity-50' : ''
                        } ${overdue ? 'border-red-500' : ''} ${loading === task.id ? 'opacity-50 pointer-events-none' : ''} ${
                          task.status === 'rejected' ? 'opacity-75' : ''
                        }`}
                      >
                        {/* Task Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className={`font-semibold text-xs sm:text-sm ${headingColor} flex-1`}>
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
                                      {statuses.filter(s => s !== 'rejected' || task.status === 'rejected').map((s) => (
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
                        <div className="space-y-1.5 text-xs mb-2">
                          <div className={`flex items-center gap-1 flex-wrap ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
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
                            <span className={`px-1.5 py-0.5 rounded text-xs ${getStatusColor(status)} ${getStatusTextColor(status)}`}>
                              {task.category === 'trading' ? '📈' : task.category === 'learning' ? '📚' : task.category === 'technical' ? '⚙️' : task.category === 'stream' ? '📺' : task.category === 'research' ? '🔬' : task.category === 'organization' ? '📋' : '📋'}
                            </span>
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                              👥 {task.assignedTo.length}
                            </span>
                          </div>
                        </div>

                        {/* Approval/Reject Buttons */}
                        {canApproveTask && (
                          <div className={`flex gap-2 mt-2 pt-2 border-t ${borderColor}`}>
                            <button
                              onClick={() => setApprovalDialog({ task, action: 'approve' })}
                              className="flex-1 px-2 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Согласовать
                            </button>
                            <button
                              onClick={() => setApprovalDialog({ task, action: 'reject' })}
                              className="flex-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <X className="w-3 h-3" />
                              Отклонить
                            </button>
                          </div>
                        )}

                        {/* Resubmit Button */}
                        {canResubmitTask && (
                          <div className={`mt-2 pt-2 border-t ${borderColor}`}>
                            <button
                              onClick={() => handleResubmit(task)}
                              disabled={loading === task.id}
                              className="w-full px-2 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Отправить на согласование
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {statusTasks.length === 0 && (
                    <div className={`text-center py-6 sm:py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      <CheckSquare className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs sm:text-sm">Нет задач</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Approval Dialog */}
      {approvalDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-xl p-6 max-w-md w-full border-2 ${borderColor}`}>
            <h3 className={`text-lg font-bold mb-4 ${headingColor}`}>
              {approvalDialog.action === 'approve' ? 'Согласовать задачу' : 'Отклонить задачу'}
            </h3>
            <textarea
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              placeholder={approvalDialog.action === 'approve' ? 'Комментарий (необязательно)' : 'Укажите причину отклонения'}
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } ${headingColor} mb-4 focus:outline-none focus:ring-2 focus:ring-green-500/50`}
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(approvalDialog.task, approvalDialog.action)}
                disabled={loading === approvalDialog.task.id || (approvalDialog.action === 'reject' && !approvalComment.trim())}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  approvalDialog.action === 'approve'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } disabled:opacity-50`}
              >
                {approvalDialog.action === 'approve' ? 'Согласовать' : 'Отклонить'}
              </button>
              <button
                onClick={() => {
                  setApprovalDialog(null)
                  setApprovalComment('')
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
