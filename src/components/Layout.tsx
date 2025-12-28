// Main layout component with navigation and theme toggle
import { Link, useLocation } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore, ADMIN_PASSWORD } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { useUserActivity } from '@/hooks/useUserActivity'
import { getApprovalRequests, getTasks, getWorkSlots, checkUserAccess } from '@/services/firestoreService'
import { formatDate } from '@/utils/dateUtils'
import {
  Moon,
  Sun,
  CheckCircle2,
  Settings,
  Shield,
  Calendar,
  DollarSign,
  CheckSquare,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Info,
  ArrowUpRight,
  Bell,
  AlertTriangle,
  LogOut,
  ZapOff,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import logo from '@/assets/logo.png'
import { useState, useEffect } from 'react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useThemeStore()
  const { isAdmin, activateAdmin, deactivateAdmin } = useAdminStore()
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const [showToolsMenu, setShowToolsMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; status: string; timestamp?: number }[]>([])
  const [accessibleFeatures, setAccessibleFeatures] = useState<Set<string>>(new Set())

  // Track user activity
  useUserActivity()

  // Check user access to features
  useEffect(() => {
    const checkFeaturesAccess = async () => {
      if (!user || isAdmin) {
        // Admin has access to everything
        setAccessibleFeatures(new Set(['slots', 'earnings', 'tasks', 'rating', 'profile', 'admin']))
        return
      }

      const features = ['slots', 'earnings', 'tasks', 'rating', 'profile']
      const accessible = new Set<string>()

      for (const feature of features) {
        try {
          const accessResult = await checkUserAccess(user.id, feature)
          if (accessResult.hasAccess) {
            accessible.add(feature)
          }
        } catch (error) {
          console.error(`Error checking access to ${feature}:`, error)
          // Default to allow on error
          accessible.add(feature)
        }
      }

      setAccessibleFeatures(accessible)
    }

    checkFeaturesAccess()
  }, [user, isAdmin])

  const funcsSubItems: { path: string; label: string; icon: LucideIcon; feature?: string }[] = [
    { path: '/call', label: 'AVF HUB', icon: Calendar, feature: 'slots' },
    { path: '/management', label: 'AVF Schedule', icon: Calendar, feature: 'slots' },
    { path: '/tasks', label: 'AVF Tasks', icon: CheckSquare, feature: 'tasks' },
    { path: '/earnings', label: 'AVF Profit', icon: DollarSign, feature: 'earnings' },
    { path: '/rating', label: 'AVF Score', icon: TrendingUp, feature: 'rating' },
    { path: '/about', label: 'AVF NFO', icon: Info, feature: 'profile' },
    ...(isAdmin ? [{ path: '/approvals', label: 'AVF Check', icon: CheckCircle2, feature: 'admin' }] : []),
  ]

  // Filter accessible items
  const accessibleFuncsSubItems = funcsSubItems.filter(item =>
    !item.feature || accessibleFeatures.has(item.feature) || isAdmin
  )

  const toolsSubItems: { path: string; label: string; icon: LucideIcon }[] = [
    { path: '/meme-evaluation', label: 'Оценка мема', icon: TrendingUp },
    { path: '/ai-ao-alerts', label: 'ИИ - АО Alerts', icon: AlertTriangle },
  ]


  const isToolsActive = toolsSubItems.some(item => location.pathname === item.path)

  useEffect(() => {
    setShowToolsMenu(false)
  }, [location.pathname])

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // Убираем уведомления для админа
        if (isAdmin || !user) {
          setNotifications([])
          return
        }

        type NotificationItem = { id: string; text: string; time: string; status: string; timestamp: number }
        const notificationsList: NotificationItem[] = []
        const cutoff = Date.now() - 6 * 60 * 60 * 1000 // 6 hours
        const now = Date.now()
        const oneHourMs = 60 * 60 * 1000

        // Получаем просмотренные уведомления из localStorage
        const viewedKey = `viewedNotifications_${user.id}`
        const viewedIds = JSON.parse(localStorage.getItem(viewedKey) || '[]')

        // 1. Согласования
        const approvals = await getApprovalRequests()
        const approvalNotifications = approvals
          .filter((a) => {
            if (a.authorId !== user.id && a.targetUserId !== user.id) return false
            const ts = Date.parse(a.updatedAt || a.createdAt)
            if (Number.isNaN(ts) || ts < cutoff) return false
            if (viewedIds.includes(`approval_${a.id}`)) return false
            return true
          })
          .map((a) => {
            const timestamp = Date.parse(a.updatedAt || a.createdAt || new Date().toISOString())
            return {
              id: `approval_${a.id}`,
              status: a.status,
              text: `${a.entity === 'slot' ? 'Слот' : a.entity === 'status' ? 'Статус' : a.entity === 'login' ? 'Ник' : a.entity === 'earning' ? 'Заработок' : a.entity === 'referral' ? 'Реферал' : 'Изменение'} • ${a.status === 'approved' ? 'Подтверждено' : a.status === 'rejected' ? 'Отклонено' : 'На согласовании'}${a.adminComment ? `: ${a.adminComment}` : ''}`,
              time: formatDate(a.updatedAt || a.createdAt || new Date().toISOString(), 'dd.MM HH:mm'),
              timestamp: Number.isNaN(timestamp) ? now : timestamp,
            }
          })
        notificationsList.push(...approvalNotifications)

        // 2. Задачи
        const tasks = await getTasks({ assignedTo: user.id })
        const taskNotifications = tasks
          .filter((task) => {
            // Новые задачи (созданы за последние 6 часов)
            const createdAt = Date.parse(task.createdAt)
            const isNew = !Number.isNaN(createdAt) && createdAt >= cutoff && !viewedIds.includes(`task_new_${task.id}`)

            // Дедлайн за час или прошел
            if (!task.dueDate || !task.dueTime) return isNew

            const deadline = new Date(`${task.dueDate}T${task.dueTime}`)
            const deadlineMs = deadline.getTime()
            if (Number.isNaN(deadlineMs)) return isNew

            const diffMs = deadlineMs - now
            const isDueInHour = diffMs > 0 && diffMs <= oneHourMs && !viewedIds.includes(`task_due_${task.id}`)
            // Просроченные задачи показываем только если дедлайн прошел не более 6 часов назад
            const isOverdue = diffMs < 0 && diffMs >= -cutoff && !viewedIds.includes(`task_overdue_${task.id}`)

            return isNew || isDueInHour || isOverdue
          })
          .map((task) => {
            const createdAt = Date.parse(task.createdAt)
            const isNew = !Number.isNaN(createdAt) && createdAt >= cutoff && !viewedIds.includes(`task_new_${task.id}`)

            if (isNew) {
              const timestamp = Date.parse(task.createdAt)
              return {
                id: `task_new_${task.id}`,
                status: 'new',
                text: `Новая задача: ${task.title}`,
                time: formatDate(task.createdAt, 'dd.MM HH:mm'),
                timestamp: Number.isNaN(timestamp) ? now : timestamp,
              }
            }

            if (!task.dueDate || !task.dueTime) return null

            const deadline = new Date(`${task.dueDate}T${task.dueTime}`)
            const deadlineMs = deadline.getTime()
            if (Number.isNaN(deadlineMs)) return null

            const diffMs = deadlineMs - now
            if (diffMs > 0 && diffMs <= oneHourMs && !viewedIds.includes(`task_due_${task.id}`)) {
              return {
                id: `task_due_${task.id}`,
                status: 'due',
                text: `Дедлайн через час: ${task.title}`,
                time: formatDate(deadline.toISOString(), 'dd.MM HH:mm'),
                timestamp: deadlineMs,
              }
            }

            if (diffMs < 0 && diffMs >= -cutoff && !viewedIds.includes(`task_overdue_${task.id}`)) {
              return {
                id: `task_overdue_${task.id}`,
                status: 'overdue',
                text: `Просрочен дедлайн: ${task.title}`,
                time: formatDate(deadline.toISOString(), 'dd.MM HH:mm'),
                timestamp: deadlineMs,
              }
            }

            return null
          })
          .filter((n): n is { id: string; text: string; time: string; status: string; timestamp: number } => n !== null)
        notificationsList.push(...taskNotifications)

        // 3. Завершившиеся слоты
        const slots = await getWorkSlots(user.id)
        const slotNotifications = slots
          .filter((slot) => {
            if (viewedIds.includes(`slot_ended_${slot.id}`)) return false
            if (!slot.slots || slot.slots.length === 0) return false

            const lastSlot = slot.slots[slot.slots.length - 1]
            if (!lastSlot) return false

            // Вычисляем время окончания слота
            let slotEnd: Date
            if (lastSlot.endDate) {
              slotEnd = new Date(lastSlot.endDate)
              const [hours, minutes] = lastSlot.end.split(':').map(Number)
              slotEnd.setHours(hours, minutes, 0, 0)
            } else {
              slotEnd = new Date(slot.date)
              const [hours, minutes] = lastSlot.end.split(':').map(Number)
              slotEnd.setHours(hours, minutes, 0, 0)
            }

            const slotEndMs = slotEnd.getTime()
            if (Number.isNaN(slotEndMs)) return false

            // Слот завершился и это было за последние 6 часов
            return slotEndMs < now && slotEndMs >= (now - cutoff)
          })
          .map((slot) => {
            const lastSlot = slot.slots[slot.slots.length - 1]
            let slotEnd: Date
            if (lastSlot.endDate) {
              slotEnd = new Date(lastSlot.endDate)
              const [hours, minutes] = lastSlot.end.split(':').map(Number)
              slotEnd.setHours(hours, minutes, 0, 0)
            } else {
              slotEnd = new Date(slot.date)
              const [hours, minutes] = lastSlot.end.split(':').map(Number)
              slotEnd.setHours(hours, minutes, 0, 0)
            }

            return {
              id: `slot_ended_${slot.id}`,
              status: 'ended',
              text: `Слот завершился: ${formatDate(slot.date, 'dd.MM.yyyy')}`,
              time: formatDate(slotEnd.toISOString(), 'dd.MM HH:mm'),
              timestamp: slotEnd.getTime(),
            }
          })
        notificationsList.push(...slotNotifications)

        // Сортируем по времени (новые сверху)
        notificationsList.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

        // Убираем timestamp перед сохранением
        setNotifications(notificationsList.map(({ timestamp, ...rest }) => rest))
      } catch (err) {
        console.error('Failed to load notifications', err)
      }
    }

    loadNotifications()
    const id = setInterval(loadNotifications, 2 * 60 * 1000)
    return () => clearInterval(id)
  }, [user, isAdmin])


  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#0b0f17]' : 'bg-[#f8fafc]'}`}>
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-12 w-80 h-80 bg-gradient-to-br from-[#4E6E49]/25 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-8 right-0 w-[520px] h-[520px] bg-gradient-to-bl from-blue-500/12 via-purple-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-120px] left-12 w-96 h-96 bg-gradient-to-tr from-amber-400/10 to-[#4E6E49]/12 blur-3xl" />
        <div className="floating-grid" />
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Desktop Sidebar (Left) */}
        <aside className="hidden xl:flex w-72 h-screen fixed left-0 top-0 flex-col glass-panel border-r border-white/40 dark:border-white/10 z-50 overflow-hidden">
          <div className="accent-dots" />

          {/* Logo & Branding */}
          <div className="relative z-10 p-6 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg overflow-hidden flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`}>ApeVault</p>
              <p className={`text-sm font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>FRONTIER</p>
            </div>
          </div>

          {/* Utility Buttons */}
          <div className="relative z-10 px-6 pb-4 flex items-center gap-2">
            <button onClick={toggleTheme} className="flex-1 flex items-center justify-center p-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-gray-700" />}
            </button>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`flex-1 flex items-center justify-center relative p-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${showNotifications ? 'bg-amber-500/10' : ''}`}
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && <span className="absolute top-2 right-[35%] w-2 h-2 bg-red-500 rounded-full" />}
            </button>
          </div>

          {showNotifications && (
            <div className="mx-4 mb-4 p-3 glass-panel rounded-xl border border-white/20 shadow-xl max-h-60 overflow-y-auto space-y-2 relative z-20">
              {notifications.length === 0 ? (
                <p className="text-[10px] text-gray-500">Нет уведомлений</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="text-[10px] p-2 rounded-lg bg-black/5 dark:bg-white/5">
                    <p className="font-bold">{n.text}</p>
                    <p className="opacity-60">{n.time}</p>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200/50 dark:via-white/10 to-transparent my-2" />

          {/* Navigation */}
          <nav className="relative z-10 flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {/* Tools Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isToolsActive ? 'bg-[#4E6E49]/15 text-[#4E6E49]' : 'text-gray-500 hover:bg-gray-100/50 dark:hover:bg-white/5'}`}
              >
                <Settings className="w-4 h-4" />
                <span className="font-bold flex-1 text-left">Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showToolsMenu ? 'rotate-180' : ''}`} />
              </button>

              {showToolsMenu && (
                <div className="pl-11 pr-4 py-1 space-y-1">
                  {toolsSubItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block py-2 text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-[#4E6E49]' : 'text-gray-400 hover:text-[#4E6E49]'}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Flat Nav Items */}
            {accessibleFuncsSubItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-[#4E6E49] text-white shadow-lg shadow-[#4E6E49]/30' : 'text-gray-500 hover:bg-gray-100/50 dark:hover:bg-white/5 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </Link>
            ))}

          </nav>

          {/* User Profile & Actions */}
          <div className="relative z-10 m-4 space-y-2">
            <Link
              to="/profile"
              className={`p-4 rounded-2xl flex items-center gap-3 transition-all group ${location.pathname === '/profile' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/30' : 'border border-gray-200/50 dark:border-white/5 hover:bg-gray-100/50 dark:hover:bg-white/5'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${theme === 'dark' ? 'bg-emerald-500/20 text-[#4E6E49]' : 'bg-[#4E6E49]/10 text-[#4E6E49]'}`}>
                {user?.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> : getInitials(user?.name || 'User')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate dark:text-white">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-gray-500 font-medium truncate">{user?.login || 'admin@apevault.io'}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#4E6E49] transition-colors" />
            </Link>

            <div className="flex gap-2">
              <button
                onClick={logout}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Выйти</span>
              </button>

              {user?.name === 'Артём' && !isAdmin && (
                <button
                  onClick={() => activateAdmin(ADMIN_PASSWORD)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#4E6E49]/20 bg-[#4E6E49]/5 text-[#4E6E49] hover:bg-[#4E6E49]/10 transition-colors text-xs font-bold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Админ</span>
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={deactivateAdmin}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 transition-colors text-xs font-bold"
                >
                  <ZapOff className="w-3.5 h-3.5" />
                  <span>Стоп</span>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 xl:pl-72 min-h-screen">
          <main className="page-shell">
            {children}
          </main>
        </div>

        {/* Mobile Navbar */}
        <nav className="xl:hidden fixed bottom-4 left-0 right-0 px-3 z-50">
          <div className="max-w-5xl mx-auto">
            <div className="glass-panel rounded-2xl shadow-2xl border border-white/60 dark:border-white/10 overflow-hidden">
              <div className="flex divide-x divide-white/40 dark:divide-white/5 w-full overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setShowToolsMenu(!showToolsMenu)}
                  className={`flex-none w-20 flex flex-col items-center justify-center gap-1 py-3 ${isToolsActive ? 'text-[#4E6E49]' : 'text-gray-400'}`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Tools</span>
                </button>

                {accessibleFuncsSubItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex-none w-20 flex flex-col items-center justify-center gap-1 py-3 ${location.pathname === item.path ? 'text-[#4E6E49]' : 'text-gray-400'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold">{item.label.replace('AVF ', '')}</span>
                  </Link>
                ))}

                <Link
                  to="/profile"
                  className={`flex-none min-w-[120px] flex items-center gap-2 px-3 py-2 ${location.pathname === '/profile' ? 'text-[#4E6E49]' : 'text-gray-400'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#4E6E49]/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {getInitials(user?.name || 'AU')}
                  </div>
                  <div className="min-w-0 flex flex-col items-start px-1">
                    <span className="text-[10px] font-bold truncate w-full text-left">{user?.name || 'User'}</span>
                    <span className="text-[8px] opacity-60 truncate w-full text-left">{user?.login || 'id'}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Tools Overlay */}
          {showToolsMenu && (
            <>
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]" onClick={() => setShowToolsMenu(false)} />
              <div className="absolute bottom-20 left-4 right-4 glass-panel rounded-2xl border border-white/40 overflow-hidden animate-fade-in">
                {toolsSubItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowToolsMenu(false)}
                    className="flex items-center gap-3 p-4 border-b border-white/10 last:border-0"
                  >
                    <item.icon className="w-4 h-4 text-[#4E6E49]" />
                    <span className="font-bold text-sm flex-1">{item.label}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-40" />
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}
