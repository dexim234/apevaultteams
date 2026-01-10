import { Task, TASK_CATEGORIES, TASK_STATUSES } from '@/types'
import { useUsers } from '@/hooks/useUsers'
import { formatDate } from '@/utils/dateUtils'
import { Clock, Pencil, Trash2 } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

interface TaskTableProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export const TaskTable = ({ tasks, onEdit, onDelete }: TaskTableProps) => {
  const { theme } = useThemeStore()
  const { users } = useUsers()

  const getUser = (userId: string) => users.find(u => u.id === userId)
  const getUserName = (userId: string) => {
    const user = getUser(userId)
    return user ? user.name : 'Unknown'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20'
      case 'completed': return 'bg-green-500/20 text-green-500 border-green-500/20'
      case 'closed': return 'bg-slate-500/20 text-slate-400 border-slate-500/20'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20'
    }
  }

  const getCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      trading: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      research: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      content: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      stream: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      other: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      learning: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    }
    return colors[categoryId] || colors.other
  }

  if (tasks.length === 0) {
    return (
      <div className={`text-center py-12 rounded-xl border-2 border-dashed ${theme === 'dark' ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
        No tasks found
      </div>
    )
  }

  return (
    <div className={`w-full overflow-hidden rounded-xl border ${theme === 'dark' ? 'bg-[#151a21]/50 border-white/5' : 'bg-white border-gray-200'}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`text-xs uppercase tracking-wider text-left ${theme === 'dark' ? 'text-gray-500 bg-white/5' : 'text-gray-500 bg-gray-50'}`}>
              <th className="px-6 py-4 font-bold w-20">#ID</th>
              <th className="px-6 py-4 font-bold">Задача</th>
              <th className="px-6 py-4 font-bold">Категория</th>
              <th className="px-6 py-4 font-bold">Исполнитель</th>
              <th className="px-6 py-4 font-bold text-center">Статус</th>
              <th className="px-6 py-4 font-bold text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className={`group transition-colors ${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}
              >
                <td className={`px-6 py-4 text-xs font-mono opacity-50 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  #{task.id.slice(0, 4)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {task.dueDate ? (
                        <span>
                          Дедлайн: {formatDate(new Date(task.dueDate), 'd MMM')} {task.dueTime ? `, ${task.dueTime}` : ''}
                        </span>
                      ) : (
                        <span>Без дедлайна</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getCategoryColor(task.category)}`}>
                    {TASK_CATEGORIES[task.category]?.label || task.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                      {getUserName(task.mainExecutor || task.assignedTo[0]).charAt(0)}
                    </div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {getUserName(task.mainExecutor || task.assignedTo[0])}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(task.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'in_progress' ? 'bg-yellow-500 animate-pulse' : task.status === 'completed' ? 'bg-green-500' : 'bg-gray-500'}`} />
                    {TASK_STATUSES[task.status]?.label || task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(task)}
                      className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-600'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
