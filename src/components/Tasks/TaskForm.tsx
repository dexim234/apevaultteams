import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { addTask, updateTask } from '@/services/firestoreService'
import {
  Task,
  TaskCategory,
  TaskPriority,
  TaskStage,
  TaskApproval,
  TEAM_MEMBERS,
  TASK_CATEGORIES,
} from '@/types'
import { X, FileText, Tag, Sparkles, Target, Calendar, Clock, Users, Plus, Trash, MessageCircle } from 'lucide-react'
import { CATEGORY_ICONS } from './categoryIcons'
import { formatDate } from '@/utils/dateUtils'
import { getUserNicknameSync } from '@/utils/userUtils'
import { useScrollLock } from '@/hooks/useScrollLock'

interface TaskFormProps {
  onClose: () => void
  onSave: () => void
  editingTask?: Task | null
}

type StageAssignee = {
  userId: string
  priority: TaskPriority
  comment?: string
}

type StageState = TaskStage & { assignees: StageAssignee[] }

export const TaskForm = ({ onClose, onSave, editingTask }: TaskFormProps) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const isEditing = !!editingTask

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const inputBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
  const borderColor = theme === 'dark' ? 'border-gray-800' : 'border-gray-300'

  const [title, setTitle] = useState(editingTask?.title || '')
  const [description, setDescription] = useState(editingTask?.description || '')
  const [category, setCategory] = useState<TaskCategory>(editingTask?.category || 'trading')
  const [priority, setPriority] = useState<TaskPriority>(editingTask?.priority || 'medium')
  const [expectedResult, setExpectedResult] = useState(editingTask?.expectedResult || '')
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || formatDate(new Date(), 'yyyy-MM-dd'))
  const [dueTime, setDueTime] = useState(editingTask?.dueTime || '12:00')

  const normalizeStage = (stage: TaskStage): StageState => ({
    ...stage,
    assignees: (stage.assignees || []) as StageAssignee[],
    approvals: (stage.approvals || []) as TaskApproval[],
    requiresApproval: stage.requiresApproval ?? true,
    stagePriority: stage.stagePriority || 'medium',
    status: stage.status || 'pending',
  })

  const [stages, setStages] = useState<StageState[]>(
    editingTask?.stages?.length
      ? editingTask.stages.map(normalizeStage)
      : [
          normalizeStage({
            id: 'stage-1',
            name: 'Этап 1',
            description: '',
            responsible: 'all',
            assignees: [],
            approvals: [],
            stagePriority: 'medium',
            requiresApproval: true,
            status: 'pending',
          }),
        ]
  )
  const [currentStageId, setCurrentStageId] = useState<string>(editingTask?.currentStageId || stages[0]?.id || 'stage-1')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useScrollLock()

  const priorityOptions: { value: TaskPriority; label: string; desc: string; tone: string }[] = [
    { value: 'urgent', label: 'Экстренный', desc: 'Нужно прямо сейчас', tone: theme === 'dark' ? 'bg-rose-600/20 border-rose-500/50 text-rose-100' : 'bg-rose-50 border-rose-200 text-rose-700' },
    { value: 'high', label: 'Высокий', desc: 'Быстрый старт', tone: theme === 'dark' ? 'bg-red-500/15 border-red-500/40 text-red-100' : 'bg-red-50 border-red-200 text-red-700' },
    { value: 'medium', label: 'Средний', desc: 'Плановый слот', tone: theme === 'dark' ? 'bg-amber-500/15 border-amber-500/40 text-amber-100' : 'bg-amber-50 border-amber-200 text-amber-700' },
    { value: 'low', label: 'Низкий', desc: 'Фон', tone: theme === 'dark' ? 'bg-gray-500/15 border-gray-500/40 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-700' },
  ]

  const handleStageChange = (stageId: string, updates: Partial<StageState>) => {
    setStages((prev) => prev.map((stage) => (stage.id === stageId ? { ...stage, ...updates } : stage)))
  }

  const handleStageAssigneeToggle = (stageId: string, userId: string) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage
        const exists = stage.assignees.find((a) => a.userId === userId)
        if (exists) return { ...stage, assignees: stage.assignees.filter((a) => a.userId !== userId) }
        if (stage.assignees.length >= 10) return stage
        return { ...stage, assignees: [...stage.assignees, { userId, priority: 'medium' }] }
      })
    )
  }

  const handleStageAssigneeFieldChange = (stageId: string, userId: string, field: 'priority' | 'comment', value: TaskPriority | string) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage
        const updated = stage.assignees.map((a) => (a.userId === userId ? { ...a, [field]: field === 'priority' ? (value as TaskPriority) : value } : a))
        return { ...stage, assignees: updated }
      })
    )
  }

  const handleAddStage = () => {
    const newStage: StageState = normalizeStage({
      id: `stage-${Date.now()}`,
      name: `Этап ${stages.length + 1}`,
      description: '',
      responsible: 'all',
      assignees: [],
      approvals: [],
      stagePriority: 'medium',
      requiresApproval: true,
      status: 'pending',
    })
    setStages((prev) => [...prev, newStage])
    if (!currentStageId) setCurrentStageId(newStage.id)
  }

  const handleRemoveStage = (stageId: string) => {
    if (stages.length === 1) return
    const updated = stages.filter((s) => s.id !== stageId)
    setStages(updated)
    if (currentStageId === stageId) setCurrentStageId(updated[0]?.id || '')
  }

  const validate = () => {
    if (!title.trim()) return 'Введите название задачи'
    if (!dueDate || !dueTime) return 'Укажите дедлайн (дата и время)'
    const totalAssignees = new Set(stages.flatMap((s) => s.assignees.map((a) => a.userId))).size
    if (totalAssignees === 0) return 'Добавьте исполнителей в этапах'
    return ''
  }

  const buildStage = (stage: StageState, now: string): TaskStage => {
    const assignees = stage.assignees
    const responsibleIds = assignees.map((a) => a.userId)
    const approvals: TaskApproval[] = responsibleIds.map((id) => {
      const assignee = assignees.find((a) => a.userId === id)
      return {
        userId: id,
        status: 'pending',
        updatedAt: now,
        ...(assignee?.comment ? { comment: assignee.comment } : {}),
      }
    })

    return {
      id: stage.id,
      name: stage.name,
      description: stage.description,
      responsible: responsibleIds,
      assignees,
      stagePriority: stage.stagePriority || 'medium',
      requiresApproval: true,
      approvals,
      comments: stage.comments || [],
      status: 'pending',
    }
  }

  const handleSave = async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    if (!user) {
      setError('Пользователь не найден')
      return
    }

    setError('')
    setLoading(true)
    const now = new Date().toISOString()

    try {
      const normalizedStages = stages.map((stage) => buildStage(stage, now))
      const assigneeIds = Array.from(new Set(normalizedStages.flatMap((s) => s.assignees?.map((a) => a.userId) || [])))

      const approvals: TaskApproval[] = assigneeIds.map((id) => ({
        userId: id,
        status: 'pending',
        updatedAt: now,
      }))

      const baseTask: Partial<Task> = {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        assignedTo: assigneeIds,
        assignees: assigneeIds.map((id) => ({ userId: id, priority: 'medium' })),
        approvals,
        stages: normalizedStages,
        currentStageId: currentStageId || normalizedStages[0]?.id,
        dueDate,
        dueTime,
        expectedResult: expectedResult.trim() || undefined,
        updatedAt: now,
      }

      if (isEditing && editingTask) {
        await updateTask(editingTask.id, baseTask)
      } else {
        const newTask: Omit<Task, 'id'> = {
          ...(baseTask as Omit<Task, 'id'>),
          status: 'in_progress',
          createdBy: user.id,
          createdAt: now,
        }
        await addTask(newTask)
      }

      onSave()
    } catch (error) {
      console.error('Error saving task:', error)
      setError('Ошибка при сохранении задачи')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-[70] p-4 overflow-y-auto overscroll-contain modal-scroll touch-pan-y">
      <div
        className={`${cardBg} rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-48px)] sm:max-h-[calc(100vh-64px)] overflow-y-auto border-2 touch-pan-y ${
          theme === 'dark'
            ? 'border-[#4E6E49]/30 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0A0A0A]'
            : 'border-green-200 bg-gradient-to-br from-white via-green-50/30 to-white'
        } relative`}
      >
        <div className="flex flex-col h-full min-h-0">
          <div className={`sticky top-0 ${cardBg} border-b ${borderColor} p-4 sm:p-6 flex items-center justify-between z-10`}>
            <h2 className={`text-xl sm:text-2xl font-bold ${headingColor} flex items-center gap-2`}>
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              {isEditing ? 'Редактировать задачу' : 'Новая задача'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 min-h-0 overflow-y-auto overscroll-contain modal-scroll touch-pan-y pb-10">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-500">
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className={`block text-sm font-medium mb-2 ${headingColor}`}>Название *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}
                placeholder="Введите название задачи"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${headingColor}`}>Описание</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`w-full px-4 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}
                placeholder="Кратко опишите задачу"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className={`block text-sm font-medium ${headingColor} flex items-center gap-2`}>
                  <Tag className="w-4 h-4" />
                  Категория
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {Object.entries(TASK_CATEGORIES).map(([key, { label }]) => {
                    const Icon = CATEGORY_ICONS[key as TaskCategory]
                    const isActive = category === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCategory(key as TaskCategory)}
                        className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all text-center ${
                          isActive
                            ? theme === 'dark'
                              ? 'border-[#4E6E49] bg-[#4E6E49]/15 text-[#4E6E49]'
                              : 'border-[#4E6E49] bg-green-50 text-[#4E6E49]'
                            : theme === 'dark'
                              ? 'border-gray-800 bg-gray-900 text-gray-200 hover:border-[#4E6E49]/40'
                              : 'border-gray-200 bg-white text-gray-800 hover:border-[#4E6E49]/40'
                        } flex items-center justify-center gap-2`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <label className={`block text-sm font-medium ${headingColor} flex items-center gap-2`}>
                  <Sparkles className="w-4 h-4" />
                  Приоритет
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPriority(option.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${option.tone} ${
                        priority === option.value ? 'ring-2 ring-offset-2 ring-[#4E6E49] dark:ring-offset-[#1a1a1a]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm">{option.label}</span>
                        {priority === option.value && <span className="text-xs font-semibold">выбрано</span>}
                      </div>
                      <p className="text-xs mt-1 opacity-80">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={`block text-sm font-medium ${headingColor}`}>Этапы и исполнители</label>
                <button
                  type="button"
                  onClick={handleAddStage}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  <Plus className="w-4 h-4 inline" /> Добавить этап
                </button>
              </div>
              <div className="space-y-3">
                {stages.map((stage, index) => (
                  <div key={stage.id} className={`p-3 rounded-lg border-2 ${borderColor} ${inputBg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        value={stage.name}
                        onChange={(e) => handleStageChange(stage.id, { name: e.target.value })}
                        className={`flex-1 px-3 py-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-[#0f0f0f] text-gray-100' : 'bg-white text-gray-800'}`}
                        placeholder={`Этап ${index + 1}`}
                      />
                      {stages.length > 1 && (
                        <button
                          onClick={() => handleRemoveStage(stage.id)}
                          className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-red-500/20 text-red-200' : 'bg-red-100 text-red-700'}`}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <textarea
                      value={stage.description || ''}
                      onChange={(e) => handleStageChange(stage.id, { description: e.target.value })}
                      rows={2}
                      className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-[#0f0f0f] text-gray-100' : 'bg-white text-gray-800'}`}
                      placeholder="Описание этапа (опционально)"
                    />

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${headingColor} flex items-center gap-2`}>
                          <Users className="w-4 h-4" />
                          Исполнители этапа
                        </label>
                        <span className="text-[11px] text-gray-500">{stage.assignees.length}/10</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {TEAM_MEMBERS.map((member) => {
                          const isSelected = stage.assignees.some((a) => a.userId === member.id)
                          return (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => handleStageAssigneeToggle(stage.id, member.id)}
                              className={`p-2 rounded-lg border text-left text-sm transition-all ${
                                isSelected
                                  ? theme === 'dark'
                                    ? 'border-[#4E6E49] bg-[#4E6E49]/20'
                                    : 'border-[#4E6E49] bg-green-50'
                                  : `${borderColor} ${inputBg}`
                              }`}
                            >
                              <span className={isSelected ? 'text-[#4E6E49]' : headingColor}>{getUserNicknameSync(member.id)}</span>
                            </button>
                          )
                        })}
                      </div>

                      {stage.assignees.length > 0 && (
                        <div className="space-y-2">
                          {stage.assignees.map((assignee) => {
                            const member = TEAM_MEMBERS.find((m) => m.id === assignee.userId)
                            return (
                              <div key={assignee.userId} className={`p-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div className="text-sm font-medium">{member?.name || assignee.userId}</div>
                                  <select
                                    value={assignee.priority}
                                    onChange={(e) => handleStageAssigneeFieldChange(stage.id, assignee.userId, 'priority', e.target.value as TaskPriority)}
                                    className={`px-3 py-1.5 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-100' : 'bg-white text-gray-700'}`}
                                  >
                                    <option value="urgent">Экстренный</option>
                                    <option value="high">Высокий</option>
                                    <option value="medium">Средний</option>
                                    <option value="low">Низкий</option>
                                  </select>
                                </div>
                                <textarea
                                  value={assignee.comment || ''}
                                  onChange={(e) => handleStageAssigneeFieldChange(stage.id, assignee.userId, 'comment', e.target.value)}
                                  rows={2}
                                  className={`mt-2 w-full px-3 py-2 rounded-lg border ${borderColor} ${theme === 'dark' ? 'bg-[#1a1a1a] text-gray-100' : 'bg-white text-gray-700'}`}
                                  placeholder="Комментарий для исполнителя (опционально)"
                                />
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${headingColor} flex items-center gap-2`}>
                <Target className="w-4 h-4" />
                Какой результат должен быть
              </label>
              <textarea
                value={expectedResult}
                onChange={(e) => setExpectedResult(e.target.value)}
                rows={3}
                className={`w-full px-4 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}
                placeholder="Опишите ожидаемый итог"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={`text-sm font-medium ${headingColor} flex items-center gap-2`}>
                  <Calendar className="w-4 h-4" />
                  Дата дедлайна *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={formatDate(new Date(), 'yyyy-MM-dd')}
                  className={`w-full px-4 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}
                />
              </div>
              <div className="space-y-1">
                <label className={`text-sm font-medium ${headingColor} flex items-center gap-2`}>
                  <Clock className="w-4 h-4" />
                  Время дедлайна *
                </label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]/50`}
                />
              </div>
            </div>

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
                {loading ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Создать задачу'}
              </button>
              <button
                onClick={onClose}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
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
