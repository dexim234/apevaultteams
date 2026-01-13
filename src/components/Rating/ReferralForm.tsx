import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { addReferral, updateReferral, deleteReferral, addApprovalRequest } from '@/services/firestoreService'
import { Referral } from '@/types'
import { X, RefreshCcw, Trash2 } from 'lucide-react'
import { SaveProgressIndicator } from '@/components/UI/SaveProgressIndicator'

interface ReferralFormProps {
  referral?: Referral | null
  onClose: () => void
  onSave: () => void
}

const generateReferralId = () => `REF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

export const ReferralForm = ({ referral, onClose, onSave }: ReferralFormProps) => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [comment, setComment] = useState('')
  const [customId, setCustomId] = useState(generateReferralId())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (referral) {
      setName(referral.name)
      setAge(String(referral.age))
      setCustomId(referral.referralId)
      setComment(referral.comment || '')
    } else {
      setName('')
      setAge('')
      setComment('')
      setCustomId(generateReferralId())
    }
  }, [referral])

  const isEditing = Boolean(referral)
  const title = isEditing ? 'Редактировать реферала' : 'Добавить реферала'

  const buttonColor = theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'

  const handleSave = async () => {
    // When editing, allow admin to edit without user
    // When creating, require user (referral must belong to someone)
    if (referral) {
      // Editing - admin can edit any referral
    } else {
      // Creating - requires user
      if (!user) {
        setError('Пользователь не найден. Для добавления реферала необходимо войти как участник.')
        return
      }
    }

    if (!name.trim() || !age.trim()) {
      setError('Заполните имя и возраст')
      return
    }

    const parsedAge = Number(age)
    if (Number.isNaN(parsedAge) || parsedAge < 16) {
      setError('Возраст должен быть числом не меньше 16')
      return
    }

    setLoading(true)
    setError('')

    const payload = {
      referralId: customId,
      ownerId: referral?.ownerId || user!.id,
      name: name.trim(),
      age: parsedAge,
      createdAt: referral?.createdAt || new Date().toISOString(),
      ...(comment.trim() && { comment: comment.trim() }),
    }

    try {
      if (referral) {
        if (isAdmin) {
          await updateReferral(referral.id, payload)
        } else {
          await addApprovalRequest({
            entity: 'referral',
            action: 'update',
            authorId: user?.id || referral.ownerId,
            targetUserId: referral.ownerId,
            before: referral,
            after: { id: referral.id, ...payload },
          })
        }
      } else {
        if (isAdmin) {
          await addReferral(payload)
        } else {
          await addApprovalRequest({
            entity: 'referral',
            action: 'create',
            authorId: user!.id,
            targetUserId: user!.id,
            before: null,
            after: { id: '', ...payload },
          })
        }
      }
      onSave()
    } catch (err: any) {
      console.error('Error saving referral:', err)
      const errorMessage = err.message || err.code || 'Не удалось сохранить реферала'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!referral) return
    if (!confirm(`Удалить реферала ${referral.name}?`)) return

    setDeleteLoading(true)
    try {
      if (isAdmin) {
        await deleteReferral(referral.id)
      } else {
        await addApprovalRequest({
          entity: 'referral',
          action: 'delete',
          authorId: user?.id || referral.ownerId,
          targetUserId: referral.ownerId,
          before: referral,
          after: null,
        })
      }
      onSave()
    } catch (err: any) {
      console.error('Error deleting referral:', err)
      const errorMessage = err.message || err.code || 'Не удалось удалить реферала'
      setError(errorMessage)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-[70] p-4 sm:py-0 overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll">
      <div className={`w-full max-w-md rounded-lg shadow-xl ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'} max-h-[90vh] flex flex-col overflow-hidden`}>
        <div className="flex-shrink-0 p-6 pb-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold ${headingColor}`}>{title}</h3>
            <button onClick={onClose} className={`p-2 rounded-lg flex-shrink-0 ${buttonColor}`} aria-label="Закрыть">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain modal-scroll px-6 pb-6">
          <div className="space-y-4 min-w-0">

          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
              placeholder="Введите имя"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Возраст</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
              placeholder="18"
              min={16}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>Комментарий</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className={`w-full px-4 py-2 rounded-lg border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
              placeholder="Например, источник лида или статус"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${labelColor}`}>ID реферала</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customId}
                readOnly={isEditing}
                onChange={(e) => setCustomId(e.target.value)}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-[#4E6E49] ${isEditing ? 'opacity-80 cursor-not-allowed' : ''}`}
              />
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setCustomId(generateReferralId())}
                  className="px-3 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Новый
                </button>
              )}
            </div>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              ID генерируется автоматически и используется для учета.
            </p>
          </div>

          {error && <div className="p-3 bg-red-500 text-white rounded-lg text-sm">{error}</div>}

          <div className="flex flex-col sm:flex-row gap-3">
            {isEditing && (
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {deleteLoading ? 'Удаление...' : 'Удалить'}
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors relative overflow-hidden"
            >
              <span className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'invisible' : ''}`}>
                {loading ? '' : 'Сохранить'}
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Сохранение...</span>
                  </div>
                </div>
              )}
            </button>
            <button onClick={onClose} className={`px-4 py-2 rounded-lg transition-colors ${buttonColor}`}>
              Отмена
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>

    {/* Индикатор прогресса сохранения */}
    <SaveProgressIndicator loading={loading || deleteLoading} message="Сохранение реферела..." />
  </div>
}
