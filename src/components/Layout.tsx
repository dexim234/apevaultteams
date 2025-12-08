// Main layout component with navigation and theme toggle
import { Link, useLocation } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import {
  Moon,
  Sun,
  Shield,
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
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import logo from '@/assets/logo.png'
import { useState, useEffect } from 'react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useThemeStore()
  const { isAdmin } = useAdminStore()
  const location = useLocation()
  const [showFunctionalityMenu, setShowFunctionalityMenu] = useState(false)
  const [showAboutMenu, setShowAboutMenu] = useState(false)

  const functionalitySubItems: { path: string; label: string; icon: LucideIcon }[] = [
    { path: '/management', label: 'Расписание', icon: Calendar },
    { path: '/earnings', label: 'Заработок', icon: DollarSign },
    { path: '/tasks', label: 'Задачи', icon: CheckSquare },
    { path: '/rating', label: 'Рейтинг', icon: TrendingUp },
  ]

  const aboutSubItems: { path: string; label: string; icon?: LucideIcon }[] = [
    { path: '/faq', label: 'FAQ', icon: Info },
    { path: '/about', label: 'О сообществе', icon: Info },
  ]

  const isFunctionalityActive = functionalitySubItems.some(item => location.pathname === item.path)
  const isFunctionalitySubItemActive = (path: string) => location.pathname === path
  const isAboutActive = aboutSubItems.some(item => location.pathname === item.path)

  useEffect(() => {
    setShowFunctionalityMenu(false)
    setShowAboutMenu(false)
  }, [location.pathname])

  return (
    <div className="app-shell">
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
              <Link
                to="/call"
                data-active={location.pathname === '/call'}
                className="nav-chip"
              >
                <Zap className="w-4 h-4" />
                <span>HUB</span>
                <ArrowUpRight className="w-4 h-4 opacity-70" />
              </Link>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowFunctionalityMenu(!showFunctionalityMenu)
                    setShowAboutMenu(false)
                  }}
                  data-active={isFunctionalityActive}
                  className="nav-chip"
                >
                  <Settings className="w-4 h-4" />
                  <span>Функционал</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFunctionalityMenu ? 'rotate-180' : ''}`} />
                </button>
                {showFunctionalityMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowFunctionalityMenu(false)} />
                    <div className="absolute top-[calc(100%+12px)] left-0 min-w-[220px] glass-panel rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl z-50 overflow-hidden">
                      <div className="accent-dots" />
                      <div className="relative z-10 divide-y divide-gray-100/60 dark:divide-white/5">
                        {functionalitySubItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setShowFunctionalityMenu(false)}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                              isFunctionalitySubItemActive(item.path)
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
                    setShowAboutMenu(!showAboutMenu)
                    setShowFunctionalityMenu(false)
                  }}
                  data-active={isAboutActive}
                  className="nav-chip"
                >
                  <Info className="w-4 h-4" />
                  <span>О нас</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAboutMenu ? 'rotate-180' : ''}`} />
                </button>
                {showAboutMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAboutMenu(false)} />
                    <div className="absolute top-[calc(100%+12px)] left-0 min-w-[220px] glass-panel rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl z-50 overflow-hidden">
                      <div className="accent-dots" />
                      <div className="relative z-10 divide-y divide-gray-100/60 dark:divide-white/5">
                        {aboutSubItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setShowAboutMenu(false)}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                              location.pathname === item.path
                                ? 'bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]'
                                : theme === 'dark'
                                ? 'hover:bg-white/5 text-gray-200'
                                : 'hover:bg-gray-50 text-gray-800'
                            }`}
                          >
                            {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                            <span className="font-semibold flex-1">{item.label}</span>
                            <ArrowUpRight className="w-4 h-4 opacity-70" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link
                to="/profile"
                data-active={location.pathname === '/profile'}
                className="nav-chip"
              >
                <User className="w-4 h-4" />
                <span>ЛК</span>
                <ArrowUpRight className="w-4 h-4 opacity-70" />
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  data-active={location.pathname === '/admin'}
                  className="nav-chip"
                >
                  <Shield className="w-4 h-4" />
                  <span>Админ</span>
                  <ArrowUpRight className="w-4 h-4 opacity-70" />
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-3 ml-auto">
              {isAdmin && (
                <div className="badge-glow px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hidden md:inline-flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Админ</span>
                </div>
              )}
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
          <div className="glass-panel rounded-2xl shadow-2xl border border-white/60 dark:border-white/10">
            <div className="grid grid-cols-4 divide-x divide-white/40 dark:divide-white/5">
              <Link
                to="/call"
                className={`flex flex-col items-center justify-center gap-1 py-3 ${location.pathname === '/call' ? 'text-[#4E6E49]' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <Zap className="w-5 h-5" />
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold">HUB</span>
                  <ArrowUpRight className="w-3 h-3 opacity-70" />
                </div>
              </Link>
              <button
                onClick={() => {
                  setShowFunctionalityMenu(!showFunctionalityMenu)
                  setShowAboutMenu(false)
                }}
                className={`flex flex-col items-center justify-center gap-1 py-3 ${isFunctionalityActive ? 'text-[#4E6E49]' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <Settings className="w-5 h-5" />
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold">Функционал</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </div>
              </button>
              <button
                onClick={() => {
                  setShowAboutMenu(!showAboutMenu)
                  setShowFunctionalityMenu(false)
                }}
                className={`flex flex-col items-center justify-center gap-1 py-3 ${isAboutActive ? 'text-[#4E6E49]' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <Info className="w-5 h-5" />
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold">О нас</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </div>
              </button>
              <Link
                to="/profile"
                className={`flex flex-col items-center justify-center gap-1 py-3 ${location.pathname === '/profile' ? 'text-[#4E6E49]' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <User className="w-5 h-5" />
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold">ЛК</span>
                  <ArrowUpRight className="w-3 h-3 opacity-70" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {showFunctionalityMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowFunctionalityMenu(false)}>
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[88%] max-w-sm glass-panel rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden">
            <div className="accent-dots" />
            <div className="relative z-10 divide-y divide-gray-100/60 dark:divide-white/5">
              {functionalitySubItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowFunctionalityMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    isFunctionalitySubItemActive(item.path)
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

      {showAboutMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setShowAboutMenu(false)}>
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[88%] max-w-sm glass-panel rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden">
            <div className="accent-dots" />
            <div className="relative z-10 divide-y divide-gray-100/60 dark:divide-white/5">
              {aboutSubItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowAboutMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-[#4E6E49]/15 to-[#4E6E49]/5 text-[#4E6E49] dark:from-[#4E6E49]/20 dark:text-[#4E6E49]'
                      : theme === 'dark'
                      ? 'hover:bg-white/5 text-gray-200'
                      : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
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
