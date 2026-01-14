import { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/store/themeStore'
import {
  BookOpen,
  FileText,
  Link2,
  Plus,
  X,
  ChevronRight,
  GraduationCap,
  Video,
  FolderOpen,
  ExternalLink,
  Upload,
  Trash2,
  Edit3,
  TrendingUp,
  Coins,
  Image,
  Gift,
  Shield,
  BarChart3,
  Search,
} from 'lucide-react'

// Simple cn utility inline
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

// Темы уроков
const TOPICS = [
  { id: 'memecoins', label: 'Мемкоины', icon: 'coins', color: 'emerald' },
  { id: 'polymarket', label: 'Polymarket', icon: 'barchart', color: 'pink' },
  { id: 'nft', label: 'NFT', icon: 'image', color: 'purple' },
  { id: 'staking', label: 'Стейкинг', icon: 'shield', color: 'indigo' },
  { id: 'spot', label: 'Спотовая торговля', icon: 'trending', color: 'amber' },
  { id: 'futures', label: 'Фьючерсная торговля', icon: 'bar_chart', color: 'blue' },
  { id: 'airdrop', label: 'AirDrop', icon: 'gift', color: 'cyan' },
] as const

type TopicId = typeof TOPICS[number]['id']

// Типы данных урока
interface Lesson {
  id: string
  topicId: TopicId
  lessonNumber: number
  title: string
  videoUrl?: string
  videoFile?: File
  fileUrl?: string
  file?: File
  comment?: string
  resources: Resource[]
  createdAt: string
  updatedAt: string
}

interface Resource {
  id: string
  title: string
  url: string
  description: string
}

// Демо-данные уроков
const demoLessons: Record<TopicId, Lesson[]> = {
  memecoins: [
    {
      id: '1',
      topicId: 'memecoins',
      lessonNumber: 1,
      title: 'Введение в мемкоины: что это и как работает',
      comment: 'Базовый курс для начинающих. Изучаем основы мемкоинов, их историю и принципы работы.',
      resources: [
        { id: '1', title: 'CoinGecko - криптовалютный трекер', url: 'https://www.coingecko.com', description: 'Лучший агрегатор данных о криптовалютах и мемкоинах' },
        { id: '2', title: 'DexScreener - аналитика DEX', url: 'https://dexscreener.com', description: 'Аналитика децентрализованных бирж и торговых пар' },
      ],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    },
    {
      id: '2',
      topicId: 'memecoins',
      lessonNumber: 2,
      title: 'Анализ токеномики и ликвидности',
      comment: 'Учимся читать токеномику проектов и оценивать риски ликвидности.',
      resources: [
        { id: '3', title: 'Dextools', url: 'https://www.dextools.io', description: 'Инструменты для анализа DEX-пар и графиков' },
      ],
      createdAt: '2025-01-02',
      updatedAt: '2025-01-02',
    },
  ],
  polymarket: [
    {
      id: '3',
      topicId: 'polymarket',
      lessonNumber: 1,
      title: 'Polymarket: основы и первые шаги',
      comment: 'Знакомство с платформой прогнозных рынков.',
      resources: [
        { id: '4', title: 'Polymarket', url: 'https://polymarket.com', description: 'Официальный сайт платформы' },
      ],
      createdAt: '2025-01-03',
      updatedAt: '2025-01-03',
    },
  ],
  nft: [
    {
      id: '4',
      topicId: 'nft',
      lessonNumber: 1,
      title: 'NFT: мир невзаимозаменяемых токенов',
      comment: 'Введение в NFT и их применение.',
      resources: [],
      createdAt: '2025-01-04',
      updatedAt: '2025-01-04',
    },
  ],
  staking: [
    {
      id: '5',
      topicId: 'staking',
      lessonNumber: 1,
      title: 'Стейкинг: пассивный доход в криптовалютах',
      comment: 'Основы стейкинга и типы размещения.',
      resources: [],
      createdAt: '2025-01-05',
      updatedAt: '2025-01-05',
    },
  ],
  spot: [
    {
      id: '6',
      topicId: 'spot',
      lessonNumber: 1,
      title: 'Спотовая торговля: базовые понятия',
      comment: 'Учимся торговать на спотовом рынке.',
      resources: [],
      createdAt: '2025-01-06',
      updatedAt: '2025-01-06',
    },
  ],
  futures: [
    {
      id: '7',
      topicId: 'futures',
      lessonNumber: 1,
      title: 'Фьючерсы: торговля с плечом',
      comment: 'Введение в фьючерсную торговлю.',
      resources: [],
      createdAt: '2025-01-07',
      updatedAt: '2025-01-07',
    },
  ],
  airdrop: [
    {
      id: '8',
      topicId: 'airdrop',
      lessonNumber: 1,
      title: 'AirDrop: как находить и участвовать',
      comment: 'Стратегии поиска перспективных airdrop.',
      resources: [],
      createdAt: '2025-01-08',
      updatedAt: '2025-01-08',
    },
  ],
}

// Модальное окно добавления/редактирования урока
const LessonModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSave: (lesson: Partial<Lesson>) => void
  editingLesson?: Lesson | null
  topics: typeof TOPICS
}> = ({ isOpen, onClose, onSave, editingLesson, topics }) => {
  const { theme } = useThemeStore()
  const [formData, setFormData] = useState<Partial<Lesson>>({
    topicId: topics[0].id,
    lessonNumber: 1,
    title: '',
    comment: '',
    resources: [],
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [fileFile, setFileFile] = useState<File | null>(null)
  const [resourceUrl, setResourceUrl] = useState('')
  const [resourceTitle, setResourceTitle] = useState('')
  const [resourceDesc, setResourceDesc] = useState('')
  const [showResourceForm, setShowResourceForm] = useState(false)

  const videoInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingLesson) {
      setFormData({
        topicId: editingLesson.topicId,
        lessonNumber: editingLesson.lessonNumber,
        title: editingLesson.title,
        comment: editingLesson.comment,
        resources: editingLesson.resources,
      })
    } else {
      setFormData({
        topicId: topics[0].id,
        lessonNumber: 1,
        title: '',
        comment: '',
        resources: [],
      })
    }
  }, [editingLesson, isOpen, topics])

  const handleSubmit = () => {
    if (!formData.title || !formData.topicId) return
    onSave({
      ...formData,
      videoFile: videoFile || undefined,
      file: fileFile || undefined,
    })
    setVideoFile(null)
    setFileFile(null)
    onClose()
  }

  const addResource = () => {
    if (!resourceUrl || !resourceTitle) return
    const newResource: Resource = {
      id: Date.now().toString(),
      title: resourceTitle,
      url: resourceUrl,
      description: resourceDesc,
    }
    setFormData(prev => ({
      ...prev,
      resources: [...(prev.resources || []), newResource],
    }))
    setResourceUrl('')
    setResourceTitle('')
    setResourceDesc('')
    setShowResourceForm(false)
  }

  const removeResource = (id: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources?.filter(r => r.id !== id) || [],
    }))
  }

  const getTopicColor = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
      pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/20' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' },
      indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20' },
    }
    return colors[color] || colors.emerald
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl",
        theme === 'dark' ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white border border-gray-200'
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between px-6 py-4 border-b",
          theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        )}>
          <h2 className={cn(
            "text-xl font-bold",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {editingLesson ? 'Редактировать урок' : 'Добавить урок'}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-lg transition-colors",
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            )}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6 space-y-6">
          {/* Тема */}
          <div>
            <label className={cn(
              "block text-sm font-medium mb-2",
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              Тема *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {topics.map((topic) => {
                const color = getTopicColor(topic.color)
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, topicId: topic.id }))}
                    className={cn(
                      "px-3 py-2 rounded-xl text-sm font-medium transition-all",
                      formData.topicId === topic.id
                        ? color.bg
                        : theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
                    )}
                  >
                    <span className={cn(
                      formData.topicId === topic.id ? color.text : 'text-gray-600 dark:text-gray-400'
                    )}>
                      {topic.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Номер урока и Название */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={cn(
                "block text-sm font-medium mb-2",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                Номер урока
              </label>
              <input
                type="number"
                min="1"
                value={formData.lessonNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, lessonNumber: parseInt(e.target.value) || 1 }))}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl border font-medium",
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-white focus:border-blue-500/50' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500'
                )}
              />
            </div>
            <div className="col-span-2">
              <label className={cn(
                "block text-sm font-medium mb-2",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                Название урока *
              </label>
              <input
                type="text"
                placeholder="Введите название урока"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={cn(
                  "w-full px-4 py-2.5 rounded-xl border font-medium",
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                )}
              />
            </div>
          </div>

          {/* Видео */}
          <div>
            <label className={cn(
              "block text-sm font-medium mb-2",
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              Видео (загрузить файл)
            </label>
            <div 
              onClick={() => videoInputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                theme === 'dark' 
                  ? 'border-white/10 hover:border-white/20' 
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setVideoFile(file)
                }}
                className="hidden"
              />
              {videoFile ? (
                <div className="flex items-center justify-center gap-3">
                  <Video className="w-5 h-5 text-emerald-500" />
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    {videoFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setVideoFile(null)
                    }}
                    className="p-1 rounded-lg hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    Нажмите или перетащите файл видео
                  </span>
                  <span className="text-xs text-gray-500">
                    MP4, WebM (макс. 500 МБ)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Файл */}
          <div>
            <label className={cn(
              "block text-sm font-medium mb-2",
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              Файл (загрузить файл)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                theme === 'dark' 
                  ? 'border-white/10 hover:border-white/20' 
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.zip"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setFileFile(file)
                }}
                className="hidden"
              />
              {fileFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    {fileFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFileFile(null)
                    }}
                    className="p-1 rounded-lg hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FolderOpen className="w-8 h-8 text-gray-400" />
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    Нажмите или перетащите файл
                  </span>
                  <span className="text-xs text-gray-500">
                    PDF, DOC, TXT, ZIP (макс. 100 МБ)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Комментарий */}
          <div>
            <label className={cn(
              "block text-sm font-medium mb-2",
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            )}>
              Комментарий
            </label>
            <textarea
              rows={3}
              placeholder="Добавьте описание или комментарий к уроку..."
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              className={cn(
                "w-full px-4 py-2.5 rounded-xl border font-medium resize-none",
                theme === 'dark' 
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none'
              )}
            />
          </div>

          {/* Полезные ресурсы */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={cn(
                "block text-sm font-medium",
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                Полезные ресурсы
              </label>
              <button
                type="button"
                onClick={() => setShowResourceForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Добавить
              </button>
            </div>

            {/* Список ресурсов */}
            {formData.resources && formData.resources.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className={cn(
                      "flex items-start justify-between gap-3 p-3 rounded-xl",
                      theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className={cn(
                          "font-medium truncate",
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        )}>
                          {resource.title}
                        </span>
                      </div>
                      {resource.description && (
                        <p className={cn(
                          "text-sm mt-1 line-clamp-2",
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>
                          {resource.description}
                        </p>
                      )}
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        {resource.url.slice(0, 40)}...
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeResource(resource.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Форма добавления ресурса */}
            {showResourceForm && (
              <div className={cn(
                "p-4 rounded-xl border mb-4",
                theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
              )}>
                <div className="grid gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Название ресурса *"
                      value={resourceTitle}
                      onChange={(e) => setResourceTitle(e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border text-sm",
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                      )}
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="Ссылка *"
                      value={resourceUrl}
                      onChange={(e) => setResourceUrl(e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border text-sm",
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                      )}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Описание (необязательно)"
                      value={resourceDesc}
                      onChange={(e) => setResourceDesc(e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border text-sm",
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addResource}
                      disabled={!resourceUrl || !resourceTitle}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Добавить
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowResourceForm(false)
                        setResourceUrl('')
                        setResourceTitle('')
                        setResourceDesc('')
                      }}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium",
                        theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      )}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={cn(
          "flex items-center justify-end gap-3 px-6 py-4 border-t",
          theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        )}>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "px-5 py-2.5 rounded-xl font-medium transition-colors",
              theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.title || !formData.topicId}
            className="px-5 py-2.5 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {editingLesson ? 'Сохранить' : 'Добавить урок'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Компонент карточки урока
const LessonCard: React.FC<{
  lesson: Lesson
  topicColor: { bg: string; text: string; border: string; gradient: string }
  onEdit: () => void
  onDelete: () => void
}> = ({ lesson, topicColor, onEdit, onDelete }) => {
  const { theme } = useThemeStore()

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl",
      theme === 'dark' 
        ? 'bg-[#1a1a1a] border-white/10 hover:border-white/20' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    )}>
      {/* Decorative gradient */}
      <div className={cn(
        "absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity",
        `bg-gradient-to-br ${topicColor.gradient}`
      )} />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              topicColor.bg
            )}>
              <span className={cn("text-lg font-black", topicColor.text)}>
                {lesson.lessonNumber}
              </span>
            </div>
            <div>
              <h3 className={cn(
                "font-bold leading-tight",
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {lesson.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Обновлено {lesson.updatedAt}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-blue-500" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {/* Comment */}
        {lesson.comment && (
          <p className={cn(
            "text-sm mb-4 line-clamp-2",
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            {lesson.comment}
          </p>
        )}

        {/* Resources */}
        {lesson.resources.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {lesson.resources.slice(0, 3).map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                  theme === 'dark' 
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                <Link2 className="w-3 h-3" />
                {resource.title}
              </a>
            ))}
            {lesson.resources.length > 3 && (
              <span className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium",
                theme === 'dark' ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
              )}>
                +{lesson.resources.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-dashed border-opacity-20 border-gray-500">
          <div className="flex items-center gap-3">
            {lesson.videoFile && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-500">
                <Video className="w-3.5 h-3.5" />
                Видео
              </div>
            )}
            {lesson.file && (
              <div className="flex items-center gap-1.5 text-xs text-blue-500">
                <FileText className="w-3.5 h-3.5" />
                Файл
              </div>
            )}
            {lesson.resources.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-purple-500">
                <Link2 className="w-3.5 h-3.5" />
                {lesson.resources.length} ресурс{lesson.resources.length === 1 ? '' : lesson.resources.length < 5 ? 'а' : 'ов'}
              </div>
            )}
          </div>
          
          <ChevronRight className={cn(
            "w-5 h-5 transition-transform group-hover:translate-x-1",
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          )} />
        </div>
      </div>
    </div>
  )
}

export const LearningPlatform = () => {
  const { theme } = useThemeStore()
  const [selectedTopic, setSelectedTopic] = useState<TopicId>('memecoins')
  const [lessons, setLessons] = useState<Record<TopicId, Lesson[]>>(demoLessons as unknown as Record<TopicId, Lesson[]>)
  const [showModal, setShowModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'

  const getTopicColor = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', gradient: 'from-emerald-500 to-teal-600' },
      pink: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/20', gradient: 'from-pink-500 to-rose-600' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', gradient: 'from-purple-500 to-pink-600' },
      indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20', gradient: 'from-indigo-500 to-violet-600' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', gradient: 'from-amber-500 to-orange-600' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', gradient: 'from-blue-500 to-indigo-600' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20', gradient: 'from-cyan-500 to-blue-600' },
    }
    return colors[color] || colors.emerald
  }

  const currentTopic = TOPICS.find(t => t.id === selectedTopic) || TOPICS[0]
  const topicColor = getTopicColor(currentTopic.color)
  const currentLessons = lessons[selectedTopic] || []

  const filteredLessons = currentLessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.comment?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSaveLesson = (lessonData: Partial<Lesson>) => {
    if (editingLesson) {
      setLessons(prev => ({
        ...prev,
        [selectedTopic]: prev[selectedTopic].map(l =>
          l.id === editingLesson.id
            ? { ...l, ...lessonData, updatedAt: new Date().toISOString().split('T')[0] } as Lesson
            : l
        )
      }))
    } else {
      const newLesson: Lesson = {
        id: Date.now().toString(),
        topicId: selectedTopic as TopicId,
        lessonNumber: lessonData.lessonNumber || 1,
        title: lessonData.title || '',
        comment: lessonData.comment,
        resources: lessonData.resources || [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
      setLessons(prev => ({
        ...prev,
        [selectedTopic]: [...prev[selectedTopic], newLesson].sort((a, b) => a.lessonNumber - b.lessonNumber)
      }))
    }
    setEditingLesson(null)
  }

  const handleDeleteLesson = (lessonId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот урок?')) {
      setLessons(prev => ({
        ...prev,
        [selectedTopic]: prev[selectedTopic].filter(l => l.id !== lessonId)
      }))
    }
  }

  const openAddModal = () => {
    setEditingLesson(null)
    setShowModal(true)
  }

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setShowModal(true)
  }

  // Иконки для тем
  const getTopicIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      coins: <Coins className="w-5 h-5" />,
      barchart: <BarChart3 className="w-5 h-5" />,
      image: <Image className="w-5 h-5" />,
      shield: <Shield className="w-5 h-5" />,
      trending: <TrendingUp className="w-5 h-5" />,
      bar_chart: <BarChart3 className="w-5 h-5" />,
      gift: <Gift className="w-5 h-5" />,
    }
    return icons[icon] || <BookOpen className="w-5 h-5" />
  }

  return (
    <div className="space-y-6">
      {/* Header - Красивая шапка в стиле Strategies */}
      <div className={`relative overflow-hidden rounded-3xl border ${theme === 'dark' ? 'border-blue-500/30 bg-[#151a21]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : 'border-blue-500/20 bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]'}`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-16 -bottom-10 w-80 h-80 bg-blue-500/10 blur-3xl"></div>
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05),transparent_45%)]' : 'bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_45%)]'}`}></div>
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Icon + Title */}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-blue-500/10 border-blue-500/30'}`}>
              <GraduationCap className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-blue-500'}`} />
            </div>
            <div>
              <h1 className={`text-3xl font-black ${headingColor} whitespace-nowrap`}>
                Учебная платформа
              </h1>
              <p className={`text-sm ${subTextColor} mt-1`}>
                {currentLessons.length} урок{currentLessons.length === 1 ? '' : currentLessons.length < 5 ? 'а' : 'ов'} в разделе «{currentTopic.label}»
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Поиск уроков..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-10 pr-4 py-2.5 rounded-xl border font-medium w-48 transition-all",
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-white focus:border-blue-500/50 focus:outline-none' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none'
                )}
              />
            </div>

            {/* Add Button */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить урок</span>
            </button>
          </div>
        </div>
      </div>

      {/* Topic Navigation */}
      <div className={cn(
        "rounded-2xl p-4 border overflow-x-auto",
        theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center gap-2 min-w-max">
          {TOPICS.map((topic) => {
            const color = getTopicColor(topic.color)
            const isActive = selectedTopic === topic.id
            const lessonCount = lessons[topic.id]?.length || 0

            return (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic.id)
                  setSearchQuery('')
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap",
                  isActive
                    ? color.bg
                    : theme === 'dark' 
                      ? 'hover:bg-white/5 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                )}
              >
                <span className={isActive ? color.text : ''}>
                  {getTopicIcon(topic.icon)}
                </span>
                <span className={isActive ? color.text : ''}>
                  {topic.label}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-bold",
                  isActive
                    ? 'bg-white/20 text-white'
                    : theme === 'dark' ? 'bg-white/10 text-gray-500' : 'bg-gray-200 text-gray-600'
                )}>
                  {lessonCount}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="space-y-4">
        {filteredLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                topicColor={topicColor}
                onEdit={() => openEditModal(lesson)}
                onDelete={() => handleDeleteLesson(lesson.id)}
              />
            ))}
          </div>
        ) : (
          <div className={cn(
            "rounded-2xl p-12 text-center border",
            theme === 'dark' ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'
          )}>
            <div className={cn(
              "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4",
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
            )}>
              <BookOpen className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <h3 className={cn(
              "text-lg font-bold mb-2",
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {searchQuery ? 'Уроки не найдены' : 'Уроки пока не добавлены'}
            </h3>
            <p className={cn(
              "text-sm mb-6",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {searchQuery 
                ? 'Попробуйте изменить запрос поиска'
                : 'Начните добавлять уроки для темы «' + currentTopic.label + '»'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Добавить первый урок
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <LessonModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingLesson(null)
        }}
        onSave={handleSaveLesson}
        editingLesson={editingLesson}
        topics={TOPICS}
      />
    </div>
  )
}

export default LearningPlatform