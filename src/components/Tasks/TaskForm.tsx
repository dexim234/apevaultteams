// Form for adding/editing tasks
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { addTask, updateTask } from '@/services/firestoreService'
import { Task, TaskAssignee, TaskCategory, TEAM_MEMBERS, TASK_CATEGORIES } from '@/types'
import { X, Calendar, Users, Tag, FileText, AlertCircle, Clock, AlarmClock, Sparkles } from 'lucide-react'
import { CATEGORY_ICONS } from './categoryIcons'
import { formatDate } from '@/utils/dateUtils'

interface TaskFormProps {
  onClose: () => void
  onSave: () => void
  editingTask?: Task | null
}

export const TaskForm = ({ onClose, onSave, editingTask }: TaskFormProps) => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()
  const isEditing = !!editingTask
  
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-300'
  
  const [title, setTitle] = useState(editingTask?.title || '')
  const [description, setDescription] = useState(editingTask?.description || '')
  const [category, setCategory] = useState<TaskCategory>(editingTask?.category || 'trading')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(editingTask?.priority || 'medium')
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || formatDate(new Date(), 'yyyy-MM-dd'))
  const [dueTime, setDueTime] = useState(editingTask?.dueTime || '12:00')
  const [startTime, setStartTime] = useState(editingTask?.startTime || '09:00')
  const initialAssignees: TaskAssignee[] =
    editingTask && editingTask.assignees && editingTask.assignees.length > 0
      ? editingTask.assignees
      : editingTask
        ? editingTask.assignedTo.map((userId) => ({ userId, priority: 'medium' as const }))
        : []
  const [assignees, setAssignees] = useState<TaskAssignee[]>(initialAssignees)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Lock background scroll while modal is open
  useEffect(() => {
    const originalPaddingRight = window.innerWidth - document.documentElement.clientWidth
    
    // Store scroll position and lock it
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.paddingRight = `${originalPaddingRight}px`
    
    return () => {
      // Restore scroll position
      const scrollY = parseInt(document.body.style.top || '0', 10) * -1
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.paddingRight = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  const priorityOptions: { value: 'low' | 'medium' | 'high'; label: string; desc: string; tone: string }[] = [
    { value: 'high', label: 'Высокий', desc: 'Нужен приоритет и быстрый старт', tone: theme === 'dark' ? 'bg-red-500/15 border-red-500/40 text-red-100' : 'bg-red-50 border-red-200 text-red-700' },
    { value: 'medium', label: 'Средний', desc: 'Стандартный приоритет, плановый слот', tone: theme === 'dark' ? 'bg-amber-500/15 border-amber-500/40 text-amber-100' : 'bg-amber-50 border-amber-200 text-amber-700' },
    { value: 'low', label: 'Низкий', desc: 'Можно параллельно с другими задачами', tone: theme === 'dark' ? 'bg-gray-500/15 border-gray-500/40 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-700' },
  ]

  const handleParticipantToggle = (userId: string) => {
    if (assignees.find((assignee) => assignee.userId === userId)) {
      setAssignees((prev) => prev.filter((assignee) => assignee.userId !== userId))
    } else {
      setAssignees((prev) => [...prev, { userId, priority: 'medium' }])
    }
  }

  const handleSelectAll = () => {
    if (assignees.length === TEAM_MEMBERS.length) {
      setAssignees([])
    } else {
      setAssignees(TEAM_MEMBERS.map((member) => ({ userId: member.id, priority: 'medium' })))
    }
  }

  const handleAssigneePriorityChange = (userId: string, priority: 'low' | 'medium' | 'high') => {
    setAssignees((prev) =>
      prev.map((assignee) => (assignee.userId === userId ? { ...assignee, priority } : assignee))
    )
  }

  const handleAssigneeCommentChange = (userId: string, comment: string) => {
    setAssignees((prev) =>
      prev.map((assignee) => (assignee.userId === userId ? { ...assignee, comment } : assignee))
    )
  }

  const handleSave = async () => {
    if (!isAdmin && !user) {
      setError('Пользователь не найден')
      return
    }

    setError('')
    setLoading(true)

    try {
      if (!title.trim()) {
        setError('Введите название задачи')
        setLoading(false)
        return
      }

      if (assignees.length === 0) {
        setError('Выберите хотя бы одного участника')
        setLoading(false)
        return
      }

      if (!dueDate) {
        setError('Укажите дату дедлайна')
        setLoading(false)
        return
      }

      if (!startTime) {
        setError('Укажите время начала')
        setLoading(false)
        return
      }

      if (!dueTime) {
        setError('Укажите время дедлайна')
        setLoading(false)
        return
      }

      const now = new Date().toISOString()
      const currentUserId = user?.id || 'admin'

      const participantIds = assignees.map((assignee) => assignee.userId)

      if (isEditing && editingTask) {
        // Update existing task
        const updatedApprovals = participantIds.map((userId) => {
          const existing = editingTask.approvals.find((a) => a.userId === userId)
          return (
            existing || {
              userId,
              status: 'pending' as const,
              updatedAt: now,
            }
          )
        })

        const updates: Partial<Task> = {
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          priority,
          assignedTo: participantIds,
          assignees,
          approvals: updatedApprovals,
          dueDate,
          dueTime,
          startTime,
          updatedAt: now,
        }

        await updateTask(editingTask.id, updates)

        // Status changes handled separately in task views
      } else {
        // Create new task
        const newTask: Omit<Task, 'id'> = {
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          status: 'pending',
          createdBy: currentUserId,
          assignedTo: participantIds,
          assignees,
          approvals: participantIds.map((userId) => ({
            userId,
            status: 'pending' as const,
            updatedAt: now,
          })),
          createdAt: now,
          updatedAt: now,
          priority,
          dueDate,
          dueTime,
          startTime,
        }

        await addTask(newTask)
      }

      onSave()
    } catch (error) {
      console.error('Error saving task:', error)
      setError('Ошибка при сохранении задачи')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-[70] p-4">
      <div className={`${cardBg} rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100dvh-96px)] sm:max-h-[calc(100dvh-96px)] overflow-hidden border-2 ${
        theme === 'dark' 
          ? 'border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]' 
          : 'border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white'
      } relative`}>
        <div className="flex flex-col h-full min-h-0">
          {/* Header */}
          <div className={`sticky top-0 ${cardBg} border-b ${borderColor} p-4 sm:p-6 flex items-center justify-between z-10`}>
            <h2 className={`text-xl sm:text-2xl font-bold ${headingColor} flex items-center gap-2`}>
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              {isEditing ? 'Редактировать задачу' : 'Новая задача'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {error && (
            <div className={`p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-500`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
              Название задачи *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`}
              placeholder="Введите название задачи"
            />
          </div>

          {/* Assignee details */}
          {assignees.length > 0 && (
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${headingColor}`}>Приоритеты и комментарии</label>
              <div className="space-y-3">
                {assignees.map((assignee) => {
                  const member = TEAM_MEMBERS.find((m) => m.id === assignee.userId)
                  return (
                    <div
                      key={assignee.userId}
                      className={`p-3 rounded-lg border ${borderColor} ${inputBg} space-y-2`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-sm font-medium">
                          {member?.name || 'Участник'}{' '}
                          <span className="text-xs text-gray-500">
                            ({member?.login || member?.id || '—'})
                          </span>
                        </div>
                        <select
                          value={assignee.priority}
                          onChange={(e) => handleAssigneePriorityChange(assignee.userId, e.target.value as 'low' | 'medium' | 'high')}
                          className={`px-3 py-1.5 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-100' : 'bg-white text-gray-700'}`}
                        >
                          <option value="low">Низкий приоритет</option>
                          <option value="medium">Средний приоритет</option>
                          <option value="high">Высокий приоритет</option>
                        </select>
                      </div>
                      <textarea
                        value={assignee.comment || ''}
                        onChange={(e) => handleAssigneeCommentChange(assignee.userId, e.target.value)}
                        rows={2}
                        className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-100' : 'bg-white text-gray-700'} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}
                        placeholder="Комментарий для исполнителя (необязательно)"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${headingColor}`}>
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-4 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all resize-none`}
              placeholder="Добавьте описание задачи (необязательно)"
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={`block text-sm font-medium ${headingColor} flex items-center gap-2`}>
                  <Tag className="w-4 h-4" />
                  Категория
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {Object.entries(TASK_CATEGORIES).map(([key, { label }]) => {
                  const Icon = CATEGORY_ICONS[key as TaskCategory]
                  const isActive = category === key

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key as TaskCategory)}
                      className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all text-center leading-tight whitespace-normal ${
                        isActive
                          ? theme === 'dark'
                            ? 'border-[#4E6E49] bg-[#4E6E49]/15 text-[#4E6E49]'
                            : 'border-[#4E6E49] bg-green-50 text-[#4E6E49]'
                          : theme === 'dark'
                            ? 'border-gray-800 bg-gray-900 text-gray-200 hover:border-[#4E6E49]/40'
                            : 'border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/40'
                      } flex flex-col items-center gap-2`}
                    >
                      <span className="flex items-center gap-2 justify-center">
                        <Icon className="w-4 h-4" />
                        <span className="break-words">{label}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={`block text-sm font-medium ${headingColor} flex items-center gap-2`}>
                  <Sparkles className="w-4 h-4" />
                  Приоритет
                </label>
                <span className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Влияет на порядок в списке и уведомления
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPriority(option.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${option.tone} ${
                      priority === option.value
                        ? 'ring-2 ring-offset-2 ring-[#4E6E49] dark:ring-offset-[#1a1a1a]'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm">{option.label}</span>
                      {priority === option.value && <span className="text-xs font-semibold">выбрано</span>}
                    </div>
                    <p className="text-xs mt-1 leading-snug opacity-80">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg border-2 flex flex-col gap-2 transition-all shadow-sm bg-white/60 dark:bg-[#1a1a1a]/60"
              style={{ borderColor: theme === 'dark' ? '#2f2f2f' : '#e5e7eb' }}>
              <label className={`text-sm font-medium ${headingColor} flex items-center gap-2`}>
                <AlarmClock className="w-4 h-4" />
                Время начала *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className={`w-full px-4 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`}
              />
              <p className={`text-[11px] leading-snug ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Помогает планировать последовательность задач и уведомлений.
              </p>
            </div>
            <div className="p-3 rounded-lg border-2 flex flex-col gap-2 transition-all shadow-sm bg-white/60 dark:bg-[#1a1a1a]/60"
              style={{ borderColor: theme === 'dark' ? '#2f2f2f' : '#e5e7eb' }}>
              <label className={`text-sm font-medium ${headingColor} flex items-center gap-2`}>
                <Calendar className="w-4 h-4" />
                Дата дедлайна *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={formatDate(new Date(), 'yyyy-MM-dd')}
                required
                className={`w-full px-4 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`}
              />
              <p className={`text-[11px] leading-snug ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Ограничение по датам учитывает сегодняшнюю дату автоматически.
              </p>
            </div>
            <div className="p-3 rounded-lg border-2 flex flex-col gap-2 transition-all shadow-sm bg-white/60 dark:bg-[#1a1a1a]/60"
              style={{ borderColor: theme === 'dark' ? '#2f2f2f' : '#e5e7eb' }}>
              <label className={`text-sm font-medium ${headingColor} flex items-center gap-2`}>
                <Clock className="w-4 h-4" />
                Время дедлайна *
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                required
                className={`w-full px-4 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50 transition-all`}
              />
              <p className={`text-[11px] leading-snug ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Добавьте время, чтобы вся команда понимала, когда итог должен быть готов.
              </p>
            </div>
          </div>

          {/* Participants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`block text-sm font-medium ${headingColor} flex items-center gap-2`}>
                <Users className="w-4 h-4" />
                Участники *
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className={`text-xs sm:text-sm px-3 py-1 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {assignees.length === TEAM_MEMBERS.length ? 'Снять выделение' : 'Выбрать всех'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {TEAM_MEMBERS.map((member) => {
                const isSelected = assignees.some((assignee) => assignee.userId === member.id)
                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleParticipantToggle(member.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? theme === 'dark'
                          ? 'border-[#4E6E49] bg-[#4E6E49]/20'
                          : 'border-[#4E6E49] bg-green-50'
                        : `${borderColor} ${inputBg}`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-[#4E6E49]' : 'bg-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isSelected
                          ? theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'
                          : headingColor
                      }`}>
                        {member.name}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

            {/* Actions */}
            <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${borderColor}`}>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#4E6E49] to-emerald-700 hover:from-[#4E6E49] hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                }`}
              >
                {loading ? 'Сохранение...' : isEditing ? 'Сохранить изменения' : 'Создать задачу'}
              </button>
              <button
                onClick={onClose}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

