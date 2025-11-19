// Login page component
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
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

export const Login = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login: loginUser, user, isAuthenticated } = useAuthStore()
  const { theme } = useThemeStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

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

    if (!login || !password) {
      setError('Пожалуйста, заполните все поля')
      return
    }

    const success = loginUser(login, password)
    if (success) {
      navigate('/management')
    } else {
      setError('Неверный логин или пароль')
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex justify-center">
            <img 
              src={logo} 
              alt="ApeVault Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ApeVault</h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Командная панель управления
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="login" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Логин
            </label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Введите логин"
            />
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500 text-white rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}



