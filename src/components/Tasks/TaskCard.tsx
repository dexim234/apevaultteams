// Task card component
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { updateTask } from '@/services/firestoreService'
import { Task, TaskPriority, TaskStatus, TEAM_MEMBERS, TASK_CATEGORIES, TASK_STATUSES, TaskApproval } from '@/types'
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Edit,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'
import { TaskDeadlineBadge } from './TaskDeadlineBadge'
import { CATEGORY_ICONS } from './categoryIcons'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onUpdate: () => void
}

export const TaskCard = ({ task, onEdit, onDelete, onUpdate }: TaskCardProps) => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()
  
  const [loading, setLoading] = useState(false)
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [returnComment, setReturnComment] = useState('')

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-300'
  
  const categoryInfo = TASK_CATEGORIES[task.category]
  const statusInfo = TASK_STATUSES[task.status]
  const CategoryIcon = CATEGORY_ICONS[task.category]
  const createdByUser = TEAM_MEMBERS.find((m) => m.id === task.createdBy)
  const assignees =
    task.assignees && task.assignees.length > 0
      ? task.assignees
      : task.assignedTo.map((userId) => ({ userId, priority: 'medium' as const }))
  const assigneeIds = assignees.map((a) => a.userId)
  const assignedUsers = assignees
    .map((assignee) => {
      const member = TEAM_MEMBERS.find((m) => m.id === assignee.userId)
      if (!member) return null
      return { ...assignee, member }
    })
    .filter(Boolean) as { member: (typeof TEAM_MEMBERS)[number]; priority: TaskPriority; comment?: string }[]
  
  const canEdit = isAdmin || user?.id === task.createdBy || task.mainExecutor === user?.id

  const resolveExecutorApprovals = (): TaskApproval[] => {
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

  const isExecutor = () => !!user && assigneeIds.includes(user.id)
  const canCloseTaskCard = () => isAdmin || user?.id === task.createdBy

  const getApprovalStats = () => {
    const approvals = resolveExecutorApprovals()
    const approved = approvals.filter((a) => a.status === 'approved').length
    return { approvals, approved, total: assigneeIds.length }
  }

  const { approvals, approved, total } = getApprovalStats()
  const userApproval = approvals.find((a) => a.userId === user?.id)
  const canExecutorConfirm = isExecutor() && task.status === 'in_progress' && (!userApproval || userApproval.status !== 'approved')
  const canClose = canCloseTaskCard() && task.status === 'completed'

  const handleExecutorConfirm = async () => {
    if (!user || task.status !== 'in_progress' || !isExecutor()) return
    setLoading(true)
    try {
      const now = new Date().toISOString()
      const approvals = resolveExecutorApprovals().map((a) =>
        a.userId === user.id ? { ...a, status: 'approved' as const, updatedAt: now } : a
      )
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
      setLoading(false)
    }
  }

  const handleMarkClosed = async () => {
    if (!canCloseTaskCard() || task.status !== 'completed') return
    setLoading(true)
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
      setLoading(false)
    }
  }

  const handleReturnToWork = async () => {
    if (!canCloseTaskCard()) return
    const comment = (returnComment || '').trim()
    if (!comment) return

    setLoading(true)
    try {
      const now = new Date().toISOString()
      const resetApprovals = assigneeIds.map((id) => ({
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

      setShowReturnDialog(false)
      setReturnComment('')
      onUpdate()
    } catch (error) {
      console.error('Error returning task:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    const colorMap: Record<TaskStatus, string> = {
      in_progress: theme === 'dark' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700',
      completed: theme === 'dark' ? 'bg-[#4E6E49]/20 border-[#4E6E49]/50 text-[#4E6E49]' : 'bg-green-50 border-green-200 text-[#4E6E49]',
      closed: theme === 'dark' ? 'bg-gray-500/20 border-gray-500/50 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-700',
    }
    return colorMap[task.status]
  }

  const getCategoryColor = () => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      green: {
        bg: theme === 'dark' ? 'bg-[#4E6E49]/20' : 'bg-green-50',
        text: theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]',
      },
      blue: {
        bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50',
        text: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
      },
      purple: {
        bg: theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-50',
        text: theme === 'dark' ? 'text-purple-400' : 'text-purple-700',
      },
      red: {
        bg: theme === 'dark' ? 'bg-red-500/20' : 'bg-red-50',
        text: theme === 'dark' ? 'text-red-400' : 'text-red-700',
      },
      yellow: {
        bg: theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-50',
        text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
      },
      indigo: {
        bg: theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-50',
        text: theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700',
      },
    }
    return colorMap[categoryInfo.color] || colorMap.green
  }

  return (
    <>
      <div className={`${cardBg} rounded-xl border-2 ${borderColor} p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all ${
        theme === 'dark' 
          ? 'hover:border-[#4E6E49]/50' 
          : 'hover:border-[#4E6E49]'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`text-lg sm:text-xl font-bold ${headingColor} truncate`}>
                {task.title}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium ${getCategoryColor().bg} ${getCategoryColor().text} inline-flex items-center gap-1.5`}>
                <CategoryIcon className="w-4 h-4" />
                {categoryInfo.label}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium border ${getStatusColor()}`}>
                {statusInfo.label}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium border ${theme === 'dark' ? 'border-yellow-500/40 text-yellow-200 bg-yellow-500/10' : 'border-yellow-200 text-yellow-700 bg-yellow-50'}`}>
                {task.priority === 'urgent'
                  ? 'Экстренный приоритет'
                  : task.priority === 'high'
                    ? 'Высокий приоритет'
                    : task.priority === 'medium'
                      ? 'Средний приоритет'
                      : 'Низкий приоритет'}
              </span>
            </div>
          </div>
          
          {/* Actions */}
          {canEdit && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="Редактировать"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'
                }`}
                title="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-2`}>
            {task.description}
          </p>
        )}

        {/* Details */}
        <div className="space-y-2 mb-4">
          {/* Author and Executors */}
          <div className="flex flex-col gap-3">
            {/* Author */}
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <User className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Автор:
              </span>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {createdByUser?.name || 'Неизвестно'}
              </span>
            </div>

            {/* Executors */}
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <Users className={`w-4 h-4 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
                <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Исполнители:
                </span>
              </div>
              {assignedUsers.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {assignedUsers.map((assignee) => (
                    <div key={assignee.member.id} className={`text-sm ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                      {assignee.member.name}
                    </div>
                  ))}
                </div>
              ) : (
                <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>Не назначены</span>
              )}
            </div>
          </div>

          {/* Due date and time */}
          <div className="flex items-center gap-3 flex-wrap text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Дедлайн: {formatDate(new Date(task.dueDate), 'dd.MM.yyyy')} {task.dueTime}
              </span>
            </span>
            <TaskDeadlineBadge dueDate={task.dueDate} dueTime={task.dueTime} theme={theme} />
          </div>

          {/* Approvals status */}
          {total > 0 && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <AlertCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}>
                Подтвердили: {approved}/{total}
              </span>
            </div>
          )}
        </div>

        {/* Исполнители и комментарии */}
        <div className={`mt-4 p-3 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-[#1a1a1a]/70' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Подтверждения исполнителей</span>
            <span className="text-xs text-gray-500">
              {approved}/{total}
            </span>
          </div>
          {approvals.length > 0 && (
            <div className="space-y-1 text-xs">
              {approvals.map((a) => {
                const member = TEAM_MEMBERS.find((m) => m.id === a.userId)
                const statusText = a.status === 'approved' ? 'подтвердил' : 'ожидает'
                return (
                  <div key={a.userId} className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">{member?.name || a.userId}</span>
                      <span className="text-gray-500">({statusText})</span>
                    </span>
                    {a.comment && <span className="text-gray-500 truncate max-w-[140px]">{a.comment}</span>}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={`flex flex-wrap gap-2 pt-4 border-t ${borderColor}`}>
          {canExecutorConfirm && (
            <button
              onClick={handleExecutorConfirm}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Подтвердить
            </button>
          )}

          {canClose && (
            <>
              <button
                onClick={handleMarkClosed}
                disabled={loading}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                Закрыто
              </button>
              <button
                onClick={() => setShowReturnDialog(true)}
                disabled={loading}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Не выполнено
              </button>
            </>
          )}

          {task.status === 'completed' && !canClose && (
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Ожидает подтверждения автора
            </span>
          )}
        </div>
      </div>

      {/* Return dialog */}
      {showReturnDialog && (
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
                onClick={handleReturnToWork}
                disabled={loading || !returnComment.trim()}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
              >
                Отправить на доработку
              </button>
              <button
                onClick={() => {
                  setShowReturnDialog(false)
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

    </>
  )
}

