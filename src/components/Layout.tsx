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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="ApeVault Logo" 
                className="w-10 h-10 object-contain"
              />
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ApeVault</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems
                .filter((item) => !item.adminOnly || isAdmin)
                .map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      location.pathname === item.path
                        ? item.adminOnly
                          ? 'bg-purple-600 text-white'
                          : 'bg-green-500 text-white'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.label}
                  </Link>
                ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Admin badge */}
              {isAdmin && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-purple-600 text-white rounded-lg">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Админ</span>
                </div>
              )}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
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

              {/* User info and logout */}
              <div className="flex items-center space-x-2">
                {(user?.name || isAdmin) && (
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user?.name || 'Администратор'}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile navigation */}
          <nav className="md:hidden pb-4 flex flex-wrap gap-2">
            {navItems
              .filter((item) => !item.adminOnly || isAdmin)
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    location.pathname === item.path
                      ? item.adminOnly
                        ? 'bg-purple-600 text-white'
                        : 'bg-green-500 text-white'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}



