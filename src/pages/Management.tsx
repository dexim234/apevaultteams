// Management page - main component for managing slots, days off, sick leave, and vacation
import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useThemeStore } from '@/store/themeStore'
import { ManagementTable } from '@/components/Management/ManagementTable'
import { ManagementWeekView } from '@/components/Management/ManagementWeekView'
import { SlotForm } from '@/components/Management/SlotForm'
import { DayStatusForm } from '@/components/Management/DayStatusForm'
import { Calendar, Table2, Plus, Trash2, Users, Clock, CalendarCheck, Sparkles, Heart } from 'lucide-react'
import { TEAM_MEMBERS } from '@/types'
import { DeleteSlotsForm } from '@/components/Management/DeleteSlotsForm'
import { getWorkSlots, getDayStatuses } from '@/services/firestoreService'
import { getWeekDays, formatDate } from '@/utils/dateUtils'

type ViewMode = 'table' | 'week'
type SlotFilter = 'all' | 'upcoming' | 'completed'

export const Management = () => {
  const { theme } = useThemeStore()
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [slotFilter, setSlotFilter] = useState<SlotFilter>('all')
  const [showSlotForm, setShowSlotForm] = useState(false)
  const [showDeleteSlotsForm, setShowDeleteSlotsForm] = useState(false)
  const [showStatusForm, setShowStatusForm] = useState(false)
  const [statusType, setStatusType] = useState<'dayoff' | 'sick' | 'vacation' | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [editingSlot, setEditingSlot] = useState<any>(null)
  const [editingStatus, setEditingStatus] = useState<any>(null)
  const [stats, setStats] = useState({ 
    slotsThisWeek: 0, 
    activeMembers: 0,
    upcomingSlots: 0,
    completedSlots: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const isSlotUpcoming = (slot: any): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const slotDate = new Date(slot.date)
    slotDate.setHours(0, 0, 0, 0)
    
    // If slot date is in the future, it's upcoming
    if (slotDate > today) return true
    
    // If slot date is today, check if any slot time hasn't ended yet
    if (slotDate.getTime() === today.getTime()) {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes() // minutes since midnight
      
      // Check if any slot hasn't ended yet
      return slot.slots.some((s: any) => {
        const [endHour, endMin] = s.end.split(':').map(Number)
        const endTime = endHour * 60 + endMin
        return endTime > currentTime
      })
    }
    
    return false
  }

  const loadStats = async () => {
    try {
      const weekDays = getWeekDays(new Date())
      const weekStart = formatDate(weekDays[0], 'yyyy-MM-dd')
      const weekEnd = formatDate(weekDays[6], 'yyyy-MM-dd')
      
      const [allSlots, allStatuses] = await Promise.all([
        getWorkSlots(),
        getDayStatuses()
      ])

      const weekSlots = allSlots.filter((s) => s.date >= weekStart && s.date <= weekEnd)
      const uniqueMembers = new Set([...weekSlots.map(s => s.userId), ...allStatuses.map(s => s.userId)])

      // Calculate upcoming and completed slots
      const upcomingSlots = weekSlots.filter(isSlotUpcoming).length
      const completedSlots = weekSlots.length - upcomingSlots

      setStats({
        slotsThisWeek: weekSlots.length,
        activeMembers: uniqueMembers.size,
        upcomingSlots,
        completedSlots
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleAddSlot = () => {
    setEditingSlot(null)
    setShowSlotForm(true)
  }

  const handleEditSlot = (slot: any) => {
    setEditingSlot(slot)
    setShowSlotForm(true)
  }

  const handleAddStatus = (type: 'dayoff' | 'sick' | 'vacation') => {
    setStatusType(type)
    setEditingStatus(null)
    setShowStatusForm(true)
  }

  const handleEditStatus = (status: any) => {
    setEditingStatus(status)
    setStatusType(status.type)
    setShowStatusForm(true)
  }

  const handleDeleteSlots = () => {
    setShowDeleteSlotsForm(true)
  }

  const handleFormClose = () => {
    setShowSlotForm(false)
    setShowDeleteSlotsForm(false)
    setShowStatusForm(false)
    setStatusType(null)
    setEditingSlot(null)
    setEditingStatus(null)
    // Force reload after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white'
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with welcome message and stats */}
        <div className={`rounded-2xl p-6 ${cardBg} shadow-lg border-2 ${
          theme === 'dark' ? 'border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-800/90' : 'border-blue-200 bg-gradient-to-br from-white to-blue-50/30'
        }`}>
          <div className="relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/10 to-yellow-500/10 rounded-full blur-2xl -ml-24 -mb-24" />
            
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-4 rounded-2xl shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-500'
                } text-white transform transition-transform hover:scale-110`}>
                  <CalendarCheck className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className={`text-4xl font-extrabold bg-gradient-to-r ${
                      theme === 'dark' 
                        ? 'from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text' 
                        : 'from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text'
                    }`}>
                      Управление командой
                    </h1>
                    <Sparkles className={`w-6 h-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'} animate-pulse`} />
                  </div>
                  <p className={`${labelColor} text-base font-medium flex items-center gap-2`}>
                    <Heart className="w-5 h-5 text-red-500" />
                    Забота о каждом участнике нашей команды ApeVault
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-xl border-2 ${
              theme === 'dark' 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
                }`}>
                  <Clock className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div>
                  <p className={`text-sm ${labelColor}`}>Всего слотов</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {stats.slotsThisWeek}
                  </p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-xl border-2 ${
              theme === 'dark' 
                ? 'bg-blue-500/10 border-blue-500/30' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                }`}>
                  <Calendar className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <p className={`text-sm ${labelColor}`}>Предстоящих</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    {stats.upcomingSlots}
                  </p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-xl border-2 ${
              theme === 'dark' 
                ? 'bg-gray-500/10 border-gray-500/30' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-500/20' : 'bg-gray-100'
                }`}>
                  <CalendarCheck className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className={`text-sm ${labelColor}`}>Завершенных</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stats.completedSlots}
                  </p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-xl border-2 ${
              theme === 'dark' 
                ? 'bg-purple-500/10 border-purple-500/30' 
                : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
                }`}>
                  <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <p className={`text-sm ${labelColor}`}>Активных участников</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                    {stats.activeMembers}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Slot Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h2 className={`text-lg font-bold ${headingColor} flex items-center gap-2`}>
                <CalendarCheck className="w-5 h-5 text-green-500" />
                Фильтр слотов:
              </h2>
              <div className={`flex rounded-xl p-1.5 shadow-lg ${
                theme === 'dark' ? 'bg-gray-700/50 border-2 border-gray-600' : 'bg-gray-200/50 border-2 border-gray-300'
              }`}>
                <button
                  onClick={() => setSlotFilter('all')}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-300 text-sm font-semibold flex items-center gap-2 relative ${
                    slotFilter === 'all'
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50 scale-105'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-600/50 hover:text-white hover:scale-105'
                      : 'text-gray-700 hover:bg-gray-300 hover:text-gray-900 hover:scale-105'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Все
                  {slotFilter === 'all' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
                  )}
                </button>
                <button
                  onClick={() => setSlotFilter('upcoming')}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-300 text-sm font-semibold flex items-center gap-2 relative ${
                    slotFilter === 'upcoming'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-600/50 hover:text-white hover:scale-105'
                      : 'text-gray-700 hover:bg-gray-300 hover:text-gray-900 hover:scale-105'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Предстоящие
                  {slotFilter === 'upcoming' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse"></span>
                  )}
                </button>
                <button
                  onClick={() => setSlotFilter('completed')}
                  className={`px-5 py-2.5 rounded-lg transition-all duration-300 text-sm font-semibold flex items-center gap-2 relative ${
                    slotFilter === 'completed'
                      ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/50 scale-105'
                      : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-600/50 hover:text-white hover:scale-105'
                      : 'text-gray-700 hover:bg-gray-300 hover:text-gray-900 hover:scale-105'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  Завершенные
                  {slotFilter === 'completed' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className={`text-xl font-semibold ${headingColor}`}>Инструменты управления</h2>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* View mode toggle */}
                <div className={`flex rounded-xl p-1.5 w-full sm:w-auto shadow-inner ${
                  theme === 'dark' ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-200/50 border border-gray-300'
                }`}>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex-1 sm:flex-none px-4 py-2.5 text-sm sm:text-base rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
                      viewMode === 'table'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50 scale-105'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-600/50 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-300 hover:text-gray-900'
                    }`}
                  >
                    <Table2 className="w-4 h-4" />
                    Таблица
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`flex-1 sm:flex-none px-4 py-2.5 text-sm sm:text-base rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium ${
                      viewMode === 'week'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/50 scale-105'
                        : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-600/50 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-300 hover:text-gray-900'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Неделя
                  </button>
                </div>

              {/* Add buttons */}
              <button
                onClick={handleAddSlot}
                className="flex-1 sm:flex-none px-4 py-2.5 text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Добавить слот
              </button>

              <button
                onClick={handleDeleteSlots}
                className="flex-1 sm:flex-none px-4 py-2.5 text-sm sm:text-base bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105"
              >
                <Trash2 className="w-4 h-4" />
                Удалить слоты
              </button>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleAddStatus('dayoff')}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105"
                >
                  Выходной
                </button>
                <button
                  onClick={() => handleAddStatus('sick')}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
                >
                  Больничный
                </button>
                <button
                  onClick={() => handleAddStatus('vacation')}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
                >
                  Отпуск
                </button>
              </div>
              </div>
            </div>
          </div>

          {/* Participant filter */}
          <div className={`mt-6 pt-6 border-t-2 ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
            <label className={`block text-base font-bold mb-4 flex items-center gap-2 ${headingColor}`}>
              <Users className="w-5 h-5 text-green-500" />
              Фильтр по участникам
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedUserId(null)}
                className={`group relative px-5 py-3 rounded-xl transition-all duration-300 font-medium text-sm shadow-lg ${
                  selectedUserId === null
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/50 scale-105'
                    : theme === 'dark'
                    ? 'bg-gray-700/50 border-2 border-gray-600 text-gray-300 hover:bg-gray-600/70 hover:border-green-500/50 hover:text-white hover:scale-105'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-green-500/50 hover:text-green-600 hover:scale-105'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Все участники
                </span>
                {selectedUserId === null && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>
              {TEAM_MEMBERS.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedUserId(member.id)}
                  className={`group relative px-5 py-3 rounded-xl transition-all duration-300 font-medium text-sm shadow-lg flex items-center gap-3 ${
                    selectedUserId === member.id
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/50 scale-105 ring-2 ring-green-400/50'
                      : theme === 'dark'
                      ? 'bg-gray-700/50 border-2 border-gray-600 text-gray-300 hover:bg-gray-600/70 hover:border-green-500/50 hover:text-white hover:scale-105'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-green-500/50 hover:text-green-600 hover:scale-105'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className={`w-8 h-8 rounded-full object-cover border-2 transition-all duration-300 ${
                          selectedUserId === member.id
                            ? 'border-white ring-2 ring-white/50 scale-110'
                            : theme === 'dark'
                            ? 'border-gray-500 group-hover:border-green-400'
                            : 'border-gray-300 group-hover:border-green-400'
                        }`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const fallback = target.nextElementSibling as HTMLElement
                          if (fallback) fallback.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        selectedUserId === member.id
                          ? 'bg-white/20 text-white ring-2 ring-white/50 scale-110'
                          : theme === 'dark'
                          ? 'bg-gradient-to-br from-green-500/30 to-blue-500/30 text-gray-300 group-hover:from-green-500/50 group-hover:to-blue-500/50'
                          : 'bg-gradient-to-br from-green-400/30 to-blue-400/30 text-gray-600 group-hover:from-green-400/50 group-hover:to-blue-400/50'
                      } ${member.avatar ? 'absolute inset-0 hidden' : ''}`}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <span>{member.name}</span>
                  {selectedUserId === member.id && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Content view */}
        {viewMode === 'table' ? (
          <ManagementTable
            selectedUserId={selectedUserId}
            slotFilter={slotFilter}
            onEditSlot={handleEditSlot}
            onEditStatus={handleEditStatus}
          />
        ) : (
          <ManagementWeekView
            selectedUserId={selectedUserId}
            slotFilter={slotFilter}
            onEditSlot={handleEditSlot}
            onEditStatus={handleEditStatus}
          />
        )}

        {/* Forms */}
        {showSlotForm && (
          <SlotForm
            slot={editingSlot}
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )}

        {showDeleteSlotsForm && (
          <DeleteSlotsForm
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )}

        {showStatusForm && statusType && (
          <DayStatusForm
            type={statusType}
            status={editingStatus}
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )}
      </div>
    </Layout>
  )
}

