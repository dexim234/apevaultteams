// Main layout component with navigation and theme toggle
import { Link, useLocation } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { Moon, Sun, Shield, Zap, Settings, Calendar, DollarSign, CheckSquare, TrendingUp, Info, HelpCircle, User, ChevronDown } from 'lucide-react'
import logo from '@/assets/logo.png'
import { useAuthStore } from '@/store/authStore'
import { useState, useEffect } from 'react'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useThemeStore()
  const { isAdmin, deactivateAdmin } = useAdminStore()
  const { user } = useAuthStore()
  const location = useLocation()
  const [showFunctionalityMenu, setShowFunctionalityMenu] = useState(false)

  const mainNavItems = [
    { path: '/call', label: 'Call', icon: Zap },
    { path: '/about', label: 'О сообществе', icon: Info },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/profile', label: 'ЛК', icon: User },
  ]

  const functionalitySubItems = [
    { path: '/management', label: 'Расписание', icon: Calendar },
    { path: '/earnings', label: 'Заработок', icon: DollarSign },
    { path: '/tasks', label: 'Задачи', icon: CheckSquare },
    { path: '/rating', label: 'Рейтинг', icon: TrendingUp },
  ]

  const isFunctionalityActive = functionalitySubItems.some(item => location.pathname === item.path)
  const isFunctionalitySubItemActive = (path: string) => location.pathname === path

  // Close menu when route changes
  useEffect(() => {
    setShowFunctionalityMenu(false)
  }, [location.pathname])

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} pb-20 lg:pb-0`}>
      {/* Header - Desktop */}
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-50 hidden lg:block`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
              <img 
                src={logo} 
                alt="ApeVault Logo" 
                className="w-10 h-10 object-contain flex-shrink-0"
              />
              <h1 className={`text-xl font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ApeVault</h1>
            </div>

            {/* Navigation - Desktop */}
            <nav className="flex items-center space-x-1 flex-wrap">
              {/* Call */}
              <Link
                to="/call"
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-base ${
                  location.pathname === '/call'
                    ? 'bg-green-500 text-white'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span>Call</span>
              </Link>

              {/* Функционал с подменю */}
              <div className="relative">
                <button
                  onClick={() => setShowFunctionalityMenu(!showFunctionalityMenu)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-base ${
                    isFunctionalityActive
                      ? 'bg-green-500 text-white'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span>Функционал</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFunctionalityMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showFunctionalityMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowFunctionalityMenu(false)}
                    />
                    <div className={`absolute top-full left-0 mt-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl border-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[200px] z-50`}>
                      {functionalitySubItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowFunctionalityMenu(false)}
                          className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                            isFunctionalitySubItemActive(item.path)
                              ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                              : theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                          } ${item.path === functionalitySubItems[0].path ? 'rounded-t-lg' : ''} ${item.path === functionalitySubItems[functionalitySubItems.length - 1].path ? 'rounded-b-lg' : ''}`}
                        >
                          <item.icon className="w-4 h-4 flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* О сообществе */}
              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-base ${
                  location.pathname === '/about'
                    ? 'bg-green-500 text-white'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>О сообществе</span>
              </Link>

              {/* FAQ */}
              <Link
                to="/faq"
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-base ${
                  location.pathname === '/faq'
                    ? 'bg-green-500 text-white'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-4 h-4 flex-shrink-0" />
                <span>FAQ</span>
              </Link>

              {/* ЛК */}
              <Link
                to="/profile"
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-base ${
                  location.pathname === '/profile'
                    ? 'bg-green-500 text-white'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-4 h-4 flex-shrink-0" />
                <span>ЛК</span>
              </Link>

              {/* Admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-base ${
                    location.pathname === '/admin'
                      ? 'bg-purple-600 text-white'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>Админ</span>
                </Link>
              )}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-4 ml-4">
              {/* Admin badge */}
              {isAdmin && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-purple-600 text-white rounded-lg">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm whitespace-nowrap">Админ</span>
                </div>
              )}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {children}
      </main>

      {/* Mobile Navigation - Bottom */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-t-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-2xl z-50`}>
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-around h-16">
            {/* Call */}
            <Link
              to="/call"
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors touch-manipulation ${
                location.pathname === '/call'
                  ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span className="text-xs font-medium">Call</span>
            </Link>

            {/* Функционал */}
            <div className="relative">
              <button
                onClick={() => setShowFunctionalityMenu(!showFunctionalityMenu)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors touch-manipulation ${
                  isFunctionalityActive
                    ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs font-medium">Функционал</span>
              </button>
              
              {showFunctionalityMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/50"
                    onClick={() => setShowFunctionalityMenu(false)}
                  />
                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl border-2 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} min-w-[200px] z-50`}>
                    {functionalitySubItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowFunctionalityMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                          isFunctionalitySubItemActive(item.path)
                            ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                            : theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                        } ${item.path === functionalitySubItems[0].path ? 'rounded-t-lg' : ''} ${item.path === functionalitySubItems[functionalitySubItems.length - 1].path ? 'rounded-b-lg' : ''}`}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* О сообществе */}
            <Link
              to="/about"
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors touch-manipulation ${
                location.pathname === '/about'
                  ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <Info className="w-5 h-5" />
              <span className="text-xs font-medium">О нас</span>
            </Link>

            {/* FAQ */}
            <Link
              to="/faq"
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors touch-manipulation ${
                location.pathname === '/faq'
                  ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-xs font-medium">FAQ</span>
            </Link>

            {/* ЛК */}
            <Link
              to="/profile"
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors touch-manipulation ${
                location.pathname === '/profile'
                  ? theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-50 text-green-700'
                  : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">ЛК</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
