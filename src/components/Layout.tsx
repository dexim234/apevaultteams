// Main layout component with navigation and theme toggle
import { Link, useLocation } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { useUserActivity } from '@/hooks/useUserActivity'
import { getApprovalRequests, getTasks, getWorkSlots } from '@/services/firestoreService'
import { formatDate } from '@/utils/dateUtils'
import {
  Moon,
  Sun,
  CheckCircle2,
  Zap,
  Settings,
  Calendar,
  DollarSign,
  CheckSquare,
  TrendingUp,
  User,
  ChevronDown,
  Info,
  ArrowUpRight,
  Bell,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import logo from '@/assets/logo.png'
import { useState, useEffect } from 'react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const { user } = useAuthStore()
  const location = useLocation()
  const [showFuncsMenu, setShowFuncsMenu] = useState(false)
  const [showToolsMenu, setShowToolsMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; status: string; timestamp?: number }[]>([])
  
  // Track user activity
  useUserActivity()


  const funcsSubItems: { path: string; label: string; icon: LucideIcon }[] = [
    { path: '/call', label: 'HUB', icon: Zap },
    { path: '/management', label: 'Schedule', icon: Calendar },
    { path: '/tasks', label: 'Task', icon: CheckSquare },
    { path: '/earnings', label: 'Profit', icon: DollarSign },
    { path: '/rating', label: 'Score', icon: TrendingUp },
    ...(isAdmin ? [{ path: '/approvals', label: 'Согласования', icon: CheckCircle2 }] : []),
  ]

  const toolsSubItems: { path: string; label: string; icon: LucideIcon }[] = [
    { path: '/meme-evaluation', label: 'Оценка мема', icon: TrendingUp },
  ]

  const isFuncsActive = funcsSubItems.some(item => location.pathname === item.path)
  const isFuncsSubItemActive = (path: string) => location.pathname === path

  const isToolsActive = toolsSubItems.some(item => location.pathname === item.path)
  const isToolsSubItemActive = (path: string) => location.pathname === path

  useEffect(() => {
    setShowFuncsMenu(false)
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

  const handleCloseNotifications = () => {
    // При закрытии сохраняем ID всех текущих уведомлений как просмотренные
    if (notifications.length > 0) {
      const viewedKey = `viewedNotifications_${user?.id || 'admin'}`
      const existing = JSON.parse(localStorage.getItem(viewedKey) || '[]')
      const newIds = notifications.map(n => n.id)
      const updated = [...new Set([...existing, ...newIds])]
      localStorage.setItem(viewedKey, JSON.stringify(updated))
      setNotifications([])
    }
    setShowNotifications(false)
  }

  return (
    <div className="app-shell">

      {/* Permanent protection notice */}
      <div className="fixed bottom-2 right-2 z-50">
        <div className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
          theme === 'dark'
            ? 'bg-black/50 border-white/20 text-white/70'
            : 'bg-white/50 border-gray-300 text-gray-600'
        }`}>
          🔒 Защищено от скриншотов
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-12 w-80 h-80 bg-gradient-to-br from-[#4E6E49]/25 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-8 right-0 w-[520px] h-[520px] bg-gradient-to-bl from-blue-500/12 via-purple-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-120px] left-12 w-96 h-96 bg-gradient-to-tr from-amber-400/10 to-[#4E6E49]/12 blur-3xl" />
        <div className="floating-grid" />
      </div>

      <header className="sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 pb-2">
          <div className="glass-panel rounded-2xl px-4 lg:px-6 py-3 flex items-center gap-4 shadow-2xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg overflow-hidden flex items-center justify-center">
                <img src={logo} alt="ApeVault Logo" className="w-10 h-10 object-contain" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5" />
              </div>
              <div className="leading-tight">
                <p className={`text-xs uppercase tracking-[0.16em] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  ApeVault Black Ops
                </p>
                <p className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Панель команды
                </p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowToolsMenu(!showToolsMenu)
                  }}
                  data-active={isToolsActive}
                  className="nav-chip"
                >
                  <Settings className="w-4 h-4" />
                  <span>Tools</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showToolsMenu ? 'rotate-180' : ''}`} />
                </button>
                {showToolsMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowToolsMenu(false)} />
                    <div className="absolute top-[calc(100%+12px)] left-0 min-w-[220px] glass-panel rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl z-50 overflow-hidden">
                      <div className="accent-dots" />
                      <div className="relative z-10 divide-y divide-gray-100/60 dark:divide-white/5">
                        {toolsSubItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setShowToolsMenu(false)}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                              isToolsSubItemActive(item.path)
                                ? 'bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]'
                                : theme === 'dark'
                                ? 'hover:bg-white/5 text-gray-200'
                                : 'hover:bg-gray-50 text-gray-800'
                            }`}
                          >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="font-semibold flex-1">{item.label}</span>
                          <ArrowUpRight className="w-4 h-4 opacity-70" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowFuncsMenu(!showFuncsMenu)
                  }}
                  data-active={isFuncsActive}
                  className="nav-chip"
                >
                  <Settings className="w-4 h-4" />
                  <span>Funcs</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFuncsMenu ? 'rotate-180' : ''}`} />
                </button>
                {showFuncsMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowFuncsMenu(false)} />
                    <div className="absolute top-[calc(100%+12px)] left-0 min-w-[220px] glass-panel rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl z-50 overflow-hidden">
                      <div className="accent-dots" />
                      <div className="relative z-10 divide-y divide-gray-100/60 dark:divide-white/5">
                        {funcsSubItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setShowFuncsMenu(false)}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                              isFuncsSubItemActive(item.path)
                                ? 'bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]'
                                : theme === 'dark'
                                ? 'hover:bg-white/5 text-gray-200'
                                : 'hover:bg-gray-50 text-gray-800'
                            }`}
                          >
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span className="font-semibold flex-1">{item.label}</span>
                          <ArrowUpRight className="w-4 h-4 opacity-70" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!isAdmin && (
                <Link
                  to="/about"
                  data-active={location.pathname === '/about'}
                  className="nav-chip"
                >
                  <Info className="w-4 h-4" />
                  <span>Info</span>
                  <ArrowUpRight className="w-4 h-4 opacity-70" />
                </Link>
              )}

              <Link
                to="/profile"
                data-active={location.pathname === '/profile'}
                className="nav-chip"
              >
                <User className="w-4 h-4" />
                <span>ACCT</span>
                <ArrowUpRight className="w-4 h-4 opacity-70" />
              </Link>
              {isAdmin && (
                <Link
                  to="/approvals"
                  data-active={location.pathname === '/approvals'}
                  className="nav-chip"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Согласования</span>
                  <ArrowUpRight className="w-4 h-4 opacity-70" />
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3 ml-auto relative">
              <div className="relative">
                <button
                  onClick={() => {
                    if (showNotifications) {
                      handleCloseNotifications()
                    } else {
                      setShowNotifications(true)
                    }
                  }}
                  className="nav-chip px-3 py-2"
                  data-active={showNotifications}
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={handleCloseNotifications} />
                    <div className={`absolute right-0 mt-2 w-80 max-w-[88vw] glass-panel rounded-2xl border border-white/60 dark:border-white/10 shadow-2xl z-50 overflow-hidden`}>
                      <div className="p-4 space-y-2 max-h-[360px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-sm text-gray-600 dark:text-gray-300">Новых уведомлений нет (храним до 6 часов).</p>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className="rounded-xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-white/5 p-3 space-y-1">
                              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{n.time}</div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{n.text}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={toggleTheme}
                className="nav-chip px-3 py-2"
                data-active="false"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="page-shell">
        {children}
      </main>

      <nav className="lg:hidden fixed bottom-4 left-0 right-0 px-3 z-50">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-2xl shadow-2xl border border-white/60 dark:border-white/10 overflow-hidden">
            <div className="flex divide-x divide-white/40 dark:divide-white/5 w-full">
              <button
                onClick={() => {
                  setShowToolsMenu(!showToolsMenu)
                }}
                className={`flex-1 h-full flex flex-col items-center justify-center gap-1 py-3 ${isToolsActive ? 'text-[#4E6E49]' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <Settings className="w-5 h-5" />
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold">Tools</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </div>
              </button>
              <button
                onClick={() => {
                  setShowFuncsMenu(!showFuncsMenu)
                }}
                className={`flex-1 h-full flex flex-col items-center justify-center gap-1 py-3 ${isFuncsActive ? 'text-[#4E6E49]' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <Settings className="w-5 h-5" />
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold">Funcs</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </div>
              </button>
              {!isAdmin && (
                <Link
                  to="/about"
                  className={`flex-1 h-full flex flex-col items-center justify-center gap-1 py-3 ${location.pathname === '/about' ? 'text-[#4E6E49]' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  <Info className="w-5 h-5" />
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-semibold">Info</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70" />
                  </div>
                </Link>
              )}
              <Link
                to="/profile"
                className={`flex-1 h-full flex flex-col items-center justify-center gap-1 py-3 ${location.pathname === '/profile' ? 'text-[#4E6E49]' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <User className="w-5 h-5" />
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold">ACCT</span>
                  <ArrowUpRight className="w-3 h-3 opacity-70" />
                </div>
              </Link>
              {isAdmin && (
                <Link
                  to="/approvals"
                  className={`flex-1 h-full flex flex-col items-center justify-center gap-1 py-3 ${location.pathname === '/approvals' ? 'text-[#4E6E49]' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-semibold whitespace-nowrap">Check</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showFuncsMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowFuncsMenu(false)}>
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[88%] max-w-sm glass-panel rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden">
            <div className="accent-dots" />
            <div className="relative z-10 divide-y divide-gray-100/60 dark:divide-white/5">
              {funcsSubItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowFuncsMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isFuncsSubItemActive(item.path)
                      ? 'bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]'
                      : theme === 'dark'
                      ? 'hover:bg-white/5 text-gray-200'
                      : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold flex-1">{item.label}</span>
                <ArrowUpRight className="w-4 h-4 opacity-70" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {showToolsMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowToolsMenu(false)}>
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[88%] max-w-sm glass-panel rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden">
            <div className="accent-dots" />
            <div className="relative z-10 divide-y divide-gray-100/60 dark:divide-white/5">
              {toolsSubItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowToolsMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isToolsSubItemActive(item.path)
                      ? 'bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]'
                      : theme === 'dark'
                      ? 'hover:bg-white/5 text-gray-200'
                      : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold flex-1">{item.label}</span>
                <ArrowUpRight className="w-4 h-4 opacity-70" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
