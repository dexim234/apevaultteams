// Access block screen component - shown when user access is blocked
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { checkUserAccess } from '@/services/firestoreService'
import { ShieldX, Clock, AlertTriangle } from 'lucide-react'

export const AccessBlockScreen = () => {
  const { user } = useAuthStore()
  const [blockReason, setBlockReason] = useState<string>('')
  const [blockExpiresAt, setBlockExpiresAt] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [showBlock, setShowBlock] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const accessResult = await checkUserAccess(user.id, 'login')
        if (!accessResult.hasAccess) {
          setBlockReason(accessResult.reason || 'Доступ заблокирован')
          setBlockExpiresAt(accessResult.expiresAt)
          setShowBlock(true)
        } else {
          setShowBlock(false)
        }
      } catch (error) {
        console.error('Error checking access:', error)
        setBlockReason('Ошибка проверки доступа')
        setShowBlock(true)
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [user])

  if (!showBlock) {
    return null
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#4E6E49] border-t-transparent"></div>
      </div>
    )
  }

  if (!blockReason) {
    return null // No block, render normally
  }

  const formatExpirationDate = (expiresAt?: string) => {
    if (!expiresAt) return 'навсегда'

    const date = new Date(expiresAt)
    const now = new Date()

    if (date <= now) return 'навсегда'

    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Доступ заблокирован
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {blockReason}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>
              Блокировка до: {formatExpirationDate(blockExpiresAt)}
            </span>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                Свяжитесь с администратором
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Для восстановления доступа обратитесь к администратору системы
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 dark:text-gray-500">
          ApeVault Team
        </div>
      </div>
    </div>
  )
}
