// Task card component
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { updateTask } from '@/services/firestoreService'
import { Task, TaskStatus, TEAM_MEMBERS, TASK_CATEGORIES, TASK_STATUSES } from '@/types'
import {
  AlertCircle,
  AlarmClock,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Edit,
  Feather,
  Flame,
  Radio,
  Trash2,
  User,
  Users,
  X,
  XCircle,
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
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionComment, setRejectionComment] = useState('')

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
    .filter(Boolean) as { member: (typeof TEAM_MEMBERS)[number]; priority: 'low' | 'medium' | 'high'; comment?: string }[]
  
  const canEdit = isAdmin || user?.id === task.createdBy
  const canApprove = task.status === 'pending' && assigneeIds.includes(user?.id || '')
  const userApproval = task.approvals.find((a) => a.userId === user?.id)
  const allApproved = task.status === 'pending' && task.approvals.length > 0 && task.approvals.every((a) => a.status === 'approved')

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!user && !isAdmin) return
    
    setLoading(true)
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
        // Only move to in_progress if all approvals are done
        if (!allApproved) {
          setLoading(false)
          return
        }
      }

      await updateTask(task.id, updates)

      onUpdate()
    } catch (error) {
      console.error('Error updating task status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (action: 'approve' | 'reject') => {
    if (!user) return
    
    setLoading(true)
    try {
      const now = new Date().toISOString()
      const newStatus: 'approved' | 'rejected' = action === 'approve' ? 'approved' : 'rejected'
      
      const updatedApprovals: Task['approvals'] = task.approvals.map(a =>
        a.userId === user.id
          ? { ...a, status: newStatus, comment: action === 'reject' ? rejectionComment || undefined : undefined, updatedAt: now }
          : a
      )

      // If user hasn't approved yet, add their approval
      if (!userApproval) {
        updatedApprovals.push({
          userId: user.id,
          status: newStatus,
          comment: action === 'reject' ? rejectionComment || undefined : undefined,
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
      } else if (action === 'approve') {
        // When approving, immediately move to in_progress
        updates.status = 'in_progress'
      }

      await updateTask(task.id, updates)

      if (action === 'reject') {
        setShowRejectDialog(false)
        setRejectionComment('')
      }
      onUpdate()
    } catch (error) {
      console.error('Error approving task:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return theme === 'dark' ? 'text-red-400' : 'text-red-600'
      case 'medium':
        return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
      case 'low':
        return theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    }
  }

  const getAssigneePriorityStyles = (priority: 'low' | 'medium' | 'high') => {
    const map = {
      high: {
        label: 'Высокий',
        classes: theme === 'dark' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-red-50 text-red-600 border-red-200',
      },
      medium: {
        label: 'Средний',
        classes: theme === 'dark' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
      },
      low: {
        label: 'Низкий',
        classes: theme === 'dark' ? 'bg-gray-500/20 text-gray-300 border-gray-500/40' : 'bg-gray-50 text-gray-700 border-gray-200',
      },
    }
    return map[priority]
  }

  const getStatusColor = () => {
    const colorMap: Record<TaskStatus, string> = {
      pending: theme === 'dark' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-700',
      in_progress: theme === 'dark' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700',
      completed: theme === 'dark' ? 'bg-[#4E6E49]/20 border-[#4E6E49]/50 text-[#4E6E49]' : 'bg-green-50 border-green-200 text-[#4E6E49]',
      closed: theme === 'dark' ? 'bg-gray-500/20 border-gray-500/50 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-700',
      rejected: theme === 'dark' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-red-50 border-red-200 text-red-700',
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
              {/* Category */}
              <span className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium ${getCategoryColor().bg} ${getCategoryColor().text} inline-flex items-center gap-1.5`}>
                <CategoryIcon className="w-4 h-4" />
                {categoryInfo.label}
              </span>
              {/* Status */}
              <span className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium border ${getStatusColor()}`}>
                {statusInfo.label}
              </span>
              {/* Priority */}
              <span className={`text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 ${getPriorityColor()}`}>
                {task.priority === 'high' ? <Flame className="w-4 h-4" /> : task.priority === 'medium' ? <Radio className="w-4 h-4" /> : <Feather className="w-4 h-4" />}
                {task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
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
                <div className="mt-2 space-y-2">
                  {assignedUsers.map((assignee) => {
                    const priorityStyles = getAssigneePriorityStyles(assignee.priority)
                    return (
                      <div
                        key={assignee.member.id}
                        className={`p-3 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-[#1a1a1a]/70' : 'bg-gray-50'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                            {assignee.member.name}
                          </span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${priorityStyles.classes}`}>
                            {priorityStyles.label}
                          </span>
                        </div>
                        {assignee.comment && (
                          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {assignee.comment}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>Не назначены</span>
              )}
            </div>
          </div>

          {/* Due date and time */}
          <div className="flex items-center gap-3 flex-wrap text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <AlarmClock className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                Старт: {task.startTime || '—'}
              </span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Дедлайн: {formatDate(new Date(task.dueDate), 'dd.MM.yyyy')} {task.dueTime}
              </span>
            </span>
            <TaskDeadlineBadge dueDate={task.dueDate} dueTime={task.dueTime} theme={theme} />
          </div>

          {/* Approvals status */}
          {task.status === 'pending' && task.approvals.length > 0 && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <AlertCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}>
                Согласований: {task.approvals.filter(a => a.status === 'approved').length}/{task.approvals.length}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={`flex flex-wrap gap-2 pt-4 border-t ${borderColor}`}>
          {canApprove && !userApproval && (
            <button
              onClick={() => handleApprove('approve')}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Согласовать
            </button>
          )}
          
          {canApprove && !userApproval && (
            <button
              onClick={() => setShowRejectDialog(true)}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Отклонить
            </button>
          )}

          {/* Status change buttons */}
          {task.status === 'pending' && allApproved && (canEdit || canApprove) && (
            <button
              onClick={() => handleStatusChange('in_progress')}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Clock className="w-4 h-4" />
              В работу
            </button>
          )}

          {task.status === 'in_progress' && (canEdit || assigneeIds.includes(user?.id || '')) && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              Выполнена
            </button>
          )}

          {task.status === 'completed' && canEdit && (
            <button
              onClick={() => handleStatusChange('closed')}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Закрыть
            </button>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
                onClick={() => handleApprove('reject')}
                disabled={loading || !rejectionComment.trim()}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
              >
                Отклонить
              </button>
              <button
                onClick={() => {
                  setShowRejectDialog(false)
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

