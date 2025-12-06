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
export type SlotFilter = 'all' | 'upcoming' | 'completed'

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

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)')
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches)
    }

    // Initial check
    handleChange(mediaQuery)

    const listener = (event: MediaQueryListEvent) => handleChange(event)
    mediaQuery.addEventListener('change', listener)

    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  useEffect(() => {
    if (isMobile && viewMode === 'table') {
      setViewMode('week')
    }
  }, [isMobile, viewMode])

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
        // If slot crosses midnight (has endDate), check endDate instead
        if (s.endDate) {
          const endDate = new Date(s.endDate)
          endDate.setHours(0, 0, 0, 0)
          
          // If endDate is in the future, slot is upcoming
          if (endDate > today) return true
          
          // If endDate is today, check if end time hasn't passed
          if (endDate.getTime() === today.getTime()) {
            const [endHour, endMin] = s.end.split(':').map(Number)
            const endTime = endHour * 60 + endMin
            return endTime > currentTime
          }
          
          return false
        }
        
        // Regular same-day slot
        const [endHour, endMin] = s.end.split(':').map(Number)
        const endTime = endHour * 60 + endMin
        return endTime > currentTime
      })
    }
    
    // Check if slot has endDate in the future
    const hasFutureEndDate = slot.slots.some((s: any) => {
      if (s.endDate) {
        const endDate = new Date(s.endDate)
        endDate.setHours(0, 0, 0, 0)
        return endDate >= today
      }
      return false
    })
    
    return hasFutureEndDate
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

  const cardBg = theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'
  const headingColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  const contentCardClass = `rounded-xl sm:rounded-2xl p-4 sm:p-5 border ${
    theme === 'dark'
      ? 'bg-[#0A0A0A]/40 border-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)]'
      : 'bg-white border-gray-200 shadow-[0_20px_60px_rgba(15,23,42,0.08)]'
  }`

  const handleViewModeChange = (mode: ViewMode) => {
    if (mode === 'table' && isMobile) {
      alert('Этот вид недоступен на мобильных устройствах. Пожалуйста, воспользуйтесь ПК.')
      return
    }
    setViewMode(mode)
  }

  return (
    <Layout>
      <div className="space-y-5 sm:space-y-7">
        {/* Hero */}
        <div className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 md:p-7 border-2 shadow-xl ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#0b0f17] via-[#111827] to-[#0b0f17] border-[#4E6E49]/30'
            : 'bg-gradient-to-br from-white via-green-50/40 to-white border-green-200'
        }`}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-16 w-72 h-72 bg-gradient-to-br from-[#4E6E49]/25 via-transparent to-transparent blur-3xl" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/20 via-purple-500/15 to-transparent blur-3xl" />
            <div className="absolute bottom-[-120px] left-10 w-72 h-72 bg-gradient-to-tr from-amber-400/15 via-[#4E6E49]/15 to-transparent blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg">
                <CalendarCheck className="w-7 h-7 text-[#4E6E49]" />
              </div>
              <div className="space-y-2">
                <h1 className={`text-3xl sm:text-4xl font-extrabold ${headingColor}`}>
                  Расписание команды
                </h1>
                <p className={`${labelColor} text-sm sm:text-base`}>
                  Быстрый контроль слотов, статусов дней и участников в одном окне.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#4E6E49]/15 text-[#4E6E49] border border-[#4E6E49]/30">
                    Неделя активна
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                    Быстрые действия
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              {[
                { label: 'Слотов', value: stats.slotsThisWeek, tone: 'from-[#4E6E49]/12 to-emerald-500/12 text-[#4E6E49]' },
                { label: 'Предстоящие', value: stats.upcomingSlots, tone: 'from-blue-500/12 to-indigo-500/12 text-blue-600' },
                { label: 'Завершено', value: stats.completedSlots, tone: 'from-gray-500/12 to-gray-700/12 text-gray-700' },
                { label: 'Участники', value: stats.activeMembers, tone: 'from-purple-500/12 to-pink-500/12 text-purple-600' },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-xl px-3 py-3 border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'} shadow-sm`}
                >
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className={`text-2xl font-extrabold bg-gradient-to-r ${item.tone} text-transparent bg-clip-text`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={`rounded-2xl border ${theme === 'dark' ? 'border-gray-800 bg-[#0f1623]' : 'border-gray-200 bg-white'} shadow-xl p-4 sm:p-5 space-y-4`}>
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <div className={`flex rounded-xl border ${theme === 'dark' ? 'border-gray-800 bg-gray-900/70' : 'border-gray-200 bg-gray-50'} overflow-hidden`}>
                <button
                  onClick={() => handleViewModeChange('table')}
                  aria-disabled={isMobile}
                  className={`px-3 sm:px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all ${
                    viewMode === 'table' && !isMobile
                      ? 'bg-[#4E6E49] text-white shadow-lg'
                      : isMobile
                      ? 'text-gray-400 cursor-not-allowed'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  <Table2 className="w-4 h-4" />
                  Таблица
                </button>
                <button
                  onClick={() => handleViewModeChange('week')}
                  className={`px-3 sm:px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all ${
                    viewMode === 'week'
                      ? 'bg-[#4E6E49] text-white shadow-lg'
                      : theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Неделя
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'Все', icon: <Calendar className="w-4 h-4" /> },
                  { key: 'upcoming', label: 'Предстоящие', icon: <Clock className="w-4 h-4" /> },
                  { key: 'completed', label: 'Завершённые', icon: <CalendarCheck className="w-4 h-4" /> },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setSlotFilter(f.key as SlotFilter)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border ${
                      slotFilter === f.key
                        ? 'bg-gradient-to-r from-[#4E6E49] to-emerald-600 text-white border-transparent shadow-lg'
                        : theme === 'dark'
                        ? 'border-gray-800 bg-gray-900/70 text-gray-200 hover:border-[#4E6E49]/40'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-[#4E6E49]/40'
                    }`}
                  >
                    {f.icon}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button
                onClick={handleAddSlot}
                className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white font-semibold shadow-lg hover:shadow-xl transition"
              >
                Добавить слот
              </button>
              <button
                onClick={handleDeleteSlots}
                className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
              >
                Удалить слоты
              </button>
              <div className="flex flex-1 lg:flex-none gap-2">
                <button
                  onClick={() => handleAddStatus('dayoff')}
                  className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold shadow hover:shadow-lg"
                >
                  Выходной
                </button>
                <button
                  onClick={() => handleAddStatus('sick')}
                  className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow hover:shadow-lg"
                >
                  Больничный
                </button>
                <button
                  onClick={() => handleAddStatus('vacation')}
                  className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow hover:shadow-lg"
                >
                  Отпуск
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className={`text-sm font-semibold ${headingColor}`}>Участники</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedUserId(null)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition ${
                  selectedUserId === null
                    ? 'bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white border-transparent shadow-lg'
                    : theme === 'dark'
                    ? 'bg-gray-900/70 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#4E6E49]/40'
                }`}
              >
                Все участники
              </button>
              {TEAM_MEMBERS.map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedUserId(member.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition flex items-center gap-2 ${
                    selectedUserId === member.id
                      ? 'bg-gradient-to-r from-[#4E6E49] to-[#4E6E49] text-white border-transparent shadow-lg'
                      : theme === 'dark'
                      ? 'bg-gray-900/70 border-gray-800 text-gray-200 hover:border-[#4E6E49]/40'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-[#4E6E49]/40'
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-[#4E6E49]/30 to-blue-500/30 text-xs font-bold">
                    {member.name.charAt(0)}
                  </span>
                  {member.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content view */}
        <div className={contentCardClass}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className={`text-sm sm:text-base font-semibold ${headingColor}`}>Расписание</p>
              <p className={`text-xs sm:text-sm ${labelColor}`}>Слоты и статусы за выбранную неделю</p>
            </div>
            {isMobile && (
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                Мобильный вид
              </span>
            )}
          </div>

          {viewMode === 'table' ? (
            isMobile ? (
              <div
                className={`rounded-lg border-2 border-dashed p-4 text-center ${theme === 'dark' ? 'bg-[#1a1a1a]/60 border-gray-800 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Table2 className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className="text-sm font-semibold">Табличный вид недоступен на мобильных устройствах</p>
                  <p className="text-xs">
                    Откройте ApeVault Panel на ПК, чтобы использовать таблицу.
                  </p>
                </div>
              </div>
            ) : (
              <ManagementTable
                selectedUserId={selectedUserId}
                slotFilter={slotFilter}
                onEditSlot={handleEditSlot}
                onEditStatus={handleEditStatus}
              />
            )
          ) : (
            <ManagementWeekView
              selectedUserId={selectedUserId}
              slotFilter={slotFilter}
              onEditSlot={handleEditSlot}
              onEditStatus={handleEditStatus}
            />
          )}
        </div>

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

