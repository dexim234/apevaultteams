// Admin mode activation button
import { useState } from 'react'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { Shield, ShieldOff } from 'lucide-react'

export const AdminModeButton = () => {
  const { isAdmin, activateAdmin, deactivateAdmin } = useAdminStore()
  const { theme } = useThemeStore()
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleToggle = () => {
    if (isAdmin) {
      deactivateAdmin()
      alert('Режим администратора деактивирован')
    } else {
      setShowPasswordInput(true)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (activateAdmin(password)) {
      setShowPasswordInput(false)
      setPassword('')
      alert('Режим администратора активирован')
    } else {
      setError('Неверный пароль')
    }
  }

  if (showPasswordInput && !isAdmin) {
    return (
      <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} shadow-md`}>
        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Пароль администратора:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-800 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
            placeholder="Введите пароль"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors"
            >
              Активировать
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPasswordInput(false)
                setPassword('')
                setError('')
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <button
      onClick={handleToggle}
      className={`w-full rounded-lg p-4 shadow-md transition-colors flex items-center justify-center gap-2 ${
        isAdmin
          ? 'bg-purple-600 hover:bg-purple-700 text-white'
          : theme === 'dark'
          ? 'bg-[#1a1a1a] hover:bg-gray-700 text-white'
          : 'bg-white hover:bg-gray-50 text-gray-900'
      }`}
    >
      {isAdmin ? (
        <>
          <ShieldOff className="w-5 h-5" />
          <span>Режим администратора (деактивировать)</span>
        </>
      ) : (
        <>
          <Shield className="w-5 h-5" />
          <span>Режим администратора</span>
        </>
      )}
    </button>
  )
}



