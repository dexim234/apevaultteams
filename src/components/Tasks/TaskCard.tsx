// Task card component
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { updateTask, addTaskNotification } from '@/services/firestoreService'
import { Task, TaskStatus, TEAM_MEMBERS, TASK_CATEGORIES, TASK_STATUSES } from '@/types'
import { 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Bell, 
  User, 
  Users,
  Calendar,
  AlertCircle,
  Check,
  X
} from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onUpdate: () => void
  unreadNotifications?: number
}

export const TaskCard = ({ task, onEdit, onDelete, onUpdate, unreadNotifications = 0 }: TaskCardProps) => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()
  
  const [loading, setLoading] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [approvalComment, setApprovalComment] = useState('')
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
  
  const categoryInfo = TASK_CATEGORIES[task.category]
  const statusInfo = TASK_STATUSES[task.status]
  const createdByUser = TEAM_MEMBERS.find(m => m.id === task.createdBy)
  const assignedUsers = task.assignedTo.map(id => TEAM_MEMBERS.find(m => m.id === id)).filter(Boolean)
  
  const canEdit = isAdmin || user?.id === task.createdBy
  const canApprove = task.status === 'pending' && task.assignedTo.includes(user?.id || '')
  const userApproval = task.approvals.find(a => a.userId === user?.id)
  const allApproved = task.status === 'pending' && task.approvals.every(a => a.status === 'approved')
  const hasMultipleParticipants = task.assignedTo.length > 1

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

      // Create notifications for status changes
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
          ? { ...a, status: newStatus, comment: approvalComment || undefined, updatedAt: now }
          : a
      )

      // If user hasn't approved yet, add their approval
      if (!userApproval) {
        updatedApprovals.push({
          userId: user.id,
          status: newStatus,
          comment: approvalComment || undefined,
          updatedAt: now,
        })
      }

      await updateTask(task.id, {
        approvals: updatedApprovals,
        updatedAt: now,
      })

      // If all approved, automatically move to in_progress
      const allNowApproved = updatedApprovals.every(a => a.status === 'approved')
      if (allNowApproved && action === 'approve') {
        await handleStatusChange('in_progress')
      } else {
        onUpdate()
      }

      setShowApprovalDialog(false)
      setApprovalComment('')
      setApprovalAction(null)
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

  const getStatusColor = () => {
    const colorMap: Record<TaskStatus, string> = {
      pending: theme === 'dark' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-700',
      in_progress: theme === 'dark' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700',
      completed: theme === 'dark' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-green-50 border-green-200 text-green-700',
      closed: theme === 'dark' ? 'bg-gray-500/20 border-gray-500/50 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-700',
    }
    return colorMap[task.status]
  }

  const getCategoryColor = () => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      green: {
        bg: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-50',
        text: theme === 'dark' ? 'text-green-400' : 'text-green-700',
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
          ? 'hover:border-green-500/50' 
          : 'hover:border-green-300'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`text-lg sm:text-xl font-bold ${headingColor} truncate`}>
                {task.title}
              </h3>
              {hasMultipleParticipants && unreadNotifications > 0 && (
                <div className="relative">
                  <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Category */}
              <span className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium ${getCategoryColor().bg} ${getCategoryColor().text}`}>
                {categoryInfo.icon} {categoryInfo.label}
              </span>
              {/* Status */}
              <span className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-medium border ${getStatusColor()}`}>
                {statusInfo.label}
              </span>
              {/* Priority */}
              <span className={`text-xs sm:text-sm font-medium ${getPriorityColor()}`}>
                {task.priority === 'high' ? '🔴 Высокий' : task.priority === 'medium' ? '🟡 Средний' : '🟢 Низкий'}
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
          {/* Created by */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <User className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Создал: {createdByUser?.name || 'Неизвестно'}
            </span>
          </div>

          {/* Assigned to */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Users className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Участники: {assignedUsers.map(u => u?.name).filter(Boolean).join(', ') || 'Нет'}
            </span>
          </div>

          {/* Due date and time */}
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Срок: {formatDate(new Date(task.dueDate), 'dd.MM.yyyy')} {task.dueTime}
              {(() => {
                const now = new Date()
                const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`)
                if (dueDateTime < now && task.status !== 'completed' && task.status !== 'closed') {
                  return <span className="text-red-500 font-semibold ml-1">⚠️ Просрочено</span>
                }
                return null
              })()}
            </span>
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
          {/* Approval buttons */}
          {canApprove && !userApproval && (
            <button
              onClick={() => {
                setApprovalAction('approve')
                setShowApprovalDialog(true)
              }}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Согласовать
            </button>
          )}
          
          {canApprove && !userApproval && (
            <button
              onClick={() => {
                setApprovalAction('reject')
                setShowApprovalDialog(true)
              }}
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

          {task.status === 'in_progress' && (canEdit || task.assignedTo.includes(user?.id || '')) && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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

      {/* Approval Dialog */}
      {showApprovalDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-xl p-6 max-w-md w-full border-2 ${borderColor}`}>
            <h3 className={`text-lg font-bold mb-4 ${headingColor}`}>
              {approvalAction === 'approve' ? 'Согласовать задачу' : 'Отклонить задачу'}
            </h3>
            <textarea
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              placeholder={approvalAction === 'approve' ? 'Комментарий (необязательно)' : 'Укажите причину отклонения'}
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              } ${headingColor} mb-4 focus:outline-none focus:ring-2 focus:ring-green-500/50`}
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(approvalAction!)}
                disabled={loading || (approvalAction === 'reject' && !approvalComment.trim())}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  approvalAction === 'approve'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } disabled:opacity-50`}
              >
                {approvalAction === 'approve' ? 'Согласовать' : 'Отклонить'}
              </button>
              <button
                onClick={() => {
                  setShowApprovalDialog(false)
                  setApprovalComment('')
                  setApprovalAction(null)
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

