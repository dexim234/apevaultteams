// Task Chat component
import { useState, useEffect, useRef } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import {
  addTaskChatMessage,
  getTaskChatMessages,
  updateTaskChatMessage,
  deleteTaskChatMessage,
  saveTaskChat,
  clearTaskChat,
  uploadChatImage,
  uploadChatDocument,
  deleteChatFile,
} from '@/services/firestoreService'
import { Task, TaskChatMessage } from '@/types'
import {
  X,
  Send,
  Image as ImageIcon,
  File,
  Edit2,
  Trash2,
  Save,
  Trash,
  MoreVertical,
  Clock,
  AlertCircle,
  MessageSquare,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

interface TaskChatProps {
  task: Task
  onClose: () => void
  onUpdate?: () => void
}

export const TaskChat = ({ task, onClose, onUpdate }: TaskChatProps) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()

  const [messages, setMessages] = useState<TaskChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [messageMenu, setMessageMenu] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const borderColor = theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const inputBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'

  useEffect(() => {
    loadMessages()
  }, [task.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadMessages = async () => {
    try {
      const taskMessages = await getTaskChatMessages(task.id)
      setMessages(taskMessages)
    } catch (error) {
      console.error('Error loading chat messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!user) {
      setError('Пользователь не авторизован')
      setTimeout(() => setError(null), 5000)
      return
    }

    if (!newMessage.trim() && !selectedImage && !selectedDocument) {
      setError('Введите сообщение или выберите файл')
      setTimeout(() => setError(null), 5000)
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      let imageUrl: string | undefined
      let documentUrl: string | undefined
      let documentName: string | undefined

      // Upload files to Firebase Storage (if any)
      if (selectedImage) {
        try {
          console.log('Uploading image...', selectedImage.name)
          imageUrl = await uploadChatImage(task.id, selectedImage)
          console.log('Image uploaded successfully:', imageUrl)
        } catch (error: any) {
          console.error('Error uploading image:', error)
          const errorMsg = error?.message || 'Неизвестная ошибка'
          setError(`Ошибка загрузки изображения: ${errorMsg}`)
          setTimeout(() => setError(null), 5000)
          setLoading(false)
          return
        }
      }
      
      if (selectedDocument) {
        try {
          console.log('Uploading document...', selectedDocument.name)
          documentUrl = await uploadChatDocument(task.id, selectedDocument)
          documentName = selectedDocument.name
          console.log('Document uploaded successfully:', documentUrl)
        } catch (error: any) {
          console.error('Error uploading document:', error)
          const errorMsg = error?.message || 'Неизвестная ошибка'
          setError(`Ошибка загрузки документа: ${errorMsg}`)
          setTimeout(() => setError(null), 5000)
          setLoading(false)
          return
        }
      }

      // Prepare message text
      const messageText = newMessage.trim() || (selectedImage || selectedDocument ? '📎 Файл' : '')
      
      if (!messageText && !imageUrl && !documentUrl) {
        setError('Невозможно отправить пустое сообщение')
        setTimeout(() => setError(null), 5000)
        setLoading(false)
        return
      }

      // Prepare message data
      const messageData = {
        taskId: task.id,
        userId: user.id,
        userName: user.name || 'Пользователь',
        message: messageText,
        imageUrl,
        documentUrl,
        documentName,
        createdAt: new Date().toISOString(),
        edited: false,
        deleted: false,
      }

      console.log('Sending message to Firestore...', messageData)
      
      // Send message to Firestore
      await addTaskChatMessage(messageData)
      
      console.log('Message sent successfully')

      // Clear form
      setNewMessage('')
      setSelectedImage(null)
      setSelectedDocument(null)
      
      // Clear file inputs
      if (imageInputRef.current) {
        imageInputRef.current.value = ''
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Reload messages
      await loadMessages()
      onUpdate?.()
      
    } catch (error: any) {
      console.error('Error sending message:', error)
      const errorMsg = error?.message || 'Неизвестная ошибка'
      setError(`Ошибка отправки сообщения: ${errorMsg}. Проверьте консоль для деталей.`)
      setTimeout(() => setError(null), 5000)
    } finally {
      setLoading(false)
    }
  }

  const handleEditMessage = async (messageId: string) => {
    if (!editText.trim()) return

    setLoading(true)
    try {
      await updateTaskChatMessage(messageId, { message: editText.trim() })
      setEditingMessage(null)
      setEditText('')
      await loadMessages()
    } catch (error) {
      console.error('Error editing message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = async (message: TaskChatMessage) => {
    setLoading(true)
    try {
      // Delete files from storage if they exist
      if (message.imageUrl) {
        await deleteChatFile(message.imageUrl)
      }
      if (message.documentUrl) {
        await deleteChatFile(message.documentUrl)
      }
      
      await deleteTaskChatMessage(message.id)
      setMessageMenu(null)
      await loadMessages()
    } catch (error) {
      console.error('Error deleting message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChat = async () => {
    setSaving(true)
    try {
      await saveTaskChat(task.id)
      onUpdate?.()
    } catch (error) {
      console.error('Error saving chat:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleClearChat = async () => {
    if (!confirm('Вы уверены, что хотите удалить все сообщения из чата?')) return

    setLoading(true)
    try {
      // Delete all files from storage first
      for (const message of messages) {
        if (message.imageUrl) {
          try {
            await deleteChatFile(message.imageUrl)
          } catch (error) {
            console.error('Error deleting image:', error)
          }
        }
        if (message.documentUrl) {
          try {
            await deleteChatFile(message.documentUrl)
          } catch (error) {
            console.error('Error deleting document:', error)
          }
        }
      }
      
      await clearTaskChat(task.id)
      setMessages([])
      onUpdate?.()
    } catch (error) {
      console.error('Error clearing chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === 'image' && file.type.startsWith('image/')) {
        setSelectedImage(file)
        setSelectedDocument(null)
      } else if (type === 'document' && !file.type.startsWith('image/')) {
        setSelectedDocument(file)
        setSelectedImage(null)
      }
    }
  }

  const canEditOrDelete = (message: TaskChatMessage) => {
    return user?.id === message.userId || isAdmin
  }

  const getTimeUntilExpiry = () => {
    if (!messages.length) return null
    const firstMessage = messages[0]
    const createdAt = new Date(firstMessage.createdAt)
    const expiresAt = new Date(createdAt.getTime() + 48 * 60 * 60 * 1000)
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()

    if (diff <= 0) return 'Чат будет удален'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `Осталось: ${hours}ч ${minutes}м`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${cardBg} rounded-xl w-full max-w-2xl h-[80vh] flex flex-col border-2 ${borderColor} shadow-xl`}>
        {/* Header */}
        <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
          <div className="flex-1">
            <h3 className={`text-lg font-bold ${headingColor}`}>Чат по задаче: {task.title}</h3>
            {task.chatSaved ? (
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                💾 Чат сохранен
              </p>
            ) : (
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {getTimeUntilExpiry()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!task.chatSaved && (
              <button
                onClick={handleSaveChat}
                disabled={saving}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' : 'bg-green-50 hover:bg-green-100 text-green-700'
                } disabled:opacity-50`}
                title="Сохранить чат"
              >
                <Save className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleClearChat}
              disabled={loading}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-700'
              } disabled:opacity-50`}
              title="Удалить чат"
            >
              <Trash className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mx-4 mt-4 p-3 rounded-lg border-2 ${
            theme === 'dark' ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
          } flex items-center gap-2`}>
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto p-1 rounded hover:bg-red-500/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-transparent">
          {messages.length === 0 ? (
            <div className={`text-center py-12 ${textColor}`}>
              <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'} opacity-50`} />
              <p className="text-lg font-medium mb-1">Нет сообщений</p>
              <p className="text-sm opacity-75">Начните обсуждение задачи!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.userId === user?.id ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`flex-1 max-w-[75%] sm:max-w-[70%] ${message.userId === user?.id ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`flex items-center gap-2 mb-1.5 ${message.userId === user?.id ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className={`text-xs font-semibold ${message.userId === user?.id ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-blue-400' : 'text-blue-600')}`}>
                      {message.userName}
                    </span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: ru })}
                    </span>
                    {message.edited && (
                      <span className={`text-xs italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        (изменено)
                      </span>
                    )}
                  </div>
                  {editingMessage === message.id ? (
                    <div className={`w-full ${cardBg} rounded-lg p-3 border-2 ${borderColor}`}>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-green-500/50`}
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditMessage(message.id)}
                          className={`px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors`}
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => {
                            setEditingMessage(null)
                            setEditText('')
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`${cardBg} rounded-xl p-3 sm:p-4 border-2 shadow-sm ${
                      message.userId === user?.id
                        ? theme === 'dark' ? 'border-green-500/50 bg-green-500/10' : 'border-green-300 bg-green-50'
                        : theme === 'dark' ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300 bg-gray-50'
                    } relative group transition-all hover:shadow-md`}>
                      {canEditOrDelete(message) && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="relative">
                            <button
                              onClick={() => setMessageMenu(messageMenu === message.id ? null : message.id)}
                              className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {messageMenu === message.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setMessageMenu(null)}
                                />
                                <div className={`absolute right-0 top-8 ${cardBg} rounded-lg shadow-xl border-2 ${borderColor} min-w-[150px] z-50`}>
                                  <button
                                    onClick={() => {
                                      setEditingMessage(message.id)
                                      setEditText(message.message)
                                      setMessageMenu(null)
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                                      theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <Edit2 className="w-4 h-4" /> Редактировать
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMessage(message)}
                                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 ${
                                      theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'
                                    }`}
                                  >
                                    <Trash2 className="w-4 h-4" /> Удалить
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      {message.imageUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden">
                          <img
                            src={message.imageUrl}
                            alt="Attached"
                            className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(message.imageUrl, '_blank')}
                          />
                        </div>
                      )}
                      {message.documentUrl && (
                        <a
                          href={message.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 p-2 rounded-lg mb-2 ${
                            theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <File className="w-4 h-4" />
                          <span className="text-sm truncate">{message.documentName || 'Документ'}</span>
                        </a>
                      )}
                      {selectedImage && message.id === 'new' && (
                        <div className="mb-2">
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            className="max-w-full h-auto rounded-lg"
                          />
                          <p className="text-xs mt-1">{selectedImage.name}</p>
                        </div>
                      )}
                      {selectedDocument && message.id === 'new' && (
                        <div className={`p-2 rounded-lg mb-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <File className="w-4 h-4 inline mr-2" />
                          <span className="text-sm">{selectedDocument.name}</span>
                        </div>
                      )}
                      {message.message && (
                        <p className={`text-sm ${textColor} break-words whitespace-pre-wrap leading-relaxed`}>
                          {message.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${borderColor} space-y-2 bg-gradient-to-t ${theme === 'dark' ? 'from-gray-800 to-gray-800' : 'from-white to-gray-50'}`}>
          {(selectedImage || selectedDocument) && (
            <div className={`flex items-center gap-2 p-2.5 rounded-lg border-2 ${borderColor} ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              {selectedImage && (
                <>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="w-12 h-12 rounded object-cover"
                  />
                  <span className="text-sm flex-1 truncate">{selectedImage.name}</span>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="p-1 rounded hover:bg-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              {selectedDocument && (
                <>
                  <File className="w-5 h-5" />
                  <span className="text-sm flex-1 truncate">{selectedDocument.name}</span>
                  <button
                    onClick={() => setSelectedDocument(null)}
                    className="p-1 rounded hover:bg-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="file"
              ref={imageInputRef}
              accept="image/*"
              onChange={(e) => handleFileSelect(e, 'image')}
              className="hidden"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e, 'document')}
              className="hidden"
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title="Добавить изображение"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title="Добавить документ"
            >
              <File className="w-5 h-5" />
            </button>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (!loading && (newMessage.trim() || selectedImage || selectedDocument)) {
                    handleSendMessage()
                  }
                }
              }}
              placeholder="Напишите сообщение... (Enter для отправки, Shift+Enter для новой строки)"
              rows={2}
              className={`flex-1 px-4 py-2.5 rounded-lg border-2 ${borderColor} ${inputBg} ${headingColor} focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none transition-all placeholder:${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || (!newMessage.trim() && !selectedImage && !selectedDocument)}
              className={`p-2.5 rounded-lg transition-all ${
                loading || (!newMessage.trim() && !selectedImage && !selectedDocument)
                  ? 'bg-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-green-500 hover:bg-green-600 hover:shadow-lg active:scale-95'
              } text-white disabled:opacity-50 flex items-center justify-center`}
              title="Отправить сообщение"
            >
              {loading ? (
                <Clock className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

