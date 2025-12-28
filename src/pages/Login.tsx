// Login page component
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useAdminStore } from '@/store/adminStore'
import {
  Moon,
  Sun,
  Shield,
  User,
  Users,
  Eye,
  EyeOff,
  Lock,
  BookOpen
} from 'lucide-react'
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
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
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
    if (isAuthenticated && user) {
      navigate('/management')
      return
    }

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()

      const initDataFromUrl = searchParams.get('tgWebAppData')
      const initData = initDataFromUrl || window.Telegram.WebApp.initData
      const loginFromUrl = searchParams.get('login')
      const passwordFromUrl = searchParams.get('password')

      if (loginFromUrl && passwordFromUrl) {
        const success = loginUser(loginFromUrl, passwordFromUrl)
        if (success) {
          navigate('/management')
          return
        }
      }

      if (initData) {
        try {
          const params = new URLSearchParams(initData)
          const userParam = params.get('user')

          if (userParam) {
            const userData = JSON.parse(decodeURIComponent(userParam))
            const telegramUserId = userData.id
            sessionStorage.setItem('telegram_user_id', String(telegramUserId))

            const savedAuth = localStorage.getItem('apevault-auth')
            if (savedAuth) {
              try {
                const parsed = JSON.parse(savedAuth)
                if (parsed.state?.user) {
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
          }
        } catch (err) {
          console.error('Error parsing Telegram initData:', err)
        }
      }

      const unsafeUser = window.Telegram.WebApp.initDataUnsafe?.user
      if (unsafeUser) {
        sessionStorage.setItem('telegram_user_id', String(unsafeUser.id))
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
      const adminSuccess = activateAdmin(password)
      if (adminSuccess) {
        navigate('/management')
      } else {
        setError('Неверный пароль администратора')
      }
    } else {
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

  return (
    <div className={`min-h-screen flex flex-col xl:flex-row ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-white'}`}>
      {/* Left Branding Section */}
      <div className="hidden xl:flex flex-1 relative bg-[#0b0f17] items-center justify-center p-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[620px] h-[620px] bg-gradient-to-br from-[#4E6E49]/35 via-emerald-400/22 to-transparent blur-[110px]" />
          <div className="absolute top-[-120px] right-[-180px] w-[780px] h-[780px] bg-gradient-to-bl from-blue-500/24 via-purple-500/22 to-transparent blur-[140px]" />
          <div className="floating-grid opacity-30" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mb-8 p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl flex items-center justify-center animate-pulse-subtle">
            <img src={logo} alt="ApeVault" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
            ApeVault <span className="text-emerald-500">Frontier</span>
          </h1>

          <p className="text-lg text-gray-400 font-medium leading-relaxed">
            Единая командная панель для управления ресурсами, аналитикой и оперативного взаимодействия.
          </p>

          <div className="mt-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Secure
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className={`flex-1 flex flex-col min-h-screen relative p-6 sm:p-12 lg:p-20 ${theme === 'dark' ? 'bg-[#0b0f17]' : 'bg-white'}`}>
        {/* Mobile Header */}
        <div className="xl:hidden flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <span className={`font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ApeVault</span>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-amber-300">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Desktop Theme Toggle */}
        <div className="hidden xl:flex justify-end absolute top-8 right-8">
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full shadow-lg transition-all border ${theme === 'dark'
              ? 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10'
              : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
              }`}
          >
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="mb-10 text-center xl:text-left">
            <h2 className={`text-4xl font-extrabold mb-3 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Добро пожаловать
            </h2>
            <p className={`text-gray-500 dark:text-gray-400 font-medium`}>
              Введите данные для входа в <span className="text-emerald-500 font-bold">ApeVault</span>
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl mb-8">
            <button
              onClick={() => setUserType('member')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${userType === 'member'
                ? 'bg-white dark:bg-[#4E6E49] text-[#4E6E49] dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <Users className="w-4 h-4" />
              <span>Участник</span>
            </button>
            <button
              onClick={() => setUserType('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${userType === 'admin'
                ? 'bg-white dark:bg-[#4E6E49] text-[#4E6E49] dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <Shield className="w-4 h-4" />
              <span>Админ</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {userType === 'member' && (
              <div className="space-y-2">
                <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Логин / Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="agent@apevault.io"
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-emerald-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                      }`}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className={`text-sm font-bold block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Пароль
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-4 rounded-2xl border transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-600 focus:border-emerald-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${rememberMe
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-gray-300 dark:border-white/20'
                    }`}>
                    {rememberMe && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                  </div>
                </div>
                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Запомнить меня</span>
              </label>
              <button type="button" className="text-sm font-bold text-emerald-500 hover:text-emerald-600">
                Забыли пароль?
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Войти в Систему
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://t.me/artyommedoed"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border transition-all font-bold text-sm ${theme === 'dark'
                  ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                  }`}
              >
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Связаться с Админом</span>
              </a>
              <a
                href="/rules.pdf"
                download
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border transition-all font-bold text-sm ${theme === 'dark'
                  ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                  }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Правила Команды</span>
              </a>
            </div>
          </div>

          <div className="mt-12 text-center text-[10px] font-bold text-gray-500 dark:text-gray-600 uppercase tracking-widest">
            <p>© 2023 ApeVault Frontier. Protected Area.</p>
            <p className="mt-2 flex items-center justify-center gap-2">
              <Shield className="w-3 h-3" />
              Access Logged: <span className="text-emerald-500/60 font-mono">IP 192.168.x.x</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



