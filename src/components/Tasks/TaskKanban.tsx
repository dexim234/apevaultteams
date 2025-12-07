// Kanban board component with drag & drop
import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { updateTask } from '@/services/firestoreService'
import { Task, TaskStatus, TASK_STATUSES, TEAM_MEMBERS } from '@/types'
import { AlarmClock, CalendarClock, Check, CheckSquare, Clock3, MoreVertical, RotateCcw, X } from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'
import { TaskDeadlineBadge } from './TaskDeadlineBadge'
import { CATEGORY_ICONS } from './categoryIcons'

interface TaskKanbanProps {
  tasks: Task[]
  onUpdate: () => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export const TaskKanban = ({ tasks, onUpdate, onEdit, onDelete }: TaskKanbanProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [mobileMenuTask, setMobileMenuTask] = useState<Task | null>(null)
  const [rejectDialog, setRejectDialog] = useState<{ task: Task } | null>(null)
  const [rejectionComment, setRejectionComment] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; task: Task } | null>(null)
  const [touchTarget, setTouchTarget] = useState<string | null>(null)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-300'

  const statuses: TaskStatus[] = ['pending', 'in_progress', 'completed', 'closed', 'rejected']

  const resolveAssignees = (task: Task) =>
    task.assignees && task.assignees.length > 0
      ? task.assignees
      : task.assignedTo.map((userId) => ({ userId, priority: 'medium' as const }))

  const resolveAssigneeIds = (task: Task) => resolveAssignees(task).map((assignee) => assignee.userId)

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

  // Touch events for mobile drag & drop
  const handleTouchStart = (e: React.TouchEvent, task: Task) => {
    if (loading || task.status === 'rejected') return
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY, task })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return
    e.preventDefault()
    const touch = e.touches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    if (element) {
      const column = element.closest('[data-status]')
      if (column) {
        const columnStatus = column.getAttribute('data-status')
        if (columnStatus) {
          setTouchTarget(columnStatus)
        }
      }
    }
  }

  const handleTouchEnd = async (e: React.TouchEvent, currentStatus: TaskStatus) => {
    if (!touchStart) return
    
    const touch = e.changedTouches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    
    if (element) {
      const column = element.closest('[data-status]')
      if (column) {
        const targetStatus = column.getAttribute('data-status') as TaskStatus
        if (targetStatus && targetStatus !== currentStatus && touchStart.task.status !== 'rejected') {
          await handleStatusChange(touchStart.task, targetStatus)
        }
      }
    }
    
    setTouchStart(null)
    setTouchTarget(null)
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
        updates.approvals = resolveAssigneeIds(draggedTask).map((userId) => ({
          userId,
          status: 'pending' as const,
          updatedAt: now,
        }))
      }

      await updateTask(draggedTask.id, updates)

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
        updates.approvals = resolveAssigneeIds(task).map((userId) => ({
          userId,
          status: 'pending' as const,
          updatedAt: now,
        }))
      }

      await updateTask(task.id, updates)

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
      const commentValue = action === 'reject' ? (rejectionComment || '').trim() : ''

      const buildApproval = (approval: Task['approvals'][number]) => {
        const base = {
          ...approval,
          status: newStatus,
          updatedAt: now,
        }
        if (commentValue) {
          return { ...base, comment: commentValue }
        }
        const { comment, ...rest } = base
        return rest
      }
      
      const updatedApprovals: Task['approvals'] = task.approvals.map((a) => 
        a.userId === user.id 
          ? buildApproval(a)
          : a
      )

      if (!task.approvals.find(a => a.userId === user.id)) {
        const baseApproval = {
          userId: user.id,
          status: newStatus,
          updatedAt: now,
        }
        updatedApprovals.push(
          commentValue ? { ...baseApproval, comment: commentValue } : baseApproval
        )
      }

      const updates: Partial<Task> = {
        approvals: updatedApprovals,
        updatedAt: now,
      }

      // If rejected, change task status
      if (action === 'reject') {
        updates.status = 'rejected'
      } else if (action === 'approve') {
        // When approving, immediately move to in_progress
        updates.status = 'in_progress'
      }

      await updateTask(task.id, updates)

      onUpdate()
      if (action === 'reject') {
        setRejectDialog(null)
        setRejectionComment('')
      }
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
        approvals: resolveAssigneeIds(task).map((userId) => ({
          userId,
          status: 'pending' as const,
          updatedAt: now,
        })),
        updatedAt: now,
      })

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
      completed: theme === 'dark' ? 'bg-[#4E6E49]/20 border-[#4E6E49]/50' : 'bg-green-50 border-green-200',
      closed: theme === 'dark' ? 'bg-gray-500/20 border-gray-500/50' : 'bg-gray-50 border-gray-200',
      rejected: theme === 'dark' ? 'bg-red-500/20 border-red-500/50' : 'bg-red-50 border-red-200',
    }
    return colorMap[status]
  }

  const getStatusTextColor = (status: TaskStatus) => {
    const colorMap: Record<TaskStatus, string> = {
      pending: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
      in_progress: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
      completed: theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]',
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
    const ids = resolveAssigneeIds(task)
    if (!ids.includes(user.id)) return false
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
              data-status={status}
              className={`flex-shrink-0 w-[280px] sm:w-80 ${cardBg} rounded-xl border-2 ${borderColor} p-3 sm:p-4 ${
                touchTarget === status ? 'border-[#4E6E49]' : ''
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
              onTouchMove={handleTouchMove}
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
                    const overdue = isOverdue(task)
                    const canEdit = isAdmin || user?.id === task.createdBy
                    const canApproveTask = canApprove(task)
                    const canResubmitTask = canResubmit(task)
                    const taskAssignees = resolveAssignees(task)
                    const assigneeDetails = taskAssignees
                      .map((assignee) => {
                        const member = TEAM_MEMBERS.find((m) => m.id === assignee.userId)
                        if (!member) return null
                        return { ...assignee, member }
                      })
                      .filter(Boolean) as { member: (typeof TEAM_MEMBERS)[number]; priority: 'low' | 'medium' | 'high'; comment?: string }[]
                    
                    return (
                      <div
                        key={task.id}
                        draggable={!loading && task.status !== 'rejected'}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) => handleTouchStart(e, task)}
                        onTouchEnd={(e) => handleTouchEnd(e, status)}
                        className={`${cardBg} rounded-lg border-2 ${borderColor} p-2.5 sm:p-3 cursor-move hover:shadow-lg transition-all ${
                          draggedTask?.id === task.id || touchStart?.task.id === task.id ? 'opacity-50' : ''
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
                          {/* Author and Executors */}
                          <div className="space-y-1">
                            <div className={`flex items-center gap-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                              <span className="font-medium">Автор:</span>
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                {TEAM_MEMBERS.find(m => m.id === task.createdBy)?.name || 'Неизвестно'}
                              </span>
                            </div>
                          <div className="flex flex-col gap-1">
                            <div className={`flex items-center gap-1 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>
                              <span className="font-medium">Исполнители:</span>
                            </div>
                            {assigneeDetails.length > 0 ? (
                              assigneeDetails.map((assignee) => (
                                <div key={assignee.member.id} className={`text-[11px] sm:text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} flex flex-wrap gap-1`}>
                                  <span className="font-medium">{assignee.member.name}</span>
                                  <span>•</span>
                                  <span>
                                    {assignee.priority === 'high' ? 'Высокий' : assignee.priority === 'medium' ? 'Средний' : 'Низкий'}
                                  </span>
                                  {assignee.comment && (
                                    <>
                                      <span>•</span>
                                      <span className="truncate max-w-[140px] sm:max-w-[180px]">{assignee.comment}</span>
                                    </>
                                  )}
                                </div>
                              ))
                            ) : (
                              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>Не назначены</span>
                            )}
                          </div>
                          </div>
                          <div className={`flex items-center gap-2 flex-wrap ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.startTime && (
                              <span className="inline-flex items-center gap-1">
                                <AlarmClock className="w-3.5 h-3.5" />
                                {task.startTime}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <CalendarClock className="w-3.5 h-3.5" />
                              {formatDate(new Date(task.dueDate), 'dd.MM.yyyy')}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="w-3.5 h-3.5" />
                              {task.dueTime}
                            </span>
                            <TaskDeadlineBadge dueDate={task.dueDate} dueTime={task.dueTime} theme={theme} size="compact" />
                          </div>
                          {task.description && (
                            <p className={`line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-1.5 py-0.5 rounded text-xs inline-flex items-center gap-1 ${getStatusColor(status)} ${getStatusTextColor(status)}`}>
                              {(() => {
                                const Icon = CATEGORY_ICONS[task.category]
                                return <Icon className="w-3.5 h-3.5" />
                              })()}
                            </span>
                          </div>
                        </div>

                        {/* Approval/Reject Buttons */}
                        {canApproveTask && (
                          <div className={`flex gap-2 mt-2 pt-2 border-t ${borderColor}`}>
                            <button
                              onClick={() => handleApprove(task, 'approve')}
                              className="flex-1 px-2 py-1.5 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Согласовать
                            </button>
                            <button
                              onClick={() => {
                                setRejectDialog({ task })
                                setRejectionComment('')
                              }}
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

      {/* Reject Dialog */}
      {rejectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-[70] p-4">
          <div className={`${cardBg} rounded-xl p-6 max-w-md w-full border-2 ${borderColor}`}>
            <h3 className={`text-lg font-bold mb-4 ${headingColor}`}>Отклонить задачу</h3>
            <textarea
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              placeholder="Укажите причину отклонения"
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } ${headingColor} mb-4 focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}
            />
            <div className="flex gap-3">
              <button
                onClick={() => rejectDialog.task && handleApprove(rejectDialog.task, 'reject')}
                disabled={loading === rejectDialog.task.id || !rejectionComment.trim()}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
              >
                Отклонить
              </button>
              <button
                onClick={() => {
                  setRejectDialog(null)
                  setRejectionComment('')
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
