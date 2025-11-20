// Main layout component with navigation and theme toggle
import { Link, useLocation } from 'react-router-dom'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { Moon, Sun, LogOut, Shield } from 'lucide-react'
import logo from '@/assets/logo.png'
import { useAuthStore } from '@/store/authStore'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useThemeStore()
  const { isAdmin, deactivateAdmin } = useAdminStore()
  const { logout, user } = useAuthStore()
  const location = useLocation()

  const handleLogout = () => {
    // Deactivate admin mode first
    if (isAdmin) {
      deactivateAdmin()
    }
    // Then logout
    logout()
  }

  const navItems: Array<{
    path: string
    label: string
    icon?: typeof Shield
    adminOnly?: boolean
  }> = [
    { path: '/call', label: 'Call' },
    { path: '/management', label: 'Management' },
    { path: '/earnings', label: 'Заработок' },
    { path: '/rating', label: 'Рейтинг' },
    { path: '/admin', label: 'Админ', icon: Shield, adminOnly: true },
    { path: '/about', label: 'О сообществе' },
    { path: '/faq', label: 'FAQ' },
  ]

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
              <img 
                src={logo} 
                alt="ApeVault Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain flex-shrink-0"
              />
              <h1 className={`text-base sm:text-xl font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ApeVault</h1>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1 flex-wrap">
              {navItems
                .filter((item) => !item.adminOnly || isAdmin)
                .map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 xl:px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 xl:gap-2 text-sm xl:text-base ${
                      location.pathname === item.path
                        ? item.adminOnly
                          ? 'bg-purple-600 text-white'
                          : 'bg-green-500 text-white'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon && <item.icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 flex-shrink-0" />}
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 ml-2 sm:ml-4">
              {/* Admin badge */}
              {isAdmin && (
                <div className="hidden sm:flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1 bg-purple-600 text-white rounded-lg">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm whitespace-nowrap">Админ</span>
                </div>
              )}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                )}
              </button>

              {/* User info and logout */}
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {(user?.name || isAdmin) && (
                  <span className={`hidden sm:inline text-xs sm:text-sm truncate max-w-[80px] md:max-w-none ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user?.name || 'Администратор'}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0 ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet navigation */}
          <nav className="lg:hidden pb-3 sm:pb-4 pt-2 border-t border-gray-700/30 dark:border-gray-700">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {navItems
                .filter((item) => !item.adminOnly || isAdmin)
                .map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-1.5 flex-shrink-0 touch-manipulation ${
                      location.pathname === item.path
                        ? item.adminOnly
                          ? 'bg-purple-600 text-white'
                          : 'bg-green-500 text-white'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700 active:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                    }`}
                  >
                    {item.icon && <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />}
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                ))}
              {isAdmin && (
                <div className="sm:hidden flex items-center space-x-1 px-2.5 py-1.5 bg-purple-600 text-white rounded-lg text-xs">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Админ</span>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {children}
      </main>
    </div>
  )
}



