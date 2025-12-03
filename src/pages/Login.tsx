// Login page component
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { Moon, Sun, Shield, Sparkles, User, Users } from 'lucide-react'
import logo from '@/assets/logo.png'

// Declare Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string
        initDataUnsafe?: {
          user?: {
            id: number
            first_name?: string
            last_name?: string
            username?: string
          }
        }
        ready: () => void
        expand: () => void
      }
    }
  }
}

type UserType = 'member' | 'admin'

export const Login = () => {
  const [userType, setUserType] = useState<UserType>('member')
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login: loginUser, user, isAuthenticated } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { activateAdmin } = useAdminStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Apply theme to body on mount and theme change
  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Check for Telegram Mini App authentication
  useEffect(() => {
    // Check if already authenticated
    if (isAuthenticated && user) {
      navigate('/management')
      return
    }

    // Check if we're in Telegram Mini App
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
      
      // Try to get initData from URL params first (for deep links)
      const initDataFromUrl = searchParams.get('tgWebAppData')
      const initData = initDataFromUrl || window.Telegram.WebApp.initData
      
      // Also check for login/password in URL params (from bot)
      const loginFromUrl = searchParams.get('login')
      const passwordFromUrl = searchParams.get('password')
      
      if (loginFromUrl && passwordFromUrl) {
        // Auto-login with credentials from bot
        const success = loginUser(loginFromUrl, passwordFromUrl)
        if (success) {
          navigate('/management')
          return
        }
      }
      
      if (initData) {
        try {
          // Parse initData to extract user info
          // Format: user=%7B%22id%22%3A123456789%2C...%7D
          const params = new URLSearchParams(initData)
          const userParam = params.get('user')
          
          if (userParam) {
            const userData = JSON.parse(decodeURIComponent(userParam))
            const telegramUserId = userData.id
            
            // Store telegram user ID for later use
            sessionStorage.setItem('telegram_user_id', String(telegramUserId))
            
            // Try to get saved credentials from localStorage (from previous session)
            const savedAuth = localStorage.getItem('apevault-auth')
            if (savedAuth) {
              try {
                const parsed = JSON.parse(savedAuth)
                if (parsed.state?.user) {
                  // Auto-login with saved credentials
                  const savedUser = parsed.state.user
                  const success = loginUser(savedUser.login, savedUser.password)
                  if (success) {
                    navigate('/management')
                    return
                  }
                }
              } catch (err) {
                console.error('Error parsing saved auth:', err)
              }
            }
            
            console.log('Telegram Mini App detected, user ID:', telegramUserId)
            // User needs to login manually or bot should pass credentials
          }
        } catch (err) {
          console.error('Error parsing Telegram initData:', err)
        }
      }
      
      // Also try initDataUnsafe for simpler access
      const unsafeUser = window.Telegram.WebApp.initDataUnsafe?.user
      if (unsafeUser) {
        sessionStorage.setItem('telegram_user_id', String(unsafeUser.id))
        console.log('Telegram user detected:', unsafeUser.first_name)
      }
    }
  }, [searchParams, isAuthenticated, user, navigate, loginUser])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password) {
      setError('Пожалуйста, введите пароль')
      return
    }

    if (userType === 'admin') {
      // Admin login - only password needed
      const adminSuccess = activateAdmin(password)
      if (adminSuccess) {
        // Admin login successful - no need to set user, just navigate
        navigate('/management')
      } else {
        setError('Неверный пароль администратора')
      }
    } else {
      // Member login - login and password needed
      if (!login) {
        setError('Пожалуйста, введите логин')
        return
      }
      const success = loginUser(login, password)
      if (success) {
        navigate('/management')
      } else {
        setError('Неверный логин или пароль')
      }
    }
  }

  const handleThemeToggle = () => {
    toggleTheme()
  }

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden ${theme === 'dark' ? 'bg-[#0A0A0A]' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'}`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${theme === 'dark' ? 'bg-[#4E6E49]' : 'bg-[#4E6E49]'}`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
      </div>

      {/* Theme toggle button - floating */}
      <button
        onClick={handleThemeToggle}
        className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 shadow-lg hover:scale-110 z-10 ${
          theme === 'dark' 
            ? 'bg-[#1a1a1a] hover:bg-gray-700 text-yellow-400 border border-gray-800' 
            : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
        }`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-6 h-6" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </button>

      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-sm border relative z-10 ${
        theme === 'dark' 
          ? 'bg-[#1a1a1a]/90 border-gray-800' 
          : 'bg-white/90 border-gray-200'
      }`}>
        {/* Logo and header with decorative elements */}
        <div className="text-center mb-8 relative">
          {/* Sparkle decorations */}
          <div className="absolute -top-4 -left-4 animate-pulse">
            <Sparkles className={`w-6 h-6 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'} opacity-60`} />
          </div>
          <div className="absolute -top-4 -right-4 animate-pulse delay-300">
            <Sparkles className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} opacity-60`} />
          </div>
          
          <div className="mx-auto mb-6 flex justify-center relative">
            <div className={`p-4 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-br from-green-50 to-blue-50'}`}>
              <img 
                src={logo} 
                alt="ApeVault Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
          <h1 className={`text-4xl font-bold mb-3 bg-gradient-to-r ${
            theme === 'dark' 
              ? 'from-[#4E6E49] to-blue-400 text-transparent bg-clip-text' 
              : 'from-[#4E6E49] to-blue-600 text-transparent bg-clip-text'
          }`}>
            ApeVault
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className={`w-5 h-5 ${theme === 'dark' ? 'text-[#4E6E49]' : 'text-[#4E6E49]'}`} />
            <p className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Командная панель управления
            </p>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Выберите тему оформления перед входом
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User type selection */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Тип пользователя
            </label>
            <div className={`grid grid-cols-2 gap-3 p-1 rounded-xl ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setUserType('member')
                  setLogin('')
                  setPassword('')
                  setError('')
                }}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  userType === 'member'
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white shadow-lg'
                      : 'bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white shadow-lg'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Участник</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserType('admin')
                  setLogin('')
                  setPassword('')
                  setError('')
                }}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  userType === 'admin'
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>Админ</span>
              </button>
            </div>
          </div>

          {/* Login field - only for members */}
          {userType === 'member' && (
            <div>
              <label htmlFor="login" className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <User className="w-4 h-4 inline mr-2" />
                Логин
              </label>
              <div className="relative">
                <input
                  id="login"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700/50 border-gray-800 text-white placeholder-gray-500 focus:border-[#4E6E49]'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#4E6E49]'
                  } focus:outline-none focus:ring-4 focus:ring-[#4E6E49]/20`}
                  placeholder="Введите ваш логин"
                  autoComplete="username"
                />
              </div>
            </div>
          )}

          {/* Password field */}
          <div>
            <label htmlFor="password" className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <Shield className="w-4 h-4 inline mr-2" />
              Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-800 text-white placeholder-gray-500 focus:border-[#4E6E49]'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#4E6E49]'
                } focus:outline-none focus:ring-4 focus:ring-[#4E6E49]/20`}
                placeholder={userType === 'admin' ? 'Введите пароль администратора' : 'Введите ваш пароль'}
                autoComplete={userType === 'admin' ? 'off' : 'current-password'}
              />
            </div>
            {userType === 'admin' && (
              <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Для входа в режим администратора требуется специальный пароль
              </p>
            )}
          </div>

          {error && (
            <div className={`p-4 rounded-xl border-2 ${
              theme === 'dark' 
                ? 'bg-red-500/20 border-red-500 text-red-400' 
                : 'bg-red-50 border-red-300 text-red-700'
            } text-sm font-medium animate-shake`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] hover:from-[#4E6E49] hover:to-[#4E6E49] text-white'
                : 'bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] hover:from-[#4E6E49] hover:to-[#4E6E49] text-white'
            }`}
          >
            Войти в систему
          </button>
        </form>

        {/* Footer info */}
        <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} text-center`}>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Защищенная система для команды ApeVault
          </p>
        </div>
      </div>
    </div>
  )
}



