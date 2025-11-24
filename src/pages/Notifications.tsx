// Notifications page - All user notifications
import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import {
  getNotifications,
  markNotificationAsReadGeneral,
  markAllNotificationsAsReadGeneral,
  deleteNotification,
} from '@/services/firestoreService'
import { Notification, NotificationCategory } from '@/types'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  X,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  List,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

const CATEGORY_LABELS: Record<NotificationCategory, { label: string; icon: React.ReactNode; color: string }> = {
  tasks: { label: 'Задачи', icon: <List className="w-4 h-4" />, color: 'blue' },
  schedule: { label: 'Расписание', icon: <Calendar className="w-4 h-4" />, color: 'green' },
  earnings: { label: 'Заработок', icon: <DollarSign className="w-4 h-4" />, color: 'yellow' },
  rating: { label: 'Рейтинг', icon: <TrendingUp className="w-4 h-4" />, color: 'purple' },
  referrals: { label: 'Рефералы', icon: <Users className="w-4 h-4" />, color: 'pink' },
  messages: { label: 'Сообщения', icon: <MessageSquare className="w-4 h-4" />, color: 'indigo' },
  system: { label: 'Система', icon: <Settings className="w-4 h-4" />, color: 'gray' },
}

export const Notifications = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'

  useEffect(() => {
    if (user) {
      loadNotifications()
    }
  }, [user, selectedCategory, showUnreadOnly])

  const loadNotifications = async () => {
    if (!user) return

    setLoading(true)
    try {
      const allNotifications = await getNotifications(
        user.id,
        selectedCategory === 'all' ? undefined : selectedCategory,
        showUnreadOnly
      )
      setNotifications(allNotifications)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsReadGeneral(id)
      loadNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user) return
    try {
      await markAllNotificationsAsReadGeneral(
        user.id,
        selectedCategory === 'all' ? undefined : selectedCategory
      )
      loadNotifications()
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id)
      loadNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id)
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const filteredNotifications = showUnreadOnly
    ? notifications.filter(n => !n.read)
    : notifications

  const getCategoryColor = (category: NotificationCategory) => {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      blue: {
        bg: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50',
        border: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-200',
        text: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
      },
      green: {
        bg: theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
        border: theme === 'dark' ? 'border-green-500/30' : 'border-green-200',
        text: theme === 'dark' ? 'text-green-400' : 'text-green-700',
      },
      yellow: {
        bg: theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50',
        border: theme === 'dark' ? 'border-yellow-500/30' : 'border-yellow-200',
        text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
      },
      purple: {
        bg: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50',
        border: theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200',
        text: theme === 'dark' ? 'text-purple-400' : 'text-purple-700',
      },
      pink: {
        bg: theme === 'dark' ? 'bg-pink-500/10' : 'bg-pink-50',
        border: theme === 'dark' ? 'border-pink-500/30' : 'border-pink-200',
        text: theme === 'dark' ? 'text-pink-400' : 'text-pink-700',
      },
      indigo: {
        bg: theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50',
        border: theme === 'dark' ? 'border-indigo-500/30' : 'border-indigo-200',
        text: theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700',
      },
      gray: {
        bg: theme === 'dark' ? 'bg-gray-500/10' : 'bg-gray-50',
        border: theme === 'dark' ? 'border-gray-500/30' : 'border-gray-200',
        text: theme === 'dark' ? 'text-gray-400' : 'text-gray-700',
      },
    }
    return colorMap[CATEGORY_LABELS[category].color] || colorMap.gray
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className={headingColor}>Необходима авторизация</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 ${cardBg} shadow-xl border-2 ${
          theme === 'dark'
            ? 'border-blue-500/30 bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
            : 'border-blue-200 bg-gradient-to-br from-white via-blue-50/30 to-white'
        } relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                    : 'bg-gradient-to-br from-blue-500 to-purple-500'
                } text-white`}>
                  <Bell className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${headingColor} flex items-center gap-2`}>
                    Уведомления
                    <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </h1>
                  <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                    Все ваши уведомления в одном месте
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <div className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-red-500/20 border border-red-500/50' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className={`text-sm font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
                    {unreadCount} непрочитанных
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`${cardBg} rounded-xl border-2 ${borderColor} p-4 sm:p-6 shadow-lg`}>
          <div className="flex items-center gap-2 mb-4">
            <Filter className={`w-5 h-5 ${headingColor}`} />
            <h3 className={`text-lg font-bold ${headingColor}`}>Фильтры</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                selectedCategory === 'all'
                  ? theme === 'dark'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : 'bg-blue-50 border-blue-500 text-blue-700'
                  : `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              Все категории
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, { label, icon }]) => {
              const category = key as NotificationCategory
              const colors = getCategoryColor(category)
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 flex items-center gap-2 ${
                    selectedCategory === category
                      ? `${colors.bg} ${colors.border} ${colors.text}`
                      : `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`
                  }`}
                >
                  {icon}
                  {label}
                </button>
              )
            })}
            <button
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                showUnreadOnly
                  ? theme === 'dark'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-red-50 border-red-500 text-red-700'
                  : `${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              Только непрочитанные
            </button>
          </div>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleMarkAllAsRead}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
              }`}
            >
              <CheckCheck className="w-4 h-4" />
              Отметить все прочитанными
            </button>
          </div>
        )}

        {/* Notifications List */}
        {loading ? (
          <div className={`${cardBg} rounded-xl p-8 text-center ${headingColor}`}>
            <div className="animate-pulse">Загрузка...</div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className={`${cardBg} rounded-xl p-8 text-center border-2 ${borderColor}`}>
            <Bell className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg font-medium ${headingColor} mb-2`}>
              Нет уведомлений
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {showUnreadOnly
                ? 'Все уведомления прочитаны'
                : selectedCategory !== 'all'
                ? 'Нет уведомлений в этой категории'
                : 'У вас пока нет уведомлений'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const colors = getCategoryColor(notification.category)
              const categoryInfo = CATEGORY_LABELS[notification.category]

              return (
                <div
                  key={notification.id}
                  className={`${cardBg} rounded-xl border-2 ${borderColor} p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl ${
                    !notification.read
                      ? theme === 'dark'
                        ? 'bg-blue-500/5 border-blue-500/30'
                        : 'bg-blue-50 border-blue-200'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg ${colors.bg} ${colors.border} border-2 flex-shrink-0`}>
                      <span className="text-2xl">{notification.icon || categoryInfo.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className={`text-lg font-bold ${headingColor} mb-1`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm ${textColor}`}>
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} flex items-center gap-1`}>
                            {categoryInfo.icon}
                            {categoryInfo.label}
                          </span>
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: ru,
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                theme === 'dark'
                                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                              }`}
                              title="Отметить прочитанным"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {notification.actionUrl && (
                            <Link
                              to={notification.actionUrl}
                              onClick={() => handleNotificationClick(notification)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                theme === 'dark'
                                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50'
                                  : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                              }`}
                            >
                              Посмотреть
                            </Link>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                                : 'bg-red-50 hover:bg-red-100 text-red-700'
                            }`}
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

