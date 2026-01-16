import { Link, useLocation } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore, ADMIN_PASSWORD } from '@/store/adminStore'
import { useAuthStore } from '@/store/authStore'
import { useViewedUserStore, getEffectiveUserId } from '@/store/viewedUserStore'
import { useUserActivity } from '@/hooks/useUserActivity'
import { checkUserAccess } from '@/services/firestoreService'
import {
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  TrendingUp,
  Zap,
  Shield,
  DollarSign,
  AlertTriangle,
  ZapOff,
  Moon,
  Sun,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Info,
  Radio,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  CalendarDays,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import logo from '@/assets/logo.png'
import { useState, useEffect } from 'react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useThemeStore()
  const { isAdmin, activateAdmin, deactivateAdmin } = useAdminStore()
  const { user, logout } = useAuthStore()
  const { viewedUserId } = useViewedUserStore()
  const location = useLocation()
  const [showToolsMenu, setShowToolsMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    return saved === 'true'
  })
  const [notifications] = useState<{ id: string; text: string; time: string; status: string }[]>([])
  const [accessibleFeatures, setAccessibleFeatures] = useState<Set<string>>(new Set())
  const [isFeaturesLoading, setIsFeaturesLoading] = useState(true)

  // Get effective user ID (viewed user or current user)
  const effectiveUserId = getEffectiveUserId(user?.id, isAdmin, viewedUserId)

  // Track user activity
  useUserActivity()

  // Check user access to features
  useEffect(() => {
    const checkFeaturesAccess = async () => {
      setIsFeaturesLoading(true)
      try {
        if (!user || isAdmin) {
          setAccessibleFeatures(new Set(['slots', 'earnings', 'tasks', 'rating', 'profile', 'admin', 'tools', 'tools_strategies', 'tools_ai_ao_alerts', 'tools_our_deals_analysis']))
          return
        }

        const features = ['slots', 'earnings', 'tasks', 'rating', 'profile', 'about', 'tools', 'tools_strategies', 'tools_ai_ao_alerts', 'tools_our_deals_analysis', 'tools_events', 'avf_hub']
        const accessible = new Set<string>()

        for (const feature of features) {
          try {
            const accessResult = await checkUserAccess(effectiveUserId || '', feature)
            if (accessResult.hasAccess) {
              accessible.add(feature)
            }
          } catch (error) {
            accessible.add(feature)
          }
        }

        setAccessibleFeatures(accessible)
      } finally {
        setIsFeaturesLoading(false)
      }
    }

    checkFeaturesAccess()
  }, [user, isAdmin, effectiveUserId])

  const funcsSubItems: { path: string; label: string; icon: LucideIcon; feature?: string }[] = [
    { path: '/call', label: 'AVF HUB', icon: Radio, feature: 'avf_hub' },
    { path: '/management', label: 'AVF Schedule', icon: Calendar, feature: 'slots' },
    { path: '/tasks', label: 'AVF Tasks', icon: CheckSquare, feature: 'tasks' },
    { path: '/earnings', label: 'AVF Profit', icon: DollarSign, feature: 'earnings' },
    { path: '/rating', label: 'AVF Score', icon: TrendingUp, feature: 'rating' },
    { path: '/about', label: 'AVF INFO', icon: Info, feature: 'about' },
    ...(isAdmin ? [
      { path: '/approvals', label: 'AVF Check', icon: CheckCircle2, feature: 'admin' },
      { path: '/admin', label: 'AVF Admin', icon: Shield, feature: 'admin' },
    ] : []),
  ]

  const mobileFuncSubItems = funcsSubItems.filter(item =>
    (!item.feature || accessibleFeatures.has(item.feature) || isAdmin)
  )

  const toolsSubItems: { path: string; label: string; icon: LucideIcon; feature: string }[] = [
    { path: '/strategies', label: 'AVF Контур', icon: TrendingUp, feature: 'tools_strategies' },
    { path: '/ai-ao-alerts', label: 'Al AO ALERTS', icon: AlertTriangle, feature: 'tools_ai_ao_alerts' },
    { path: '/our-deals-analysis', label: 'Анализ наших сделок', icon: Zap, feature: 'tools_our_deals_analysis' },
    { path: '/events', label: 'События', icon: CalendarDays, feature: 'tools_events' },
  ]

  // Filter tools that user has access to
  const accessibleToolsSubItems = toolsSubItems.filter(item =>
    accessibleFeatures.has(item.feature) || isAdmin
  )

  const isToolsActive = toolsSubItems.some(item => location.pathname === item.path)

  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

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
        {/* Desktop Sidebar */}
        <aside className={`hidden xl:flex ${isCollapsed ? 'w-20' : 'w-72'} h-screen fixed left-0 top-0 flex-col glass-panel border-r border-white/40 dark:border-white/10 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCollapsed ? 'overflow-visible' : ''}`}>
          <div className="accent-dots" />

          <button
            onClick={toggleCollapsed}
            className={`absolute top-6 -right-0 transition-all duration-500 z-50 ${isCollapsed ? 'right-1/2 translate-x-1/2' : 'right-4'} p-2 rounded-xl bg-[#4E6E49]/10 hover:bg-[#4E6E49]/20 text-[#4E6E49] dark:text-gray-400 dark:hover:text-white border border-[#4E6E49]/20 dark:border-white/10 group`}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
            ) : (
              <PanelLeftClose className="w-5 h-5 transition-transform group-hover:scale-110" />
            )}
          </button>

          <div className={`p-6 pb-2 transition-all duration-500 origin-left overflow-hidden ${isCollapsed ? 'opacity-0 scale-90 w-0 px-0 translate-x-[-100%]' : 'opacity-100 scale-100'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src={logo}
                  alt="ApeVault"
                  className="w-9 h-9 object-contain rounded-xl filter drop-shadow-[0_0_8px_rgba(78,110,73,0.3)]"
                />
              </div>
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-sm font-black tracking-widest text-[#4E6E49] dark:text-white uppercase transition-opacity duration-300">ApeVault</span>
                <span className="text-[10px] font-bold text-gray-400 -mt-1 uppercase tracking-tighter transition-opacity duration-300">Frontier</span>
              </div>
            </div>
          </div>

          <div className={`relative z-10 px-6 pb-4 flex items-center gap-2 transition-all duration-500 ${isCollapsed ? 'flex-col px-4 items-center' : ''}`}>
            <button onClick={toggleTheme} className="flex-1 flex items-center justify-center p-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors w-full">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-gray-700" />}
            </button>
            {!isCollapsed && (
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`flex-1 flex items-center justify-center relative p-2 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors w-full ${showNotifications ? 'bg-amber-500/10' : ''}`}
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && <span className="absolute top-2 right-[35%] w-2 h-2 bg-red-500 rounded-full" />}
              </button>
            )}
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

          <div className={`h-px w-full bg-gradient-to-r from-transparent via-gray-200/50 dark:via-white/10 to-transparent my-2 transition-opacity duration-500 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`} />

          <nav className="relative z-10 flex-1 px-4 py-4 space-y-1 overflow-visible no-scrollbar">
            <>
              {/* Tools section - show immediately during loading */}
              {(isAdmin || accessibleFeatures.has('tools') || isFeaturesLoading) && (
                <div className="space-y-1 relative group/tools">
                  <button
                    onClick={() => !isCollapsed && setShowToolsMenu(!showToolsMenu)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isToolsActive ? 'bg-[#4E6E49]/15 text-[#4E6E49]' : 'text-gray-500 hover:bg-gray-100/50 dark:hover:bg-white/5'} ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Settings className={`w-4 h-4 transition-transform duration-500 ${isCollapsed ? 'group-hover/tools:rotate-90' : ''}`} />
                    {!isCollapsed && (
                      <>
                        <span className="font-bold flex-1 text-left">Tools</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showToolsMenu ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>

                  {isCollapsed && (
                    <div className="absolute left-full top-0 invisible group-hover/tools:visible opacity-0 group-hover/tools:opacity-100 transition-all duration-300 translate-x-3 group-hover/tools:translate-x-1 z-[100]">
                      <div className="ml-2 glass-panel border border-white/40 dark:border-white/10 rounded-2xl p-2 min-w-[200px] shadow-2xl backdrop-blur-2xl">
                        <div className="px-3 py-2 mb-1 border-b border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#4E6E49]">Инструменты</p>
                        </div>
                        {accessibleToolsSubItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${location.pathname === item.path ? 'bg-[#4E6E49] text-white' : 'text-gray-500 hover:bg-[#4E6E49]/10 hover:text-[#4E6E49]'}`}
                          >
                            <item.icon className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {showToolsMenu && !isCollapsed && (
                    <div className="absolute left-0 top-full mt-1 pl-4 pr-2 py-2 glass-panel border border-white/40 dark:border-white/10 rounded-xl shadow-2xl backdrop-blur-2xl z-[100] min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 mb-1 border-b border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#4E6E49]">Инструменты</p>
                      </div>
                      {accessibleToolsSubItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${location.pathname === item.path ? 'bg-[#4E6E49] text-white' : 'text-gray-500 hover:bg-[#4E6E49]/10 hover:text-[#4E6E49]'}`}
                        >
                          <item.icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Function items - show immediately, filter by access after loading */}
              {funcsSubItems
                .filter(item => {
                  // Admin sees everything
                  if (isAdmin) return true
                  // During loading, show all; after loading, filter
                  if (isFeaturesLoading) return true
                  // After loading, filter by feature access
                  return !item.feature || accessibleFeatures.has(item.feature)
                })
                .map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === item.path ? 'bg-[#4E6E49] text-white shadow-lg shadow-[#4E6E49]/30' : 'text-gray-500 hover:bg-gray-100/50 dark:hover:bg-white/5 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'} ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {!isCollapsed && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
                  </Link>
                ))}
            </>
          </nav>

          <div className={`relative z-10 m-4 space-y-2 transition-all duration-500 ${isCollapsed ? 'm-2 space-y-4' : ''}`}>
            <Link
              to="/profile"
              className={`p-4 rounded-2xl flex items-center gap-3 transition-all group ${location.pathname === '/profile' ? 'bg-[#4E6E49]/10 border border-[#4E6E49]/30' : 'border border-gray-200/50 dark:border-white/5 hover:bg-gray-100/50 dark:hover:bg-white/5'} ${isCollapsed ? 'p-0 h-12 w-12 items-center justify-center mx-auto border-0' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[#4E6E49] font-bold shadow-inner shrink-0 ${theme === 'dark' ? 'bg-emerald-500/20 text-[#4E6E49]' : 'bg-[#4E6E49]/10 text-[#4E6E49]'}`}>
                {user?.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> : getInitials(user?.name || 'User')}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate dark:text-white">{user?.name || 'Administrator'}</p>
                    <p className="text-[10px] text-gray-500 font-medium truncate">{user?.login || 'admin@apevault.io'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#4E6E49] transition-colors" />
                </>
              )}
            </Link>

            <div className={`flex gap-2 transition-all duration-500 ${isCollapsed ? 'flex-col gap-4 px-2' : 'flex-col gap-4 px-2'}`}>
              <button
                onClick={() => {
                  logout()
                  deactivateAdmin()
                  window.location.href = '/login'
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold ${isCollapsed ? 'w-10 h-10 px-0 border-0' : 'w-full'}`}
              >
                <LogOut className="w-3.5 h-3.5" />
                {!isCollapsed && <span>Выйти</span>}
              </button>

              {user?.name === 'Артём' && !isAdmin && (
                <button
                  onClick={() => activateAdmin(ADMIN_PASSWORD)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#4E6E49]/20 bg-[#4E6E49]/5 text-[#4E6E49] hover:bg-[#4E6E49]/10 transition-colors text-xs font-bold ${isCollapsed ? 'w-10 h-10 px-0 border-0' : 'w-full'}`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  {!isCollapsed && <span>Админ</span>}
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={deactivateAdmin}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 transition-colors text-xs font-bold ${isCollapsed ? 'w-10 h-10 px-0 border-0' : 'w-full'}`}
                >
                  <ZapOff className="w-3.5 h-3.5" />
                  {!isCollapsed && <span>Стоп</span>}
                </button>
              )}
            </div>
          </div>
        </aside>

        <div className={`flex-1 ${isCollapsed ? 'xl:pl-20' : 'xl:pl-72'} min-h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}>
          <main className="page-shell lg:pb-14 pb-6 lg:pt-3 transition-all duration-300">
            <div className="xl:hidden h-[65px]"></div> {/* Spacer for mobile header */}
            {children}
          </main>
        </div>

        {/* Mobile Header with Burger */}
        <div className={`xl:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 border-b flex items-center justify-between transition-colors duration-300 backdrop-blur-xl ${theme === 'dark'
          ? 'bg-[#0b0f17]/80 border-white/10'
          : 'bg-white/80 border-gray-200'
          }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                src={logo}
                alt="ApeVault"
                className="w-7 h-7 object-contain rounded-xl filter drop-shadow-[0_0_8px_rgba(78,110,73,0.3)]"
              />
            </div>
            <span className={`text-sm font-black tracking-widest uppercase ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ApeVault</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`p-2 rounded-xl transition-colors ${theme === 'dark'
              ? 'bg-[#4E6E49]/10 text-white hover:bg-[#4E6E49]/20'
              : 'bg-[#4E6E49]/10 text-[#4E6E49] hover:bg-[#4E6E49]/20'
              }`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className={`fixed inset-0 z-[100] flex flex-col animate-in slide-in-from-right duration-300 ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-white'}`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="ApeVault"
                    className="w-7 h-7 object-contain rounded-xl"
                  />
                </div>
                <span className={`text-sm font-black tracking-widest uppercase ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Menu</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Profile Section */}
              <div className={`flex items-center gap-3 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[#4E6E49] font-bold`}>
                  {user?.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover" /> : getInitials(user?.name || 'User')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user?.name || 'Guest'}</p>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-xs text-[#4E6E49] hover:underline">
                    Перейти в профиль
                  </Link>
                </div>
              </div>

              {/* Tools Section */}
              {(isAdmin || accessibleFeatures.has('tools')) && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">Инструменты</p>
                  <div className="grid grid-cols-2 gap-3">
                    {accessibleToolsSubItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${location.pathname === item.path ? 'border-[#4E6E49]/50 bg-[#4E6E49]/10' : theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}
                      >
                        <item.icon className={`w-6 h-6 ${location.pathname === item.path ? 'text-[#4E6E49]' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Functions Section */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 pt-2">Функции</p>
                <div className="space-y-2">
                  {mobileFuncSubItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-[#4E6E49] text-white shadow-lg' : theme === 'dark' ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold text-sm">{item.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center justify-between p-4 rounded-xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}
              >
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Тема оформления</span>
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-gray-600" />}
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  logout()
                  deactivateAdmin()
                  window.location.href = '/login'
                }}
                className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl border font-bold ${theme === 'dark' ? 'border-red-500/20 bg-red-500/10 text-red-500' : 'border-red-200 bg-red-50 text-red-600'}`}
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти из аккаунта</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
