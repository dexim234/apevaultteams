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
  Clock,
  Users,
  TrendingUp,
  Gift,
  Image,
  Shield,
  Coins,
  Rocket,
  BarChart3,
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

export const EventsPage = () => {
  const { user } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const { theme } = useThemeStore()
  // allMembers is available via useUsers but not used directly in this component
  // const { users: allMembers } = useUsers()

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'past'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showMyOnly, setShowMyOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'created'>('date')

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

  const filteredEvents = useMemo(() => {
    let result = [...events]

    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter(e => e.category === categoryFilter)
    }

    // Filter by user's participation
    if (showMyOnly && user) {
      result = result.filter(e => e.requiredParticipants.includes(user.id))
    }

    // Filter by status
    const now = new Date()
    const currentDate = now.toISOString().split('T')[0]
    const currentTime = now.toTimeString().slice(0, 5)

    if (statusFilter !== 'all') {
      result = result.filter(e => {
        const isOngoing = e.dates.includes(currentDate) && e.time <= currentTime

        // Refined past logic: if all dates are in the past, OR it's today but the time has passed and it's not "ongoing"
        const allDatesPast = e.dates.every(d => d < currentDate)
        const isToday = e.dates.includes(currentDate)
        const isPastToday = isToday && e.time < currentTime

        const upcomingDates = e.dates.filter(d => d > currentDate)
        const isUpcoming = upcomingDates.length > 0 || (isToday && e.time > currentTime)

        if (statusFilter === 'ongoing') return isOngoing
        if (statusFilter === 'past') return allDatesPast || (isPastToday && !isOngoing)
        if (statusFilter === 'upcoming') return isUpcoming
        return true
      })
    }

    // Sort
    if (sortBy === 'date') {
      result.sort((a, b) => {
        const aDates = a.dates.sort()
        const bDates = b.dates.sort()
        const aNext = aDates[0]
        const bNext = bDates[0]
        return aNext.localeCompare(bNext)
      })
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [events, categoryFilter, showMyOnly, sortBy, user])

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Удалить это событие?')) return
    try {
      await deleteEvent(eventId)
      setEvents(prev => prev.filter(e => e.id !== eventId))
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
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
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl border ${borderColor} transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'} ${showFilters ? 'bg-emerald-500/10 border-emerald-500/30' : ''}`}
            >
              <Filter size={20} className={showFilters ? 'text-emerald-500' : subtleColor} />
            </button>

            {/* Create button - admin only */}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Status filter */}
              <div className="space-y-3">
                <span className={`text-xs font-black uppercase tracking-widest ${subtleColor}`}>По статусу</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'Все' },
                    { id: 'upcoming', label: 'Предстоящие' },
                    { id: 'ongoing', label: 'Идущие' },
                    { id: 'past', label: 'Прошедшие' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatusFilter(s.id as any)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${statusFilter === s.id
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                        : theme === 'dark' ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort and My events */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 sm:col-span-2">
                <div className="space-y-3 flex-1 w-full">
                  <span className={`text-xs font-black uppercase tracking-widest ${subtleColor}`}>Сортировать</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'created')}
                    className={`w-full min-w-[200px] px-4 py-2 rounded-xl text-sm font-bold border ${borderColor} focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-900'
                      }`}
                  >
                    <option value="date">По ближайшей дате</option>
                    <option value="created">По дате создания</option>
                  </select>
                </div>

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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-xl border ${borderColor} ${cardBg}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Calendar size={18} className="text-emerald-500" />
              </div>
              <span className={`text-sm ${subtleColor}`}>Всего событий</span>
            </div>
            <p className={`text-2xl font-bold ${textColor}`}>{events.length}</p>
          </div>
          <div className={`p-4 rounded-xl border ${borderColor} ${cardBg}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock size={18} className="text-blue-500" />
              </div>
              <span className={`text-sm ${subtleColor}`}>Предстоящих</span>
            </div>
            <p className={`text-2xl font-bold ${textColor}`}>
              {events.filter(e => e.dates.some(d => d >= new Date().toISOString().split('T')[0])).length}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${borderColor} ${cardBg}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Users size={18} className="text-purple-500" />
              </div>
              <span className={`text-sm ${subtleColor}`}>С участием</span>
            </div>
            <p className={`text-2xl font-bold ${textColor}`}>
              {events.filter(e => user && e.requiredParticipants.includes(user.id)).length}
            </p>
          </div>
        </div>

        {/* Events list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className={`text-center py-20 ${cardBg} rounded-xl border ${borderColor}`}>
            <Calendar size={48} className={`mx-auto mb-4 ${subtleColor}`} />
            <h3 className={`text-lg font-semibold ${textColor} mb-2`}>Событий не найдено</h3>
            <p className={`text-sm ${subtleColor}`}>
              {categoryFilter !== 'all' || showMyOnly
                ? 'Попробуйте изменить фильтры'
                : 'Создайте первое событие'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
