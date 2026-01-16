import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useUsers } from '@/hooks/useUsers'
import { useScrollLock } from '@/hooks/useScrollLock'
import { addEvent, updateEvent } from '@/services/eventService'
import { uploadFile, deleteFile } from '@/services/storageService'
import type { Event, EventCategory, EventFile } from '@/types'
import { EVENT_CATEGORY_META } from '@/types'
import {
  X,
  Upload,
  Trash2,
  Plus,
  Calendar,
  Link as LinkIcon,
  FileText as FileTextIcon,
  Rocket,
  BarChart3,
  Shield,
  Coins,
  TrendingUp,
  Gift,
  Image,
} from 'lucide-react'

interface EventModalProps {
  event: Event | null
  onClose: () => void
}

const categoryIcons: Record<string, any> = {
  memecoins: Rocket,
  polymarket: BarChart3,
  nft: Image,
  staking: Shield,
  spot: Coins,
  futures: TrendingUp,
  airdrop: Gift,
}

export const EventModal = ({ event, onClose }: EventModalProps) => {
  const { user } = useAuthStore()
  const { theme } = useThemeStore()
  const { users: allMembers } = useUsers()
  const { lockScroll, unlockScroll } = useScrollLock()

  useEffect(() => {
    lockScroll()
    return unlockScroll
  }, [lockScroll, unlockScroll])

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [category, setCategory] = useState<EventCategory>(event?.category || 'memecoins')
  const [dates, setDates] = useState<string[]>(event?.dates || [])
  const [time, setTime] = useState(event?.time || '12:00')
  const [link, setLink] = useState(event?.link || '')
  const [requiredParticipants, setRequiredParticipants] = useState<string[]>(event?.requiredParticipants || [])
  const [files, setFiles] = useState<EventFile[]>(event?.files || [])

  // New date input
  const [newDate, setNewDate] = useState('')

  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const inputBg = theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'

  const meta = EVENT_CATEGORY_META[category]
  const IconComponent = categoryIcons[category]

  const handleAddDate = () => {
    if (newDate && !dates.includes(newDate)) {
      setDates(prev => [...prev, newDate].sort())
      setNewDate('')
    }
  }

  const handleRemoveDate = (date: string) => {
    setDates(prev => prev.filter(d => d !== date))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...newFiles])
  }

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingFile = async (file: EventFile) => {
    if (!window.confirm(`Удалить файл "${file.name}"?`)) return
    try {
      await deleteFile(file.url)
      setFiles(prev => prev.filter(f => f.id !== file.id))
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  const handleUploadFiles = async (eventId: string): Promise<EventFile[]> => {
    if (selectedFiles.length === 0) return []

    setUploading(true)
    const uploadedFiles: EventFile[] = []

    try {
      for (const file of selectedFiles) {
        const path = `events/${eventId}/${Date.now()}_${file.name}`
        const url = await uploadFile(file, path)
        uploadedFiles.push({
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          name: file.name,
          url,
          type: file.type,
          size: file.size,
        })
      }
      return uploadedFiles
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || dates.length === 0) {
      alert('Заполните обязательные поля: название и даты')
      return
    }

    setLoading(true)

    try {
      let eventId = event?.id

      if (event) {
        // Update existing event
        await updateEvent(event.id, {
          title,
          description,
          category,
          dates,
          time,
          link: link || undefined,
          requiredParticipants,
          files,
        })
      } else {
        // Create new event
        eventId = await addEvent({
          title,
          description,
          category,
          dates,
          time,
          link: link || undefined,
          requiredParticipants,
          files: [],
          createdBy: user?.id || '',
        })

        // Upload new files
        const uploadedFiles = await handleUploadFiles(eventId)
        if (uploadedFiles.length > 0) {
          await updateEvent(eventId, { files: uploadedFiles })
        }
      }

      onClose()
    } catch (error) {
      console.error('Failed to save event:', error)
      alert('Ошибка при сохранении события')
    } finally {
      setLoading(false)
    }
  }

  const toggleParticipant = (userId: string) => {
    setRequiredParticipants(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl ${bgColor} shadow-2xl`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${meta.gradient} bg-opacity-10 text-white`}>
              <IconComponent size={20} />
            </div>
            <h2 className={`text-xl font-bold ${textColor}`}>
              {event ? 'Редактирование события' : 'Новое событие'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X size={20} className={subtleColor} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Название *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название события"
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Категория
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(EVENT_CATEGORY_META) as EventCategory[]).map((cat) => {
                const catMeta = EVENT_CATEGORY_META[cat]
                const CatIcon = categoryIcons[cat]
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      category === cat
                        ? `bg-gradient-to-r ${catMeta.gradient} text-white`
                        : theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <CatIcon size={16} />
                    {catMeta.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите событие..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none`}
            />
          </div>

          {/* Dates and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Даты *
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                  <button
                    type="button"
                    onClick={handleAddDate}
                    disabled={!newDate}
                    className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                {dates.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {dates.map((date) => (
                      <span
                        key={date}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      >
                        <Calendar size={12} />
                        {new Date(date).toLocaleDateString('ru-RU')}
                        <button
                          type="button"
                          onClick={() => handleRemoveDate(date)}
                          className="ml-1 hover:text-red-400"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Время
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              />
            </div>
          </div>

          {/* Link */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Ссылка
            </label>
            <div className="relative">
              <LinkIcon size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${subtleColor}`} />
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${borderColor} ${inputBg} ${textColor} placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              />
            </div>
          </div>

          {/* Required Participants */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Обязательные участники
            </label>
            <div className="flex flex-wrap gap-2">
              {allMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleParticipant(member.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    requiredParticipants.includes(member.id)
                      ? 'bg-emerald-500 text-white'
                      : theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          {/* Files */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Файлы
            </label>

            {/* Existing files */}
            {files.length > 0 && (
              <div className="space-y-2 mb-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${borderColor}`}
                  >
                    <FileTextIcon size={18} className={subtleColor} />
                    <span className={`flex-1 text-sm truncate ${textColor}`}>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingFile(file)}
                      className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Selected files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 mb-4">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${borderColor}`}
                  >
                    <FileTextIcon size={18} className={subtleColor} />
                    <span className={`flex-1 text-sm truncate ${textColor}`}>{file.name}</span>
                    <span className={`text-xs ${subtleColor}`}>
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSelectedFile(index)}
                      className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed ${borderColor} ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-all`}
            >
              <Upload size={18} className={subtleColor} />
              <span className={`text-sm ${subtleColor}`}>Загрузить файлы</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.7z,.rar,.png,.jpg,.jpeg,.gif"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t ${borderColor}">
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              {loading || uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>Сохранить</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}