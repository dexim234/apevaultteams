import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useAdminStore } from '@/store/adminStore'
import { useThemeStore } from '@/store/themeStore'
import { useUsers } from '@/hooks/useUsers'
import { EventCard } from '@/components/Events/EventCard'
import { EventModal } from '@/components/Events/EventModal'
import { getEvents, deleteEvent } from '@/services/eventService'
import type { Event, EventCategory } from '@/types'
import { EVENT_CATEGORY_META } from '@/types'
import {
  Calendar,
  Plus,
  Filter,
  X,
  ChevronDown,
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
  const { users: allMembers } = useUsers()

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all')
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
    fetchEvents()
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-white`}>
              <Calendar size={24} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${textColor}`}>События</h1>
              <p className={`text-sm ${subtleColor}`}>Анонсы мероприятий и важные даты</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl border ${borderColor} transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
            >
              <Filter size={20} className={showFilters ? 'text-emerald-500' : subtleColor} />
            </button>

            {/* Create button - admin only */}
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                <Plus size={20} />
                Создать
              </button>
            )}
          </div>
        </div>

        {/* Filters panel */}
        <div className={`mb-6 p-4 rounded-xl border ${borderColor} ${cardBg} ${showFilters ? 'block' : 'hidden'}`}>
          <div className="flex flex-wrap items-center gap-4">
            {/* Category filter */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${subtleColor}`}>Категория:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    categoryFilter === 'all'
                      ? 'bg-emerald-500 text-white'
                      : theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        categoryFilter === cat
                          ? `bg-gradient-to-r ${meta.gradient} text-white`
                          : theme === 'dark' ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <IconComponent size={14} />
                      {meta.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* My events only */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMyOnly}
                  onChange={(e) => setShowMyOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className={`text-sm font-medium ${subtleColor}`}>Только мои события</span>
              </label>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${subtleColor}`}>Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'created')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${borderColor} ${
                  theme === 'dark' ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-900'
                }`}
              >
                <option value="date">По дате</option>
                <option value="created">По созданию</option>
              </select>
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
                expanded={expandedId === event.id}
                onToggleExpand={() => setExpandedId(expandedId === event.id ? null : event.id)}
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
