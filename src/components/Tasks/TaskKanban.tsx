// Kanban board component with drag & drop
import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { updateTask } from '@/services/firestoreService'
import { Task, TaskPriority, TaskStatus, TASK_STATUSES, TEAM_MEMBERS, TaskApproval, TASK_CATEGORIES } from '@/types'
import { AlarmClock, CalendarClock, Check, CheckSquare, Clock3, MoreVertical, X, AlertCircle } from 'lucide-react'
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
  const [returnDialog, setReturnDialog] = useState<{ task: Task } | null>(null)
  const [returnComment, setReturnComment] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; task: Task } | null>(null)
  const [touchTarget, setTouchTarget] = useState<string | null>(null)
  const [detailsTask, setDetailsTask] = useState<Task | null>(null)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-300'
  const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'

  const statuses: TaskStatus[] = ['in_progress', 'completed', 'closed']

  const resolveAssignees = (task: Task) =>
    task.assignees && task.assignees.length > 0
      ? task.assignees
      : task.assignedTo.map((userId) => ({ userId, priority: 'medium' as const }))

  const resolveAssigneeIds = (task: Task) => resolveAssignees(task).map((assignee) => assignee.userId)

  const getCurrentStage = (task: Task) => {
    if (task.stages && task.stages.length > 0) {
      const targetId = task.awaitingStageId || task.currentStageId || task.stages[0].id
      return task.stages.find((s) => s.id === targetId) || task.stages[0]
    }
    // fallback: single stage from approvals
    return {
      id: 'legacy-stage',
      name: 'Этап',
      responsible: 'all',
      approvals: task.approvals || [],
      status: 'pending',
      comments: [],
    }
  }

  const isAuthor = (task: Task) => !!user && task.createdBy === user.id
  const isMainExecutor = (task: Task) => !!user && task.mainExecutor === user.id
  const isLeadExecutor = (task: Task) =>
    !!user && (task.leadExecutor === user.id || (task.leads || []).includes(user.id))
  const canMoveTask = (task: Task) => isAdmin || isAuthor(task) || isMainExecutor(task) || isLeadExecutor(task)
  const roleTag = (task: Task, userId: string) => {
    if (userId === task.createdBy) return 'A'
    if (userId === task.mainExecutor) return 'ГИ'
    if (userId === task.leadExecutor || (task.leads || []).includes(userId)) return 'ВИ'
    return ''
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    if (loading || !canMoveTask(task)) {
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
    if (loading || !canMoveTask(task)) return
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
        if (targetStatus && targetStatus !== currentStatus) {
          await handleStatusChange(touchStart.task, targetStatus)
        }
      }
    }
    
    setTouchStart(null)
    setTouchTarget(null)
  }

  const resolveExecutorApprovals = (task: Task): TaskApproval[] => {
    const assigneeIds = resolveAssigneeIds(task)
    const now = new Date().toISOString()
    const current = (task.approvals || []).filter((a) => assigneeIds.includes(a.userId))
    const normalized: TaskApproval[] = current.map((a) => ({
      userId: a.userId,
      status: a.status === 'approved' ? 'approved' : 'pending',
      updatedAt: a.updatedAt || now,
      ...(a.comment ? { comment: a.comment } : {}),
    }))
    const missing: TaskApproval[] = assigneeIds
      .filter((id) => !normalized.some((a) => a.userId === id))
      .map((id) => ({ userId: id, status: 'pending', updatedAt: now }))

    return [...normalized, ...missing]
  }

  const getApprovalStats = (task: Task) => {
    const approvals = resolveExecutorApprovals(task)
    const total = resolveAssigneeIds(task).length
    const approved = approvals.filter((a) => a.status === 'approved').length
    return { approvals, approved, total }
  }

  const isExecutor = (task: Task) => !!user && resolveAssigneeIds(task).includes(user.id)
  const canCloseTask = (task: Task) => isAdmin || isAuthor(task)

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedTask || draggedTask.status === targetStatus || loading || !canMoveTask(draggedTask)) {
      setDraggedTask(null)
      return
    }

    const { approvals, approved, total } = getApprovalStats(draggedTask)
    const now = new Date().toISOString()

    if (targetStatus === 'completed' && (total === 0 || approved < total)) {
      setDraggedTask(null)
      return
    }

    if (targetStatus === 'closed' && (!canCloseTask(draggedTask) || draggedTask.status !== 'completed')) {
      setDraggedTask(null)
      return
    }

    const updates: Partial<Task> = {
      status: targetStatus,
      updatedAt: now,
    }

    if (targetStatus === 'completed') {
      updates.completedAt = now
      updates.completedBy = user?.id || 'system'
      updates.approvals = approvals
    } else if (targetStatus === 'closed') {
      updates.closedAt = now
    } else if (targetStatus === 'in_progress') {
      updates.approvals = resolveAssigneeIds(draggedTask).map((id) => ({
        userId: id,
        status: 'pending' as const,
        updatedAt: now,
      }))
      updates.completedAt = undefined
      updates.completedBy = undefined
      updates.closedAt = undefined
    }

    setLoading(draggedTask.id)
    try {
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
    if (task.status === newStatus || loading === task.id || !canMoveTask(task)) {
      setMobileMenuTask(null)
      return
    }

    const { approvals, approved, total } = getApprovalStats(task)
    const now = new Date().toISOString()

    if (newStatus === 'completed' && (total === 0 || approved < total)) {
      setMobileMenuTask(null)
      return
    }
    if (newStatus === 'closed' && (!canCloseTask(task) || task.status !== 'completed')) {
      setMobileMenuTask(null)
      return
    }

    const updates: Partial<Task> = {
      status: newStatus,
      updatedAt: now,
    }

    if (newStatus === 'completed') {
      updates.completedAt = now
      updates.completedBy = user?.id || 'system'
      updates.approvals = approvals
    } else if (newStatus === 'closed') {
      updates.closedAt = now
    } else if (newStatus === 'in_progress') {
      updates.approvals = resolveAssigneeIds(task).map((id) => ({
        userId: id,
        status: 'pending' as const,
        updatedAt: now,
      }))
      updates.completedAt = undefined
      updates.completedBy = undefined
      updates.closedAt = undefined
    }

    setLoading(task.id)
    try {
      await updateTask(task.id, updates)
      onUpdate()
      setMobileMenuTask(null)
    } catch (error) {
      console.error('Error updating task status:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleExecutorConfirm = async (task: Task) => {
    if (!user || task.status !== 'in_progress' || !isExecutor(task)) return
    setLoading(task.id)
    try {
      const now = new Date().toISOString()
      const approvals = resolveExecutorApprovals(task).map((a) =>
        a.userId === user.id
          ? { ...a, status: 'approved' as const, updatedAt: now }
          : a
      )
      const assigneeIds = resolveAssigneeIds(task)
      const allApproved = assigneeIds.length > 0 && assigneeIds.every((id) => approvals.find((a) => a.userId === id && a.status === 'approved'))

      const updates: Partial<Task> = {
        approvals,
        updatedAt: now,
      }

      if (allApproved) {
        updates.status = 'completed'
        updates.completedAt = now
        updates.completedBy = user.id
      }

      await updateTask(task.id, updates)
      onUpdate()
    } catch (error) {
      console.error('Error confirming task:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleMarkClosed = async (task: Task) => {
    if (!canCloseTask(task) || task.status !== 'completed') return
    setLoading(task.id)
    try {
      const now = new Date().toISOString()
      await updateTask(task.id, {
        status: 'closed',
        closedAt: now,
        updatedAt: now,
      })
      onUpdate()
    } catch (error) {
      console.error('Error closing task:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleReturnToWork = async (task: Task, commentText: string) => {
    if (!canCloseTask(task)) return
    const comment = (commentText || '').trim()
    if (!comment) return

    setLoading(task.id)
    try {
      const now = new Date().toISOString()
      const resetApprovals = resolveAssigneeIds(task).map((id) => ({
        userId: id,
        status: 'pending' as const,
        updatedAt: now,
      }))
      const newComment = {
        id: `c-${Date.now()}`,
        userId: user?.id || 'system',
        text: comment,
        createdAt: now,
      }
      await updateTask(task.id, {
        status: 'in_progress',
        approvals: resetApprovals,
        completedAt: undefined,
        completedBy: undefined,
        closedAt: undefined,
        comments: [...(task.comments || []), newComment],
        updatedAt: now,
      })
      onUpdate()
      setReturnDialog(null)
      setReturnComment('')
    } catch (error) {
      console.error('Error returning task to work:', error)
    } finally {
      setLoading(null)
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    const colorMap: Record<TaskStatus, string> = {
      in_progress: theme === 'dark' ? 'bg-blue-500/20 border-blue-500/50' : 'bg-blue-50 border-blue-200',
      completed: theme === 'dark' ? 'bg-[#4E6E49]/20 border-[#4E6E49]/50' : 'bg-green-50 border-green-200',
      closed: theme === 'dark' ? 'bg-gray-500/20 border-gray-500/50' : 'bg-gray-50 border-gray-200',
    }
    return colorMap[status]
  }

  const getStatusTextColor = (status: TaskStatus) => {
    const colorMap: Record<TaskStatus, string> = {
      in_progress: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
      completed: theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]',
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
                    const canEdit = isAdmin || user?.id === task.createdBy || task.mainExecutor === user?.id
                    const currentStage = getCurrentStage(task)
                    const taskAssignees = resolveAssignees(task)
                    const assigneeDetails = taskAssignees
                      .map((assignee) => {
                        const member = TEAM_MEMBERS.find((m) => m.id === assignee.userId)
                        if (!member) return null
                        return { ...assignee, member }
                      })
                      .filter(Boolean) as { member: (typeof TEAM_MEMBERS)[number]; priority: TaskPriority; comment?: string }[]
                    const { approvals, approved, total } = getApprovalStats(task)
                    const userApproval = approvals.find((a) => a.userId === user?.id)
                    const canExecutorConfirm = isExecutor(task) && task.status === 'in_progress' && (!userApproval || userApproval.status !== 'approved')
                    const canCloseCard = canCloseTask(task) && task.status === 'completed'
                    
                    return (
                      <div
                        key={task.id}
                        draggable={!loading && canMoveTask(task)}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) => handleTouchStart(e, task)}
                        onTouchEnd={(e) => handleTouchEnd(e, status)}
                        className={`${cardBg} rounded-lg border-2 ${borderColor} p-2.5 sm:p-3 cursor-move hover:shadow-lg transition-all ${
                          draggedTask?.id === task.id || touchStart?.task.id === task.id ? 'opacity-50' : ''
                        } ${overdue ? 'border-red-500' : ''} ${loading === task.id ? 'opacity-50 pointer-events-none' : ''}`}
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
                                      {statuses.map((s) => (
                                        <button
                                          key={s}
                                          onClick={() => handleStatusChange(task, s)}
                                          disabled={task.status === s || loading === task.id || !canMoveTask(task)}
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
                                              setDetailsTask(task)
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                                              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                            } ${headingColor}`}
                                          >
                                            Всё о задаче
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
                          <div className="flex items-center gap-1">
                            <span className={`font-medium ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>ГИ:</span>
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {task.mainExecutor ? TEAM_MEMBERS.find(m => m.id === task.mainExecutor)?.name || task.mainExecutor : '—'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`font-medium ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>ВИ:</span>
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {task.leadExecutor ? TEAM_MEMBERS.find(m => m.id === task.leadExecutor)?.name || task.leadExecutor : '—'}
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
                          {total > 0 && (
                            <div className={`flex items-center justify-between gap-2 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                              <span className="inline-flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Подтверждения исполнителей
                              </span>
                              <span className="text-[11px] font-semibold">
                                {approved}/{total}
                              </span>
                            </div>
                          )}
                          {task.description && (
                            <p className={`line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {task.description}
                            </p>
                          )}
                          {approvals.length > 0 && (
                            <div className={`mt-1 space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {approvals.map((a) => {
                                const member = TEAM_MEMBERS.find((m) => m.id === a.userId)
                                const statusText = a.status === 'approved' ? 'подтвердил' : 'в ожидании'
                                return (
                                  <div key={a.userId} className="flex items-center justify-between text-[11px]">
                                    <span className="flex items-center gap-1">
                                      <span className="font-medium">
                                        {member?.name || a.userId}
                                        {roleTag(task, a.userId) && (
                                          <span className="ml-1 text-[10px] px-1 rounded bg-gray-200 dark:bg-gray-800">
                                            {roleTag(task, a.userId)}
                                          </span>
                                        )}
                                      </span>
                                      <span className="text-gray-500">({statusText})</span>
                                    </span>
                                    {a.comment && <span className="truncate max-w-[140px] text-gray-500">{a.comment}</span>}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                          {/* Комментарии можно просматривать, но не добавлять */}
                          {(task.comments?.length || currentStage.comments?.length) && (
                            <div className="mt-2 space-y-1">
                              {[
                                ...(task.comments || []),
                                ...(currentStage.comments || []),
                              ].map((c) => {
                                const member = TEAM_MEMBERS.find((m) => m.id === c.userId)
                                return (
                                  <div key={c.id} className={`text-[11px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <span className="font-semibold">{member?.name || c.userId}</span>{' '}
                                    <span className="text-gray-500">{c.stageId ? '(этап)' : '(задача)'}</span>: {c.text}
                                  </div>
                                )
                              })}
                            </div>
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

                        <div className="flex justify-end mt-1">
                          <button
                            onClick={() => setDetailsTask(task)}
                            className={`text-[11px] underline ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} hover:text-[#4E6E49]`}
                          >
                            Всё о задаче
                          </button>
                        </div>

                        {/* Actions */}
                        <div className={`flex flex-col gap-2 mt-2 pt-2 border-t ${borderColor}`}>
                          {canExecutorConfirm && (
                            <button
                              onClick={() => handleExecutorConfirm(task)}
                              disabled={loading === task.id}
                              className="w-full px-2 py-1.5 bg-[#4E6E49] hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                            >
                              <Check className="w-3 h-3" />
                              Подтвердить
                            </button>
                          )}
                          {canCloseCard && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleMarkClosed(task)}
                                disabled={loading === task.id}
                                className="flex-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                              >
                                <Check className="w-3 h-3" />
                                Закрыто
                              </button>
                              <button
                                onClick={() => {
                                  setReturnDialog({ task })
                                  setReturnComment('')
                                }}
                                disabled={loading === task.id}
                                className="flex-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                              >
                                <X className="w-3 h-3" />
                                Не выполнено
                              </button>
                            </div>
                          )}
                          {task.status === 'completed' && !canCloseCard && (
                            <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              Ожидает подтверждения автора
                            </p>
                          )}
                        </div>
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

      {/* Return to work dialog */}
      {returnDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-[70] p-4 overflow-y-auto overscroll-contain modal-scroll">
          <div className={`${cardBg} rounded-xl p-6 max-w-md w-full border-2 ${borderColor}`}>
            <h3 className={`text-lg font-bold mb-4 ${headingColor}`}>Не выполнено</h3>
            <textarea
              value={returnComment}
              onChange={(e) => setReturnComment(e.target.value)}
              placeholder="Опишите, что нужно доработать"
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } ${headingColor} mb-4 focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}
            />
            <div className="flex gap-3">
              <button
                onClick={() => returnDialog.task && handleReturnToWork(returnDialog.task, returnComment)}
                disabled={loading === returnDialog.task.id || !returnComment.trim()}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
              >
                Отправить на доработку
              </button>
              <button
                onClick={() => {
                  setReturnDialog(null)
                  setReturnComment('')
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

      {/* Details modal */}
      {detailsTask && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-[70] p-4 overflow-y-auto overscroll-contain modal-scroll">
          <div className={`${cardBg} rounded-xl p-6 max-w-2xl w-full border-2 ${borderColor}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${headingColor}`}>Всё о задаче</h3>
              <button
                onClick={() => setDetailsTask(null)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Название</p>
                <p className={`font-semibold ${headingColor}`}>{detailsTask.title}</p>
              </div>

              {detailsTask.description && (
                <div>
                  <p className="text-xs text-gray-500">Описание</p>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{detailsTask.description}</p>
                </div>
              )}

              {detailsTask.expectedResult && (
                <div>
                  <p className="text-xs text-gray-500">Ожидаемый результат</p>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{detailsTask.expectedResult}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Автор</p>
                  <p className={headingColor}>{TEAM_MEMBERS.find((m) => m.id === detailsTask.createdBy)?.name || detailsTask.createdBy}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Категория</p>
                  <p className={headingColor}>{TASK_CATEGORIES[detailsTask.category]?.label || detailsTask.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Приоритет</p>
                  <p className={headingColor}>
                    {detailsTask.priority === 'urgent'
                      ? 'Экстренный'
                      : detailsTask.priority === 'high'
                        ? 'Высокий'
                        : detailsTask.priority === 'medium'
                          ? 'Средний'
                          : 'Низкий'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Дедлайн</p>
                  <p className={headingColor}>{formatDate(new Date(detailsTask.dueDate), 'dd.MM.yyyy')} · {detailsTask.dueTime}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">Статус</p>
                <p className={`${headingColor} font-semibold`}>{TASK_STATUSES[detailsTask.status].label}</p>
              </div>

              {detailsTask.stages && detailsTask.stages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Этапы</p>
                  {detailsTask.stages.map((stage) => (
                    <div key={stage.id} className={`p-3 rounded border ${borderColor} space-y-2`}>
                      <div className="flex items-center justify-between">
                        <p className={`font-semibold ${headingColor}`}>{stage.name}</p>
                        <p className="text-xs text-gray-500">
                          {stage.approvals?.filter((a) => a.status === 'approved').length || 0}/{stage.approvals?.length || 0} подтверждений
                        </p>
                      </div>
                      {stage.assignees && stage.assignees.length > 0 && (
                        <div className="space-y-1 text-xs">
                          {stage.assignees.map((a) => {
                            const member = TEAM_MEMBERS.find((m) => m.id === a.userId)
                            return (
                              <div key={a.userId} className="flex items-start justify-between gap-2">
                                <span className="font-medium">{member?.name || a.userId}</span>
                                {a.comment && <span className="text-gray-500 truncate">{a.comment}</span>}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
