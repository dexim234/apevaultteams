// Form for managing access blocks
import { useState, useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { getAllAccessBlocks, addAccessBlock, updateAccessBlock, deleteAccessBlock } from '@/services/firestoreService'
import { useScrollLock } from '@/hooks/useScrollLock'
import { AccessBlock, AccessFeature, TEAM_MEMBERS } from '@/types'
import { X, Plus, Trash2, Edit, Save, Shield, ShieldX, Clock, Users, User, Check, ChevronDown, ChevronRight } from 'lucide-react'

interface AccessBlocksFormProps {
  onClose: () => void
}

interface FeatureGroup {
  id: string
  label: string
  features: { value: AccessFeature; label: string; description: string }[]
}

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'global',
    label: 'Глобальные',
    features: [
      { value: 'all', label: 'Весь сайт', description: 'Полная блокировка доступа ко всему сайту' },
    ]
  },
  {
    id: 'tools',
    label: 'Раздел Tools (Инструменты)',
    features: [
      { value: 'tools', label: 'Весь раздел Tools', description: 'Скрыть весь раздел из меню и запретить вход' },
      { value: 'tools_events', label: 'События', description: 'Заблокировать доступ к разделу Событий' },
      { value: 'tools_kontur', label: 'AVF Контур', description: 'Заблокировать доступ к блоку Контур' },
      { value: 'tools_kontur_memecoins', label: 'Вкладка Мемкоины', description: 'Заблокировать вкладку в Контуре' },
      { value: 'tools_kontur_polymarket', label: 'Вкладка Polymarket', description: 'Заблокировать вкладку в Контуре' },
      { value: 'tools_kontur_nft', label: 'Вкладка NFT', description: 'Заблокировать вкладку в Контуре' },
      { value: 'tools_kontur_staking', label: 'Вкладка Стейкинг', description: 'Заблокировать вкладку в Контуре' },
      { value: 'tools_kontur_spot', label: 'Вкладка Спот', description: 'Заблокировать вкладку в Контуре' },
      { value: 'tools_kontur_futures', label: 'Вкладка Фьючерсы', description: 'Заблокировать вкладку в Контуре' },
      { value: 'tools_kontur_airdrop', label: 'Вкладка AirDrop', description: 'Заблокировать вкладку в Контуре' },
      { value: 'tools_strategies_view', label: 'Просмотр стратегий', description: 'Скрыть блок стратегий на страницах' },
      { value: 'tools_items_view', label: 'Просмотр инструментов', description: 'Скрыть ссылки на инструменты' },
    ]
  },
  {
    id: 'hub',
    label: 'AVF HUB (Сигналы)',
    features: [
      { value: 'avf_hub', label: 'Весь задел HUB', description: 'Полная блокировка раздела HUB' },
      { value: 'hub_signals_view', label: 'Просмотр сигналов', description: 'Запретить просмотр списка сигналов' },
      { value: 'hub_signals_add', label: 'Добавление сигналов', description: 'Запретить создавать любые сигналы' },
      { value: 'hub_signals_cat_memecoins', label: 'Сигналы: Мемкоины', description: 'Запретить работу с мемкоинами в HUB' },
      { value: 'hub_signals_cat_polymarket', label: 'Сигналы: Polymarket', description: 'Запретить работу с Polymarket в HUB' },
      { value: 'hub_signals_cat_nft', label: 'Сигналы: NFT', description: 'Запретить работу с NFT в HUB' },
    ]
  },
  {
    id: 'schedule',
    label: 'AVF Schedule (Расписание)',
    features: [
      { value: 'avf_schedule', label: 'Весь раздел Schedule', description: 'Полная блокировка раздела Расписания' },
      { value: 'schedule_view', label: 'Просмотр расписания', description: 'Запретить видеть сетку и таблицу' },
      { value: 'schedule_stats_view', label: 'Карточки статистики', description: 'Скрыть блоки статистики расписания' },
      { value: 'schedule_add_slot', label: 'Добавление слотов', description: 'Запретить бронирование времени' },
      { value: 'schedule_status_edit', label: 'Управление статусами', description: 'Запретить ставить отсутствие/отпуск' },
      { value: 'schedule_slot_delete', label: 'Удаление записей', description: 'Запретить удалять слоты/статусы' },
    ]
  },
  {
    id: 'tasks',
    label: 'AVF Tasks (Задачи)',
    features: [
      { value: 'avf_tasks', label: 'Весь раздел Tasks', description: 'Блокировать доступ к управлению задачами' },
      { value: 'tasks_view', label: 'Просмотр задач', description: 'Запретить видеть список задач' },
      { value: 'tasks_add', label: 'Создание задач', description: 'Запретить добавлять новые задачи' },
    ]
  },
  {
    id: 'profit',
    label: 'AVF Profit (Доходы)',
    features: [
      { value: 'avf_profit', label: 'Весь раздел Profit', description: 'Полная блокировка раздела доходов' },
      { value: 'profit_add', label: 'Добавление профита', description: 'Запретить вносить заработок' },
      { value: 'profit_stats_view', label: 'Статистика и доли', description: 'Скрыть графики и детализацию доходов' },
      { value: 'profit_insights_view', label: 'Инсайты эффективности', description: 'Скрыть аналитику эффективности' },
      { value: 'profit_leaders_view', label: 'Лидеры по доходу', description: 'Скрыть топ участников' },
      { value: 'profit_history_view', label: 'История выплат', description: 'Скрыть историю накоплений и выплат' },
      { value: 'profit_cat_memecoins', label: 'Категория: Мемкоины', description: 'Запретить доход по мсмкоинам' },
      { value: 'profit_cat_polymarket', label: 'Категория: Polymarket', description: 'Запретить доход по Polymarket' },
      { value: 'profit_wallet_general', label: 'Кошелек: Общий', description: 'Запретить выбор типа General' },
      { value: 'profit_wallet_personal', label: 'Кошелек: Личный', description: 'Запретить выбор типа Personal' },
    ]
  },
  {
    id: 'rating',
    label: 'AVF Rating (Скор)',
    features: [
      { value: 'avf_rating', label: 'Весь раздел Rating', description: 'Блокировать доступ к рейтингу' },
      { value: 'rating_self_view', label: 'Своя карточка', description: 'Запретить видеть свой рейтинг' },
      { value: 'rating_others_view', label: 'Чужие карточки', description: 'Запретить видеть рейтинг других' },
    ]
  },
  {
    id: 'other',
    label: 'Прочее',
    features: [
      { value: 'avf_referrals', label: 'Рефералы', description: 'Блокировать раздел рефералов' },
      { value: 'avf_info', label: 'AVF INFO', description: 'Блокировать раздел информации (О нас)' },
      { value: 'profile', label: 'Профиль', description: 'Ограничить редактирование профиля' },
    ]
  }
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
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['global', 'tools']))

  const [formData, setFormData] = useState({
    targetType: 'single' as 'all' | 'single' | 'subset',
    userId: '',
    userIds: [] as string[],
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
      setLoading(true)
      const data = await getAllAccessBlocks()
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
      setError('Необходима авторизация')
      return
    }

    if (formData.targetType === 'single' && !formData.userId) {
      setError('Выберите пользователя для блокировки')
      return
    }

    if (formData.targetType === 'subset' && formData.userIds.length === 0) {
      setError('Выберите хотя бы одного пользователя')
      return
    }

    setSaving(true)
    setError('')
    try {
      const blockData = {
        targetType: formData.targetType,
        userId: formData.targetType === 'single' ? formData.userId : '',
        userIds: formData.targetType === 'subset' ? formData.userIds : [],
        reason: formData.reason || 'Администратор не указал причину',
        blockFeatures: formData.blockFeatures,
        isActive: formData.isActive,
        createdBy: user?.id || 'admin',
        createdAt: new Date().toISOString(),
        expiresAt: formData.expiresAt || ''
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
      setError(error.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (block: AccessBlock) => {
    setEditingBlock(block)
    setFormData({
      targetType: block.targetType || (block.userId ? 'single' : 'all'),
      userId: block.userId || '',
      userIds: block.userIds || [],
      reason: block.reason === 'Администратор не указал причину' ? '' : block.reason,
      expiresAt: block.expiresAt || '',
      blockFeatures: block.blockFeatures,
      isActive: block.isActive
    })
    setError('')
    setShowAddForm(true)
  }

  const handleDelete = async (blockId: string) => {
    if (!confirm('Удалить эту блокировку?')) return
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

  const handleUserToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      userIds: prev.userIds.includes(id)
        ? prev.userIds.filter(uid => uid !== id)
        : [...prev.userIds, id]
    }))
  }

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  const resetForm = () => {
    setError('')
    setFormData({
      targetType: 'single',
      userId: '',
      userIds: [],
      reason: '',
      expiresAt: '',
      blockFeatures: [],
      isActive: true
    })
  }

  const getTargetLabel = (block: AccessBlock) => {
    if (block.targetType === 'all') return 'Все участники'
    if (block.targetType === 'subset') return `Группа (${block.userIds?.length || 0} чел.)`
    const member = TEAM_MEMBERS.find(m => m.id === block.userId)
    return member?.name || 'Пользователь'
  }

  const isExpired = (expiry?: string) => expiry ? new Date(expiry) < new Date() : false

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xl flex items-start sm:items-center justify-center z-[70] p-4 overflow-y-auto">
      <div className={`w-full max-w-5xl rounded-3xl shadow-2xl border ${theme === 'dark' ? 'bg-[#0c1320] border-white/10' : 'bg-white border-slate-200'} max-h-[95vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <ShieldX className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Управление доступом</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Гибкая блокировка участников и функционала</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-500/20 border-t-red-500"></div>
            </div>
          ) : (
            <>
              {/* Add/Edit Form Overlay-like Section */}
              {(showAddForm || editingBlock) && (
                <div className={`rounded-2xl border p-8 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} animate-in fade-in slide-in-from-top-4 duration-300`}>
                  <h4 className={`text-lg font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{editingBlock ? 'Изменить параметры блока' : 'Новая блокировка'}</h4>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 1. Target Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Кого блокируем?</label>
                        <div className="flex gap-2 p-1 bg-black/20 rounded-xl">
                          {[
                            { id: 'single', label: 'Участник', icon: User },
                            { id: 'subset', label: 'Определенных', icon: Users },
                            { id: 'all', label: 'Всех', icon: Shield }
                          ].map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, targetType: type.id as any }))}
                              className={`flex-1 flex items-center justify-center gap-2 py-2 pr-3 pl-2 rounded-lg text-xs font-bold transition-all ${formData.targetType === type.id ? 'bg-red-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                              <type.icon className="w-4 h-4" />
                              <span>{type.label}</span>
                            </button>
                          ))}
                        </div>

                        {formData.targetType === 'single' && (
                          <select
                            value={formData.userId}
                            onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                            className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-red-500 outline-none`}
                          >
                            <option value="">Выберите участника...</option>
                            {TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                        )}

                        {formData.targetType === 'subset' && (
                          <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'}`}>
                            {TEAM_MEMBERS.map(m => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => handleUserToggle(m.id)}
                                className={`flex items-center gap-3 p-2 rounded-lg text-xs font-medium transition-all ${formData.userIds.includes(m.id) ? 'bg-red-500/20 text-red-500' : 'text-gray-500 hover:bg-white/5'}`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.userIds.includes(m.id) ? 'bg-red-500 border-red-500' : 'border-gray-600'}`}>
                                  {formData.userIds.includes(m.id) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                {m.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Причина и сроки</label>
                        <textarea
                          value={formData.reason}
                          onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                          placeholder="Администратор не указал причину..."
                          className={`w-full px-4 py-3 rounded-xl border h-[120px] resize-none ${theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-red-500 outline-none`}
                        />
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <input
                              type="datetime-local"
                              value={formData.expiresAt}
                              onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                              className={`w-full px-4 py-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-gray-200'} focus:ring-2 focus:ring-red-500 outline-none text-sm`}
                            />
                            <p className="text-[10px] text-gray-500 mt-1 ml-1">Пустое поле = Навсегда</p>
                          </div>
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <div className="relative">
                              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="sr-only" />
                              <div className={`w-10 h-5 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-700'}`}>
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isActive ? 'left-6' : 'left-1'}`} />
                              </div>
                            </div>
                            <span className="text-xs font-bold text-gray-400">Активна</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 2. Feature Selection */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Что именно блокируем?</label>
                      <div className="space-y-3">
                        {FEATURE_GROUPS.map(group => (
                          <div key={group.id} className={`rounded-xl border ${theme === 'dark' ? 'border-white/5 bg-black/20' : 'border-gray-200 bg-white'}`}>
                            <button
                              type="button"
                              onClick={() => toggleGroup(group.id)}
                              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>{group.label}</h5>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">{group.features.filter(f => formData.blockFeatures.includes(f.value)).length} выбрано</span>
                              </div>
                              {openGroups.has(group.id) ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                            </button>

                            {openGroups.has(group.id) && (
                              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-white/5">
                                {group.features.map(feature => (
                                  <label
                                    key={feature.value}
                                    className={`flex items-start gap-4 p-3 rounded-xl border cursor-pointer transition-all ${formData.blockFeatures.includes(feature.value) ? 'border-red-500/50 bg-red-500/10' : 'border-white/5 hover:bg-white/5'}`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={formData.blockFeatures.includes(feature.value)}
                                      onChange={() => handleFeatureToggle(feature.value)}
                                      className="mt-1 rounded border-gray-600 text-red-500 focus:ring-red-500 bg-transparent"
                                    />
                                    <div className="flex-1">
                                      <p className={`text-xs font-bold ${formData.blockFeatures.includes(feature.value) ? 'text-white' : 'text-gray-400'}`}>{feature.label}</p>
                                      <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{feature.description}</p>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => { resetForm(); setShowAddForm(false); setEditingBlock(null); }}
                        className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all text-sm"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        disabled={saving || formData.blockFeatures.length === 0}
                        className="px-10 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black transition-all flex items-center justify-center gap-2 min-w-[200px] shadow-lg shadow-red-500/20 disabled:opacity-50"
                      >
                        {saving ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" /> : <><Save className="w-4 h-4" /> <span>{editingBlock ? 'Сохранить изменения' : 'Подтвердить блокировку'}</span></>}
                      </button>
                    </div>
                    {error && <p className="text-sm text-red-500 text-center font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}
                  </form>
                </div>
              )}

              {/* Blocks List Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h4 className={`text-lg font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>История и активные блоки</h4>
                  {!showAddForm && !editingBlock && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black shadow-lg shadow-red-500/20 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Добавить блок
                    </button>
                  )}
                </div>

                {blocks.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <Shield className="w-16 h-16 text-gray-700 mx-auto opacity-20" />
                    <p className="text-gray-500 font-medium">Нет активных или прошлых блокировок</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {blocks.map(block => (
                      <div
                        key={block.id}
                        className={`group relative p-6 rounded-2xl border transition-all ${block.isActive && !isExpired(block.expiresAt) ? 'bg-red-500/5 border-red-500/30' : 'bg-white/2 border-white/5 grayscale opacity-60'}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${block.isActive && !isExpired(block.expiresAt) ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'}`}>
                              {block.targetType === 'single' ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className={`font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getTargetLabel(block)}</p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{block.isActive && !isExpired(block.expiresAt) ? 'Активна' : 'Неактивна'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(block)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(block.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{block.reason}</p>

                          <div className="flex flex-wrap gap-1.5">
                            {block.blockFeatures.slice(0, 3).map(f => (
                              <span key={f} className="text-[9px] font-black uppercase bg-white/5 px-2 py-0.5 rounded text-gray-500">{f}</span>
                            ))}
                            {block.blockFeatures.length > 3 && <span className="text-[9px] font-black uppercase bg-white/5 px-2 py-0.5 rounded text-gray-500">+{block.blockFeatures.length - 3}</span>}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
                              <Clock className="w-3 h-3" />
                              <span>{block.expiresAt ? `До ${new Date(block.expiresAt).toLocaleDateString('ru-RU')}` : 'Навсегда'}</span>
                            </div>
                            <button
                              onClick={() => handleToggleActive(block)}
                              className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all ${block.isActive && !isExpired(block.expiresAt) ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-400'}`}
                            >
                              {block.isActive ? 'Выключить' : 'Включить'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
