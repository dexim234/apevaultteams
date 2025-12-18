// Login page component
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import { Moon, Sun, Shield, User, Users } from 'lucide-react'
import logo from '../assets/logo.png'

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
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[620px] h-[620px] bg-gradient-to-br from-[#4E6E49]/35 via-emerald-400/22 to-transparent blur-[110px]" />
        <div className="absolute top-[-120px] right-[-180px] w-[780px] h-[780px] bg-gradient-to-bl from-blue-500/24 via-purple-500/22 to-transparent blur-[140px]" />
        <div className="absolute bottom-[-200px] right-[-80px] w-[620px] h-[620px] bg-gradient-to-tr from-amber-400/18 via-[#4E6E49]/18 to-transparent blur-[120px]" />
        <div className="floating-grid opacity-75 dark:opacity-45" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-6 min-h-screen flex items-center justify-center py-10">
        <div className="glass-panel rounded-[28px] p-4 sm:p-6 md:p-8 border border-white/70 dark:border-white/10 shadow-2xl overflow-hidden w-full">
          <div className="accent-dots" />
          <div className="relative z-10 grid md:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-8 items-stretch">
            <div className="section-card rounded-2xl p-6 lg:p-7 border border-white/60 dark:border-white/10 shadow-xl flex flex-col items-center text-center gap-4">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg">
                <img src={logo} alt="ApeVault Logo" className="w-16 h-16 object-contain" />
              </div>
              <div className="space-y-1">
                <p className={`text-xs uppercase tracking-[0.16em] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>ApeVault Black Ops</p>
                <h1 className={`text-3xl lg:text-4xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Командная панель</h1>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#4E6E49]/15 to-emerald-500/10 text-[#4E6E49] text-xs font-semibold">
                <Shield className="w-4 h-4" />
                Защищенный доступ
              </div>


            </div>

            <div className="section-card rounded-2xl p-6 lg:p-7 border border-white/60 dark:border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className={`text-xs uppercase tracking-[0.12em] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Доступ</p>
                  <h2 className={`text-2xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Вход в систему</h2>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className="nav-chip px-3 py-2"
                  data-active="false"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-gray-700" />}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Тип пользователя
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setUserType('member')
                        setLogin('')
                        setPassword('')
                        setError('')
                      }}
                      className="pill justify-center"
                      data-active={userType === 'member'}
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
                      className="pill justify-center"
                      data-active={userType === 'admin'}
                    >
                      <Shield className="w-5 h-5" />
                      <span>Админ</span>
                    </button>
                  </div>
                </div>

                {userType === 'member' && (
                  <div>
                    <label htmlFor="login" className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      <User className="w-4 h-4 inline mr-2" />
                      Логин
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="login"
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${theme === 'dark'
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4E6E49]'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#4E6E49]'
                          } focus:outline-none focus:ring-4 focus:ring-[#4E6E49]/20`}
                        placeholder="Введите ваш логин"
                        autoComplete="username"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="password" className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Shield className="w-4 h-4 inline mr-2" />
                    Пароль
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all ${theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#4E6E49]'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#4E6E49]'
                      } focus:outline-none focus:ring-4 focus:ring-[#4E6E49]/20`}
                    placeholder={userType === 'admin' ? 'Введите пароль администратора' : 'Введите ваш пароль'}
                    autoComplete={userType === 'admin' ? 'off' : 'current-password'}
                  />
                  {userType === 'admin' && (
                    <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Для входа в режим администратора требуется специальный пароль
                    </p>
                  )}
                </div>

                {error && (
                  <div className={`p-4 rounded-xl border ${theme === 'dark'
                    ? 'bg-red-500/15 border-red-500/40 text-red-300'
                    : 'bg-red-50 border-red-300 text-red-700'
                    } text-sm font-semibold animate-shake`}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white"
                >
                  Войти в систему
                </button>
              </form>

              <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} flex items-center justify-between gap-3 flex-wrap`}>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Защищенная система для команды ApeVault
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



