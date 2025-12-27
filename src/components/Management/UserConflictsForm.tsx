// Form for managing user conflicts
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { getUserConflicts, addUserConflict, updateUserConflict, deleteUserConflict } from '@/services/firestoreService'
import { useScrollLock } from '@/hooks/useScrollLock'
import { UserConflict, TEAM_MEMBERS } from '@/types'
import { X, Plus, Trash2, Edit, Save, UserX, AlertCircle } from 'lucide-react'

interface UserConflictsFormProps {
  onClose: () => void
}

export const UserConflictsForm = ({ onClose }: UserConflictsFormProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  useScrollLock()
  const [conflicts, setConflicts] = useState<UserConflict[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingConflict, setEditingConflict] = useState<UserConflict | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const [formData, setFormData] = useState({
    userId: '',
    restrictedUserId: '',
    reason: '',
    isActive: true
  })

  useEffect(() => {
    loadConflicts()
  }, [])

  const loadConflicts = async () => {
    try {
      const data = await getUserConflicts()
      setConflicts(data)
    } catch (error) {
      console.error('Error loading conflicts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('Пользователь не найден (необходима авторизация)')
      return
    }

    setSaving(true)
    setError('')
    try {
      const conflictData = {
        ...formData,
        createdBy: user.id,
        createdAt: new Date().toISOString()
      }

      if (editingConflict) {
        await updateUserConflict(editingConflict.id, conflictData)
      } else {
        await addUserConflict(conflictData)
      }

      await loadConflicts()
      resetForm()
      setShowAddForm(false)
      setEditingConflict(null)
    } catch (error: any) {
      console.error('Error saving conflict:', error)
      setError(error.message || 'Ошибка при сохранении конфликта')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (conflict: UserConflict) => {
    setEditingConflict(conflict)
    setFormData({
      userId: conflict.userId,
      restrictedUserId: conflict.restrictedUserId,
      reason: conflict.reason || '',
      isActive: conflict.isActive
    })
    setError('')
    setShowAddForm(true)
  }

  const handleDelete = async (conflictId: string) => {
    if (!confirm('Удалить конфликт?')) return

    try {
      await deleteUserConflict(conflictId)
      await loadConflicts()
    } catch (error) {
      console.error('Error deleting conflict:', error)
    }
  }

  const handleToggleActive = async (conflict: UserConflict) => {
    try {
      await updateUserConflict(conflict.id, { isActive: !conflict.isActive })
      await loadConflicts()
    } catch (error) {
      console.error('Error toggling conflict status:', error)
    }
  }

  const resetForm = () => {
    setError('')
    setFormData({
      userId: '',
      restrictedUserId: '',
      reason: '',
      isActive: true
    })
  }

  const getUserName = (userId: string) => {
    const member = TEAM_MEMBERS.find(m => m.id === userId)
    return member?.name || userId
  }

  const availableUsers = TEAM_MEMBERS.filter(m => m.id !== formData.userId)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#4E6E49] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 overflow-y-auto touch-manipulation">
      <div className={`w-full max-w-4xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${theme === 'dark' ? 'bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10' : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200'} max-h-[90vh] overflow-hidden`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Управление конфликтами пользователей
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Настройте ограничения на совместную работу пользователей
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full border ${theme === 'dark' ? 'border-white/10 text-gray-200 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-100'} transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
              {/* Add/Edit Form */}
              {(showAddForm || editingConflict) && (
                <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <h4 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {editingConflict ? 'Редактировать конфликт' : 'Добавить конфликт'}
                  </h4>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-500">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Пользователь
                        </label>
                        <select
                          value={formData.userId}
                          onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                          className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                          required
                        >
                          <option value="">Выберите пользователя</option>
                          {TEAM_MEMBERS.map((member) => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          Запрещено работать с
                        </label>
                        <select
                          value={formData.restrictedUserId}
                          onChange={(e) => setFormData(prev => ({ ...prev, restrictedUserId: e.target.value }))}
                          className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                          required
                        >
                          <option value="">Выберите пользователя</option>
                          {availableUsers.map((member) => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Причина (опционально)
                      </label>
                      <textarea
                        value={formData.reason}
                        onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border resize-none ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                        rows={3}
                        placeholder="Объяснение ограничения..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-[#4E6E49] focus:ring-[#4E6E49]"
                      />
                      <label htmlFor="isActive" className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Активно
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            {editingConflict ? 'Сохранить' : 'Добавить'}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          resetForm()
                          setShowAddForm(false)
                          setEditingConflict(null)
                        }}
                        className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} transition-colors`}
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Conflicts List */}
              <div className={`rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Активные конфликты ({conflicts.filter(c => c.isActive).length})
                    </h4>
                    <button
                      onClick={() => {
                        setError('')
                        setShowAddForm(true)
                      }}
                      className="px-4 py-2 bg-[#4E6E49] hover:bg-[#4E6E49] text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Добавить конфликт
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {conflicts.length === 0 ? (
                    <div className="text-center py-8">
                      <UserX className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                      <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Нет настроенных конфликтов
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conflicts.map((conflict) => (
                        <div
                          key={conflict.id}
                          className={`flex items-center justify-between p-4 rounded-xl border ${conflict.isActive
                            ? theme === 'dark'
                              ? 'border-red-500/30 bg-red-500/10'
                              : 'border-red-200 bg-red-50'
                            : theme === 'dark'
                              ? 'border-gray-600 bg-gray-700/50'
                              : 'border-gray-200 bg-gray-50'
                            }`}
                        >
                          <div className="flex-1">
                            <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {getUserName(conflict.userId)} ↔ {getUserName(conflict.restrictedUserId)}
                            </div>
                            {conflict.reason && (
                              <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {conflict.reason}
                              </div>
                            )}
                            <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              Создано: {new Date(conflict.createdAt).toLocaleDateString('ru-RU')}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleActive(conflict)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${conflict.isActive
                                ? 'bg-red-500 text-white'
                                : theme === 'dark'
                                  ? 'bg-gray-600 text-gray-300'
                                  : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                              {conflict.isActive ? 'Активен' : 'Неактивен'}
                            </button>

                            <button
                              onClick={() => handleEdit(conflict)}
                              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(conflict.id)}
                              className={`p-2 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
