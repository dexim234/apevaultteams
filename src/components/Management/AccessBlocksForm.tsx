// Form for managing access blocks
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getAccessBlocks, addAccessBlock, updateAccessBlock, deleteAccessBlock } from '@/services/firestoreService'
import { useScrollLock } from '@/hooks/useScrollLock'
import { AccessBlock, AccessFeature, TEAM_MEMBERS } from '@/types'
import { X, Plus, Trash2, Edit, Save, Shield, ShieldX, Clock, AlertCircle } from 'lucide-react'

interface AccessBlocksFormProps {
  onClose: () => void
}

const ACCESS_FEATURES: { value: AccessFeature; label: string; description: string }[] = [
  { value: 'all', label: 'Весь сайт', description: 'Полная блокировка доступа ко всему сайту' },
  { value: 'tools', label: 'Раздел Tools', description: 'Скрыть раздел Tools из меню' },
  { value: 'tools_meme_evaluation', label: 'Tools → Meme Evaluation', description: 'Заблокировать просмотр оценки мемов' },
  { value: 'tools_ai_ao_alerts', label: 'Tools → AI-AO Alerts', description: 'Заблокировать AI - AO Alerts' },
  { value: 'tools_signals_trigger_bot', label: 'Tools → Signals Trigger Bot', description: 'Заблокировать Signals Trigger Bot' },
  { value: 'slots', label: 'Управление слотами', description: 'Блокировать создание/редактирование слотов' },
  { value: 'earnings', label: 'Доходы', description: 'Блокировать добавление доходов' },
  { value: 'tasks', label: 'Задачи', description: 'Блокировать управление задачами' },
  { value: 'rating', label: 'Рейтинг', description: 'Блокировать просмотр рейтинга' },
  { value: 'profile', label: 'Профиль', description: 'Блокировать редактирование профиля' },
]

export const AccessBlocksForm = ({ onClose }: AccessBlocksFormProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  useScrollLock()
  const [blocks, setBlocks] = useState<AccessBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingBlock, setEditingBlock] = useState<AccessBlock | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const [formData, setFormData] = useState({
    userId: '',
    reason: '',
    expiresAt: '',
    blockFeatures: [] as AccessFeature[],
    isActive: true
  })

  useEffect(() => {
    loadBlocks()
  }, [])

  const loadBlocks = async () => {
    try {
      const data = await getAccessBlocks()
      setBlocks(data)
    } catch (error) {
      console.error('Error loading blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user && !isAdmin) {
      setError('Пользователь не найден (необходима авторизация)')
      return
    }

    setSaving(true)
    setError('')
    try {
      const blockData = {
        reason: formData.reason,
        blockFeatures: formData.blockFeatures,
        isActive: formData.isActive,
        createdBy: user?.id || 'admin',
        createdAt: new Date().toISOString(),
        // Always include userId - empty string for general blocks
        userId: formData.userId || '',
        ...(formData.expiresAt ? { expiresAt: formData.expiresAt } : {})
      }

      if (editingBlock) {
        await updateAccessBlock(editingBlock.id, blockData)
      } else {
        await addAccessBlock(blockData as any)
      }

      await loadBlocks()
      resetForm()
      setShowAddForm(false)
      setEditingBlock(null)
    } catch (error: any) {
      console.error('Error saving block:', error)
      setError(error.message || 'Ошибка при сохранении блокировки')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (block: AccessBlock) => {
    setEditingBlock(block)
    setFormData({
      userId: block.userId || '',
      reason: block.reason,
      expiresAt: block.expiresAt || '',
      blockFeatures: block.blockFeatures,
      isActive: block.isActive
    })
    setError('')
    setShowAddForm(true)
  }

  const handleDelete = async (blockId: string) => {
    if (!confirm('Удалить блокировку доступа?')) return

    try {
      await deleteAccessBlock(blockId)
      await loadBlocks()
    } catch (error) {
      console.error('Error deleting block:', error)
    }
  }

  const handleToggleActive = async (block: AccessBlock) => {
    try {
      await updateAccessBlock(block.id, { isActive: !block.isActive })
      await loadBlocks()
    } catch (error) {
      console.error('Error toggling block status:', error)
    }
  }

  const handleFeatureToggle = (feature: AccessFeature) => {
    setFormData(prev => ({
      ...prev,
      blockFeatures: prev.blockFeatures.includes(feature)
        ? prev.blockFeatures.filter(f => f !== feature)
        : [...prev.blockFeatures, feature]
    }))
  }

  const resetForm = () => {
    setError('')
    setFormData({
      userId: '',
      reason: '',
      expiresAt: '',
      blockFeatures: [],
      isActive: true
    })
  }

  const getUserName = (userId?: string) => {
    if (!userId) return 'Все пользователи'
    const member = TEAM_MEMBERS.find(m => m.id === userId)
    return member?.name || userId
  }

  const getFeatureLabel = (feature: AccessFeature) => {
    const featureData = ACCESS_FEATURES.find(f => f.value === feature)
    return featureData?.label || feature
  }

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#4E6E49] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 overflow-y-auto touch-manipulation">
      <div className={`w-full max-w-4xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.45)] border ${theme === 'dark' ? 'bg-gradient-to-br from-[#0c1320] via-[#0b1220] to-[#08111b] border-white/10' : 'bg-gradient-to-br from-white via-slate-50 to-white border-slate-200'} max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500">
                <ShieldX className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Управление доступом
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Блокировка доступа к функциям сайта
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
              {(showAddForm || editingBlock) && (
                <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                  <h4 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {editingBlock ? 'Редактировать блокировку' : 'Добавить блокировку'}
                  </h4>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-500">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Пользователь (оставьте пустым для блокировки всем)
                      </label>
                      <select
                        value={formData.userId}
                        onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                      >
                        <option value="">Все пользователи</option>
                        {TEAM_MEMBERS.map((member) => (
                          <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Блокируемые функции
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ACCESS_FEATURES.map((feature) => (
                          <label
                            key={feature.value}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.blockFeatures.includes(feature.value)
                              ? theme === 'dark'
                                ? 'border-red-500/50 bg-red-500/10'
                                : 'border-red-200 bg-red-50'
                              : theme === 'dark'
                                ? 'border-gray-600 hover:border-gray-500'
                                : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.blockFeatures.includes(feature.value)}
                              onChange={() => handleFeatureToggle(feature.value)}
                              className="mt-0.5 rounded border-gray-300 text-red-500 focus:ring-red-500"
                            />
                            <div className="flex-1">
                              <div className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {feature.label}
                              </div>
                              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {feature.description}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Причина блокировки *
                      </label>
                      <textarea
                        value={formData.reason}
                        onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border resize-none ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                        rows={3}
                        placeholder="Объяснение блокировки..."
                        required
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Дата окончания (опционально)
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.expiresAt}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                        className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-[#4E6E49]`}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      <label htmlFor="isActive" className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Активна
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={saving || formData.blockFeatures.length === 0}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            {editingBlock ? 'Сохранить' : 'Заблокировать'}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          resetForm()
                          setShowAddForm(false)
                          setEditingBlock(null)
                        }}
                        className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} transition-colors`}
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Blocks List */}
              <div className={`rounded-2xl border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Активные блокировки ({blocks.filter(b => b.isActive).length})
                    </h4>
                    <button
                      onClick={() => {
                        setError('')
                        setShowAddForm(true)
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Добавить блокировку
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {blocks.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                      <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Нет активных блокировок
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blocks.map((block) => (
                        <div
                          key={block.id}
                          className={`flex items-center justify-between p-4 rounded-xl border ${block.isActive && !isExpired(block.expiresAt)
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
                              {getUserName(block.userId)}
                            </div>
                            <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {block.reason}
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                Функции: {block.blockFeatures.map(f => getFeatureLabel(f)).join(', ')}
                              </div>
                              {block.expiresAt && (
                                <div className={`flex items-center gap-1 text-xs ${isExpired(block.expiresAt) ? 'text-gray-500' : 'text-amber-600'}`}>
                                  <Clock className="w-3 h-3" />
                                  {isExpired(block.expiresAt) ? 'Истекла' : `До ${new Date(block.expiresAt).toLocaleString('ru-RU')}`}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleActive(block)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${block.isActive && !isExpired(block.expiresAt)
                                ? 'bg-red-500 text-white'
                                : theme === 'dark'
                                  ? 'bg-gray-600 text-gray-300'
                                  : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                              {block.isActive && !isExpired(block.expiresAt) ? 'Активна' : 'Неактивна'}
                            </button>

                            <button
                              onClick={() => handleEdit(block)}
                              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(block.id)}
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
