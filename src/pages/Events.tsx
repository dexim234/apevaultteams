import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { EventCard } from '@/components/Events/EventCard'
import { EventModal } from '@/components/Events/EventModal'
import { getEvents, deleteEvent, subscribeToEvents } from '@/services/eventService'
import type { Event, EventCategory } from '@/types'
import { EVENT_CATEGORY_META } from '@/types'
import {
  Calendar,
  Plus,
  Filter,
  TrendingUp,
  Gift,
  Image,
  Shield,
  Coins,
  Rocket,
  BarChart3,
} from 'lucide-react'

import { LucideIcon } from 'lucide-react'

const categoryIcons: Record<string, LucideIcon> = {
  memecoins: Rocket,
  polymarket: BarChart3,
  nft: Image,
  staking: Shield,
  spot: Coins,
  futures: TrendingUp,
  airdrop: Gift,
}

// Statuses and Filtering Constants
const DAYS_TO_SHOW = 3;

// Получение текущего времени в Москве (UTC+3)
const getMoscowDateTime = (): { date: string; time: string } => {
  // Создаём дату в часовом поясе UTC, затем добавляем 3 часа для Москвы
  const now = new Date()
  const moscowTime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() + 3, now.getUTCMinutes(), now.getUTCSeconds()))

  // Форматируем вручную, чтобы избежать проблем с часовыми поясами
  const dateStr = `${moscowTime.getFullYear()}-${String(moscowTime.getMonth() + 1).padStart(2, '0')}-${String(moscowTime.getDate()).padStart(2, '0')}`
  const timeStr = `${String(moscowTime.getHours()).padStart(2, '0')}:${String(moscowTime.getMinutes()).padStart(2, '0')}`

  return { date: dateStr, time: timeStr }
}

// Получение текущего времени в миллисекундах по Москве (UTC+3)
const getNowMskMs = (): number => {
  return Date.now() + 3 * 60 * 60 * 1000
}

export const EventsPage = () => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showMyOnly, setShowMyOnly] = useState(false)

  const fetchEvents = async () => {
    try {
      const data = await getEvents()
      setEvents(data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = subscribeToEvents((data) => {
      setEvents(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Обработка и фильтрация событий
  const filteredEvents = useMemo(() => {
    const { date: currentDate } = getMoscowDateTime()
    const nowMskMs = getNowMskMs()

    // 1. Сначала фильтруем по базовым критериям (категория, "только мои")
    let result = [...events]

    if (categoryFilter !== 'all') {
      result = result.filter((e) => e.category === categoryFilter)
    }

    if (showMyOnly && user) {
      result = result.filter((e) => e.requiredParticipants.includes(user.id))
    }

    // 2. Для обычных пользователей скрываем "скрытые" и ограничиваем по времени
    if (!isAdmin) {
      const maxDate = new Date(nowMskMs + (DAYS_TO_SHOW + 1) * 24 * 60 * 60 * 1000)
      const maxDateStr = maxDate.toISOString().split('T')[0]

      result = result.filter(event => {
        if (event.isHidden) return false

        return event.dates.some((date: string) => date >= currentDate && date <= maxDateStr)
      })
    }

    // 3. Сортировка: сначала Актуальные (те что идут сейчас или ForceActual), потом по времени
    const getStatusWeight = (event: Event) => {
      const eventStartMs = new Date(`${currentDate}T${event.time}`).getTime()
      const eventEndMs = event.endTime
        ? new Date(`${currentDate}T${event.endTime}`).getTime()
        : eventStartMs + 2 * 60 * 60 * 1000

      const isToday = event.dates.includes(currentDate)
      const isActive = isToday && eventStartMs <= nowMskMs && eventEndMs > nowMskMs

      if (event.isActualForce || isActive) return 0

      const nextDate = event.dates.filter(d => d >= currentDate).sort()[0]
      if (nextDate === currentDate) return 1
      if (nextDate) return 2
      return 3 // Прошедшие
    }

    result.sort((a, b) => {
      // Сначала по весу статуса
      const weightA = getStatusWeight(a)
      const weightB = getStatusWeight(b)
      if (weightA !== weightB) return weightA - weightB

      // Затем по ближайшей дате и времени
      const nextDateA = a.dates.filter((d: string) => d >= currentDate).sort()[0] || '9999-99-99'
      const nextDateB = b.dates.filter((d: string) => d >= currentDate).sort()[0] || '9999-99-99'

      if (nextDateA !== nextDateB) return nextDateA.localeCompare(nextDateB)
      return a.time.localeCompare(b.time)
    })

    return result
  }, [events, categoryFilter, showMyOnly, user, isAdmin])


  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Удалить это событие?')) return
    try {
      await deleteEvent(eventId)
      setEvents((prev: Event[]) => prev.filter((e: Event) => e.id !== eventId))
    } catch (error: any) {
      console.error('Failed to delete event:', error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    fetchEvents()
  }

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subtleColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  const borderColor = theme === 'dark' ? 'border-white/10' : 'border-gray-200'
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'

  return (
    <div className={`min-h-screen ${bgColor} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-lg shadow-emerald-500/20`}>
              <Calendar size={24} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${textColor}`}>События</h1>
              <p className={`text-sm ${subtleColor}`}>Анонсы мероприятий и важные даты</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl border ${borderColor} transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'} ${showFilters ? 'bg-emerald-500/10 border-emerald-500/30' : ''}`}
            >
              <Filter size={20} className={showFilters ? 'text-emerald-500' : subtleColor} />
            </button>

            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Создать</span>
                <span className="sm:hidden text-sm">Создать</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters panel */}
        <div className={`mb-6 p-5 rounded-2xl border ${borderColor} ${cardBg} shadow-sm transition-all duration-300 ${showFilters ? 'opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-4'}`}>
          <div className="space-y-6">
            {/* Category filter */}
            <div className="space-y-3">
              <span className={`text-xs font-black uppercase tracking-widest ${subtleColor}`}>По категории</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${categoryFilter === 'all'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Все
                </button>
                {(Object.keys(EVENT_CATEGORY_META) as EventCategory[]).map((cat) => {
                  const IconComponent = categoryIcons[cat]
                  const meta = EVENT_CATEGORY_META[cat]
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${categoryFilter === cat
                        ? `bg-gradient-to-r ${meta.gradient} text-white shadow-lg shadow-emerald-500/20`
                        : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      <IconComponent size={16} />
                      {meta.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* My events only */}
              <label className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showMyOnly}
                    onChange={(e) => setShowMyOnly(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </div>
                <span className={`text-sm font-bold ${textColor}`}>Только мои</span>
              </label>
            </div>
          </div>
        </div>

        {/* Unified Event List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
          </div>
        ) : (
          <div className={`rounded-2xl border ${borderColor} ${cardBg} overflow-hidden shadow-sm`}>
            <div className={`p-4 border-b ${borderColor} bg-gradient-to-r from-emerald-500/5 to-cyan-500/5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg">
                    <TrendingUp size={18} />
                  </div>
                  <h2 className={`text-lg font-bold ${textColor}`}>Список событий</h2>
                </div>
                <p className={`text-xs ${subtleColor}`}>
                  Найдено: {filteredEvents.length}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-20">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-500/10 mb-6`}>
                    <Calendar size={32} className="text-gray-500" />
                  </div>
                  <h3 className={`text-xl font-bold ${textColor} mb-2`}>Список пуст</h3>
                  <p className={`text-sm ${subtleColor} max-w-xs mx-auto`}>
                    На ближайшее время событий не запланировано или они скрыты.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isAdmin={isAdmin}
                      onEdit={(e) => {
                        setSelectedEvent(e)
                        setIsModalOpen(true)
                      }}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <EventModal
            event={selectedEvent}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  )
}
