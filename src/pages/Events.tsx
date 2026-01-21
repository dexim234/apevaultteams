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
  Archive,
  Star,
} from 'lucide-react'

const categoryIcons: Record<string, any> = {
  memecoins: Rocket,
  polymarket: BarChart3,
  nft: Image,
  staking: Shield,
  spot: Coins,
  futures: TrendingUp,
  airdrop: Gift,
}

// Типы колонок
type EventColumn = 'upcoming' | 'active' | 'past'

interface ColumnConfig {
  id: EventColumn
  label: string
  icon: React.ElementType
  color: string
  gradient: string
  bgGradient: string
}

const COLUMNS: ColumnConfig[] = [
  {
    id: 'upcoming',
    label: 'Предстоящие',
    icon: Star,
    color: 'text-amber-500',
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'bg-amber-500/5',
  },
  {
    id: 'active',
    label: 'Актуальные',
    icon: TrendingUp,
    color: 'text-emerald-500',
    gradient: 'from-emerald-500 to-cyan-500',
    bgGradient: 'bg-emerald-500/5',
  },
  {
    id: 'past',
    label: 'Прошедшие',
    icon: Archive,
    color: 'text-gray-500',
    gradient: 'from-gray-500 to-gray-600',
    bgGradient: 'bg-gray-500/5',
  },
]

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

  // Разделение событий по колонкам
  const eventsByColumns = useMemo(() => {
    const { date: currentDate } = getMoscowDateTime()
    const nowMskMs = getNowMskMs()

    const columns: Record<EventColumn, Event[]> = {
      upcoming: [],
      active: [],
      past: [],
    }

    // Время для перехода в "Актуальные" (30 минут до начала)
    const activeThresholdMs = 30 * 60 * 1000

    events.forEach((event) => {
      // Функция для получения времени окончания события на конкретную дату
      const getEventEndMs = (date: string) => {
        const startMs = new Date(`${date}T${event.time}`).getTime()
        if (event.endTime) {
          return new Date(`${date}T${event.endTime}`).getTime()
        }
        return startMs + 2 * 60 * 60 * 1000 // По умолчанию 2 часа
      }

      // Получаем все даты события, которые ещё не закончились
      const upcomingDates = event.dates
        .filter((date) => {
          const eventEndMs = getEventEndMs(date)
          return eventEndMs > nowMskMs
        })
        .sort()

      const nextDate = upcomingDates[0]

      if (!nextDate) {
        // Все даты прошли - в прошедшие
        columns.past.push(event)
        return
      }

      // Определяем правильную дату для проверки статуса
      // Если сегодня в upcomingDates, используем сегодня (событие идёт сейчас или было сегодня)
      const isTodayInUpcoming = upcomingDates.includes(currentDate)
      const checkDate = isTodayInUpcoming ? currentDate : nextDate

      // Проверяем, активно ли событие сейчас
      const eventStartMs = new Date(`${checkDate}T${event.time}`).getTime()
      const eventEndMs = getEventEndMs(checkDate)

      const isToday = event.dates.includes(currentDate)
      const isActive = isToday && eventStartMs <= nowMskMs && eventEndMs > nowMskMs
      const timeToStart = eventStartMs - nowMskMs

      // Событие в "Актуальных" если идёт сейчас или до начала менее 30 минут
      if (isActive || (timeToStart > 0 && timeToStart <= activeThresholdMs)) {
        columns.active.push(event)
        return
      }

      // Более 30 минут до начала - в предстоящие
      if (timeToStart > activeThresholdMs) {
        columns.upcoming.push(event)
        return
      }

      // Если мы здесь - значит событие закончилось сегодня
      columns.past.push(event)
    })

    // Сортировка внутри колонок
    const sortByDate = (a: Event, b: Event) => {
      const aDates = a.dates.sort()
      const bDates = b.dates.sort()
      return aDates[0].localeCompare(bDates[0])
    }

    columns.upcoming.sort(sortByDate)
    columns.active.sort(sortByDate)
    columns.past.sort((a, b) => {
      const aDates = a.dates.sort()
      const bDates = b.dates.sort()
      return bDates[0].localeCompare(aDates[0]) // Прошедшие - от новых к старым
    })

    return columns
  }, [events])

  // Фильтрация внутри колонок
  const getFilteredEvents = (columnEvents: Event[]) => {
    let result = [...columnEvents]

    // Фильтр по категории
    if (categoryFilter !== 'all') {
      result = result.filter((e) => e.category === categoryFilter)
    }

    // Фильтр по участию пользователя
    if (showMyOnly && user) {
      result = result.filter((e) => e.requiredParticipants.includes(user.id))
    }

    return result
  }

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Удалить это событие?')) return
    try {
      await deleteEvent(eventId)
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
    } catch (error) {
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

        {/* Three-column layout */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {COLUMNS.map((column) => {
              const IconComponent = column.icon
              const filteredEvents = getFilteredEvents(eventsByColumns[column.id])
              // Запрещаем редактирование RSVP для активных и прошедших событий
              const isEditable = column.id === 'upcoming'

              return (
                <div
                  key={column.id}
                  className={`flex flex-col rounded-2xl border ${borderColor} ${cardBg} overflow-hidden`}
                >
                  {/* Column header */}
                  <div className={`p-4 border-b ${borderColor} bg-gradient-to-r ${column.bgGradient}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${column.gradient} text-white shadow-lg`}>
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <h2 className={`text-lg font-bold ${textColor}`}>{column.label}</h2>
                        <p className={`text-xs ${subtleColor}`}>
                          {filteredEvents.length} {filteredEvents.length === 1 ? 'событие' : filteredEvents.length >= 2 && filteredEvents.length <= 4 ? 'события' : 'событий'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Column content */}
                  <div className="flex-1 p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400/30 scrollbar-track-transparent">
                    {filteredEvents.length === 0 ? (
                      <div className="text-center py-12">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${column.bgGradient} mb-4`}>
                          <IconComponent size={24} className={column.color} />
                        </div>
                        <p className={`text-sm ${subtleColor}`}>Нет событий</p>
                      </div>
                    ) : (
                      filteredEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          isAdmin={isAdmin}
                          isEditable={isEditable}
                          onEdit={(e) => {
                            setSelectedEvent(e)
                            setIsModalOpen(true)
                          }}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </div>
                </div>
              )
            })}
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
