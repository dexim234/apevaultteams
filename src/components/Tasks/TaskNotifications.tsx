// Task notifications component
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { getTaskNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/services/firestoreService'
import { getTasks } from '@/services/firestoreService'
import { TaskNotification, Task } from '@/types'
import { Bell, X, Check, CheckCheck } from 'lucide-react'
import { formatDate } from '@/utils/dateUtils'

interface TaskNotificationsProps {
  onTaskClick?: (taskId: string) => void
}

export const TaskNotifications = ({ onTaskClick }: TaskNotificationsProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  
  const [notifications, setNotifications] = useState<TaskNotification[]>([])
  const [tasks, setTasks] = useState<Record<string, Task>>({})
  const [showPanel, setShowPanel] = useState(false)
  const [loading, setLoading] = useState(false)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300'

  useEffect(() => {
    if (user) {
      loadNotifications()
    }
  }, [user])

  const loadNotifications = async () => {
    if (!user) return
    
    try {
      const userNotifications = await getTaskNotifications(user.id)
      setNotifications(userNotifications)
      
      // Load tasks for notifications
      const taskIds = [...new Set(userNotifications.map(n => n.taskId))]
      const allTasks = await getTasks()
      const tasksMap: Record<string, Task> = {}
      allTasks.forEach(task => {
        if (taskIds.includes(task.id)) {
          tasksMap[task.id] = task
        }
      })
      setTasks(tasksMap)
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      await markAllNotificationsAsRead(user.id)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    } finally {
      setLoading(false)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!user) return null

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`relative p-2 rounded-lg transition-colors ${
          theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        }`}
      >
        <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {showPanel && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />
          <div className={`absolute right-0 top-12 z-50 ${cardBg} rounded-xl shadow-2xl border-2 ${borderColor} w-80 sm:w-96 max-h-[80vh] overflow-hidden flex flex-col`}>
            {/* Header */}
            <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <h3 className={`text-lg font-bold ${headingColor}`}>
                  Уведомления
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <div className={`p-3 border-b ${borderColor} flex justify-end`}>
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                  } disabled:opacity-50`}
                >
                  <CheckCheck className="w-4 h-4" />
                  Отметить все прочитанными
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} opacity-50`} />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Нет уведомлений
                  </p>
                </div>
              ) : (
                <div className={`divide-y ${borderColor}`}>
                  {notifications.map((notification) => {
                    const task = tasks[notification.taskId]
                    const isUnread = !notification.read
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 transition-colors cursor-pointer ${
                          isUnread
                            ? theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
                            : theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          if (onTaskClick && task) {
                            onTaskClick(task.id)
                            setShowPanel(false)
                          }
                          if (isUnread) {
                            handleMarkAsRead(notification.id)
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                            isUnread ? 'bg-blue-500' : 'bg-transparent'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${isUnread ? 'font-semibold' : 'font-medium'} ${headingColor} mb-1`}>
                              {notification.message}
                            </p>
                            {task && (
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                Задача: {task.title}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                {formatDate(new Date(notification.createdAt), 'dd.MM.yyyy HH:mm')}
                              </span>
                              {isUnread && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMarkAsRead(notification.id)
                                  }}
                                  className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                  title="Отметить прочитанным"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

